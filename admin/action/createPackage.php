<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
$obj               = new Query();
$respose           = [];
$slug_url          = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $_POST['title'])));
$path              = "../files/packages/";
$allowedImageExts  = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
$card_image_name   = $_FILES['image_card']['name'];
$cardImageExt      = strtolower(pathinfo($card_image_name, PATHINFO_EXTENSION));
if (!in_array($cardImageExt, $allowedImageExts, true) || !@getimagesize($_FILES['image_card']['tmp_name'])) {
    echo json_encode([['status' => 0, 'msg' => 'Invalid card image']]);
    exit;
}
$randCardImageName = genRandomString() . time() . '.' . $cardImageExt;

$infoPackage       = [
    'title'           => $_POST['title'],
    'destination_id'  => $_POST['destination'],
    'duration'        => $_POST['duration'],
    'hotel_type'      => $_POST['hotel_type'],
    'description'     => $_POST['description'],
    'no_of_activites' => $_POST['activities'],
    'cancellation'    => $_POST['cancellation'],
    'transportation'  => $_POST['transportation'],
    'amount'          => $_POST['amount'],
    'meta'            => $_POST['meta'],
    'card_image'      => $randCardImageName,
    'slug_url'        => $slug_url,
    'category'        => isset($_POST['category']) ? $_POST['category'] : 'curated_itineraries',
    'fixed_departure_date' => (isset($_POST['fixed_departure_date']) && !empty($_POST['fixed_departure_date'])) ? $_POST['fixed_departure_date'] : null,
];
$createPackage = $obj->insertData("packages", $infoPackage);

if ($createPackage) {

    compress($_FILES['image_card']['tmp_name'], $path . $randCardImageName, 90);

    $fetchPackageId = $obj->selectData("package_id", "packages", "where status != 0 order by package_id desc limit 1");
    $packageIdRow   = $fetchPackageId->fetch_assoc();
    $packageId      = $packageIdRow['package_id'];

    for ($i = 0; $i < sizeof($_FILES['images']['name']); $i++) {
        $ImageName     = $_FILES['images']['name'][$i];
        $ImageExt      = strtolower(pathinfo($ImageName, PATHINFO_EXTENSION));
        if (!in_array($ImageExt, $allowedImageExts, true) || !@getimagesize($_FILES['images']['tmp_name'][$i])) {
            continue;
        }
        $randImageName = genRandomString() . time() . '.' . $ImageExt;
        $infoImages = ['package_id' => $packageId, 'image_name' => $randImageName];
        $insertImages = $obj->insertData("package_images", $infoImages);
        compress($_FILES['images']['tmp_name'][$i], $path . $randImageName, 90);
    }

    $highlights = json_decode($_POST['highlights']);
    foreach ($highlights as $highlight) {
        $highlight = trim($highlight);
        if (!empty($highlight)) {
            $infoHighlight = [
                'package_id' => $packageId,
                'highlights' => $highlight,
            ];
            $insertHighlight = $obj->insertData("package_highlights", $infoHighlight);
        }
    }

    $includes = json_decode($_POST['includes']);
    foreach ($includes as $include) {
        $include = trim($include);
        if (!empty($include)) {
            $infoInclude = [
                'package_id' => $packageId,
                'includes' => $include,
            ];
            $insertInclude = $obj->insertData("package_include", $infoInclude);
        }
    }

    $excludes = json_decode($_POST['excludes']);
    foreach ($excludes as $exclude) {
        $exclude = trim($exclude);
        if (!empty($exclude)) {
            $infoExcludes = [
                'package_id' => $packageId,
                'excludes' => $exclude,
            ];
            $insertExcludes = $obj->insertData("package_exclude", $infoExcludes);
        }
    }

    $thinks_to_know = json_decode($_POST['thinks_to_know'], true);
    foreach ($thinks_to_know as $item) {
        if (!empty($item)) {
            $infoThinks_to_know = [
                'package_id' => $packageId,
                'data' => $item,
            ];
            $insertThinks_to_know = $obj->insertData("thinks_to_know", $infoThinks_to_know);
        }
    }

    for ($i = 0; $i < sizeof($_POST['itineary_title']); $i++) {
        $upload_status = false;
        if (!empty($_FILES['itineary_images']['name'][$i])) {
            $image_name = $_FILES['itineary_images']['name'][$i];
            $tmp_path = $_FILES['itineary_images']['tmp_name'][$i];
            $file_size = $_FILES['itineary_images']['size'][$i];
            $itineary_upload_path = "../files/itineary/";
            $extension_image = strtolower(pathinfo($image_name, PATHINFO_EXTENSION));
            if (!in_array($extension_image, ['jpg', 'jpeg', 'png', 'gif', 'webp'], true) || !@getimagesize($tmp_path)) {
                continue;
            }
            $random_name = md5(uniqid(rand(), true)) . '.' . $extension_image;
            $itineraryInfo = [
                'package_id'  => $packageId,
                'title' => $_POST['itineary_title'][$i],
                'description' => $_POST['itineary_description'][$i],
                'image' => $random_name,
            ];

            if (move_uploaded_file($tmp_path, $itineary_upload_path . $random_name)) {
                $obj->insertData("package_itineary", $itineraryInfo);
            } else {
                $respose[0]['status'] = 0;
                $respose[0]['msg']    = "Error: Faild to upload image !";
            }
        } else {
            $itineraryInfo = [
                'package_id'  => $packageId,
                'title' => $_POST['itineary_title'][$i],
                'description' => $_POST['itineary_description'][$i],
                'image' => '',
            ];
            $obj->insertData("package_itineary", $itineraryInfo);
        }
    }

    $faq = json_decode($_POST['faq']);
    foreach ($faq as $item) {
        if (!empty($item->question)) {
            $faqInfo = [
                'package_id' => $packageId,
                'question'   => $item->question,
                'answer'     => $item->answer,
            ];
            $obj->insertData("faq_package", $faqInfo);
        }
    }

    $respose[0]['status'] = 1;
    $respose[0]['msg']    = "Package created successfully";
} else {
    $respose[0]['status'] = 0;
    $respose[0]['msg']    = "Technical Issue Contact Developers";
}

echo json_encode($respose);

function compress($source, $destination, $quality)
{
    $info = getimagesize($source);
    if ($info['mime'] == 'image/jpeg') {
        $image = imagecreatefromjpeg($source);
    } elseif ($info['mime'] == 'image/gif') {
        $image = imagecreatefromgif($source);
    } elseif ($info['mime'] == 'image/png') {
        $image = imagecreatefrompng($source);
    } elseif ($info['mime'] == 'image/webp') {
        $image = imagecreatefromwebp($source);
    } else {
        echo "Unsupported image type: " . $info['mime'] . "\n";
    }
    $error = error_get_last();
    if ($error !== null) {
        echo "Error: " . $error['message'] . "\n";
    }
    imagejpeg($image, $destination, $quality);
    return $destination;
}
function genRandomString()
{
    $length             = 10;
    $characters         = "0123456789ABCDEFGHIJKLMNOPQRSTUVWZYZ";
    $real_string_length = strlen($characters);
    $string             = "id";
    for ($p = 0; $p < $length; $p++) {
        $string .= $characters[mt_rand(0, $real_string_length - 1)];
    }
    return strtolower($string);
}
