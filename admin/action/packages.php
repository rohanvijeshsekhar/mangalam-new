<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
$obj       = new Query();
$dataArray = [];

$fetchPackages = $obj->selectData("package_id,title,created", "packages", "where status != 0 order by package_id desc");
if (mysqli_num_rows($fetchPackages) > 0) {
    $m = 0;
    while ($data_row = mysqli_fetch_array($fetchPackages)) {
        $dataArray[$m]['package_id']   = $data_row['package_id'];
        $dataArray[$m]['package_title'] = $data_row['title'];
        $dataArray[$m]['createdDate'] = date('d-M-y',strtotime($data_row['created']));
        $dataArray[$m]['createdTime'] = date('h:i a',strtotime($data_row['created']));
        $m++;
    }
}
echo json_encode($dataArray);
