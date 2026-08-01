<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
header('Content-Type: application/json; charset=utf-8');
$obj        = new Query();
$data       = json_decode(file_get_contents('php://input'), true);
$data_array = [];
$id         = $_GET['id'];

$fetchEnquiryCartData   = $obj->selectData("name,email,phone", "enquiry_cart", "where id = $id");
$cart_data_row          = mysqli_fetch_array($fetchEnquiryCartData);
$data_array[0]['name']  = $cart_data_row['name'];
$data_array[0]['email'] = $cart_data_row['email'];
$data_array[0]['phone'] = $cart_data_row['phone'];
/* ------------------------- fetch activity details ------------------------- */
$fetch_activity_details = $obj->selectData("id,adult_count,children_count,date,activity_id", "enquiry_activities", "where enquiry_cart_id = $id and status != 0");
if (mysqli_num_rows($fetch_activity_details) > 0) {
    $i = 0;
    while ($activity_data_row = mysqli_fetch_array($fetch_activity_details)) {
        $activity_enq_id                                 = $activity_data_row['id'];
        $activity_id                                     = $activity_data_row['activity_id'];
        $fetch_activity_name                             = $obj->selectData("title", "activities", "where activity_id = $activity_id");
        $activity_name_row                               = mysqli_fetch_array($fetch_activity_name);
        $data_array[0]['activity'][$i]['adult_count']    = $activity_data_row['adult_count'];
        $data_array[0]['activity'][$i]['children_count'] = $activity_data_row['children_count'];
        $data_array[0]['activity'][$i]['date']           = $activity_data_row['date'];
        $data_array[0]['activity'][$i]['title']          = $activity_name_row['title'];
        /* -------------------------- fetching activity age ------------------------- */
        $data_array[0]['activity'][$i]['age'] = [];
        if (!empty($activity_enq_id)) {
            $fetch_activity_age = $obj->selectData("age", "enquiry_activity_age", "where enquiry_activity_id = $activity_enq_id and status != 0");
            if ($fetch_activity_age) {
                $numRows = mysqli_num_rows($fetch_activity_age);
                if ($numRows > 0) {
                    $m = 0;
                    while ($activity_data_age_row = mysqli_fetch_assoc($fetch_activity_age)) {
                        if (isset($activity_data_age_row['age'])) {
                            $ageValue = trim($activity_data_age_row['age']);
                            if ($ageValue !== '' && $ageValue !== null) {
                                $data_array[0]['activity'][$i]['age'][$m] = ['age' => $ageValue];
                                $m++;
                            }
                        }
                    }
                }
            }
        }
        $i++;
    }
}
/* ------------------------- fetch ticket details ------------------------- */
$fetch_ticket_details = $obj->selectData("id,adult_count,children_count,date,ticket_id", "enquiry_tickets", "where enquiry_cart_id = $id and status != 0");
if (mysqli_num_rows($fetch_ticket_details) > 0) {
    $i = 0;
    while ($ticket_data_row = mysqli_fetch_array($fetch_ticket_details)) {
        $ticket_enq_id                                 = $ticket_data_row['id'];
        $ticket_id                                     = $ticket_data_row['ticket_id'];
        $fetch_ticket_name                             = $obj->selectData("title", "tickets", "where ticket_id = $ticket_id");
        $ticket_name_row                               = mysqli_fetch_array($fetch_ticket_name);
        $data_array[0]['ticket'][$i]['adult_count']    = $ticket_data_row['adult_count'];
        $data_array[0]['ticket'][$i]['children_count'] = $ticket_data_row['children_count'];
        $data_array[0]['ticket'][$i]['date']           = $ticket_data_row['date'];
        $data_array[0]['ticket'][$i]['title']          = $ticket_name_row['title'];
        /* -------------------------- fetching ticket age ------------------------- */
        $data_array[0]['ticket'][$i]['age'] = [];
        if (!empty($ticket_enq_id)) {
            $fetch_ticket_age = $obj->selectData("age", "enquiry_ticket_age", "where enquiry_ticket_id = $ticket_enq_id and status != 0");
            if ($fetch_ticket_age) {
                $numRows = mysqli_num_rows($fetch_ticket_age);
                if ($numRows > 0) {
                    $m = 0;
                    while ($ticket_age_row = mysqli_fetch_assoc($fetch_ticket_age)) {
                        if (isset($ticket_age_row['age'])) {
                            $ageValue = trim($ticket_age_row['age']);
                            if ($ageValue !== '' && $ageValue !== null) {
                                $data_array[0]['ticket'][$i]['age'][$m] = ['age' => $ageValue];
                                $m++;
                            }
                        }
                    }
                }
            }
        }
        $i++;
    }
}
echo json_encode($data_array);
