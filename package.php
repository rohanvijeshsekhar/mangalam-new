<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
/* to get parameter */
include './utility/getParmsValues.php';
include './action/destitnationPTA.php';

// Get parameters from URL query string or URL segments
$slug = isset($_GET['slug']) ? $_GET['slug'] : getParamValues(2);
$type = isset($_GET['type']) ? $_GET['type'] : getParamValues(3);

// Meta tags for Packages Page
$destinationName = ucfirst($slug ? $slug : 'Thailand');
$pageTitle = $destinationName . ' Tour Packages - Mangalam Travel & Tours | Customized Travel Packages';
$pageDescription = 'Explore amazing tour packages for ' . $destinationName . ' with Mangalam Travel & Tours. Book customized travel packages, activities, and tickets for an unforgettable journey.';
$pageKeywords = $destinationName . ' tour packages, ' . $destinationName . ' travel packages, vacation packages, customized tours, ' . $destinationName . ' holiday packages, Mangalam Tours';
$pageImage = './assets/images/destination-banner.webp';
$pageUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

// Default values if no URL parameters provided
if (!$slug) {
    $slug = 'thailand'; // default destination
}
if (!$type) {
    $type = 'package'; // default type
}

$tabIndex       = 1;
$imageDirectory = null;
$innerPagePath  = null;
switch ($type) {
    case 'package':
        $tabIndex       = 1;
        $imageDirectory = 'packages';
        $innerPagePath  = 'package-details.php';
        break;
    case 'ticket':
        $tabIndex       = 2;
        $imageDirectory = 'tickets';
        $innerPagePath  = 'tickets-details.php';
        break;
    case 'activities':
        $tabIndex       = 3;
        $imageDirectory = 'activities';
        $innerPagePath  = 'activity-details.php';
        break;
}

/* now get the destination data fron the server */
$destination = null;
if ($slug) {
    $destination = json_decode(destinationDetails($tabIndex, $slug));
}

$destinationName = '';
$data = [];
$cover = '';
$description = '';
$meta = '<meta name="robots" content="index, follow">';

if ($destination && is_array($destination)) {
    foreach ($destination as $dest) {
        if (isset($dest->destination_name)) {
            $destinationName = $dest->destination_name;
        }
        if (isset($dest->destination_image)) {
            $cover = $dest->destination_image;
        }
        if (isset($dest->description)) {
            $description = $dest->description;
        }
        // Ignore DB-provided meta tags to avoid rendering raw tags from external sources

        if ($type == 'package') {
            if (isset($dest->packages)) {
                $data = $dest->packages;
            } else {
                $data = [];
            }
        } else if ($type == 'ticket') {
            if (isset($dest->tickets)) {
                $data = $dest->tickets;
            } else {
                $data = [];
            }
        } else {
            if (isset($dest->activity)) {
                $data = $dest->activity;
            } else {
                $data = [];
            }
        }
    }
}

// Build clean SEO meta based on resolved destination and type
$safeDestination = ucfirst($destinationName);
if ($type === 'package') {
    $pageTitle = "Best Personalized Holiday Packages in {$safeDestination} | Mangalam Travel & Tours";
    $pageDescription = "Discover the best personalized holiday packages in {$safeDestination} with Mangalam Travel & Tours. Tailor-made experiences for your dream vacation.";
    $pageKeywords = strtolower($safeDestination) . " tour packages, holiday packages, customized tours, mangalam";
} elseif ($type === 'ticket') {
    $pageTitle = "Top Tickets and Attractions in {$safeDestination} | Mangalam Travel & Tours";
    $pageDescription = "Book popular attraction tickets in {$safeDestination}. Secure, easy, and curated by Mangalam Travel & Tours.";
    $pageKeywords = strtolower($safeDestination) . " tickets, attractions, activities, mangalam";
} else {
    $pageTitle = "Best Activities in {$safeDestination} | Mangalam Travel & Tours";
    $pageDescription = "Handpicked activities and experiences in {$safeDestination}. Customize and book with Mangalam Travel & Tours.";
    $pageKeywords = strtolower($safeDestination) . " activities, experiences, things to do, mangalam";
}

