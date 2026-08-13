const express = require('express');
const http    = require('http');
const https   = require('https');
const router  = express.Router();

// Temporary in-memory OTP store: { [phone]: { otp, expiresAt } }
const otpStore = new Map();

// Clean phone number (remove spaces, +, etc.)
const sanitizePhone = p => String(p || '').replace(/[^0-9]/g, '');

// POST /api/otp/send — Generate & Send OTP via Sangamam SMS Gateway
router.post('/send', async (req, res) => {
  const { phone } = req.body;
  const cleanPhone = sanitizePhone(phone);

  if (!cleanPhone || cleanPhone.length < 10) {
    return res.status(400).json({ status: 0, message: 'Invalid phone number.' });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // Expires in 5 minutes

  otpStore.set(cleanPhone, { otp, expiresAt });

  // Read Sangamam SMS credentials from .env
  const apiKey     = process.env.SANGAMAM_API_KEY;
  const senderId   = process.env.SANGAMAM_SENDER_ID || 'SANGAM';
  const templateId = process.env.SANGAMAM_TEMPLATE_ID;
  const gatewayUrl = process.env.SANGAMAM_SMS_URL || 'http://sangamam.net/api/send_sms.php';

  const msgText = `Your OTP for verification at Mangalam Travels is ${otp}. Valid for 5 minutes.`;

  if (apiKey) {
    // Send SMS via Sangamam SMS Gateway
    try {
      const url = new URL(gatewayUrl);
      url.searchParams.append('apikey', apiKey);
      url.searchParams.append('sender', senderId);
      url.searchParams.append('mobile', cleanPhone);
      url.searchParams.append('message', msgText);
      if (templateId) url.searchParams.append('template_id', templateId);

      const client = url.protocol === 'https:' ? https : http;
      client.get(url.toString(), (smsRes) => {
        let body = '';
        smsRes.on('data', chunk => body += chunk);
        smsRes.on('end', () => {
          console.log(`📱 Sangamam SMS sent to ${cleanPhone}. Response:`, body);
        });
      }).on('error', err => {
        console.error('Sangamam SMS gateway error:', err);
      });
    } catch (e) {
      console.error('Sangamam URL build error:', e);
    }
  } else {
    // Development fallback (log OTP in console)
    console.log(`🔑 [DEMO OTP MODE] OTP for ${cleanPhone} is: ${otp}`);
  }

  res.json({
    status: 1,
    message: 'OTP sent successfully to ' + phone,
    // In dev mode without API key, return OTP for easy testing
    ...(apiKey ? {} : { demo_otp: otp })
  });
});

// POST /api/otp/verify — Verify user entered OTP
router.post('/verify', (req, res) => {
  const { phone, otp } = req.body;
  const cleanPhone = sanitizePhone(phone);
  const userOtp = String(otp || '').trim();

  if (!cleanPhone || !userOtp) {
    return res.status(400).json({ status: 0, message: 'Phone number and OTP are required.' });
  }

  const record = otpStore.get(cleanPhone);
  if (!record) {
    return res.status(400).json({ status: 0, message: 'OTP expired or not requested. Please click Send OTP.' });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(cleanPhone);
    return res.status(400).json({ status: 0, message: 'OTP has expired. Please request a new OTP.' });
  }

  if (record.otp === userOtp) {
    otpStore.delete(cleanPhone); // Single-use OTP
    return res.json({ status: 1, message: 'Phone number verified successfully!' });
  }

  return res.status(400).json({ status: 0, message: 'Incorrect OTP. Please check and try again.' });
});

module.exports = router;
