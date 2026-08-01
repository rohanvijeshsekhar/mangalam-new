<?php
require_once '../_class/query.php';
$obj       = new Query();
$dataArray = [];

$fetchDestinations = $obj->selectData("destination_id,destination_name,created", "destinations", "where status != 0 order by destination_id desc");
if (mysqli_num_rows($fetchDestinations) > 0) {
    $m = 0;
    while ($data_row = mysqli_fetch_array($fetchDestinations)) {
        $dataArray[$m]['destination_id']   = $data_row['destination_id'];
        $dataArray[$m]['destination_name'] = $data_row['destination_name'];
        $dataArray[$m]['createdDate'] = date('d-M-y',strtotime($data_row['created']));
        $dataArray[$m]['createdTime'] = date('h:i a',strtotime($data_row['created']));
        $m++;
    }
}
echo json_encode($dataArray);
