<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
$obj       = new Query();
$dataArray = [];
$id        = $_GET['id'];

$fetchPackageData = $obj->selectData("destination_id,title,duration,hotel_type,description,no_of_activites,cancellation,transportation,amount,meta,category,fixed_departure_date,card_image", "packages", "where package_id = $id and status != 0");
if (mysqli_num_rows($fetchPackageData) > 0) {
    $i                                = 0;
    $packageRow                       = mysqli_fetch_array($fetchPackageData);
    $dataArray[$i]['destination']     = $packageRow['destination_id'];
    $dataArray[$i]['title']           = $packageRow['title'];
    $dataArray[$i]['duration']        = $packageRow['duration'];
    $dataArray[$i]['hotel_type']      = $packageRow['hotel_type'];
    $dataArray[$i]['description']     = $packageRow['description'];
    $dataArray[$i]['no_of_activites'] = $packageRow['no_of_activites'];
    $dataArray[$i]['cancellation']    = $packageRow['cancellation'];
    $dataArray[$i]['transportation']  = $packageRow['transportation'];
    $dataArray[$i]['amount']          = $packageRow['amount'];
    $dataArray[$i]['meta']            = $packageRow['meta'];
    $dataArray[$i]['category']        = $packageRow['category'];
    $dataArray[$i]['fixed_departure_date'] = $packageRow['fixed_departure_date'];
    $dataArray[$i]['card_image']      = $packageRow['card_image'] ?? '';

    /* ----------------------- fetch package gallery images ----------------------- */
    $fetchImages = $obj->selectData("image_name", "package_images", "WHERE package_id = $id AND status != 0");
    $dataArray[$i]['images'] = [];
    if ($fetchImages && mysqli_num_rows($fetchImages) > 0) {
        $g = 0;
        while ($imageRow = mysqli_fetch_assoc($fetchImages)) {
            if (!empty($imageRow['image_name'])) {
                $dataArray[$i]['images'][$g] = $imageRow['image_name'];
                $g++;
            }
        }
    }

    /* ----------------------- fetch all package includes ----------------------- */
    $fetchIncludes = $obj->selectData("includes", "package_include", "WHERE package_id = $id AND status != 0");
    if (mysqli_num_rows($fetchIncludes) > 0) {
        $o = 0;
        while ($includesRows = mysqli_fetch_assoc($fetchIncludes)) {
            if ($includesRows['includes'] != '') {
                $dataArray[$i]['includes'][$o]['include'] = $includesRows['includes'];
                $o++;
            }
        }
    }

    /* ----------------------- fetch all package excludes ----------------------- */
    $fetchExcludes = $obj->selectData("excludes", "package_exclude", "WHERE package_id = $id AND status != 0");
    if (mysqli_num_rows($fetchExcludes) > 0) {
        $n = 0;
        while ($excludesRow = mysqli_fetch_array($fetchExcludes)) {
            if (isset($excludesRow['excludes'])) {
                $dataArray[$i]['excludes'][$n]['exclude'] = $excludesRow['excludes'];
            }
            $n++;
        }
    }

    /* ----------------------- fetch all package highlights ----------------------- */
    $fetchHighlights = $obj->selectData("highlights", "package_highlights", "WHERE package_id = $id AND status != 0");
    if (mysqli_num_rows($fetchHighlights) > 0) {
        $q = 0;
        while ($highlightsRow = mysqli_fetch_array($fetchHighlights)) {
            $dataArray[$i]['highlights'][$q]['highlight'] = $highlightsRow['highlights'];
            $q++;
        }
    }

    /* ------------------------ fetch tickets thinks to know ------------------------ */
    $fetchThinksToKnow = $obj->selectData("id,data", "thinks_to_know", "where package_id = $id and status != 0");
    if (mysqli_num_rows($fetchThinksToKnow) > 0) {
        $k = 0;
        while ($thinksRow = mysqli_fetch_array($fetchThinksToKnow)) {
            $dataArray[0]['thinks_to_know'][$k]['data'] = $thinksRow['data'];
            $dataArray[0]['thinks_to_know'][$k]['id']   = $thinksRow['id'];
            $k++;
        }
    }

    /* ----------------------- fetch all package itineary ----------------------- */
    $fetchItineary = $obj->selectData("itineary_id,title,description,image", "package_itineary", "where package_id = $id and status != 0");
    if (mysqli_num_rows($fetchItineary) > 0) {
        $p = 0;
        while ($itinearyRow = mysqli_fetch_array($fetchItineary)) {
            $dataArray[$i]['itinearies'][$p]['id']  = $itinearyRow['itineary_id'];
            $dataArray[$i]['itinearies'][$p]['title']   = $itinearyRow['title'];
            $dataArray[$i]['itinearies'][$p]['description'] = $itinearyRow['description'];
            $dataArray[$i]['itinearies'][$p]['image'] = $itinearyRow['image'];
            $p++;
        }
    }

    $fetchFaq = $obj->selectData("question,answer", "faq_package", "where package_id = $id and status != 0");
    if ($fetchFaq->num_rows > 0) {
        $v = 0;
        while ($faqRow = $fetchFaq->fetch_assoc()) {
            $dataArray[$i]['faq'][$v]['question'] = $faqRow['question'];
            $dataArray[$i]['faq'][$v]['answer']   = $faqRow['answer'];
            $v++;
        }
    }
}
echo json_encode($dataArray);
