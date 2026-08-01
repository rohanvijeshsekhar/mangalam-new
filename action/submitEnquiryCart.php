<?php
require_once '../_class/query.php';
require './mailer.php';
include './converter.php';
$obj = new query();
header('Content-Type: application/json; charset=utf-8');
$data = json_decode(file_get_contents('php://input'), true);

$name  = $data[0]['name'];
$phone = $data[0]['phone'];
$email = $data[0]['email'];
$currencyType = $_GET['currency'];

(float)$total_discount_amount = (float)$total_cheldren_amount = (float)$total_display_amount = (float)$discount_amount = (float)$total_ticket_display_amount = (float)$total_ticket_discount_amount = (float)$total_ticket_cheldren_amount = (float)$total_activity_display_amount = (float)$total_activity_discount_amount = (float)$total_activity_cheldren_amount = 0;

$infoCart  = [
  'name'  => $name,
  'email' => $email,
  'phone' => $phone,
];

// Set the session expiration time to one day (in seconds)
ini_set('session.gc_maxlifetime', 86400);
session_start();
// Destroy the session if it has expired
if ((time() - $_SESSION['last_change'] > 86400 && isset($_SESSION['last_change']))) {
  unset($_SESSION['current_activity_cart_value']);
  unset($_SESSION['current_ticket_cart_value']);
  unset($_SESSION['current_type']);
}

$insertCartEnq = $obj->insertData("enquiry_cart", $infoCart);
if ($insertCartEnq) {
  $fetchCartEnqId = $obj->selectData("id", "enquiry_cart", "where status != 0 order by id desc limit 1");
  if (mysqli_num_rows($fetchCartEnqId) > 0) {
    $cartEnqIdRow = mysqli_fetch_array($fetchCartEnqId);
    $cartEnqId    = $cartEnqIdRow['id'];
    foreach ($data as $enq_data) {
      $enq_type       = $enq_data['type'];
      $adults_count   = $enq_data['adults'];
      $cheldren_count = $enq_data['children'];
      $data_id        = explode('_', $enq_data['id'])[0];
      $ageArray       = $enq_data['age'];

      if ($enq_type == 'Ticket') {
        /* --------------------------- insert enquiry -------------------------- */
        $infoEnq = [
          'date'            => $enq_data['date'],
          'adult_count'     => $adults_count,
          'children_count'  => $cheldren_count,
          'enquiry_cart_id' => $cartEnqId,
          'ticket_id'       => $data_id,
        ];
        $insertEnq = $obj->insertData("enquiry_tickets", $infoEnq);
        /* ---------------------------- fetch enquiry_id ---------------------------- */
        $sql_fetch_enq_id = $obj->selectData("id", "enquiry_tickets", "where status != 0 order by id desc limit 1");
        $enq_id_row       = mysqli_fetch_array($sql_fetch_enq_id);
        $enq_id           = $enq_id_row['id'];
        /* ------------------------- inserting cheldren age ------------------------- */
        for ($i = 0; $i < sizeof($ageArray); $i++) {
          $info_age = [
            'enquiry_ticket_id' => $enq_id,
            'age'               => $ageArray[$i],
          ];
          $sql_age = $obj->insertData("enquiry_ticket_age", $info_age);
        }
      } else {
        /* --------------------------- insert enquiry -------------------------- */
        $infoEnq = [
          'date'            => $enq_data['date'],
          'adult_count'     => $adults_count,
          'children_count'  => $cheldren_count,
          'enquiry_cart_id' => $cartEnqId,
          'activity_id'     => $data_id,
        ];
        $insertEnq = $obj->insertData("enquiry_activities", $infoEnq);
        /* ---------------------------- fetch enquiry_id ---------------------------- */
        $sql_fetch_enq_id = $obj->selectData("id", "enquiry_activities", "where status != 0 order by id desc limit 1");
        $enq_id_row       = mysqli_fetch_array($sql_fetch_enq_id);
        $enq_id           = $enq_id_row['id'];
        /* ------------------------- inserting cheldren age ------------------------- */
        for ($i = 0; $i < sizeof($ageArray); $i++) {
          $info_age = [
            'enquiry_activity_id' => $enq_id,
            'age'                 => $ageArray[$i],
          ];
          $sql_age = $obj->insertData("enquiry_activity_age", $info_age);
        }
      }
    }
  }
}
$template1 = '
<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <!--[if gte mso 9]>
<xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
</xml>
<![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <!--[if !mso]><!-->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--<![endif]-->
  <title></title>
  <style type="text/css">
    @media only screen and (min-width: 520px) {
      .u-row {
        width: 500px !important;
      }
      .u-row .u-col {
        vertical-align: top;
      }
      .u-row .u-col-50 {
        width: 250px !important;
      }
      .u-row .u-col-100 {
        width: 500px !important;
      }
    }
    @media (max-width: 520px) {
      .u-row-container {
        max-width: 100% !important;
        padding-left: 0px !important;
        padding-right: 0px !important;
      }
      .u-row .u-col {
        min-width: 320px !important;
        max-width: 100% !important;
        display: block !important;
      }
      .u-row {
        width: 100% !important;
      }
      .u-col {
        width: 100% !important;
      }
      .u-col>div {
        margin: 0 auto;
      }
    }
    body {
      margin: 0;
      padding: 0;
    }
    table,
    tr,
    td {
      vertical-align: top;
      border-collapse: collapse;
    }
    p {
      margin: 0;
    }
    .ie-container table,
    .mso-container table {
      table-layout: fixed;
    }
    * {
      line-height: inherit;
    }
    a[x-apple-data-detectors="true"] {
      color: inherit !important;
      text-decoration: none !important;
    }
    table,
    td {
      color: #000000;
    }
    @media (max-width: 480px) {
      #u_content_image_1 .v-src-width {
        width: auto !important;
      }
      #u_content_image_1 .v-src-max-width {
        max-width: 54% !important;
      }
      #u_content_text_1 .v-container-padding-padding {
        padding: 0px 20px 20px !important;
      }
      #u_content_text_1 .v-font-size {
        font-size: 22px !important;
      }
      #u_content_heading_6 .v-container-padding-padding {
        padding: 28px !important;
      }
    }
  </style>
