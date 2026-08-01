<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
$obj       = new Query();
$dataArray = [];

$testimonialsData = $obj->selectData("id,name,role,description,date_time", "testimonials", "where status != 0 order by id desc");
if (mysqli_num_rows($testimonialsData) > 0) {
    $m = 0;
    while ($data_row = mysqli_fetch_array($testimonialsData)) {
        $dataArray[$m]['id']          = $data_row['id'];
        $dataArray[$m]['name']        = $data_row['name'];
        $dataArray[$m]['role']        = $data_row['role'];
        $dataArray[$m]['description'] = $data_row['description'];
        $dataArray[$m]['date']        = date('d-M-y', strtotime($data_row['date_time']));
        $m++;
    }
}
echo json_encode($dataArray);
