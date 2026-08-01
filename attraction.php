<!DOCTYPE html>
<html lang="en">
<?php 
// Meta tags for Activities Page
$pageTitle = 'Activities - Mangalam Travel & Tours | Exciting Travel Activities & Experiences';
$pageDescription = 'Discover exciting activities and experiences with Mangalam Travel & Tours. Book adventure tours, water sports, cultural experiences, and more for your perfect vacation.';
$pageKeywords = 'travel activities, adventure tours, water sports, cultural experiences, vacation activities, travel experiences, Mangalam Tours activities';
$pageImage = './assets/images/activity-banner.webp';
$pageUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

include './head.php'; 
include './action/allActivities.php';

// Fetch activities data
$activitiesJson = allActivities();
$activities = json_decode($activitiesJson, true);
?>
<body class="font-dm-sans bg-white">
    <!-- Header -->
    <?php include './components/header.php'; ?>

    <main>
        <!-- Hero Section -->
        <section class="relative h-[50vh] overflow-hidden">
            <!-- Background Image -->
            <div class="absolute inset-0">
                <!-- desktop image -->
                <img src="./assets/images/activity-banner.webp" alt="Airplane wing view" class="hidden lg:block w-full h-full object-cover rounded-br-[150px]">
                <!-- mobile image -->
                <img src="./assets/images/res-activity-banner.webp" alt="Airplane wing view" class="lg:hidden w-full h-full object-cover rounded-br-[150px]">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-br-[150px]"></div>
            </div>
            
            <!-- Hero Content -->
            <div class="relative z-10 h-full flex items-end">
                <div class="container mx-auto px-4 pb-8">
                    <h1 class="text-3xl md:text-5xl font-bold text-white font-[Quicksand] leading-tight">
                    Activities for Every Traveler
                    </h1>
                </div>
            </div>
            
   
        </section>

        <!-- Activities Section -->
        <section class="py-16 bg-white" data-aos="fade-up">
            <div class="container mx-auto px-4">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <?php
                    if (!empty($activities)) {
                        $activityDelay = 0;
                        foreach ($activities as $activity) {
                            $imagePath = "./admin/files/activities/{$activity['image']}";
                            $detailUrl = "./activity-details.php?slug=" . urlencode($activity['slug_url']);
                            $title = isset($activity['title']) ? $activity['title'] : 'Untitled';
                            $destination = isset($activity['destination']) ? $activity['destination'] : 'Unknown';
                    ?>
                    <a href="<?php echo $detailUrl; ?>" class="rounded-3xl cursor-pointer group" data-aos="zoom-in" data-aos-delay="<?php echo $activityDelay; ?>">
                        <div class="relative overflow-hidden rounded-3xl">
                            <img src="<?php echo $imagePath; ?>" alt="<?php echo htmlspecialchars($title); ?>" class="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                            <div class="absolute bottom-0 left-0 right-0 p-4">
                                <div class="flex items-center mb-2">
                                    <i class="fi fi-rr-ferris-wheel text-white text-sm mr-2 flex items-center justify-center"></i>
                                    <span class="text-white text-base font-[Quicksand]"><?php echo htmlspecialchars($destination); ?></span>
                                </div>
                                <h3 class="text-white text-xl font-semibold font-dm-sans line-clamp-2"><?php echo htmlspecialchars($title); ?></h3>
                            </div>
                        </div>
                    </a>
                    <?php
                            $activityDelay += 120;
                        }
                    } else {
                        echo '<div class="col-span-full text-center py-12" data-aos="fade-up"><p class="text-gray-500">No activities available at the moment.</p></div>';
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
    responsiveMenu('activity'); // Set 'activity' as active page
    ?>

  <?php include './script.php'; ?>

</body>
</html>
