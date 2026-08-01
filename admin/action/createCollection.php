<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
$obj     = new Query();
$respose = [];
header('Content-Type: application/json; charset=utf-8');
$data = json_decode(file_get_contents('php://input'), true);

/* --------------------------- creating collection -------------------------- */
$infoCollection = [
    'collection_name' => $data['collection_name'],
];
$createCollection = $obj->insertData("collections", $infoCollection);
if ($createCollection) {
    /* --------------------------- fetch collection id -------------------------- */
    $fetchCollectionId = $obj->selectData("collection_id", "collections", "where status != 0 order by collection_id desc");
    if (mysqli_num_rows($fetchCollection) > 0) {
        $collectionIdRow = mysqli_fetch_array($fetchCollectionId);
        $collectionId    = $collectionIdRow['collection_id'];
        /* ----------------------- insert collection products ----------------------- */

        for ($i = 0; $i < sizeof($data['products']); $i++) {
            $infoCollectionProducts = [
                'collection_id' => $collectionId,
                'product_id'    => $data['products'][$i],
            ];
            $addCollectionProduct = $obj->insertData("collection_products", $infoCollectionProducts);
        }
        $respose[0]['status'] = 1;
        $respose[0]['msg'] = 'Collection created succssfully';
    }
} else {
    $respose[0]['status'] = 0;
    $respose[0]['msg'] = "Technical issue Contact Developers";
}
echo json_encode($respose);