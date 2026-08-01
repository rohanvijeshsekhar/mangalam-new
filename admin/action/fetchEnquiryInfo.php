<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
$obj       = new Query();
$dataArray = [];
$id        = $_GET['id'];

$sql = $obj->selectData("*", "enquiry", "where enquiry_id = $id");
if (mysqli_num_rows($sql) > 0) {
    while ($dataRow = mysqli_fetch_array($sql)) {
        $enq_id = $dataRow['enquiry_id'];
        /* ---------------------- fetching all enquiry age data --------------------- */
        $sqlAge = $obj->selectData("age", "enquiry_age", "where enquiry_id = $enq_id and status != 0");
        if (mysqli_num_rows($sqlAge) > 0) {
            while ($ageRow = mysqli_fetch_array($sqlAge)) {

            }
        }
        /* ------------------------------ fetch places ------------------------------ */
        $sqlPlace = $obj->selectData("place_id", "enquiry_places", "where enquiry_id = $enq_id and status != 0");
        if (mysqli_num_rows($sqlPlace) > 0) {
            while ($placeRow = mysqli_fetch_array($sqlPlace)) {
                
            }
        }
    }
}
