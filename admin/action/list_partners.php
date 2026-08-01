<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
$obj       = new Query();
$dataArray = [];

$fetch_all_partners = $obj->selectData("partners_id,logo", "partners", "where status != 0");
if (mysqli_num_rows($fetch_all_partners) > 0) {
    $i = 0;
    while ($data_row = mysqli_fetch_array($fetch_all_partners)) {
        $dataArray[$i]['file_name'] = $data_row['logo'];
        $dataArray[$i]['id']        = $data_row['partners_id'];
        $i++;
    }
}
echo json_encode($dataArray);
