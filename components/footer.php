<?php
// Fetch dynamic data for footer
require_once __DIR__ . '/../_class/query.php';
$obj = new Query();

// Fetch top destinations (limit 18, ordered by featured)
$topDestinations = [];
$fetchDestinations = $obj->selectData("destination_id,destination_name,slug_url", "destinations", "WHERE status != 0 ORDER BY featured DESC, destination_id DESC LIMIT 18");
if ($fetchDestinations && safe_mysqli_num_rows($fetchDestinations) > 0) {
    while ($row = safe_mysqli_fetch_array($fetchDestinations)) {
        $topDestinations[] = [
            'name' => $row['destination_name'],
            'slug' => $row['slug_url']
        ];
    }
}

// Fetch top activities (limit 8, ordered by featured)
$topActivities = [];
$fetchActivities = $obj->selectData("activity_id,title,slug_url", "activities", "WHERE status != 0 ORDER BY featured DESC, activity_id DESC LIMIT 8");
if ($fetchActivities && safe_mysqli_num_rows($fetchActivities) > 0) {
    while ($row = safe_mysqli_fetch_array($fetchActivities)) {
        $topActivities[] = [
            'name' => $row['title'],
            'slug' => $row['slug_url']
        ];
    }
}

// Fetch top tickets (limit 8, ordered by featured)
$topTickets = [];
$fetchTickets = $obj->selectData("ticket_id,title,slug_url", "tickets", "WHERE status != 0 ORDER BY featured DESC, ticket_id DESC LIMIT 8");
if ($fetchTickets && safe_mysqli_num_rows($fetchTickets) > 0) {
    while ($row = safe_mysqli_fetch_array($fetchTickets)) {
        $topTickets[] = [
            'name' => $row['title'],
            'slug' => $row['slug_url']
        ];
    }
}
?>

