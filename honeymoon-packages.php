<!DOCTYPE html>
<html lang="en">
<?php 
// Meta tags for Honeymoon Packages Page
$pageTitle = 'Honeymoon Packages - Mangalam Travel & Tours';
$pageDescription = 'Plan your perfect romantic getaway with our exclusive honeymoon packages.';
$pageKeywords = 'honeymoon, romantic, couple tours';
$pageImage = './assets/images/honeymoon-package.webp'; 
$pageUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

include './head.php'; 
include './action/allDestinations.php';

$destinationsJson = allDestinations(''); 
$destinations = json_decode($destinationsJson, true);
?>
<body class="font-dm-sans bg-gray-50">
    <!-- Header -->
    <?php include './components/header.php'; ?>
    <main>
        <!-- Curved Hero Header -->
        <section class="h-[50vh] md:h-[60vh] relative bg-white">
            <!-- Shaped Background Container -->
            <div class="absolute inset-0 rounded-br-[80px] md:rounded-br-[180px] overflow-hidden z-0 shadow-sm">
                <img src="./assets/images/honeymoon-romantic.jpg" alt="Honeymoon Background" class="w-full h-full object-cover">
                <!-- Gradient Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            </div>

             <!-- Hero Content -->
            <div class="relative z-10 h-full flex items-end">
                <div class="container mx-auto px-4 pb-8">
                    <h1 class="text-3xl md:text-5xl font-bold text-white font-[Quicksand] leading-tight">
                        Honeymoon Packages
                    </h1>
                </div>
            </div>
        </section>

        <!-- Fresh Card Grid -->
        <section class="pb-24 pt-8 bg-white">
            <div class="container mx-auto px-4">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <?php
                    require_once './_class/query.php';
                    $obj = new Query();
                    $packages = $obj->selectData("*", "packages", "WHERE category = 'honeymoon_packages' AND status != 0");
                    
                    if ($packages->num_rows > 0) {
                        while ($row = $packages->fetch_assoc()) {
                            $imagePath = './admin/files/packages/' . $row['card_image'];
                            $title = $row['title'];
                            $duration = $row['duration'];
                            $amount = $row['amount'];
                            $slug = $row['slug_url'];
                    ?>
                    <a href="package-details.php?slug=<?= $slug ?>" class="group relative block h-[400px] w-full overflow-hidden rounded-[32px] shadow-sm hover:shadow-2xl transition-all duration-500">
                        <!-- Full Background Image -->
                        <img src="<?= $imagePath ?>" alt="<?= $title ?>" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                        
                        <!-- Overlay gradient for depth -->
                        <div class="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 pointer-events-none"></div>

                        <!-- Duration Badge (Top Right) -->
                        <div class="absolute top-5 right-5 z-20">
                            <span class="bg-white/90 backdrop-blur-md text-gray-800 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                                <i class="fi fi-rr-clock text-red-500"></i> <?= $duration ?>
                            </span>
                        </div>

                        <!-- Floating Info Card (Bottom) -->
                        <div class="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-xl rounded-[24px] p-5 shadow-lg transform transition-transform duration-500 group-hover:-translate-y-2">
                            <div class="mb-3">
                                <span class="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider mb-2 inline-block">Honeymoon Special</span>
                                <h3 class="text-xl font-bold text-gray-900 line-clamp-1 font-[Quicksand]"><?= $title ?></h3>
                            </div>
                            
                            <div class="flex items-end justify-between border-t border-gray-100 pt-3">
                                <div class="flex flex-col">
                                    <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Starting From</span>
                                    <span class="text-2xl font-bold text-gray-900 font-[Quicksand]">₹<?= number_format($amount) ?></span>
                                </div>
                                
                                <span class="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center group-hover:bg-red-600 transition-colors duration-300 shadow-md">
                                    <i class="fi fi-rr-arrow-right text-sm"></i>
                                </span>
                            </div>
                        </div>
                    </a>
                    <?php
                        }
                    } else {
                        echo '<div class="col-span-full text-center py-12">
                                <div class="inline-block p-4 rounded-full bg-pink-50 mb-4"><i class="fi fi-rr-heart-broken text-2xl text-pink-400"></i></div>
                                <h3 class="text-lg font-medium text-gray-900">No honeymoon packages found</h3>
                                <p class="text-gray-500">We are curating special romantic getaways. Please check back soon!</p>
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
