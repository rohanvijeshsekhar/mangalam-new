<?php
// Email Template Functions for Mangalam Tours
// Similar to Mangalam Tours email system

function getCustomerEmailTemplate($customerName, $totalAmount, $currencyType = 'AED', $cartItems = null, $packageData = null) {
    // Generate package details HTML if package data is provided
    $packageDetailsHtml = '';
    if ($packageData && is_array($packageData)) {
        $packageTitle = htmlspecialchars($packageData['title'] ?? 'N/A', ENT_QUOTES, 'UTF-8');
        $packageDetailsHtml = '
          <!-- Package Details -->
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                      <!--<![endif]-->
                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:20px;font-family:arial,helvetica,sans-serif;" align="left">
                              <div style="font-family: helvetica,sans-serif; font-size: 16px; font-weight: 400; line-height: 150%; word-wrap: break-word;">
                                <p style="line-height: 150%; margin-bottom: 15px; margin-top: 0;"><span style="color: #000000; font-size: 18px; font-weight: 600;">Package Details:</span></p>
                                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #ef4444;">
                                  <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #000000;">' . $packageTitle . '</p>
                                  ' . (isset($packageData['duration']) ? '<p style="margin: 4px 0; font-size: 14px; color: #666666;">Duration: ' . htmlspecialchars($packageData['duration'], ENT_QUOTES, 'UTF-8') . '</p>' : '') . '
                                  ' . (isset($packageData['hotel_type']) && !empty($packageData['hotel_type']) ? '<p style="margin: 4px 0; font-size: 14px; color: #666666;">Hotel Type: ' . htmlspecialchars($packageData['hotel_type'], ENT_QUOTES, 'UTF-8') . '</p>' : '') . '
                                  ' . (isset($packageData['amount']) ? '<p style="margin: 8px 0 4px 0; font-size: 16px; font-weight: 600; color: #000000; padding-top: 8px; border-top: 1px solid #e0e0e0;">Package Amount: <span style="color: #ef4444;">' . htmlspecialchars($currencyType, ENT_QUOTES, 'UTF-8') . ' ' . number_format($packageData['amount']) . '</span></p>' : '') . '
                                  ' . (isset($packageData['notes']) && !empty($packageData['notes']) ? '<p style="margin: 8px 0 0 0; font-size: 14px; color: #666666; padding-top: 8px; border-top: 1px solid #e0e0e0;"><strong>Notes:</strong> ' . htmlspecialchars($packageData['notes'], ENT_QUOTES, 'UTF-8') . '</p>' : '') . '
                                </div>
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
    
    // Generate cart items HTML if cart items are provided
    $cartItemsHtml = '';
    if ($cartItems && is_array($cartItems) && !empty($cartItems)) {
        $cartItemsCardsHtml = '';
        foreach ($cartItems as $item) {
            $itemTotal = (($item['amount'] ?? 0) * ($item['adults'] ?? 1)) + (($item['childAmount'] ?? 0) * ($item['children'] ?? 0));
            $itemTitle = htmlspecialchars($item['title'] ?? '', ENT_QUOTES, 'UTF-8');
            $itemType = htmlspecialchars($item['type'] ?? '', ENT_QUOTES, 'UTF-8');
            $itemDate = htmlspecialchars($item['date'] ?? '', ENT_QUOTES, 'UTF-8');
            $itemAdults = intval($item['adults'] ?? 0);
            $itemChildren = intval($item['children'] ?? 0);
            
            $cartItemsCardsHtml .= '
                                  <div style="background-color: #f9f9f9; border-radius: 8px; padding: 15px; margin-bottom: 15px; border-left: 4px solid #ef4444;">
                                    <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #000000;">' . $itemTitle . '</p>
                                    <p style="margin: 4px 0; font-size: 14px; color: #666666;"><span style="color: #ef4444; font-weight: 600;">' . $itemType . '</span></p>
                                    <p style="margin: 4px 0; font-size: 14px; color: #666666;">Date: ' . $itemDate . '</p>
                                    <p style="margin: 4px 0; font-size: 14px; color: #666666;">People: ' . $itemAdults . ' Adults' . ($itemChildren > 0 ? ', ' . $itemChildren . ' Children' : '') . '</p>
                                    <p style="margin: 8px 0 0 0; font-size: 16px; font-weight: 600; color: #000000; padding-top: 8px; border-top: 1px solid #e0e0e0;">Amount: <span style="color: #ef4444;">' . htmlspecialchars($currencyType, ENT_QUOTES, 'UTF-8') . ' ' . number_format($itemTotal) . '</span></p>
                                  </div>';
        }
        
        $cartItemsHtml = '
          <!-- Cart Items Details -->
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                      <!--<![endif]-->
                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:20px;font-family:arial,helvetica,sans-serif;" align="left">
                              <div style="font-family: helvetica,sans-serif; font-size: 18px; font-weight: 600; line-height: 150%; margin-bottom: 15px; word-wrap: break-word;">
                                <p style="margin: 0;"><span style="color: #000000;">Your Cart Items:</span></p>
                              </div>
                              ' . $cartItemsCardsHtml . '
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
    
    return '
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
  <title>Thank You - Mangalam Tours</title>
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
          
          <!-- Header with Logo -->
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color: #ef4444;width: 500px;padding: 15px 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                  <div style="background-color: #ef4444;height: 100%;width: 100% !important;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 15px 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                      <!--<![endif]-->
                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td style="padding-right: 0px;padding-left: 0px;" align="center">
                                    <img align="center" border="0" src="https://mangalamtours.com/assets/images/logo.png" alt="Mangalam Tours" title="Mangalam Tours" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 200px;" width="200" />
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
          
          <!-- Thank You Message -->
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                      <!--<![endif]-->
                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:40px 20px;font-family:arial,helvetica,sans-serif;" align="left">
                              <div style="font-family: helvetica,sans-serif; font-size: 25px; font-weight: 400; line-height: 150%; text-align: center; word-wrap: break-word;">
                                <p style="line-height: 150%;"><span style="color: #000000; line-height: 37.5px;">Thank You ' . htmlspecialchars($customerName, ENT_QUOTES, 'UTF-8') . '!</span></p>
                                <p style="line-height: 150%;"><span style="color: #000000; line-height: 37.5px;">Your enquiry has been received</span></p>
                                <p style="line-height: 150%;"><span style="color: #ef4444; line-height: 37.5px;"><strong>Estimated Total: ' . htmlspecialchars($currencyType, ENT_QUOTES, 'UTF-8') . ' ' . number_format($totalAmount) . '</strong></span></p>
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
          
          ' . $packageDetailsHtml . '
          
          ' . $cartItemsHtml . '
          
          <!-- Content -->
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                      <!--<![endif]-->
                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:20px;font-family:arial,helvetica,sans-serif;" align="left">
                              <div style="font-family: helvetica,sans-serif; font-size: 16px; font-weight: 400; line-height: 150%; text-align: center; word-wrap: break-word;">
                                <p style="line-height: 150%;"><span style="color: #000000;">Our team will review your enquiry and get back to you within 24 hours with a detailed quotation.</span></p>
                                <p style="line-height: 150%; margin-top: 20px;"><span style="color: #000000;">In the meantime, feel free to explore more destinations on our website.</span></p>
                                <p style="line-height: 150%; margin-top: 20px;"><span style="color: #000000;">Best regards,<br><strong>Mangalam Tours Team</strong></span></p>
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
          
          <!-- Footer -->
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                      <!--<![endif]-->
                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:20px;font-family:arial,helvetica,sans-serif;" align="left">
                              <div style="font-family: helvetica,sans-serif; font-size: 14px; font-weight: 400; line-height: 150%; text-align: center; word-wrap: break-word;">
                                <p style="line-height: 150%;"><span style="color: #666666;">Visit us at: <a href="https://mangalamtours.com" style="color: #ef4444;">mangalamtours.com</a></span></p>
                                <p style="line-height: 150%;"><span style="color: #666666;">Contact: +971 50 123 4567 | info@mangalamtours.com</span></p>
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
</html>';
}

function getAdminEmailTemplate($customerName, $customerEmail, $customerPhone, $cartItems, $totalAmount, $currencyType = 'AED') {
    $itemsHtml = '';
    foreach ($cartItems as $item) {
        $itemTotal = ($item['amount'] * $item['adults']) + ($item['childAmount'] * $item['children']);
        // Properly escape all user data to prevent SMTP errors
        $itemTitle = htmlspecialchars($item['title'] ?? '', ENT_QUOTES, 'UTF-8');
        $itemType = htmlspecialchars($item['type'] ?? '', ENT_QUOTES, 'UTF-8');
        $itemDate = htmlspecialchars($item['date'] ?? '', ENT_QUOTES, 'UTF-8');
        $itemAdults = intval($item['adults'] ?? 0);
        $itemChildren = intval($item['children'] ?? 0);
        
        $itemsHtml .= '
        <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 15px; border-bottom: 1px solid #ddd;">' . $itemTitle . '</td>
            <td style="padding: 15px; border-bottom: 1px solid #ddd;">' . $itemType . '</td>
            <td style="padding: 15px; border-bottom: 1px solid #ddd;">' . $itemDate . '</td>
            <td style="padding: 15px; border-bottom: 1px solid #ddd;">' . $itemAdults . ' Adults, ' . $itemChildren . ' Children</td>
            <td style="padding: 15px; border-bottom: 1px solid #ddd;">' . htmlspecialchars($currencyType, ENT_QUOTES, 'UTF-8') . ' ' . number_format($itemTotal) . '</td>
        </tr>';
    }
    
    return '
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
  <title>New Cart Enquiry - Mangalam Tours</title>
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
          
          <!-- Header -->
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color: #ef4444;width: 500px;padding: 15px 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                  <div style="background-color: #ef4444;height: 100%;width: 100% !important;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 15px 0px;">
                      <!--<![endif]-->
                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td style="padding-right: 0px;padding-left: 0px;" align="center">
                                    <img align="center" border="0" src="https://mangalamtours.com/assets/images/logo.png" alt="Mangalam Tours" title="Mangalam Tours" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 200px;" width="200" />
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
          
          <!-- Title -->
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;">
                      <!--<![endif]-->
                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:20px;font-family:arial,helvetica,sans-serif;" align="left">
                              <div style="font-family: helvetica,sans-serif; font-size: 22px; font-weight: 400; line-height: 150%; text-align: center; word-wrap: break-word;">
                                <p style="line-height: 150%;"><span style="color: #000000; line-height: 33px;"><strong>New Cart Enquiry From Website</strong></span></p>
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
          
          <!-- Customer Info -->
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;">
                      <!--<![endif]-->
                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:20px;font-family:arial,helvetica,sans-serif;" align="left">
                              <div style="font-family: helvetica,sans-serif; font-size: 16px; font-weight: 400; line-height: 150%; word-wrap: break-word;">
                                <p style="line-height: 150%;"><span style="color: #000000;"><strong>Customer Information:</strong></span></p>
                                <p style="line-height: 150%;"><span style="color: #000000;">Name: ' . htmlspecialchars($customerName, ENT_QUOTES, 'UTF-8') . '</span></p>
                                <p style="line-height: 150%;"><span style="color: #000000;">Email: ' . htmlspecialchars($customerEmail, ENT_QUOTES, 'UTF-8') . '</span></p>
                                <p style="line-height: 150%;"><span style="color: #000000;">Phone: ' . htmlspecialchars($customerPhone, ENT_QUOTES, 'UTF-8') . '</span></p>
                                <p style="line-height: 150%; margin-top: 20px;"><span style="color: #000000;"><strong>Total Amount: ' . htmlspecialchars($currencyType, ENT_QUOTES, 'UTF-8') . ' ' . number_format($totalAmount) . '</strong></span></p>
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
          
          <!-- Cart Items -->
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;">
                      <!--<![endif]-->
                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:20px;font-family:arial,helvetica,sans-serif;" align="left">
                              <div style="font-family: helvetica,sans-serif; font-size: 16px; font-weight: 400; line-height: 150%; word-wrap: break-word;">
                                <p style="line-height: 150%;"><span style="color: #000000;"><strong>Cart Items:</strong></span></p>
                                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                                    <thead>
                                        <tr style="background-color: #f5f5f5;">
                                            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Item</th>
                                            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Type</th>
                                            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Date</th>
                                            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">People</th>
                                            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ' . $itemsHtml . '
                                    </tbody>
                                </table>
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
</html>';
}
?>
