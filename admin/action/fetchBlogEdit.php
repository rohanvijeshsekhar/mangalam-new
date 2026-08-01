<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
$obj       = new Query();
$dataArray = [];
$id        = intval($_GET['id'] ?? 0);

/* ------------------------ fetch blog data for edit ------------------------ */
$fetchData = $obj->selectData("title,description,date,meta", "blogs", "where blog_id = $id and status != 0");
if (mysqli_num_rows($fetchData) > 0) {
    $data_row                    = mysqli_fetch_array($fetchData);
    $dataArray[0]['title']       = $data_row['title'];
    $dataArray[0]['description'] = $data_row['description'];
    $dataArray[0]['meta']        = $data_row['meta'];
    $dataArray[0]['date']        = $data_row['date'];
    $dataArray[0]['images']      = [];

    $fetchImages = $obj->selectData("file_name", "blog_images", "where blog_id = $id and status != 0");
    if ($fetchImages && mysqli_num_rows($fetchImages) > 0) {
        $g = 0;
        while ($imageRow = mysqli_fetch_assoc($fetchImages)) {
            if (!empty($imageRow['file_name'])) {
                $dataArray[0]['images'][$g] = $imageRow['file_name'];
                $g++;
            }
        }
    }
}
echo json_encode(utf8ize($dataArray));

function utf8ize($d)
{
    if (is_array($d)) {
        foreach ($d as $k => $v) {
            $d[$k] = utf8ize($v);
        }
    } else if (is_string($d)) {
        return utf8_encode($d);
    }
    return $d;
}
