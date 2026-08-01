<?php
require_once __DIR__ . '/../_class/query.php';

function activityDetails($slug_url)
{
    $dataArray = [];
    $obj = new Query();

    $slug_url = trim((string) $slug_url);
    if ($slug_url === '') {
        return json_encode($dataArray);
    }

    // Select the activity data from the database based on the slug URL
    $sqlActivityDetails = $obj->selectData(
        "activity_id,rand_id,child_amount,title,card_image,duration,hotel_type,description,cancellation,destination_id,transportation,display_amount,adult_msg,children_msg,meta,validity",
        "activities",
        "where slug_url= '$slug_url' and status != 0"
    );

    if (!$sqlActivityDetails || mysqli_num_rows($sqlActivityDetails) === 0) {
        return json_encode($dataArray);
    }

    $activityData = mysqli_fetch_array($sqlActivityDetails);
    $activity_id = $activityData['activity_id'];

    // Use actual DB amounts directly
    $displayAmount = round((float)$activityData['display_amount'], 2);
    $childAmountConvert = round((float)$activityData['child_amount'], 2);

    $dataArray[] = [
        'title'           => $activityData['title'],
        'rand_id'         => $activityData['rand_id'],
        'duration'        => $activityData['duration'],
        'validity'        => $activityData['validity'],
        'hotel_type'      => $activityData['hotel_type'],
        'description'     => $activityData['description'],
        'cancellation'    => $activityData['cancellation'],
        'transportation'  => $activityData['transportation'],
        'adult_msg'       => $activityData['adult_msg'],
        'children_msg'    => $activityData['children_msg'],
        'display_amount'  => $displayAmount,
        'destination_id'  => $activityData['destination_id'],
        'id'              => $activity_id,
        'cardImage'       => $activityData['card_image'],
        'childAmount'     => $childAmountConvert,
        'meta'            => $activityData['meta'],
    ];

    // Fetch activity images
    $activityImages = $obj->selectData("image", "activity_images", "where activity_id = $activity_id and status != 0");
    if (mysqli_num_rows($activityImages) > 0) {
        while ($row = mysqli_fetch_array($activityImages)) {
            $dataArray[0]['images'][]['image_name'] = $row['image'];
        }
    }

    // Fetch highlights
    $activityHighlights = $obj->selectData("highlights", "activity_highlights", "where activity_id = $activity_id and status != 0");
    if (mysqli_num_rows($activityHighlights) > 0) {
        while ($row = mysqli_fetch_array($activityHighlights)) {
            $dataArray[0]['highlights'][]['highlights'] = $row['highlights'];
        }
    }

    // Fetch includes
    $activityIncludes = $obj->selectData("includes", "activity_includes", "where activity_id = $activity_id and status != 0");
    if (mysqli_num_rows($activityIncludes) > 0) {
        while ($row = mysqli_fetch_array($activityIncludes)) {
            $dataArray[0]['includes'][]['includes'] = $row['includes'];
        }
    }

    // Fetch excludes
    $activityExcludes = $obj->selectData("excludes", "activity_excludes", "where activity_id = $activity_id and status != 0");
    if (mysqli_num_rows($activityExcludes) > 0) {
        while ($row = mysqli_fetch_array($activityExcludes)) {
            $dataArray[0]['excludes'][]['excludes'] = $row['excludes'];
        }
    }

    // Fetch thinks to know
    $activityThinks = $obj->selectData("data", "activity_thinks_to_know", "where activity_id = $activity_id and status != 0");
    if (mysqli_num_rows($activityThinks) > 0) {
        while ($row = mysqli_fetch_array($activityThinks)) {
            $dataArray[0]['thinks_to_know'][]['data'] = $row['data'];
        }
    }

    // Fetch FAQ
    $activityFaq = $obj->selectData("question,answer", "faq_activity", "where activity_id = $activity_id and status != 0");
    if (mysqli_num_rows($activityFaq) > 0) {
        while ($row = mysqli_fetch_array($activityFaq)) {
            $dataArray[0]['faq'][] = [
                'question' => $row['question'],
                'answer'   => $row['answer'],
            ];
        }
    }

    return json_encode($dataArray);
}
