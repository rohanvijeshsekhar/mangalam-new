<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';

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
$id        = $_GET['id'];

$fetchEnquiry = $obj->selectData("enquiry_id,name,email,phone,adults_count,cheldren_count,destination_id,from_date,to_date,hotel_type", "enquiry", "WHERE enquiry_id = $id AND status != 0");
if (mysqli_num_rows($fetchEnquiry) > 0) {
    $data_row = mysqli_fetch_array($fetchEnquiry);
    $destination_id = (int) ($data_row['destination_id'] ?? 0);

    // Format dates to better format
    $fromDate = '';
    $toDate = '';
    if ($destination_id !== 0 && !empty($data_row['from_date'])) {
        $dateObj = DateTime::createFromFormat('Y-m-d', $data_row['from_date']);
        if ($dateObj) {
            $fromDate = $dateObj->format('d M Y');
        } else {
            $fromDate = $data_row['from_date'];
        }
    }
    if (!empty($data_row['to_date'])) {
        $dateObj = DateTime::createFromFormat('Y-m-d', $data_row['to_date']);
        if ($dateObj) {
            $toDate = $dateObj->format('d M Y');
        } else {
            $toDate = $data_row['to_date'];
        }
    }
    
    $dataArray[0]['id']               = $id;
    $dataArray[0]['name']             = $data_row['name'];
    $dataArray[0]['email']            = $data_row['email'];
    $dataArray[0]['phone']            = $data_row['phone'];
    $dataArray[0]['adult_count']      = $data_row['adults_count'];
    $dataArray[0]['children_count']   = $data_row['cheldren_count'];
    $dataArray[0]['from_date']        = $fromDate;
    $dataArray[0]['to_date']          = $toDate;
    $dataArray[0]['message']          = customizationEnquiryMessage($data_row);
    $dataArray[0]['hotel_type']       = $destination_id === 0 ? 'Other Location' : $data_row['hotel_type'];
    $destination_name       = $destination_id === 0 ? 'Other Location' : null;
    if ($destination_id > 0) {
        $fetch_destination_name = $obj->selectData("destination_name", "destinations", "WHERE destination_id = $destination_id AND status != 0");
        $destination_name_row = mysqli_fetch_array($fetch_destination_name);
        if (is_array($destination_name_row)) {
            $destination_name = $destination_name_row['destination_name'] ?? null;
        }
    }
    $dataArray[0]['destination_name'] = $destination_name;
    $dataArray[0]['is_other_location'] = $destination_id === 0;

    $fetch_enquiry_age = $obj->selectData("age", "enquiry_age", "WHERE enquiry_id = $id AND status != 0");
    if (mysqli_num_rows($fetch_enquiry_age) > 0) {
        $i = 0;
        while ($data_enquiry_age_row = mysqli_fetch_array($fetch_enquiry_age)) {
            $dataArray[0]['age'][$i]['age'] = $data_enquiry_age_row['age'];
            $i++;
        }
    }

    $fetch_enquiry_picked = $obj->selectData("picked_id,type", "enquiry_picked", "WHERE enquiry_id = $id AND status != 0");
    if (mysqli_num_rows($fetch_enquiry_picked) > 0) {
        $m = 0;
        while ($data_enquiry_picked_row = mysqli_fetch_array($fetch_enquiry_picked)) {
            $picked_id = $data_enquiry_picked_row['picked_id'];
            $type      = $data_enquiry_picked_row['type'];
            if ($type == 'place') {
                $fetch_place_name                          = $obj->selectData("place_name", "places", "WHERE place_id = $picked_id AND status != 0");
                $place_name_row                            = mysqli_fetch_array($fetch_place_name);
                $dataArray[0]['picked'][$m]['picked_name'] = $place_name_row['place_name'];
                $dataArray[0]['picked'][$m]['picked_type'] = 'Place';
            } elseif ($type == 'ticket') {
                $fetch_ticket_name                         = $obj->selectData("title", "tickets", "WHERE ticket_id = $picked_id AND status != 0");
                $ticket_name_row                           = mysqli_fetch_array($fetch_ticket_name);
                $dataArray[0]['picked'][$m]['picked_name'] = $ticket_name_row['title'];
                $dataArray[0]['picked'][$m]['picked_type'] = 'Ticket';
            } else {
                $fetch_activity_name                       = $obj->selectData("title", "activities", "WHERE activity_id = $picked_id AND status != 0");
                $activity_name_row                         = mysqli_fetch_array($fetch_activity_name);
                $dataArray[0]['picked'][$m]['picked_name'] = $activity_name_row['title'];
                $dataArray[0]['picked'][$m]['picked_type'] = 'Activity';
            }
            $m++;
        }
    }
}
echo json_encode($dataArray);
