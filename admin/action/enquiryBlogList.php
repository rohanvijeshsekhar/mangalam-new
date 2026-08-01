<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
$obj       = new Query();
$dataArray = [];

$fetch_enq = $obj->selectData("id,name,phone,email,destination_id", "enquiry_blog", "where status != 0 order by id desc");
if (mysqli_num_rows($fetch_enq) > 0) {
    $m = 0;
    while ($data_row = mysqli_fetch_array($fetch_enq)) {
        $destination_id   = (int) ($data_row['destination_id'] ?? 0);
        $destination_name = 'Other Location';
        if ($destination_id > 0) {
            $fetch_destination_name = $obj->selectData("destination_name", "destinations", "where destination_id = $destination_id");
            $destination_name_row   = mysqli_fetch_array($fetch_destination_name);
            if (is_array($destination_name_row)) {
                $destination_name = $destination_name_row['destination_name'] ?? null;
            }
        }
        $dataArray[$m]['name']             = $data_row['name'];
        $dataArray[$m]['phone']            = $data_row['phone'];
        $dataArray[$m]['email']            = $data_row['email'];
        $dataArray[$m]['id']               = $data_row['id'];
        $dataArray[$m]['destination_name'] = $destination_name;
        $m++;
    }
}
echo json_encode($dataArray);
