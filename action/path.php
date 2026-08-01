<?php
// Shared site base paths (HTTPS aware & dynamic domain resolution)
$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';

$base = $scheme . '://' . $host . '/';

if (!defined('ROOT')) {
    define('ROOT', dirname(__FILE__) . '/');
}
if (!defined('BASE_URL')) {
    define('BASE_URL', $base);
}
if (!defined('UPLOAD_DIR')) {
    define('UPLOAD_DIR', $base . 'admin/files/');
}
