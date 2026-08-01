<?php
require_once __DIR__ . '/../_class/query.php';
$obj       = new Query();
$dataArray = [];

/* ------------------------- fetch random activities ------------------------ */
$sqlRandomActivity = $obj->selectData("activity_id,destination_id,title,slug_url,card_image,validity", "activities", "where status != 0 and featured = 1");
if (mysqli_num_rows($sqlRandomActivity) > 0) {
    $i = 0;
    while ($activityRow = mysqli_fetch_array($sqlRandomActivity)) {
        $activity_id    = $activityRow['activity_id'];
        $destination_id = $activityRow['destination_id'];
        /* ------------------------- fetch destination name ------------------------- */
        $sqlDestinationName = $obj->selectData("destination_name", "destinations", "where destination_id = $destination_id and status != 0");
        $destinationNameRow = mysqli_fetch_array($sqlDestinationName);

        $dataArray[$i]['title']       = $activityRow['title'];
        $dataArray[$i]['destination'] = $destinationNameRow['destination_name'];
        $dataArray[$i]['image']       = $activityRow['card_image'];
        $dataArray[$i]['validity']       = $activityRow['validity'];
        $dataArray[$i]['slug_url']    = $activityRow['slug_url'];
        $i++;
    }
}
return json_encode($dataArray);
