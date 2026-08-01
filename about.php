<!DOCTYPE html>
<html lang="en">
<?php 
// Meta tags for About Page
$pageTitle = 'About Us - Mangalam Travel & Tours | 30+ Years of Trusted Travel Excellence';
$pageDescription = 'Learn about Mangalam Travel & Tours - Celebrating 30+ years of trusted travel excellence. Discover our story, mission, and commitment to providing exceptional travel experiences.';
$pageKeywords = 'about Mangalam Tours, travel company, trusted travel agency, travel excellence, Mangalam Tours history, travel company about';
$pageImage = './assets/images/about-banner.webp';
$pageUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

include './head.php'; ?>
<body class="font-dm-sans bg-white">
    <!-- Header -->
    <?php include './components/header.php'; ?>

    <main>
        <!-- Hero Section -->
        <section class="py-20 bg-white" data-aos="fade-up">
            <div class="container mx-auto px-4">
                <div class="lg:text-center text-left mb-16" data-aos="fade-up" data-aos-delay="100">
                    <h1 class="lg:text-5xl text-4xl font-medium text-gray-900 font-[Quicksand] leading-tight mb-6" data-aos="fade-up" data-aos-delay="150">
                        Celebrating 30+ Years of<br> <span class="font-bold">Trusted Travel Excellence</span>
                    </h1>
                    <p class="text-base text-gray-600 font-dm-sans max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="200">
                        Trusted by thousands of happy travelers for our quality service and seamless planning
                    </p>
                </div>

                <!-- Hero Images -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <!-- Left Card -->
                    <div class="relative overflow-hidden h-[400px] rounded-tl-3xl rounded-tr-3xl rounded-br-3xl rounded-bl-[120px] group cursor-pointer" data-aos="zoom-in" data-aos-delay="100">
                        <img src="./assets/images/about/abt-1.webp" alt="Adventure Travel" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-tl-3xl rounded-tr-3xl rounded-br-3xl rounded-bl-[120px]">
                    </div>

                    <!-- Middle Card -->
                    <div class="hidden lg:block relative rounded-xl overflow-hidden h-[400px] group cursor-pointer" data-aos="zoom-in" data-aos-delay="200">
                        <img src="./assets/images/about/abt-2.webp" alt="Group Travel" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-xl">
                       
                    </div>

                    <!-- Right Card -->
                    <div class="hidden lg:block relative overflow-hidden h-[400px] group cursor-pointer rounded-tl-3xl rounded-tr-3xl rounded-br-[120px] rounded-bl-3xl" data-aos="zoom-in" data-aos-delay="300">
                        <img src="./assets/images/about/abt-3.webp" alt="Mountain Views" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-tl-3xl rounded-tr-3xl rounded-br-[120px] rounded-bl-3xl">
                    </div>
                </div>
            </div>
        </section>

        <!-- About Us Section -->
        <section class="lg:py-20 bg-gray-50" data-aos="fade-up">
            <div class="container mx-auto px-4">
                <div class="max-w-6xl mx-auto">
                    <div class="flex items-start space-x-8">
                    
                        <!-- About Content -->
                        <div class="grid lg:grid-cols-2 grid-cols-1" data-aos="fade-up" data-aos-delay="100">
                           <div>
                             <!-- Hot Air Balloon Icon -->
                             <div class="flex-shrink-0" data-aos="fade-up" data-aos-delay="150">
                                <div class="w-16 h-auto` flex items-center justify-center">
                                <img src="./assets/images/parachute-img.png" alt="Hot Air Balloon" class="w-full h-full object-cover">
                                </div>
                            </div>

                            <h2 class="lg:text-4xl text-3xl  font-bold text-gray-900 font-[Quicksand] mb-6" data-aos="fade-up" data-aos-delay="180">
                                About Us
                            </h2>
                           </div>
                          
                            <div>
                                <div data-aos="fade-up" data-aos-delay="220">
                                        <p class="text-lg text-gray-700 font-dm-sans leading-relaxed mb-6">
                                        A Legacy of Excellence Since 1990
