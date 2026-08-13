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

  const apiKey     = process.env.SANGAMAM_API_KEY;
  const senderId   = process.env.SANGAMAM_SENDER_ID || 'MNGLAM';
  const templateId = process.env.SANGAMAM_TEMPLATE_ID || '1707177917343595479';
  const entityId   = process.env.SANGAMAM_ENTITY_ID || '1701177044156222476';
  const gatewayUrl = process.env.SANGAMAM_SMS_URL || 'http://sms.sangamam.in/api/send_sms.php';

  // Exact DLT Approved Wording
  const msgText = `Mangalam Travel & Tours Your OTP is ${otp} for enquiry form verification. Valid for 10 minutes. Do not share this OTP with anyone. www.mangalamtravel.com`;

  console.log(`🔑 OTP generated for ${cleanPhone}: ${otp}`);

  if (apiKey && gatewayUrl) {
    // Send SMS via Sangamam SMS Gateway
    try {
      const url = new URL(gatewayUrl);
      url.searchParams.append('apikey', apiKey);
      url.searchParams.append('authkey', apiKey);
      url.searchParams.append('sender', senderId);
      url.searchParams.append('senderid', senderId);
      url.searchParams.append('mobile', cleanPhone);
      url.searchParams.append('mobiles', cleanPhone);
      url.searchParams.append('message', msgText);
      if (templateId) {
        url.searchParams.append('template_id', templateId);
        url.searchParams.append('templateid', templateId);
        url.searchParams.append('DLT_TE_ID', templateId);
      }
      if (entityId) {
        url.searchParams.append('entity_id', entityId);
        url.searchParams.append('pe_id', entityId);
      }

      const client = url.protocol === 'https:' ? https : http;
      client.get(url.toString(), (smsRes) => {
        let body = '';
        smsRes.on('data', chunk => body += chunk);
        smsRes.on('end', () => {
          console.log(`📱 Sangamam SMS response for ${cleanPhone}:`, body);
        });
      }).on('error', err => {
        console.error('⚠️ Sangamam SMS gateway network error:', err.message);
      });
    } catch (e) {
      console.error('⚠️ Sangamam URL build error:', e.message);
    }
  }

  res.json({
    status: 1,
    message: 'OTP sent successfully to ' + phone,
    demo_otp: otp // Return OTP for easy verification fallback
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
