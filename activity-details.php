<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Get slug from URL parameter
$slug = isset($_GET['slug']) ? $_GET['slug'] : '';

// Include necessary files
include './action/activitytDetails.php';

// Fetch activity details
$activityData = null;
if ($slug) {
    $activityJson = activityDetails($slug);
    $activityArray = json_decode($activityJson, true);
    if (!empty($activityArray)) {
        $activityData = $activityArray[0];
    }
}

// Set default values if no data found
$title = isset($activityData['title']) ? $activityData['title'] : 'Activity Details';
$description = isset($activityData['description']) ? $activityData['description'] : '';
$cardImage = isset($activityData['cardImage']) ? $activityData['cardImage'] : '';

// Meta tags for Activity Details Page
$pageTitle = $title . ' - Mangalam Travel & Tours | Activity Details';
$pageDescription = !empty($description)
    ? $description
    : 'Explore this exciting activity with Mangalam Travel & Tours. Book now and create unforgettable travel memories.';
$pageKeywords = $title . ', travel activity, adventure, vacation activity, Mangalam Tours activity';
$pageImage = !empty($cardImage) ? './admin/files/activities/' . $cardImage : '';
$pageUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
$pageType = 'article';
$displayAmount = isset($activityData['display_amount']) ? $activityData['display_amount'] : 0;
$childAmount = isset($activityData['childAmount']) ? $activityData['childAmount'] : 0;
$duration = isset($activityData['duration']) ? $activityData['duration'] : '';
$validity = isset($activityData['validity']) ? $activityData['validity'] : '';
$images = isset($activityData['images']) ? $activityData['images'] : [];
$highlights = isset($activityData['highlights']) ? $activityData['highlights'] : [];
$includes = isset($activityData['includes']) ? $activityData['includes'] : [];
$excludes = isset($activityData['excludes']) ? $activityData['excludes'] : [];
$thinksToKnow = isset($activityData['thinks_to_know']) ? $activityData['thinks_to_know'] : [];
$faq = isset($activityData['faq']) ? $activityData['faq'] : [];
// Do not render meta from DB to avoid encoded tags leaking to page
$meta = null;

// Debug: Uncomment to see data structure
// echo "<pre>"; print_r($activityData); echo "</pre>"; die();

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
// Helper to safely render overview HTML coming from DB that may be double-encoded
function renderSafeOverview($rawHtml)
{
    if (!is_string($rawHtml)) {
        return '';
    }
    $decoded = $rawHtml;
    // Decode entities multiple times to handle double-encoding like &amp;lt; p &amp;gt;
    for ($i = 0; $i < 3; $i++) {
        $newDecoded = html_entity_decode($decoded, ENT_QUOTES | ENT_HTML5);
        if ($newDecoded === $decoded) {
            break;
        }
        $decoded = $newDecoded;
    }
    // Render decoded HTML from rich text editor as-is
    return $decoded;
}
?>

<!DOCTYPE html>
<html lang="en">
<?php include './head.php'; ?>

