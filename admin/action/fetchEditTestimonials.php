<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
$obj       = new Query();
$dataArray = [];
$id        = intval($_GET['id'] ?? 0);

$fetchData = $obj->selectData("name,description,role,image", "testimonials", "where id = $id and status != 0");
if (mysqli_num_rows($fetchData) > 0) {
    $data_row                    = mysqli_fetch_array($fetchData);
    $dataArray[0]['name']        = $data_row['name'];
    $dataArray[0]['description'] = $data_row['description'];
    $dataArray[0]['role']        = $data_row['role'];
    $dataArray[0]['image']       = $data_row['image'] ?? '';
}
echo json_encode($dataArray);
