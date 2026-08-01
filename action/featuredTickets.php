<?php
require_once __DIR__ . '/../_class/query.php';
$obj       = new Query();
$dataArray = [];
/* ----------------------- fetch all featured tickets ----------------------- */
$fetchFeaturedTickets = $obj->selectData("ticket_id,title,destination_id,slug_url,card_image,validity", "tickets", "where featured = 1 and status != 0");
if (mysqli_num_rows($fetchFeaturedTickets) > 0) {
    $i = 0;
    while ($ticketRow = mysqli_fetch_array($fetchFeaturedTickets)) {
        $ticketId                  = $ticketRow['ticket_id'];
        $destination_id            = $ticketRow['destination_id'];

        /* ------------------------- fetch destination name ------------------------- */
        $fetchDestinationName = $obj->selectData("destination_name", "destinations", "where destination_id = $destination_id");
        $destination_name_row = mysqli_fetch_array($fetchDestinationName);

        $dataArray[$i]['title']    = $ticketRow['title'];
        $dataArray[$i]['destination'] = $destination_name_row['destination_name'];
        $dataArray[$i]['id']       = $ticketRow['ticket_id'];
        $dataArray[$i]['validity']       = $ticketRow['validity'];
        $dataArray[$i]['slug_url'] = $ticketRow['slug_url'];
        $dataArray[$i]['slug_url'] = $ticketRow['slug_url'];
        $dataArray[$i]['image']    = $ticketRow['card_image'];
        $i++;
    }
}
return json_encode($dataArray);
