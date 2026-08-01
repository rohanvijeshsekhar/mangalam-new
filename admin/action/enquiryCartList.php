<?php
require_once __DIR__ . '/requireAdminAuth.php';
ob_start();
require_once '../../_class/query.php';
ob_end_clean();
header('Content-Type: application/json; charset=utf-8');

$obj       = new Query();
$dataArray = [];

function cartEnquiryItemNames(Query $obj, int $cartId): string
{
    $names = [];

    $fetchActivities = $obj->selectData(
        "activity_id",
        "enquiry_activities",
        "where enquiry_cart_id = $cartId and status != 0"
    );
    if ($fetchActivities && mysqli_num_rows($fetchActivities) > 0) {
        while ($row = mysqli_fetch_array($fetchActivities)) {
            $activityId = (int) ($row['activity_id'] ?? 0);
            if ($activityId <= 0) {
                continue;
            }
            $fetchName = $obj->selectData("title", "activities", "where activity_id = $activityId and status != 0");
            $nameRow = mysqli_fetch_array($fetchName);
            if (is_array($nameRow) && !empty($nameRow['title'])) {
                $names[] = $nameRow['title'];
            }
        }
    }

    $fetchTickets = $obj->selectData(
        "ticket_id",
        "enquiry_tickets",
        "where enquiry_cart_id = $cartId and status != 0"
    );
    if ($fetchTickets && mysqli_num_rows($fetchTickets) > 0) {
        while ($row = mysqli_fetch_array($fetchTickets)) {
            $ticketId = (int) ($row['ticket_id'] ?? 0);
            if ($ticketId <= 0) {
                continue;
            }
            $fetchName = $obj->selectData("title", "tickets", "where ticket_id = $ticketId and status != 0");
            $nameRow = mysqli_fetch_array($fetchName);
            if (is_array($nameRow) && !empty($nameRow['title'])) {
                $names[] = $nameRow['title'];
            }
        }
    }

    return implode(', ', $names);
}

$fetch_enq = $obj->selectData("id,name,phone,email", "enquiry_cart", "where status != 0 order by id desc");
if (mysqli_num_rows($fetch_enq) > 0) {
    $m = 0;
    while ($data_row = mysqli_fetch_array($fetch_enq)) {
        $cartId = (int) $data_row['id'];
        $dataArray[$m]['name']       = $data_row['name'];
        $dataArray[$m]['phone']      = $data_row['phone'];
        $dataArray[$m]['email']      = $data_row['email'];
        $dataArray[$m]['id']         = $cartId;
        $dataArray[$m]['item_names'] = cartEnquiryItemNames($obj, $cartId);
        $m++;
    }
}
echo json_encode($dataArray);
