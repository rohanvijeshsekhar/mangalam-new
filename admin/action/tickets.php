<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
$obj       = new Query();
$dataArray = [];

$fetchTickets = $obj->selectData("ticket_id,title,created", "tickets", "where status != 0 order by ticket_id desc");
if (mysqli_num_rows($fetchTickets) > 0) {
    $m = 0;
    while ($data_row = mysqli_fetch_array($fetchTickets)) {
        $dataArray[$m]['ticket_id']   = $data_row['ticket_id'];
        $dataArray[$m]['title'] = $data_row['title'];
        $dataArray[$m]['createdDate'] = date('d-M-y', strtotime($data_row['created']));
        $dataArray[$m]['createdTime'] = date('h:i a', strtotime($data_row['created']));
        $m++;
    }
}
echo json_encode($dataArray);
