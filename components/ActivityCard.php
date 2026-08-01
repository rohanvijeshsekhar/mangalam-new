<?php
function activityCard($prop)
{
    extract($prop);
?>
    <a href="./activity-details.php?slug=<?php echo urlencode($slug_url); ?>" class="activity-card">
        <div class="thumbnail">
            <div class="cta">
                <svg class="bottom-right" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 20C5.52381 17.1048 1.30159 6.12698 1 1V20H20Z" fill="white" stroke="white" stroke-width="1.72727" />
                </svg>
                <svg class="top-left" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 20C5.52381 17.1048 1.30159 6.12698 1 1V20H20Z" fill="white" stroke="white" stroke-width="1.72727" />
                </svg>
                <img src="./assets/images/icons/activity-icon.png" alt="">
            </div>
            <img src="./admin/files/activities/<?php echo $image; ?>" alt="" class="thumbnail-img">
        </div>
        <div class="content">
            <span class="desti"><?php echo $destination; ?></span>
            <h3 class="line-clamp-2"><?php echo $title; ?></h3>
            <div class="rating">
                <!--<img src="./assets/images/icons/rating.png" alt=""> <span class="count"></span>-->
            </div>
            <div class="amount">
               

            </div>
        </div>
    </a>
<?php
}
?>