<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
$obj       = new Query();
$dataArray = [];

$fetchPlaces = $obj->selectData("id,destination_id,image", "destination_marketing_images", "where status != 0 order by id desc");
if (mysqli_num_rows($fetchPlaces) > 0) {
    while ($data_row = mysqli_fetch_array($fetchPlaces)) {
        $destinationId = (int) ($data_row['destination_id'] ?? 0);
        $destination_name = 'Unknown';
        if ($destinationId > 0) {
            $fetch_destination_name = $obj->selectData("destination_name", "destinations", "where destination_id = $destinationId");
            if ($fetch_destination_name && mysqli_num_rows($fetch_destination_name) > 0) {
                $destination_name_row = mysqli_fetch_assoc($fetch_destination_name);
                $destination_name = $destination_name_row['destination_name'] ?? 'Unknown';
            }
        }
        $dataArray[] = [
            'id' => $data_row['id'],
            'destination' => $destination_name,
            'image' => $data_row['image'],
        ];
    }
}
echo json_encode($dataArray);
