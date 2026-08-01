<?php
require_once __DIR__ . '/requireAdminAuth.php';
ob_start();
require_once '../../_class/query.php';
ob_end_clean();
header('Content-Type: application/json; charset=utf-8');

$obj       = new Query();
$dataArray = [];

$fetch_enq = $obj->selectData(
    "id,name,phone,email,date,package_id,notes",
    "enquiry_package",
    "where status != 0 order by id desc"
);
if (mysqli_num_rows($fetch_enq) > 0) {
    $m = 0;
    while ($data_row = mysqli_fetch_array($fetch_enq)) {
        $packageId   = (int) ($data_row['package_id'] ?? 0);
        $packageName = null;
        if ($packageId > 0) {
            $fetch_package_name = $obj->selectData("title", "packages", "where package_id = $packageId and status != 0");
            $package_name_row = mysqli_fetch_array($fetch_package_name);
            if (is_array($package_name_row)) {
                $packageName = $package_name_row['title'] ?? null;
            }
        }

        $dataArray[$m]['name']         = $data_row['name'];
        $dataArray[$m]['phone']        = $data_row['phone'];
        $dataArray[$m]['email']        = $data_row['email'];
        $dataArray[$m]['id']           = $data_row['id'];
        $dataArray[$m]['date']         = $data_row['date'];
        $dataArray[$m]['package_name'] = $packageName;
        $dataArray[$m]['notes']        = trim((string) ($data_row['notes'] ?? ''));
        $m++;
    }
}
echo json_encode($dataArray);
