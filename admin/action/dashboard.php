<?php
require_once __DIR__ . '/requireAdminAuth.php';
// Include the Query class
require_once '../../_class/query.php';

// Create a new Query object
$obj = new Query();

// Initialize an empty array to store the data
$dataArray = [];

// Fetch the count of customize enquiries from the enquiry table
$fetch_customize_enquiry_count = $obj->selectData(
    "count(enquiry_id) as coustomize_count",
    "enquiry",
    "where status != 0"
);

// If the query was successful, add the count to the data array
if ($fetch_customize_enquiry_count) {
    $fetch_customize_enquiry_count_row = $fetch_customize_enquiry_count->fetch_assoc();
    $dataArray['coustomize_count']     = $fetch_customize_enquiry_count_row['coustomize_count'];
}
// If there was an error, print a message and stop execution
else {
    die("Error fetching customize enquiry count: ");
}

// Fetch the count of package enquiries from the enquiry_package table
$fetch_package_enquiry_count = $obj->selectData("
count(id) as package_enq_count",
    "enquiry_package",
    "where status != 0"
);

// If the query was successful, add the count to the data array
if ($fetch_package_enquiry_count) {
    $fetch_package_enquiry_count_row = $fetch_package_enquiry_count->fetch_assoc();
    $dataArray['package_enq_count']  = $fetch_package_enquiry_count_row['package_enq_count'];
}
// If there was an error, print a message and stop execution
else {
    die("Error fetching package enquiry count: ");
}

// Fetch the count of activity tickets from the enquiry_cart table
$fetch_activity_ticket_enquiry_count = $obj->selectData(
    "count(id) as activity_ticket_count",
    "enquiry_cart",
    "where status != 0"
);

// If the query was successful, add the count to the data array
if ($fetch_activity_ticket_enquiry_count) {
    $fetch_activity_ticket_enquiry_count_row = $fetch_activity_ticket_enquiry_count->fetch_assoc();
    $dataArray['activity_ticket_count']      = $fetch_activity_ticket_enquiry_count_row['activity_ticket_count'];
}
// If there was an error, print a message and stop execution
else {
    die("Error fetching activity ticket enquiry count: ");
}

// Fetch the count of destinations from the destinations table
$fetch_destination_count = $obj->selectData(
    "count(destination_id) as destination_count",
    "destinations",
    "where status != 0"
);

// If the query was successful, add the count to the data array
if ($fetch_destination_count) {
    $fetch_destination_count_row    = $fetch_destination_count->fetch_assoc();
    $dataArray['destination_count'] = $fetch_destination_count_row['destination_count'];
}
// If there was an error, print a message and stop execution
else {
    die("Error fetching destination count: ");
}

// Select count of active tickets from 'tickets' table
$fetch_ticket_count = $obj->selectData(
    "count(ticket_id) as ticket_count",
    "tickets",
    "where status != 0"
);

// If query returned a non-empty result set, fetch the count and store it in $dataArray
if ($fetch_ticket_count) {
    $fetch_ticket_count_row    = $fetch_ticket_count->fetch_assoc();
    $dataArray['ticket_count'] = $fetch_ticket_count_row['ticket_count'];
} else { // If query returned an empty result set, output an error message and stop execution
    die("Error fetching ticket count");
}

// Select count of active activities from 'activities' table
$fetch_activity_count = $obj->selectData(
    "count(activity_id) as activity_count",
    "activities",
    "where status != 0"
);

// If query returned a non-empty result set, fetch the count and store it in $dataArray
if ($fetch_activity_count) {
    $fetch_activity_count_row    = $fetch_activity_count->fetch_assoc();
    $dataArray['activity_count'] = $fetch_activity_count_row['activity_count'];
} else { // If query returned an empty result set, output an error message and stop execution
    die("Error fetching activity count");
}

// Select count of active blogs from 'blogs' table
$fetch_blog_count = $obj->selectData(
    "count(blog_id) as blog_count",
    "blogs",
    "where status != 0"
);

// If query returned a non-empty result set, fetch the count and store it in $dataArray
if ($fetch_blog_count) {
    $fetch_blog_count_row    = $fetch_blog_count->fetch_assoc();
    $dataArray['blog_count'] = $fetch_blog_count_row['blog_count'];
} else { // If query returned an empty result set, output an error message and stop execution
    die("Error fetching blog count");
}

// Select count of active packages 
$fetch_total_package_count = $obj->selectData(
    "count(package_id) as total_package",
    "packages",
    "where status != 0"
);

// If query returned a non-empty result set, fetch the count and store it in $dataArray
if ($fetch_total_package_count) {
    $fetch_total_package_count_row    = $fetch_total_package_count->fetch_assoc();
    $dataArray['total_package'] = $fetch_total_package_count_row['total_package'];
} else { // If query returned an empty result set, output an error message and stop execution
    die("Error fetching blog count");
}

// Encode the $dataArray as JSON object and output it to the client
echo json_encode($dataArray);
