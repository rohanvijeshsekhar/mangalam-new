<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
$obj       = new Query();
$dataArray = [];

$fetchPlaces = $obj->selectData("place_id,place_name,created", "places", "where status != 0 order by place_id desc");
if (mysqli_num_rows($fetchPlaces) > 0) {
    $m = 0;
    while ($data_row = mysqli_fetch_array($fetchPlaces)) {
        $dataArray[$m]['place_id']   = $data_row['place_id'];
        $dataArray[$m]['place_name'] = $data_row['place_name'];
        $dataArray[$m]['createdDate']      = date('d-M-y', strtotime($data_row['created']));
        $dataArray[$m]['createdTime']      = date('h:i a', strtotime($data_row['created']));
        $m++;
    }
}
echo json_encode($dataArray);
