<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
header('Content-Type: application/json; charset=utf-8');
$obj  = new Query();
$data = json_decode(file_get_contents('php://input'), true);
/* ------------------------------- destination id ------------------------------ */
$id   = $data['id'];
$info = ['status' => 0];

/* --------------------------- delete destination --------------------------- */
$delete = $obj->updateData("destinations", $info, "WHERE destination_id = $id");

/* ------------------------------ delete place ------------------------------ */
$obj->updateData("places", $info, "WHERE destination_id = $id");

/* ----------------------------- delete packages ---------------------------- */
$sqlpackageId = $obj->selectData("package_id", "packages", "WHERE status != 0 AND destination_id = $id");
if (mysqli_num_rows($sqlpackageId) > 0) {
    while ($packageIdRow = mysqli_fetch_array($sqlpackageId)) {
        $packageId = $packageIdRow['package_id'];
        /* -------------------------- delete package images ------------------------- */
        $obj->updateData("package_images", $info, "WHERE package_id = $packageId");
        /* ------------------------- delete package excludes ------------------------ */
        $obj->updateData("package_exclude", $info, "WHERE package_id = $packageId");
        /* ------------------------- delete package includes ------------------------ */
        $obj->updateData("package_include", $info, "WHERE package_id = $packageId");
        /* ---------------------- delete package thinks to know --------------------- */
        $obj->updateData("thinks_to_know", $info, "WHERE package_id = $packageId");
        /* ------------------------ delete package itinearys ------------------------ */
        $obj->updateData("package_itineary", $info, "WHERE package_id = $packageId");
        /* ------------------------ delete package highlights ----------------------- */
        $obj->updateData("package_highlights", $info, "WHERE package_id = $packageId");
    }
}
$obj->updateData("packages", $info, "WHERE destination_id = $id");

/* ----------------------------- delete activities ---------------------------- */
$sqlActivityId = $obj->selectData("activity_id", "activities", "WHERE status != 0 AND destination_id = $id");
if (mysqli_num_rows($sqlActivityId) > 0) {
    while ($activityIdRow = mysqli_fetch_array($sqlActivityId)) {
        $activityId = $activityIdRow['activity_id'];
        /* -------------------------- delete activity images ------------------------- */
        $obj->updateData("activity_images", $info, "WHERE activity_id = $activityId");
        /* ------------------------- delete activity excludes ------------------------ */
        $obj->updateData("activity_excludes", $info, "WHERE activity_id = $activityId");
        /* ------------------------- delete activity includes ------------------------ */
        $obj->updateData("activity_includes", $info, "WHERE activity_id = $activityId");
        /* ---------------------- delete activity thinks to know --------------------- */
        $obj->updateData("activity_thinks_to_know", $info, "WHERE activity_id = $activityId");
        /* ------------------------ delete activity highlights ----------------------- */
        $obj->updateData("activity_highlights", $info, "WHERE activity_id = $activityId");
    }
}
$obj->updateData("activities", $info, "WHERE destination_id = $id");

/* ----------------------------- delete tickets ---------------------------- */
$sqlTicketId = $obj->selectData("ticket_id", "tickets", "WHERE status != 0 AND destination_id = $id");
if (mysqli_num_rows($sqlTicketId) > 0) {
    while ($ticketIdRow = mysqli_fetch_array($sqlTicketId)) {
        $ticketId = $ticketIdRow['ticket_id'];
        /* -------------------------- delete ticket images ------------------------- */
        $obj->updateData("ticket_images", $info, "WHERE ticket_id = $ticketId");
        /* ------------------------- delete ticket excludes ------------------------ */
        $obj->updateData("ticket_excludes", $info, "WHERE ticket_id = $ticketId");
        /* ------------------------- delete ticket includes ------------------------ */
        $obj->updateData("ticket_includes", $info, "WHERE ticket_id = $ticketId");
        /* ---------------------- delete ticket thinks to know --------------------- */
        $obj->updateData("ticket_thinks_to_know", $info, "WHERE ticket_id = $ticketId");
        /* ------------------------ delete ticket highlights ----------------------- */
        $obj->updateData("ticket_highlights", $info, "WHERE ticket_id = $ticketId");
    }

}
$obj->updateData("tickets", $info, "WHERE destination_id = $id");

if ($delete) {
    echo 1;
} else {
    echo 0;
}
