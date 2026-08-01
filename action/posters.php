<?php
require_once __DIR__ . '/../_class/query.php';

function fetchActivePosters() {
    $obj = new Query();
    $posters = [];
    $result = $obj->selectData("*", "posters", "WHERE status != 0 ORDER BY id DESC");
    if ($result && safe_mysqli_num_rows($result) > 0) {
        while ($row = safe_mysqli_fetch_assoc($result)) {
            $posters[] = $row;
        }
    }
    return $posters;
}
?>
