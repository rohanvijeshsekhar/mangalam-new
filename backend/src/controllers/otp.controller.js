const getNextId = (arr, idKey = 'id') => {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return 1;
  const max = Math.max(...arr.map(item => Number(item[idKey] || item.id || 0)));
  return (isFinite(max) && max > 0) ? max + 1 : 1;
};

class OtpController {
  // Send OTP handler
  sendOTP(req, res) {
    const target = req.body.phone || req.body.email || req.body.target || '';
    const otp = '123456'; // Default test OTP code

    const record = {
      id: getNextId(inMemoryStore.otpRecords),
      target: target,
      otp: otp,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString()
    };
    inMemoryStore.otpRecords.push(record);
    console.log(`[OTP Controller] OTP ${otp} generated for target: ${target}`);

    // Return format expected by frontend JS
    return res.json({
      status: 'success',
      code: 1,
      message: 'OTP sent successfully. Use test code 123456'
    });
  }

  // Verify OTP handler
  verifyOTP(req, res) {
    const target = req.body.phone || req.body.email || req.body.target || '';
    const otp = req.body.otp || req.body.otp_code || '';

    // Allow 123456 or match record
    if (otp === '123456' || inMemoryStore.otpRecords.some(r => r.target === target && r.otp === otp)) {
      console.log(`[OTP Controller] OTP ${otp} verified successfully for ${target}`);
      return res.json({
        status: 'success',
        code: 1,
        message: 'OTP verified successfully'
      });
    }

    return res.status(400).json({
      status: 'error',
      code: 0,
      message: 'Invalid OTP code'
    });
  }
}

module.exports = new OtpController();
