<?php
require_once __DIR__ . '/requireAdminAuth.php';
/* -------------------------------------------------------------------------- */
/*                               add collection                               */
/* -------------------------------------------------------------------------- */
require_once '../../_class/query.php';
$obj     = new Query();
$respose = [];
header('Content-Type: application/json; charset=utf-8');
$data = json_decode(file_get_contents('php://input'), true);

$destinationArray = $data['destinations'];
$collectionName   = $data['collectionName'];

/* ---------------------------- insert collection --------------------------- */
$infoCollection   = ['collection_name' => $collectionName];
$insertCollection = $obj->insertData("collections", $infoCollection);
if ($insertCollection) {
    /* --------------------------- fetch collection id -------------------------- */
    $fetchCollectionId = $obj->selectData("collection_id", "collections", "where status != 0 order by collection_id desc limit 1");
    $collectionIdRow = mysqli_fetch_array($fetchCollectionId);
    $collectionId = $collectionIdRow['collection_id'];
    /* --------------------- insert collection destinations -------------------- */
    for ($i = 0; $i < sizeof($destinationArray); $i++) {
        $infoDestinations  = ['destination_id' => $destinationArray[$i],'collection_id' => $collectionId];
        $insertDestination = $obj->insertData("collection_destinations", $infoDestinations);
    }
    $respose[0]['status'] = 1;
    $respose[0]['msg']    = "collection added successfully";
} else {
    $respose[0]['status'] = 0;
    $respose[0]['msg']    = "Technical issue contact developers";
}
echo json_encode($respose);
