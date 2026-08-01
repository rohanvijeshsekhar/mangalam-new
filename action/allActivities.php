<?php
require_once __DIR__ . '/../_class/query.php';

function allActivities()
{
    $searchData = null;
    $filter     = null;

    if (isset($_GET['val'])) {
        $searchData = $_GET['val'];
    }

    if (isset($_GET['filter'])) {
        $filter = $_GET['filter'];
    }

    $obj       = new Query();
    $dataArray = [];
    $where1    = "";
    if ($searchData != null && $searchData != '') {
        $where1 .= "and title LIKE '%$searchData%' ";
    }
    if ($filter != null && $filter != 0) {
        $where1 .= " and destination_id = $filter";
    }

    $fetchDestinations = $obj->selectData("activity_id,title,destination_id,featured,slug_url,card_image,validity,display_amount", "activities", "where status != 0 $where1 order by featured desc,activity_id desc");
    if ($fetchDestinations && safe_mysqli_num_rows($fetchDestinations) > 0) {
        $m = 0;
        while ($data_row = safe_mysqli_fetch_array($fetchDestinations)) {
            $destination_id = $data_row['destination_id'];
            $activity_id    = $data_row['activity_id'];
            
            $fetchDestinationName = $obj->selectData("destination_name", "destinations", "where destination_id = $destination_id");
            $destination_name_row = safe_mysqli_fetch_array($fetchDestinationName);
            
            $dataArray[$m]['activity_id'] = $data_row['activity_id'];
            $dataArray[$m]['validity']    = $data_row['validity'];
            $dataArray[$m]['title']       = $data_row['title'];
            $dataArray[$m]['image']       = $data_row['card_image'];
            $dataArray[$m]['featured']    = $data_row['featured'];
            $dataArray[$m]['destination'] = $destination_name_row ? $destination_name_row['destination_name'] : 'Unknown';
            $dataArray[$m]['slug_url']    = $data_row['slug_url'];
            $dataArray[$m]['amount']      = round($data_row['display_amount']);
            $dataArray[$m]['filtered']    = ($filter != null && $filter != "") ? 1 : 0;

            $m++;
        }
    }
    return json_encode($dataArray);
}
