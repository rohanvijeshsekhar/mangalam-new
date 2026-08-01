<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
$obj       = new Query();
$dataArray = [];
/* -------------------------------------------------------------------------- */
/*                            fetch all collections                           */
/* -------------------------------------------------------------------------- */
$fetchCollection = $obj->selectData("collection_id,collection_name,created", "collections", "where status != 0 order by collection_id desc");
if (mysqli_num_rows($fetchCollection) > 0) {
    $m = 0;
    while ($data_row = mysqli_fetch_array($fetchCollection)) {
        $collectionId                     = $data_row['collection_id'];
        $fetchCollectionDestinationCount  = $obj->selectData("count(id) as productCount", "collection_destinations", "where collection_id = $collectionId and status != 0");
        $countRow                         = mysqli_fetch_array($fetchCollectionDestinationCount);
        $count                            = $countRow['productCount'];
        $dataArray[$m]['collection_id']   = $collectionId;
        $dataArray[$m]['collection_name'] = $data_row['collection_name'];
        $dataArray[$m]['count']           = $count;
        $dataArray[$m]['createdDate']     = date('d-M-y', strtotime($data_row['created']));
        $dataArray[$m]['createdTime']     = date('h:i a', strtotime($data_row['created']));
        $m++;
    }
}
echo json_encode($dataArray);
