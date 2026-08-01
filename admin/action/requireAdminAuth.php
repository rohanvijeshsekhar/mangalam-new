<?php
/**
 * Require an authenticated admin session for admin/action endpoints.
 * Include this at the top of every protected admin API script.
 */
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

if (
    empty($_SESSION['loginId']) ||
    empty($_SESSION['loginRole']) ||
    $_SESSION['loginRole'] !== 'admin'
) {
    http_response_code(401);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        ['status' => 0, 'msg' => 'Unauthorized. Please log in again.', 'info' => 'false']
    ]);
    exit;
}