<body class="font-dm-sans bg-white">
    <!-- Header -->
    <?php include './components/header.php'; ?>
    <main>
        <?php if (empty($activityData)): ?>
        <section class="py-24">
            <div class="container mx-auto px-4 text-center">
                <h1 class="text-3xl font-bold text-gray-900 font-[Quicksand] mb-3">Activity not found</h1>
                <p class="text-gray-600 font-dm-sans mb-6">This activity may have been removed or the link is incorrect.</p>
                <a href="attraction.php" class="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors font-dm-sans">
                    Browse attractions
                </a>
            </div>
        </section>
        <?php else: ?>
        <!-- Package Details Section -->
        <section data-aos="fade-up">
            <div class="">
                <!-- Image Collage Banner -->
                <?php if (!empty($imageList)): ?>
                <!-- Desktop Layout -->
                <div class="hidden lg:flex gap-5 mb-8 h-[496px]" data-aos="zoom-in" data-aos-delay="100">
                    <div class="<?php echo count($imageList) > 1 ? 'w-3/5' : 'w-full'; ?> relative overflow-hidden<?php echo count($imageList) === 1 ? ' rounded-br-[120px]' : ''; ?>">
                        <img src="./admin/files/activities/<?php echo htmlspecialchars($imageList[0]); ?>" alt="<?php echo htmlspecialchars($title); ?>" class="w-full h-full object-cover">
                    </div>

                    <?php if (count($imageList) > 1): ?>
                    <div class="w-2/5 grid grid-cols-2 gap-5">
                        <?php
                        $gridImages = array_slice($imageList, 1, 4);
                        $gridCount = count($gridImages);
                        foreach ($gridImages as $gi => $imgName):
                            $isLast = ($gi === $gridCount - 1);
                        ?>
                            <div class="relative overflow-hidden <?php echo $isLast ? 'rounded-br-[120px]' : ''; ?>">
                                <img src="./admin/files/activities/<?php echo htmlspecialchars($imgName); ?>" alt="<?php echo htmlspecialchars($title); ?>" class="w-full h-full object-cover">
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
                                                <img src="./admin/files/activities/<?php echo htmlspecialchars($imgName); ?>" alt="<?php echo htmlspecialchars($title); ?>" class="w-full h-full object-cover">
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
                        <div class="bg-gray-100  rounded-xl overflow-hidden" data-aos="fade-up" data-aos-delay="260">
                            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                <!-- Duration -->
                                <div class="p-6 border-r border-gray-200 border-b md:border-b-0 md:border-r-0 lg:border-r">
                                    <div class="text-sm font-medium text-gray-600 mb-3">Duration</div>
                                    <div class="flex items-center gap-3">
                                        <i class="fi fi-rr-night-day text-base text-gray-800"></i>
                                        <div class="text-base font-semibold text-gray-800"><?php echo htmlspecialchars($duration); ?></div>
                                    </div>
                                </div>

                                <!-- Hotel -->
                                <div class="p-6 border-r border-gray-200 border-b md:border-b-0 md:border-r-0 lg:border-r">
                                    <div class="text-sm font-medium text-gray-600 mb-3">Cancellation</div>
                                    <div class="flex items-center gap-3 ">
                                        <i class="fi fi-rr-circle-xmark text-base text-gray-800 flex items-center justify-center"></i>
                                        <div class="text-base font-semibold text-gray-800"><?php echo isset($activityData['cancellation']) ? htmlspecialchars($activityData['cancellation']) : 'Not specified'; ?></div>
                                    </div>
                                </div>

                                <!-- Transportation -->
                                <div class="p-6 border-r border-gray-200 md:border-r-0 lg:border-r">
                                    <div class="text-sm font-medium text-gray-600 mb-3">Transportation</div>
                                    <div class="flex items-center gap-3">
                                        <i class="fi fi-rr-car text-base text-gray-800 flex items-center justify-center"></i>
                                        <div class="text-base font-semibold text-gray-800"><?php echo isset($activityData['transportation']) ? htmlspecialchars($activityData['transportation']) : 'Not Included'; ?></div>
                                    </div>
                                </div>

                                <!-- Activities -->
                                <div class="p-6 border-r border-gray-200 md:border-r-0">
                                    <div class="text-sm font-medium text-gray-600 mb-3">Validity</div>
                                    <div class="flex items-center gap-3">
                                        <i class="fi fi-rr-calendar-check text-base text-gray-800 flex items-center justify-center"></i>
                                        <div class="text-base font-semibold text-gray-800"><?php echo htmlspecialchars($validity); ?></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Overview Section -->
                        <div class="space-y-4" data-aos="fade-up" data-aos-delay="280">
                            <h2 class="text-lg font-bold text-gray-900 font-dm-sans">Overview</h2>
                            <div class="text-gray-600 leading-relaxed">
                                <?php echo nl2br(renderSafeOverview($description)); ?>
                            </div>
                        </div>

                        <!-- Highlights Section -->
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

                        <!-- Things To Know Section -->
                        <div class="bg-gray-100 rounded-xl p-6 space-y-6" data-aos="fade-up" data-aos-delay="320">
                            <div class="flex items-center gap-3">
                                <div class="w-[2px] h-4 bg-red-500 rounded-full"></div>
                                <h2 class="text-xl font-bold text-gray-900 font-dm-sans">Things To Know</h2>
                            </div>

                            <ul class="space-y-4">
                                <?php
                                if (!empty($thinksToKnow)) {
                                    foreach ($thinksToKnow as $thing) {
                                        if (isset($thing['data'])) {
                                ?>
                                            <li class="flex items-start gap-3">
                                                <i class="fi fi-rr-angle-small-right text-red-500 text-base mt-1 flex items-center justify-center"></i>
                                                <span class="text-gray-700 leading-relaxed"><?php echo htmlspecialchars($thing['data']); ?></span>
                                            </li>
                                <?php
                                        }
                                    }
                                } else {
                                    echo '<li class="text-gray-500">No information available.</li>';
                                }
                                ?>
                            </ul>
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
                    <div class="space-y-8" data-aos="fade-left" data-aos-delay="260">

                        <!-- Booking Form -->
                        <div class="sticky top-24 bg-gray-100 rounded-2xl p-4 lg:p-6 mb-6" style="pointer-events: auto; z-index: 5;" data-aos="fade-left" data-aos-delay="300">
                            <div class="space-y-6" style="pointer-events: auto;">
                                <div class="text-center">
                                    <h3 class="text-xl font-bold text-gray-900 font-dm-sans">Add To Bag</h3>
                                </div>

                                <form class="space-y-6">
                                    <!-- Date Selection -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Choose Date</label>
                                        <input type="date" id="activity-date-input" min="<?php echo date('Y-m-d'); ?>" required title="Please select your travel date" data-date-input="true" data-date-placeholder="DD/MM/YYYY" placeholder="DD/MM/YYYY" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-none focus:border-red-400">
                                    </div>

                                    <!-- Adults Section -->
                                    <div class="bg-white border border-gray-200 rounded-lg p-4">
                                        <div class="mb-2">
                                            <p class="text-sm text-gray-600">12 years and above.</p>
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <div class="mb-3">
                                                <div>
                                                    <label class="block text-sm font-medium text-gray-700">Adults</label>

                                                    <?php if (floatval($displayAmount) > 0): ?>
                                                    <div class="text-lg font-bold text-gray-900">₹ <?php echo number_format($displayAmount, 2); ?></div>
                                                    <div class="font-medium text-xs text-gray-500">Per Person</div>
                                                    <?php endif; ?>
                                                </div>
                                            </div>
                                            <div class="flex items-center justify-center space-x-4">
                                                <button type="button" onclick="decreaseQuantity('adults')" class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                                                    <i class="fi fi-rr-minus text-gray-600 text-sm flex items-center justify-center"></i>
                                                </button>
                                                <input type="number" id="adults-quantity" value="1" min="0" class="w-10 text-center border-2 border-gray-400 rounded-lg py-1 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none">
                                                <button type="button" onclick="increaseQuantity('adults')" class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                                                    <i class="fi fi-rr-plus text-gray-600 text-sm flex items-center justify-center"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Child Section -->
                                    <div class="bg-white border border-gray-200 rounded-lg p-4">
                                        <div class="mb-2">
                                            <p class="text-sm text-gray-600">3 years to 12 years. Should be accompanied by an adult.</p>
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <div class="mb-3">
                                                <div>
                                                    <label class="block text-sm font-medium text-gray-700">Child</label>

                                                    <?php if (floatval($childAmount) > 0): ?>
                                                    <div class="text-lg font-bold text-gray-900">₹ <?php echo number_format($childAmount, 2); ?></div>
                                                    <div class="font-medium text-xs text-gray-500">Per Child</div>
                                                    <?php endif; ?>
                                                </div>
                                            </div>
                                            <div class="flex items-center justify-center space-x-4">
                                                <button type="button" onclick="decreaseQuantity('child')" class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                                                    <i class="fi fi-rr-minus text-gray-600 text-sm flex items-center justify-center"></i>
                                                </button>
                                                <input type="number" id="child-quantity" value="0" min="0" class="w-10 text-center border-2 border-gray-400 rounded-lg py-1 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" onchange="updateChildrenAges()">
                                                <button type="button" onclick="increaseQuantity('child')" class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                                                    <i class="fi fi-rr-plus text-gray-600 text-sm flex items-center justify-center"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Children Ages Section -->
                                        <div id="children-ages-container" class="mt-4 space-y-2" style="display: none;">
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Children Ages (3-12 years)</label>
                                            <div id="children-ages-inputs" class="space-y-2">
                                                <!-- Age inputs will be dynamically added here -->
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Continue Button -->
                                    <button type="button" id="activity-add-to-cart-btn"
                                        onclick="handleActivityCartClick(this); return false;"
                                        class="w-full bg-black text-white py-4 rounded-lg font-semibold hover:from-pink-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center space-x-2 relative z-10 cursor-pointer"
                                        data-item-id="act-<?php echo isset($activityData['id']) ? $activityData['id'] : 'unknown'; ?>"
                                        data-item-type="Activity"
                                        data-item-title="<?php echo htmlspecialchars($title); ?>"
                                        data-item-thumbnail="<?php echo !empty($imageList) ? './admin/files/activities/' . htmlspecialchars($imageList[0]) : ''; ?>"
                                        data-item-amount="<?php echo $displayAmount; ?>"
                                        data-item-child-amount="<?php echo $childAmount; ?>"
                                        data-item-date="<?php echo date('Y-m-d', strtotime('+7 days')); ?>"
                                        data-item-destination-id="<?php echo isset($activityData['destination_id']) ? $activityData['destination_id'] : ''; ?>"
                                        data-adults="1"
                                        data-children="0"
                                        style="pointer-events: auto; z-index: 10; cursor: pointer;">
                                        <span>Continue to Bag</span>
                                        <i class="fi fi-rr-arrow-right text-lg flex items-center justify-center"></i>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <?php endif; ?>
    </main>
    <?php include './components/footer.php'; ?>

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
                                <img src="./admin/files/activities/<?php echo htmlspecialchars($imgName); ?>" alt="<?php echo htmlspecialchars($title); ?>" class="w-full h-48 object-cover">
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
                                <img src="./admin/files/activities/<?php echo htmlspecialchars($imgName); ?>" alt="<?php echo htmlspecialchars($title); ?>" class="w-full h-40 object-cover">
                            </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </div>

    <?php include './components/Customize.php'; ?>
    <?php include './components/FixedCustomizeButton.php'; ?>
    <?php 
    include './components/MobileNav.php';
    responsiveMenu('activity');
    ?>

    <?php include './script.php'; ?>

    <script>
        // Function to update children ages inputs dynamically
        window.updateChildrenAges = function() {
            const childQuantity = parseInt(document.getElementById('child-quantity').value) || 0;
            const container = document.getElementById('children-ages-container');
            const inputsContainer = document.getElementById('children-ages-inputs');

            if (childQuantity > 0) {
                container.style.display = 'block';
                inputsContainer.innerHTML = '';

                for (let i = 0; i < childQuantity; i++) {
                    const ageInput = document.createElement('input');
                    ageInput.type = 'number';
                    ageInput.min = '3';
                    ageInput.max = '12';
                    ageInput.placeholder = `Child ${i + 1} Age`;
                    ageInput.className = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:outline-none';
                    ageInput.id = `child-age-${i + 1}`;
                    ageInput.required = true;
                    ageInput.title = 'Please enter age between 3-12 years';
                    inputsContainer.appendChild(ageInput);
                }
            } else {
                container.style.display = 'none';
                inputsContainer.innerHTML = '';
            }
        };

        // Set custom validation message for date input using native HTML5 validation
        document.addEventListener('DOMContentLoaded', function() {
            const dateInput = document.getElementById('activity-date-input');
            if (dateInput) {
                dateInput.addEventListener('invalid', function(e) {
                    if (!dateInput.value) {
                        dateInput.setCustomValidity('Please select your travel date to continue');
                    }
                });
                dateInput.addEventListener('input', function(e) {
                    dateInput.setCustomValidity('');
                });
            }

            // Initialize children ages on page load
            updateChildrenAges();
        });

        // Force check right after script.php includes
        console.log('=== RIGHT AFTER SCRIPT.PHP INCLUDE ===');
        console.log('addActivityToCart immediately:', typeof window.addActivityToCart);

        // Try to manually define if missing
        if (typeof window.addActivityToCart === 'undefined') {
            console.error('⚠️ addActivityToCart is undefined! Attempting to define it...');
            window.addActivityToCart = function(button) {
                console.log('Manual addActivityToCart called');
                if (typeof window.insertIntoCart === 'function') {
                    // Get form data
                    const form = button.closest('form');
                    if (!form) {
                        alert('Form not found');
                        return;
                    }

                    const dateInput = form.querySelector('#activity-date-input') || document.querySelector('#activity-date-input');
                    const adultsInput = form.querySelector('#adults-quantity') || document.querySelector('#adults-quantity');
                    const childrenInput = form.querySelector('#child-quantity') || document.querySelector('#child-quantity');

                    const selectedDate = dateInput ? dateInput.value : '';
                    const adults = adultsInput ? parseInt(adultsInput.value) || 1 : 1;
                    const children = childrenInput ? parseInt(childrenInput.value) || 0 : 0;

                    if (!selectedDate) {
                        if (dateInput) {
                            dateInput.reportValidity();
                        }
                        return;
                    }

                    if (adults <= 0 && children <= 0) {
                        alert('Please select at least one person');
                        return;
                    }

                    // Collect children ages
                    const ageArray = [];
                    if (children > 0) {
                        console.log('=== COLLECTING CHILDREN AGES ===');
                        console.log('Children count:', children);
                        for (let i = 1; i <= children; i++) {
                            const ageInput = document.getElementById(`child-age-${i}`);
                            console.log(`Child ${i} - Input element:`, ageInput);
                            if (ageInput && ageInput.value) {
                                const age = parseInt(ageInput.value);
                                console.log(`Child ${i} - Age value: ${age}, Input value: "${ageInput.value}"`);
                                if (age >= 3 && age <= 12) {
                                    ageArray.push(age);
                                    console.log(`✅ Added age ${age} to array. Current array:`, ageArray);
                                } else {
                                    alert(`Please enter valid age (3-12 years) for Child ${i}`);
                                    ageInput.focus();
                                    return;
                                }
                            } else {
                                console.log(`⚠️ Child ${i} - No age input or value found`);
                                alert(`Please enter age for Child ${i}`);
                                if (ageInput) ageInput.focus();
                                return;
                            }
                        }
                    }
                    console.log('=== FINAL AGE ARRAY ===');
                    console.log('Age array:', ageArray);
                    console.log('Age array length:', ageArray.length);
                    console.log('Age array JSON:', JSON.stringify(ageArray));

                    // CRITICAL: Ensure ageArray matches children count exactly
                    if (children > 0 && ageArray.length !== children) {
                        console.error('❌ ERROR: Age array length does not match children count!');
                        console.error('Children count:', children);
                        console.error('Age array length:', ageArray.length);
                        console.error('Age array:', ageArray);
                        alert('Error: Please ensure all child ages are entered correctly.');
                        return;
                    }

                    const cartItem = {
                        id: button.getAttribute('data-item-id'),
                        type: button.getAttribute('data-item-type'),
                        title: button.getAttribute('data-item-title'),
                        thumbnail: button.getAttribute('data-item-thumbnail'),
                        amount: parseInt(button.getAttribute('data-item-amount')) || 0,
                        childAmount: parseInt(button.getAttribute('data-item-child-amount')) || 0,
                        date: selectedDate,
                        destinationId: button.getAttribute('data-item-destination-id') || '',
                        adults: adults,
                        children: children,
                        age: ageArray // This should be an array with actual numbers, not null
                    };

                    console.log('=== CART ITEM TO BE SAVED ===');
                    console.log('Full cartItem object:', JSON.stringify(cartItem, null, 2));
                    console.log('CartItem age property:', cartItem.age);
                    console.log('CartItem age type:', typeof cartItem.age);
                    console.log('CartItem age is array:', Array.isArray(cartItem.age));
                    console.log('CartItem children:', cartItem.children);
                    console.log('CartItem age length:', cartItem.age.length);

                    // Verify age array has valid values
                    if (cartItem.children > 0) {
                        const validAges = cartItem.age.filter(age => age != null && age !== undefined);
                        console.log('Valid ages count:', validAges.length, 'out of', cartItem.age.length);
                        if (validAges.length !== cartItem.children) {
                            console.error('❌ CRITICAL: Age array does not contain valid ages for all children!');
                            console.error('Expected valid ages:', cartItem.children);
                            console.error('Actual valid ages:', validAges.length);
                            alert('Error: Please ensure all child ages are entered correctly.');
                            return;
                        }
                    }

                    window.insertIntoCart([cartItem]);

                    // Verify it was saved correctly
                    setTimeout(() => {
                        // Try to get cart data - check multiple possible function names
                        let savedCart = [];
                        if (typeof window.getCartData === 'function') {
                            savedCart = window.getCartData();
                        } else if (typeof getCartData === 'function') {
                            savedCart = getCartData();
                        } else {
                            // Direct localStorage access
                            try {
                                const cartData = localStorage.getItem('cartItem');
                                if (cartData) {
                                    savedCart = JSON.parse('[' + cartData + ']');
                                }
                            } catch (e) {
                                console.error('Error reading from localStorage:', e);
                            }
                        }

                        const savedItem = savedCart.find(item => item.id === cartItem.id);
                        if (savedItem) {
                            console.log('=== VERIFICATION: SAVED ITEM ===');
                            console.log('Saved item age:', savedItem.age);
                            console.log('Saved item age type:', typeof savedItem.age);
                            console.log('Saved item age is array:', Array.isArray(savedItem.age));
                            console.log('Saved item age length:', Array.isArray(savedItem.age) ? savedItem.age.length : 'N/A');
                            if (Array.isArray(savedItem.age)) {
                                console.log('Saved item age values:', savedItem.age.map((age, idx) => `[${idx}]: ${age}`).join(', '));
                            }
                            console.log('Saved item full object:', JSON.stringify(savedItem, null, 2));

                            // Compare with what we sent
                            if (JSON.stringify(savedItem.age) !== JSON.stringify(cartItem.age)) {
                                console.error('❌ AGE MISMATCH! Sent:', cartItem.age, 'Saved:', savedItem.age);
                            } else {
                                console.log('✅ Ages match correctly!');
                            }
                        } else {
                            console.error('❌ Item was not found in cart after saving!');
                        }
                    }, 100);

                    const originalText = button.innerHTML;
                    button.innerHTML = '<i class="fi fi-rr-check mr-2"></i>Added to Cart!';
                    button.classList.add('bg-green-600');
                    button.classList.remove('bg-black');

                    if (typeof window.showToaster === 'function') {
                        window.showToaster('<i class="fi fi-rr-shopping-cart"></i> &nbsp; Activity Added To Cart');
                    }

                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.classList.remove('bg-green-600');
                        button.classList.add('bg-black');
                    }, 2000);
                } else {
                    alert('Cart system not available. Please refresh the page.');
                }
            };
            console.log('✅ Manually defined addActivityToCart');
        }

        // Handler function that will be called when button is clicked
        window.handleActivityCartClick = function(button) {
            console.log('Button clicked - handleActivityCartClick called');

            // Try to call the function directly
            if (typeof window.addActivityToCart === 'function') {
                console.log('Calling addActivityToCart...');
                window.addActivityToCart(button);
            } else {
                console.error('addActivityToCart not available');

                // Try waiting a bit and retry
                let retryCount = 0;

                function retryCall() {
                    retryCount++;
                    if (retryCount > 20) {
                        alert('Cart functionality is not available. Please check the browser console for errors and refresh the page.');
                        return;
                    }

                    if (typeof window.addActivityToCart === 'function') {
                        console.log('Function now available, calling...');
                        window.addActivityToCart(button);
                    } else {
                        setTimeout(retryCall, 100);
                    }
                }

                setTimeout(retryCall, 50);
            }
        };

        // Ensure button is always clickable
        document.addEventListener('DOMContentLoaded', function() {
            const btn = document.getElementById('activity-add-to-cart-btn');
            if (btn) {
                btn.style.pointerEvents = 'auto';
                btn.style.cursor = 'pointer';
                console.log('✅ Activity button ready');
            }
        });

        // Log function availability after page load
        window.addEventListener('load', function() {
            console.log('=== PAGE LOADED - CHECKING FUNCTIONS ===');
            console.log('addActivityToCart:', typeof window.addActivityToCart);
            console.log('insertIntoCart:', typeof window.insertIntoCart);

            const btn = document.getElementById('activity-add-to-cart-btn');
            if (btn && typeof window.addActivityToCart !== 'function') {
                console.warn('⚠️ addActivityToCart function still not available after page load');
            }
        });
    </script>

</body>

</html>
