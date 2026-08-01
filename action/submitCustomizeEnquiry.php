<?php
require_once '../_class/query.php';
require_once './otpHelper.php';
$obj = new Query();
header('Content-Type: application/json; charset=utf-8');
$data = json_decode(file_get_contents('php://input'), true);

$name           = $data['name'] ?? '';
$phone          = $data['phone'] ?? '';
$email          = $data['email'] ?? '';
$destination_id = $data['destination_id'] ?? null;
$destination_name = $data['destination_name'] ?? '';
$from_date      = $data['from_date'] ?? '';
$to_date        = $data['to_date'] ?? '';
$adults_count   = $data['adults'] ?? 1;
$children_count = $data['children'] ?? 0;
$age_array      = $data['children_ages'] ?? [];
$hotel_type     = $data['hotel_type'] ?? '5 Star';
$selected_experiences = $data['selected_experiences'] ?? [];

// Validate required fields
if (empty($name) || empty($email) || empty($phone) || !$destination_id || empty($from_date) || empty($to_date)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields']);
    exit;
}

if (!requireSmsOtpVerified($phone)) {
    echo json_encode([
        'success' => false,
        'message' => 'Please verify your mobile number with OTP before submitting.',
    ]);
    exit;
}

/* --------------------------- insert inquiry data -------------------------- */
// Attempt to fetch destination name if missing
if (empty($destination_name) && $destination_id) {
    $destination_res = $obj->selectData("destination_name", "destinations", "WHERE destination_id = $destination_id AND status != 0");
    if ($destination_res && mysqli_num_rows($destination_res) > 0) {
        $destination_row  = mysqli_fetch_array($destination_res);
        $destination_name = $destination_row['destination_name'];
    }
}

/* --------------------------- insert inquiry data -------------------------- */
$info_enq = [
    'name'           => $name,
    'email'          => $email,
    'phone'          => $phone,
    'destination_id' => $destination_id,
    'from_date'      => $from_date,
    'to_date'        => $to_date,
    'adults_count'   => $adults_count,
    'cheldren_count' => $children_count,
    'hotel_type'     => $hotel_type,
    'status'         => 1,
];

$sql_insert_enq = $obj->insertData("enquiry", $info_enq);

if ($sql_insert_enq) {
    $enquiry_id = mysqli_insert_id($obj->con);
    if (!$enquiry_id) {
        $fetch_enq_id = $obj->selectData("enquiry_id", "enquiry", "WHERE status != 0 ORDER BY enquiry_id DESC LIMIT 1");
        if ($fetch_enq_id && mysqli_num_rows($fetch_enq_id) > 0) {
            $enq_id_row = mysqli_fetch_array($fetch_enq_id);
            $enquiry_id = $enq_id_row['enquiry_id'];
        }
    }

    // Insert children ages if any
    if ($enquiry_id && $children_count > 0 && !empty($age_array)) {
        foreach ($age_array as $age) {
            if ($age === '' || $age === null) {
                continue;
            }
            $age_data = [
                'enquiry_id' => $enquiry_id,
                'age'        => $age,
                'status'     => 1,
            ];
            $obj->insertData("enquiry_age", $age_data);
        }
    }

    // Insert selected experiences
    if ($enquiry_id && !empty($selected_experiences)) {
        foreach ($selected_experiences as $experience) {
            $pickedId = $experience['id'] ?? null;
            $pickedType = $experience['type'] ?? null;
            if (!$pickedId || !$pickedType) {
                continue;
            }
            $exp_data = [
                'enquiry_id' => $enquiry_id,
                'picked_id'  => $pickedId,
                'type'       => $pickedType,
                'status'     => 1,
            ];
            $obj->insertData("enquiry_picked", $exp_data);
        }
    }

    clearSmsOtpVerification();
    echo json_encode(['success' => true, 'message' => 'Enquiry submitted successfully']);
} else {
    error_log('submitCustomizeEnquiry insert failed: ' . mysqli_error($obj->con));
    echo json_encode(['success' => false, 'message' => 'Failed to submit enquiry. Please try again.']);
}
