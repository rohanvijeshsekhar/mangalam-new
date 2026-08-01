<?php
require_once __DIR__ . '/requireAdminAuth.php';
ob_start();
require_once '../../_class/query.php';
ob_end_clean();
header('Content-Type: application/json; charset=utf-8');

$obj       = new Query();
$dataArray = [];

$fetch_enq = $obj->selectData(
    "id,name,phone,email,subject,date",
    "enquiry_contact",
    "where status != 0 order by id desc"
);
if (mysqli_num_rows($fetch_enq) > 0) {
    $m = 0;
    while ($data_row = mysqli_fetch_array($fetch_enq)) {
        $dataArray[$m]['id']      = $data_row['id'];
        $dataArray[$m]['name']    = $data_row['name'];
        $dataArray[$m]['phone']   = $data_row['phone'];
        $dataArray[$m]['email']   = $data_row['email'];
        $dataArray[$m]['subject'] = $data_row['subject'];
        $dataArray[$m]['date']    = $data_row['date'];
        $m++;
    }
}
echo json_encode($dataArray);