</head>
<body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000">
  <!--[if IE]><div class="ie-container"><![endif]-->
  <!--[if mso]><div class="mso-container"><![endif]-->
  <table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%" cellpadding="0" cellspacing="0">
    <tbody>
      <tr style="vertical-align: top">
        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ffffff;"><![endif]-->
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color: #ffffff;width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                  <div style="background-color: #ffffff;height: 100%;width: 100% !important;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                      <!--<![endif]-->
                      <table id="u_content_image_1" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td style="padding-right: 0px;padding-left: 0px;" align="center">
                                    <img align="center" border="0" src="http://mangalamtravel.com/assets/images/logo/logo-color.png" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 308px;"
                                      width="308" class="v-src-width v-src-max-width" />
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <!--[if (!mso)&(!IE)]><!-->
                    </div>
                    <!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->
                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 0px;font-family:arial,helvetica,sans-serif;" align="left">
                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td style="padding-right: 0px;padding-left: 0px;" align="center">
                                    <img align="center" border="0" src="http://mangalamtravel.com/assets/images/logo-color.png-trip.svg" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 52%;max-width: 249.6px;"
                                      width="249.6" class="v-src-width v-src-max-width" />
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <!--[if (!mso)&(!IE)]><!-->
                    </div>
                    <!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->
                      <table id="u_content_text_1" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:0px 40px 20px;font-family:arial,helvetica,sans-serif;" align="left">
                              <div class="v-font-size" style="font-family: helvetica,sans-serif; font-size: 25px; font-weight: 400; line-height: 150%; text-align: center; word-wrap: break-word;">
                                <p style="line-height: 150%;"><span style="color: #000000; line-height: 37.5px;">Congratulation</span></p>
                                <p style="line-height: 150%;"><span style="color: #000000; line-height: 37.5px;">You saved <span style="color: #2dc26b; line-height: 37.5px;"><strong>' . $currencyType . ' {{save_amount}}</strong></span></span>
                                </p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <!--[if (!mso)&(!IE)]><!-->
                    </div>
                    <!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>';
