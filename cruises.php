<!DOCTYPE html>
<html lang="en">
<?php 
// Meta tags for Cruises Page
$pageTitle = 'Cruises - Mangalam Travel & Tours';
$pageDescription = 'Sail into a world of refined luxury. Explore curated cruise holidays.';
$pageImage = './assets/images/destination-card-11.webp';
$pageUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

include './head.php'; ?>
<body class="font-dm-sans bg-white">
    <!-- Header -->
    <?php include './components/header.php'; ?>

    <main>
        <!-- Modern Hero Section -->

        <!-- Fresh Content Section (Side by Side) -->
        <section class="py-16 md:py-20 mt-10">
            <div class="container mx-auto px-4">
                <div class="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
                    <!-- Text Side -->
                    <div class="md:w-1/2" data-aos="fade-right">
                        <span class="text-sky-600 font-bold tracking-wider text-xs capitalize mb-2 block">Cruises</span>
                        <h2 class="text-3xl md:text-4xl font-medium text-gray-900 font-[Quicksand] mb-6 leading-tight">
                            Sail Beyond Ordinary with <span class="font-bold">Mangalam Travel & Tours</span>
                        </h2>
                        <p class="text-gray-600 mb-6 leading-relaxed font-dm-sans text-lg">
                            Sail into a world of refined luxury with Mangalam Travel & Tours’ expertly curated cruise holidays. Whether you’re dreaming of a short, elegant getaway or a grand international voyage, we take care of every single detail—so all you do is relax, unwind, and enjoy the rhythm of the waves.
                        </p>
                        <p class="text-gray-600 leading-relaxed font-dm-sans">
                            From sunrise views over the deck to evenings filled with fine dining and entertainment, our cruises are designed for travellers who value comfort, class, and seamless planning—just like a perfectly planned family vacation back home during festive season.
                        </p>
                    </div>

                    <!-- Image Side -->
                    <div class="md:w-1/2 relative" data-aos="fade-left">
                        <div class="relative rounded-2xl overflow-hidden">
                             <img src="./assets/images/cruise.webp" alt="Luxury Cruise Deck" class="w-full h-full object-cover">
                             <!-- Floating Badge -->
                             <div class="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border-l-4 border-sky-500 max-w-xs hidden md:block">
                                 <p class="text-gray-800 font-medium italic text-sm">"Travel should feel effortless, like a well-hosted celebration."</p>
                             </div>
                        </div>
                      
                    </div>
                </div>
            </div>
        </section>

        <!-- buttons -->
        <div class="container mx-auto px-4 -mt-8 mb-12 relative z-20">
            <div class="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-6xl mx-auto">
                <a href="tel:+919585541102" class="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gray-900 text-white font-bold text-center text-sm uppercase tracking-widest font-dm-sans hover:bg-sky-600 transition-all hover:shadow-2xl hover:shadow-sky-600/20 flex items-center justify-center gap-3 group">
                    <i class="fi fi-rr-phone-call transition-transform group-hover:rotate-12"></i>
                    Talk to Expert
                </a>
                <a href="https://wa.me/919585541102" target="_blank" class="w-full sm:w-auto px-10 py-4 rounded-2xl bg-[#25D366] text-white font-bold text-center text-sm uppercase tracking-widest font-dm-sans hover:bg-[#128C7E] transition-all hover:shadow-2xl hover:shadow-[#25D366]/20 flex items-center justify-center gap-3 group">
                    <i class="fi fi-brands-whatsapp transition-transform group-hover:scale-110"></i>
                    WhatsApp Inquiry
                </a>
            </div>
        </div>

        <!-- Experiences Section (Icon Based) -->
        <section class="py-20 bg-white">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-3xl font-bold text-gray-900 font-[Quicksand]">Curated Cruise Experiences</h2>
                    <p class="text-gray-500 mt-2 font-light">Find the perfect voyage that speaks to you.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 max-w-5xl mx-auto">
                    <!-- Item 1: Short-Haul -->
                    <div class="flex items-start group p-6 rounded-3xl hover:bg-gray-50 transition-all duration-300 cursor-pointer">
                        <div class="flex-shrink-0 w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                             <i class="fi fi-rr-ship-side text-3xl"></i>
                        </div>
                        <div class="ml-6">
                            <h3 class="text-xl font-bold text-gray-900 font-[Quicksand] mb-2 group-hover:text-sky-600 transition-colors">Short-Haul</h3>
                            <p class="text-gray-600 leading-relaxed font-dm-sans">Perfect for first-time cruisers. Enjoy premium comfort, curated shore excursions, and a relaxed pace.</p>
                        </div>
                    </div>

                    <!-- Item 2: International -->
                    <div class="flex items-start group p-6 rounded-3xl hover:bg-gray-50 transition-all duration-300 cursor-pointer">
                        <div class="flex-shrink-0 w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                             <i class="fi fi-rr-world text-3xl"></i>
                        </div>
                        <div class="ml-6">
                            <h3 class="text-xl font-bold text-gray-900 font-[Quicksand] mb-2 group-hover:text-purple-600 transition-colors">International</h3>
                            <p class="text-gray-600 leading-relaxed font-dm-sans">Explore iconic destinations across Europe, the Middle East, Asia, and beyond with global cuisine.</p>
                        </div>
                    </div>

                    <!-- Item 3: Family -->
                    <div class="flex items-start group p-6 rounded-3xl hover:bg-gray-50 transition-all duration-300 cursor-pointer">
                        <div class="flex-shrink-0 w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                             <i class="fi fi-rr-users-alt text-3xl"></i>
                        </div>
                        <div class="ml-6">
                            <h3 class="text-xl font-bold text-gray-900 font-[Quicksand] mb-2 group-hover:text-orange-600 transition-colors">Family Fun</h3>
                            <p class="text-gray-600 leading-relaxed font-dm-sans">Joyful as a big Indian family trip! Kids’ activities and entertainment for all ages.</p>
                        </div>
                    </div>

                    <!-- Item 4: Romantic -->
                    <div class="flex items-start group p-6 rounded-3xl hover:bg-gray-50 transition-all duration-300 cursor-pointer">
                        <div class="flex-shrink-0 w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-600 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                             <i class="fi fi-rr-heart text-3xl"></i>
                        </div>
                        <div class="ml-6">
                            <h3 class="text-xl font-bold text-gray-900 font-[Quicksand] mb-2 group-hover:text-pink-600 transition-colors">Romantic</h3>
                            <p class="text-gray-600 leading-relaxed font-dm-sans">Celebrate love with private balconies, sunset dinners, and unforgettable moments at sea.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- Why Cruise (Clean Grid) -->
        <!-- Why Cruise (Features + Image) -->
        <section class="py-20 bg-white">
            <div class="container mx-auto px-4">
                <div class="flex flex-col lg:flex-row items-center gap-16 max-w-7xl mx-auto">
                    <!-- Left: Features List -->
                    <div class="lg:w-1/2">
                        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 font-[Quicksand] mb-10">Why Choose a Cruise Holiday with Us?</h2>
                        
                        <div class="space-y-8">
                            <!-- Feature 1 -->
                            <div class="flex items-start">
                                <div class="flex-shrink-0 w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600 mr-5">
                                    <i class="fi fi-rr-check text-xl"></i>
                                </div>
                                <div>
                                    <h4 class="text-lg font-bold text-gray-900 font-[Quicksand] mb-1">End-to-End Planning</h4>
                                    <p class="text-gray-600 font-dm-sans text-sm leading-relaxed">We handle everything—from choosing the right ship to booking cabins and activities, so you don't have to worry about a thing.</p>
                                </div>
                            </div>

                            <!-- Feature 2 -->
                            <div class="flex items-start">
                                <div class="flex-shrink-0 w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mr-5">
                                    <i class="fi fi-rr-document text-xl"></i>
                                </div>
                                <div>
                                    <h4 class="text-lg font-bold text-gray-900 font-[Quicksand] mb-1">Visa & Documentation Support</h4>
                                    <p class="text-gray-600 font-dm-sans text-sm leading-relaxed">Navigating visa requirements can be tricky. We provide full assistance with all travel paperwork and documentation.</p>
                                </div>
                            </div>

                            <!-- Feature 3 -->
                            <div class="flex items-start">
                                <div class="flex-shrink-0 w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 mr-5">
                                    <i class="fi fi-rr-bed-alt text-xl"></i>
                                </div>
                                <div>
                                    <h4 class="text-lg font-bold text-gray-900 font-[Quicksand] mb-1">Seamless Hotel Arrangements</h4>
                                    <p class="text-gray-600 font-dm-sans text-sm leading-relaxed">Need a stay before your cruise departs or after it docks? We arrange convenient pre- and post-cruise hotel accommodations.</p>
                                </div>
                            </div>

                            <!-- Feature 4 -->
                            <div class="flex items-start">
                                <div class="flex-shrink-0 w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600 mr-5">
                                    <i class="fi fi-rr-restaurant text-xl"></i>
                                </div>
                                <div>
                                    <h4 class="text-lg font-bold text-gray-900 font-[Quicksand] mb-1">Comfort Food at Sea</h4>
                                    <p class="text-gray-600 font-dm-sans text-sm leading-relaxed">Miss home food? We can arrange for Indian meal options and special dietary requests on your voyage.</p>
                                </div>
                            </div>
                            
                             <!-- Feature 5 -->
                            <div class="flex items-start">
                                <div class="flex-shrink-0 w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mr-5">
                                    <i class="fi fi-rr-headset text-xl"></i>
                                </div>
                                <div>
                                    <h4 class="text-lg font-bold text-gray-900 font-[Quicksand] mb-1">Dedicated 24/7 Support</h4>
                                    <p class="text-gray-600 font-dm-sans text-sm leading-relaxed">You are never alone. Our team supports you before you leave, while you sail, and until you return home.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Image -->
                    <div class="lg:w-1/2 w-full min-h-[500px] relative" data-aos="fade-left">
                        <div class="sticky top-24">
                            <div class="relative rounded-3xl overflow-hidden shadow-2xl">
                                <img src="./assets/images/cruise-2.webp" alt="Luxury Cruise Deck" class="w-full lg:h-[600px] h-[400px] object-cover">
                                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                
                                
                                <!-- Quote Card -->
                                <div class="absolute top-10 left-10 right-10 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl">
                                    <div class="text-yellow-400 text-3xl mb-2">★★★★★</div>
                                    <p class="text-white italic text-lg leading-relaxed mb-4">"We believe travel should feel effortless, like a well-hosted celebration—where every guest is cared for."</p>
                                    <div class="flex items-center">
                                        <div class="w-10 h-10 bg-white text-gray-900 rounded-full flex items-center justify-center font-bold font-serif">M</div>
                                        <span class="ml-3 text-white font-medium">Mangalam Team</span>
                                    </div>
                                </div>
                            </div>
                            <!-- Decorative Pattern -->
                            <div class="absolute -z-10 -bottom-10 -right-10 w-64 h-64 bg-sky-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
                            <div class="absolute -z-10 -top-10 -left-10 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA -->
        <section class="bg-gray-900 py-16 text-center text-white">
            <div class="container mx-auto px-4">
                <h2 class="text-3xl font-bold font-[Quicksand] mb-6">Your Journey, Perfectly Planned</h2>
                <a href="contact.php" class="inline-block bg-white text-gray-900 font-bold py-3 px-8 rounded-xl hover:bg-sky-500 hover:text-white transition-all duration-300">
                    Contact Us Now
                </a>
            </div>
        </section>

    </main>

    <?php include './components/footer.php'; ?>
    <?php include './components/Customize.php'; ?>
    <?php include './components/FixedCustomizeButton.php'; ?>
    <?php 
    include './components/MobileNav.php';
    responsiveMenu('cruises'); // Set 'cruises' as active page
    ?>
    <?php include './script.php'; ?>
</body>
</html>
