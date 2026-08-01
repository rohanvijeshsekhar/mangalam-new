<?php
function renderEnquiryOtpFields($prefix, $inputClass = '')
{
    $inputClass = htmlspecialchars($inputClass, ENT_QUOTES, 'UTF-8');
    $prefix = preg_replace('/[^a-z0-9_-]/i', '', $prefix);
    ?>
    <div class="enquiry-otp-block mt-3" data-otp-prefix="<?php echo $prefix; ?>">
        <p class="text-xs text-gray-500 font-dm-sans mb-2">Enter email above, then click Send OTP.</p>
        <div id="<?php echo $prefix; ?>-otpFieldContainer" class="hidden">
            <label class="block text-sm font-semibold text-gray-700 mb-2 font-dm-sans">Enter OTP *</label>
            <div class="flex gap-2">
                <input type="text" id="<?php echo $prefix; ?>-otp" maxlength="6" inputmode="numeric"
                       autocomplete="one-time-code"
                       class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-dm-sans <?php echo $inputClass; ?>"
                       placeholder="6-digit code">
                <button type="button" id="<?php echo $prefix; ?>-verifyOtpBtn"
                        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-dm-sans text-sm font-medium whitespace-nowrap">
                    Verify
                </button>
            </div>
        </div>
        <p id="<?php echo $prefix; ?>-otpStatusMsg" class="text-sm font-dm-sans hidden mt-2"></p>
    </div>
    <?php
}
