<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
header('Content-Type: application/json; charset=utf-8');

$obj       = new Query();
$dataArray = [];
$id        = (int) ($_GET['id'] ?? 0);

$fetchBlog = $obj->selectData(
    "id,name,email,phone,destination_id",
    "enquiry_blog",
    "WHERE id = $id AND status != 0"
);

if ($fetchBlog && mysqli_num_rows($fetchBlog) > 0) {
    $data_row = mysqli_fetch_array($fetchBlog);
    $destinationId = (int) ($data_row['destination_id'] ?? 0);
    $destinationName = 'Other Location';
    if ($destinationId > 0) {
        $destRes = $obj->selectData("destination_name", "destinations", "WHERE destination_id = $destinationId");
        $destRow = $destRes ? mysqli_fetch_array($destRes) : null;
        if (is_array($destRow) && !empty($destRow['destination_name'])) {
            $destinationName = $destRow['destination_name'];
        }
    }

    $dataArray[0] = [
        'id'               => $data_row['id'],
        'name'             => $data_row['name'],
        'email'            => $data_row['email'],
        'phone'            => $data_row['phone'],
        'destination_name' => $destinationName,
    ];
}

echo json_encode($dataArray);
