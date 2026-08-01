<?php
function destinationCard($prop)
{
    extract($prop);
?>
    <a href="./package.php?slug=<?php echo urlencode($prop['slug']); ?>&type=package" class="destination-card">
        <div class="thumbnail">
            <div class="cta">
                <svg class="bottom-right" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 20C5.52381 17.1048 1.30159 6.12698 1 1V20H20Z" fill="white" stroke="white" stroke-width="1.72727" />
                </svg>
                <svg class="top-left" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 20C5.52381 17.1048 1.30159 6.12698 1 1V20H20Z" fill="white" stroke="white" stroke-width="1.72727" />
                </svg>
                <img src="./assets/images/icons/cta-round.png" alt="">
            </div>
            <?php
            if ($featured == 1) {
            ?>
                <div class="Trending">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M14.1081 2.4402C14.4408 2.52854 14.7195 2.75548 14.8734 3.06334C15.4537 4.22389 15.8868 4.92826 16.3225 5.49935C16.7635 6.07743 17.23 6.55066 17.9397 7.26033C19.5796 8.9003 20.4 11.0521 20.4 13.2C20.4 15.3479 19.5796 17.4998 17.9397 19.1397C14.6593 22.4201 9.34068 22.4201 6.06028 19.1397C4.42031 17.4998 3.59998 15.3479 3.59998 13.2C3.59997 11.0521 4.42031 8.9003 6.06028 7.26033C6.40348 6.91713 6.91962 6.81446 7.36803 7.0002C7.81644 7.18594 8.10881 7.6235 8.10881 8.10886C8.10881 9.45263 8.19272 10.4765 8.58575 11.2932C8.80187 11.7423 9.139 12.1814 9.72003 12.5732C9.8588 11.3002 10.113 9.74937 10.4565 8.27732C10.7269 7.11834 11.0632 5.96127 11.4636 4.99639C11.6638 4.51377 11.8902 4.05424 12.1474 3.65748C12.3977 3.27128 12.7193 2.87829 13.1344 2.60154C13.4208 2.41061 13.7754 2.35186 14.1081 2.4402ZM14.5456 18.1456C13.1397 19.5515 10.8603 19.5515 9.45439 18.1456C8.75145 17.4426 8.39998 16.5213 8.39998 15.6C8.39998 15.6 9.45439 16.2 11.4 16.2C11.4 15 12 11.4 12.9 10.8C13.5 12 13.8426 12.3515 14.5456 13.0544C15.2485 13.7574 15.6 14.6787 15.6 15.6C15.6 16.5213 15.2485 17.4426 14.5456 18.1456Z" fill="#1E1E1E" />
                    </svg>Trending
                </div>
            <?php
            }
            ?>
            <img class="thumbnail-img" src="./admin/files/destinations/<?php echo $image; ?>" alt="">
            <div class="content">
                <!-- <svg class="top-left" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 20C5.52381 17.1048 1.30159 6.12698 1 1V20H20Z" fill="white" stroke="white" stroke-width="1.72727" />
                </svg> -->
                <svg class="bottom-right" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 20C5.52381 17.1048 1.30159 6.12698 1 1V20H20Z" fill="white" stroke="white" stroke-width="1.72727" />
                </svg>
                <h3><?php echo $name; ?></span></h3>
                <span>20 Packages, 4 Activity</span>
            </div>
        </div>
    </a>
<?php
}
?>