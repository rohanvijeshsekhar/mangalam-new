<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
$obj       = new Query();
$dataArray = [];
$id        = $_GET['id'];

$fetchData = $obj->selectData("collection_name", "collections", "WHERE collection_id = $id AND status != 0");
if (mysqli_num_rows($fetchData) > 0) {
    $data_row                    = mysqli_fetch_array($fetchData);
    $fetchCollectionDestinations = $obj->selectData("destination_id", "collection_destinations", "WHERE collection_id = $id AND status != 0");
    if (mysqli_num_rows($fetchCollectionDestinations) > 0) {
        $i = 0;
        while ($destinationRow = mysqli_fetch_array($fetchCollectionDestinations)) {
            $dataArray[0]['destinations'][$i] = $destinationRow['destination_id'];
            $i++;
        }
    }
    $dataArray[0]['collection_name'] = $data_row['collection_name'];
}
echo json_encode($dataArray);
