<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';

$obj      = new Query();
$response = [];

$ticketId = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
if (!$ticketId) {
    echo json_encode([['status' => 0, 'msg' => 'Valid Ticket ID is required']]);
    exit;
}

$slug_url = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $_POST['title'])));
$path     = "../files/tickets/";

$infoTicket = [
    'title'            => $_POST['title'] ?? '',
    'short_title'      => $_POST['short_title'] ?? '',
    'destination_id'   => $_POST['destination'] ?? '',
    'duration'         => $_POST['duration'] ?? '',
    'hotel_type'       => $_POST['hotel_type'] ?? '',
    'description'      => $_POST['description'] ?? '',
    'no_of_activities' => $_POST['activities'] ?? '',
    'cancellation'     => $_POST['cancellation'] ?? '',
    'transportation'   => $_POST['transportation'] ?? '',
    'adult_msg'        => $_POST['adult_msg'] ?? '',
    'children_msg'     => $_POST['children_msg'] ?? '',
    'discount_amount'  => $_POST['discount_amount'] ?? '',
    'required_age'     => $_POST['required_age'] ?? '',
    'validity'         => $_POST['validity'] ?? '',
    'display_amount'   => $_POST['display_amount'] ?? '',
    'child_amount'     => $_POST['children_amount'] ?? '',
    'featured'         => $_POST['featured'] ?? 0,
    'meta'             => $_POST['meta'] ?? '',
    'slug_url'         => $slug_url,
];

$allowedImageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
if (isset($_FILES['card_image']) && is_uploaded_file($_FILES['card_image']['tmp_name'])) {
    $cardExt = strtolower(pathinfo($_FILES['card_image']['name'], PATHINFO_EXTENSION));
    if (in_array($cardExt, $allowedImageExts, true) && @getimagesize($_FILES['card_image']['tmp_name'])) {
        $randCardImageName = genRandomString() . time() . '.' . $cardExt;
        $infoTicket['card_image'] = $randCardImageName;
    }
}

$updateTicket = $obj->updateData("tickets", $infoTicket, "WHERE ticket_id = $ticketId");

if ($updateTicket) {

    if (isset($_FILES['card_image']) && is_uploaded_file($_FILES['card_image']['tmp_name'])) {
        compress($_FILES['card_image']['tmp_name'], $path . $randCardImageName, 90);
    }

    $infoDelete = ['status' => 0];

    // Handle ticket images
    if (isset($_FILES['images'])) {
        $obj->updateData("ticket_images", $infoDelete, "WHERE ticket_id = $ticketId");
        foreach ($_FILES['images']['name'] as $i => $name) {
            if ($name) {
                $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
                if (!in_array($ext, $allowedImageExts, true) || !@getimagesize($_FILES['images']['tmp_name'][$i])) {
                    continue;
                }
                $randImageName = genRandomString() . time() . '.' . $ext;
                $obj->insertData("ticket_images", ['ticket_id' => $ticketId, 'image_names' => $randImageName]);
                compress($_FILES['images']['tmp_name'][$i], $path . $randImageName, 90);
            }
        }
    }

    // Handle highlights, includes, excludes, thinks_to_know, and FAQ
    $obj->updateData("ticket_highlights", $infoDelete, "WHERE ticket_id = $ticketId");
    foreach (json_decode($_POST['highlights'] ?? '[]') as $item) {
        if (!empty($item)) {
            $obj->insertData("ticket_highlights", ['ticket_id' => $ticketId, 'highlights' => $item]);
        }
    }

    $obj->updateData("ticket_includes", $infoDelete, "WHERE ticket_id = $ticketId");
    foreach (json_decode($_POST['includes'] ?? '[]') as $item) {
        if (!empty($item)) {
            $obj->insertData("ticket_includes", ['ticket_id' => $ticketId, 'includes' => $item]);
        }
    }

    $obj->updateData("ticket_excludes", $infoDelete, "WHERE ticket_id = $ticketId");
    foreach (json_decode($_POST['excludes'] ?? '[]') as $item) {
        if (!empty($item)) {
            $obj->insertData("ticket_excludes", ['ticket_id' => $ticketId, 'excludes' => $item]);
        }
    }

    $obj->updateData("ticket_thinks_to_know", $infoDelete, "WHERE ticket_id = $ticketId");
    foreach (json_decode($_POST['thinks_to_know'] ?? '[]') as $item) {
        if (!empty($item)) {
            $obj->insertData("ticket_thinks_to_know", ['ticket_id' => $ticketId, 'data' => $item]);
        }
    }

    $obj->updateData("faq_ticket", $infoDelete, "WHERE ticket_id = $ticketId");
    foreach (json_decode($_POST['faq'] ?? '[]') as $item) {
        if (!empty($item->question)) {
            $obj->insertData("faq_ticket", [
                'ticket_id' => $ticketId,
                'question'  => $item->question,
                'answer'    => $item->answer
            ]);
        }
    }

    $response[] = ['status' => 1, 'msg' => 'Ticket updated successfully'];
} else {
    $response[] = ['status' => 0, 'msg' => 'Technical Issue. Contact Developers'];
}

echo json_encode($response);

// Image compression function
function compress($source, $destination, $quality)
{
    $info = @getimagesize($source);
    if (!$info) return false;

    switch ($info['mime']) {
        case 'image/jpeg':
            $image = imagecreatefromjpeg($source);
            break;
        case 'image/gif':
            $image = imagecreatefromgif($source);
            break;
        case 'image/png':
            $image = imagecreatefrompng($source);
            break;
        case 'image/webp':
            $image = imagecreatefromwebp($source);
            break;
        default:
            return false;
    }

    imagejpeg($image, $destination, $quality);
    imagedestroy($image);
    return $destination;
}

// Random string generator
function genRandomString($length = 10)
{
    return strtolower('id' . bin2hex(random_bytes($length / 2)));
}
