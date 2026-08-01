<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
$obj       = new Query();
$dataArray = [];

$filesDir = realpath(__DIR__ . '/../files/destinations');
$fetchDestinations = $obj->selectData("destination_id,destination_name,created,icon,card_image", "destinations", "where status != 0 order by destination_id desc");
if (mysqli_num_rows($fetchDestinations) > 0) {
    $m = 0;
    while ($data_row = mysqli_fetch_array($fetchDestinations)) {
        $icon = $data_row['icon'] ?? '';
        $cardImage = $data_row['card_image'] ?? '';
        $iconPath = $filesDir && $icon ? $filesDir . DIRECTORY_SEPARATOR . $icon : '';
        $thumbnail = ($iconPath && is_file($iconPath)) ? $icon : $cardImage;

        $dataArray[$m]['destination_id']   = $data_row['destination_id'];
        $dataArray[$m]['destination_name'] = $data_row['destination_name'];
        $dataArray[$m]['createdDate'] = date('d-M-y',strtotime($data_row['created']));
        $dataArray[$m]['createdTime'] = date('h:i a',strtotime($data_row['created']));
        $dataArray[$m]['icon'] = $icon;
        $dataArray[$m]['thumbnail'] = $thumbnail;
        $m++;
    }
}
echo json_encode($dataArray);
