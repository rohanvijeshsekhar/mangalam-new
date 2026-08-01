<?php
require_once '../_class/query.php';
$obj       = new Query();
$dataArray = [];

$data = $obj->selectData("notice_id,data,created", "notice", "where status != 0 order by notice_id desc");
if (mysqli_num_rows($data) > 0) {
    $m = 0;
    while ($data_row = mysqli_fetch_array($data)) {
        $dataArray[$m]['notice_id']   = $data_row['notice_id'];
        $dataArray[$m]['notice_data'] = $data_row['data'];
        $dataArray[$m]['createdDate'] = date('d-M-y', strtotime($data_row['created']));
        $dataArray[$m]['createdTime'] = date('h:i a', strtotime($data_row['created']));
        $m++;
    }
}
echo json_encode($dataArray);



