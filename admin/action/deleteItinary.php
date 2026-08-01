<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
header('Content-Type: application/json; charset=utf-8');

$obj = new Query();

// Accept id from GET or JSON POST body
$id = 0;
if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
} else {
    $raw = file_get_contents('php://input');
    $payload = json_decode($raw, true);
    if (is_array($payload) && isset($payload['id'])) {
        $id = intval($payload['id']);
    } elseif (isset($_POST['id'])) {
        $id = intval($_POST['id']);
    }
}

if ($id <= 0) {
    echo json_encode([['status' => 0, 'msg' => 'Invalid itinerary id']]);
    exit;
}

$delete = $obj->updateData(
    "package_itineary",
    ['status' => 0],
    "WHERE itineary_id = $id"
);

echo $delete ? 1 : 0;