<footer class="mb-20 lg:mb-0">
    <div class="bg-black text-white">
        <!-- Upper Destinations Section -->
        <section class="border-b border-gray-700 py-8">
            <div class="container mx-auto px-4">
                <!-- Top Destinations -->
                <div class="mb-8">
                    <h3 class="text-lg font-bold mb-4">Top Destinations</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <?php
                        if (!empty($topDestinations)) {
                            $colCount = max(1, (int) ceil(count($topDestinations) / 3));
                            $destinations = array_chunk($topDestinations, $colCount);

                            for ($col = 0; $col < 3; $col++) {
                                echo '<div class="space-y-2">';
                                if (isset($destinations[$col])) {
                                    foreach ($destinations[$col] as $destination) {
                                        $destName = htmlspecialchars($destination['name']);
                                        $destSlug = htmlspecialchars($destination['slug']);
                                        $destUrl = !empty($destSlug) ? "package.php?slug={$destSlug}&type=package" : "#";
                                        echo '<a href="' . $destUrl . '" class="block text-gray-300 hover:text-white transition-colors">' . $destName . ' Holiday Packages</a>';
                                    }
                                }
                                echo '</div>';
                            }
                        } else {
                            echo '<p class="text-gray-400 text-sm">No destinations available</p>';
                        }
                        ?>
                    </div>
                </div>

                <!-- Activities and Tickets -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- Top Activities -->
                    <div>
                        <h3 class="text-lg font-bold mb-4">Top Activities</h3>
                        <div class="space-y-2">
                            <?php
                            if (!empty($topActivities)) {
                                foreach ($topActivities as $activity) {
                                    $actName = htmlspecialchars($activity['name']);
                                    $actSlug = htmlspecialchars($activity['slug']);
                                    $actUrl = !empty($actSlug) ? "activity-details.php?slug={$actSlug}" : "#";
                                    echo '<a href="' . $actUrl . '" class="block text-gray-300 hover:text-white transition-colors">' . $actName . '</a>';
                                }
                            } else {
                                echo '<p class="text-gray-400 text-sm">No activities available</p>';
                            }
                            ?>
                        </div>
                    </div>

                    <!-- Top Tickets -->
                    <div>
                        <h3 class="text-lg font-bold mb-4">Top Tickets</h3>
                        <div class="space-y-2">
                            <?php
                            if (!empty($topTickets)) {
                                foreach ($topTickets as $ticket) {
                                    $tickName = htmlspecialchars($ticket['name']);
                                    $tickSlug = htmlspecialchars($ticket['slug']);
                                    $tickUrl = !empty($tickSlug) ? "tickets-details.php?slug={$tickSlug}" : "#";
                                    echo '<a href="' . $tickUrl . '" class="block text-gray-300 hover:text-white transition-colors">' . $tickName . '</a>';
                                }
                            } else {
                                echo '<p class="text-gray-400 text-sm">No tickets available</p>';
                            }
                            ?>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Main Footer Section -->
        <section class="py-12">
            <div class="container mx-auto px-4">
                <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8">
                    <!-- Logo and Copyright Column -->
                    <div class="md:col-span-1">
                        <!-- Logo Section -->
                        <div class="mb-6 w-[170px] flex flex-col gap-4">
                            <a href="index.php" class="block">
                                <img src="./assets/images/logo.png" alt="Mangalam Travel & Tours" class="w-full h-auto">
                            </a>
                            <a href="index.php" class="block">
                                <img src="./assets/images/emi-holiday.png" alt="Mangalam Travel & Tours" class="w-full h-auto">
                            </a>
                        </div>

                       
                    </div>

                    <!-- Quick Links Column -->
                    <div>
                        <h3 class="text-lg font-bold mb-4">Quick Links</h3>
                        <ul class="space-y-2">
                            <li><a href="index.php" class="text-gray-300 hover:text-white transition-colors">Home</a></li>
                            <li><a href="about.php" class="text-gray-300 hover:text-white transition-colors">About</a></li>
                            <li><a href="contact.php" class="text-gray-300 hover:text-white transition-colors">Contact</a></li>
                            <li><a href="career.php" class="text-gray-300 hover:text-white transition-colors">Career</a></li>
                            <li><a href="holiday-package.php" class="text-gray-300 hover:text-white transition-colors">Holiday Packages</a></li>
                            <li><a href="attraction.php" class="text-gray-300 hover:text-white transition-colors">Attractions</a></li>
                            <!-- <li><a href="tickets.php" class="text-gray-300 hover:text-white transition-colors">Tickets</a></li> -->

                       
                        </ul>
                    </div>

                    <!-- Services Column -->
                    <div>
                        <h3 class="text-lg font-bold mb-4">Services</h3>
                        <ul class="space-y-2">
                            <li><a href="flight-tickets.php" class="text-gray-300 hover:text-white transition-colors">Flight Tickets</a></li>
                            <li><a href="global-visa-services.php" class="text-gray-300 hover:text-white transition-colors">Visa Services</a></li>
                            <li><a href="travel-insurance.php" class="text-gray-300 hover:text-white transition-colors">Travel Insurance</a></li>
                            <li><a href="miscellaneous.php" class="text-gray-300 hover:text-white transition-colors">Miscellaneous Services</a></li>
                            <li><a href="mice-tourism.php" class="text-gray-300 hover:text-white transition-colors">MICE Tourism</a></li>
                            <li><a href="cruises.php" class="text-gray-300 hover:text-white transition-colors">Cruises</a></li>
                        </ul>
                    </div>
                    <!-- other links -->
                     <div>
                        <h3 class="text-lg font-bold mb-4">Other Links</h3>
                        <ul class="space-y-2">
                            <li><a href="privacy-policy.php" class="text-gray-300 hover:text-white transition-colors">Privacy & Policy</a></li>
                            <li><a href="terms-and-conditions.php" class="text-gray-300 hover:text-white transition-colors">Terms & Conditions</a></li>
                        </ul>
                     </div>
                    <!-- Contact Column -->
                    <div>
                        <h3 class="text-lg font-bold mb-4">Contact</h3>
                        <ul class="space-y-2">
                            <li class="text-gray-300">5 & 6, 1st Floor, Our Tower, Vellayambalam - Sasthamangalam Rd, P.O, Thiruvananthapuram, Kerala 695010</li>
                            <li><a href="mailto:enquiries@mangalamtravel.com" class="text-gray-300 hover:text-white transition-colors">enquiries@mangalamtravel.com</a></li>
                        </ul>
                    </div>

                    <!-- Top Destination Column -->
                    <div class="relative hidden">
                        <h3 class="text-lg font-bold mb-4">Top Destination</h3>
                        <ul class="space-y-2">
                            <?php
                            // Show top 5 destinations in the sidebar
                            $sidebarDestinations = array_slice($topDestinations, 0, 5);
                            if (!empty($sidebarDestinations)) {
                                foreach ($sidebarDestinations as $destination) {
                                    $destName = htmlspecialchars($destination['name']);
                                    $destSlug = htmlspecialchars($destination['slug']);
                                    $destUrl = !empty($destSlug) ? "package.php?slug={$destSlug}&type=package" : "#";
                                    echo '<li><a href="' . $destUrl . '" class="text-gray-300 hover:text-white transition-colors">' . $destName . '</a></li>';
                                }
                            } else {
                                echo '<li><a href="#" class="text-gray-300 hover:text-white transition-colors">No destinations available</a></li>';
                            }
                            ?>
                        </ul>

                        <!-- Paper Airplane Decoration -->
                        <div class="hidden absolute -top-2 right-0">
                            <svg width="40" height="40" viewBox="0 0 40 40" class="w-10 h-10">
                                <path d="M5,20 Q15,10 25,15 Q30,18 35,20" stroke="white" stroke-width="2" stroke-dasharray="3,3" fill="none" />
                                <path d="M30,15 L35,20 L30,25" stroke="white" stroke-width="2" fill="none" />
                            </svg>
                        </div>
                    </div>
                     <!-- Social Media Icons -->
                    <div class="">
                        <div class="flex  space-x-4">
                            <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                                <i class="fab fa-facebook-f text-white"></i>
                            </a>
                            <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                                <i class="fab fa-whatsapp text-white"></i>
                            </a>
                            <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                                <i class="fab fa-twitter text-white"></i>
                            </a>
                            <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                                <i class="fab fa-instagram text-white"></i>
                            </a>
                        </div>
                    </div>

                </div>

                <!-- Copyright -->
                <p class="text-sm text-gray-400 text-center mt-10">2026 mangalam travel & tours . All right reserved. powered by <a href="https://manziostudio.com/" target="_blank" class="text-gray-100">Manzio</a></p>
            </div>
        </section>
    </div>
</footer>