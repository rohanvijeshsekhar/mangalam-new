<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
header('Content-Type: application/json; charset=utf-8');
$obj       = new Query();
$dataArray = [];
$id        = $_GET['id'];

$fetchPackages = $obj->selectData(
    "id,name,email,phone,adults_count,children_count,date,package_id,notes",
    "enquiry_package",
    "WHERE id = $id AND status != 0"
);
if (mysqli_num_rows($fetchPackages) > 0) {
    $data_row = mysqli_fetch_array($fetchPackages);
    $enq_package_id = $data_row['id'];
    $packageId      = (int) ($data_row['package_id'] ?? 0);

    $rawDate = $data_row['date'];
    $formattedDate = '';
    if (!empty($rawDate)) {
        $dateObj = DateTime::createFromFormat('Y-m-d H:i:s', $rawDate);
        if (!$dateObj) {
            $dateObj = DateTime::createFromFormat('Y-m-d', $rawDate);
        }
        if ($dateObj) {
            $formattedDate = $dateObj->format('d M Y');
        } else {
            $formattedDate = $rawDate;
        }
    }

    $packageName = null;
    if ($packageId > 0) {
        $fetch_package_name = $obj->selectData("title", "packages", "where package_id = $packageId and status != 0");
        $package_name_row = mysqli_fetch_array($fetch_package_name);
        if (is_array($package_name_row)) {
            $packageName = $package_name_row['title'] ?? null;
        }
    }

    $dataArray[0]['id']             = $data_row['id'];
    $dataArray[0]['name']           = $data_row['name'];
    $dataArray[0]['email']          = $data_row['email'];
    $dataArray[0]['phone']          = $data_row['phone'];
    $dataArray[0]['adult_count']    = $data_row['adults_count'];
    $dataArray[0]['children_count'] = $data_row['children_count'];
    $dataArray[0]['date']           = $formattedDate;
    $dataArray[0]['package_name'] = $packageName;
    $dataArray[0]['notes']          = trim((string) ($data_row['notes'] ?? ''));

    $fetch_package_age = $obj->selectData("age", "enquiry_packge_age", "WHERE enquiry_package_id = $enq_package_id AND status != 0");
    if (mysqli_num_rows($fetch_package_age) > 0) {
        $i = 0;
        while ($data_package_age_row = mysqli_fetch_array($fetch_package_age)) {
            $dataArray[0]['age'][$i]['age'] = $data_package_age_row['age'];
            $i++;
        }
    }
}
echo json_encode($dataArray);
