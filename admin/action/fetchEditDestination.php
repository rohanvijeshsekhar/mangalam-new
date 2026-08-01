<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
$obj       = new Query();
$dataArray = [];
$id        = intval($_GET['id'] ?? 0);

$fetchData = $obj->selectData(
    "destination_name,discription,featured,meta,card_image,Inner_image,icon",
    "destinations",
    "where destination_id = $id and status != 0"
);
if (mysqli_num_rows($fetchData) > 0) {
    $data_row                         = mysqli_fetch_array($fetchData);
    $dataArray[0]['destination_name'] = $data_row['destination_name'];
    $dataArray[0]['discription']      = $data_row['discription'];
    $dataArray[0]['featured']         = $data_row['featured'];
    $dataArray[0]['meta']             = $data_row['meta'];
    $dataArray[0]['card_image']       = $data_row['card_image'] ?? '';
    $dataArray[0]['Inner_image']      = $data_row['Inner_image'] ?? '';
    $dataArray[0]['icon']             = $data_row['icon'] ?? '';
}
echo json_encode($dataArray);
