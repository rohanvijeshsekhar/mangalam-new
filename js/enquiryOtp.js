(function (global) {
    'use strict';

    function normalizePhone(phone) {
        const digits = String(phone || '').replace(/\D/g, '');
        return digits.length > 10 ? digits.slice(-10) : digits;
    }

    function isValidPhone(phone) {
        return normalizePhone(phone).length >= 10;
    }

    async function postData(path, body) {
        if (global.MT && typeof global.MT.apiPost === 'function') {
            return await global.MT.apiPost(path, body);
        }
        try {
            const res = await fetch(path, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const text = await res.text();
            try { return JSON.parse(text); } catch { return text; }
        } catch (err) {
            console.error('[EnquiryOtp] Fetch error:', err);
            return null;
        }
    }

    function createEnquiryOtp(options) {
        const { phoneInput, sendBtn, verifyBtn, otpInput, otpContainer, statusMsg } = options;
        let verified = false;
        let timerInterval = null;
        let verifying = false;
        let sending = false;
        let sendRequestId = 0;

        function getPhone() {
            return phoneInput ? phoneInput.value.trim() : '';
        }

        function setStatus(text, type) {
            if (!statusMsg) return;
            statusMsg.textContent = text;
            statusMsg.classList.remove('hidden', 'text-green-600', 'text-red-600', 'text-gray-600');
            statusMsg.classList.add(type === 'success' ? 'text-green-600' : type === 'error' ? 'text-red-600' : 'text-gray-600');
            statusMsg.style.display = 'block';
        }

        function startCooldown(seconds) {
            if (!sendBtn) return;
            let timeLeft = seconds;
            sendBtn.disabled = true;
            sendBtn.textContent = `Resend in ${timeLeft}s`;
            if (timerInterval) clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                timeLeft -= 1;
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    sendBtn.disabled = false;
                    sendBtn.textContent = 'Resend OTP';
                } else {
                    sendBtn.textContent = `Resend in ${timeLeft}s`;
                }
            }, 1000);
        }

        function getFormEmail() {
            const form = phoneInput ? phoneInput.closest('form') : null;
            const emailEl = (form ? form.querySelector('input[type="email"]') : null) ||
                            document.getElementById('other-email') ||
                            document.getElementById('contact-email') ||
                            document.getElementById('email') ||
                            document.querySelector('input[type="email"]');
            return emailEl && emailEl.value.trim() ? emailEl.value.trim() : '';
        }

        function markVerified() {
            verified = true;
            if (phoneInput) {
                phoneInput.readOnly = true;
                phoneInput.classList.add('bg-gray-100', 'cursor-not-allowed');
            }
            if (otpInput) otpInput.disabled = true;
            if (sendBtn) sendBtn.classList.add('hidden');
            if (verifyBtn) verifyBtn.classList.add('hidden');
            setStatus('Mobile number verified successfully.', 'success');
        }

        function reset() {
            verified = false;
            verifying = false;
            sending = false;
            if (timerInterval) clearInterval(timerInterval);
            if (phoneInput) {
                phoneInput.readOnly = false;
                phoneInput.classList.remove('bg-gray-100', 'cursor-not-allowed');
            }
            if (otpInput) {
                otpInput.value = '';
                otpInput.disabled = false;
            }
            if (sendBtn) {
                sendBtn.disabled = false;
                sendBtn.textContent = 'Send OTP';
                sendBtn.classList.remove('hidden');
            }
            if (verifyBtn) verifyBtn.classList.remove('hidden');
            if (otpContainer) {
                otpContainer.classList.add('hidden');
                otpContainer.style.display = 'none';
            }
            if (statusMsg) {
                statusMsg.textContent = '';
                statusMsg.classList.add('hidden');
                statusMsg.style.display = 'none';
            }
        }

        async function sendOtp() {
            if (sending) return;

            const phone = getPhone();
            if (!isValidPhone(phone)) {
                alert('Please enter a valid 10-digit mobile number.');
                if (phoneInput) phoneInput.focus();
                return;
            }

            const email = getFormEmail();
            if (global.SMS_OTP_EMAIL_REQUIRED) {
                if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    alert('Please enter your email address first.');
                    const emailEl = (phoneInput && phoneInput.closest('form')
                        ? phoneInput.closest('form').querySelector('input[type="email"]')
                        : null) || document.getElementById('other-email') || document.getElementById('contact-email');
                    if (emailEl) emailEl.focus();
                    return;
                }
            }

            sending = true;
            const requestId = ++sendRequestId;

            if (sendBtn) {
                sendBtn.disabled = true;
                sendBtn.textContent = 'Sending...';
            }

            try {
                const data = await postData('/api/otp/send', { phone: normalizePhone(phone), email });
                if (requestId !== sendRequestId) return;

                if (data && (data.status === 1 || data.success)) {
                    verified = false;
                    if (otpContainer) {
                        otpContainer.classList.remove('hidden');
                        otpContainer.style.display = 'block';
                    }
                    if (otpInput) {
                        otpInput.value = '';
                        otpInput.focus();
                    }
                    const successMsg = data.message || 'OTP sent to your mobile number. Please check your SMS.';
                    setStatus(successMsg, 'success');
                    startCooldown(30);
                } else {
                    const errMsg = (data && data.message) || 'Failed to send OTP. Please check your number.';
                    setStatus(errMsg, 'error');
                    alert(errMsg);
                    if (sendBtn) {
                        sendBtn.disabled = false;
                        sendBtn.textContent = 'Send OTP';
                    }
                }
            } catch (err) {
                if (requestId !== sendRequestId) return;
                const errMsg = 'Failed to send OTP. Please try again.';
                setStatus(errMsg, 'error');
                alert(errMsg);
                if (sendBtn) {
                    sendBtn.disabled = false;
                    sendBtn.textContent = 'Send OTP';
                }
            } finally {
                if (requestId === sendRequestId) {
                    sending = false;
                }
            }
        }

        async function verifyOtp() {
            if (verifying || verified) return;

            const otp = otpInput ? otpInput.value.replace(/\D/g, '') : '';
            if (!isValidPhone(getPhone()) || otp.length < 4) {
                alert('Please enter your 6-digit OTP received via SMS.');
                if (otpInput) otpInput.focus();
                return;
            }

            verifying = true;
            if (verifyBtn) {
                verifyBtn.disabled = true;
                verifyBtn.textContent = 'Verifying...';
            }

            try {
                const data = await postData('/api/otp/verify', { phone: normalizePhone(getPhone()), otp });

                if (data && (data.status === 1 || data.success)) {
                    markVerified();
                } else {
                    const errMsg = (data && data.message) || 'Invalid OTP. Please check and try again.';
                    setStatus(errMsg, 'error');
                    alert(errMsg);
                }
            } catch (err) {
                const errMsg = 'Verification failed. Please try again.';
                setStatus(errMsg, 'error');
                alert(errMsg);
            } finally {
                verifying = false;
                if (verifyBtn && !verified) {
                    verifyBtn.disabled = false;
                    verifyBtn.textContent = 'Verify';
                }
            }
        }

        function requireVerified() {
            if (!isValidPhone(getPhone())) {
                alert('Please enter a valid 10-digit mobile number.');
                if (phoneInput) phoneInput.focus();
                return false;
            }
            if (!verified) {
                alert('Please verify your mobile number with OTP before submitting.');
                if (otpContainer && !otpContainer.classList.contains('hidden') && otpInput) {
                    otpInput.focus();
                } else if (sendBtn) {
                    sendBtn.focus();
                }
                return false;
            }
            return true;
        }

        if (sendBtn) {
            sendBtn.removeEventListener('click', sendOtp);
            sendBtn.addEventListener('click', sendOtp);
        }
        if (verifyBtn) {
            verifyBtn.removeEventListener('click', verifyOtp);
            verifyBtn.addEventListener('click', verifyOtp);
        }
        if (phoneInput) {
            phoneInput.addEventListener('input', () => { if (verified) reset(); });
        }

        return { requireVerified, reset, isVerified: () => verified, getPhone, sendOtp, markVerified };
    }

    const PREFIX_CONFIG = {
        contact:       { phone: 'contact-phone',   send: 'contact-sendOtpBtn',   verify: 'contact-verifyOtpBtn',   otp: 'contact-otp',   container: 'contact-otpFieldContainer',   status: 'contact-otpStatusMsg' },
        customizetrip: { phone: 'contact-phone',   send: 'contact-sendOtpBtn',   verify: 'contact-verifyOtpBtn',   otp: 'contact-otp',   container: 'contact-otpFieldContainer',   status: 'contact-otpStatusMsg' },
        career:        { phone: 'career-phone',    send: 'career-sendOtpBtn',    verify: 'career-verifyOtpBtn',    otp: 'career-otp',    container: 'career-otpFieldContainer',    status: 'career-otpStatusMsg' },
        cart:          { phone: 'enq-phone',       send: 'cart-sendOtpBtn',      verify: 'cart-verifyOtpBtn',      otp: 'cart-otp',      container: 'cart-otpFieldContainer',      status: 'cart-otpStatusMsg' },
        other:         { phone: 'other-phone',     send: 'other-sendOtpBtn',     verify: 'other-verifyOtpBtn',     otp: 'other-otp',     container: 'other-otpFieldContainer',     status: 'other-otpStatusMsg' },
        package:       { phone: 'package-phone',   send: 'package-sendOtpBtn',   verify: 'package-verifyOtpBtn',   otp: 'package-otp',   container: 'package-otpFieldContainer',   status: 'package-otpStatusMsg' },
        customize:     { phone: 'customizePhone',  send: 'sendOtpBtn',           verify: 'verifyOtpBtn',           otp: 'customizeOtp',  container: 'otpFieldContainer',           status: 'otpStatusMsg' },
    };

    const boundInstances = {};

    function bindByPrefix(prefix) {
        if (boundInstances[prefix]) {
            return boundInstances[prefix];
        }

        const cfg = PREFIX_CONFIG[prefix];
        if (!cfg) return null;
        const phoneInput = document.getElementById(cfg.phone);
        const sendBtn = document.getElementById(cfg.send);
        if (!phoneInput || !sendBtn) return null;

        boundInstances[prefix] = createEnquiryOtp({
            phoneInput,
            sendBtn,
            verifyBtn: document.getElementById(cfg.verify),
            otpInput: document.getElementById(cfg.otp),
            otpContainer: document.getElementById(cfg.container),
            statusMsg: document.getElementById(cfg.status),
        });

        return boundInstances[prefix];
    }

    function initEnquiryOtps() {
        Object.keys(PREFIX_CONFIG).forEach((prefix) => bindByPrefix(prefix));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEnquiryOtps);
    } else {
        initEnquiryOtps();
    }

    global.EnquiryOtp = {
        bindByPrefix,
        init: initEnquiryOtps,
        getInstance(prefix) {
            if (!boundInstances[prefix]) boundInstances[prefix] = bindByPrefix(prefix);
            return boundInstances[prefix];
        },
        normalizePhone,
        isValidPhone,
    };
})(window);
