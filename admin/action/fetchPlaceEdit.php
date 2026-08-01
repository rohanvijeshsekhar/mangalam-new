<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
$obj       = new Query();
$dataArray = [];
$id        = intval($_GET['id'] ?? 0);

$fetchData = $obj->selectData("place_name,destination_id,meta,image", "places", "where place_id = $id and status != 0");
if (mysqli_num_rows($fetchData) > 0) {
    $data_row                       = mysqli_fetch_array($fetchData);
    $dataArray[0]['place_name']     = $data_row['place_name'];
    $dataArray[0]['destination_id'] = $data_row['destination_id'];
    $dataArray[0]['meta']           = $data_row['meta'];
    $dataArray[0]['image']          = $data_row['image'] ?? '';
}
echo json_encode($dataArray);
