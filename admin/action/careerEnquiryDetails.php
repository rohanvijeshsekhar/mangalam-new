<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
header('Content-Type: application/json; charset=utf-8');

$obj       = new Query();
$dataArray = [];
$id        = (int) ($_GET['id'] ?? 0);

$fetchCareer = $obj->selectData(
    "id,name,email,phone,position,resume,cover_letter,date",
    "enquiry_career",
    "WHERE id = $id AND status != 0"
);
if (mysqli_num_rows($fetchCareer) > 0) {
    $data_row = mysqli_fetch_array($fetchCareer);

    $formattedDate = '';
    $rawDate = $data_row['date'] ?? '';
    if ($rawDate !== '') {
        $dateObj = DateTime::createFromFormat('Y-m-d H:i:s', $rawDate);
        if (!$dateObj) {
            $dateObj = DateTime::createFromFormat('Y-m-d', $rawDate);
        }
        $formattedDate = $dateObj ? $dateObj->format('d M Y, h:i A') : $rawDate;
    }

    $dataArray[0]['id']           = $data_row['id'];
    $dataArray[0]['name']         = $data_row['name'];
    $dataArray[0]['email']        = $data_row['email'];
    $dataArray[0]['phone']        = $data_row['phone'];
    $dataArray[0]['position']     = $data_row['position'];
    $dataArray[0]['resume']       = $data_row['resume'];
    $dataArray[0]['cover_letter'] = $data_row['cover_letter'];
    $dataArray[0]['date']         = $formattedDate;
}
echo json_encode($dataArray);
