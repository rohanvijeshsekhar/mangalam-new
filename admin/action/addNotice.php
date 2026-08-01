<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
header('Content-Type: application/json; charset=utf-8');
$obj = new query();

$data        = json_decode(file_get_contents('php://input'), true);
$notice_data = $data['data'];
$info_notice = ['data' => $notice_data];
/* ------------------------ check data already exist ------------------------ */
$notice_id = $obj->selectData("notice_id", "notice", "WHERE status != 0");
if ($notice_id->num_rows > 0) {
    $notice_id = $notice_id->fetch_assoc()['notice_id'];
    $insert    = $obj->updateData("notice", $info_notice, "WHERE notice_id = $notice_id");
} else {
    $insert = $obj->insertData("notice", $info_notice);
}
if ($insert) {
    echo 1;
} else {
    echo 0;
}
