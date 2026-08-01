<?php
require_once __DIR__ . '/requireAdminAuth.php';
/* -------------------------------------------------------------------------- */
/*                               edit collection                               */
/* -------------------------------------------------------------------------- */
require_once '../../_class/query.php';
$obj     = new Query();
$respose = [];
header('Content-Type: application/json; charset=utf-8');
$data = json_decode(file_get_contents('php://input'), true);

$destinationArray = $data['destinations'];
$collectionName   = $data['collectionName'];
$collectionId     = $data['collection_id'];

/* ---------------------------- insert collection --------------------------- */
$infoCollection   = ['collection_name' => $collectionName];
$insertCollection = $obj->updateData("collections", $infoCollection, "WHERE collection_id = $collectionId");
if ($insertCollection) {
    /* ------------------------ deleting old destinations ----------------------- */
    $infoDeleteDestinations = ['status' => 0];
    $deleteDestinations = $obj->updateData("collection_destinations", $infoDeleteDestinations, "WHERE collection_id = $collectionId");
    /* --------------------- insert collection destinations -------------------- */
    for ($i = 0; $i < sizeof($destinationArray); $i++) {
        $infoDestinations  = ['destination_id' => $destinationArray[$i], 'collection_id' => $collectionId];
        $insertDestination = $obj->insertData("collection_destinations", $infoDestinations);
    }
    $respose[0]['status'] = 1;
    $respose[0]['msg']    = "collection updated successfully";
} else {
    $respose[0]['status'] = 0;
    $respose[0]['msg']    = "Technical issue contact developers";
}
echo json_encode($respose);
