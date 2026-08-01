<?php
require_once __DIR__ . '/../_class/query.php';

function allDestinations($searchData = '')
{
    $obj       = new Query();
    $dataArray = [];
    $where1    = " ";
    if ($searchData != '') {
        $where1 = "and destination_name LIKE '%$searchData%' ";
    }

    $fetchDestinations = $obj->selectData("destination_id,destination_name,card_image,featured,slug_url,meta,discription", "destinations", "WHERE status != 0 $where1 ORDER BY
        CASE WHEN destination_name = 'Dubai' THEN 0 ELSE 1 END,
        featured DESC,
        destination_id DESC");

    if ($fetchDestinations && safe_mysqli_num_rows($fetchDestinations) > 0) {
        $m = 0;
        while ($data_row = safe_mysqli_fetch_array($fetchDestinations)) {
            $dataArray[$m]['destination_id'] = $data_row['destination_id'];
            $dataArray[$m]['title']          = $data_row['destination_name'];
            $dataArray[$m]['image']          = $data_row['card_image'];
            $dataArray[$m]['featured']       = $data_row['featured'];
            $dataArray[$m]['slug_url']       = $data_row['slug_url'];
            $dataArray[$m]['meta']           = $data_row['meta'];
            $dataArray[$m]['description']    = $data_row['discription'];
            $m++;
        }
    }
    return json_encode($dataArray);
}
