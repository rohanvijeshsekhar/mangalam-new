<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
$obj       = new Query();
$dataArray = [];

$fetch_enq = $obj->selectData("enquiry_id,name,phone,email,enq_type", "enquiry", "where status != 0 order by enquiry_id desc");
if (mysqli_num_rows($fetch_enq) > 0) {
    $m = 0;
    while ($data_row = mysqli_fetch_array($fetch_enq)) {
        $dataArray[$m]['name']       = $data_row['name'];
        $dataArray[$m]['phone']      = $data_row['phone'];
        $dataArray[$m]['email']      = $data_row['email'];
        $dataArray[$m]['enquiry_id'] = $data_row['enquiry_id'];
        $dataArray[$m]['enq_type']   = $data_row['enq_type'];
        $m++;
    }
}
echo json_encode($dataArray);
