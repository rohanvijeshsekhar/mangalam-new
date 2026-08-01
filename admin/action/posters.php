<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
header('Content-Type: application/json; charset=utf-8');

$obj = new Query();
$posters = [];

$result = $obj->selectData("*", "posters", "WHERE status != 0 ORDER BY id DESC");

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $posters[] = $row;
    }
}

echo json_encode($posters);
exit;
?>
