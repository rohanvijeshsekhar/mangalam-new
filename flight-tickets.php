<!DOCTYPE html>
<html lang="en">
<head>
    <?php include 'head.php'; ?>
    <title>Flight Tickets | Mangalam Travel & Tours</title>
</head>
<body class="font-dm-sans text-gray-700 antialiased overflow-x-hidden p-0 m-0 relative w-full h-full bg-slate-50">

    <?php include './components/header.php'; ?>

    <main>
        <!-- Hero Section -->
        <section class="py-16 md:py-20 mt-10 bg-white">
            <div class="container mx-auto px-4">
                <div class="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
                    <!-- Text Side -->
                    <div class="w-full md:w-1/2" data-aos="fade-right">
                        <span class="text-sky-600 font-bold tracking-wider text-xs capitalize mb-2 block">Smart Air Travel</span>
                        <h1 class="text-4xl md:text-5xl font-medium text-gray-900 font-[Quicksand] mb-6 leading-tight">
                            Fly Smarter with <span class="font-bold">Mangalam</span>
                        </h1>
                        <p class="text-gray-600 mb-6 leading-relaxed font-dm-sans text-lg">
                            We provide reliable and competitive domestic and international air ticketing services tailored for individuals, families, groups, and corporate travellers.
                        </p>
                        <p class="text-gray-600 leading-relaxed font-dm-sans">
                            Backed by strong airline partnerships and experienced travel professionals, we ensure the best possible fares with smooth booking and dependable after-sales support. Whether it’s a quick business trip or a long-awaited family holiday, we make flying simpler, smarter, and stress-free.
                        </p>
                    </div>

                    <!-- Image Side -->
                    <div class="w-full md:w-1/2 relative" data-aos="fade-left">
                        <div class="relative rounded-2xl overflow-hidden shadow-2xl">
                             <img src="./assets/images/tickets-1.webp" alt="Flight Tickets" class="w-full h-[400px] object-cover">
                             <!-- Floating Badge -->
                             <div class="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border-l-4 border-sky-500 max-w-xs hidden md:block">
                                 <p class="text-gray-800 font-medium italic text-sm">"Travel shouldn't be complicated. We simply make it fly."</p>
                             </div>
                        </div>
                        <!-- Decorative Pattern -->
                        <div class="absolute -z-10 -bottom-10 -right-10 w-64 h-64 bg-sky-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
                        <div class="absolute -z-10 -top-10 -left-10 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
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

        <!-- Services Grid -->
        <section class="py-16 bg-slate-50">
            <div class="container mx-auto px-4 relative z-10">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-medium font-[Quicksand] text-slate-900 mb-2">Our Air Ticketing <span class="font-bold">Services</span></h2>
                    <p class="text-slate-500 text-base">Comprehensive solutions for all your flying needs.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    <!-- Service 1 -->
                    <div class="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group" data-aos="fade-up">
                        <div class="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                            <i class="fi fi-rr-plane-alt text-2xl flex items-center justify-center"></i>
                        </div>
                        <h3 class="text-xl font-bold font-[Quicksand] text-slate-900 mb-3">Domestic Flight Tickets</h3>
                        <p class="text-slate-600 text-sm leading-relaxed">Hassle-free bookings across all major Indian airlines with flexible options, competitive pricing, and timely support.</p>
                    </div>

                    <!-- Service 2 -->
                    <div class="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group" data-aos="fade-up" data-aos-delay="100">
                        <div class="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                            <i class="fi fi-rr-earth-americas text-2xl flex items-center justify-center"></i>
                        </div>
                        <h3 class="text-xl font-bold font-[Quicksand] text-slate-900 mb-3">International Flight Tickets</h3>
                        <p class="text-slate-600 text-sm leading-relaxed">Global flight bookings with optimized routes, best available fares, and assistance across multiple airlines and destinations.</p>
                    </div>

                    <!-- Service 3 -->
                    <div class="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group" data-aos="fade-up" data-aos-delay="200">
                        <div class="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                            <i class="fi fi-rr-users-alt text-2xl flex items-center justify-center"></i>
                        </div>
                        <h3 class="text-xl font-bold font-[Quicksand] text-slate-900 mb-3">Group & Corporate Bookings</h3>
                        <p class="text-slate-600 text-sm leading-relaxed">Specially negotiated fares, coordinated seat allocations, and streamlined booking solutions for groups and corporates.</p>
                    </div>

                    <!-- Service 4 -->
                    <div class="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group lg:col-span-1.5" data-aos="fade-up" data-aos-delay="300">
                        <div class="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                            <i class="fi fi-rr-stats text-2xl flex items-center justify-center"></i>
                        </div>
                        <h3 class="text-xl font-bold font-[Quicksand] text-slate-900 mb-3">Fare Optimization & Routing</h3>
                        <p class="text-slate-600 text-sm leading-relaxed">Expert guidance to secure cost-effective fares, convenient connections, and travel schedules that suit your needs.</p>
                    </div>

                     <!-- Service 5 -->
                     <div class="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group lg:col-span-1.5" data-aos="fade-up" data-aos-delay="400">
                        <div class="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform">
                            <i class="fi fi-rr-headset text-2xl flex items-center justify-center"></i>
                        </div>
                        <h3 class="text-xl font-bold font-[Quicksand] text-slate-900 mb-3">After-Sales Support</h3>
                        <p class="text-slate-600 text-sm leading-relaxed">Dedicated assistance for rescheduling, cancellations, refunds, re-issuance, and airline-related queries—when it matters most.</p>
                    </div>
                </div>
            </div>
        </section>

         <!-- Why Book with Mangalam Section -->
         <section class="py-20 bg-white">
            <div class="container mx-auto px-4 max-w-6xl">
                <div class="flex flex-col lg:flex-row gap-16 items-center">
                     <!-- Image Side -->
                     <div class="lg:w-1/2 relative" data-aos="fade-right">
                        <div class="relative rounded-3xl overflow-hidden shadow-2xl">
                             <img src="./assets/images/package-img.webp" alt="Why Book with Us" class="w-full h-[400px] object-cover">
                        </div>
                        <!-- Decorative Pattern -->
                        <div class="absolute -z-10 -bottom-10 -left-10 w-64 h-64 bg-sky-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
                     </div>

                    <!-- Text / Features Side -->
                    <div class="lg:w-1/2" data-aos="fade-left">
                        <h2 class="text-3xl md:text-4xl font-medium font-[Quicksand] text-slate-900 mb-6 leading-tight">Why Book with <span class="font-bold">Mangalam?</span></h2>
                        <p class="text-slate-600 leading-relaxed mb-8 text-lg">
                            We believe booking a flight should feel reassuring—not complicated.
                        </p>
                        
                        <div class="space-y-6">
                            <div class="flex items-start gap-4">
                                <div class="w-10 h-10 rounded-full bg-sky-50 flex-shrink-0 flex items-center justify-center text-sky-600 mt-1">
                                    <i class="fi fi-rr-check text-lg flex items-center justify-center"></i>
                                </div>
                                <div>
                                    <h4 class="text-slate-900 font-bold font-[Quicksand] text-lg">Competitive Fares</h4>
                                    <p class="text-slate-500 text-sm">Best value through trusted airline partnerships.</p>
                                </div>
                            </div>

                            <div class="flex items-start gap-4">
                                <div class="w-10 h-10 rounded-full bg-indigo-50 flex-shrink-0 flex items-center justify-center text-indigo-600 mt-1">
                                    <i class="fi fi-rr-user-headset text-lg flex items-center justify-center"></i>
                                </div>
                                <div>
                                    <h4 class="text-slate-900 font-bold font-[Quicksand] text-lg">Personalized Assistance</h4>
                                    <p class="text-slate-500 text-sm">Booking guidance from real travel experts.</p>
                                </div>
                            </div>

                            <div class="flex items-start gap-4">
                                <div class="w-10 h-10 rounded-full bg-emerald-50 flex-shrink-0 flex items-center justify-center text-emerald-600 mt-1">
                                    <i class="fi fi-rr-users text-lg flex items-center justify-center"></i>
                                </div>
                                <div>
                                    <h4 class="text-slate-900 font-bold font-[Quicksand] text-lg">Comprehensive Support</h4>
                                    <p class="text-slate-500 text-sm">For individuals, families, groups & corporates.</p>
                                </div>
                            </div>

                            <div class="flex items-start gap-4">
                                <div class="w-10 h-10 rounded-full bg-amber-50 flex-shrink-0 flex items-center justify-center text-amber-600 mt-1">
                                    <i class="fi fi-rr-shield-check text-lg flex items-center justify-center"></i>
                                </div>
                                <div>
                                    <h4 class="text-slate-900 font-bold font-[Quicksand] text-lg">Transparent Pricing</h4>
                                    <p class="text-slate-500 text-sm">Clear costs with no hidden fees or surprises.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="py-16 relative overflow-hidden bg-gray-900">
             <div class="absolute inset-0 bg-[url('./assets/images/pattern.png')] opacity-10"></div>
            <div class="container mx-auto px-4 text-center relative z-10">
                <h2 class="text-3xl md:text-4xl font-bold font-[Quicksand] text-white mb-4">Fly with Confidence</h2>
                <p class="text-blue-100 mb-8 max-w-2xl mx-auto">From the first enquiry to post-travel support, Mangalam Travel & Tours ensures your air travel experience is smooth, reliable, and professionally managed.</p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="contact.php" class="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-bold py-3 px-8 rounded-xl hover:bg-slate-100 transition-all shadow-lg">
                        Book Your Tickets
                    </a>
                    <a href="tel:+919585541102" class="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-bold py-3 px-8 rounded-xl hover:bg-white/10 transition-all">
                        <i class="fi fi-rr-phone-call flex justify-center items-center"></i> Speak to an Expert
                    </a>
                </div>
            </div>
        </section>

    </main>

    <?php include './components/footer.php'; ?>
    <?php include './components/Customize.php'; ?>
    <?php include './components/FixedCustomizeButton.php'; ?>
    <?php 
    include './components/MobileNav.php'; 
    responsiveMenu(''); 
    ?>
    <?php include 'script.php'; ?>
</body>
</html>