// Ensure no legacy hardcoded <title> or external canonical slips through
$meta = null;
?>

<!DOCTYPE html>
<html lang="en">
<?php include './head.php'; ?>

<body class="font-dm-sans bg-white">
    <?php
    // Set active tab based on type
    $activeTab = 'packages';
    if ($type == 'ticket') {
        $activeTab = 'tickets';
    } elseif ($type == 'activities' || $type == 'activity') {
        $activeTab = 'activity';
    }
    ?>
    <script>
        window.initialActiveTab = '<?php echo $activeTab; ?>';
    </script>
    <!-- Header -->
    <?php include './components/header.php'; ?>

    <main class="pt-20 md:pt-24">
        <!-- Hero Section -->
        <section class="relative h-[45vh] min-h-[340px] overflow-hidden flex items-center justify-center" data-aos="fade-up">
            <!-- Background Image -->
            <div class="absolute inset-0<?php echo empty($cover) ? ' bg-gray-800' : ''; ?>" data-aos="zoom-in" data-aos-delay="100">
                <?php if (!empty($cover)): ?>
                <img src="./admin/files/destinations/<?php echo htmlspecialchars($cover); ?>" alt="<?php echo htmlspecialchars($destinationName); ?>" class="w-full h-full object-cover md:rounded-br-[150px]">
                <?php endif; ?>
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 md:rounded-br-[150px]"></div>
            </div>

            <!-- Hero Content -->
            <div class="relative z-10 container mx-auto px-4 text-center pb-12" data-aos="fade-up" data-aos-delay="150">
                <h1 class="text-4xl md:text-5xl font-bold text-white font-[Quicksand] leading-tight drop-shadow-md" data-aos="fade-up" data-aos-delay="200">
                    <?php echo htmlspecialchars($destinationName); ?>
                </h1>
                <?php if (!empty($description)): ?>
                <p class="text-white/90 text-sm md:text-base mt-2 font-dm-sans max-w-xl mx-auto drop-shadow-sm"><?php echo htmlspecialchars(strip_tags(html_entity_decode($description))); ?></p>
                <?php endif; ?>
            </div>
            <!-- Navigation Tabs -->
            <div class="absolute bottom-0 left-0 w-full" data-aos="fade-up" data-aos-delay="250">

                <div class="w-full max-w-md mx-auto px-2 sm:px-0">
                    <div class="flex justify-between sm:justify-center bg-white rounded-t-2xl overflow-x-auto no-scrollbar">
                        <!-- Tab - Packages -->
                        <div class="relative flex-1 sm:flex-none text-center">
                            <a href="./package.php?slug=<?php echo urlencode($slug); ?>&type=package" id="tab-packages" class="px-4 sm:px-8 py-3 sm:py-4 <?php echo ($activeTab == 'packages') ? 'text-gray-900' : 'text-gray-400 hover:text-gray-700'; ?> font-semibold text-[15px] sm:text-lg transition-colors block whitespace-nowrap">
                                Packages
                            </a>
                            <div id="indicator-packages" class="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 h-1 bg-red-600 rounded-full <?php echo ($activeTab == 'packages') ? '' : 'hidden'; ?>"></div>
                        </div>

                        <!-- Tab - Tickets -->
                        <div class="relative flex-1 sm:flex-none text-center">
                            <a href="./package.php?slug=<?php echo urlencode($slug); ?>&type=ticket" id="tab-tickets" class="px-4 sm:px-8 py-3 sm:py-4 <?php echo ($activeTab == 'tickets') ? 'text-gray-900' : 'text-gray-400 hover:text-gray-700'; ?> font-semibold text-[15px] sm:text-lg transition-colors block whitespace-nowrap">
                                Tickets
                            </a>
                            <div id="indicator-tickets" class="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 h-1 bg-red-600 rounded-full <?php echo ($activeTab == 'tickets') ? '' : 'hidden'; ?>"></div>
                        </div>

                        <!-- Tab - Activity -->
                        <div class="relative flex-1 sm:flex-none text-center">
                            <a href="./package.php?slug=<?php echo urlencode($slug); ?>&type=activities" id="tab-activity" class="px-4 sm:px-8 py-3 sm:py-4 <?php echo ($activeTab == 'activity') ? 'text-gray-900' : 'text-gray-400 hover:text-gray-700'; ?> font-semibold text-[15px] sm:text-lg transition-colors block whitespace-nowrap">
                                Attractions
                            </a>
                            <div id="indicator-activity" class="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 h-1 bg-red-600 rounded-full <?php echo ($activeTab == 'activity') ? '' : 'hidden'; ?>"></div>
                        </div>
                    </div>
                </div>
            </div>

        </section>




        <!-- Travel Package Cards -->
        <section id="section-packages" class="py-16 bg-white <?php echo ($activeTab == 'packages') ? '' : 'hidden'; ?>" data-aos="fade-up">
            <div class="container mx-auto px-4">
                <div class="mb-8 text-center" data-aos="fade-up" data-aos-delay="100">
                    <h2 class="text-3xl font-bold text-gray-800 mb-2" data-aos="fade-up" data-aos-delay="150">Popular <?php echo ucfirst($type ? $type : 'Package'); ?> In <span class="text-red-600"><?php echo $destinationName; ?></span></h2>
                    <p class="text-gray-600" data-aos="fade-up" data-aos-delay="200"><?php echo $description; ?></p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <?php
                    if (isset($data) && is_array($data) && count($data) > 0) {
                        $pkgDelay = 0;
                        foreach ($data as $item) {
                            $imagePath = "./admin/files/{$imageDirectory}/{$item->image}";
                            $detailUrl = "./{$innerPagePath}?slug=" . urlencode($item->slug_url);
                            $title = isset($item->title) ? $item->title : 'Untitled';
                            $amount = isset($item->amount) ? $item->amount : '0';
                            $duration = isset($item->duration) ? $item->duration : '';
                    ?>
                            <a href="<?php echo $detailUrl; ?>" class="rounded-2xl cursor-pointer group" data-aos="zoom-in" data-aos-delay="<?php echo $pkgDelay; ?>">
                                <div class="relative overflow-hidden rounded-3xl transition-all duration-300">
                                    <img src="<?php echo $imagePath; ?>" alt="<?php echo $title; ?>" class="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500">
                                    <?php if ($duration): ?>
                                        <div class="flex items-center justify-center gap-2 absolute top-4 right-4 bg-yellow-300 text-black px-3 py-1 rounded-full text-sm font-semibold">
                                            <i class="fi fi-rr-night-day flex justify-center items-center"></i>
                                            <span><?php echo $duration; ?></span>
                                        </div>
                                    <?php endif; ?>
                                </div>
                                <div class="mt-4">
                                    <div class="text-gray-800 text-xl font-bold">₹ <?php echo number_format($amount); ?></div>
                                    <h3 class="text-gray-700 text-lg font-semibold font-dm-sans"><?php echo $title; ?></h3>
                                </div>
                            </a>
                    <?php
                            $pkgDelay += 120;
                        }
                    } else {
                        echo '<div class="col-span-full text-center py-12" data-aos="fade-up"><p class="text-gray-500">No packages available for this destination.</p></div>';
                    }
                    ?>
                </div>
            </div>
        </section>

        <!-- Tickets Tab Section -->
        <section id="section-tickets" class="py-16 bg-gray-50 <?php echo ($activeTab == 'tickets') ? '' : 'hidden'; ?>" data-aos="fade-up">
            <div class="container mx-auto px-4">
                <div class="mb-8 text-center" data-aos="fade-up" data-aos-delay="100">
                    <h2 class="text-3xl font-bold text-gray-800 mb-2" data-aos="fade-up" data-aos-delay="150">Popular Tickets In <span class="text-red-600"><?php echo $destinationName; ?></span></h2>
                    <p class="text-gray-600" data-aos="fade-up" data-aos-delay="200"><?php echo $description; ?></p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <?php
                    if (isset($data) && is_array($data) && count($data) > 0) {
                        $ticketDelay = 0;
                        foreach ($data as $item) {
                            $imagePath = "./admin/files/{$imageDirectory}/{$item->image}";
                            $detailUrl = "./{$innerPagePath}?slug=" . urlencode($item->slug_url);
                            $title = isset($item->title) ? $item->title : 'Untitled';
                            $amount = isset($item->amount) ? $item->amount : '0';
                    ?>
                            <a href="<?php echo $detailUrl; ?>" class="rounded-3xl cursor-pointer group" data-aos="zoom-in" data-aos-delay="<?php echo $ticketDelay; ?>">
                                <div class="relative overflow-hidden rounded-3xl">
                                    <img src="<?php echo $imagePath; ?>" alt="<?php echo $title; ?>" class="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500">
                                </div>
                                <div class="mt-3">
                                    <div class="flex items-center text-sm mb-1 font-[Quicksand] text-red-500">
                                        <i class="fi fi-rr-marker mr-1.5"></i>
                                        <span><?php echo $destinationName; ?></span>
                                    </div>
                                    <h3 class="text-lg font-bold font-dm-sans text-gray-800 leading-tight"><?php echo $title; ?></h3>
                                    <div class="text-base font-semibold font-dm-sans text-gray-800 mt-1">₹ <?php echo number_format($amount); ?></div>
                                </div>
                            </a>
                    <?php
                            $ticketDelay += 120;
                        }
                    } else {
                        echo '<div class="col-span-full text-center py-12" data-aos="fade-up"><p class="text-gray-500">No tickets available for this destination.</p></div>';
                    }
                    ?>
                </div>
            </div>
        </section>

        <!-- Activity Tab Section -->
        <section id="section-activity" class="py-16 bg-gray-50 <?php echo ($activeTab == 'activity') ? '' : 'hidden'; ?>" data-aos="fade-up">
            <div class="container mx-auto px-4">
                <div class="mb-8 text-center" data-aos="fade-up" data-aos-delay="100">
                    <h2 class="text-3xl font-bold text-gray-800 mb-2" data-aos="fade-up" data-aos-delay="150">Popular Activities In <span class="text-red-600"><?php echo $destinationName; ?></span></h2>
                    <p class="text-gray-600" data-aos="fade-up" data-aos-delay="200"><?php echo $description; ?></p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <?php
                    if (isset($data) && is_array($data) && count($data) > 0) {
                        $activityDelay = 0;
                        foreach ($data as $item) {
                            $imagePath = "./admin/files/{$imageDirectory}/{$item->image}";
                            $detailUrl = "./{$innerPagePath}?slug=" . urlencode($item->slug_url);
                            $title = isset($item->title) ? $item->title : 'Untitled';
                    ?>
                            <a href="<?php echo $detailUrl; ?>" class="rounded-3xl cursor-pointer group" data-aos="zoom-in" data-aos-delay="<?php echo $activityDelay; ?>">
                                <div class="relative overflow-hidden rounded-3xl">
                                    <img src="<?php echo $imagePath; ?>" alt="<?php echo $title; ?>" class="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500">
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                                    <div class="absolute bottom-0 left-0 right-0 p-4">
                                        <div class="flex items-center mb-2">
                                            <i class="fi fi-rr-ferris-wheel text-white text-sm mr-2 flex items-center justify-center"></i>
                                            <span class="text-white text-base font-[Quicksand]"><?php echo $destinationName; ?></span>
                                        </div>
                                        <h3 class="text-white text-xl font-semibold font-dm-sans line-clamp-2"><?php echo $title; ?></h3>
                                    </div>
                                </div>
                            </a>
                    <?php
                            $activityDelay += 120;
                        }
                    } else {
                        echo '<div class="col-span-full text-center py-12" data-aos="fade-up"><p class="text-gray-500">No activities available for this destination.</p></div>';
                    }
                    ?>
                </div>
            </div>
        </section>


    </main>

    <!-- Footer -->
    <?php include './components/footer.php'; ?>
    <?php include './components/Customize.php'; ?>
    <?php include './script.php'; ?>
    <?php 
    include './components/MobileNav.php';
    responsiveMenu('package'); // Set 'package' as active page
    ?>
</body>

</html>
