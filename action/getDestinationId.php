<?php
require_once '../_class/query.php';
$obj = new Query();
header('Content-Type: application/json; charset=utf-8');

$slug = $_GET['slug'] ?? '';

if (empty($slug)) {
    echo json_encode(['success' => false, 'message' => 'Slug is required']);
    exit;
}

$fetchDestination = $obj->selectData("destination_id, destination_name", "destinations", "where slug_url = '$slug' AND status != 0");

if (mysqli_num_rows($fetchDestination) > 0) {
    $destination = mysqli_fetch_assoc($fetchDestination);
    echo json_encode([
        'success' => true,
        'destination_id' => $destination['destination_id'],
        'destination_name' => $destination['destination_name']
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Destination not found']);
}

