<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
header('Content-Type: application/json; charset=utf-8');
$obj  = new Query();
$data = json_decode(file_get_contents('php://input'), true);
$id     = $data['id'];
$info   = ['status' => 0];
$delete = $obj->updateData("enquiry", $info, "WHERE enquiry_id = $id");
if ($delete) {
    echo 1;
} else {
    echo 0;
}
