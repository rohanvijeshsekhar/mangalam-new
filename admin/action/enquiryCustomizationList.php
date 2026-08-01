<?php
require_once __DIR__ . '/requireAdminAuth.php';
ob_start();
require_once '../../_class/query.php';
ob_end_clean();
header('Content-Type: application/json; charset=utf-8');

function customizationEnquiryMessage(array $row)
{
    $destinationId = (int) ($row['destination_id'] ?? 0);
    if ($destinationId !== 0) {
        return '';
    }

    $fromDate = trim((string) ($row['from_date'] ?? ''));
    if ($fromDate !== '') {
        return $fromDate;
    }

    $hotelType = (string) ($row['hotel_type'] ?? '');
    $prefix = 'Other Location - ';
    if (strpos($hotelType, $prefix) === 0) {
        return trim(substr($hotelType, strlen($prefix)));
    }

    return '';
}

$obj       = new Query();
$dataArray = [];

$fetch_enq = $obj->selectData(
    "enquiry_id,name,phone,email,destination_id,from_date,hotel_type",
    "enquiry",
    "where status != 0 order by enquiry_id desc"
);
if (mysqli_num_rows($fetch_enq) > 0) {
    $m = 0;
    while ($data_row = mysqli_fetch_array($fetch_enq)) {
        $destination_id   = (int) ($data_row['destination_id'] ?? 0);
        $destination_name = $destination_id === 0 ? 'Other Location' : null;
        if ($destination_id > 0) {
            $fetch_destination_name = $obj->selectData("destination_name", "destinations", "where destination_id = $destination_id");
            $destination_name_row = mysqli_fetch_array($fetch_destination_name);
            if (is_array($destination_name_row)) {
                $destination_name = $destination_name_row['destination_name'] ?? null;
            }
        }
        $dataArray[$m]['name']             = $data_row['name'];
        $dataArray[$m]['phone']            = $data_row['phone'];
        $dataArray[$m]['email']            = $data_row['email'];
        $dataArray[$m]['id']               = $data_row['enquiry_id'];
        $dataArray[$m]['destination_name'] = $destination_name;
        $dataArray[$m]['message']          = customizationEnquiryMessage($data_row);
        $m++;
    }
}
echo json_encode($dataArray);
