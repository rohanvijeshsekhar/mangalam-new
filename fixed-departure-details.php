<?php
/**
 * Legacy mock page — redirect to real package details or the fixed departures list.
 */
$slug = '';
if (!empty($_GET['slug']) && is_string($_GET['slug'])) {
    $slug = trim($_GET['slug']);
} elseif (!empty($_GET['id']) && is_string($_GET['id'])) {
    $slug = trim($_GET['id']);
}

if ($slug !== '') {
    header('Location: package-details.php?slug=' . rawurlencode($slug), true, 301);
    exit;
}

header('Location: fixed-departures.php', true, 301);
exit;
