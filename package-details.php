<?php
// Get slug from URL parameter
$slug = isset($_GET['slug']) ? $_GET['slug'] : '';

// Include the package details function
include './action/packageDetails.php';
require_once __DIR__ . '/components/EnquiryOtpFields.php';

// Fetch package data
$packageData = null;
if ($slug) {
    $packageJson = getPackageInfo($slug);
    $packageArray = json_decode($packageJson, true);
    
    if (!empty($packageArray)) {
        $packageData = $packageArray[0];
    }
}

// Set default values if no data found
$title = isset($packageData['title']) ? $packageData['title'] : 'Package Details';

// Meta tags for Package Details Page
$pageTitle = $title . ' - Mangalam Travel & Tours | Tour Package Details';
$pageDescription = isset($packageData['description'])
    ? $packageData['description']
    : 'Explore this amazing tour package with Mangalam Travel & Tours. Get the best deals on customized travel packages.';
$pageKeywords = isset($packageData['title']) ? $packageData['title'] . ', tour package, travel package, vacation package, Mangalam Tours' : 'tour package, travel package, vacation package, Mangalam Tours';
$pageImage = isset($packageData['cardImage']) && !empty($packageData['cardImage']) ? './admin/files/packages/' . $packageData['cardImage'] : './assets/images/logo/mangalam-tours-og.jpg';
$pageUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
$pageType = 'article'; // Package details are articles
$description = isset($packageData['description']) ? $packageData['description'] : '';
$description = strip_tags(html_entity_decode($description));
$amount = isset($packageData['amount']) ? $packageData['amount'] : 0;
$duration = isset($packageData['duration']) ? $packageData['duration'] : '';
$category = isset($packageData['category']) ? $packageData['category'] : '';
$fixedDate = isset($packageData['fixed_date']) ? $packageData['fixed_date'] : '';
$hotelType = isset($packageData['hotel_type']) ? $packageData['hotel_type'] : '';
$cardImage = isset($packageData['cardImage']) ? $packageData['cardImage'] : '';
$images = isset($packageData['images']) ? $packageData['images'] : [];
$highlights = isset($packageData['highlights']) ? $packageData['highlights'] : [];
$includes = isset($packageData['includes']) ? $packageData['includes'] : [];
$excludes = isset($packageData['excludes']) ? $packageData['excludes'] : [];
$itinearys = isset($packageData['itinearys']) ? $packageData['itinearys'] : [];
$thinksToKnow = isset($packageData['thinks_to_know']) ? $packageData['thinks_to_know'] : [];
$faq = isset($packageData['faq']) ? $packageData['faq'] : [];
$meta = null;

// Process images - extract image names from nested array structure
$imageList = [];
if (!empty($images)) {
    foreach ($images as $img) {
        if (isset($img['image_name'])) {
            $imageList[] = $img['image_name'];
        }
    }
}
// Use card image as fallback
if (empty($imageList) && $cardImage) {
    $imageList[] = $cardImage;
}

// Debug: Uncomment to see the data structure
// echo "<pre>"; print_r($packageData); echo "</pre>"; die();
?>

