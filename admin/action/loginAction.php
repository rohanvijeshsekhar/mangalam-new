<?php
session_start();
require_once '../../_class/query.php';
header('Content-Type: application/json; charset=utf-8');

$obj = new query();
$data = json_decode(file_get_contents('php://input'), true);

if (!is_array($data) || empty($data['username']) || empty($data['password'])) {
    echo 0;
    exit;
}

if (!$obj->con) {
    echo 0;
    exit;
}

$username = trim((string) $data['username']);
$passwordPlain = (string) $data['password'];

// Keep MD5 to match existing stored passwords; escape to block SQL injection
$usernameEsc = mysqli_real_escape_string($obj->con, $username);
$passwordEsc = mysqli_real_escape_string($obj->con, md5($passwordPlain));

$checkLoginData = $obj->selectData(
    "login_id,role",
    "login",
    "WHERE username = '$usernameEsc' AND password = '$passwordEsc' AND role = 'admin' LIMIT 1"
);

if ($checkLoginData && mysqli_num_rows($checkLoginData) > 0) {
    $loginDataRow = mysqli_fetch_array($checkLoginData);
    session_regenerate_id(true);
    $_SESSION['loginId']   = (int) $loginDataRow['login_id'];
    $_SESSION['loginRole'] = $loginDataRow['role'];
    echo 1;
} else {
    echo 0;
}
