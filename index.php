<!DOCTYPE html>
<html lang="en">
<?php
// Meta tags for Home Page
$pageTitle = 'Home - Mangalam Travel & Tours | Best Tour Packages & Travel Services';
$pageDescription = 'Discover amazing travel experiences with Mangalam Travel & Tours. Explore our customized tour packages, exciting activities, and ticket deals for unforgettable journeys.';
$pageKeywords = 'tour packages, travel tours, vacation packages, customized tours, holiday packages, travel services, Mangalam Tours, Dubai tours, travel deals';
$pageImage = './assets/images/logo/mangalam-tours-og.jpg';
$pageUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

// Include required files
include './head.php';
require_once __DIR__ . '/components/EnquiryOtpFields.php';
include './action/allDestinations.php';
include './action/allTickets.php';
include './action/allActivities.php';
include './action/blogs.php';
include './action/allTestimonials.php';
include './action/posters.php';
include './action/fetch_partners.php';
include './components/ActivityCard.php';


// Fetch and process data
$destinations = json_decode(allDestinations(''), true) ?: [];
$tickets = json_decode(allTickets('', 0), true) ?: [];
$activities = json_decode(allActivities(), true) ?: [];
$handpickedActivities = array_values(array_filter($activities, function ($activity) {
    return !empty($activity['title']) && !empty($activity['image']);
}));
$blogs = json_decode(allBlogs(), true) ?: [];
$testimonials = json_decode(allTestimonials(), true) ?: [];
$posters = array_values(array_filter(fetchActivePosters(), function ($poster) {
    return !empty($poster['image']);
}));

require_once __DIR__ . '/_class/query.php';
$homeQuery = new Query();
$partners = array_values(array_filter(getAllPartners($homeQuery), function ($partner) {
    return !empty($partner['logo']);
}));
$latestNotice = '';
$noticeResult = $homeQuery->selectData('data', 'notice', 'WHERE status != 0 ORDER BY notice_id DESC LIMIT 1');
if ($noticeResult && safe_mysqli_num_rows($noticeResult) > 0) {
    $noticeRow = safe_mysqli_fetch_assoc($noticeResult);
    $latestNotice = trim($noticeRow['data'] ?? '');
}
?>

<style>
    @keyframes letsGoBlink {
        0%, 100% {
            box-shadow: 0 0 0 rgba(220, 38, 38, 0.2);
            transform: translateY(0);
        }
        50% {
            box-shadow: 0 0 28px rgba(220, 38, 38, 0.34);
            transform: translateY(-2px);
        }
    }

    .blink-lets-go {
        position: relative;
        animation: letsGoBlink 1.8s ease-in-out infinite;
    }

    .blink-lets-go::after {
        content: '';
        position: absolute;
        inset: -6px;
        border-radius: inherit;
        /* border: 1px solid rgba(220, 38, 38, 0.25); */
        opacity: 0.75;
        pointer-events: none;
    }

    @media (prefers-reduced-motion: reduce) {
        .blink-lets-go {
            animation: none;
        }
        .blink-lets-go::after {
            display: none;
        }
    }

    .destination-menu {
        width: 100%;
        left: 0;
        max-height: 340px;
        z-index: 9999;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
    }

    .destination-menu.is-floating {
        position: fixed !important;
        z-index: 10050 !important;
    }

    .destination-menu-scroll {
        max-height: 240px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }

    .destination-menu-item {
        text-align: left;
        border-bottom: 1px solid rgba(229, 231, 235, 0.9);
    }

    .destination-menu-item:last-child {
        border-bottom: none;
    }
</style>

