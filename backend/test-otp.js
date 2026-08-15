/**
 * Extended signature test - tries base64 and other encoding variants
 */
require('dotenv').config();
const https  = require('https');
const crypto = require('crypto');

const apiKey    = process.env.SANGAMAM_API_KEY;
const secretKey = process.env.SANGAMAM_SECRET_KEY;
const senderId  = process.env.SANGAMAM_SENDER_ID;
const entityId  = process.env.SANGAMAM_ENTITY_ID;
const templateId= process.env.SANGAMAM_TEMPLATE_ID;
const gatewayUrl= process.env.SANGAMAM_SMS_URL;

const expire = Math.floor(Date.now() / 1000) + 600;
const mobile = '919999999999';
const otp = '123456';
const message = `Mangalam Travel & Tours Your OTP is ${otp} for enquiry form verification. Valid for 10 minutes. Do not share this OTP with anyone.\nwww.mangalamtravel.com`;

// b64 encode helper
const b64 = s => Buffer.from(s).toString('base64');

console.log('\n=== Extended Signature Test ===');
console.log('apiKey:', apiKey);
console.log('secretKey:', secretKey);
console.log('b64(secretKey):', b64(secretKey));
console.log('b64(apiKey):', b64(apiKey));
console.log('expire:', expire);

const variants = [
  // Base64 variants  
  { name: 'b64(secretKey)',                             sig: b64(secretKey) },
  { name: 'b64(apiKey+secretKey)',                      sig: b64(apiKey + secretKey) },
  { name: 'b64(secretKey+apiKey)',                      sig: b64(secretKey + apiKey) },
  { name: 'b64(apiKey+expire)',                         sig: b64(apiKey + expire) },
  { name: 'b64(secretKey+expire)',                      sig: b64(secretKey + expire) },
  // HMAC with base64 output
  { name: 'HMAC-SHA256(secretKey, apiKey+expire) b64', sig: crypto.createHmac('sha256', secretKey).update(apiKey + String(expire)).digest('base64') },
  { name: 'HMAC-SHA256(secretKey, expire+apiKey) b64', sig: crypto.createHmac('sha256', secretKey).update(String(expire) + apiKey).digest('base64') },
  // Secret key itself as signature  
  { name: 'secretKey as authSignature directly',        sig: secretKey },
  // HMAC with string expire
  { name: 'HMAC-SHA256(secretKey, str(expire))',        sig: crypto.createHmac('sha256', secretKey).update(String(expire)).digest('hex') },
  { name: 'HMAC-SHA256(secretKey, apiKey)',             sig: crypto.createHmac('sha256', secretKey).update(apiKey).digest('hex') },
  // Different key order, base64 secret as key
  { name: 'HMAC-SHA256(b64(secretKey), apiKey+expire)', sig: crypto.createHmac('sha256', b64(secretKey)).update(apiKey + String(expire)).digest('hex') },
];

function sendRequest(variant, idx) {
  return new Promise(resolve => {
    const payload = {
      accessToken: apiKey,
      authSignature: variant.sig,
      expire,
      mobile,
      mobiles: mobile,
      sender: senderId,
      senderid: senderId,
      entity_id: entityId,
      pe_id: entityId,
      template_id: templateId,
      DLT_TE_ID: templateId,
      message
    };

    const body = JSON.stringify(payload);
    const urlObj = new URL(gatewayUrl);

    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        const ok = !data.includes('"failed"') && res.statusCode !== 401;
        const icon = ok ? '✅' : '❌';
        console.log(`\n${icon} [${idx}] ${variant.name}`);
        console.log(`   Sig value: ${variant.sig.substring(0,40)}`);
        console.log(`   HTTP ${res.statusCode}: ${data.substring(0,120)}`);
        resolve({ idx, name: variant.name, status: res.statusCode, body: data, ok });
      });
    });
    req.on('error', e => {
      console.log(`[${idx}] ERROR: ${e.message}`);
      resolve({ idx, error: e.message, ok: false });
    });
    req.write(body);
    req.end();
  });
}

(async () => {
  for (let i = 0; i < variants.length; i++) {
    const r = await sendRequest(variants[i], i);
    if (r.ok) {
      console.log('\n\n🎉 FOUND WORKING SIGNATURE!');
      console.log(`Formula: ${r.name}`);
      process.exit(0);
    }
  }
  console.log('\n\n❌ All variants failed. The API key or secret may need to be regenerated from the dashboard.');
})();