foreach ($data as $enq_data) {
  $enq_type       = $enq_data['type'];
  $data_id        = explode('_', $enq_data['id'])[0];
  $adults_count   = (float) $enq_data['adults'];
  $cheldren_count = (float) $enq_data['children'];

  if ($enq_type == 'Ticket') {
    /* ------------- fetch ticket discount amount and actual amount ------------- */
    $fetch_ticket_data = $obj->selectData("discount_amount,child_amount,display_amount", "tickets", "where ticket_id = $data_id and status != 0");
    if (mysqli_num_rows($fetch_ticket_data) > 0) {
      $ticket_data_row       = mysqli_fetch_array($fetch_ticket_data);

      (float) $discount_amount = $ticket_data_row['discount_amount'];
      (float) $cheldren_amount = $ticket_data_row['child_amount'];
      (float) $display_amount  = $ticket_data_row['display_amount'];

      $discount_amount_convert = $cheldren_amount_convert = $display_amount_convert = null;

      // Check if the cache file exists and if it was last modified more than 24 hours ago
      if (!isset($_SESSION['current_activity_cart_value']) || empty($_SESSION['current_activity_cart_value']) && !isset($_SESSION['current_type']) || $_SESSION['current_type'] !== $currencyType) {
        $to = $currencyType;
        $from = 'AED';
        $amount = 1;

        $convertor = new CurrencyConverter($from, $to, $amount);
        $current_activity_cart_value = $convertor->convert();

        $_SESSION['current_activity_cart_value'] = $current_activity_cart_value;
        $_SESSION['current_type'] = $currencyType;
        $_SESSION['last_change'] = time();

        $discount_amount_convert = round($current_activity_cart_value * $discount_amount, 2);
        $cheldren_amount_convert = round($current_activity_cart_value * $cheldren_amount, 2);
        $display_amount_convert = round($current_activity_cart_value * $display_amount, 2);

        // total amounts
        (float) $total_ticket_discount_amount += (float) $discount_amount_convert;
        (float) $total_ticket_display_amount += ((float) $display_amount_convert * $adults_count);
        (float) $total_ticket_cheldren_amount += ((float) $cheldren_amount_convert * $cheldren_count);
      } else {

        $current_activity_cart_value = $_SESSION['current_activity_cart_value'];
        $discount_amount_convert = round($current_activity_cart_value * $discount_amount, 2);
        $cheldren_amount_convert = round($current_activity_cart_value * $cheldren_amount, 2);
        $display_amount_convert = round($current_activity_cart_value * $display_amount, 2);

        // total amounts
        (float) $total_ticket_discount_amount += (float) $discount_amount_convert;
        (float) $total_ticket_display_amount += ((float) $display_amount_convert * $adults_count);
        (float) $total_ticket_cheldren_amount += ((float) $cheldren_amount_convert * $cheldren_count);
      }

      $template1 .= '
            <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="498" style="background-color: #e7fff9;width: 498px;padding: 0px;border-top: 1px solid #CCC;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                  <div style="background-color: #e7fff9;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 1px solid #CCC;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->
                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;" align="left">
                              <h1 class="v-font-size" style="margin: 0px; line-height: 140%; text-align: left; word-wrap: break-word; font-size: 15px; "><strong>' . $enq_data['title'] . '</strong> (Ticket)</h1>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <!--[if (!mso)&(!IE)]><!-->
                    </div>
                    <!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="249" style="width: 249px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-50" style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->
                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;" align="left">
                              <div class="v-font-size" style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                <p style="line-height: 140%;">Adult (' . $adults_count . ') x ' . $currencyType . ' ' . round($display_amount_convert) . ' (Per Person)</p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <!--[if (!mso)&(!IE)]><!-->
                    </div>
                    <!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="248" style="width: 248px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-50" style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->
                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;" align="left">
                              <div class="v-font-size" style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                <p style="line-height: 140%;">Total : ' . $currencyType . ' ' . round($display_amount_convert * $adults_count) . '</p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <!--[if (!mso)&(!IE)]><!-->
                    </div>
                    <!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>';
      if ($cheldren_count != 0) {
        $template1 .= '<div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="249" style="width: 249px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-50" style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->
                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;" align="left">
                              <div class="v-font-size" style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                <p style="line-height: 140%;">Children (' . $cheldren_count . ') x ' . $currencyType . ' ' . round($cheldren_amount_convert) . ' (Per Person)</p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <!--[if (!mso)&(!IE)]><!-->
                    </div>
                    <!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="248" style="width: 248px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-50" style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->
                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;" align="left">
                              <div class="v-font-size" style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                <p style="line-height: 140%;">Total : ' . $currencyType . ' ' . round($cheldren_amount_convert * $cheldren_count) . '</p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <!--[if (!mso)&(!IE)]><!-->
                    </div>
                    <!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>';
      }
    }
  } else {

    /* ------------- fetch activity discount amount and actual amount ------------- */
    $fetch_activity_data = $obj->selectData("discount_amount,child_amount,display_amount", "activities", "where activity_id = $data_id");
    if (mysqli_num_rows($fetch_activity_data) > 0) {
      $activity_data_row = mysqli_fetch_array($fetch_activity_data);
      $discount_amount   = (float) $activity_data_row['discount_amount'];
      $cheldren_amount   = (float) $activity_data_row['child_amount'];
      $display_amount    = (float) $activity_data_row['display_amount'];

      $discount_amount_convert = $cheldren_amount_convert = $display_amount_convert = null;

      // Check if the cache file exists and if it was last modified more than 24 hours ago
      if (!isset($_SESSION['current_activity_cart_value']) || empty($_SESSION['current_activity_cart_value']) && !isset($_SESSION['current_type']) || $_SESSION['current_type'] !== $currencyType) {
        $to = $currencyType;
        $from = 'AED';
        $amount = 1;

        $convertor = new CurrencyConverter($from, $to, $amount);
        $current_activity_cart_value = $convertor->convert();

        $_SESSION['current_activity_cart_value'] = $current_activity_cart_value;
        $_SESSION['current_type'] = $currencyType;
        $_SESSION['last_change'] = time();

        $discount_amount_convert = round($current_activity_cart_value * $discount_amount, 2);
        $cheldren_amount_convert = round($current_activity_cart_value * $cheldren_amount, 2);
        $display_amount_convert = round($current_activity_cart_value * $display_amount, 2);

        // total amounts
        (float) $total_activity_discount_amount += (float) $discount_amount_convert;
        (float) $total_activity_display_amount += ((float) $display_amount_convert * $adults_count);
        (float) $total_activity_cheldren_amount += ((float) $cheldren_amount_convert * $cheldren_count);
      } else {
        $current_activity_cart_value = $_SESSION['current_activity_cart_value'];
        $discount_amount_convert = round($current_activity_cart_value * $discount_amount, 2);
        $cheldren_amount_convert = round($current_activity_cart_value * $cheldren_amount, 2);
        $display_amount_convert = round($current_activity_cart_value * $display_amount, 2);

        // total amounts
        (float) $total_activity_discount_amount += (float) $discount_amount_convert;
        (float) $total_activity_display_amount += ((float) $display_amount_convert * $adults_count);
        (float) $total_activity_cheldren_amount += ((float) $cheldren_amount_convert * $cheldren_count);
      }

      $template1 .= '
            <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="498" style="background-color: #ffe7f3;width: 498px;padding: 0px;border-top: 1px solid #CCC;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                  <div style="background-color: #ffe7f3;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 1px solid #CCC;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->
                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                              <h1 class="v-font-size" style="margin: 0px; line-height: 140%; text-align: left; word-wrap: break-word; font-size: 15px; "><strong>' . $enq_data['title'] . '</strong> (Activity)</h1>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <!--[if (!mso)&(!IE)]><!-->
                    </div>
                    <!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="249" style="width: 249px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-50" style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->
                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;" align="left">
                              <div class="v-font-size" style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                <p style="line-height: 140%;">Adult (' . $adults_count . ') x ' . $currencyType . ' ' . round($display_amount_convert) . ' (Per Person)</p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <!--[if (!mso)&(!IE)]><!-->
                    </div>
                    <!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="248" style="width: 248px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-50" style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->
                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;" align="left">
                              <div class="v-font-size" style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                <p style="line-height: 140%;">Total : ' . $currencyType . ' ' . round($display_amount_convert * $adults_count) . '</p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <!--[if (!mso)&(!IE)]><!-->
                    </div>
                    <!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>';
      if ($cheldren_count != 0) {
        $template1 .= '<div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="249" style="width: 249px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-50" style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->
                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;" align="left">
                              <div class="v-font-size" style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                <p style="line-height: 140%;">Children (' . $cheldren_count . ') x ' . $currencyType . ' ' . round($cheldren_amount_convert) . ' (Per Person)</p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <!--[if (!mso)&(!IE)]><!-->
                    </div>
                    <!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="248" style="width: 248px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-50" style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->
                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;" align="left">
                              <div class="v-font-size" style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                <p style="line-height: 140%;">Total : ' . $currencyType . ' ' . round($cheldren_amount_convert * $cheldren_count) . '</p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <!--[if (!mso)&(!IE)]><!-->
                    </div>
                    <!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>';
      }
    }
  }
}
$total_display_amount  = $total_ticket_display_amount + $total_activity_display_amount;
$total_discount_amount = $total_ticket_discount_amount + $total_activity_discount_amount;
$total_cheldren_amount = $total_ticket_cheldren_amount + $total_activity_cheldren_amount;

