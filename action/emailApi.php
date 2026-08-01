<?php
// Email API Endpoint for Mangalam Tours
// Similar to Mangalam Tours email system

ob_start();

require_once '../_class/query.php';
require_once './emailSender.php';
require_once './otpHelper.php';

ob_end_clean();
header('Content-Type: application/json; charset=utf-8');

// Get the request method
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // Get JSON data from request body
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
        exit;
    }

    try {
        $enquiryType = $input['enquiry_type'] ?? 'cart';
        $customerName = trim((string) ($input['customer_name'] ?? $input['name'] ?? ''));
        $customerEmail = trim((string) ($input['customer_email'] ?? $input['email'] ?? ''));
        $customerPhone = trim((string) ($input['customer_phone'] ?? $input['phone'] ?? ''));
        $totalAmount = $input['total_amount'] ?? 0;
        $currencyType = $input['currency_type'] ?? 'AED';

        // Validate required fields
        if (empty($customerName) || empty($customerEmail) || empty($customerPhone)) {
            echo json_encode(['success' => false, 'message' => 'Customer information is required']);
            exit;
        }

        if (!requireSmsOtpVerified($customerPhone)) {
            echo json_encode([
                'success' => false,
                'message' => 'Please verify your mobile number with OTP before submitting.',
            ]);
            exit;
        }

        $emailResult = [];
        $enquirySaved = false;

        switch ($enquiryType) {
            case 'cart':
                $cartItems = $input['cart_items'] ?? [];
                if (empty($cartItems)) {
                    echo json_encode(['success' => false, 'message' => 'Cart items are required']);
                    exit;
                }
                $emailResult = [];

                // Persist for admin visibility (follow same flow as submitEnquiryCart.php)
                // Step 1: Insert customer info into enquiry_cart
                // Step 2: Insert each cart item into enquiry_activities or enquiry_tickets with enquiry_cart_id
                try {
                    $obj = new query();

                    // Step 1: Insert into enquiry_cart
                    $infoCart = [
                        'name'  => $customerName,
                        'email' => $customerEmail,
                        'phone' => $customerPhone,
                    ];
                    $insertCartEnq = $obj->insertData("enquiry_cart", $infoCart);

                    if ($insertCartEnq) {
                        $enquirySaved = true;
                        // Get enquiry_cart_id
                        $fetchCartEnqId = $obj->selectData("id", "enquiry_cart", "where status != 0 order by id desc limit 1");
                        if (mysqli_num_rows($fetchCartEnqId) > 0) {
                            $cartEnqIdRow = mysqli_fetch_array($fetchCartEnqId);
                            $cartEnqId = $cartEnqIdRow['id'];

                            // Step 2: Insert each cart item
                            foreach ($cartItems as $enq_data) {
                                $enq_type = isset($enq_data['type']) ? $enq_data['type'] : '';
                                $adults_count = isset($enq_data['adults']) ? intval($enq_data['adults']) : 1;
                                $children_count = isset($enq_data['children']) ? intval($enq_data['children']) : 0;
                                $ageArray = isset($enq_data['age']) && is_array($enq_data['age']) ? $enq_data['age'] : [];
                                $date = isset($enq_data['date']) ? $enq_data['date'] : date('Y-m-d');

                                // Extract ID from item id (format: "act-{id}" or "tkt-{id}")
                                $data_id = 0;
                                if (isset($enq_data['id'])) {
                                    $idParts = explode('-', $enq_data['id']);
                                    if (count($idParts) > 1) {
                                        $data_id = intval($idParts[1]);
                                    } else {
                                        $data_id = intval($enq_data['id']);
                                    }
                                }

                                if ($enq_type == 'Ticket' || $enq_type == 'ticket') {
                                    // Insert ticket enquiry
                                    $infoEnq = [
                                        'date'            => $date,
                                        'adult_count'     => $adults_count,
                                        'children_count'  => $children_count,
                                        'enquiry_cart_id' => $cartEnqId,
                                        'ticket_id'       => $data_id,
                                    ];
                                    $insertEnq = $obj->insertData("enquiry_tickets", $infoEnq);

                                    // Get enquiry_ticket_id using specific query to get the correct one
                                    $sql_fetch_enq_id = $obj->selectData("id", "enquiry_tickets", "where enquiry_cart_id = $cartEnqId and ticket_id = $data_id and status != 0 order by id desc limit 1");
                                    if (mysqli_num_rows($sql_fetch_enq_id) > 0) {
                                        $enq_id_row = mysqli_fetch_array($sql_fetch_enq_id);
                                        $enq_id = $enq_id_row['id'];

                                        // Insert children ages if array is not empty
                                        if (!empty($ageArray) && is_array($ageArray) && $children_count > 0) {
                                            for ($i = 0; $i < sizeof($ageArray); $i++) {
                                                // Handle both array of numbers and array of objects
                                                $ageValue = $ageArray[$i];
                                                if (is_array($ageValue) && isset($ageValue['age'])) {
                                                    $ageValue = $ageValue['age'];
                                                } elseif (is_object($ageValue) && isset($ageValue->age)) {
                                                    $ageValue = $ageValue->age;
                                                }
                                                $ageValue = intval($ageValue);

                                                // Insert age if valid (3-17 years for children)
                                                if ($ageValue >= 0 && $ageValue <= 17) {
                                                    $info_age = [
                                                        'enquiry_ticket_id' => $enq_id,
                                                        'age'               => strval($ageValue),
                                                        'status'            => 1,
                                                    ];
                                                    try {
                                                        $obj->insertData("enquiry_ticket_age", $info_age);
                                                    } catch (Exception $ageException) {
                                                        // Log error but continue with other ages
                                                        error_log("Failed to insert ticket age: " . $ageException->getMessage());
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    // Default to Activity if type not specified or is Activity
                                    $infoEnq = [
                                        'date'            => $date,
                                        'adult_count'     => $adults_count,
                                        'children_count'  => $children_count,
                                        'enquiry_cart_id' => $cartEnqId,
                                        'activity_id'     => $data_id,
                                    ];
                                    $insertEnq = $obj->insertData("enquiry_activities", $infoEnq);

                                    if ($insertEnq) {
                                        // Get enquiry_activity_id using specific query to get the correct one
                                        $sql_fetch_enq_id = $obj->selectData("id", "enquiry_activities", "where enquiry_cart_id = $cartEnqId and activity_id = $data_id and status != 0 order by id desc limit 1");
                                        if (mysqli_num_rows($sql_fetch_enq_id) > 0) {
                                            $enq_id_row = mysqli_fetch_array($sql_fetch_enq_id);
                                            $enq_id = $enq_id_row['id'];

                                            // Insert children ages if array is not empty and children count > 0
                                            if (is_array($ageArray) && $children_count > 0 && count($ageArray) > 0) {
                                                for ($i = 0; $i < count($ageArray); $i++) {
                                                    // Handle both array of numbers and array of objects
                                                    $ageValue = $ageArray[$i];
                                                    if (is_array($ageValue) && isset($ageValue['age'])) {
                                                        $ageValue = $ageValue['age'];
                                                    } elseif (is_object($ageValue) && isset($ageValue->age)) {
                                                        $ageValue = $ageValue->age;
                                                    }
                                                    $ageValue = intval($ageValue);

                                                    // Insert age if valid (3-17 years for children)
                                                    if ($ageValue >= 0 && $ageValue <= 17 && $enq_id > 0) {
                                                        $info_age = [
                                                            'enquiry_activity_id' => $enq_id,
                                                            'age'                 => strval($ageValue),
                                                            'status'              => 1,
                                                        ];
                                                        try {
                                                            $insertAgeResult = $obj->insertData("enquiry_activity_age", $info_age);
                                                            if (!$insertAgeResult) {
                                                                $error = mysqli_error($obj->con);
                                                                error_log("Failed to insert activity age (cart): enquiry_activity_id=$enq_id, age=$ageValue, error=$error");
                                                            }
                                                        } catch (Exception $ageException) {
                                                            error_log("Failed to insert activity age (cart): " . $ageException->getMessage());
                                                        }
                                                    }
                                                }
                                            }
                                        } else {
                                            error_log("Failed to fetch enquiry_activity_id (cart): cartEnqId=$cartEnqId, activityId=$data_id");
                                        }
                                    } else {
                                        error_log("Failed to insert enquiry_activities (cart): cartEnqId=$cartEnqId, activityId=$data_id");
                                    }
                                }
                            }
                        }
                    }
                } catch (Exception $ignored) {
                    // Do not fail API on DB insert error; emails might have been sent
                }
                break;

            case 'activity':
                $activityData = $input['activity_data'] ?? [];
                if (empty($activityData)) {
                    echo json_encode(['success' => false, 'message' => 'Activity data is required']);
                    exit;
                }
                $emailResult = [];

                // Persist for admin visibility (follow same flow as submitEnquiryCart.php)
                // Step 1: Insert customer info into enquiry_cart
                // Step 2: Insert activity into enquiry_activities with enquiry_cart_id
                try {
                    $obj = new query();

                    // Step 1: Insert into enquiry_cart
                    $infoCart = [
                        'name'  => $customerName,
                        'email' => $customerEmail,
                        'phone' => $customerPhone,
                    ];
                    $insertCartEnq = $obj->insertData("enquiry_cart", $infoCart);

                    if ($insertCartEnq) {
                        $enquirySaved = true;
                        // Get enquiry_cart_id
                        $fetchCartEnqId = $obj->selectData("id", "enquiry_cart", "where status != 0 order by id desc limit 1");
                        if (mysqli_num_rows($fetchCartEnqId) > 0) {
                            $cartEnqIdRow = mysqli_fetch_array($fetchCartEnqId);
                            $cartEnqId = $cartEnqIdRow['id'];

                            // Extract activity_id from id (format: "act-{id}" or just numeric ID)
                            $activityId = 0;
                            if (isset($activityData['id'])) {
                                $idString = $activityData['id'];
                                $idParts = explode('-', $idString);
                                if (count($idParts) > 1) {
                                    // Format: "act-123" or similar
                                    if (strtolower($idParts[0]) === 'act') {
                                        $activityId = intval($idParts[1]);
                                    } else {
                                        $activityId = intval($idParts[1]);
                                    }
                                } else {
                                    // Just numeric ID or direct number
                                    $activityId = intval($idString);
                                }
                            }

                            $adultsCount = isset($activityData['adults']) ? intval($activityData['adults']) : 1;
                            $childrenCount = isset($activityData['children']) ? intval($activityData['children']) : 0;
                            $ageArray = isset($activityData['age']) && is_array($activityData['age']) ? $activityData['age'] : [];
                            $date = isset($activityData['date']) ? $activityData['date'] : date('Y-m-d');

                            // Step 2: Insert into enquiry_activities
                            $infoEnq = [
                                'date'            => $date,
                                'adult_count'     => $adultsCount,
                                'children_count'  => $childrenCount,
                                'enquiry_cart_id' => $cartEnqId,
                                'activity_id'     => $activityId,
                            ];

                            $insertEnq = $obj->insertData("enquiry_activities", $infoEnq);

                            if ($insertEnq) {
                                // Get enquiry_activity_id using specific query
                                $sql_fetch_enq_id = $obj->selectData("id", "enquiry_activities", "where enquiry_cart_id = $cartEnqId and activity_id = $activityId and status != 0 order by id desc limit 1");
                                if (mysqli_num_rows($sql_fetch_enq_id) > 0) {
                                    $enq_id_row = mysqli_fetch_array($sql_fetch_enq_id);
                                    $enq_id = $enq_id_row['id'];

                                    // Insert children ages if array is not empty and children count > 0
                                    if (is_array($ageArray) && $childrenCount > 0 && count($ageArray) > 0) {
                                        // Loop through age array and insert each age
                                        for ($i = 0; $i < count($ageArray); $i++) {
                                            // Handle both array of numbers and array of objects
                                            $ageValue = $ageArray[$i];
                                            if (is_array($ageValue) && isset($ageValue['age'])) {
                                                $ageValue = $ageValue['age'];
                                            } elseif (is_object($ageValue) && isset($ageValue->age)) {
                                                $ageValue = $ageValue->age;
                                            }
                                            $ageValue = intval($ageValue);

                                            if ($ageValue >= 0 && $ageValue <= 17 && $enq_id > 0) {
                                                $info_age = [
                                                    'enquiry_activity_id' => $enq_id,
                                                    'age'                 => strval($ageValue),
                                                    'status'              => 1,
                                                ];
                                                try {
                                                    $insertAgeResult = $obj->insertData("enquiry_activity_age", $info_age);
                                                    if (!$insertAgeResult) {
                                                        $error = mysqli_error($obj->con);
                                                        error_log("Failed to insert activity age: enquiry_activity_id=$enq_id, age=$ageValue, error=$error");
                                                    }
                                                } catch (Exception $ageException) {
                                                    // Log error but continue with other ages
                                                    error_log("Failed to insert activity age: " . $ageException->getMessage());
                                                }
                                            } else {
                                                error_log("Skipped age insert: ageValue=$ageValue, enq_id=$enq_id (valid: " . ($ageValue >= 3 && $ageValue <= 17 ? 'yes' : 'no') . ", enq_id valid: " . ($enq_id > 0 ? 'yes' : 'no') . ")");
                                            }
                                        }
                                    } else {
                                        error_log("Skipped age array: is_array=" . (is_array($ageArray) ? 'yes' : 'no') . ", childrenCount=$childrenCount, array_count=" . (is_array($ageArray) ? count($ageArray) : 0));
                                    }
                                } else {
                                    error_log("Failed to fetch enquiry_activity_id: cartEnqId=$cartEnqId, activityId=$activityId");
                                }
                            } else {
                                error_log("Failed to insert enquiry_activities: cartEnqId=$cartEnqId, activityId=$activityId");
                            }
                        }
                    }
                } catch (Exception $ignored) {
                    // Do not fail API on DB insert error; emails might have been sent
                }
                break;

            case 'ticket':
                $ticketData = $input['ticket_data'] ?? [];
                if (empty($ticketData)) {
                    echo json_encode(['success' => false, 'message' => 'Ticket data is required']);
                    exit;
                }
                $emailResult = [];

                // Persist for admin visibility (follow same flow as submitEnquiryCart.php)
                // Step 1: Insert customer info into enquiry_cart
                // Step 2: Insert ticket into enquiry_tickets with enquiry_cart_id
                try {
                    $obj = new query();

                    // Step 1: Insert into enquiry_cart
                    $infoCart = [
                        'name'  => $customerName,
                        'email' => $customerEmail,
                        'phone' => $customerPhone,
                    ];
                    $insertCartEnq = $obj->insertData("enquiry_cart", $infoCart);

                    if ($insertCartEnq) {
                        $enquirySaved = true;
                        // Get enquiry_cart_id
                        $fetchCartEnqId = $obj->selectData("id", "enquiry_cart", "where status != 0 order by id desc limit 1");
                        if (mysqli_num_rows($fetchCartEnqId) > 0) {
                            $cartEnqIdRow = mysqli_fetch_array($fetchCartEnqId);
                            $cartEnqId = $cartEnqIdRow['id'];

                            // Extract ticket_id from id (format: "tkt-{id}")
                            $ticketId = 0;
                            if (isset($ticketData['id'])) {
                                $idParts = explode('-', $ticketData['id']);
                                if (count($idParts) > 1 && $idParts[0] === 'tkt') {
                                    $ticketId = intval($idParts[1]);
                                }
                            }

                            $adultsCount = isset($ticketData['adults']) ? intval($ticketData['adults']) : 1;
                            $childrenCount = isset($ticketData['children']) ? intval($ticketData['children']) : 0;
                            $ageArray = isset($ticketData['age']) && is_array($ticketData['age']) ? $ticketData['age'] : [];
                            $date = isset($ticketData['date']) ? $ticketData['date'] : date('Y-m-d');

                            // Step 2: Insert into enquiry_tickets
                            $infoEnq = [
                                'date'            => $date,
                                'adult_count'     => $adultsCount,
                                'children_count'  => $childrenCount,
                                'enquiry_cart_id' => $cartEnqId,
                                'ticket_id'       => $ticketId,
                            ];

                            $insertEnq = $obj->insertData("enquiry_tickets", $infoEnq);

                            // Get enquiry_ticket_id using specific query
                            $sql_fetch_enq_id = $obj->selectData("id", "enquiry_tickets", "where enquiry_cart_id = $cartEnqId and ticket_id = $ticketId and status != 0 order by id desc limit 1");
                            if (mysqli_num_rows($sql_fetch_enq_id) > 0) {
                                $enq_id_row = mysqli_fetch_array($sql_fetch_enq_id);
                                $enq_id = $enq_id_row['id'];

                                // Insert children ages if array is not empty
                                if (!empty($ageArray) && is_array($ageArray) && $childrenCount > 0) {
                                    for ($i = 0; $i < sizeof($ageArray); $i++) {
                                        // Handle both array of numbers and array of objects
                                        $ageValue = $ageArray[$i];
                                        if (is_array($ageValue) && isset($ageValue['age'])) {
                                            $ageValue = $ageValue['age'];
                                        } elseif (is_object($ageValue) && isset($ageValue->age)) {
                                            $ageValue = $ageValue->age;
                                        }
                                        $ageValue = intval($ageValue);

                                        if ($ageValue >= 0 && $ageValue <= 17) {
                                            $info_age = [
                                                'enquiry_ticket_id' => $enq_id,
                                                'age'               => strval($ageValue),
                                                'status'            => 1,
                                            ];
                                            try {
                                                $obj->insertData("enquiry_ticket_age", $info_age);
                                            } catch (Exception $ageException) {
                                                // Log error but continue with other ages
                                                error_log("Failed to insert ticket age: " . $ageException->getMessage());
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } catch (Exception $ignored) {
                    // Do not fail API on DB insert error; emails might have been sent
                }
                break;

            case 'package':
                $packageData = $input['package_data'] ?? [];
                if (empty($packageData)) {
                    echo json_encode(['success' => false, 'message' => 'Package data is required']);
                    exit;
                }
                echo json_encode(['success' => false, 'message' => 'Use submitPackageEnquiry.php for package enquiries.']);
                exit;

            case 'contact':
                echo json_encode(['success' => false, 'message' => 'Use submitContactEnquiry.php for contact enquiries.']);
                exit;

            default:
                echo json_encode(['success' => false, 'message' => 'Invalid enquiry type']);
                exit;
        }

        $emailSent = false;
        foreach ($emailResult as $result) {
            if ($result) {
                $emailSent = true;
                break;
            }
        }

        $success = $emailSent || $enquirySaved;

        if ($success) {
            clearSmsOtpVerification();
            $message = $enquirySaved && !$emailSent
                ? 'Enquiry submitted successfully.'
                : ($emailSent ? 'Enquiry submitted successfully.' : 'Enquiry received.');
            echo json_encode([
                'success' => true,
                'message' => $message,
                'email_results' => $emailResult,
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Failed to submit enquiry. Please try again or contact us directly.',
                'email_results' => $emailResult,
            ]);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