<body class="font-dm-sans bg-white">
    <!-- Header/Navigation -->
    <header class="fixed top-0 w-full z-50 bg-transparent">
        <nav class="container mx-auto p-2  flex items-center justify-between">
            <!-- Logo -->
            <div class="flex items-center">
                <div class="text-white">
                    <div class="flex items-center mb-1 w-[130px]">
                        <img src="./assets/images/logo.png" alt="Mangalam Tours Logo">
                    </div>
                </div>
            </div>

            <!-- Navigation Links -->
            <div class="hidden md:flex space-x-8 border !border-white border-opacity-30 backdrop-blur-sm px-4 py-2 rounded-full font-dm-sans">
                <a href="./" class="text-white hover:text-yellow-400 transition-colors font-dm-sans">Home</a>
                <a href="./holiday-package.php" class="text-white hover:text-yellow-400 transition-colors font-dm-sans">Holiday Packages</a>
                  <!-- Services Dropdown- -->
                <div class="relative group">
                    <button class="flex items-center gap-1 text-white hover:text-yellow-400 transition-colors font-dm-sans focus:outline-none">
                        Services 
                        <i class="fi fi-rr-angle-small-down pt-1 flex items-center justify-center"></i>
                    </button>
                    <div class="absolute top-full -left-4 mt-4 w-64 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                            <div class="py-2 text-left">
                                    <a href="flight-tickets.php" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium text-base">
                                Flight Tickets
                            </a>
                                <a href="global-visa-services.php" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium text-base">
                                 Visa Services
                             </a>
                              <a href="travel-insurance.php" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium text-base">
                                Travel Insurance
                            </a>
                           
                            <a href="miscellaneous.php" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium text-base">
                                Miscellaneous Services
                            </a>
                            <a href="mice-tourism.php" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium text-base">
                                MICE Tourism
                            </a>
                         <a href="cruises.php" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium text-base">
                                Cruises
                            </a>
                         
                          
                        </div>
                    </div>
                </div>
                <!-- <a href="./tickets.php" class="text-white hover:text-yellow-400 transition-colors font-dm-sans">Tickets</a> -->
                <a href="./attraction.php" class="text-white hover:text-yellow-400 transition-colors font-dm-sans">Attractions</a>
                
                
              
            </div>

            <!-- Header Icons -->
            <div class="flex items-center space-x-4">
                <a href="cart.php" class="cart-trigger p-2 border border-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors relative">
                    <div class="counter absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</div>
                    <i class="fi fi-rr-shopping-cart text-gray-100 text-lg flex items-center justify-center"></i>
                </a>

                <!-- Menu Dropdown Container -->
                <div class="relative">
                    <div id="menuDropdownTrigger" class="p-2 border border-gray-100/30 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all duration-300 group">
                        <i class="fi fi-br-grid text-white text-lg group-hover:scale-110 transition-transform duration-300 flex items-center justify-center"></i>
                    </div>

                    <!-- Dropdown Modal -->
                    <div id="menuDropdown" class="hidden absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden ring-1 ring-black/5 origin-top-right transition-all duration-200">
                        <div class="py-2">
                            <!-- Mobile Services Dropdown -->
                            <div class="md:hidden">
                                <details class="group">
                                    <summary class="flex items-center justify-between px-5 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer font-dm-sans font-medium select-none list-none [&::-webkit-details-marker]:hidden">
                                        Services
                                        <i class="fi fi-rr-angle-small-down transition-transform duration-300 group-open:rotate-180 flex items-center justify-center"></i>
                                    </summary>
                                    <div class="bg-gray-50 py-2">
                                          <a href="flight-tickets.php" class="block pl-8 pr-5 py-2 text-gray-600 hover:text-sky-500 transition-colors font-dm-sans text-sm">
                                           Flight Tickets
                                        </a>
                                         <a href="global-visa-services.php" class="block pl-8 pr-5 py-2 text-gray-600 hover:text-sky-500 transition-colors font-dm-sans text-sm">
                                         Visa Services
                                        </a>
                                        <a href="travel-insurance.php" class="block pl-8 pr-5 py-2 text-gray-600 hover:text-sky-500 transition-colors font-dm-sans text-sm">
                                          Travel Insurance
                                        </a>
                                      
                                        <a href="miscellaneous.php" class="block pl-8 pr-5 py-2 text-gray-600 hover:text-sky-500 transition-colors font-dm-sans text-sm">
                                            Miscellaneous Services
                                        </a>
                                        <a href="mice-tourism.php" class="block pl-8 pr-5 py-2 text-gray-600 hover:text-sky-500 transition-colors font-dm-sans text-sm">
                                            MICE Tourism
                                        </a>
                                        <a href="cruises.php" class="block pl-8 pr-5 py-2 text-gray-600 hover:text-sky-500 transition-colors font-dm-sans text-sm">
                                            Cruises
                                        </a>
                                       
                                        
                                    </div>
                                </details>
                            </div>
                            
                            <a href="about.php" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium">
                                About
                            </a>
                            <a href="contact.php" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium">
                                Contact
                            </a>
                            <a href="blog.php" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium">
                                Blog
                            </a>
                            <a href="career.php" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium">
                                Career
                            </a>
                            <div class="h-px bg-gray-100 mx-2 my-1"></div>
                            <a href="https://agents.mangalamtravel.com/Config/Login/Agent" target="_blank" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors font-dm-sans font-medium">
                                Agent Login Portal
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </header>
    <header id="mainFixedHeader" class="fixed left-0 right-0 top-0 z-[60] bg-white shadow-sm transition-all duration-300 opacity-0 pointer-events-none" style="display: flex; align-items: center; min-height:64px">
        <nav class="container mx-auto p-2 flex items-center justify-between">
            <!-- Logo -->
            <div class="flex items-center">
                <div class="text-gray-900">
                    <div class="flex items-center mb-1 w-[130px]">
                        <img src="./assets/images/logo-color.png" alt="Mangalam Tours Logo">
                    </div>
                </div>
            </div>
            <!-- Navigation Links -->
            <div class="hidden md:flex space-x-8 font-dm-sans">
                <a href="./" class="text-gray-900 hover:text-yellow-400 transition-colors font-dm-sans">Home</a>
                <a href="./holiday-package.php" class="text-gray-900 hover:text-yellow-400 transition-colors font-dm-sans">Holiday Packages</a>
                   <!-- Services Dropdown (Fixed Header) -->
                <div class="relative group">
                    <button class="flex items-center gap-1 text-gray-900 hover:text-yellow-400 transition-colors font-dm-sans focus:outline-none">
                        Services 
                        <i class="fi fi-rr-angle-small-down pt-1 flex items-center justify-center"></i>
                    </button>
                    <div class="absolute top-full -left-4 mt-4 w-64 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                        <div class="py-2 text-left">
                                   <a href="flight-tickets.php" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium text-base">
                                Flight Tickets
                            </a>
                            <a href="global-visa-services.php" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium text-base">
                                Visa Services
                            </a>
                             <a href="travel-insurance.php" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium text-base">
                                Travel Insurance
                            </a>
                           
                            <a href="miscellaneous.php" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium text-base">
                                Miscellaneous Services
                            </a>
                            <a href="mice-tourism.php" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium text-base">
                                MICE Tourism
                            </a>
                     
                           
                             <a href="cruises.php" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium text-base">
                                Cruises
                            </a>
                        </div>
                    </div>
                </div>
                <!-- <a href="./tickets.php" class="text-gray-900 hover:text-yellow-400 transition-colors font-dm-sans">Tickets</a> -->
                <a href="./attraction.php" class="text-gray-900 hover:text-yellow-400 transition-colors font-dm-sans">Attractions</a>
                
                
             
            </div>
            <!-- Header Icons -->
            <div class="flex items-center space-x-4">
                <a href="cart.php" class="cart-trigger p-2 border border-gray-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors relative">
                    <div class="counter absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</div>
                    <i class="fi fi-rr-shopping-cart text-gray-600 text-lg flex items-center justify-center"></i>
                </a>

                <!-- Menu Dropdown Container -->
                <div class="relative">
                    <div id="menuDropdownTrigger2" class="p-2 border border-gray-200 hover:bg-gray-50 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 group">
                        <i class="fi fi-br-grid text-gray-600 text-lg group-hover:scale-110 transition-transform duration-300 flex items-center justify-center"></i>
                    </div>

                    <!-- Dropdown Modal -->
                    <div id="menuDropdown2" class="hidden absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden ring-1 ring-black/5 origin-top-right transition-all duration-200">
                        <div class="py-2">
                            <!-- Mobile Services Dropdown -->
                            <div class="md:hidden">
                                <details class="group">
                                    <summary class="flex items-center justify-between px-5 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer font-dm-sans font-medium select-none list-none [&::-webkit-details-marker]:hidden">
                                        Services
                                        <i class="fi fi-rr-angle-small-down transition-transform duration-300 group-open:rotate-180"></i>
                                    </summary>
                                    <div class="bg-gray-50 py-2">
                                                                                <a href="flight-tickets.php" class="block pl-8 pr-5 py-2 text-gray-600 hover:text-sky-500 transition-colors font-dm-sans text-sm">
                                           Flight Tickets
                                        </a>
                                        <a href="global-visa-services.php" class="block pl-8 pr-5 py-2 text-gray-600 hover:text-sky-500 transition-colors font-dm-sans text-sm">
                                          Visa Services
                                        </a>
                                        <a href="travel-insurance.php" class="block pl-8 pr-5 py-2 text-gray-600 hover:text-sky-500 transition-colors font-dm-sans text-sm">
                                          Travel Insurance
                                        </a>
                                     
                                        <a href="miscellaneous.php" class="block pl-8 pr-5 py-2 text-gray-600 hover:text-sky-500 transition-colors font-dm-sans text-sm">
                                            Miscellaneous Services
                                        </a>
                                        <a href="mice-tourism.php" class="block pl-8 pr-5 py-2 text-gray-600 hover:text-sky-500 transition-colors font-dm-sans text-sm">
                                            MICE Tourism
                                        </a>
                                           <a href="cruises.php" class="block pl-8 pr-5 py-2 text-gray-600 hover:text-sky-500 transition-colors font-dm-sans text-sm">
                                            Cruises
                                        </a>
                                    </div>
                                </details>
                            </div>

                           <a href="about.php" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium">
                                About
                            </a>
                            <a href="contact.php" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium">
                                Contact
                            </a>
                            <a href="blog.php" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium">
                                Blog
                            </a>
                            <a href="career.php" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium">
                                Career
                            </a>
                            <div class="h-px bg-gray-100 mx-2 my-1"></div>
                            <a href="https://agents.mangalamtravel.com/Config/Login/Agent" target="_blank" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors font-dm-sans font-medium">
                                Agent Login Portal
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </header>
    <main>
        <?php if ($latestNotice !== ''): ?>
        <div class="mt-20 md:mt-24 bg-red-600 text-white text-center text-sm md:text-base font-dm-sans py-2.5 px-4 relative z-30">
            <?= htmlspecialchars($latestNotice) ?>
        </div>
        <?php endif; ?>
        <!-- Hero Section -->
        <section class="relative z-20 h-screen overflow-visible bg-cover bg-center bg-no-repeat" style="background-image: url('./assets/images/banner-img.webp');" data-aos="fade-up">
            <div class="relative z-10 flex flex-col items-center justify-center h-full overflow-visible text-center px-4 md:px-6">
                <!-- Trusted Travel Partner Badge -->
                <div class="border border-white border-opacity-30 backdrop-blur-sm rounded-full px-4 md:px-6 py-2 mb-6 md:mb-8" data-aos="fade-down" data-aos-delay="100">
                    <span class="text-white text-xs md:text-sm font-medium font-dm-sans">Trusted Travel Partner</span>
                </div>

                <!-- Main Title -->
                <h2 class="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-6 md:mb-8 leading-tight font-[Quicksand] px-4" data-aos="fade-up" data-aos-delay="200">
                    Explore the World<br>One Journey at a Time
                </h2>

                <!-- Subtitle -->
                <p class="text-sm sm:text-base md:text-lg lg:text-xl text-white mb-8 md:mb-12 lg:mb-16 max-w-4xl leading-relaxed font-dm-sans px-4" data-aos="fade-up" data-aos-delay="300">
                    Explore the world with Mangalam Travel & Tours - Curating unforgettable domestic & international travel experiences for over 3 decades.
                </p>

                <!-- Trip Customization Form -->
                <div class="trip-customize-form bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl md:rounded-3xl shadow-2xl max-w-2xl w-full mx-4 relative z-50 overflow-visible" data-aos="zoom-in" data-aos-delay="400">
                    <!-- Mobile Layout -->
                    <div class="block md:hidden overflow-visible p-4">
                        <!-- Mobile Title -->
                        <div class="text-white text-center mb-4 block lg:hidden">
                            <div class="text-2xl font-dm-sans mb-1 text-gray-100">
                                Customize <span class="font-semibold font-dm-sans text-gray-100">Your Trips</span>
                            </div>
                        </div>

                        <!-- Mobile Form -->
                        <div class="bg-white relative overflow-visible rounded-xl p-3 mb-3">
                            <div class="flex items-center overflow-visible">
                                <i class="fi fi-rr-marker text-gray-700 text-lg mr-3"></i>
                                <div class="flex-1 relative overflow-visible">
                                    <div class="text-gray-600 text-xs font-dm-sans mb-1 text-left">Traveling to</div>
                                    <button id="destinationDropdown2" class="text-gray-800 font-dm-sans text-sm flex items-center justify-between w-full text-left">
                                        <span id="selectedDestination2">Any Destination</span>
                                        <i class="fi fi-rr-angle-down text-gray-700 text-sm"></i>
                                    </button>

                                    <!-- Dropdown Menu -->
                                    <div id="destinationMenu2" class="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 hidden destination-menu">
                                        <div class="py-2 destination-menu-scroll">
                                            <?php
                                            require_once __DIR__ . '/_class/query.php';
                                            $objMobile = new Query();
                                            $destinationResultMobile = $objMobile->selectData(
                                                "destination_name, slug_url",
                                                "destinations",
                                                "WHERE status != 0 ORDER BY
                                                CASE WHEN destination_name = 'Dubai' THEN 0 ELSE 1 END,
                                                featured DESC,
                                                destination_id DESC"
                                            );
                                            ?>
                                            <div class="px-4 py-2 hover:bg-gray-100 cursor-pointer font-dm-sans text-sm destination-menu-item" data-value="Any Destination">Any Destination</div>
                                            <?php if ($destinationResultMobile && safe_mysqli_num_rows($destinationResultMobile) > 0): ?>
                                                <?php while ($destMobile = safe_mysqli_fetch_assoc($destinationResultMobile)): ?>
                                                    <?php $nameMobile = htmlspecialchars($destMobile['destination_name']);
                                                    $slugMobile = htmlspecialchars($destMobile['slug_url']); ?>
                                                    <div class="px-4 py-2 hover:bg-gray-100 cursor-pointer font-dm-sans text-sm destination-menu-item" data-value="<?= $nameMobile ?>" data-slug="<?= $slugMobile ?>"><?= $nameMobile ?></div>
                                                <?php endwhile; ?>
                                            <?php endif; ?>
                                        </div>
                                        <div class="px-4 py-2 hover:bg-gray-100 cursor-pointer font-dm-sans text-sm destination-menu-item bg-white border-t border-gray-100 font-bold" data-value="Other Location" data-slug="other-location">Any other location</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button id="letsGoBtn2" class="bg-black text-white w-full py-3 rounded-xl font-semibold text-base hover:bg-gray-900 transition-all font-dm-sans blink-lets-go">
                            Let's Go
                        </button>
                    </div>

                    <!-- Desktop Layout -->
                    <div class="hidden md:flex">
                        <!-- Customize Your Trips Section -->
                        <div class="px-4 lg:px-7 py-4 flex-shrink-0 flex items-center">
                            <div class="text-white text-left">
                                <div class="text-xl lg:text-2xl font-dm-sans mb-1 text-gray-100">Customize</div>
                                <div class="text-2xl lg:text-3xl font-semibold font-dm-sans text-gray-100">Your Trips</div>
                            </div>
                        </div>

                        <!-- Traveling to Input -->
                        <div class="flex-1 p-3 lg:p-4 bg-white flex items-left text-left rounded-l-2xl">
                            <div class="w-full flex items-center">
                                <i class="fi fi-rr-marker text-gray-700 text-lg lg:text-xl mr-3 lg:mr-4"></i>
                                <div class="flex-1 relative">
                                    <div class="text-gray-600 text-xs lg:text-sm font-dm-sans mb-1 text-left">Traveling to</div>
                                    <div class="relative">
                                        <button id="destinationDropdown" class="text-gray-800 font-dm-sans text-lg lg:text-xl flex items-center justify-between w-full text-left">
                                            <span id="selectedDestination">Any Destination</span>
                                            <i class="fi fi-rr-angle-down text-gray-700 text-base lg:text-lg ml-2"></i>
                                        </button>

                                        <!-- Dropdown Menu -->
                                        <div id="destinationMenu" class="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-[100] hidden destination-menu">
                                            <div class="py-2 max-h-60 overflow-y-auto">
                                                <?php
                                                require_once __DIR__ . '/_class/query.php';
                                                $obj = new Query();
                                                $destinationResult = $obj->selectData(
                                                    "destination_name, slug_url",
                                                    "destinations",
                                                    "WHERE status != 0 ORDER BY
                                                    CASE WHEN destination_name = 'Dubai' THEN 0 ELSE 1 END,
                                                    featured DESC,
                                                    destination_id DESC"
                                                                                            );
                                            ?>
                                        <div class="px-4 py-2 hover:bg-gray-100 cursor-pointer font-dm-sans destination-menu-item" data-value="Any Destination">Any Destination</div>
                                                <?php if ($destinationResult && safe_mysqli_num_rows($destinationResult) > 0): ?>
                                                    <?php while ($dest = safe_mysqli_fetch_assoc($destinationResult)): ?>
                                                        <?php $name = htmlspecialchars($dest['destination_name']);
                                                        $slug = htmlspecialchars($dest['slug_url']); ?>
                                                        <div class="px-4 py-2 hover:bg-gray-100 cursor-pointer font-dm-sans destination-menu-item" data-value="<?= $name ?>" data-slug="<?= $slug ?>"><?= $name ?></div>
                                                    <?php endwhile; ?>
                                                    <?php endif; ?>
                                        </div>
                                        <div class="px-4 py-2 hover:bg-gray-100 cursor-pointer font-dm-sans destination-menu-item bg-white border-t border-gray-100 font-bold" data-value="Other Location" data-slug="other-location">other location</div>
                                    </div>
                        
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Let's Go Button -->
                    <div class="p-3 lg:p-4 bg-white flex items-center rounded-r-2xl">
                        <button id="letsGoBtn" class="bg-black text-white px-6 lg:px-10 py-3 lg:py-4 rounded-xl lg:rounded-3xl font-semibold text-base lg:text-lg hover:bg-gray-900 transition-all font-dm-sans blink-lets-go">
                            Let's Go
                        </button>
                    </div>
                    </div>
                </div>
            </div>
        </section>
        

        <?php if (!empty($posters)): ?>
        <!-- Poster Section -->
        <section class="relative z-0 py-6 lg:py-10 container mx-auto px-4" data-aos="fade-up">
            <div id="posterCarousel" class="splide">
                <div class="splide__track">
                    <ul class="splide__list">
                        <?php foreach ($posters as $poster): ?>
                            <li class="splide__slide">
                                <div class="rounded-3xl overflow-hidden shadow-lg h-auto">
                                    <img src="./admin/files/posters/<?= htmlspecialchars($poster['image']) ?>" alt="<?= htmlspecialchars($poster['alt_text'] ?: 'Special Travel Offer') ?>" class="w-full h-auto object-cover">
                                </div>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            </div>
        </section>
        <?php endif; ?>



        <!-- About Us Section -->
        <section class="py-12 lg:py-16 container mx-auto px-4 mt-8 lg:mt-0" data-aos="fade-up">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <!-- Left Content - Images -->
                <div>
                    <h2 class="lg:text-4xl text-3xl text-gray-800 mb-8 font-[Quicksand] font-medium">
                        Get to Know more about<br><span class="font-bold">Mangalam Travel & Tours</span>
                    </h2>

                    <!-- Image Gallery -->
                    <div class="grid grid-cols-2 gap-4 mb-8">
                        <div class="rounded-[18px] overflow-hidden">
                            <img src="./assets/images/abt-img-1.webp" alt="Hiking group" class="w-full h-full object-cover">
                        </div>
                        <div class="overflow-hidden">
                            <div>
                                <img src="./assets/images/abt-img-2.webp" alt="Mountain lake view" class="w-full h-full object-cover rounded-bl-[18px] rounded-tr-[18px] rounded-tl-[18px] rounded-br-[80px]">
                            </div>
                            <!-- READ MORE Button -->
                            <button onclick="window.location.href='./about.php'" class="bg-white border border-gray-800 text-gray-800 pl-3 pr-2 py-1 rounded-xl font-semibold hover:bg-gray-800 hover:text-white transition-all flex items-center font-dm-sans mt-8 overflow-hidden">
                                <span class="flex-1 text-center text-sm">READ MORE</span>
                                <div class="w-8 h-8 bg-gray-800 rounded-xl flex items-center justify-center ml-2 -mr-1">
                                    <i class="fi fi-rr-arrow-right text-white text-sm flex justify-center items-center"></i>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Right Content - About Text and Statistics -->
                <div class="relative">
                    <div class="text-xl text-gray-700 mb-4 font-dm-sans">about</div>
                    <p class="text-lg text-gray-800 mb-8 leading-relaxed font-dm-sans">
                        <span class="font-semibold">At Mangalam Travel And Tours, We Believe Travel Is More Than Just Visiting New Places </span>It's About Creating Stories, Embracing Cultures, And Building Memories That Last A Lifetime.
                    </p>

                    <!-- Hot Air Balloon Icon -->
                    <div class="absolute top-0 right-0 text-6xl opacity-80">
                        <i class="fi fi-rr-hot-air-balloon text-yellow-500"></i>
                    </div>

                    <!-- Statistics Cards -->
                    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        <!-- Years of Experience -->
                        <div class="bg-white border border-gray-800 rounded-3xl p-3 lg:p-6 text-center shadow-lg">
                            <div class="text-xl lg:text-3xl font-bold text-gray-800 mb-2 font-[Quicksand]">35+</div>
                            <div class="text-sm text-gray-600 font-dm-sans">Years Of Experience</div>
                        </div>

                        <!-- Happy Clients -->
                        <div class="bg-gray-800 rounded-3xl p-3 lg:p-6 text-center shadow-lg">
                            <div class="text-xl lg:text-3xl font-bold text-white mb-2 font-[Quicksand]">50k+</div>
                            <div class="text-sm text-white font-dm-sans">Happy Clients</div>
                        </div>

                        <!-- Destinations -->
                        <div class="bg-white border border-gray-800 rounded-3xl p-3 lg:p-6 text-center shadow-lg">
                            <div class="text-xl lg:text-3xl font-bold text-gray-800 mb-2 font-[Quicksand]">100+</div>
                            <div class="text-sm text-gray-600 font-dm-sans">Destinations</div>
                        </div>
                    </div>
                </div>
            </div>
    
        </section>




        <!-- EMI section -->
        <section class="py-12 lg:py-20 container mx-auto px-4" data-aos="fade-up">
            <div class="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-xl shadow-blue-500/5">
                <div class="flex flex-col lg:flex-row">
                    <!-- Left Side: Image -->
                    <div class="lg:w-1/2 relative min-h-[300px] lg:min-h-[500px]">
                        <img src="assets/images/emi-img.webp" alt="Stress-Free EMI Holidays" class="absolute inset-0 w-full h-full object-cover">
                        <div class="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
                        <!-- Floating Badge -->
                        <!-- <div class="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl max-w-[240px]" data-aos="fade-right" data-aos-delay="200">
                            <div class="flex items-center gap-4 mb-2">
                                <div class="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center text-white">
                                    <i class="fi fi-rr-star text-sm"></i>
                                </div>
                                <span class="font-bold text-gray-900 font-dm-sans">Premium Service</span>
                            </div>
                            <p class="text-xs text-gray-600 leading-relaxed font-dm-sans">Join thousands of happy travelers who trust Mangalam for their dream holidays.</p>
                        </div> -->
                    </div>

                    <!-- Right Side: Content -->
                    <div class="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center bg-white relative">
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-6 w-fit">
                            <i class="fi fi-rr-shield-check"></i>
                            Verified Travel Partner
                        </div>
                        
                        <h2 class="text-3xl lg:text-5xl font-medium text-gray-900 mb-6 font-[Quicksand] tracking-tight">
                            Stress-Free <span class="font-bold text-[#D4AF37]">EMI Holidays with Mangalam</span>
                        </h2>
                        
                        <p class="text-gray-500 text-base lg:text-lg mb-10 leading-relaxed font-dm-sans">
                            Why wait for your dream vacation? With our flexible EMI plans, you can book your holiday now and pay later in easy installments. Experience luxury without the financial burden.
                        </p>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                            <!-- Feature 1 -->
                            <div class="group">
                                <div class="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#D4AF37]/10 transition-colors">
                                    <i class="fi fi-rr-document-signed text-2xl text-gray-800 group-hover:text-[#D4AF37] transition-colors"></i>
                                </div>
                                <h4 class="text-lg font-bold text-gray-900 mb-1 font-dm-sans">Easy Process</h4>
                                <p class="text-sm text-gray-500 font-dm-sans">Instant approval in just 4 working days with minimal documentation.</p>
                            </div>

                            <!-- Feature 2 -->
                            <div class="group">
                                <div class="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#D4AF37]/10 transition-colors">
                                    <i class="fi fi-rr-badge-percent text-2xl text-gray-800 group-hover:text-[#D4AF37] transition-colors"></i>
                                </div>
                                <h4 class="text-lg font-bold text-gray-900 mb-1 font-dm-sans">Best Options</h4>
                                <p class="text-sm text-gray-500 font-dm-sans">Zero down payment and zero interest options available for 6 months.</p>
                            </div>
                        </div>

                        <div class="flex flex-col sm:flex-row gap-4 items-center">
                            <a href="tel:+919585541102" class="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gray-900 text-white font-bold text-center text-sm uppercase tracking-widest font-dm-sans hover:bg-[#D4AF37] transition-all hover:shadow-2xl hover:shadow-[#D4AF37]/20 flex items-center justify-center gap-3 group">
                                <i class="fi fi-rr-phone-call transition-transform group-hover:rotate-12"></i>
                                Talk to Expert
                            </a>
                            <a href="https://wa.me/919585541102" target="_blank" class="w-full sm:w-auto px-10 py-4 rounded-2xl bg-[#25D366] text-white font-bold text-center text-sm uppercase tracking-widest font-dm-sans hover:bg-[#128C7E] transition-all hover:shadow-2xl hover:shadow-[#25D366]/20 flex items-center justify-center gap-3 group">
                                <i class="fi fi-brands-whatsapp transition-transform group-hover:scale-110"></i>
                                WhatsApp Inquiry
                            </a>
                           
                        </div>
                         <!-- <span class="text-xs text-gray-400 font-dm-sans italic">*Terms & conditions apply</span> -->
                    </div>
                </div>
            </div>
        </section>

        <!-- Top Destinations Section -->
        <section class="bg-white lg:py-20 py-8 container mx-auto px-4" data-aos="fade-up">
            <!-- Section Title -->
            <div class="text-center mb-12">
                <h2 class="text-2xl lg:text-4xl font-medium text-gray-800 font-[Quicksand]">
                    Explore Top <span class="font-bold">Destinations</span>
                </h2>
            </div>

            <!-- Destination Categories Navigation Carousel -->
            <div class="border-b border-gray-200 py-2 mb-12">
                <div class="splide" id="destinationNavCarousel">
                    <div class="splide__track">
                        <ul class="splide__list">
                            <?php
                            // Fetch destinations for icon strip
                            $navResult = $obj->selectData(
                                "destination_name, slug_url, icon, featured",
                                "destinations",
                                "WHERE status != 0 ORDER BY
                                    CASE WHEN destination_name = 'Dubai' THEN 0 ELSE 1 END,
                                    featured DESC,
                                    destination_id DESC"
                            );
                            if ($navResult && safe_mysqli_num_rows($navResult) > 0):
                                while ($row = safe_mysqli_fetch_assoc($navResult)):
                                    $dName = htmlspecialchars($row['destination_name']);
                                    $dSlug = htmlspecialchars($row['slug_url']);
                                    $dIcon = !empty($row['icon']) ? './admin/files/destinations/' . htmlspecialchars($row['icon']) : './assets/icons/d-icon-1.png';
                                    $isFeatured = intval($row['featured']) === 1;
                                    $url = './package.php?slug=' . urlencode($dSlug) . '&type=package';
                            ?>
                                    <li class="splide__slide">
                                        <a href="<?= $url ?>" class="flex flex-col items-center max-w-7xl cursor-pointer relative">
                                            <!-- <div class="w-8 h-8 flex items-center justify-center mb-2 relative">
                                                <img src="<?= $dIcon ?>" alt="<?= $dName ?>" class="w-8 h-8 object-contain">

                                            </div> -->
                                            <span class="text-xs font-dm-sans text-gray-600 font-bold hover:text-red-500 transition-colors duration-300 uppercase "><?= $dName ?></span>
                                        </a>
                                    </li>
                            <?php endwhile;
                            endif; ?>
                        </ul>
                    </div>
                </div>
            </div>
            <!-- Destination Cards Carousel -->
            <div class="splide" id="destinationCarousel">
                <div class="splide__track">
                    <ul class="splide__list">
                        <?php if (!empty($destinations)): ?>
                            <?php foreach ($destinations as $destination):
                                $destinationSlug = $destination['slug_url'] ?? '';
                                $destinationUrl = $destinationSlug ? "./package.php?slug=" . urlencode($destinationSlug) . "&type=package" : "./curated-itineraries.php";
                                $title = htmlspecialchars($destination['title'] ?? '');
                                // Card copy only — never fall back to SEO meta (often raw <meta> tags)
                                $rawDescription = trim(strip_tags($destination['description'] ?? ''));
                                $description = $rawDescription !== '' ? htmlspecialchars($rawDescription) : '';
                            ?>
                                <li class="splide__slide">
                                    <a href="<?= $destinationUrl ?>" class="relative rounded-3xl overflow-hidden h-[400px] block cursor-pointer group">
                                        <img src="./admin/files/destinations/<?= htmlspecialchars($destination['image'] ?? '') ?>" alt="<?= $title ?>" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                        <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                                            <h3 class="text-3xl font-bold mb-3 font-[Quicksand]"><?= $title ?></h3>
                                            <?php if ($description !== ''): ?>
                                            <p class="text-base leading-relaxed font-dm-sans line-clamp-2"><?= $description ?></p>
                                            <?php endif; ?>
                                        </div>
                                    </a>
                                </li>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <li class="splide__slide">
                                <div class="relative rounded-3xl overflow-hidden h-[400px]">
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                    <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                                        <h3 class="text-3xl font-bold mb-3 font-[Quicksand]">No Destinations Available</h3>
                                        <p class="text-base leading-relaxed font-dm-sans">Please check back later for exciting destinations.</p>
                                    </div>
                                </div>
                            </li>
                        <?php endif; ?>
                    </ul>
                </div>
            </div>

        </section>

        <!-- CTA Banner Section - Desktop -->
        <section class="hidden lg:block container mx-auto px-4 relative overflow-hidden rounded-[30px]" style="background-image: url('./assets/images/bg-img.webp'); background-size: cover; background-position: center;" data-aos="fade-up">
            <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40"></div>

            <div class="relative h-full flex flex-col justify-between m-5 lg:m-10 p-5 lg:p-12 bg-black bg-opacity-10 backdrop-blur-sm rounded-3xl border border-white border-opacity-30">
                <!-- Top Right - Review Badge -->
                <div class="hidden lg:flex justify-end">
                    <div class="inline-flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-full px-5 py-3 shadow-lg">
                        <div class="flex -space-x-2">
                            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-white font-bold text-xs">J</div>
                            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white flex items-center justify-center text-white font-bold text-xs">M</div>
                            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white flex items-center justify-center text-white font-bold text-xs">S</div>
                        </div>
                        <div class="pl-1">
                            <div class="flex items-center space-x-1">
                                <i class="fas fa-star text-yellow-400 text-xs"></i>
                                <span class="font-bold text-gray-800 text-base font-dm-sans">4.9</span>
                                <i class="fas fa-star text-yellow-400 text-xs"></i>
                            </div>
                            <div class="text-[10px] text-gray-600 font-dm-sans font-medium whitespace-nowrap">50k+ Happy Clients</div>
                        </div>
                    </div>
                </div>

                <!-- Bottom Left - Heading and Button -->
                <div class="max-w-2xl">
                    <h2 class="lg:text-4xl text-3xl font-medium text-white font-[Quicksand] leading-tight mb-6">
                        Explore the world<br> <span class=" font-bold">with Mangalam Travel & Tours</span>
                    </h2>
                    <a href="./contact.php" class="inline-flex items-center text-white border border-white pl-6 pr-2 py-2 rounded-xl font-semibold transition-all font-dm-sans group text-base">
                        <span class="mr-2">CONTACT US</span>
                        <div class="w-8 h-8 bg-white rounded-xl flex items-center justify-center transition-all">
                            <i class="fi fi-rr-arrow-right text-gray-800 text-xs flex items-center justify-center"></i>
                        </div>
                    </a>
                </div>
            </div>
        </section>

        <!-- CTA Banner Section - Mobile -->
        <section class="    lg:hidden py-8 container mx-auto px-4 relative overflow-hidden rounded-[30px]" style="background-image: url('./assets/images/bg-img.jpg'); background-size: cover; background-position: center;" data-aos="fade-up">
            <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40"></div>

            <div class="relative h-full flex flex-col justify-between m-5 lg:m-10 p-5 lg:p-12 bg-black bg-opacity-10 backdrop-blur-sm rounded-3xl border border-white border-opacity-30">
                <div class="max-w-2xl">
                    <h2 class="lg:text-4xl text-3xl font-bold text-white font-[Quicksand] leading-tight mb-6">
                        Explore the world<br>with Mangalam Travel & Tours
                    </h2>
                    <a href="./contact.php" class="inline-flex items-center text-white border border-white pl-6 pr-2 py-1 rounded-full font-semibold transition-all font-dm-sans group text-sm mt-10">
                        <span class="mr-2">CONTACT US</span>
                        <div class="w-8 h-8 bg-white rounded-full flex items-center justify-center transition-all">
                            <i class="fi fi-rr-arrow-right text-gray-800 text-xs flex items-center justify-center"></i>
                        </div>
                    </a>
                </div>
            </div>
        </section>

        <?php if (!empty($handpickedActivities)): ?>
        <!-- Activity Section -->
        <section class="py-20" data-aos="fade-up" data-aos-delay="100">
            <div class="container mx-auto px-4 ">
                <!-- Section Header -->
                <div class="md:flex items-center justify-between mb-12">
                    <div>
                        <h2 class="lg:text-4xl text-3xl font-medium text-gray-800 font-[Quicksand] leading-tight">
                            Our Handpicked Activities<br> <span class="font-bold">Just For You</span>
                        </h2>
                    </div>
                    <a href="./attraction.php" class="inline-flex items-center bg-white border border-gray-800 text-gray-800 pl-4 pr-1 py-1 rounded-xl font-semibold hover:bg-gray-800 hover:text-white transition-all font-dm-sans group">
                        <span class="mr-2 text-sm">VIEW ALL</span>
                        <div class="w-8 h-8 bg-gray-800 rounded-xl flex items-center justify-center group-hover:bg-white transition-all">
                            <i class="fi fi-rr-arrow-right text-white group-hover:text-gray-800 text-xs flex items-center justify-center"></i>
                        </div>
                    </a>
                </div>

                <!-- Activity Cards Grid - Desktop View -->
                <div class="hidden lg:flex gap-5 h-[500px]">
                    <?php
                        $activityCount = 0;
                        $leftColumn = [];
                        $centerColumn = [];
                        $rightColumn = [];

                        foreach ($handpickedActivities as $activity) {
                            if ($activityCount < 2) {
                                $leftColumn[] = $activity;
                            } elseif ($activityCount == 2) {
                                $centerColumn[] = $activity;
                            } elseif ($activityCount < 5) {
                                $rightColumn[] = $activity;
                            }
                            $activityCount++;
                            if ($activityCount >= 5) break;
                        }

                        // Left Column - 2 boxes stacked
                        if (!empty($leftColumn)): ?>
                            <div class="flex flex-col gap-5 w-full lg:w-[436px]">
                                <?php foreach ($leftColumn as $activity):
                                    $imageSrc = './admin/files/activities/' . $activity['image'];
                                    $title = htmlspecialchars($activity['title']);
                                    $destination = htmlspecialchars($activity['destination']);
                                    $slug = $activity['slug_url'] ?? '#';
                                ?>
                                    <a href="./activity-details.php?slug=<?= urlencode($slug) ?>" class="relative rounded-3xl overflow-hidden flex-1 group cursor-pointer block">
                                        <img src="<?= $imageSrc ?>" alt="<?= $title ?>" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                                        <div class="absolute bottom-0 left-0 right-0 p-5 text-white">
                                            <div class="flex items-center text-xs mb-2 font-[Quicksand]">
                                                <i class="fi fi-rr-marker mr-1.5 text-sm"></i>
                                                <span><?= $destination ?></span>
                                            </div>
                                            <h3 class="text-lg font-bold mb-2 font-dm-sans leading-tight line-clamp-2"><?= $title ?></h3>
                                            <div class="inline-flex items-center text-white font-dm-sans text-base group-hover:gap-2 transition-all">
                                                <span>Explore</span>
                                                <i class="fi fi-rr-arrow-right ml-2 text-xs flex items-center"></i>
                                            </div>
                                        </div>
                                    </a>
                                <?php endforeach; ?>
                            </div>
                        <?php endif;

                        // Center Column - 1 large box
                        if (!empty($centerColumn)):
                            $activity = $centerColumn[0];
                            $imageSrc = './admin/files/activities/' . $activity['image'];
                            $title = htmlspecialchars($activity['title']);
                            $destination = htmlspecialchars($activity['destination']);
                            $slug = $activity['slug_url'] ?? '#';
                        ?>
                            <div class="flex-1 w-full lg:w-[436px]">
                                <a href="./activity-details.php?slug=<?= urlencode($slug) ?>" class="relative rounded-3xl overflow-hidden h-full group cursor-pointer block">
                                    <img src="<?= $imageSrc ?>" alt="<?= $title ?>" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                    <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
                                        <div class="flex items-center text-sm mb-3 font-[Quicksand]">
                                            <i class="fi fi-rr-marker mr-2 text-base"></i>
                                            <span><?= $destination ?></span>
                                        </div>
                                        <h3 class="text-[19px] font-bold mb-4 font-dm-sans line-clamp-2"><?= $title ?></h3>
                                        <div class="inline-flex items-center text-white font-dm-sans text-base group-hover:gap-2 transition-all">
                                            <span>Explore</span>
                                            <i class="fi fi-rr-arrow-right ml-2 text-sm flex items-center"></i>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        <?php endif;

                        // Right Column - 2 boxes stacked
                        if (!empty($rightColumn)): ?>
                            <div class="flex flex-col gap-5 w-full lg:w-[436px]">
                                <?php foreach ($rightColumn as $activity):
                                    $imageSrc = './admin/files/activities/' . $activity['image'];
                                    $title = htmlspecialchars($activity['title']);
                                    $destination = htmlspecialchars($activity['destination']);
                                    $slug = $activity['slug_url'] ?? '#';
                                ?>
                                    <a href="./activity-details.php?slug=<?= urlencode($slug) ?>" class="relative rounded-3xl overflow-hidden flex-1 group cursor-pointer block">
                                        <img src="<?= $imageSrc ?>" alt="<?= $title ?>" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                                        <div class="absolute bottom-0 left-0 right-0 p-5 text-white">
                                            <div class="flex items-center text-xs mb-2 font-[Quicksand]">
                                                <i class="fi fi-rr-marker mr-1.5 text-sm"></i>
                                                <span><?= $destination ?></span>
                                            </div>
                                            <h3 class="text-[19px] font-bold mb-2 font-dm-sans leading-tight line-clamp-2"><?= $title ?></h3>
                                            <div class="inline-flex items-center text-white font-dm-sans text-base group-hover:gap-2 transition-all">
                                                <span>Explore</span>
                                                <i class="fi fi-rr-arrow-right ml-2 text-xs flex items-center"></i>
                                            </div>
                                        </div>
                                    </a>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                </div>

                <!-- Activity Cards Carousel - Mobile/Tablet View -->
                <div class="lg:hidden mb-12">
                    <div id="activityCarousel" class="splide">
                        <div class="splide__track">
                            <ul class="splide__list">
                                    <?php foreach ($handpickedActivities as $activity):
                                        $imageSrc = './admin/files/activities/' . $activity['image'];
                                        $title = htmlspecialchars($activity['title']);
                                        $destination = htmlspecialchars($activity['destination']);
                                        $slug = $activity['slug_url'] ?? '#';
                                    ?>
                                        <li class="splide__slide">
                                            <a href="./activity-details.php?slug=<?= urlencode($slug) ?>" class="relative rounded-3xl overflow-hidden h-[350px] group cursor-pointer block">
                                                <img src="<?= $imageSrc ?>" alt="<?= $title ?>" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                                                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                                                <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                                                    <div class="flex items-center text-xs mb-2 font-[Quicksand]">
                                                        <i class="fi fi-rr-marker mr-1.5 text-sm"></i>
                                                        <span><?= $destination ?></span>
                                                    </div>
                                                    <h3 class="text-lg font-bold mb-2 font-dm-sans leading-tight line-clamp-2"><?= $title ?></h3>
                                                    <div class="inline-flex items-center text-white font-dm-sans text-base group-hover:gap-2 transition-all">
                                                        <span>Explore</span>
                                                        <i class="fi fi-rr-arrow-right ml-2 text-xs flex items-center"></i>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                    <?php endforeach; ?>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <?php endif; ?>

        <!-- Benefits Section -->
        <section class="lg:py-20 py-10 bg-gray-100 rounded-3xl container mx-auto px-4" data-aos="fade-up">
            <div class="container mx-auto lg:px-20">
                <!-- Content Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- Left Side - Image -->
                    <div class="relative">
                        <!-- Section Header with Airplane Icon -->
                        <div class="flex items-start justify-between mb-12 relative">
                            <h2 class="lg:text-4xl text-3xl  font-medium text-gray-800 font-[Quicksand] leading-tight max-w-md">
                                <span class="font-medium">Our true Beliefs for</span></span>
                                your Benefits
                            </h2>
                            <div class="absolute -top-[53px] left-[299px]">
                                <img src="./assets/images/plane.png" alt="Plane icon" class="w-full h-auto">
                            </div>
                        </div>
                        <img src="./assets/images/benifit.webp" alt="Ancient temple architecture" class="lg:w-[500px] w-full md:h-[500px] h-[400px] object-cover rounded-br-[160px] rounded-bl-[18px] rounded-tr-[18px] rounded-tl-[18px]">
                    </div>

                    <!-- Right Side - Benefits Cards -->
                    <div class="space-y-5">
                        <!-- Card 1 - Customer-Centric (Light) -->
                        <div class="bg-white border border-gray-300 rounded-3xl p-6 flex items-start space-x-4">
                            <div class="w-12 h-12 bg-white border border-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                                <i class="fi fi-sr-user text-gray-800 text-xl flex items-center justify-center"></i>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-gray-800 mb-2 font-[Quicksand]">Customer-Centric</h3>
                                <p class="text-gray-600 text-sm leading-relaxed font-dm-sans">
                                    Your customer is the compass that guides our travel services. We prioritize our customers' needs.
                                </p>
                            </div>
                        </div>

                        <!-- Card 2 - Sustainable Travel (Dark) -->
                        <div class="bg-gray-800 rounded-3xl p-6 flex items-start space-x-4">
                            <div class="w-12 h-12 bg-gray-800 border border-white rounded-full flex items-center justify-center flex-shrink-0">
                                <i class="fi fi-sr-leaf text-white text-xl flex items-center justify-center"></i>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-white mb-2 font-[Quicksand]">Sustainable Travel</h3>
                                <p class="text-gray-300 text-sm leading-relaxed font-dm-sans">
                                    Committed to responsible and eco-conscious journeys, traveling the world with minimal footprints and pollutions.
                                </p>
                            </div>
                        </div>

                        <!-- Card 3 - Authentic Experience (Light) -->
                        <div class="bg-white border border-gray-300 rounded-3xl p-6 flex items-start space-x-4">
                            <div class="w-12 h-12 bg-white border border-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                                <i class="fi fi-sr-plane-alt text-gray-800 text-xl flex items-center justify-center"></i>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-gray-800 mb-2 font-[Quicksand]">Authentic Experience</h3>
                                <p class="text-gray-600 text-sm leading-relaxed font-dm-sans">
                                    We deliver journey that immerse you in unforgettable encounter with the world's diverse cultures & landscapes.
                                </p>
                            </div>
                        </div>

                        <!-- Card 4 - Quality Guides (Dark) -->
                        <div class="bg-gray-800 rounded-3xl p-6 flex items-start space-x-4">
                            <div class="w-12 h-12 bg-gray-800 border border-white rounded-full flex items-center justify-center flex-shrink-0">
                                <i class="fi fi-sr-star text-white text-xl flex items-center justify-center"></i>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-white mb-2 font-[Quicksand]">Quality Guides</h3>
                                <p class="text-gray-300 text-sm leading-relaxed font-dm-sans">
                                    Every journey will be led by knowledgeable passionate experts who enhance your travel experience.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Tickets Section -->
        <section class="py-20">
            <div class="container mx-auto px-4 ">
                <!-- Section Header -->
                <div class="md:flex items-center justify-between mb-12" data-aos="fade-up" data-aos-delay="100">
                    <h2 class="lg:text-4xl text-3xl  font-medium text-gray-800 font-[Quicksand] leading-tight">
                        Grab Your Tickets, Start<br> <span class="font-bold">Your Journey</span>
                    </h2>
                    <a href="./tickets.php" class="inline-flex items-center bg-white border border-gray-800 text-gray-800 pl-6 pr-2 py-2 rounded-xl font-semibold hover:bg-gray-800 hover:text-white transition-all font-dm-sans group" data-aos="fade-left" data-aos-delay="200">
                        <span class="mr-2 text-sm">VIEW ALL</span>
                        <div class="w-8 h-8 bg-gray-800 rounded-xl flex items-center justify-center group-hover:bg-white transition-all">
                            <i class="fi fi-rr-arrow-right text-white group-hover:text-gray-800 text-xs flex items-center justify-center"></i>
                        </div>
                    </a>
                </div>

                <!-- Tickets Carousel -->
                <div class="mb-12">
                    <div id="ticketsCarousel" class="splide">
                        <div class="splide__track">
                            <ul class="splide__list">
                                <?php if (!empty($tickets)): ?>
                                    <?php $ticketIndex = 0; ?>
                                    <?php foreach ($tickets as $ticket): ?>
                                        <li class="splide__slide" data-aos="zoom-in" data-aos-delay="<?= $ticketIndex * 120 ?>">
                                            <a href="./tickets-details.php?slug=<?= urlencode($ticket['slug_url']) ?>" class="block">
                                                <div class="rounded-3xl cursor-pointer group">
                                                    <div class="relative overflow-hidden rounded-3xl">
                                                        <img src="./admin/files/tickets/<?= $ticket['image'] ?>" alt="<?= htmlspecialchars($ticket['title']) ?>" class="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500">
                                                    </div>
                                                    <div class="mt-3">
                                                        <div class="flex items-center text-sm mb-1 font-[Quicksand] text-red-500">
                                                            <i class="fi fi-rr-marker mr-1.5"></i>
                                                            <span><?= htmlspecialchars($ticket['destination']) ?></span>
                                                        </div>
                                                        <h3 class="text-lg font-bold font-dm-sans text-gray-800 leading-tight"><?= htmlspecialchars($ticket['title']) ?></h3>
                                                        <div class="text-base font-semibold font-dm-sans text-gray-800 mt-1">₹ <?= number_format($ticket['amount']) ?></div>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                        <?php $ticketIndex++; ?>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <li class="splide__slide" data-aos="zoom-in">
                                        <div class="rounded-3xl p-6 text-center">
                                            <p class="text-gray-600 font-dm-sans">No tickets available at the moment.</p>
                                        </div>
                                    </li>
                                <?php endif; ?>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <?php if (!empty($partners)): ?>
        <!-- ACCREDITATIONS Section -->
        <section class="py-20 bg-gray-50" data-aos="fade-up">
            <div class="container mx-auto px-4">
                <!-- Section Header -->
                <div class="text-center mb-12" data-aos="fade-up" data-aos-delay="100">
                    <h2 class="lg:text-4xl text-3xl font-medium text-gray-800 font-[Quicksand] leading-tight mb-4" data-aos="fade-up" data-aos-delay="150">
                        Our Accreditations & <span class="font-bold">Certifications</span>
                    </h2>
                    <p class="text-gray-600 font-dm-sans max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
                        Recognized by leading travel associations and trusted by thousands of travelers
                    </p>
                </div>

                <!-- Accreditations Carousel -->
                <div class="mb-12">
                    <div id="accreditationsCarousel" class="splide">
                        <div class="splide__track">
                            <ul class="splide__list">
                                    <?php foreach ($partners as $pIndex => $partner): ?>
                                        <li class="splide__slide" data-aos="zoom-in" data-aos-delay="<?= ($pIndex + 1) * 100 ?>">
                                            <div class="bg-white rounded-3xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 flex items-center justify-center border border-gray-200 h-full">
                                                <div class="text-center">
                                                    <div class="w-24 h-24 lg:w-32 lg:h-32 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden">
                                                        <img src="./admin/files/partners/<?= htmlspecialchars($partner['logo']) ?>" alt="Partner" class="w-full h-full object-contain p-2">
                                                    </div>
                                                    <p class="text-sm font-semibold text-gray-800 font-dm-sans">Trusted Partner</p>
                                                </div>
                                            </div>
                                        </li>
                                    <?php endforeach; ?>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <?php endif; ?>
        <!-- FAQ Section -->
        <section class="py-20 relative container mx-auto px-4" data-aos="fade-up">
            <div class="lg:p-12 p-4 bg-gray-100 rounded-3xl " data-aos="fade-up" data-aos-delay="50">
                <!-- Section Header with Plane Icon -->
                <div class="flex items-start justify-between mb-12" data-aos="fade-up" data-aos-delay="100">
                    <h2 class="lg:text-4xl text-3xl  font-medium text-gray-800 font-[Quicksand] leading-tight" data-aos="fade-up" data-aos-delay="150">
                        Frequently asked <span class="font-bold">questions</span>
                    </h2>
                    <div class="absolute -top-0  right-0">
                        <img src="./assets/images/plane.png" alt="">
                    </div>
                </div>

                <!-- FAQ Accordion - Two Column Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Left Column -->
                    <div class="space-y-4">
                        <!-- FAQ Item 1 -->
                        <div class="border border-gray-300 rounded-3xl overflow-hidden bg-white" data-aos="fade-up" data-aos-delay="200">
                            <button class="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors" onclick="toggleFaq(1)">
                                <span class="text-base font-bold text-gray-800 font-dm-sans pr-4">What services does Mangalam Tours & Travels offer?</span>
                                <div class="flex-shrink-0 w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                                    <i class="fi fi-rr-minus text-white text-sm flex items-center justify-center" id="icon-1"></i>
                                </div>
                            </button>
                            <div class="px-6 pb-6 text-gray-700 font-dm-sans text-sm leading-relaxed" id="answer-1">
                                We provide a complete range of travel services including domestic and international tour packages, hotel bookings, flight reservations, car rentals, and customized travel itineraries.
                            </div>
                        </div>

                        <!-- FAQ Item 2 -->
                        <div class="border border-gray-300 rounded-3xl overflow-hidden bg-white" data-aos="fade-up" data-aos-delay="250">
                            <button class="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors" onclick="toggleFaq(2)">
                                <span class="text-base font-bold text-gray-800 font-dm-sans pr-4">What payment options are available?</span>
                                <div class="flex-shrink-0 w-8 h-8 bg-white border border-gray-800 rounded-md flex items-center justify-center">
                                    <i class="fi fi-rr-plus text-gray-800 text-sm flex items-center justify-center" id="icon-2"></i>
                                </div>
                            </button>
                            <div class="px-6 pb-6 text-gray-700 font-dm-sans text-sm leading-relaxed hidden" id="answer-2">
                                We accept various payment methods including credit/debit cards, bank transfers, UPI, and online payment gateways. Flexible payment plans are also available for selected packages.
                            </div>
                        </div>

                        <!-- FAQ Item 3 -->
                        <div class="border border-gray-300 rounded-3xl overflow-hidden bg-white" data-aos="fade-up" data-aos-delay="300">
                            <button class="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors" onclick="toggleFaq(3)">
                                <span class="text-base font-bold text-gray-800 font-dm-sans pr-4">What is your cancellation policy?</span>
                                <div class="flex-shrink-0 w-8 h-8 bg-white border border-gray-800 rounded-md flex items-center justify-center">
                                    <i class="fi fi-rr-plus text-gray-800 text-sm flex items-center justify-center" id="icon-3"></i>
                                </div>
                            </button>
                            <div class="px-6 pb-6 text-gray-700 font-dm-sans text-sm leading-relaxed hidden" id="answer-3">
                                Our cancellation policy varies by package and booking terms. Generally, cancellations made 30 days before departure receive full refunds, while later cancellations may incur charges. Please check specific package terms for details.
                            </div>
                        </div>
                    </div>

                    <!-- Right Column -->
                    <div class="space-y-4">
                        <!-- FAQ Item 4 -->
                        <div class="border border-gray-300 rounded-3xl overflow-hidden bg-white" data-aos="fade-up" data-aos-delay="200">
                            <button class="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors" onclick="toggleFaq(4)">
                                <span class="text-base font-bold text-gray-800 font-dm-sans pr-4">Can I customize my travel package?</span>
                                <div class="flex-shrink-0 w-8 h-8 bg-white border border-gray-800 rounded-md flex items-center justify-center">
                                    <i class="fi fi-rr-plus text-gray-800 text-sm flex items-center justify-center" id="icon-4"></i>
                                </div>
                            </button>
                            <div class="px-6 pb-6 text-gray-700 font-dm-sans text-sm leading-relaxed hidden" id="answer-4">
                                Yes, we offer fully customizable travel packages tailored to your preferences, budget, and schedule. Our team works with you to create the perfect itinerary.
                            </div>
                        </div>

                        <!-- FAQ Item 5 -->
                        <div class="border border-gray-300 rounded-3xl overflow-hidden bg-white" data-aos="fade-up" data-aos-delay="250">
                            <button class="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors" onclick="toggleFaq(5)">
                                <span class="text-base font-bold text-gray-800 font-dm-sans pr-4">Do you provide travel insurance?</span>
                                <div class="flex-shrink-0 w-8 h-8 bg-white border border-gray-800 rounded-md flex items-center justify-center">
                                    <i class="fi fi-rr-plus text-gray-800 text-sm flex items-center justify-center" id="icon-5"></i>
                                </div>
                            </button>
                            <div class="px-6 pb-6 text-gray-700 font-dm-sans text-sm leading-relaxed hidden" id="answer-5">
                                Yes, we offer comprehensive travel insurance options to protect your trip. Our insurance covers medical emergencies, trip cancellations, lost baggage, and other unforeseen circumstances during your journey.
                            </div>
                        </div>
                        <!-- FAQ Item 6 -->
                        <div class="border border-gray-300 rounded-3xl overflow-hidden bg-white" data-aos="fade-up" data-aos-delay="300">
                            <button class="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors" onclick="toggleFaq(6)">
                                <span class="text-base font-bold text-gray-800 font-dm-sans pr-4">How do I book a tour with Mangalam Tours?</span>
                                <div class="flex-shrink-0 w-8 h-8 bg-white border border-gray-800 rounded-md flex items-center justify-center">
                                    <i class="fi fi-rr-plus text-gray-800 text-sm flex items-center justify-center" id="icon-6"></i>
                                </div>
                            </button>
                            <div class="px-6 pb-6 text-gray-700 font-dm-sans text-sm leading-relaxed hidden" id="answer-6">
                                You can book a tour by contacting us via phone, email, or through our website. Our travel experts will guide you through the booking process and help you select the best package.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <?php if (!empty($testimonials)): ?>
        <!-- Testimonials Section -->
        <section class="py-20 relative" data-aos="fade-up">
            <div class="container mx-auto px-4 " data-aos="fade-up" data-aos-delay="50">
                <!-- Section Header with Plane Icon -->
                <div class="flex items-center justify-between mb-4 relative" data-aos="fade-up" data-aos-delay="100">
                    <div class="relative" data-aos="fade-up" data-aos-delay="150">
                        <i class="fi fi-rr-plane-alt text-5xl text-gray-800 transform -rotate-12"></i>
                        <svg class="absolute top-8 left-12" width="80" height="60" viewBox="0 0 80 60" fill="none">
                            <path d="M 5 5 Q 20 15, 35 10 T 65 25 Q 75 35, 80 45" stroke="#999" stroke-width="2" stroke-dasharray="3 6" fill="none" />
                        </svg>
                    </div>
                    <h2 class="lg:text-4xl text-3xl  font-medium text-gray-800 font-[Quicksand] leading-tight text-center flex-1" data-aos="fade-up" data-aos-delay="200">
                        What Our <span class="font-bold">Clients Say</span>
                    </h2>
                </div>

                <!-- Subtitle -->
                <p class="text-center text-gray-600 font-dm-sans mb-12" data-aos="fade-up" data-aos-delay="250">
                    Our travellers share their unforgettable experiences with Mangalam Tours & Travels
                </p>

                <!-- Testimonials Carousel -->
                <div class="relative">
                    <div id="testimonialsCarousel" class="splide">
                        <div class="splide__track">
                            <ul class="splide__list">
                                <?php foreach ($testimonials as $index => $testimonial):
                                    $stars = 5;
                                ?>
                                    <li class="splide__slide" data-aos="zoom-in" data-aos-delay="<?= ($index + 1) * 100 ?>">
                                        <div class="bg-white rounded-3xl p-8 shadow-sm h-full">
                                            <!-- Star Rating -->
                                            <div class="flex items-center mb-4">
                                                <?php for ($i = 0; $i < $stars; $i++): ?>
                                                    <i class="fas fa-star text-yellow-400 text-sm <?= $i > 0 ? 'ml-1' : '' ?>"></i>
                                                <?php endfor; ?>
                                            </div>

                                            <!-- Review Text -->
                                            <p class="text-gray-700 font-dm-sans text-sm leading-relaxed mb-6">
                                                <?= htmlspecialchars($testimonial['description'] ?? '') ?>
                                            </p>

                                            <!-- Reviewer Info -->
                                            <div class="flex items-center gap-3">
                                                <?php if (!empty($testimonial['image'])): ?>
                                                    <img src="./admin/files/testimonials/<?= htmlspecialchars($testimonial['image']) ?>" alt="<?= htmlspecialchars($testimonial['name'] ?? '') ?>" class="w-12 h-12 rounded-full object-cover">
                                                <?php endif; ?>
                                                <div>
                                                    <h4 class="font-bold text-gray-800 font-dm-sans"><?= htmlspecialchars($testimonial['name'] ?? '') ?></h4>
                                                    <p class="text-gray-500 text-sm font-dm-sans"><?= htmlspecialchars($testimonial['role'] ?? '') ?></p>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                <?php endforeach; ?>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <?php endif; ?>

        <!-- Blog Section -->
        <section class="py-20 bg-gray-50" data-aos="fade-up">
            <div class="container mx-auto px-4">
                <!-- Section Header -->
                <div class="text-center mb-12" data-aos="fade-up" data-aos-delay="100">
                    <h2 class="text-3xl md:text-4xl font-medium text-gray-800 font-[Quicksand] mb-4" data-aos="fade-up" data-aos-delay="150">
                        Latest Travel <span class="font-bold">Insights</span>
                    </h2>
                    <p class="text-gray-600 font-dm-sans max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
                        Discover travel tips, destination guides, and inspiring stories from our blog
                    </p>
                </div>

                <!-- Blog Carousel -->
                <?php if ($blogs && count($blogs) > 0): ?>
                    <div class="splide" id="blogCarousel">
                        <div class="splide__track">
                            <ul class="splide__list">
                                <?php foreach (array_slice($blogs, 0, 6) as $index => $blog): ?>
                                    <li class="splide__slide" data-aos="zoom-in" data-aos-delay="<?= 150 + ($index * 120) ?>">
                                        <a href="blog-details.php?slug=<?php echo urlencode($blog['slug_url']); ?>" class="group block">
                                            <div class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                                                <!-- Blog Image -->
                                                <div class="relative overflow-hidden h-64">
                                                    <?php if (isset($blog['images']) && count($blog['images']) > 0): ?>
                                                        <img src="./admin/files/blog/<?php echo htmlspecialchars($blog['images'][0]['name']); ?>"
                                                            alt="<?php echo htmlspecialchars($blog['title']); ?>"
                                                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                                                    <?php else: ?>
                                                        <div class="w-full h-full bg-gray-100"></div>
                                                    <?php endif; ?>
                                                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                </div>

                                                <!-- Blog Content -->
                                                <div class="p-6">
                                                    <div class="flex items-center text-gray-500 text-sm mb-3">
                                                        <i class="fi fi-rr-calendar mr-2"></i>
                                                        <span class="font-dm-sans"><?php echo htmlspecialchars($blog['date']); ?></span>
                                                    </div>

                                                    <h3 class="text-xl font-bold text-gray-900 font-dm-sans mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                                                        <?php echo htmlspecialchars($blog['title']); ?>
                                                    </h3>

                                                    <div class="flex items-center text-red-600 font-dm-sans font-semibold">
                                                        <span>Read More</span>
                                                        <i class="fi fi-rr-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                <?php endforeach; ?>
                            </ul>
                        </div>
                    </div>

                    <!-- View All Button -->
                    <div class="text-center mt-12" data-aos="fade-up" data-aos-delay="400">
                        <a href="blog.php" class="inline-flex items-center px-8 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors font-dm-sans">
                            View All Blogs
                            <i class="fi fi-rr-arrow-right ml-2"></i>
                        </a>
                    </div>
                <?php else: ?>
                    <div class="text-center py-20">
                        <i class="fi fi-rr-document text-gray-300 text-6xl mb-4"></i>
                        <h3 class="text-2xl font-bold text-gray-900 font-[Quicksand] mb-3">No Blog Posts Yet</h3>
                        <p class="text-gray-600 font-dm-sans">Check back soon for exciting travel stories and tips!</p>
                    </div>
                <?php endif; ?>
            </div>
        </section>
    </main>
    <?php include './components/footer.php'; ?>
    <?php include './components/Customize.php'; ?>
    <?php include './components/FixedCustomizeButton.php'; ?>
    <?php
    include './components/MobileNav.php';
    responsiveMenu('home'); // Set 'home' as active page
    ?>
    <!-- Floating Contact Icons -->
    <div class="hidden fixed right-6 top-[40%] lg:top-1/2 transform -translate-y-1/2 z-40 space-y-4">
        <a href="tel:+919876543210" class="bg-white text-gray-800 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors">
            <i class="fas fa-phone text-[25px]"></i>
        </a>
        <a href="mailto:info@mangalamtours.com" class="bg-white text-gray-800 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors">
            <i class="fas fa-envelope text-[25px]"></i>
        </a>
        <a href="https://wa.me/919876543210" target="_blank" class="bg-white text-gray-800 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors">
            <i class="fab fa-whatsapp text-[25px]"></i>
        </a>
    </div>

    <!-- Customize Popup JS -->

    <?php include './script.php'; ?>
    <script>
        // Update cart count on page load
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof updateCartCount === 'function') {
                updateCartCount();
            }

            const letsGoButtons = [document.getElementById('letsGoBtn'), document.getElementById('letsGoBtn2')].filter(Boolean);
            let audioContext;

            function playBeep() {
                try {
                    const Ctx = window.AudioContext || window.webkitAudioContext;
                    if (!Ctx) return;
                    if (!audioContext) {
                        audioContext = new Ctx();
                    }
                    const ctx = audioContext;
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    const now = ctx.currentTime;

                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(880, now);
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

                    osc.connect(gain).connect(ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.2);
                } catch (error) {
                    console.warn('Unable to play beep:', error);
                }
            }

            letsGoButtons.forEach(btn => {
                btn.addEventListener('click', playBeep, { passive: true });
            });
        });

        window.onscroll = function() {
            const mainFixedHeader = document.getElementById('mainFixedHeader');
            const heroSection = document.querySelector('.relative.lg\\:h-screen.h-\\[300px\\].bg-cover.bg-center.bg-no-repeat');
            const heroSectionHeight = heroSection ? heroSection.offsetHeight : 0;

            if (window.scrollY > heroSectionHeight) {
                mainFixedHeader.classList.remove('opacity-0', 'pointer-events-none');
                mainFixedHeader.classList.add('visible');
            } else {
                mainFixedHeader.classList.add('opacity-0', 'pointer-events-none');
                mainFixedHeader.classList.remove('visible');
            }
        };
    </script>

    <!-- Other Location Enquiry Modal -->
    <div id="otherLocationModal" class="fixed inset-0 z-[99999] hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <!-- Background backdrop -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" onclick="closeOtherLocationModal()"></div>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                <div class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all w-full max-w-lg sm:my-8 border border-gray-100">
                    <!-- Modal Header -->
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between items-center border-b border-gray-100">
                        <h3 class="text-xl font-bold leading-6 text-gray-900 font-[Quicksand]" id="modal-title">Enquire for Other Location</h3>
                        <button type="button" onclick="closeOtherLocationModal()" class="text-gray-400 hover:text-gray-500 transition-colors">
                            <i class="fi fi-rr-cross text-lg"></i>
                        </button>
                    </div>

                    <!-- Modal Body -->
                    <div class="px-4 py-5 sm:p-6">
                        <form id="otherLocationForm" onsubmit="submitOtherLocationForm(event)">
                            <div class="space-y-4">
                                <div>
                                    <label for="other-name" class="block text-sm font-medium text-gray-700 font-dm-sans mb-1">Full Name</label>
                                    <input type="text" name="name" id="other-name" required class="block w-full rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm py-2.5 px-3 border font-dm-sans" placeholder="John Doe">
                                </div>
                                
                                <div>
                                    <label for="other-email" class="block text-sm font-medium text-gray-700 font-dm-sans mb-1">Email Address</label>
                                    <input type="email" name="email" id="other-email" required class="block w-full rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm py-2.5 px-3 border font-dm-sans" placeholder="john@example.com">
                                </div>

                                <div>
                                    <label for="other-phone" class="block text-sm font-medium text-gray-700 font-dm-sans mb-1">Phone Number</label>
                                    <div class="flex gap-2">
                                        <input type="tel" name="phone" id="other-phone" required class="flex-1 block rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm py-2.5 px-3 border font-dm-sans" placeholder="+91 98765 43210">
                                        <button type="button" id="other-sendOtpBtn" class="px-3 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 text-sm font-semibold whitespace-nowrap font-dm-sans">Send OTP</button>
                                    </div>
                                    <?php renderEnquiryOtpFields('other'); ?>
                                </div>

                                <div>
                                    <label for="other-message" class="block text-sm font-medium text-gray-700 font-dm-sans mb-1">Message / Location Details</label>
                                    <textarea name="message" id="other-message" rows="3" class="block w-full rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm py-2.5 px-3 border font-dm-sans" placeholder="Tell us where you want to go..."></textarea>
                                </div>
                            </div>
                            
                            <div class="mt-6">
                                <button type="submit" class="inline-flex w-full justify-center rounded-lg bg-black px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-colors font-dm-sans">
                                    Send Enquiry
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Expose to window for App.js access
        window.openOtherLocationModal = function() {
            const modal = document.getElementById('otherLocationModal');
            if (modal) {
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
                if (window.EnquiryOtp) {
                    EnquiryOtp.getInstance('other');
                }
            }
        };

        window.closeOtherLocationModal = function() {
            const modal = document.getElementById('otherLocationModal');
            if (modal) {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }
        };

        window.submitOtherLocationForm = function(event) {
            event.preventDefault();
            const form = document.getElementById('otherLocationForm');
            const otherLocationOtp = window.EnquiryOtp ? EnquiryOtp.getInstance('other') : null;

            if (otherLocationOtp && !otherLocationOtp.requireVerified()) return;

            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            
            btn.innerText = 'Sending...';
            btn.disabled = true;

            const payload = {
                enquiry_type: 'other_location',
                customer_name: document.getElementById('other-name').value.trim(),
                customer_email: document.getElementById('other-email').value.trim(),
                customer_phone: document.getElementById('other-phone').value.trim(),
                message: document.getElementById('other-message').value.trim()
            };

            if (!payload.customer_name || !payload.customer_email || !payload.customer_phone) {
                alert('Please fill in your name, email, and phone number.');
                btn.innerText = originalText;
                btn.disabled = false;
                return;
            }

            fetch('./action/submitOtherLocationEnquiry.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify(payload)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    form.reset();
                    if (otherLocationOtp) otherLocationOtp.reset();
                    closeOtherLocationModal();
                    window.location.href = './thankyou.php';
                } else {
                    alert(result.message || 'Failed to send enquiry. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            })
            .finally(() => {
                btn.innerText = originalText;
                btn.disabled = false;
            });
        };
    </script>
</body>

</html>
