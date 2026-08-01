<?php
require_once '../_class/query.php';
$obj       = new Query();
$dataArray = [];

$fetchDestinations = $obj->selectData("destination_id,destination_name,slug_url,created,card_image", "destinations", "where status != 0 ORDER BY
        CASE WHEN destination_name = 'Dubai' THEN 0 ELSE 1 END,
        featured DESC,
        destination_id DESC");
if (mysqli_num_rows($fetchDestinations) > 0) {
    $m = 0;
    while ($data_row = mysqli_fetch_array($fetchDestinations)) {
        $dataArray[$m]['destination_id']   = $data_row['destination_id'];
        $dataArray[$m]['destination_name'] = $data_row['destination_name'];
        $dataArray[$m]['slug']             = $data_row['slug_url'];
        $dataArray[$m]['image']            = $data_row['card_image'];
        $dataArray[$m]['createdDate']      = date('d-M-y', strtotime($data_row['created']));
        $dataArray[$m]['createdTime']      = date('h:i a', strtotime($data_row['created']));
        $m++;
    }
}
echo json_encode($dataArray);