For over three decades, Mangalam Travel & Tours has been committed to delivering exceptional travel experiences and professional global mobility solutions. Built on trust, expertise, and a passion for service, we continue to connect people to destinations across the world Crafting seamless journeys - connecting the world  from international to domestic under one roof - for all travel related services .
                                        </p>
                                        
                                    </div>

                                    <!-- Statistics -->
                                    <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        <!-- Years of Experience -->
                                        <div class="bg-white rounded-xl p-6 border-2 border-gray-200 text-center" data-aos="zoom-in" data-aos-delay="250">
                                            <div class="text-4xl font-bold text-gray-900 font-[Quicksand] mb-2">30+</div>
                                            <div class="text-gray-600 font-dm-sans">Years Of Experience</div>
                                        </div>

                                        <!-- Happy Clients -->
                                        <div class="bg-gray-900 rounded-xl p-6 text-center" data-aos="zoom-in" data-aos-delay="300">
                                            <div class="text-4xl font-bold text-white font-[Quicksand] mb-2">50k+</div>
                                            <div class="text-gray-300 font-dm-sans">Happy Clients</div>
                                        </div>

                                        <!-- Destinations -->
                                        <div class="bg-white rounded-xl p-6 border-2 border-gray-200 text-center" data-aos="zoom-in" data-aos-delay="350">
                                            <div class="text-4xl font-bold text-gray-900 font-[Quicksand] mb-2">100+</div>
                                            <div class="text-gray-600 font-dm-sans">Destinations</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                    </div>
                </div>
            </div>
        </section>

        <!-- Our Journey Section -->
        <section class="py-20 bg-white" data-aos="fade-up">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="lg:text-4xl text-3xl  font-bold text-gray-900 font-[Quicksand] mb-1">Our Journey</h2>
                    <p class="text-lg text-gray-600 font-dm-sans max-w-2xl mx-auto">From humble beginnings to a global travel presence.</p>
                </div>
                
                <div class="relative max-w-4xl mx-auto">
                    <!-- Vertical Line -->
                    <div class="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200"></div>
                    
                    <!-- Milestone 1 -->
                    <div class="relative mb-12">
                        <div class="flex items-center justify-between w-full">
                            <div class="w-5/12 text-right pr-8">
                                <h3 class="text-2xl font-bold text-gray-900 font-[Quicksand]">1990</h3>
                                <p class="text-gray-600 font-dm-sans mt-2"> Founded with a vision to simplify travel and deliver reliable professional services.</p>
                            </div>
                            <div class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-400 rounded-full border-4 border-white shadow-md"></div>
                            <div class="w-5/12 pl-8"></div>
                        </div>
                    </div>

                    <!-- Milestone 2 -->
                    <div class="relative mb-12">
                        <div class="flex items-center justify-between w-full flex-row-reverse">
                            <div class="w-5/12 text-left pl-8">
                                <h3 class="text-2xl font-bold text-gray-900 font-[Quicksand]">2005</h3>
                                <p class="text-gray-600 font-dm-sans mt-2">Expanded to five major cities across India, strengthening our presence in the travel industry.
</p>
                            </div>
                            <div class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-900 rounded-full border-4 border-white shadow-md"></div>
                            <div class="w-5/12 pr-8"></div>
                        </div>
                    </div>

                    <!-- Milestone 3 -->
                    <div class="relative mb-12">
                        <div class="flex items-center justify-between w-full">
                            <div class="w-5/12 text-right pr-8">
                                <h3 class="text-2xl font-bold text-gray-900 font-[Quicksand]">2015</h3>
                                <p class="text-gray-600 font-dm-sans mt-2"> Launched international tour packages and specialized visa and documentation services.
</p>
                            </div>
                            <div class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-400 rounded-full border-4 border-white shadow-md"></div>
                            <div class="w-5/12 pl-8"></div>
                        </div>
                    </div>

                    <!-- Milestone 4 -->
                    <div class="relative">
                        <div class="flex items-center justify-between w-full flex-row-reverse">
                            <div class="w-5/12 text-left pl-8">
                                <h3 class="text-2xl font-bold text-gray-900 font-[Quicksand]">2023</h3>
                                <p class="text-gray-600 font-dm-sans mt-2">Celebrated 30+ years of excellence, serving 50,000+ happy clients worldwide.
</p>
                            </div>
                            <div class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-900 rounded-full border-4 border-white shadow-md"></div>
                            <div class="w-5/12 pr-8"></div>
                        </div>
                    </div>
                    
                    
                </div>
            </div>
        </section>

        <!-- Director's Desk Section -->
        <section class="py-20 bg-gray-50" data-aos="fade-up">
            <div class="container mx-auto px-4">
                <div class="max-w-6xl mx-auto">
                    <div class="grid lg:grid-cols-2 gap-12 items-center">
                        <div class="relative">
                           <div class="relative rounded-3xl overflow-hidden shadow-xl">
                                <img src="./assets/images/about/Director.png" alt="Director" class="w-full object-cover h-[500px]">
                           </div>
                           <div class="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl max-w-xs hidden lg:block">
                               <p class="font-[Quicksand] text-xl text-gray-900 font-bold mb-1">Mr. Jesu Amirtham</p>
                               <p class="text-sm font-dm-sans text-gray-500 uppercase tracking-wider">Managing Director</p>
                           </div>
                        </div>
                        <div>
                            <h2 class="lg:text-4xl text-3xl  font-bold text-gray-900 font-[Quicksand] mb-4">Director's Desk</h2>
                            <blockquote class="text-md text-gray-600 font-dm-sans italic mb-8 border-l-4 border-sky-400 pl-6">
                                "At the helm of Mangalam Travel & Tours is Mr. Jesu Amirtham, the visionary founder and Main Managing Partner. With vast experience encompassing every facet of the travel and tourism sector, Mr. Amirtham's journey from a junior position to a distinguished Director in previous companies exemplifies his integrity, perseverance, and dedication. His strategic acumen and ethical approach set the foundation for the company's success.
