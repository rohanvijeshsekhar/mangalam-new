<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
header('Content-Type: application/json; charset=utf-8');

$obj       = new Query();
$dataArray = [];
$id        = (int) ($_GET['id'] ?? 0);

$fetchContact = $obj->selectData(
    "id,name,email,phone,subject,message,date",
    "enquiry_contact",
    "WHERE id = $id AND status != 0"
);
if (mysqli_num_rows($fetchContact) > 0) {
    $data_row = mysqli_fetch_array($fetchContact);

    $formattedDate = '';
    $rawDate = $data_row['date'] ?? '';
    if ($rawDate !== '') {
        $dateObj = DateTime::createFromFormat('Y-m-d H:i:s', $rawDate);
        if (!$dateObj) {
            $dateObj = DateTime::createFromFormat('Y-m-d', $rawDate);
        }
        $formattedDate = $dateObj ? $dateObj->format('d M Y, h:i A') : $rawDate;
    }

    $dataArray[0]['id']      = $data_row['id'];
    $dataArray[0]['name']    = $data_row['name'];
    $dataArray[0]['email']   = $data_row['email'];
    $dataArray[0]['phone']   = $data_row['phone'];
    $dataArray[0]['subject'] = $data_row['subject'];
    $dataArray[0]['message'] = $data_row['message'];
    $dataArray[0]['date']    = $formattedDate;
}
echo json_encode($dataArray);
