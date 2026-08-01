<!DOCTYPE html>
<html lang="en">
<?php 
// Meta tags for Career Page
$pageTitle = 'Careers - Join Our Team | Mangalam Travel & Tours';
$pageDescription = 'Join our team of travel innovators at Mangalam Travel & Tours. Explore exciting career opportunities in the travel and tourism industry.';
$pageKeywords = 'careers, jobs, travel jobs, tourism careers, Mangalam Travel & Tours careers';
$pageImage = './assets/images/logo.png'; // Fallback or specific image
$pageUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

include './head.php';
require_once __DIR__ . '/components/EnquiryOtpFields.php';
?>
<body class="font-dm-sans bg-gray-50">
    <!-- Header -->
    <?php include './components/header.php'; ?>

    <main class="pt-24 pb-12">
        <!-- Hero Section -->
        <section class="max-w-7xl mx-auto px-4 mb-20 text-left" data-aos="fade-up">
            <h1 class="text-4xl md:text-3xl font-medium text-gray-800 font-[Quicksand] mb-6">
                Build the Future of <span class="font-bold">Travel With Us</span>
            </h1>
            <p class="text-gray-600 mx-auto text-base leading-relaxed">
                At Mangalam, we don't just book trips; we craft memories. We are seeking visionaries who can see beyond the horizon and deliver operational excellence. Join a team where your ideas take flight and your passion for exploration finds a home.
            </p>
        </section>

        <!-- Available Positions -->
        <section class="max-w-6xl mx-auto px-4 mb-20">
            <h2 class="text-3xl font-bold text-gray-800 font-[Quicksand] mb-8" data-aos="fade-up">
                Current <span class="text-gray-900">Openings</span>
            </h2>

            <div class="space-y-6">
                <!-- Position 1 -->
                <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6" data-aos="fade-up" data-aos-delay="100">
                    <div class="space-y-4 flex-1">
                        <div class="flex flex-wrap items-center gap-3">
                            <h3 class="text-xl font-bold text-gray-900 font-[Quicksand]">Senior Tour Operations Manager</h3>
                            <span class="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full font-medium">Full Time</span>
                        </div>
                        
                        <div class="flex items-center text-gray-500 text-sm">
                            <i class="fi fi-rr-marker mr-2"></i>
                            Chennai, India
                        </div>

                        <p class="text-gray-600 text-sm">
                            Lead our tour operations team to ensure seamless execution of complex itineraries. We need a detail-oriented leader with a deep understanding of logistics and vendor management.
                        </p>

                        <div class="flex flex-wrap gap-2">
                            <span class="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">Operations</span>
                            <span class="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">Management</span>
                            <span class="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">Logistics</span>
                        </div>
                    </div>

                    <div class="flex gap-3 shrink-0">
                        <a href="#application-form" class="px-6 py-2 border border-gray-700 text-gray-900 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium capitalize tracking-wider">
                            Apply Now 
                        </a>
                    </div>
                </div>

                <!-- Position 2 -->
                <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6" data-aos="fade-up" data-aos-delay="200">
                    <div class="space-y-4 flex-1">
                        <div class="flex flex-wrap items-center gap-3">
                            <h3 class="text-xl font-bold text-gray-900 font-[Quicksand]">Digital Content Strategist</h3>
                            <span class="bg-purple-50 text-purple-600 text-xs px-3 py-1 rounded-full font-medium">Hybrid</span>
                        </div>
                        
                        <div class="flex items-center text-gray-500 text-sm">
                            <i class="fi fi-rr-marker mr-2"></i>
                            Bangalore / Remote
                        </div>

                        <p class="text-gray-600 text-sm">
                            Tell the story of Mangalam through compelling visuals and narratives that inspire wanderlust. You will drive our social media presence and content marketing initiatives.
                        </p>

                        <div class="flex flex-wrap gap-2">
                            <span class="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">Social Media</span>
                            <span class="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">Content Creation</span>
                            <span class="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">Brand Strategy</span>
                        </div>
                    </div>

                    <div class="flex gap-3 shrink-0">
                        <a href="#application-form" class="px-6 py-2 border border-gray-700 text-gray-900 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium capitalize tracking-wider">
                            Apply Now
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Application Form -->
        <section id="application-form" class="max-w-4xl mx-auto px-4 mb-20" data-aos="fade-up">
            <h2 class="text-3xl font-bold text-gray-800 font-[Quicksand] mb-10 text-center">
                Start Your <span class="text-gray-900">Journey With Us</span>
            </h2>

            <form id="career-form" class="space-y-6" enctype="multipart/form-data">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label for="career-position" class="block text-sm font-bold text-gray-700">Position Applied For</label>
                        <div class="relative">
                            <select id="career-position" name="position" required class="w-full bg-transparent border border-gray-300 rounded-lg px-4 py-1.5 appearance-none focus:outline-none focus:border-gray-500">
                                <option value="">Select a position</option>
                                <option>Senior Tour Operations Manager</option>
                                <option>Digital Content Strategist</option>
                                <option>Other</option>
                            </select>
                            <i class="fi fi-rr-angle-small-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label for="career-name" class="block text-sm font-bold text-gray-700">Full Name</label>
                        <input type="text" id="career-name" name="name" required class="w-full border border-gray-300 rounded-lg px-4 py-1.5 focus:outline-none focus:border-gray-500 bg-transparent">
                    </div>

                    <div class="space-y-2">
                        <label for="career-email" class="block text-sm font-bold text-gray-700">Email Address</label>
                        <input type="email" id="career-email" name="email" required class="w-full border border-gray-300 rounded-lg px-4 py-1.5 focus:outline-none focus:border-gray-500 bg-transparent">
                    </div>

                    <div class="space-y-2">
                        <label for="career-phone" class="block text-sm font-bold text-gray-700">Phone Number</label>
                        <div class="flex gap-2">
                            <input type="tel" id="career-phone" name="phone" required class="flex-1 border border-gray-300 rounded-lg px-4 py-1.5 focus:outline-none focus:border-gray-500 bg-transparent">
                            <button type="button" id="career-sendOtpBtn" class="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm font-medium whitespace-nowrap">Send OTP</button>
                        </div>
                        <?php renderEnquiryOtpFields('career'); ?>
                    </div>
                </div>

                <div class="space-y-2">
                    <label for="career-resume" class="block text-sm font-bold text-gray-700">Resume/CV</label>
                    <div class="dashed-border border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors relative">
                        <input type="file" id="career-resume" name="resume" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                        <i class="fi fi-rr-upload text-2xl text-gray-400 mb-2 block"></i>
                        <p id="career-resume-label" class="text-sm text-gray-500 mb-1">Click to upload or drag and drop</p>
                        <p class="text-xs text-gray-400">PDF, DOC, or DOCX (Max 5MB)</p>
                    </div>
                </div>

                <div class="space-y-2">
                    <label for="career-cover-letter" class="block text-sm font-bold text-gray-700">Cover Letter</label>
                    <textarea id="career-cover-letter" name="cover_letter" rows="5" class="w-full border border-gray-300 rounded-lg px-4 py-1.5 focus:outline-none focus:border-gray-500 bg-transparent resize-none"></textarea>
                </div>

                <div class="flex items-center gap-4">
                    <button type="submit" id="career-submit-btn" class="w-full lg:w-auto px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium capitalize text-sm tracking-wide">
                        Submit Application
                    </button>
                </div>
            </form>
        </section>
    </main>

    <?php include './components/footer.php'; ?>
    <?php include './components/Customize.php'; ?>
    <?php include './components/FixedCustomizeButton.php'; ?>
    <?php 
    include './components/MobileNav.php';
    responsiveMenu('career'); 
    ?>
    <?php include './script.php'; ?>

    <script>
        const careerResumeInput = document.getElementById('career-resume');
        const careerResumeLabel = document.getElementById('career-resume-label');
        if (careerResumeInput && careerResumeLabel) {
            careerResumeInput.addEventListener('change', function() {
                careerResumeLabel.textContent = this.files[0] ? this.files[0].name : 'Click to upload or drag and drop';
            });
        }

        const careerOtp = window.EnquiryOtp ? EnquiryOtp.getInstance('career') : null;

        document.getElementById('career-form').addEventListener('submit', function(e) {
            e.preventDefault();

            if (careerOtp && !careerOtp.requireVerified()) {
                return;
            }

            const submitBtn = document.getElementById('career-submit-btn');
            const originalText = submitBtn.innerHTML;
            const formData = new FormData(this);

            submitBtn.innerHTML = '<i class="fi fi-rr-spinner mr-2 animate-spin"></i>Submitting...';
            submitBtn.disabled = true;

            fetch('./action/submitCareerEnquiry.php', {
                method: 'POST',
                credentials: 'same-origin',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.reset();
                    if (careerResumeLabel) careerResumeLabel.textContent = 'Click to upload or drag and drop';
                    if (careerOtp) careerOtp.reset();
                    window.location.href = './thankyou.php';
                } else {
                    alert(data.message || 'Failed to submit application. Please try again.');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });
    </script>
</body>
</html>
