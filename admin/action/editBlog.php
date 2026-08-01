<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
$obj = new Query();
$response = [];

function sanitizeInput($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

function compress($source, $destination, $quality) {
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

function genRandomString($length = 10) {
    $characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWZYZ";
    $string = "id";
    for ($p = 0; $p < $length; $p++) {
        $string .= $characters[random_int(0, strlen($characters) - 1)];
    }
    return strtolower($string);
}

$slug_url = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', sanitizeInput($_POST['title']))));
$id = intval($_POST['id']);

$info = [
    'title'       => sanitizeInput($_POST['title']),
    'date'        => sanitizeInput($_POST['date']),
    'meta'        => sanitizeInput($_POST['meta']),
    'description' => sanitizeInput($_POST['description']),
    'slug_url'    => $slug_url,
];

$updateBlog = $obj->updateData("blogs", $info, "WHERE blog_id = $id");

if ($updateBlog) {
    if (isset($_FILES['image']['name']) && is_array($_FILES['image']['name'])) {
        $obj->updateData("blog_images", ['status' => 0], "WHERE blog_id = $id");
        foreach ($_FILES['image']['name'] as $i => $imageName) {
            if (!empty($imageName) && is_uploaded_file($_FILES['image']['tmp_name'][$i])) {
                $imageExt = strtolower(pathinfo($imageName, PATHINFO_EXTENSION));
                if (!in_array($imageExt, ['jpg', 'jpeg', 'png', 'gif', 'webp'], true)) {
                    continue;
                }
                if (!@getimagesize($_FILES['image']['tmp_name'][$i])) {
                    continue;
                }
                $randImageName = genRandomString() . '.' . $imageExt;
                $path = "../files/blog/" . $randImageName;
                $obj->insertData("blog_images", ['blog_id' => $id, 'file_name' => $randImageName]);
                compress($_FILES['image']['tmp_name'][$i], $path, 90);
            }
        }
    }
    $response[] = ['status' => 1, 'msg' => "Blog updated successfully"];
} else {
    $response[] = ['status' => 0, 'msg' => "Technical issue, contact developers"];
}

header('Content-Type: application/json');
echo json_encode($response);
?>
