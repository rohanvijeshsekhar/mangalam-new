<?php
function getAllPartners($obj)
{
    $dataArray          = [];
    $fetch_testimonials = $obj->selectData("partners_id,logo", "partners", "where status != 0");
    if ($fetch_testimonials && safe_mysqli_num_rows($fetch_testimonials) > 0) {
        while ($data_row = safe_mysqli_fetch_array($fetch_testimonials)) {
            $dataArray[] = [
                'partners_id' => $data_row['partners_id'],
                'logo'        => $data_row['logo'],
            ];
        }
    }
    return $dataArray;
}