$subtotal              = round((float) $total_display_amount + (float) $total_cheldren_amount);
$discount_amount       = round((float) $total_discount_amount);
$spacial_amount        = round((float) $subtotal - (float) $discount_amount);

$template1 .= '<div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->
                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;" align="left">
                              <div class="v-font-size" style="font-size: 15px; line-height: 140%; text-align: right; word-wrap: break-word;">
                                <p style="line-height: 140%;">Sub Total : ' . $currencyType . ' <strong>' . $subtotal . '</strong></p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <!--[if (!mso)&(!IE)]><!-->
                    </div>
                    <!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->
                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;" align="left">
                              <div class="v-font-size" style="font-size: 16px; line-height: 140%; text-align: right; word-wrap: break-word;">
                                <p style="line-height: 140%;">Mangalam Tours Special Discount : <span style="color: #2dc26b; line-height: 22.4px;">' . $currencyType . ' <strong>' . $discount_amount . '</strong></span></p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:arial,helvetica,sans-serif;" align="left">
                              <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <tbody>
                                  <tr style="vertical-align: top">
                                    <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                      <span>&#160;</span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <!--[if (!mso)&(!IE)]><!-->
                    </div>
                    <!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->
                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;" align="left">
                              <div class="v-font-size" style="font-size: 18px; line-height: 140%; text-align: right; word-wrap: break-word;">
                                <p style="line-height: 140%;">Grand Total: ' . $currencyType . ' <strong>' . $spacial_amount . '</strong></p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <!--[if (!mso)&(!IE)]><!-->
                    </div>
                    <!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color: #ffffff;width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                  <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->
                      <table id="u_content_heading_6" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:38px;font-family:arial,helvetica,sans-serif;" align="left">
                              <h1 class="v-font-size" style="margin: 0px; color: #000000; line-height: 140%; text-align: center; word-wrap: break-word; font-size: 16px; font-weight: 400; ">For immediate assistance, <br/>  please call or WhatsApp us at <br/> <strong>+971 56 267 5889.</strong> <br /></h1>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <!--[if (!mso)&(!IE)]><!-->
                    </div>
                    <!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="250" style="width: 250px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-50" style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->
                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                              <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
                              <div align="center">
                                <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="tel:" style="height:37px; v-text-anchor:middle; width:230px;" arcsize="11%"  stroke="f" fillcolor="#e02d72"><w:anchorlock/><center style="color:#FFFFFF;font-family:arial,helvetica,sans-serif;"><![endif]-->
                                <a href="tel:+971562675889" target="_blank" class="v-button v-font-size" style="box-sizing: border-box;display: inline-block;font-family:arial,helvetica,sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF;   background: linear-gradient(to right, #f63871 0%, #ff800b 100%);border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:100%; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 14px;">
                                  <span style="display:block;padding:10px 20px;line-height:120%;"><span style="line-height: 16.8px;">CALL US</span></span>
                                </a>
                                <!--[if mso]></center></v:roundrect><![endif]-->
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <!--[if (!mso)&(!IE)]><!-->
                    </div>
                    <!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="250" style="width: 250px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-50" style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->
                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                              <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
                              <div align="center">
                                <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:37px; v-text-anchor:middle; width:230px;" arcsize="11%"  stroke="f" fillcolor="#26573b"><w:anchorlock/><center style="color:#FFFFFF;font-family:arial,helvetica,sans-serif;"><![endif]-->
                                <a href="https://api.whatsapp.com/send?phone=+971562675889&text=Hello" target="_blank" class="v-button v-font-size" style="box-sizing: border-box;display: inline-block;font-family:arial,helvetica,sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #26573b; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:100%; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 14px;">
                                  <span style="display:block;padding:10px 20px;line-height:120%;">WHATSAPP</span>
                                </a>
                                <!--[if mso]></center></v:roundrect><![endif]-->
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <!--[if (!mso)&(!IE)]><!-->
                    </div>
                    <!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        </td>
      </tr>
    </tbody>
  </table>
  <!--[if mso]></div><![endif]-->
  <!--[if IE]></div><![endif]-->
</body>
</html>
';



$templateUpdated = str_replace("{{save_amount}}", $discount_amount, $template1);
$templateAdmin   = '
<!DOCTYPE HTML
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <!--[if gte mso 9]>
<xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
</xml>
<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <title></title>
    <style type="text/css">
        @media only screen and (min-width: 520px) {
            .u-row {
                width: 500px !important;
            }
            .u-row .u-col {
                vertical-align: top;
            }
            .u-row .u-col-50 {
                width: 250px !important;
            }
            .u-row .u-col-100 {
                width: 500px !important;
            }
        }
        @media (max-width: 520px) {
            .u-row-container {
                max-width: 100% !important;
                padding-left: 0px !important;
                padding-right: 0px !important;
            }
            .u-row .u-col {
                min-width: 320px !important;
                max-width: 100% !important;
                display: block !important;
            }
            .u-row {
                width: 100% !important;
            }
            .u-col {
                width: 100% !important;
            }
            .u-col>div {
                margin: 0 auto;
            }
        }
        body {
            margin: 0;
            padding: 0;
        }
        table,
        tr,
        td {
            vertical-align: top;
            border-collapse: collapse;
        }
        p {
            margin: 0;
        }
        .ie-container table,
        .mso-container table {
            table-layout: fixed;
        }
        * {
            line-height: inherit;
        }
        a[x-apple-data-detectors="true"] {
            color: inherit !important;
            text-decoration: none !important;
        }
        table,
        td {
            color: #000000;
        }
        #u_body a {
            color: #0000ee;
            text-decoration: underline;
        }
        @media (max-width: 480px) {
            #u_content_image_1 .v-src-width {
                width: auto !important;
            }
            #u_content_image_1 .v-src-max-width {
                max-width: 54% !important;
            }
            #u_content_text_1 .v-container-padding-padding {
                padding: 0px 20px 20px !important;
            }
            #u_content_text_1 .v-font-size {
                font-size: 22px !important;
            }
            #u_content_heading_6 .v-container-padding-padding {
                padding: 11px !important;
            }
            #u_content_heading_6 .v-font-size {
                font-size: 9px !important;
            }
        }
    </style>
