<?php
require_once __DIR__ . '/../_class/query.php';
$obj       = new Query();
$dataArray = [];
/* ----------------------- fetch all featured Activities ----------------------- */
$fetchFeaturedActivities = $obj->selectData("activity_id,title", "activities", "where featured = 1 and status != 0");
if (mysqli_num_rows($fetchFeaturedActivities) > 0) {
    $i = 0;
    while ($activityRow = mysqli_fetch_array($fetchFeaturedActivities)) {
        $activity_id = $activityRow['activity_id'];
        /* --------------------------- fetch activity images -------------------------- */
        $fetchActivityImages = $obj->selectData("image_names", "activity_images", "where activity_id = $activity_id");
        if (mysqli_num_rows($fetchActivityImages) > 0) {
            $m = 0;
            while ($imageRow = mysqli_fetch_array($fetchActivityImages)) {
                $dataArray[$i]['images'][$m]['image_name'] = $imageRow['image_names'];
                $m++;
            }
        }
        $dataArray[$i]['title'] = $activityRow['title'];
        $dataArray[$i]['id']    = $activityRow['activity_id'];
        $i++;
    }
}
echo json_encode($dataArray);
