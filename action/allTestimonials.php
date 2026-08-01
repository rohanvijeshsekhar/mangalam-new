<?php
include_once __DIR__ . '/../_class/query.php';

function allTestimonials()
{
    $response = [];
    $obj = new query();
    $result = $obj->selectData("*", "testimonials", "WHERE status != 0 ORDER BY id DESC");

    if ($result && safe_mysqli_num_rows($result) > 0) {
        while ($row = safe_mysqli_fetch_assoc($result)) {
            $response[] = $row;
        }
    }
    return json_encode($response);
}
?>
