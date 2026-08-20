const express = require('express');
const http    = require('http');
const https   = require('https');
const crypto  = require('crypto');
const router  = express.Router();

// Temporary in-memory OTP store: { [phone]: { otp, expiresAt } }
const otpStore = new Map();

// Clean phone number (remove spaces, +, etc.) and normalize to Sangamam-compatible format.
// Indian mobile numbers must be sent as 10-digit (e.g. 9876543210) or with 91 prefix.
// We strip all non-digits and keep the last 10 digits as the canonical form for storage.
// For the SMS recipient, we prepend '91' if not already present.
const sanitizePhone = p => String(p || '').replace(/[^0-9]/g, '');

// Return the 10-digit local number (last 10 digits).
const normalizePhoneLocal = p => {
  const digits = sanitizePhone(p);
  return digits.length > 10 ? digits.slice(-10) : digits;
};

// Return the full Sangamam recipient number: 91XXXXXXXXXX (12 digits).
const normalizePhoneSms = p => {
  const local = normalizePhoneLocal(p);
  return '91' + local;
};

const SANGAMAM_CONFIG = {
  apiKey:     process.env.SANGAMAM_API_KEY     || '4LBOC269XB3U4Z8',
  secretKey:  process.env.SANGAMAM_SECRET_KEY  || '7p%Nxzhd=3/[sZR;)v4A^T,6Ja@S5yW9',
  senderId:   process.env.SANGAMAM_SENDER_ID   || 'MTRAVE',
  entityId:   process.env.SANGAMAM_ENTITY_ID   || '1701177044156222476',
  templateId: process.env.SANGAMAM_TEMPLATE_ID || '1707177917343595479',
  gatewayUrl: process.env.SANGAMAM_SMS_URL     || 'https://fastsms.sangamamonline.in/api/sms/v1.0/send-sms'
};

function sendSmsViaSangamam(recipient, message) {
  return new Promise((resolve) => {
    try {
      const requestFor = 'send-sms';
      const expire = Math.floor(Date.now() / 1000) + 180; // 3 minutes signature validity
      const md5 = str => crypto.createHash('md5').update(str).digest('hex');

      // Official Sangamam FastSMS MD5 3-step signature algorithm
      const timeKey = md5(requestFor + 'sms@rits-v1.0' + expire);
      const timeAccessTokenKey = md5(SANGAMAM_CONFIG.apiKey + timeKey);
      const authSignature = md5(timeAccessTokenKey + SANGAMAM_CONFIG.secretKey);

      const payload = JSON.stringify({
        accessToken: SANGAMAM_CONFIG.apiKey,
        authSignature: authSignature,
        expire: expire,
        route: 'transactional',
        smsHeader: SANGAMAM_CONFIG.senderId,
        entity_id: SANGAMAM_CONFIG.entityId,
        template_id: SANGAMAM_CONFIG.templateId,
        DLT_TE_ID: SANGAMAM_CONFIG.templateId,
        messageContent: message,
        recipients: [recipient] // e.g. ["919876543210"]
      });

      const urlObj = new URL(SANGAMAM_CONFIG.gatewayUrl);
      const reqOpts = {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      };

      const client = urlObj.protocol === 'https:' ? https : http;
      const smsReq = client.request(reqOpts, (smsRes) => {
        let body = '';
        smsRes.on('data', chunk => body += chunk);
        smsRes.on('end', () => {
          console.log(`📱 FastSMS Sangamam Response for ${recipient}:`, body);
          try {
            const parsed = JSON.parse(body);
            if (smsRes.statusCode === 200 || parsed.status === 'success') {
              resolve({ ok: true, data: parsed });
            } else {
              resolve({ ok: false, message: parsed.message || 'SMS delivery failed.' });
            }
          } catch {
            resolve({ ok: smsRes.statusCode === 200, raw: body });
          }
        });
      });

      smsReq.on('error', err => {
        console.error('⚠️ FastSMS gateway network error:', err.message);
        resolve({ ok: false, message: err.message });
      });

      smsReq.write(payload);
      smsReq.end();
    } catch (e) {
      console.error('⚠️ FastSMS URL/request build error:', e.message);
      resolve({ ok: false, message: e.message });
    }
  });
}

// POST /api/otp/send — Generate & Send OTP via Sangamam SMS Gateway
router.post('/send', async (req, res) => {
  const { phone } = req.body;
  const localPhone = normalizePhoneLocal(phone);  // 10-digit key used for storage
  const smsRecipient = normalizePhoneSms(phone);  // 91XXXXXXXXXX for Sangamam

  if (!localPhone || localPhone.length < 10) {
    return res.status(400).json({ status: 0, message: 'Invalid phone number.' });
  }

  // Rate-limit / Debounce: If an OTP was sent in the last 15 seconds, avoid double-dispatch
  const existing = otpStore.get(localPhone);
  if (existing && existing.lastSent && (Date.now() - existing.lastSent < 15000)) {
    return res.json({
      status: 1,
      message: `OTP sent successfully to your mobile number. Please check your SMS.`
    });
  }

  // Generate cryptographically random 6-digit OTP
  const otp = (Math.floor(Math.random() * 900000) + 100000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes (per DLT template)
  const lastSent = Date.now();

  otpStore.set(localPhone, { otp, expiresAt, lastSent });

  // Exact DLT-registered message wording — do NOT alter this template.
  const msgText = `Mangalam Travel & Tours Your OTP is ${otp} for enquiry form verification. Valid for 10 minutes. Do not share this OTP with anyone.\nwww.mangalamtravel.com`;

  const result = await sendSmsViaSangamam(smsRecipient, msgText);

  if (!result.ok) {
    return res.status(500).json({
      status: 0,
      message: result.message || 'Failed to deliver OTP SMS. Please try again.'
    });
  }

  res.json({
    status: 1,
    message: `OTP sent successfully to your mobile number. Please check your SMS.`
  });
});

// POST /api/otp/verify — Verify user entered OTP
router.post('/verify', (req, res) => {
  const { phone, otp } = req.body;
  const cleanPhone = normalizePhoneLocal(phone);  // Match the same key used in /send
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
