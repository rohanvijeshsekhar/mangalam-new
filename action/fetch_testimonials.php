<?php
require_once __DIR__ . '/../_class/query.php';
$obj       = new Query();
$dataArray = [];

$fetch_testimonials = $obj->selectData("id,name,role,image,description", "testimonials", "where status != 0");
if ($fetch_testimonials && safe_mysqli_num_rows($fetch_testimonials) > 0) {
    while ($data_row = safe_mysqli_fetch_array($fetch_testimonials)) {
        $dataArray[] = [
            'id'          => $data_row['id'] ?? '',
            'name'        => $data_row['name'] ?? '',
            'role'        => $data_row['role'] ?? '',
            'image'       => $data_row['image'] ?? '',
            'description' => $data_row['description'] ?? '',
        ];
    }
}
echo json_encode($dataArray);