"
                            </blockquote>
                            <div class="space-y-6">
                                <div>
                                    <h3 class="text-xl font-bold text-gray-900 font-[Quicksand] mb-2">Our Vision</h3>
                                    <p class="text-gray-700 font-dm-sans">To be the world's most trusted travel partner, known for creating authentic and unforgettable travel experiences.</p>
                                </div>
                                <div>
                                    <h3 class="text-xl font-bold text-gray-900 font-[Quicksand] mb-2">Our Mission</h3>
                                    <p class="text-gray-700 font-dm-sans">To provide seamless, personalized, and high-quality travel solutions that exceed client expectations every single time.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Board of Directors Section -->
        <section class="py-20 bg-white" data-aos="fade-up">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="lg:text-4xl text-3xl  font-bold text-gray-900 font-[Quicksand] mb-1">Board of Directors</h2>
                    <p class="text-lg text-gray-600 font-dm-sans max-w-2xl mx-auto">The visionaries guiding our path to excellence.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    <!-- Director 1 -->
                    <div class="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                        <div class="h-80 overflow-hidden">
                            <img src="./assets/images/about/Sahayaraj.jpeg" alt="Director 1" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                        </div>
                        <div class="p-6 text-center">
                            <h3 class="text-xl font-bold text-gray-900 font-[Quicksand] mb-1">Mr. Sahayaraj</h3>
                            <p class="text-yellow-600 font-dm-sans font-medium uppercase text-sm tracking-wider">Managing Partner</p>
                        </div>
                    </div>

                    <!-- Director 2 -->
                    <div class="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform">
                        <div class="h-80 overflow-hidden">
                            <img src="./assets/images/about/Edwin.jpeg" alt="Director 2" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                        </div>
                        <div class="p-6 text-center">
                            <h3 class="text-xl font-bold text-gray-900 font-[Quicksand] mb-1">Mr. Edwin</h3>
                            <p class="text-yellow-600 font-dm-sans font-medium uppercase text-sm tracking-wider">Managing Partner</p>
                        </div>
                    </div>

                    <!-- Director 3 -->
                    <div class="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                        <div class="h-80 overflow-hidden">
                            <img src="./assets/images/about/Rosamma.jpeg" alt="Director 3" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                        </div>
                        <div class="p-6 text-center">
                            <h3 class="text-xl font-bold text-gray-900 font-[Quicksand] mb-1">Ms. Rosamma Jesu</h3>
                            <p class="text-yellow-600 font-dm-sans font-medium uppercase text-sm tracking-wider">Director</p>
                        </div>
                    </div>
                    <!-- Director 4 -->
                    <div class="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                        <div class="h-80 overflow-hidden">
                            <img src="./assets/images/about/Jevin.jpeg" alt="Director 1" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                        </div>
                        <div class="p-6 text-center">
                            <h3 class="text-xl font-bold text-gray-900 font-[Quicksand] mb-1">Mr. Jevin Fernando</h3>
                            <p class="text-yellow-600 font-dm-sans font-medium uppercase text-sm tracking-wider">Executive Director</p>
                        </div>
                    </div>

                    <!-- Director 5 -->
                    <!--<div class="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform">-->
                    <!--    <div class="h-80 overflow-hidden">-->
                    <!--        <img src="./assets/images/about/person.jpg" alt="Director 2" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">-->
                    <!--    </div>-->
                    <!--    <div class="p-6 text-center">-->
                    <!--        <h3 class="text-xl font-bold text-gray-900 font-[Quicksand] mb-1">Michael Johnson</h3>-->
                    <!--        <p class="text-yellow-600 font-dm-sans font-medium uppercase text-sm tracking-wider">Finance & Accounts</p>-->
                    <!--    </div>-->
                    <!--</div>-->

                    <!-- Director 6 -->
                    <!--<div class="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">-->
                    <!--    <div class="h-80 overflow-hidden">-->
                    <!--        <img src="./assets/images/about/person.jpg" alt="Director 3" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">-->
                    <!--    </div>-->
                    <!--    <div class="p-6 text-center">-->
                    <!--        <h3 class="text-xl font-bold text-gray-900 font-[Quicksand] mb-1">David Wilson</h3>-->
                    <!--        <p class="text-yellow-600 font-dm-sans font-medium uppercase text-sm tracking-wider">Finance & Accounts</p>-->
                    <!--    </div>-->
                    <!--</div>-->
                    <!-- Director 7 -->
                    <!--<div class="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform">-->
                    <!--    <div class="h-80 overflow-hidden">-->
                    <!--        <img src="./assets/images/about/person.jpg" alt="Director 2" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">-->
                    <!--    </div>-->
                    <!--    <div class="p-6 text-center">-->
                    <!--        <h3 class="text-xl font-bold text-gray-900 font-[Quicksand] mb-1">David Wilson</h3>-->
                    <!--        <p class="text-yellow-600 font-dm-sans font-medium uppercase text-sm tracking-wider">Sales & Operations</p>-->
                    <!--    </div>-->
                    <!--</div>-->

                    <!-- Director 8 -->
                    <!--<div class="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">-->
                    <!--    <div class="h-80 overflow-hidden">-->
                    <!--        <img src="./assets/images/about/person.jpg" alt="Director 3" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">-->
                    <!--    </div>-->
                    <!--    <div class="p-6 text-center">-->
                    <!--        <h3 class="text-xl font-bold text-gray-900 font-[Quicksand] mb-1">David Wilson</h3>-->
                    <!--        <p class="text-yellow-600 font-dm-sans font-medium uppercase text-sm tracking-wider">Sales & Operations</p>-->
                    <!--    </div>-->
                    <!--</div>-->
                </div>
            </div>
        </section>

        <!-- What Makes Us Different Section -->
        <section class="mt-10 lg:mt-0 lg:py-20 py-10 bg-gray-100" data-aos="fade-up">
            <div class="container mx-auto px-4">
                <div class="max-w-7xl mx-auto">
                    <div class="grid lg:grid-cols-2 grid-cols-1 gap-12 items-center">
                        <!-- Left Side - Image -->
                        <div class="" data-aos="fade-up" data-aos-delay="100">
                        <h2 class="lg:text-4xl text-3xl  font-bold text-gray-900 font-[Quicksand] mb-5 text-left" data-aos="fade-up" data-aos-delay="150">
                                What Makes Us Different
                            </h2>
                            <div class="relative  rounded-tl-3xl rounded-tr-3xl rounded-br-3xl rounded-bl-[120px] overflow-hidden" data-aos="zoom-in" data-aos-delay="200">
                                <img src="./assets/images/about/abt-img.webp" alt="Travel Experience" class="w-full lg:h-[500px] h-[400px] object-cover">
                            </div>
                        </div>

                        <!-- Right Side - Content -->
                        <div class="" data-aos="fade-up" data-aos-delay="250">
                        
                            
                            <div class="space-y-6">
                                <!-- Bullet Point 1 -->
                                <div class="flex items-start space-x-4" data-aos="fade-up" data-aos-delay="280">
                                    <div class="flex-shrink-0 mt-1">
                                        <div class="w-5 h-5 flex items-center justify-center">
                                            <img src="./assets/icons/tick.png" alt="Tick" class="w-full h-full object-cover">
                                        </div>
                                    </div>
                                    <div>
                                        <h3 class="text-lg font-bold text-gray-900 font-dm-sans mb-1">Experienced Travel Experts:</h3>
                                        <p class="text-gray-700 font-dm-sans">Our team combines deep destination knowledge with decades of industry experience to craft the perfect journey.</p>
                                    </div>
                                </div>

                                <!-- Bullet Point 2 -->
                                <div class="flex items-start space-x-4" data-aos="fade-up" data-aos-delay="310">
                                    <div class="flex-shrink-0 mt-1">
                                        <div class="w-5 h-5 flex items-center justify-center">
                                            <img src="./assets/icons/tick.png" alt="Tick" class="w-full h-full object-cover">
                                        </div>
                                    </div>
                                    <div>
                                        <h3 class="text-lg font-bold text-gray-900 font-dm-sans mb-1">Unmatched Reliability:</h3>
                                        <p class="text-gray-700 font-dm-sans">30+ years of consistent service has earned us the trust of countless travelers and corporate clients.</p>
                                    </div>
                                </div>

                                <!-- Bullet Point 3 -->
                                <div class="flex items-start space-x-4" data-aos="fade-up" data-aos-delay="340">
                                    <div class="flex-shrink-0 mt-1">
                                        <div class="w-5 h-5 flex items-center justify-center">
                                            <img src="./assets/icons/tick.png" alt="Tick" class="w-full h-full object-cover">
                                        </div>
                                    </div>
                                    <div>
                                        <h3 class="text-lg font-bold text-gray-900 font-dm-sans mb-1">Affordable Luxury:</h3>
                                        <p class="text-gray-700 font-dm-sans">We balance comfort and cost, ensuring you enjoy premium experiences at the best value.</p>
                                    </div>
                                </div>

                                <!-- Bullet Point 4 -->
                                <div class="flex items-start space-x-4" data-aos="fade-up" data-aos-delay="370">
                                    <div class="flex-shrink-0 mt-1">
                                        <div class="w-5 h-5 flex items-center justify-center">
                                            <img src="./assets/icons/tick.png" alt="Tick" class="w-full h-full object-cover">
                                        </div>
                                    </div>
                                    <div>
                                        <h3 class="text-lg font-bold text-gray-900 font-dm-sans mb-1">Seamless & Authentic Journeys:</h3>
                                        <p class="text-gray-700 font-dm-sans">Every detail handled with care, showcasing local culture, cuisine, and hidden gems.</p>
                                    </div>
                                </div>

                                <!-- Bullet Point 5 -->
                                <div class="flex items-start space-x-4" data-aos="fade-up" data-aos-delay="400">
                                    <div class="flex-shrink-0 mt-1">
                                        <div class="w-5 h-5 flex items-center justify-center">
                                            <img src="./assets/icons/tick.png" alt="Tick" class="w-full h-full object-cover">
                                        </div>
                                    </div>
                                    <div>
                                        <h3 class="text-lg font-bold text-gray-900 font-dm-sans mb-1">Safety First:</h3>
                                        <p class="text-gray-700 font-dm-sans">We partner only with trusted vendors and prioritize your safety at every step.</p>
                                    </div>
                                </div>

                                <!-- Bullet Point 6 -->
                                <div class="flex items-start space-x-4" data-aos="fade-up" data-aos-delay="430">
                                    <div class="flex-shrink-0 mt-1">
                                        <div class="w-5 h-5 flex items-center justify-center">
                                            <img src="./assets/icons/tick.png" alt="Tick" class="w-full h-full object-cover">
                                        </div>
                                    </div>
                                    <div>
                                        <h3 class="text-lg font-bold text-gray-900 font-dm-sans mb-1">Customer-Centric Approach:</h3>
                                        <p class="text-gray-700 font-dm-sans">Your satisfaction is our top priority—every journey is designed around your comfort and happiness.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Services Section -->
        <section class="py-20 bg-gray-50" data-aos="fade-up">
            <div class="container mx-auto px-4">
                <div class="max-w-7xl mx-auto">
                    <!-- Section Title -->
                    <div class="text-center mb-16" data-aos="fade-up" data-aos-delay="100">
                        <h2 class="lg:text-4xl text-3xl  font-bold text-gray-900 font-[Quicksand] mb-1" data-aos="fade-up" data-aos-delay="150">
                            Our Services
                        </h2>
                        <p class="text-lg text-gray-600 font-dm-sans max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
                            Comprehensive travel solutions designed to make your journey seamless
                        </p>
                    </div>

                    <!-- Services Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                        <!-- Row 1 -->
                        <div class="group bg-white rounded-2xl p-4 text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 flex" data-aos="fade-up" data-aos-delay="0">
                            <div class="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center  group-hover:bg-gray-100 transition-colors mr-6">
                                <i class="fi fi-rr-plane text-gray-700 text-2xl flex items-center justify-center "></i>
                            </div>
                            <div>
                            <h3 class="text-gray-900 font-dm-sans font-semibold text-base">Flight Tickets</h3>
                            <p class="text-gray-500 text-sm">Domestic & International</p>
                            </div>
                        </div>
                        
                        <div class="group bg-white rounded-2xl p-4 text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 flex" data-aos="fade-up" data-aos-delay="60">
                            <div class="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center  group-hover:bg-gray-100 transition-colors mr-6">
                                <i class="fi fi-rr-passport text-gray-700 text-2xl flex items-center justify-center "></i>
                            </div>
                            <div>
                            <h3 class="text-gray-900 font-dm-sans font-semibold text-base">Visa Services</h3>
                            <p class="text-gray-500 text-sm">GCC & Schengen (all categories)</p>
                            </div>
                        </div>
                        
                        <div class="group bg-white rounded-2xl p-4 text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 flex" data-aos="fade-up" data-aos-delay="120">
                            <div class="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center  group-hover:bg-gray-100 transition-colors mr-6">
                                <i class="fi fi-rr-globe text-gray-700 text-2xl flex items-center justify-center "></i>
                            </div>
                            <div>
                            <h3 class="text-gray-900 font-dm-sans font-semibold text-base">Holidays</h3>
                            <p class="text-gray-500 text-sm">In Bound / Out Bound</p>
                            </div>
                        </div>
                        
                        <div class="group bg-white rounded-2xl p-4 text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 flex" data-aos="fade-up" data-aos-delay="180">
                        <div class="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center  group-hover:bg-gray-100 transition-colors mr-6">
                                <i class="fi fi-rr-shield-check text-gray-700 text-2xl flex items-center justify-center "></i>
                            </div>
                            <div>
                            <h3 class="text-gray-900 font-dm-sans font-semibold text-base">Travel Insurance</h3>
                            <p class="text-gray-500 text-sm">Complete Protection</p>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                        <!-- Row 2 -->
                        <div class="group bg-white rounded-2xl p-4 text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 flex" data-aos="fade-up" data-aos-delay="0">
                            <div class="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center  group-hover:bg-gray-100 transition-colors mr-6">
                                <i class="fi fi-rr-certificate text-gray-700 text-2xl flex items-center justify-center "></i>
                            </div>
                            <div>
                                <h3 class="text-gray-900 font-dm-sans font-semibold text-base">PCC Certificate</h3>
                                <p class="text-gray-500 text-sm">Police Clearance</p>
                            </div>
                        </div>
                        
                        <div class="group bg-white rounded-2xl p-4 text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 flex" data-aos="fade-up" data-aos-delay="60">
                            <div class="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center  group-hover:bg-gray-100 transition-colors mr-6">
                                <i class="fi fi-rr-money-bill-wave text-gray-700 text-2xl flex items-center justify-center "></i>
                            </div>
                                <div>
                            <h3 class="text-gray-900 font-dm-sans font-semibold text-base">Foreign Exchange</h3>
                            <p class="text-gray-500 text-sm">Currency Services</p>
                            </div>
                        </div>
                        
                        <div class="group bg-white rounded-2xl p-4 text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 flex" data-aos="fade-up" data-aos-delay="120">
                            <div class="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center  group-hover:bg-gray-100 transition-colors mr-6">
                                <i class="fi fi-rr-building text-gray-700 text-2xl flex items-center justify-center "></i>
                            </div>
                            <div>
                            <h3 class="text-gray-900 font-dm-sans font-semibold text-base">MICE</h3>
                            <p class="text-gray-500 text-sm">Corporate Events</p>
                            </div>
                        </div>
                        
                        <div class="group bg-white rounded-2xl p-4 text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 flex" data-aos="fade-up" data-aos-delay="180">
                            <div class="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center  group-hover:bg-gray-100 transition-colors mr-6">
                                    <i class="fi fi-rr-church text-gray-700 text-2xl flex items-center justify-center "></i>
                            </div>
                            <div>
                                    <h3 class="text-gray-900 font-dm-sans font-semibold text-base">Pilgrimage Tours</h3>
                                    <p class="text-gray-500 text-sm">Europe / Holyland</p>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                        <!-- Row 3 -->
                        <div class="group bg-white rounded-2xl p-4 text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 flex" data-aos="fade-up" data-aos-delay="0">
                            <div class="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center  group-hover:bg-gray-100 transition-colors mr-6">
                                <i class="fi fi-rr-passport text-gray-700 text-2xl flex items-center justify-center "></i>
                            </div>
                            <div>
                            <h3 class="text-gray-900 font-dm-sans font-semibold text-base">Passport Services</h3>
                            <p class="text-gray-500 text-sm">Documentation Help</p>
                            </div>
                            
                        </div>
                        
                        <div class="group bg-white rounded-2xl p-4 text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 flex" data-aos="fade-up" data-aos-delay="60">
                            <div class="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center  group-hover:bg-gray-100 transition-colors mr-6">
                                <i class="fi fi-rr-hotel text-gray-700 text-2xl flex items-center justify-center "></i>
                            </div>
                            <div>
                            <h3 class="text-gray-900 font-dm-sans font-semibold text-base">Hotel Bookings</h3>
                            <p class="text-gray-500 text-sm">Domestic & International</p>
                            </div>
                            
                        </div>
                        
                        <div class="group bg-white rounded-2xl p-4 text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 flex" data-aos="fade-up" data-aos-delay="120">
                            <div class="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center  group-hover:bg-gray-100 transition-colors mr-6">
                                <i class="fi fi-rr-document text-gray-700 text-2xl flex items-center justify-center "></i>
                            </div>
                            <div>
                                <h3 class="text-gray-900 font-dm-sans font-semibold text-base">Embassy Attestation</h3>
                                <p class="text-gray-500 text-sm">Document Services</p>
                            </div>
                            
                        </div>
                        
                            <div class="group bg-white rounded-2xl p-4 text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 flex" data-aos="fade-up" data-aos-delay="180">
                            <div class="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center  group-hover:bg-gray-100 transition-colors mr-6">
                                <i class="fi fi-rr-ferris-wheel text-gray-700 text-2xl flex items-center justify-center "></i>
                            </div>
                            <div>
                                <h3 class="text-gray-900 font-dm-sans font-semibold text-base">Cruise Lines</h3>
                                <p class="text-gray-500 text-sm">Ferry Tickets</p>
                            </div>
                            <div>
                            
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                        <!-- Row 4 -->
                        <div class="group bg-white rounded-2xl p-4 text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 flex" data-aos="fade-up" data-aos-delay="0">
                            <div class="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center  group-hover:bg-gray-100 transition-colors mr-6">
                                <i class="fi fi-rr-plane text-gray-700 text-2xl flex items-center justify-center "></i>
                            </div>
                            <div>
                                <h3 class="text-gray-900 font-dm-sans font-semibold text-base">Airport Assistance</h3>
                                <p class="text-gray-500 text-sm">All Over The World</p>
                            </div>
                            <div>
                            
                            </div>
                        </div>
                        
                        <div class="group bg-white rounded-2xl p-4 text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 flex" data-aos="fade-up" data-aos-delay="60">
                                <div class="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center  group-hover:bg-gray-100 transition-colors mr-6">  
                                <i class="fi fi-rr-concierge-bell text-gray-700 text-2xl flex items-center justify-center "></i>
                            </div>
                            <div>
                                <h3 class="text-gray-900 font-dm-sans font-semibold text-base">Airport Lounge</h3>
                                <p class="text-gray-500 text-sm">Meet & Greet Services</p>
                            </div>
                          
                        </div>
                        
                        <div class="group bg-white rounded-2xl p-4 text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 flex" data-aos="fade-up" data-aos-delay="120">
                            <div class="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center  group-hover:bg-gray-100 transition-colors mr-6">
                                <i class="fi fi-rr-bus text-gray-700 text-2xl flex items-center justify-center "></i>
                            </div>
                            <div>
                                <h3 class="text-gray-900 font-dm-sans font-semibold text-base">Bus / Train</h3>
                                <p class="text-gray-500 text-sm">Bookings</p>
                            </div>
                            <div>
                           
                            </div>
                        </div>
                        
                        <div class="group bg-white rounded-2xl p-4 text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 flex" data-aos="fade-up" data-aos-delay="180">
                            <div class="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center  group-hover:bg-gray-100 transition-colors mr-6">
                                <i class="fi fi-rr-train text-gray-700 text-2xl flex items-center justify-center "></i>
                            </div>
                            <div>
                                <h3 class="text-gray-900 font-dm-sans font-semibold text-base">Eurail / Swiss Pass</h3>
                                <p class="text-gray-500 text-sm">Rail Travel</p>
                            </div>
                            <div>
                          
                            </div>
                        </div>
                    </div>

                    <!-- Row 5 - Centered -->
                    <div class="flex justify-center">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:max-w-6xl w-full">
                            <div class="group bg-white rounded-2xl p-4 text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 flex" data-aos="fade-up" data-aos-delay="0">
                                        <div class="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center  group-hover:bg-gray-100 transition-colors mr-6">
                                    <i class="fi fi-rr-child text-gray-700 text-2xl flex items-center justify-center "></i>
                                </div>
                                <div>
                                    <h3 class="text-gray-900 font-dm-sans font-semibold text-base">Un-accompanied Child</h3>
                                    <p class="text-gray-500 text-sm">Travel Assistance</p>
                                </div>
                                <div>
                                </div>
                            </div>
                            
                            <div class="group bg-white rounded-2xl p-4 text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 flex" data-aos="fade-up" data-aos-delay="60">
                                <div class="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center  group-hover:bg-gray-100 transition-colors mr-6">
                                    <i class="fi fi-rr-book text-gray-700 text-2xl flex items-center justify-center "></i>
                                </div>
                                <div>
                                    <h3 class="text-gray-900 font-dm-sans font-semibold text-base">Educational Travel</h3>
                                    <p class="text-gray-500 text-sm">Assistance</p>
                                </div>
                                <div>
                                </div>
                            </div>
                            
                                <div class="group bg-white rounded-2xl p-4 text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 flex" data-aos="fade-up" data-aos-delay="120">
                                <div class="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center  group-hover:bg-gray-100 transition-colors mr-6">
                                    <i class="fi fi-rr-car text-gray-700 text-2xl flex items-center justify-center "></i>
                                </div>
                                <div>
                                    <h3 class="text-gray-900 font-dm-sans font-semibold text-base">Car Rentals</h3>
                                    <p class="text-gray-500 text-sm">Throughout India</p>
                                </div>
                                <div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Branch Locations Section -->
        <!--<section class="py-20 bg-white" data-aos="fade-up">-->
        <!--    <div class="container mx-auto px-4">-->
        <!--        <div class="text-center mb-16">-->
        <!--            <h2 class="lg:text-4xl text-3xl  font-bold text-gray-900 font-[Quicksand] mb-1">Our Locations</h2>-->
        <!--            <p class="text-lg text-gray-600 font-dm-sans max-w-2xl mx-auto">Visit us at our offices across the globe.</p>-->
        <!--        </div>-->

        <!--        <div class="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">-->
                    <!-- Map View -->
        <!--            <div class="bg-gray-100 rounded-3xl overflow-hidden min-h-[400px] relative">-->
                        <!-- Placeholder for Map -->
        <!--                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124409.02058694002!2d80.1972828!3d12.9877797!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265ea4f7d3361%3A0x6e61a70b6863d433!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1706857642651!5m2!1sen!2sin" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" class="absolute inset-0 grayscale contrast-125 opacity-80"></iframe>-->
        <!--            </div>-->

                    <!-- Locations List -->
        <!--            <div class="space-y-6">-->
                        <!-- Location 1 -->
        <!--                <div class="bg-gray-50 p-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-100">-->
        <!--                    <div class="flex items-start gap-4">-->
        <!--                        <div class="w-10 h-10 bg-white border border-gray-900 text-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">-->
        <!--                            <i class="fi fi-rr-marker flex item-center justify-center"></i>-->
        <!--                        </div>-->
        <!--                        <div>-->
        <!--                            <h3 class="text-xl font-bold text-gray-900 font-[Quicksand] mb-2">Corporate Office - Chennai</h3>-->
        <!--                            <p class="text-gray-600 font-dm-sans mb-2">123, Anna Salai, Chennai, Tamil Nadu - 600002</p>-->
        <!--                            <p class="text-gray-600 font-dm-sans"><strong>Phone:</strong> +91 99408 82200</p>-->
        <!--                        </div>-->
        <!--                    </div>-->
        <!--                </div>-->

                         <!-- Location 2 -->
        <!--                <div class="bg-gray-50 p-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-100">-->
        <!--                    <div class="flex items-start gap-4">-->
        <!--                        <div class="w-10 h-10 bg-white border border-gray-900 text-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">-->
        <!--                            <i class="fi fi-rr-marker flex item-center justify-center"></i>-->
        <!--                        </div>-->
        <!--                        <div>-->
        <!--                            <h3 class="text-xl font-bold text-gray-900 font-[Quicksand] mb-2">Branch Office - Bangalore</h3>-->
        <!--                            <p class="text-gray-600 font-dm-sans mb-2">45, MG Road, Bangalore, Karnataka - 560001</p>-->
        <!--                            <p class="text-gray-600 font-dm-sans"><strong>Phone:</strong> +91 95855 41102</p>-->
        <!--                        </div>-->
        <!--                    </div>-->
        <!--                </div>-->

                         <!-- Location 3 -->
        <!--                <div class="bg-gray-50 p-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-100">-->
        <!--                    <div class="flex items-start gap-4">-->
        <!--                        <div class="w-10 h-10 bg-white border border-gray-900 text-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">-->
        <!--                            <i class="fi fi-rr-marker flex item-center justify-center"></i>-->
        <!--                        </div>-->
        <!--                        <div>-->
        <!--                            <h3 class="text-xl font-bold text-gray-900 font-[Quicksand] mb-2">International Office - Dubai</h3>-->
        <!--                            <p class="text-gray-600 font-dm-sans mb-2">Business Bay, Dubai, UAE</p>-->
        <!--                            <p class="text-gray-600 font-dm-sans"><strong>Phone:</strong> +971 50 123 4567</p>-->
        <!--                        </div>-->
        <!--                    </div>-->
        <!--                </div>-->
        <!--            </div>-->
        <!--        </div>-->
        <!--    </div>-->
        <!--</section>-->

        <!-- Testimonials Section -->
        <section class="py-20 bg-gray-50" data-aos="fade-up">
            <div class="container mx-auto px-4">
                 <!-- Section Header -->
                 <div class="text-center mb-16" data-aos="fade-up">
                     <h2 class="lg:text-4xl text-3xl  font-bold text-gray-800 font-[Quicksand] mb-1">
                         What Our Clients Say
                     </h2>
                     <p class="text-lg text-gray-600 font-dm-sans max-w-2xl mx-auto">
                         Our travellers share their unforgettable experiences.
                     </p>
                 </div>
 
                 <!-- Testimonials Carousel -->
                 <div class="mb-12">
                     <div id="testimonialsCarousel" class="splide">
                         <div class="splide__track">
                             <ul class="splide__list">
                                 <!-- Testimonial 1 -->
                                 <li class="splide__slide">
                                     <div class="bg-white rounded-3xl p-8 shadow-sm h-full border border-gray-100">
                                         <div class="flex text-yellow-400 mb-4 text-sm gap-1">
                                             <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                                         </div>
                                         <p class="text-gray-700 font-dm-sans mb-6 leading-relaxed">"Excellent planning and execution. Our trip to Europe was hassle-free and memorable thanks to Mangalam Tours."</p>
                                         <div>
                                             <h4 class="font-bold text-gray-900 font-dm-sans">Rajesh Kumar</h4>
                                             <p class="text-gray-500 text-sm font-dm-sans">Chennai</p>
                                         </div>
                                     </div>
                                 </li>
                                 <!-- Testimonial 2 -->
                                 <li class="splide__slide">
                                     <div class="bg-white rounded-3xl p-8 shadow-sm h-full border border-gray-100">
                                         <div class="flex text-yellow-400 mb-4 text-sm gap-1">
                                             <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                                         </div>
                                         <p class="text-gray-700 font-dm-sans mb-6 leading-relaxed">"Professional service from start to finish. The visa process was smooth and the itinerary was perfect."</p>
                                         <div>
                                             <h4 class="font-bold text-gray-900 font-dm-sans">Sarah Thomas</h4>
                                             <p class="text-gray-500 text-sm font-dm-sans">Bangalore</p>
                                         </div>
                                     </div>
                                 </li>
                                 <!-- Testimonial 3 -->
                                 <li class="splide__slide">
                                     <div class="bg-white rounded-3xl p-8 shadow-sm h-full border border-gray-100">
                                         <div class="flex text-yellow-400 mb-4 text-sm gap-1">
                                             <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                                         </div>
                                         <p class="text-gray-700 font-dm-sans mb-6 leading-relaxed">"Great experience with the honeymoon package. Everything was arranged beautifully."</p>
                                         <div>
                                             <h4 class="font-bold text-gray-900 font-dm-sans">Arun & Meera</h4>
                                             <p class="text-gray-500 text-sm font-dm-sans">Kochi</p>
                                         </div>
                                     </div>
                                 </li>
                                 <!-- Testimonial 4 -->
                                  <li class="splide__slide">
                                     <div class="bg-white rounded-3xl p-8 shadow-sm h-full border border-gray-100">
                                         <div class="flex text-yellow-400 mb-4 text-sm gap-1">
                                             <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                                         </div>
                                         <p class="text-gray-700 font-dm-sans mb-6 leading-relaxed">"The best travel agency I have dealt with. Highly recommended for corporate travel."</p>
                                         <div>
                                             <h4 class="font-bold text-gray-900 font-dm-sans">Karthik R</h4>
                                             <p class="text-gray-500 text-sm font-dm-sans">Hyderabad</p>
                                         </div>
                                     </div>
                                 </li>
                             </ul>
                         </div>
                     </div>
                 </div>
            </div>
        </section>

    </main>
    
    <?php include './components/footer.php'; ?>
    <?php include './components/Customize.php'; ?>
    <?php include './components/FixedCustomizeButton.php'; ?>
    <?php 
    include './components/MobileNav.php';
    responsiveMenu('about'); // Set 'about' as active page
    ?>

  <?php include './script.php'; ?>

</body>
</html>
