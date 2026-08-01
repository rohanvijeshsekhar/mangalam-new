<?php
require_once '../_class/query.php';
$obj        = new Query();
$dataArray  = [];
$id         = $_GET['id'] ?? null;
$search_data = $_GET['search'] ?? '';

if (!$id) {
    echo json_encode([]);
    exit;
}

/* ---------------------- fetch place under destination --------------------- */
$fetchPlaces = $obj->selectData("place_id,place_name,image", "places", "where status != 0 and destination_id = $id and place_name LIKE '%$search_data%'");
if (mysqli_num_rows($fetchPlaces) > 0) {
    $m = 0;
    while ($data_row = mysqli_fetch_array($fetchPlaces)) {
        $dataArray[0]['place'][$m]['place_id']   = $data_row['place_id'];
        $dataArray[0]['place'][$m]['place_name'] = $data_row['place_name'];
        $dataArray[0]['place'][$m]['image']      = $data_row['image'];
        $m++;
    }
}

/* ---------------------- fetch activities under destination --------------------- */
$fetchActivities = $obj->selectData("card_image,short_title,activity_id", "activities", "where status != 0 and destination_id = $id and title LIKE '%$search_data%'");
if (mysqli_num_rows($fetchActivities) > 0) {
    $m = 0;
    while ($data_row = mysqli_fetch_array($fetchActivities)) {
        $dataArray[0]['activity'][$m]['activity_id'] = $data_row['activity_id'];
        $dataArray[0]['activity'][$m]['title']       = $data_row['short_title'];
        $dataArray[0]['activity'][$m]['image']       = $data_row['card_image'];
        $m++;
    }
}

/* ---------------------- fetch tickets under destination --------------------- */
$fetchTickets = $obj->selectData("card_image,short_title,ticket_id", "tickets", "where status != 0 and destination_id = $id and title LIKE '%$search_data%'");
if (mysqli_num_rows($fetchTickets) > 0) {
    $m = 0;
    while ($data_ticket = mysqli_fetch_array($fetchTickets)) {
        $dataArray[0]['ticket'][$m]['ticket_id'] = $data_ticket['ticket_id'];
        $dataArray[0]['ticket'][$m]['title']     = $data_ticket['short_title'];
        $dataArray[0]['ticket'][$m]['image']     = $data_ticket['card_image'];
        $m++;
    }
}

header('Content-Type: application/json');
echo json_encode($dataArray);
