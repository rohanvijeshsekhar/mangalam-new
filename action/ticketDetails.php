<?php

require_once __DIR__ . '/../_class/query.php';
include __DIR__ . '/converter.php';

function ticketDetails($slug_url)
{
    $obj       = new Query();
    $dataArray = [];

    /* -------------------------- fetch ticket details ------------------------- */
    $sqlTicketDetails = $obj->selectData(
        "destination_id,rand_id,child_amount,ticket_id,card_image,title,duration,hotel_type,description,no_of_activities,cancellation,transportation,display_amount,adult_msg,children_msg,meta,validity",
        "tickets",
        "where slug_url= '$slug_url' and status != 0"
    );

    if (mysqli_num_rows($sqlTicketDetails) > 0) {
        $ticketData = mysqli_fetch_array($sqlTicketDetails);
        $ticket_id  = $ticketData['ticket_id'];

        $displayAmount      = round((float)$ticketData['display_amount'], 2);
        $childAmountConvert  = round((float)$ticketData['child_amount'], 2);

        $dataArray[0] = [
            'title'           => $ticketData['title'],
            'rand_id'         => $ticketData['rand_id'],
            'duration'        => $ticketData['duration'],
            'validity'        => $ticketData['validity'],
            'hotel_type'      => $ticketData['hotel_type'],
            'description'     => $ticketData['description'],
            'no_of_activites' => $ticketData['no_of_activities'],
            'cancellation'    => $ticketData['cancellation'],
            'transportation'  => $ticketData['transportation'],
            'adult_msg'       => $ticketData['adult_msg'],
            'children_msg'    => $ticketData['children_msg'],
            'display_amount'  => $displayAmount,
            'destination_id'  => $ticketData['destination_id'],
            'id'              => $ticketData['ticket_id'],
            'cardImage'       => $ticketData['card_image'],
            'childAmount'     => $childAmountConvert,
            'meta'            => $ticketData['meta'],
        ];

        /* ------------------------- fetching ticket images ------------------------ */
        $ticketImages = $obj->selectData("image_names", "ticket_images", "where ticket_id = $ticket_id and status != 0");
        if (mysqli_num_rows($ticketImages) > 0) {
            $i = 0;
            while ($ticketImageRow = mysqli_fetch_array($ticketImages)) {
                $dataArray[0]['images'][$i]['image_name'] = $ticketImageRow['image_names'];
                $i++;
            }
        }

        /* ----------------------- fetching ticket highlights ---------------------- */
        $ticketHighlights = $obj->selectData("highlights", "ticket_highlights", "where ticket_id = $ticket_id and status != 0");
        if (mysqli_num_rows($ticketHighlights) > 0) {
            while ($ticketHighlightsRow = mysqli_fetch_array($ticketHighlights)) {
                $dataArray[0]['highlights'][]['highlights'] = $ticketHighlightsRow['highlights'];
            }
        }

        /* ------------------------ fetching ticket includes ----------------------- */
        $ticketIncudes = $obj->selectData("includes", "ticket_includes", "where ticket_id = $ticket_id and status != 0");
        if (mysqli_num_rows($ticketIncudes) > 0) {
            $q = 0;
            while ($ticketIncudesRow = mysqli_fetch_array($ticketIncudes)) {
                $dataArray[0]['includes'][$q]['includes'] = $ticketIncudesRow['includes'];
                $q++;
            }
        }

        /* ------------------------ fetching ticket excludes ----------------------- */
        $ticketExcludes = $obj->selectData("excludes", "ticket_excludes", "where ticket_id = $ticket_id and status != 0");
        if (mysqli_num_rows($ticketExcludes) > 0) {
            $t = 0;
            while ($ticketExcludesRow = mysqli_fetch_array($ticketExcludes)) {
                $dataArray[0]['excludes'][$t]['excludes'] = $ticketExcludesRow['excludes'];
                $t++;
            }
        }

        /* ----------------------- fetching ticket thinks to know ----------------------- */
        $ticketThinks = $obj->selectData("data", "ticket_thinks_to_know", "where ticket_id = $ticket_id and status != 0");
        if (mysqli_num_rows($ticketThinks) > 0) {
            $e = 0;
            while ($ticket_thinks_to_knowRow = mysqli_fetch_array($ticketThinks)) {
                $dataArray[0]['thinks_to_know'][$e]['data'] = $ticket_thinks_to_knowRow['data'];
                $e++;
            }
        }

        $ticketFaq = $obj->selectData("question,answer", "faq_ticket", "where ticket_id = $ticket_id and status != 0");
        if (mysqli_num_rows($ticketFaq) > 0) {
            while ($ticketFaqRow = mysqli_fetch_array($ticketFaq)) {
                $dataArray[0]['faq'][] = [
                    'question' => $ticketFaqRow['question'],
                    'answer'   => $ticketFaqRow['answer'],
                ];
            }
        }
    }
    return json_encode($dataArray);
}
