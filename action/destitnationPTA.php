<?php
require_once './_class/query.php';


function destinationDetails($type, $slug)
{
    $obj       = new Query();
    $dataArray = [];
    



    /* ---------- type 1 = package, type 2 = tickets, type 3 = activity --------- */
    /* -------------------------- fetch destination id -------------------------- */
    $sqlDestinationId                  = $obj->selectData("destination_id,destination_name,inner_image,discription,meta", "destinations", "where slug_url = '$slug' and status != 0");
    $destinationIdRow                  = mysqli_fetch_array($sqlDestinationId);
    
    // Check if destination exists
    if (!$destinationIdRow) {
        return json_encode([]);
    }
    
    $destinationId                     = $destinationIdRow['destination_id'];
    $dataArray[0]['destination_name']  = $destinationIdRow['destination_name'];
    $dataArray[0]['destination_image'] = $destinationIdRow['inner_image'];
    $dataArray[0]['description']       = $destinationIdRow['discription'];
    $dataArray[0]['meta']       = $destinationIdRow['meta'];
    if ($type == 1) {
        /* --------------------------- fetch package data --------------------------- */
        $packages = $obj->selectData("package_id,title,duration,description,amount,slug_url,card_image", "packages", "where destination_id = $destinationId and status != 0");
        if (mysqli_num_rows($packages) > 0) {
            $i = 0;
            while ($packageRow = mysqli_fetch_array($packages)) {
                $package_id                                  = $packageRow['package_id'];
                $dataArray[0]['packages'][$i]['package_id']  = $packageRow['package_id'];
                $dataArray[0]['packages'][$i]['title']       = $packageRow['title'];
                $dataArray[0]['packages'][$i]['duration']    = $packageRow['duration'];
                $dataArray[0]['packages'][$i]['description'] = $packageRow['description'];
                $dataArray[0]['packages'][$i]['amount']      = round($packageRow['amount']);
                $dataArray[0]['packages'][$i]['slug_url']    = $packageRow['slug_url'];
                $dataArray[0]['packages'][$i]['image']       = $packageRow['card_image'];
                $i++;
            }
        }
    } else if ($type == 2) {
        /* --------------------------- fetch ticket data --------------------------- */
        $tickets = $obj->selectData("ticket_id,title,duration,description,display_amount,slug_url,card_image,validity", "tickets", "where destination_id = $destinationId and status != 0");
        if (mysqli_num_rows($tickets) > 0) {
            $i = 0;
            while ($ticketRow = mysqli_fetch_array($tickets)) {
                $ticket_id                                  = $ticketRow['ticket_id'];
                $dataArray[0]['tickets'][$i]['ticket_id']   = $ticketRow['ticket_id'];
                $dataArray[0]['tickets'][$i]['title']       = $ticketRow['title'];
                $dataArray[0]['tickets'][$i]['validity']    = $ticketRow['validity'];
                $dataArray[0]['tickets'][$i]['duration']    = $ticketRow['duration'];
                $dataArray[0]['tickets'][$i]['description'] = $ticketRow['description'];
                $dataArray[0]['tickets'][$i]['amount']      = round($ticketRow['display_amount']);
                $dataArray[0]['tickets'][$i]['slug_url']    = $ticketRow['slug_url'];
                $dataArray[0]['tickets'][$i]['image']       = $ticketRow['card_image'];
                $i++;
            }
        }
    } else {
        /* --------------------------- fetch activity data --------------------------- */
        $activities = $obj->selectData("activity_id,title,duration,description,display_amount,slug_url,card_image,validity", "activities", "where destination_id = $destinationId and status != 0");
        if (mysqli_num_rows($activities) > 0) {
            $i = 0;
            while ($activitiesRow = mysqli_fetch_array($activities)) {
                $activity_id                                 = $activitiesRow['activity_id'];
                $dataArray[0]['activity'][$i]['activity_id'] = $activitiesRow['activity_id'];
                $dataArray[0]['activity'][$i]['title']       = $activitiesRow['title'];
                $dataArray[0]['activity'][$i]['validity']    = $activitiesRow['validity'];
                $dataArray[0]['activity'][$i]['duration']    = $activitiesRow['duration'];
                $dataArray[0]['activity'][$i]['description'] = $activitiesRow['description'];
                $dataArray[0]['activity'][$i]['amount']      = round($activitiesRow['display_amount']);
                $dataArray[0]['activity'][$i]['slug_url']    = $activitiesRow['slug_url'];
                $dataArray[0]['activity'][$i]['image']       = $activitiesRow['card_image'];
                $i++;
            }
        }
    }
    return json_encode($dataArray);
}
