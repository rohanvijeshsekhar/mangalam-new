<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
header('Content-Type: application/json; charset=utf-8');

$obj = new Query();
$response = [];

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['id'])) {
    $id = $data['id'];
    $info = ['status' => 0];
    $delete = $obj->updateData("posters", $info, "WHERE id = " . mysqli_real_escape_string($obj->con, $id));
    
    if ($delete) {
        $response[] = ['status' => 1, 'msg' => 'Poster deleted successfully'];
    } else {
        $response[] = ['status' => 0, 'msg' => 'Error while deleting poster'];
    }
} else {
    $response[] = ['status' => 0, 'msg' => 'Missing poster ID'];
}

echo json_encode($response);
exit;
?>