<!DOCTYPE html>
<html lang="en">
<?php include './head.php'; ?>
<body class="font-dm-sans bg-white">
    <!-- Header -->
    <?php include './components/header.php'; ?>
    <main>
        <!-- Package Details Section -->
        <section data-aos="fade-up">
            <div class="">
                    <!-- Image Collage Banner -->
                    <?php if (!empty($imageList)): ?>
                    <!-- Desktop Layout -->
                    <div class="hidden lg:flex gap-5 mb-8 h-[496px]" data-aos="zoom-in" data-aos-delay="100">
                        <!-- Left Section - Large Image -->
                        <div class="<?php echo count($imageList) > 1 ? 'w-3/5' : 'w-full'; ?> relative overflow-hidden<?php echo count($imageList) === 1 ? ' rounded-br-[120px]' : ''; ?>">
                            <img src="./admin/files/packages/<?php echo htmlspecialchars($imageList[0]); ?>" alt="<?php echo htmlspecialchars($title); ?>" class="w-full h-full object-cover">
                        </div>
                        
                        <?php if (count($imageList) > 1): ?>
                        <!-- Right Section - up to 4 additional images -->
                        <div class="w-2/5 grid grid-cols-2 gap-5">
                            <?php
                            $gridImages = array_slice($imageList, 1, 4);
                            $gridCount = count($gridImages);
                            foreach ($gridImages as $gi => $imgName):
                                $isLast = ($gi === $gridCount - 1);
                            ?>
                            <div class="relative overflow-hidden <?php echo $isLast ? 'rounded-br-[120px]' : ''; ?>">
                                <img src="./admin/files/packages/<?php echo htmlspecialchars($imgName); ?>" alt="<?php echo htmlspecialchars($title); ?>" class="w-full h-full object-cover">
                                <?php if ($isLast): ?>
                                <div class="absolute inset-0 bg-black/20 flex items-center justify-center">
                                    <button onclick="openGallery()" class="bg-white rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-bold text-gray-900 shadow-lg hover:bg-gray-50 transition-colors">
                                        <i class="fi fi-bs-apps flex items-center justify-center"></i>
                                        Show all photos
                                    </button>
                                </div>
                                <?php endif; ?>
                            </div>
                            <?php endforeach; ?>
                        </div>
                        <?php endif; ?>
                    </div>
                    
                    <!-- Mobile/Tablet Layout with Carousel -->
                    <div class="lg:hidden mb-8" data-aos="zoom-in" data-aos-delay="150">
                        <div id="packageGalleryCarousel" class="splide">
                            <div class="splide__track relative">
                                <ul class="splide__list">
                                    <?php foreach ($imageList as $imgName): ?>
                                    <li class="splide__slide">
                                        <div class="relative overflow-hidden h-72">
                                            <img src="./admin/files/packages/<?php echo htmlspecialchars($imgName); ?>" alt="<?php echo htmlspecialchars($title); ?>" class="w-full h-full object-cover">
                                        </div>
                                    </li>
                                    <?php endforeach; ?>
                                </ul>
                                <div class="absolute bottom-6 right-4">
                                    <button onclick="openGallery()" class="bg-white rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-bold text-gray-900 shadow-lg hover:bg-gray-50 transition-colors">
                                        <i class="fi fi-bs-apps flex items-center justify-center"></i>
                                        Show all photos
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <?php endif; ?>
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 container mx-auto px-4" data-aos="fade-up" data-aos-delay="200">
                    
                    <!-- Left Column - Main Content -->
                    <div class="lg:col-span-2 space-y-8" data-aos="fade-up" data-aos-delay="220">
                        
                     
                        
                        <!-- Package Title -->
                        <h1 class="text-4xl font-bold text-gray-900 font-[Quicksand]" data-aos="fade-up" data-aos-delay="240"><?php echo htmlspecialchars($title); ?></h1>
                        
                        <!-- Key Details Cards -->
                        <div class="bg-gray-100 border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm" data-aos="fade-up" data-aos-delay="260">
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200/80">
                                <!-- Duration -->
                                <div class="p-6 flex flex-col justify-center">
                                    <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Duration</div>
                                    <div class="flex items-center gap-3">
                                        <i class="fi fi-rr-clock text-red-600 text-lg"></i>
                                        <div class="text-base font-bold text-gray-800"><?php echo htmlspecialchars($duration ? $duration : 'N/A'); ?></div>
                                    </div>
                                </div>
                                
                                <!-- Hotel -->
                                <div class="p-6 flex flex-col justify-center">
                                    <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Hotel</div>
                                    <div class="flex items-center gap-3">
                                        <i class="fi fi-rr-hotel text-red-600 text-lg"></i>
                                        <div class="text-base font-bold text-gray-800"><?php echo htmlspecialchars($hotelType ? $hotelType : 'N/A'); ?></div>
                                    </div>
                                </div>
                                
                                <!-- Transportation -->
                                <div class="p-6 flex flex-col justify-center">
                                    <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Transfers</div>
                                    <div class="flex items-center gap-3">
                                        <i class="fi fi-rr-plane text-red-600 text-lg"></i>
                                        <div class="text-base font-bold text-gray-800"><?php echo isset($packageData['transportation']) && !empty($packageData['transportation']) ? htmlspecialchars($packageData['transportation']) : 'Included'; ?></div>
                                    </div>
                                </div>
                                
                                <!-- Activities OR Start Date -->
                                <?php if($category == 'fixed_departures'): ?>
                                    <div class="p-6 flex flex-col justify-center">
                                        <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Start Date</div>
                                        <div class="flex items-center gap-3">
                                            <i class="fi fi-rr-calendar text-red-600 text-lg"></i>
                                            <div class="text-base font-bold text-gray-800">
                                                <?php echo !empty($fixedDate) ? date('d M, Y', strtotime($fixedDate)) : 'On Request'; ?>
                                            </div>
                                        </div>
                                    </div>
                                <?php else: ?>
                                    <div class="p-6 flex flex-col justify-center">
                                        <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Activities</div>
                                        <div class="flex items-center gap-3">
                                            <i class="fi fi-rr-canoe text-red-600 text-lg"></i>
                                            <div class="text-base font-bold text-gray-800"><?php echo isset($packageData['no_of_activites']) ? htmlspecialchars($packageData['no_of_activites']) : '4'; ?> Included</div>
                                        </div>
                                    </div>
                                <?php endif; ?>
                            </div>
                        </div>
                        
                        <!-- Overview Section -->
                        <div class="space-y-4" data-aos="fade-up" data-aos-delay="280">
                            <h2 class="text-lg font-bold text-gray-900 font-dm-sans">Overview</h2>
                            <p class="text-gray-600 leading-relaxed">
                                <?php echo nl2br($description); ?>
                            </p>
                        </div>
                        
                        <!-- Highlights Se1ction -->
                        <div class="space-y-4" data-aos="fade-up" data-aos-delay="300">
                            <div class="flex items-center gap-3">
                                <div class="w-[2px] h-4 bg-red-500 rounded-full"></div>
                                <h2 class="text-lg font-bold text-gray-900 font-dm-sans">Highlights</h2>
                            </div>
                            <ul class="space-y-3">
                                <?php 
                                if (!empty($highlights)) {
                                    foreach ($highlights as $highlight) {
                                        if (isset($highlight['highlights'])) {
                                ?>
                                <li class="flex items-start gap-3 flex items-center">
                                    <i class="fi fi-rr-rhombus text-xs text-gray-600 flex items-center justify-center"></i>
                                    <span class="text-gray-600"><?php echo htmlspecialchars($highlight['highlights']); ?></span>
                                </li>
                                <?php 
                                        }
                                    }
                                } else {
                                    echo '<li class="text-gray-500">No highlights available.</li>';
                                }
                                ?>
                            </ul>
                        </div>
                        
                        <!-- Itinerary Section -->
                        <div class="bg-gray-100  rounded-xl p-6 space-y-6" data-aos="fade-up" data-aos-delay="320">
                            <div class="flex items-center gap-3">
                                <div class="w-[2px] h-4 bg-red-500 rounded-full"></div>
                                <h2 class="text-xl font-bold text-gray-900 font-dm-sans">Itinerary</h2>
                            </div>
                            
                            <div class="space-y-6">
                                <?php 
                                if (!empty($itinearys)) {
                                    $dayCounter = 1;
                                    foreach ($itinearys as $day) {
                                        if (isset($day['title']) && isset($day['description'])) {
                                            $isLast = ($dayCounter == count($itinearys));
                                ?>
                                <!-- Day <?php echo $dayCounter; ?> -->
                                <div class="lg:flex gap-4 <?php echo $isLast ? '' : 'border-b border-gray-200 pb-4 lg:border-b-0'; ?>">
                                    <div class="flex-shrink-0 mb-2 lg:mb-0">
                                        <span class="inline-block bg-white <?php echo $dayCounter == 1 ? '' : 'border border-gray-100'; ?> text-gray-700 text-sm font-medium px-3 py-1 rounded-full">Day <?php echo $dayCounter; ?></span>
                                    </div>
                                    <div class="flex-1">
                                        <h3 class="text-lg font-semibold text-gray-900 mb-2"><?php echo nl2br($day['title']); ?></h3>
                                        <p class="text-gray-600 leading-relaxed"><?php echo nl2br(strip_tags(html_entity_decode($day['description']))); ?></p>
                                        <?php if (!empty($day['image'])): ?>
                                            <div class="mt-4 overflow-hidden rounded-xl">
                                                <img src="./admin/files/itineary/<?php echo htmlspecialchars($day['image']); ?>"
                                                     alt="<?php echo htmlspecialchars(strip_tags(html_entity_decode($day['title']))); ?>"
                                                     class="w-full max-h-72 object-cover">
                                            </div>
                                        <?php endif; ?>
                                    </div>
                                </div>
                                <?php 
                                            $dayCounter++;
                                        }
                                    }
                                } else {
                                    echo '<div class="text-gray-500 text-center py-4">No itinerary available.</div>';
                                }
                                ?>
                            </div>
                        </div>
                        
                        <!-- Inclusions & Exclusions Section -->
                        <div class="bg-white rounded-xl" data-aos="fade-up" data-aos-delay="340">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <!-- Inclusions -->
                                <div class="space-y-4">
                                    <div class="flex items-center gap-3">
                                        <div class="w-[2px] h-4 bg-red-500 rounded-full"></div>
                                        <h2 class="text-xl font-bold text-gray-900 font-dm-sans">Inclusions</h2>
                                    </div>
                                    <ul class="space-y-3">
                                        <?php 
                                        if (!empty($includes)) {
                                            foreach ($includes as $include) {
                                                if (isset($include['includes'])) {
                                        ?>
                                        <li class="flex items-start gap-3">
                                            <i class="fi fi-rr-check text-green-500 text-sm mt-0.5"></i>
                                            <span class="text-gray-700"><?php echo htmlspecialchars($include['includes']); ?></span>
                                        </li>
                                        <?php 
                                                }
                                            }
                                        } else {
                                            echo '<li class="text-gray-500">No inclusions available.</li>';
                                        }
                                        ?>
                                    </ul>
                                </div>
                                
                                <!-- Exclusions -->
                                <div class="space-y-4">
                                    <div class="flex items-center gap-3">
                                        <div class="w-[2px] h-4 bg-red-500 rounded-full"></div>
                                        <h2 class="text-xl font-bold text-gray-900 font-dm-sans">Exclusions</h2>
                                    </div>
                                    <ul class="space-y-3">
                                        <?php 
                                        if (!empty($excludes)) {
                                            foreach ($excludes as $exclude) {
                                                if (isset($exclude['excludes'])) {
                                        ?>
                                        <li class="flex items-start gap-3">
                                            <i class="fi fi-rr-cross text-red-500 text-sm mt-0.5"></i>
                                            <span class="text-gray-700"><?php echo htmlspecialchars($exclude['excludes']); ?></span>
                                        </li>
                                        <?php 
                                                }
                                            }
                                        } else {
                                            echo '<li class="text-gray-500">No exclusions available.</li>';
                                        }
                                        ?>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <!-- FAQ Section -->
                        <div class="bg-white rounded-xl" data-aos="fade-up" data-aos-delay="360">
                            <div class="flex items-center gap-3 mb-6">
                                <div class="w-[2px] h-4 bg-red-500 rounded-full"></div>
                                <h2 class="text-xl font-bold text-gray-900 font-dm-sans">Frequently Asked Questions</h2>
                            </div>
                            
                            <div class="space-y-4">
                                <?php 
                                if (!empty($faq)) {
                                    $faqIndex = 1;
                                    foreach ($faq as $faqItem) {
                                        if (isset($faqItem['question']) && isset($faqItem['answer'])) {
                                ?>
                                <!-- FAQ Item <?php echo $faqIndex; ?> -->
                                <div class="bg-gray-100 rounded-lg p-4">
                                    <div class="flex items-center justify-between cursor-pointer" onclick="toggleFAQ(<?php echo $faqIndex; ?>)">
                                        <h3 class="text-base font-semibold text-gray-900"><?php echo htmlspecialchars($faqItem['question']); ?></h3>
                                        <button class="w-8 h-8 bg-white rounded-lg flex items-center justify-center transition-colors" id="button-<?php echo $faqIndex; ?>">
                                            <i class="fi fi-rr-plus text-gray-800 text-sm flex items-center justify-center" id="icon-<?php echo $faqIndex; ?>"></i>
                                        </button>
                                    </div>
                                    <div class="text-gray-600 mt-3 leading-relaxed hidden" id="answer-<?php echo $faqIndex; ?>">
                                        <p><?php echo nl2br(htmlspecialchars($faqItem['answer'])); ?></p>
                                    </div>
                                </div>
                                <?php 
                                        $faqIndex++;
                                        }
                                    }
                                } else {
                                    echo '<div class="text-gray-500 text-center py-4">No FAQ available.</div>';
                                }
                                ?>
                            </div>
                        </div>
                        
                        <!-- Terms & Conditions Section -->
                        <div class="bg-white rounded-xl" data-aos="fade-up" data-aos-delay="380">
                            <div class="flex items-center gap-3 mb-6">
                                <div class="w-[2px] h-4 bg-red-500 rounded-full"></div>
                                <h2 class="text-xl font-bold text-gray-900 font-dm-sans">Terms & Conditions</h2>
                            </div>
                            
                            <div class="text-gray-600 leading-relaxed">
                                <p>All tour packages are subject to availability and confirmation at the time of booking. Prices are based on current exchange rates and may vary due to changes in airfare, hotel rates, or government taxes. A non-refundable advance payment is required to secure your booking, and the balance must be paid before the travel date as per the company's payment policy. Hotel rooms and services are subject to availability; in case of unavailability, a similar category hotel will be provided. The itinerary may be modified or rescheduled due to weather conditions, flight delays, or operational reasons without prior notice. Any unused portion of the tour, including meals, transfers, or sightseeing, is non-refundable. Travelers must ensure that their passport is valid for at least six months from the date of travel and are responsible for meeting all visa and travel requirements. The company will not be liable for any loss, injury, damage, or delay caused by natural calamities, accidents, or other unforeseen circumstances. Standard hotel check-in and check-out times apply unless otherwise mentioned. Personal expenses such as laundry, telephone calls, and shopping are not included. By confirming the booking, travelers agree to abide by the company's general terms, conditions, and travel policies.</p>
                            </div>
                        </div>
                        
                        <hr class="border-1 border-gray-200 my-8">
                        
                        
                    </div>
                    
                    <!-- Right Column - Gallery and Form -->
                    <div class="" data-aos="fade-left" data-aos-delay="260">
                        
                        
                        
                        <!-- Inquiry Form -->
                        <div class="sticky top-24 bg-gray-100 rounded-2xl p-6 mb-6" data-aos="fade-left" data-aos-delay="300">
                            <div class="space-y-4">
                                <div class="flex-col flex items-left justify-between">
                                    <div>
                                        <h3 class="text-xl font-bold text-gray-900 font-dm-sans">Plan your trip with us</h3>
                                        <p class="text-sm text-gray-500">Let's create your travel story</p>
                                    </div>
                                    <div class="text-left mt-2">
                                        <?php if (floatval($amount) > 0): ?>
                                        <div class="text-3xl font-bold text-gray-900">₹ <?php echo number_format($amount, 2); ?></div>
                                        <?php endif; ?>
                                    </div>
                                </div>
                                
                                <form id="package-enquiry-form" class="space-y-4">
                                    <input type="text" name="name" id="package-name" placeholder="Name" required class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-none focus:border-red-500">
                                    <input type="email" name="email" id="package-email" placeholder="Email Address" required class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-none focus:border-red-500">
                                    <div>
                                        <div class="flex gap-2">
                                            <input type="tel" name="phone" id="package-phone" placeholder="Contact Number" required class="flex-1 w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-none focus:border-red-500">
                                            <button type="button" id="package-sendOtpBtn" class="px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm font-medium whitespace-nowrap">Send OTP</button>
                                        </div>
                                        <?php renderEnquiryOtpFields('package'); ?>
                                    </div>
                                    <textarea name="notes" id="package-notes" placeholder="Additional Notes" rows="4" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-none focus:border-transparent resize-none"></textarea>
                                    <button type="submit" id="package-enquire-btn" class="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                                        Enquire Now
                                    </button>
                                </form>
                            </div>
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
    responsiveMenu('package'); // Set 'package' as active page
    ?>

    <!-- Gallery Overlay -->
    <div id="galleryOverlay" class="fixed inset-0 bg-black/50 z-50 hidden">
        <!-- Desktop Layout -->
        <div class="hidden lg:flex h-full">
            <!-- Left side - Blurred background -->
            <div class="flex-1 bg-[rgba(0, 0, 0, 0.28)] blur-sm cursor-pointer" onclick="closeGallery()"></div>
            <!-- Right side - Gallery -->
            <div class="w-1/3 bg-white flex flex-col">
                <!-- Gallery Header -->
                <div class="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900">Gallery (<?php echo count($imageList); ?> photos)</h3>
                    <button onclick="closeGallery()" class="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                        <i class="fi fi-rr-cross text-white text-sm flex items-center justify-center"></i>
                    </button>
                </div>

                <!-- Gallery Images -->
                <div class="flex-1 overflow-y-auto p-6 space-y-4">
                    <?php foreach ($imageList as $imgName): ?>
                            <div class="relative overflow-hidden rounded-lg">
                                <img src="./admin/files/packages/<?php echo htmlspecialchars($imgName); ?>" alt="<?php echo htmlspecialchars($title); ?>" class="w-full h-48 object-cover">
                            </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>

        <!-- Mobile/Tablet Layout -->
        <div class="lg:hidden h-full flex flex-col">
            <!-- Gallery Header -->
            <div class="flex items-center justify-between p-4 bg-white border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">Gallery (<?php echo count($imageList); ?> photos)</h3>
                <button onclick="closeGallery()" class="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                    <i class="fi fi-rr-cross text-white text-sm flex items-center justify-center"></i>
                </button>
            </div>

            <!-- Gallery Images - Grid Layout -->
            <div class="flex-1 bg-white overflow-y-auto p-4">
                <div class="grid grid-cols-2 gap-4">
                    <?php foreach ($imageList as $imgName): ?>
                            <div class="relative overflow-hidden rounded-lg">
                                <img src="./admin/files/packages/<?php echo htmlspecialchars($imgName); ?>" alt="<?php echo htmlspecialchars($title); ?>" class="w-full h-40 object-cover">
                            </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </div>

    <?php include './script.php'; ?>

  <script>
  const packageOtp = window.EnquiryOtp ? EnquiryOtp.getInstance('package') : null;

  document.getElementById('package-enquiry-form').addEventListener('submit', function(e) {
      e.preventDefault();

      if (packageOtp && !packageOtp.requireVerified()) {
          return;
      }

      const customerName = document.getElementById('package-name').value.trim();
      const customerEmail = document.getElementById('package-email').value.trim();
      const customerPhone = document.getElementById('package-phone').value.trim();
      const notes = document.getElementById('package-notes').value.trim();

      if (!customerName || !customerEmail || !customerPhone) {
          alert('Please fill in your name, email, and phone number.');
          return;
      }

      const submitBtn = document.getElementById('package-enquire-btn');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="fi fi-rr-spinner mr-2 animate-spin"></i>Submitting...';
      submitBtn.disabled = true;

      fetch('./action/submitPackageEnquiry.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              name: customerName,
              email: customerEmail,
              phone: customerPhone,
              notes: notes,
              package_id: <?php echo isset($packageData['package_id']) ? intval($packageData['package_id']) : 0; ?>
          })
      })
      .then((response) => response.json())
      .then((data) => {
          if (data.success) {
              const form = document.getElementById('package-enquiry-form');
              if (form) form.reset();
              if (packageOtp) packageOtp.reset();
              window.location.href = './thankyou.php';
          } else {
              alert(data.message || 'Failed to submit enquiry. Please try again.');
              submitBtn.innerHTML = originalText;
              submitBtn.disabled = false;
          }
      })
      .catch((error) => {
          console.error('Error:', error);
          alert('An error occurred. Please try again.');
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
      });
  });
  </script>

</body>
</html>
