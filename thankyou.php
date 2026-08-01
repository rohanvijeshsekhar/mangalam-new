<!DOCTYPE html>
<html lang="en">
<?php
$pageTitle = 'Thank You - Mangalam Travel & Tours';
$pageDescription = 'Thank you for contacting Mangalam Travel & Tours. We have received your enquiry and will get back to you shortly.';
$pageKeywords = 'thank you, enquiry submitted, Mangalam Tours';
$pageImage = './assets/images/logo/mangalam-tours-og.jpg';
$pageUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
$pageType = 'website';
$meta = '<meta name="robots" content="noindex, nofollow" />';

include './head.php';
?>
<body class="font-dm-sans bg-gray-50 min-h-screen flex items-center justify-center px-4">
    <main class="w-full max-w-md text-center">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-10">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <i class="fi fi-rr-check text-green-600 text-3xl"></i>
            </div>

            <h1 class="text-2xl font-bold text-gray-900 mb-2 font-[Quicksand]">Thank You</h1>
            <p class="text-gray-500 text-sm leading-relaxed mb-8">
                We have received your enquiry and will contact you shortly.
            </p>

            <button
                type="button"
                onclick="goBackFromThankYou()"
                class="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
                <i class="fi fi-rr-arrow-left text-sm"></i>
                Go Back
            </button>
        </div>
    </main>

    <script>
        function goBackFromThankYou() {
            if (window.history.length > 1) {
                window.history.back();
                return;
            }
            window.location.href = './index.php';
        }
    </script>
</body>
</html>
