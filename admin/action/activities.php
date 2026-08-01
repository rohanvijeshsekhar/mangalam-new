<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
$obj       = new Query();
$dataArray = [];

$fetchActivity = $obj->selectData("activity_id,title,created", "activities", "where status != 0 order by activity_id desc");
if (mysqli_num_rows($fetchActivity) > 0) {
    $m = 0;
    while ($data_row = mysqli_fetch_array($fetchActivity)) {
        $dataArray[$m]['activity_id']   = $data_row['activity_id'];
        $dataArray[$m]['title'] = $data_row['title'];
        $dataArray[$m]['createdDate'] = date('d-M-y', strtotime($data_row['created']));
        $dataArray[$m]['createdTime'] = date('h:i a', strtotime($data_row['created']));
        $m++;
    }
}
echo json_encode($dataArray);
