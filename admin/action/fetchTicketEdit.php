<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
$obj       = new Query();
$dataArray = [];
$id        = $_GET['id'];

// Function to fetch data from a table
function fetchTableData($obj, $table, $column, $condition)
{
    $resultArray = [];
    $result      = $obj->selectData($column, $table, $condition);
    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $resultArray[] = $row;
        }
    }
    return $resultArray;
}

// Fetch ticket data
$fetchData = $obj->selectData('title,short_title, destination_id, duration, hotel_type, description, adult_msg, children_msg, no_of_activities, cancellation, transportation, discount_amount, display_amount, featured, validity, required_age, child_amount, meta, card_image', 'tickets', "where ticket_id = '$id' and status != 0");
if ($fetchData->num_rows > 0) {
    $data_row = $fetchData->fetch_assoc();

    // Fetch ticket highlights
    $dataArray[0]['highlights'] = fetchTableData($obj, 'ticket_highlights', 'id, highlights', "where ticket_id = '$id' and status != 0");

    // Fetch ticket includes
    $dataArray[0]['includes'] = fetchTableData($obj, 'ticket_includes', 'id, includes', "where ticket_id = '$id' and status != 0");

    // Fetch ticket excludes
    $dataArray[0]['excludes'] = fetchTableData($obj, 'ticket_excludes', 'id, excludes', "where ticket_id = '$id' and status != 0");

    // Fetch ticket things to know
    $dataArray[0]['ticket_thinks_to_know'] = fetchTableData($obj, 'ticket_thinks_to_know', 'id, data', "where ticket_id = '$id' and status != 0");

    // Fetch ticket images
    $dataArray[0]['ticket_images'] = fetchTableData($obj, 'ticket_images', 'id, image_names', "where ticket_id = '$id' and status != 0");

    // Fetch faq
    $dataArray[0]['faq'] = fetchTableData($obj, 'faq_ticket', 'id, question,answer', "where ticket_id = '$id' and status != 0");

    $dataArray[0]['title']            = $data_row['title'];
    $dataArray[0]['short_title']      = $data_row['short_title'];
    $dataArray[0]['destination_id']   = $data_row['destination_id'];
    $dataArray[0]['duration']         = $data_row['duration'];
    $dataArray[0]['hotel_type']       = $data_row['hotel_type'];
    $dataArray[0]['description']      = $data_row['description'];
    $dataArray[0]['adult_msg']        = $data_row['adult_msg'];
    $dataArray[0]['children_msg']     = $data_row['children_msg'];
    $dataArray[0]['no_of_activities'] = $data_row['no_of_activities'];
    $dataArray[0]['cancellation']     = $data_row['cancellation'];
    $dataArray[0]['transportation']   = $data_row['transportation'];
    $dataArray[0]['discount_amount']  = $data_row['discount_amount'];
    $dataArray[0]['display_amount']   = $data_row['display_amount'];
    $dataArray[0]['featured']         = $data_row['featured'];
    $dataArray[0]['validity']         = $data_row['validity'];
    $dataArray[0]['child_amount']     = $data_row['child_amount'];
    $dataArray[0]['required_age']     = $data_row['required_age'];
    $dataArray[0]['meta']             = $data_row['meta'];
    $dataArray[0]['card_image']       = $data_row['card_image'] ?? '';
}
echo json_encode($dataArray);
