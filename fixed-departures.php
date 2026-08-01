<!DOCTYPE html>
<html lang="en">
<?php 
// Meta tags for Fixed Departures Page
$pageTitle = 'Fixed Departures - Mangalam Travel & Tours | Group Tours';
$pageDescription = 'Join our fixed departure group tours to exciting destinations. Pre-planned itineraries, fixed dates, and great value packages.';
$pageKeywords = 'fixed departure tours, group tours, travel packages, loaded tours, Mangalam Tours';
$pageImage = './assets/images/fixed-departure.webp';
$pageUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

include './head.php'; 
?>
<body class="font-dm-sans bg-white">
    <!-- Header -->
    <?php include './components/header.php'; ?>
    <main>
        <!-- Hero Section -->
        <section class="relative h-[50vh] overflow-hidden ">
            <!-- Background Image -->
            <div class="absolute inset-0">
                <!-- reusing a nice destination image -->
                <img src="./assets/images/fixed-departure-place.jpg" alt="Fixed Departures Banner" class="w-full h-full object-cover rounded-br-[150px]">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-br-[150px]"></div>
            </div>
            
            <!-- Hero Content -->
            <div class="relative z-10 h-full flex items-end">
                <div class="container mx-auto px-4 pb-8">
                    <h1 class="text-3xl md:text-5xl font-bold text-white font-[Quicksand] leading-tight">
                        Fixed Departures
                    </h1>
                </div>
            </div>
        </section>

        <!-- Fixed Departures Grid -->
        <section class="py-24 bg-gray-50" data-aos="fade-up">
            <div class="container mx-auto px-4">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <?php
                    require_once './_class/query.php';
                    $obj = new Query();
                    $packages = $obj->selectData("*", "packages", "WHERE category = 'fixed_departures' AND status != 0");
                    
                    if ($packages->num_rows > 0) {
                        while ($row = $packages->fetch_assoc()) {
                            $imagePath = './admin/files/packages/' . $row['card_image'];
                            $title = $row['title'];
                            $duration = $row['duration'];
                            $amount = $row['amount'];
                            $slug = $row['slug_url'];
                    ?>
                    <a href="package-details.php?slug=<?= $slug ?>" class="group block bg-white rounded-[32px] p-3 shadow-xs hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-1 border border-gray-100">
                        <!-- Image Container -->
                        <div class="relative h-64 overflow-hidden rounded-[24px]">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                            <img src="<?= $imagePath ?>" alt="<?= $title ?>" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out">
                            


                            <!-- Duration Tag -->
                            <div class="absolute top-4 right-4 bg-black/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 z-20">
                                <i class="fi fi-rr-clock"></i> <?= $duration ?>
                            </div>
                        </div>

                        <!-- Content -->
                        <div class="px-2 pt-5 pb-2">
                            <h3 class="text-xl font-bold text-gray-900 transition-colors line-clamp-1 mb-3 font-[Quicksand] tracking-tight">
                                <?= $title ?>
                            </h3>

                            <!-- Dates Section -->
                            <?php if (!empty($row['fixed_departure_date'])): ?>
                            <div class="flex flex-wrap gap-2 mb-4">
                                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 text-xs font-bold border border-gray-100 group-hover:bg-red-50 group-hover:text-red-700 group-hover:border-red-100 transition-colors duration-300">
                                    <i class="fi fi-rr-calendar-clock"></i>
                                    <span><?= date('d M, Y', strtotime($row['fixed_departure_date'])) ?></span>
                                </div>
                            </div>
                            <?php endif; ?>
                            
                            <div class="mt-4 flex items-end justify-between">
                                <div>
                                    <p class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Starting From</p>
                                    <p class="text-2xl font-bold text-gray-900 font-[Quicksand]">₹<?= number_format($amount) ?></p>
                                </div>
                                
                                <span class="px-5 py-2.5 rounded-xl bg-gray-50 text-gray-900 text-xs font-bold uppercase tracking-wider group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                                    View Details
                                </span>
                            </div>
                        </div>
                    </a>
                    <?php
                        }
                    } else {
                        echo '<div class="col-span-full text-center py-12">
                                <div class="inline-block p-4 rounded-full bg-gray-100 mb-4"><i class="fi fi-rr-search-alt text-2xl text-gray-400"></i></div>
                                <h3 class="text-lg font-medium text-gray-900">No packages found</h3>
                                <p class="text-gray-500">We are currently updating our fixed departure packages. Please check back soon!</p>
                              </div>';
                    }
                    ?>
                </div>
            </div>
        </section>

    </main>
    
    <?php include './components/footer.php'; ?>
    <?php include './components/Customize.php'; ?>
    <?php include './components/FixedCustomizeButton.php'; ?>
    <?php 
    include './components/MobileNav.php';
    responsiveMenu('destination'); 
    ?>

  <?php include './script.php'; ?>

</body>
</html>
