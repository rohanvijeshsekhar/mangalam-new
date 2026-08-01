<!DOCTYPE html>
<html lang="en">
<?php 
// Meta tags for Contact Page
$pageTitle = 'Contact Us - Mangalam Travel & Tours | Get in Touch';
$pageDescription = 'Contact Mangalam Travel & Tours for travel inquiries, tour bookings, and assistance. Reach out to our team and start planning your perfect vacation today.';
$pageKeywords = 'contact Mangalam Tours, travel inquiry, tour booking, travel support, customer service, Mangalam Tours contact';
$pageImage = './assets/images/contact-banner.webp';
$pageUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

include './head.php';
require_once __DIR__ . '/components/EnquiryOtpFields.php';
?>
<body class="font-dm-sans bg-white">
    <!-- Header -->
    <?php include './components/header.php'; ?>

    <main>
        <!-- Hero Section -->
        <section class="pt-32 pb-10 bg-white" data-aos="fade-up">
            <div class="container mx-auto px-4">
                <div class="text-center" data-aos="fade-up" data-aos-delay="100">
                    <h1 class="text-4xl font-medium text-gray-900 font-[Quicksand] leading-tight mb-2" data-aos="fade-up" data-aos-delay="150">
                        Get In Touch <span class="font-bold">  With Us</span>
                    </h1>
                    <p class="text-base text-gray-600 font-dm-sans max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
                        Have questions about your next adventure? We're here to help plan your perfect journey.
                    </p>
                </div>
            </div>
        </section>

        <!-- Contact Information Cards -->
        <section class="py-12 bg-gray-50" data-aos="fade-up">
            <div class="container mx-auto px-4">
                <div class="max-w-6xl mx-auto">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <!-- Phone Card -->
                        <div class="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 border border-gray-100" data-aos="fade-up" data-aos-delay="0">
                            <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fi fi-rr-phone-call text-gray-700 text-2xl flex items-center justify-center"></i>
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 font-dm-sans mb-2">Call Us</h3>
                            <p class="text-gray-600 font-dm-sans mb-3">Available 24/7 for your queries</p>
                            <a href="tel:+918714636969" class="text-gray-900 font-semibold hover:text-gray-700 transition-colors">+91 8714636969 </a>
                            
                            
                        </div>

                        <!-- Email Card -->
                        <div class="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 border border-gray-100" data-aos="fade-up" data-aos-delay="120">
                            <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fi fi-rr-envelope text-gray-700 text-2xl flex items-center justify-center"></i>
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 font-dm-sans mb-2">Email Us</h3>
                            <p class="text-gray-600 font-dm-sans mb-3">We'll respond within 24 hours</p>
                            <a href="mailto:enquiries@mangalamtravel.com" class="text-gray-900 font-semibold hover:text-gray-700 transition-colors">enquiries@mangalamtravel.com</a>
                        </div>

                        <!-- Location Card -->
                        <div class="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 border border-gray-100" data-aos="fade-up" data-aos-delay="240">
                            <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fi fi-rr-marker text-gray-700 text-2xl flex items-center justify-center"></i>
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 font-dm-sans mb-2">Visit Us</h3>
                            <p class="text-gray-600 font-dm-sans mb-3">Come meet us in person</p>
                            <p class="text-gray-900 font-semibold">5 & 6, 1st Floor, Our Tower, Vellayambalam - Sasthamangalam Rd, P.O, Thiruvananthapuram, Kerala 695010</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Contact Form & Map Section -->
        <section class="py-20 bg-white" data-aos="fade-up">
            <div class="container mx-auto px-4">
                <div class="max-w-6xl mx-auto">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12" data-aos="fade-up" data-aos-delay="100">
                        <!-- Contact Form -->
                        <div data-aos="fade-up" data-aos-delay="120">
                            <div class="flex items-start mb-6" data-aos="fade-up" data-aos-delay="150">
                                <div class="w-12 h-auto flex items-center justify-center mr-4">
                                    <img src="./assets/images/parachute-img.png" alt="Parachute" class="w-full h-full object-cover">
                                </div>
                                <h2 class="text-4xl font-medium text-gray-900 font-[Quicksand]">
                                    Send Us a <span class="font-bold">Message</span>
                                </h2>
                            </div>
                            <p class="text-gray-600 font-dm-sans mb-8" data-aos="fade-up" data-aos-delay="180">
                                Fill out the form below and our team will get back to you shortly to discuss your travel plans.
                            </p>

                            <form id="contact-form" action="#" method="POST" class="space-y-6" data-aos="fade-up" data-aos-delay="200">
                                <!-- Name -->
                                <div>
                                    <label for="contact-name" class="block text-gray-700 font-dm-sans font-medium mb-2">Full Name</label>
                                    <input type="text" id="contact-name" name="name" required 
                                        class="w-full px-4 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-none focus:border-red-500 transition-all font-dm-sans"
                                        placeholder="John Doe">
                                </div>

                                <!-- Email -->
                                <div>
                                    <label for="contact-email" class="block text-gray-700 font-dm-sans font-medium mb-2">Email Address</label>
                                    <input type="email" id="contact-email" name="email" required 
                                        class="w-full px-4 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-none focus:border-red-500 transition-all font-dm-sans"
                                        placeholder="john@example.com">
                                </div>

                                <!-- Phone -->
                                <div>
                                    <label for="contact-phone" class="block text-gray-700 font-dm-sans font-medium mb-2">Phone Number *</label>
                                    <div class="flex gap-2">
                                        <input type="tel" id="contact-phone" name="phone" required
                                            class="flex-1 px-4 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-none focus:border-red-500 transition-all font-dm-sans"
                                            placeholder="+91 98765 43210">
                                        <button type="button" id="contact-sendOtpBtn"
                                            class="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-dm-sans text-sm font-medium whitespace-nowrap">
                                            Send OTP
                                        </button>
                                    </div>
                                    <?php renderEnquiryOtpFields('contact'); ?>
                                </div>

                                <!-- Subject -->
                                <div>
                                    <label for="contact-subject" class="block text-gray-700 font-dm-sans font-medium mb-2">Subject</label>
                                    <input type="text" id="contact-subject" name="subject" 
                                        class="w-full px-4 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-none focus:border-red-500 transition-all font-dm-sans"
                                        placeholder="Tour Inquiry">
                                </div>

                                <!-- Message -->
                                <div>
                                    <label for="contact-message" class="block text-gray-700 font-dm-sans font-medium mb-2">Message</label>
                                    <textarea id="contact-message" name="message" rows="5" required
                                        class="w-full px-4 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-none focus:border-red-500 transition-all font-dm-sans resize-none"
                                        placeholder="Tell us about your travel plans..."></textarea>
                                </div>

                                <!-- Submit Button -->
                                <button type="submit" id="contact-submit-btn"
                                    class="w-full bg-gray-900 text-white py-3 px-8 rounded-lg font-dm-sans font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-[1.02]">
                                    Send Message
                                </button>
                            </form>
                        </div>

                        <!-- Map & Additional Info -->
                        <div data-aos="fade-left" data-aos-delay="220">
                            <!-- Map Placeholder -->
                            <div class="bg-gray-200 rounded-2xl overflow-hidden mb-8 h-[400px]" data-aos="zoom-in" data-aos-delay="250">
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.8702747760653!2d76.96158947532219!3d8.511974396867156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05bbccd28379e1%3A0x4cf1decfb9eea7a!2sMANGALAM%20TRAVEL%20AND%20TOURS%20%7C%20Thiruvananthapuram!5e0!3m2!1sen!2sin!4v1779172550870!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade
                                    width="100%" 
                                    height="100%" 
                                    style="border:0;" 
                                    allowfullscreen="" 
                                    loading="lazy" 
                                    referrerpolicy="no-referrer-when-downgrade"
                                    class="transition-all duration-300">
                                </iframe>
                            </div>

                            <!-- Office Hours -->
                            <div class="bg-gray-50 rounded-2xl p-8" data-aos="fade-up" data-aos-delay="280">
                                <h3 class="text-2xl font-bold text-gray-900 font-[Quicksand] mb-6">Office Hours</h3>
                                <div class="space-y-4" data-aos="fade-up" data-aos-delay="320">
                                    <div class="flex justify-between items-center">
                                        <span class="text-gray-700 font-dm-sans font-medium">Monday - Friday</span>
                                        <span class="text-gray-900 font-dm-sans font-semibold">9:00 AM - 6:00 PM</span>
                                    </div>
                                    <div class="border-t border-gray-200"></div>
                                    <div class="flex justify-between items-center">
                                        <span class="text-gray-700 font-dm-sans font-medium">Saturday</span>
                                        <span class="text-gray-900 font-dm-sans font-semibold">9:00 AM - 4:00 PM</span>
                                    </div>
                                    <div class="border-t border-gray-200"></div>
                                    <div class="flex justify-between items-center">
                                        <span class="text-gray-700 font-dm-sans font-medium">Sunday</span>
                                        <span class="text-gray-900 font-dm-sans font-semibold">Closed</span>
                                    </div>
                                </div>

                                <!-- Social Media Links -->
                                <div class="mt-8 pt-8 border-t border-gray-200" data-aos="fade-up" data-aos-delay="360">
                                    <h4 class="text-lg font-bold text-gray-900 font-dm-sans mb-4">Follow Us</h4>
                                    <div class="flex space-x-4" data-aos="fade-up" data-aos-delay="380">
                                        <a href="#" class="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all duration-300 border border-gray-200">
                                            <i class="fab fa-facebook-f"></i>
                                        </a>
                                        <a href="#" class="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all duration-300 border border-gray-200">
                                            <i class="fab fa-whatsapp"></i>
                                        </a>
                                        <a href="#" class="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all duration-300 border border-gray-200">
                                            <i class="fab fa-twitter"></i>
                                        </a>
                                        <a href="#" class="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all duration-300 border border-gray-200">
                                            <i class="fab fa-instagram"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <?php include './components/footer.php'; ?>
    </main>

    <?php include './script.php'; ?>
    <?php 
    include './components/MobileNav.php';
    include './components/Customize.php';
    responsiveMenu('contact'); // Set 'contact' as active page
    ?>
    
    <!-- Additional Contact Page Scripts -->
    <script>
        function toggleContactFAQ(faqNumber) {
            const answer = document.getElementById(`contact-answer-${faqNumber}`);
            const button = document.getElementById(`contact-button-${faqNumber}`);
            const icon = document.getElementById(`contact-icon-${faqNumber}`);
            
            if (answer.classList.contains('hidden')) {
                // Expand FAQ
                answer.classList.remove('hidden');
                button.classList.remove('bg-gray-300');
                button.classList.add('bg-red-500');
                icon.classList.remove('fi-rr-plus', 'text-gray-800');
                icon.classList.add('fi-rr-minus', 'text-white');
            } else {
                // Collapse FAQ
                answer.classList.add('hidden');
                button.classList.remove('bg-red-500');
                button.classList.add('bg-gray-300');
                icon.classList.remove('fi-rr-minus', 'text-white');
                icon.classList.add('fi-rr-plus', 'text-gray-800');
            }
        }

        const contactOtp = window.EnquiryOtp ? EnquiryOtp.getInstance('contact') : null;

        // Contact form submission handler
        document.getElementById('contact-form').addEventListener('submit', function(e) {
            e.preventDefault();

            if (contactOtp && !contactOtp.requireVerified()) {
                return;
            }
            
            // Get form data
            const formData = new FormData(this);
            const customerName = formData.get('name');
            const customerEmail = formData.get('email');
            const customerPhone = formData.get('phone');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Get button element
            const submitBtn = document.getElementById('contact-submit-btn');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fi fi-rr-spinner mr-2 animate-spin"></i>Submitting...';
            submitBtn.disabled = true;

            fetch('./action/submitContactEnquiry.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    name: customerName,
                    email: customerEmail,
                    phone: customerPhone,
                    subject: subject,
                    message: message
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.reset();
                    if (contactOtp) contactOtp.reset();
                    window.location.href = './thankyou.php';
                } else {
                    alert(data.message || 'Failed to submit enquiry. Please try again.');
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

