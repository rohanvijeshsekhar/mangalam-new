<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
header('Content-Type: application/json; charset=utf-8');

$obj     = new Query();
$respose = [];
$allowedExts  = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
$allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$maxSize      = 5 * 1024 * 1024; // 5MB

if (!isset($_POST['title'], $_POST['date'], $_POST['meta'], $_POST['description'])) {
    echo json_encode([['status' => 0, 'msg' => 'Missing required fields']]);
    exit;
}

$slug_url = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $_POST['title'])));

if (!isset($_FILES['image']['name']) || !is_array($_FILES['image']['name'])) {
    echo json_encode([['status' => 0, 'msg' => 'image not seleted']]);
    exit;
}

$validUploads = [];
for ($i = 0; $i < count($_FILES['image']['name']); $i++) {
    if ($_FILES['image']['error'][$i] !== UPLOAD_ERR_OK) {
        continue;
    }
    $tmp  = $_FILES['image']['tmp_name'][$i];
    $name = $_FILES['image']['name'][$i];
    if (!is_uploaded_file($tmp)) {
        continue;
    }

    $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
    if (!in_array($ext, $allowedExts, true)) {
        echo json_encode([['status' => 0, 'msg' => 'Only JPG, PNG, GIF, and WEBP images are allowed']]);
        exit;
    }

    if ($_FILES['image']['size'][$i] > $maxSize) {
        echo json_encode([['status' => 0, 'msg' => 'Each image must be 5MB or less']]);
        exit;
    }

    $mime = mime_content_type($tmp);
    $imgInfo = @getimagesize($tmp);
    if (!in_array($mime, $allowedMimes, true) || $imgInfo === false) {
        echo json_encode([['status' => 0, 'msg' => 'Invalid image file']]);
        exit;
    }

    // Force extension from real image type (never trust client filename alone)
    $extMap = [
        IMAGETYPE_JPEG => 'jpg',
        IMAGETYPE_PNG  => 'png',
        IMAGETYPE_GIF  => 'gif',
        IMAGETYPE_WEBP => 'webp',
    ];
    $ext = $extMap[$imgInfo[2]] ?? $ext;

    $validUploads[] = [
        'tmp' => $tmp,
        'ext' => $ext,
    ];
}

if (count($validUploads) === 0) {
    echo json_encode([['status' => 0, 'msg' => 'image not seleted']]);
    exit;
}

$info = [
    'title'       => $_POST['title'],
    'date'        => $_POST['date'],
    'meta'        => $_POST['meta'],
    'description' => $_POST['description'],
    'slug_url'    => $slug_url,
];
$insertBlog = $obj->insertData("blogs", $info);

if (!$insertBlog) {
    echo json_encode([['status' => 0, 'msg' => 'Technical issue contact developers']]);
    exit;
}

$sqlBlogId = $obj->selectData("blog_id", "blogs", "where status != 0 order by blog_id desc limit 1");
$blogIdRow = mysqli_fetch_array($sqlBlogId);
$blogId    = $blogIdRow['blog_id'];

foreach ($validUploads as $upload) {
    $randImageName = genRandomString() . '.' . $upload['ext'];
    $path          = "../files/blog/" . $randImageName;
    $obj->insertData("blog_images", ['blog_id' => $blogId, 'file_name' => $randImageName]);
    compress($upload['tmp'], $path, 90);
}

echo json_encode([['status' => 1, 'msg' => 'blog created successfully']]);
exit;

function compress($source, $destination, $quality)
{
    $info = @getimagesize($source);
    if ($info === false) {
        return false;
    }
    $imageTypes = [
        'image/jpeg' => 'imagecreatefromjpeg',
        'image/gif'  => 'imagecreatefromgif',
        'image/png'  => 'imagecreatefrompng',
        'image/webp' => 'imagecreatefromwebp',
    ];
    if (!isset($imageTypes[$info['mime']])) {
        return false;
    }
    $image = @$imageTypes[$info['mime']]($source);
    if (!$image) {
        return false;
    }
    imagejpeg($image, $destination, $quality);
    imagedestroy($image);
    return $destination;
}

function genRandomString($length = 10)
{
    $characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWZYZ";
    $string     = "id";
    for ($p = 0; $p < $length; $p++) {
        $string .= $characters[random_int(0, strlen($characters) - 1)];
    }
    return strtolower($string);
}
