<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
header('Content-Type: application/json; charset=utf-8');

$obj  = new Query();
$data = json_decode(file_get_contents('php://input'), true);
$id   = (int) ($data['id'] ?? 0);
$info = ['status' => 0];

$delete = $obj->updateData('enquiry_contact', $info, "WHERE id = $id");
echo $delete ? 1 : 0;