</head>
<body class="clean-body u_body"
    style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000">
    <!--[if IE]><div class="ie-container"><![endif]-->
    <!--[if mso]><div class="mso-container"><![endif]-->
    <table id="u_body"
        style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%"
        cellpadding="0" cellspacing="0">
        <tbody>
            <tr style="vertical-align: top">
                <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ffffff;"><![endif]-->
                    <div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row"
                            style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                            <div
                                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                                <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color: #ffffff;width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                                <div class="u-col u-col-100"
                                    style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                                    <div style="background-color: #ffffff;height: 100%;width: 100% !important;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div
                                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                                            <!--<![endif]-->
                                            <table id="u_content_image_1"
                                                style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">
                                                            <table width="100%" cellpadding="0" cellspacing="0"
                                                                border="0">
                                                                <tr>
                                                                    <td style="padding-right: 0px;padding-left: 0px;"
                                                                        align="center">
                                                                        <img align="center" border="0"
                                                                            src="http://mangalamtravel.com/assets/images/logo/logo-color.png"
                                                                            alt="" title=""
                                                                            style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 308px;"
                                                                            width="308"
                                                                            class="v-src-width v-src-max-width" />
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td><![endif]-->
                                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>
                    <div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row"
                            style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                            <div
                                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                                <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                <div class="u-col u-col-100"
                                    style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                                    <div
                                        style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div
                                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                            <!--<![endif]-->
                                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 0px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">
                                                            <table width="100%" cellpadding="0" cellspacing="0"
                                                                border="0">
                                                                <tr>
                                                                    <td style="padding-right: 0px;padding-left: 0px;"
                                                                        align="center">
                                                                        <img align="center" border="0"
                                                                            src="https://assets.unlayer.com/projects/136358/1676011222459-cbe98a5cc955d82f2bbabe45e975f452.jpeg"
                                                                            alt="" title=""
                                                                            style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 52%;max-width: 249.6px;"
                                                                            width="249.6"
                                                                            class="v-src-width v-src-max-width" />
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td><![endif]-->
                                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>
                    <div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row"
                            style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                            <div
                                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                                <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                <div class="u-col u-col-100"
                                    style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                                    <div
                                        style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div
                                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                            <!--<![endif]-->
                                            <table id="u_content_text_1" style="font-family:arial,helvetica,sans-serif;"
                                                role="presentation" cellpadding="0" cellspacing="0" width="100%"
                                                border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:0px 40px 20px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">
                                                            <div class="v-font-size"
                                                                style="font-family: helvetica,sans-serif; font-size: 23px; font-weight: 700; color: #222222; line-height: 150%; text-align: center; word-wrap: break-word;">
                                                                <p style="line-height: 150%;">Enquiry From Website</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td><![endif]-->
                                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>
                    <div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row"
                            style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                            <div
                                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                                <!--[if (mso)|(IE)]><td align="center" width="249" style="background-color: #fbeeb8;width: 249px;padding: 0px;border-top: 1px solid #CCC;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                <div class="u-col u-col-50"
                                    style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                                    <div
                                        style="background-color: #fbeeb8;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div
                                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 1px solid #CCC;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                            <!--<![endif]-->
                                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">
                                                            <div class="v-font-size"
                                                                style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                                                <p style="line-height: 140%;">Name</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td><![endif]-->
                                <!--[if (mso)|(IE)]><td align="center" width="248" style="background-color: #fbeeb8;width: 248px;padding: 0px;border-top: 1px solid #CCC;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                <div class="u-col u-col-50"
                                    style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                                    <div
                                        style="background-color: #fbeeb8;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div
                                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 1px solid #CCC;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                            <!--<![endif]-->
                                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">
                                                            <div class="v-font-size"
                                                                style="font-weight: 700; color: #070000; line-height: 140%; text-align: left; word-wrap: break-word;">
                                                                <p style="line-height: 140%;">' . $name . '</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td><![endif]-->
                                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>
                    <div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row"
                            style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                            <div
                                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                                <!--[if (mso)|(IE)]><td align="center" width="249" style="background-color: #fbeeb8;width: 249px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                <div class="u-col u-col-50"
                                    style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                                    <div
                                        style="background-color: #fbeeb8;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div
                                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                            <!--<![endif]-->
                                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">
                                                            <div class="v-font-size"
                                                                style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                                                <p style="line-height: 140%;">Email</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td><![endif]-->
                                <!--[if (mso)|(IE)]><td align="center" width="248" style="background-color: #fbeeb8;width: 248px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                <div class="u-col u-col-50"
                                    style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                                    <div
                                        style="background-color: #fbeeb8;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div
                                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                            <!--<![endif]-->
                                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">
                                                            <div class="v-font-size"
                                                                style="font-weight: 700; line-height: 140%; text-align: left; word-wrap: break-word;">
                                                                <p style="line-height: 140%;">' . $email . '</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td><![endif]-->
                                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>
                    <div class="u-row-container" style="padding: 0px 0px 20px;background-color: transparent">
                        <div class="u-row"
                            style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                            <div
                                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px 0px 20px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                                <!--[if (mso)|(IE)]><td align="center" width="249" style="background-color: #fbeeb8;width: 249px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                <div class="u-col u-col-50"
                                    style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                                    <div
                                        style="background-color: #fbeeb8;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div
                                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                            <!--<![endif]-->
                                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">
                                                            <div class="v-font-size"
                                                                style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                                                <p style="line-height: 140%;">Phone</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td><![endif]-->
                                <!--[if (mso)|(IE)]><td align="center" width="248" style="background-color: #fbeeb8;width: 248px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                <div class="u-col u-col-50"
                                    style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                                    <div
                                        style="background-color: #fbeeb8;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div
                                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                            <!--<![endif]-->
                                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">
                                                            <div class="v-font-size"
                                                                style="font-weight: 700; line-height: 140%; text-align: left; word-wrap: break-word;">
                                                                <p style="line-height: 140%;">' . $phone . '</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td><![endif]-->
                                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>';
