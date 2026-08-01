<!DOCTYPE html>
<html lang="en">
<?php 
// Meta tags for Tickets Page
$pageTitle = 'Tickets - Mangalam Travel & Tours | Book Travel Tickets & Attraction Passes';
$pageDescription = 'Book travel tickets and attraction passes with Mangalam Travel & Tours. Get the best deals on theme park tickets, sightseeing passes, and travel tickets.';
$pageKeywords = 'travel tickets, attraction tickets, theme park tickets, sightseeing passes, event tickets, ticket booking, Mangalam Tours tickets';
$pageImage = './assets/images/ticket-banner.webp';
$pageUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

include './head.php'; 
include './action/allTickets.php';

// Fetch tickets data
$ticketsJson = allTickets('', 0);
$tickets = json_decode($ticketsJson, true);
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
                <img src="./assets/images/tickets-banner.webp" alt="Airplane wing view" class="hidden lg:block w-full h-full object-cover rounded-br-[150px]">
                <!-- mobile image -->
                <img src="./assets/images/res-tickets-banner.webp" alt="Airplane wing view" class="lg:hidden w-full h-full object-cover rounded-br-[150px]">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-br-[150px]"></div>
            </div>
            
            <!-- Hero Content -->
            <div class="relative z-10 h-full flex items-end">
                <div class="container mx-auto px-4 pb-8">
                    <h1 class="text-3xl md:text-5xl font-bold text-white font-[Quicksand] leading-tight">
                    Tickets & Attractions
                    </h1>
                </div>
            </div>
            
   
        </section>

        <!-- Tickets Section -->
        <section class="py-16 bg-white" data-aos="fade-up">
            <div class="container mx-auto px-4">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <?php
                    if (!empty($tickets)) {
                        $ticketDelay = 0;
                        foreach ($tickets as $ticket) {
                            $imagePath = "./admin/files/tickets/{$ticket['image']}";
                            $detailUrl = "./tickets-details.php?slug=" . urlencode($ticket['slug_url']);
                            $title = isset($ticket['title']) ? $ticket['title'] : 'Untitled';
                            $destination = isset($ticket['destination']) ? $ticket['destination'] : 'Unknown';
                            $amount = isset($ticket['amount']) ? $ticket['amount'] : '0';
                    ?>
                    <a href="<?php echo $detailUrl; ?>" class="rounded-3xl cursor-pointer group" data-aos="zoom-in" data-aos-delay="<?php echo $ticketDelay; ?>">
                        <div class="relative overflow-hidden rounded-3xl">
                            <img src="<?php echo $imagePath; ?>" alt="<?php echo htmlspecialchars($title); ?>" class="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500">
                        </div>
                        <div class="mt-3">
                            <div class="flex items-center text-sm mb-1 font-[Quicksand] text-red-500">
                                <i class="fi fi-rr-marker mr-1.5"></i>
                                <span><?php echo htmlspecialchars($destination); ?></span>
                            </div>
                            <h3 class="text-lg font-bold font-dm-sans text-gray-800 leading-tight"><?php echo htmlspecialchars($title); ?></h3>
                            <div class="text-base font-semibold font-dm-sans text-gray-800 mt-1">₹ <?php echo number_format($amount); ?></div>
                        </div>
                    </a>
                    <?php
                            $ticketDelay += 120;
                        }
                    } else {
                        echo '<div class="col-span-full text-center py-12" data-aos="fade-up"><p class="text-gray-500">No tickets available at the moment.</p></div>';
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
    responsiveMenu('ticket'); // Set 'ticket' as active page
    ?>

  <?php include './script.php'; ?>

</body>
</html>
