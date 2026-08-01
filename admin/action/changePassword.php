<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
header('Content-Type: application/json; charset=utf-8');

$obj = new Query();

if (!$obj->con) {
    echo json_encode(['status' => 0, 'msg' => 'Database connection error.']);
    exit;
}

$loginId = (int) $_SESSION['loginId'];

if (!isset($_POST['old_password'], $_POST['new_password'])) {
    echo json_encode(['status' => 0, 'msg' => 'Missing required fields.']);
    exit;
}

$oldPasswordPlain = trim((string) $_POST['old_password']);
$newPasswordPlain = trim((string) $_POST['new_password']);

if ($newPasswordPlain === '' || strlen($newPasswordPlain) < 8) {
    echo json_encode(['status' => 0, 'msg' => 'New password must be at least 8 characters.']);
    exit;
}

$oldPassword = mysqli_real_escape_string($obj->con, md5($oldPasswordPlain));
$newPassword = mysqli_real_escape_string($obj->con, md5($newPasswordPlain));

$checkOldPass = $obj->selectData(
    "login_id",
    "login",
    "WHERE login_id = $loginId AND password = '$oldPassword' LIMIT 1"
);

if ($checkOldPass && mysqli_num_rows($checkOldPass) > 0) {
    $updateResult = $obj->updateData("login", ['password' => md5($newPasswordPlain)], "WHERE login_id = $loginId");
    if ($updateResult) {
        echo json_encode(['status' => 1, 'msg' => 'Password updated successfully.']);
    } else {
        echo json_encode(['status' => 0, 'msg' => 'Failed to update password. Please try again.']);
    }
} else {
    echo json_encode(['status' => 0, 'msg' => 'Incorrect old password.']);
}