$dest_name = "";
foreach ($data as $enq_data) {
  $enq_type             = $enq_data['type'];
  $data_id              = explode('_', $enq_data['id'])[0];
  $adults_count         = $enq_data['adults'];
  $cheldren_count       = $enq_data['children'];
  $destination_id       = $enq_data['destinationId'];
  $fetchDestinationName = $obj->selectData("destination_name", "destinations", "where destination_id = $destination_id");
  $destination_name_row = mysqli_fetch_array($fetchDestinationName);
  $destinationName      = $destination_name_row['destination_name'];
  $dest_name            = $destinationName;
  $cheldren_age         = $enq_data['age'];
  if ($enq_type == 'Ticket') {
    $templateAdmin .= '
        <div class="u-row-container" style="padding: 0px;background-color: transparent">
        <div class="u-row"
            style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
            <div
                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="498" style="background-color: #ffe7f3;width: 498px;padding: 0px;border-top: 1px solid #CCC;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-100"
                    style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                    <div
                        style="background-color: #ffe7f3;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                        <!--[if (!mso)&(!IE)]><!-->
                        <div
                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 1px solid #CCC;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                            <!--<![endif]-->
                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                    <tr>
                                        <td class="v-container-padding-padding"
                                            style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;"
                                            align="left">
                                            <h1 class="v-font-size"
                                                style="margin: 0px; line-height: 140%; text-align: left; word-wrap: break-word; font-size: 15px; ">
                                                <strong>' . $enq_data['title'] . '</strong> (Ticket)
                                            </h1>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                    </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
            </div>
        </div>
    </div>
    <div class="u-row-container" style="padding: 0px;background-color: transparent">
        <div class="u-row"
            style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
            <div
                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="249" style="width: 249px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-50"
                    style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                    <div
                        style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                        <!--[if (!mso)&(!IE)]><!-->
                        <div
                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                            <!--<![endif]-->
                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                    <tr>
                                        <td class="v-container-padding-padding"
                                            style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;"
                                            align="left">
                                            <div class="v-font-size"
                                                style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                                <p style="line-height: 140%;">Destination</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                    </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="248" style="width: 248px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-50"
                    style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                    <div
                        style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                        <!--[if (!mso)&(!IE)]><!-->
                        <div
                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                            <!--<![endif]-->
                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                    <tr>
                                        <td class="v-container-padding-padding"
                                            style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;"
                                            align="left">
                                            <div class="v-font-size"
                                                style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                                <p style="line-height: 140%;">' . $destinationName . '</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                    </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
            </div>
        </div>
    </div>
    <div class="u-row-container" style="padding: 0px;background-color: transparent">
        <div class="u-row"
            style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
            <div
                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="249" style="width: 249px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-50"
                    style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                    <div
                        style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                        <!--[if (!mso)&(!IE)]><!-->
                        <div
                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                            <!--<![endif]-->
                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                    <tr>
                                        <td class="v-container-padding-padding"
                                            style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;"
                                            align="left">
                                            <div class="v-font-size"
                                                style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                                <p style="line-height: 140%;">Date</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                    </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="248" style="width: 248px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-50"
                    style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                    <div
                        style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                        <!--[if (!mso)&(!IE)]><!-->
                        <div
                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                            <!--<![endif]-->
                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                    <tr>
                                        <td class="v-container-padding-padding"
                                            style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;"
                                            align="left">
                                            <div class="v-font-size"
                                                style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                                <p style="line-height: 140%;">' . $enq_data['date'] . '</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                    </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
            </div>
        </div>
    </div>
    <div class="u-row-container" style="padding: 0px;background-color: transparent">
        <div class="u-row"
            style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
            <div
                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="249" style="width: 249px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-50"
                    style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                    <div
                        style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                        <!--[if (!mso)&(!IE)]><!-->
                        <div
                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                            <!--<![endif]-->
                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                    <tr>
                                        <td class="v-container-padding-padding"
                                            style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;"
                                            align="left">
                                            <div class="v-font-size"
                                                style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                                <p style="line-height: 140%;">Adults</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                    </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="248" style="width: 248px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-50"
                    style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                    <div
                        style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                        <!--[if (!mso)&(!IE)]><!-->
                        <div
                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                            <!--<![endif]-->
                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                    <tr>
                                        <td class="v-container-padding-padding"
                                            style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;"
                                            align="left">
                                            <div class="v-font-size"
                                                style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                                <p style="line-height: 140%;">' . $adults_count . '</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                    </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
            </div>
        </div>
    </div>';
    if ($cheldren_count != 0) {
      $templateAdmin .= '<div class="u-row-container" style="padding: 0px;background-color: transparent">
        <div class="u-row"
            style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
            <div
                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="249" style="width: 249px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-50"
                    style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                    <div
                        style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                        <!--[if (!mso)&(!IE)]><!-->
                        <div
                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                            <!--<![endif]-->
                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                    <tr>
                                        <td class="v-container-padding-padding"
                                            style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;"
                                            align="left">
                                            <div class="v-font-size"
                                                style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                                <p style="line-height: 140%;">Children</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                    </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="248" style="width: 248px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-50"
                    style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                    <div
                        style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                        <!--[if (!mso)&(!IE)]><!-->
                        <div
                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                            <!--<![endif]-->
                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                    <tr>
                                        <td class="v-container-padding-padding"
                                            style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;"
                                            align="left">
                                            <div class="v-font-size"
                                                style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                                <p style="line-height: 140%;">' . $cheldren_count . '</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                    </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
            </div>
        </div>
    </div>
    <div class="u-row-container" style="padding: 0px 0px 20px;background-color: transparent">
        <div class="u-row"
            style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
            <div
                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px 0px 20px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="249" style="width: 249px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-50"
                    style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                    <div
                        style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                        <!--[if (!mso)&(!IE)]><!-->
                        <div
                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                            <!--<![endif]-->
                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                    <tr>
                                        <td class="v-container-padding-padding"
                                            style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;"
                                            align="left">
                                            <div class="v-font-size"
                                                style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                                <p style="line-height: 140%;">Children Age</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                    </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="248" style="width: 248px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-50"
                    style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                    <div
                        style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                        <!--[if (!mso)&(!IE)]><!-->
                        <div
                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                            <!--<![endif]-->
                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                    <tr>
                                        <td class="v-container-padding-padding"
                                            style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;"
                                            align="left">
                                            <div class="v-font-size"
                                                style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                                <p style="line-height: 140%;">';
      foreach ($cheldren_age as $age) {
        $templateAdmin .= $age . ',';
      }
      $templateAdmin .= '</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                    </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
            </div>
        </div>
    </div>';
    }
  } else {
    $templateAdmin .= '
        <div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row"
                            style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                            <div
                                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                                <!--[if (mso)|(IE)]><td align="center" width="498" style="background-color: #e7fff9;width: 498px;padding: 0px;border-top: 1px solid #CCC;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                <div class="u-col u-col-100"
                                    style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                                    <div
                                        style="background-color: #e7fff9;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div
                                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 1px solid #CCC;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                            <!--<![endif]-->
                                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">
                                                            <h1 class="v-font-size"
                                                                style="margin: 0px; line-height: 140%; text-align: left; word-wrap: break-word; font-size: 15px; ">
                                                                <strong>' . $enq_data['title'] . '</strong> (Activity)
                                                            </h1>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td><![endif]-->
                                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>
                    <div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row"
                            style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                            <div
                                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                                <!--[if (mso)|(IE)]><td align="center" width="249" style="width: 249px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                <div class="u-col u-col-50"
                                    style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                                    <div
                                        style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div
                                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                            <!--<![endif]-->
                                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">
                                                            <div class="v-font-size"
                                                                style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                                                <p style="line-height: 140%;">Destination</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td><![endif]-->
                                <!--[if (mso)|(IE)]><td align="center" width="248" style="width: 248px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                <div class="u-col u-col-50"
                                    style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                                    <div
                                        style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div
                                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                            <!--<![endif]-->
                                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">
                                                            <div class="v-font-size"
                                                                style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                                                <p style="line-height: 140%;">' . $destinationName . '</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td><![endif]-->
                                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>
                    <div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row"
                            style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                            <div
                                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                                <!--[if (mso)|(IE)]><td align="center" width="249" style="width: 249px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                <div class="u-col u-col-50"
                                    style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                                    <div
                                        style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div
                                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                            <!--<![endif]-->
                                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">
                                                            <div class="v-font-size"
                                                                style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                                                <p style="line-height: 140%;">Date</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td><![endif]-->
                                <!--[if (mso)|(IE)]><td align="center" width="248" style="width: 248px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                <div class="u-col u-col-50"
                                    style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                                    <div
                                        style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div
                                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                            <!--<![endif]-->
                                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">
                                                            <div class="v-font-size"
                                                                style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                                                <p style="line-height: 140%;">' . $enq_data['date'] . '</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td><![endif]-->
                                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>
                    <div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row"
                            style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                            <div
                                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                                <!--[if (mso)|(IE)]><td align="center" width="249" style="width: 249px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                <div class="u-col u-col-50"
                                    style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                                    <div
                                        style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div
                                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                            <!--<![endif]-->
                                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">
                                                            <div class="v-font-size"
                                                                style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                                                <p style="line-height: 140%;">Adults</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td><![endif]-->
                                <!--[if (mso)|(IE)]><td align="center" width="248" style="width: 248px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                <div class="u-col u-col-50"
                                    style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                                    <div
                                        style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div
                                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                            <!--<![endif]-->
                                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">
                                                            <div class="v-font-size"
                                                                style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                                                <p style="line-height: 140%;">' . $adults_count . '</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td><![endif]-->
                                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>';
    if ($cheldren_count != 0) {
      $templateAdmin .= '<div class="u-row-container" style="padding: 0px;background-color: transparent">
                    <div class="u-row"
                        style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                        <div
                            style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                            <!--[if (mso)|(IE)]><td align="center" width="249" style="width: 249px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                            <div class="u-col u-col-50"
                                style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                                <div
                                    style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                    <!--[if (!mso)&(!IE)]><!-->
                                    <div
                                        style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                        <!--<![endif]-->
                                        <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                            cellpadding="0" cellspacing="0" width="100%" border="0">
                                            <tbody>
                                                <tr>
                                                    <td class="v-container-padding-padding"
                                                        style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;"
                                                        align="left">
                                                        <div class="v-font-size"
                                                            style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                                            <p style="line-height: 140%;">Children</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <!--[if (!mso)&(!IE)]><!-->
                                    </div>
                                    <!--<![endif]-->
                                </div>
                            </div>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            <!--[if (mso)|(IE)]><td align="center" width="248" style="width: 248px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                            <div class="u-col u-col-50"
                                style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                                <div
                                    style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                    <!--[if (!mso)&(!IE)]><!-->
                                    <div
                                        style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                        <!--<![endif]-->
                                        <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                            cellpadding="0" cellspacing="0" width="100%" border="0">
                                            <tbody>
                                                <tr>
                                                    <td class="v-container-padding-padding"
                                                        style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;"
                                                        align="left">
                                                        <div class="v-font-size"
                                                            style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                                            <p style="line-height: 140%;">' . $cheldren_count . '</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <!--[if (!mso)&(!IE)]><!-->
                                    </div>
                                    <!--<![endif]-->
                                </div>
                            </div>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                        </div>
                    </div>
                </div>
                <div class="u-row-container" style="padding: 0px;background-color: transparent">
                    <div class="u-row"
                        style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                        <div
                            style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                            <!--[if (mso)|(IE)]><td align="center" width="249" style="width: 249px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                            <div class="u-col u-col-50"
                                style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                                <div
                                    style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                    <!--[if (!mso)&(!IE)]><!-->
                                    <div
                                        style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                        <!--<![endif]-->
                                        <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                            cellpadding="0" cellspacing="0" width="100%" border="0">
                                            <tbody>
                                                <tr>
                                                    <td class="v-container-padding-padding"
                                                        style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;"
                                                        align="left">
                                                        <div class="v-font-size"
                                                            style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                                            <p style="line-height: 140%;">Children Age</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <!--[if (!mso)&(!IE)]><!-->
                                    </div>
                                    <!--<![endif]-->
                                </div>
                            </div>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            <!--[if (mso)|(IE)]><td align="center" width="248" style="width: 248px;padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                            <div class="u-col u-col-50"
                                style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                                <div
                                    style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                    <!--[if (!mso)&(!IE)]><!-->
                                    <div
                                        style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                        <!--<![endif]-->
                                        <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                            cellpadding="0" cellspacing="0" width="100%" border="0">
                                            <tbody>
                                                <tr>
                                                    <td class="v-container-padding-padding"
                                                        style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:arial,helvetica,sans-serif;"
                                                        align="left">
                                                        <div class="v-font-size"
                                                            style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                                            <p style="line-height: 140%;">';
      foreach ($cheldren_age as $age) {
        $templateAdmin .= $age . ',';
      }
      $templateAdmin .= '</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <!--[if (!mso)&(!IE)]><!-->
                                    </div>
                                    <!--<![endif]-->
                                </div>
                            </div>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                        </div>
                    </div>
                </div>';
    }
  }
}
$templateAdmin .= '<div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row"
                            style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                            <div
                                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                                <!--[if (mso)|(IE)]><td align="center" width="250" style="width: 250px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                <div class="u-col u-col-50"
                                    style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                                    <div
                                        style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div
                                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                            <!--<![endif]-->
                                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">
                                                            <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
                                                            <div align="center">
                                                                <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="tel:+91' . $phone . '" style="height:37px; v-text-anchor:middle; width:230px;" arcsize="11%"  stroke="f" fillcolor="#e02d72"><w:anchorlock/><center style="color:#FFFFFF;font-family:arial,helvetica,sans-serif;"><![endif]-->
                                                                <a href="tel:+91' . $phone . '" target="_blank"
                                                                    class="v-button v-font-size"
                                                                    style="box-sizing: border-box;display: inline-block;font-family:arial,helvetica,sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #e02d72; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:100%; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 14px;">
                                                                    <span
                                                                        style="display:block;padding:10px 20px;line-height:120%;"><span
                                                                            style="line-height: 16.8px;">CALL
                                                                            NOW</span></span>
                                                                </a>
                                                                <!--[if mso]></center></v:roundrect><![endif]-->
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td><![endif]-->
                                <!--[if (mso)|(IE)]><td align="center" width="250" style="width: 250px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                <div class="u-col u-col-50"
                                    style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                                    <div
                                        style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div
                                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                            <!--<![endif]-->
                                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">
                                                            <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
                                                            <div align="center">
                                                                <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="mailto:' . $email . '" style="height:37px; v-text-anchor:middle; width:230px;" arcsize="11%"  stroke="f" fillcolor="#26573b"><w:anchorlock/><center style="color:#FFFFFF;font-family:arial,helvetica,sans-serif;"><![endif]-->
                                                                <a href="mailto:' . $email . '" target="_blank"
                                                                    class="v-button v-font-size"
                                                                    style="box-sizing: border-box;display: inline-block;font-family:arial,helvetica,sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #26573b; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:100%; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 14px;">
                                                                    <span
                                                                        style="display:block;padding:10px 20px;line-height:120%;">SEND
                                                                        QUOTATION</span>
                                                                </a>
                                                                <!--[if mso]></center></v:roundrect><![endif]-->
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td><![endif]-->
                                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>
                    <div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row"
                            style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                            <div
                                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                                <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color: #ffffff;width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                <div class="u-col u-col-100"
                                    style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                                    <div
                                        style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div
                                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                            <!--<![endif]-->
                                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">
                                                            <table width="100%" cellpadding="0" cellspacing="0"
                                                                border="0">
                                                                <tr>
                                                                    <td style="padding-right: 0px;padding-left: 0px;"
                                                                        align="center">
                                                                        <img align="center" border="0"
                                                                            src="https://assets.unlayer.com/projects/136358/1676023747347-image-1.png"
                                                                            alt="" title=""
                                                                            style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 25%;max-width: 120px;"
                                                                            width="120"
                                                                            class="v-src-width v-src-max-width" />
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table id="u_content_heading_6"
                                                style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 25px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">
                                                            <h1 class="v-font-size"
                                                                style="margin: 0px; color: #f8f8f8; line-height: 140%; text-align: center; word-wrap: break-word; font-size: 13px; font-weight: 400; ">
                                                                mangalamtravel.com
</h1>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td><![endif]-->
                                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>
                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                </td>
            </tr>
        </tbody>
    </table>
    <!--[if mso]></div><![endif]-->
    <!--[if IE]></div><![endif]-->
</body>
</html>';

$subject = 'Travel Enquiry | ' . $enq_data['date'];

// Send to customer and admins (do not overwrite the same variable)
$customerSent = sendMail($email, $subject, $templateUpdated, 'info@mangalamtours.com');
$adminSent1   = sendMail('info@mangalamtours.com', $subject, $templateAdmin, $email);
// Optional additional admin recipients (uncomment/configure as needed)
// $adminSent2   = sendMail('admin@mangalamtours.com', $subject, $templateAdmin, $email);
// $adminSent3   = sendMail('sales@mangalamtours.com', $subject, $templateAdmin, $email);

// Consider it success if any send succeeds
if ($customerSent == 1 || $adminSent1 == 1) {
  echo 1;
} else {
  echo 0;
}
