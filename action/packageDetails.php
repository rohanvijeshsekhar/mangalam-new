<?php
// Show all PHP errors for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../_class/query.php';
// include __DIR__ . '/converter.php'; // not needed anymore

function getPackageInfo($slug_url)
{
    $obj       = new Query();
    $dataArray = [];

    /* -------------------------- fetch package details ------------------------- */
    /* -------------------------- fetch package details ------------------------- */
    $sqlPackageDetails = $obj->selectData(
        "package_id,title,duration,hotel_type,description,no_of_activites,cancellation,transportation,amount,meta,destination_id,card_image,category,fixed_departure_date",
        "packages",
        "where slug_url= '$slug_url' and status != 0"
    );

    if (mysqli_num_rows($sqlPackageDetails) > 0) {
        $packageData = mysqli_fetch_assoc($sqlPackageDetails);
        $package_id  = $packageData['package_id'];

        $displayAmount = round((float)$packageData['amount'], 2);

        $dataArray[0] = [
            'title'          => $packageData['title'],
            'duration'       => $packageData['duration'],
            'hotel_type'     => $packageData['hotel_type'],
            'description'    => $packageData['description'],
            'no_of_activites'=> $packageData['no_of_activites'],
            'cancellation'   => $packageData['cancellation'],
            'transportation' => $packageData['transportation'],
            'amount'         => $displayAmount,
            'meta'           => $packageData['meta'],
            'destination_id' => $packageData['destination_id'],
            'package_id'     => $packageData['package_id'],
            'cardImage'      => $packageData['card_image'],
            'category'       => $packageData['category'],
            'fixed_date'     => $packageData['fixed_departure_date'],
        ];

        /* ------------------------- fetching package images ------------------------ */
        $packageImages = $obj->selectData("image_name", "package_images", "where package_id = $package_id and status != 0");
        if (mysqli_num_rows($packageImages) > 0) {
            while ($row = mysqli_fetch_array($packageImages)) {
                $dataArray[0]['images'][]['image_name'] = $row['image_name'];
            }
        }

        /* ----------------------- fetching package highlights ---------------------- */
        $packageHighlights = $obj->selectData("highlights", "package_highlights", "where package_id = $package_id and status != 0");
        if (mysqli_num_rows($packageHighlights) > 0) {
            while ($row = mysqli_fetch_array($packageHighlights)) {
                $dataArray[0]['highlights'][]['highlights'] = $row['highlights'];
            }
        }

        /* ------------------------ fetching package includes ----------------------- */
        $packageIncludes = $obj->selectData("includes", "package_include", "where package_id = $package_id and status != 0");
        if (mysqli_num_rows($packageIncludes) > 0) {
            while ($row = mysqli_fetch_array($packageIncludes)) {
                $dataArray[0]['includes'][]['includes'] = $row['includes'];
            }
        }

        /* ------------------------ fetching package excludes ----------------------- */
        $packageExcludes = $obj->selectData("excludes", "package_exclude", "where package_id = $package_id and status != 0");
        if (mysqli_num_rows($packageExcludes) > 0) {
            while ($row = mysqli_fetch_array($packageExcludes)) {
                $dataArray[0]['excludes'][]['excludes'] = $row['excludes'];
            }
        }

        /* ----------------------- fetching package itinearys ----------------------- */
        $packageItinearys = $obj->selectData("title,description,image", "package_itineary", "where package_id = $package_id and status != 0");
        if (mysqli_num_rows($packageItinearys) > 0) {
            while ($row = mysqli_fetch_array($packageItinearys)) {
                $dataArray[0]['itinearys'][] = [
                    'title'       => $row['title'],
                    'description' => $row['description'],
                    'image'       => $row['image'],
                ];
            }
        }

        /* ----------------------- fetching package thinks to know ------------------ */
        $packageThinks = $obj->selectData("data", "thinks_to_know", "where package_id = $package_id and status != 0");
        if (mysqli_num_rows($packageThinks) > 0) {
            while ($row = mysqli_fetch_array($packageThinks)) {
                $dataArray[0]['thinks_to_know'][]['data'] = $row['data'];
            }
        }

        /* ----------------------- fetching package FAQ ---------------------------- */
        $packageFaq = $obj->selectData("question,answer", "faq_package", "where package_id = $package_id and status != 0");
        if (mysqli_num_rows($packageFaq) > 0) {
            while ($row = mysqli_fetch_array($packageFaq)) {
                $dataArray[0]['faq'][] = [
                    'question' => $row['question'],
                    'answer'   => $row['answer'],
                ];
            }
        }
    }

    return json_encode($dataArray);
}
