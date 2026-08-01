<?php
// Email Sending Functions for Mangalam Tours
// Similar to Mangalam Tours email system

require_once './mailer.php';
require_once './emailTemplates.php';

function sendCartEnquiryEmails($customerName, $customerEmail, $customerPhone, $cartItems, $totalAmount, $currencyType = 'AED') {
    // Sanitize subject to prevent SMTP errors
    $safeCustomerName = htmlspecialchars($customerName, ENT_QUOTES, 'UTF-8');
    $subject = 'New Cart Enquiry - ' . $safeCustomerName;
    
    // Get email templates
    $customerTemplate = getCustomerEmailTemplate($customerName, $totalAmount, $currencyType, $cartItems);
    $adminTemplate = getAdminEmailTemplate($customerName, $customerEmail, $customerPhone, $cartItems, $totalAmount, $currencyType);
    
    // Send customer confirmation email (try-catch to prevent one failure from stopping all)
    try {
        $customerEmailSent = sendMail($customerEmail, 'Thank You for Your Enquiry - Mangalam Tours', $customerTemplate, 'info@mangalamtours.com');
    } catch (Exception $e) {
        error_log("Failed to send customer email: " . $e->getMessage());
        $customerEmailSent = 0;
    }
    
    // Send admin notification emails (try-catch for each to allow partial success)
    try {
        $adminEmailSent = sendMail('info@mangalamtours.com', $subject, $adminTemplate, $customerEmail);
    } catch (Exception $e) {
        error_log("Failed to send admin email 1: " . $e->getMessage());
        $adminEmailSent = 0;
    }
    
    // Send to additional admin emails (similar to Mangalam Tours)
    try {
        $adminEmail2 = sendMail('admin@mangalamtours.com', $subject, $adminTemplate, $customerEmail);
    } catch (Exception $e) {
        error_log("Failed to send admin email 2: " . $e->getMessage());
        $adminEmail2 = 0;
    }
    
    try {
        $adminEmail3 = sendMail('sales@mangalamtours.com', $subject, $adminTemplate, $customerEmail);
    } catch (Exception $e) {
        error_log("Failed to send admin email 3: " . $e->getMessage());
        $adminEmail3 = 0;
    }
    
    return [
        'customer_email_sent' => $customerEmailSent,
        'admin_email_sent' => $adminEmailSent,
        'admin_email2_sent' => $adminEmail2,
        'admin_email3_sent' => $adminEmail3
    ];
}

function sendActivityEnquiryEmail($customerName, $customerEmail, $customerPhone, $activityData, $totalAmount, $currencyType = 'AED') {
    $subject = 'New Activity Enquiry - ' . $customerName;
    
    // Create activity-specific template
    $activityTemplate = getActivityEnquiryTemplate($customerName, $customerEmail, $customerPhone, $activityData, $totalAmount, $currencyType);
    // Format activity data as cart item for customer email
    $cartItems = [[
        'title' => $activityData['title'] ?? '',
        'type' => 'Activity',
        'date' => $activityData['date'] ?? '',
        'adults' => $activityData['adults'] ?? 1,
        'children' => $activityData['children'] ?? 0,
        'amount' => $activityData['amount'] ?? 0,
        'childAmount' => $activityData['childAmount'] ?? 0
    ]];
    $customerTemplate = getCustomerEmailTemplate($customerName, $totalAmount, $currencyType, $cartItems);
    
    // Send emails
    $customerEmailSent = sendMail($customerEmail, 'Thank You for Your Activity Enquiry - Mangalam Tours', $customerTemplate, 'info@mangalamtours.com');
    $adminEmailSent = sendMail('info@mangalamtours.com', $subject, $activityTemplate, $customerEmail);
    
    return [
        'customer_email_sent' => $customerEmailSent,
        'admin_email_sent' => $adminEmailSent
    ];
}

function sendTicketEnquiryEmail($customerName, $customerEmail, $customerPhone, $ticketData, $totalAmount, $currencyType = 'AED') {
    $subject = 'New Ticket Enquiry - ' . $customerName;
    
    // Create ticket-specific template
    $ticketTemplate = getTicketEnquiryTemplate($customerName, $customerEmail, $customerPhone, $ticketData, $totalAmount, $currencyType);
    // Format ticket data as cart item for customer email
    $cartItems = [[
        'title' => $ticketData['title'] ?? '',
        'type' => 'Ticket',
        'date' => $ticketData['date'] ?? '',
        'adults' => $ticketData['adults'] ?? 1,
        'children' => $ticketData['children'] ?? 0,
        'amount' => $ticketData['amount'] ?? 0,
        'childAmount' => $ticketData['childAmount'] ?? 0
    ]];
    $customerTemplate = getCustomerEmailTemplate($customerName, $totalAmount, $currencyType, $cartItems);
    
    // Send emails
    $customerEmailSent = sendMail($customerEmail, 'Thank You for Your Ticket Enquiry - Mangalam Tours', $customerTemplate, 'info@mangalamtours.com');
    $adminEmailSent = sendMail('info@mangalamtours.com', $subject, $ticketTemplate, $customerEmail);
    
    return [
        'customer_email_sent' => $customerEmailSent,
        'admin_email_sent' => $adminEmailSent
    ];
}

function getActivityEnquiryTemplate($customerName, $customerEmail, $customerPhone, $activityData, $totalAmount, $currencyType = 'AED') {
    return '
<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Activity Enquiry - Mangalam Tours</title>
  <style type="text/css">
    body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
    table, tr, td { vertical-align: top; border-collapse: collapse; }
    .container { max-width: 500px; margin: 0 auto; }
    .header { background-color: #ef4444; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .footer { background-color: #f5f5f5; padding: 20px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://mangalamtours.com/assets/images/logo.png" alt="Mangalam Tours" style="max-width: 200px;">
    </div>
    <div class="content">
      <h2>New Activity Enquiry</h2>
      <p><strong>Customer:</strong> ' . $customerName . '</p>
      <p><strong>Email:</strong> ' . $customerEmail . '</p>
      <p><strong>Phone:</strong> ' . $customerPhone . '</p>
      <p><strong>Activity:</strong> ' . $activityData['title'] . '</p>
      <p><strong>Date:</strong> ' . $activityData['date'] . '</p>
      <p><strong>Adults:</strong> ' . $activityData['adults'] . '</p>
      <p><strong>Children:</strong> ' . $activityData['children'] . '</p>
      <p><strong>Total Amount:</strong> ' . $currencyType . ' ' . number_format($totalAmount) . '</p>
    </div>
    <div class="footer">
      <p>Mangalam Tours - Your Gateway to Amazing Adventures</p>
    </div>
  </div>
</body>
</html>';
}

function getTicketEnquiryTemplate($customerName, $customerEmail, $customerPhone, $ticketData, $totalAmount, $currencyType = 'AED') {
    return '
<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Ticket Enquiry - Mangalam Tours</title>
  <style type="text/css">
    body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
    table, tr, td { vertical-align: top; border-collapse: collapse; }
    .container { max-width: 500px; margin: 0 auto; }
    .header { background-color: #ef4444; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .footer { background-color: #f5f5f5; padding: 20px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://mangalamtours.com/assets/images/logo.png" alt="Mangalam Tours" style="max-width: 200px;">
    </div>
    <div class="content">
      <h2>New Ticket Enquiry</h2>
      <p><strong>Customer:</strong> ' . $customerName . '</p>
      <p><strong>Email:</strong> ' . $customerEmail . '</p>
      <p><strong>Phone:</strong> ' . $customerPhone . '</p>
      <p><strong>Ticket:</strong> ' . $ticketData['title'] . '</p>
      <p><strong>Date:</strong> ' . $ticketData['date'] . '</p>
      <p><strong>Adults:</strong> ' . $ticketData['adults'] . '</p>
      <p><strong>Children:</strong> ' . $ticketData['children'] . '</p>
      <p><strong>Total Amount:</strong> ' . $currencyType . ' ' . number_format($totalAmount) . '</p>
    </div>
    <div class="footer">
      <p>Mangalam Tours - Your Gateway to Amazing Adventures</p>
    </div>
  </div>
</body>
</html>';
}

function sendPackageEnquiryEmail($customerName, $customerEmail, $customerPhone, $packageData, $totalAmount, $currencyType = 'AED') {
    $subject = 'New Package Enquiry - ' . $customerName;
    
    // Create package-specific template
    $packageTemplate = getPackageEnquiryTemplate($customerName, $customerEmail, $customerPhone, $packageData, $totalAmount, $currencyType);
    $customerTemplate = getCustomerEmailTemplate($customerName, $totalAmount, $currencyType, null, $packageData);
    
    // Send emails
    $customerEmailSent = sendMail($customerEmail, 'Thank You for Your Package Enquiry - Mangalam Tours', $customerTemplate, 'info@mangalamtours.com');
    $adminEmailSent = sendMail('info@mangalamtours.com', $subject, $packageTemplate, $customerEmail);
    
    return [
        'customer_email_sent' => $customerEmailSent,
        'admin_email_sent' => $adminEmailSent
    ];
}

function getPackageEnquiryTemplate($customerName, $customerEmail, $customerPhone, $packageData, $totalAmount, $currencyType = 'AED') {
    return '
<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Package Enquiry - Mangalam Tours</title>
  <style type="text/css">
    body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
    table, tr, td { vertical-align: top; border-collapse: collapse; }
    .container { max-width: 500px; margin: 0 auto; }
    .header { background-color: #ef4444; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .footer { background-color: #f5f5f5; padding: 20px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://mangalamtours.com/assets/images/logo.png" alt="Mangalam Tours" style="max-width: 200px;">
    </div>
    <div class="content">
      <h2>New Package Enquiry</h2>
      <p><strong>Customer:</strong> ' . $customerName . '</p>
      <p><strong>Email:</strong> ' . $customerEmail . '</p>
      <p><strong>Phone:</strong> ' . $customerPhone . '</p>
      <p><strong>Package:</strong> ' . $packageData['title'] . '</p>
      <p><strong>Duration:</strong> ' . $packageData['duration'] . '</p>
      <p><strong>Hotel Type:</strong> ' . (isset($packageData['hotel_type']) ? $packageData['hotel_type'] : 'Not specified') . '</p>
      <p><strong>Package Amount:</strong> ' . $currencyType . ' ' . number_format($packageData['amount']) . '</p>
      <p><strong>Total Amount:</strong> ' . $currencyType . ' ' . number_format($totalAmount) . '</p>
      ' . (isset($packageData['notes']) && !empty($packageData['notes']) ? '<p><strong>Notes:</strong> ' . htmlspecialchars($packageData['notes']) . '</p>' : '') . '
    </div>
    <div class="footer">
      <p>Mangalam Tours - Your Gateway to Amazing Adventures</p>
    </div>
  </div>
</body>
</html>';
}

function sendContactEnquiryEmail($customerName, $customerEmail, $customerPhone, $subject, $message) {
    $emailSubject = 'New Contact Enquiry - ' . $customerName;
    
    // Create contact-specific template
    $contactTemplate = getContactEnquiryTemplate($customerName, $customerEmail, $customerPhone, $subject, $message);
    $customerTemplate = getCustomerEmailTemplate($customerName, 0, 'AED');
    
    // Send emails
    $customerEmailSent = sendMail($customerEmail, 'Thank You for Contacting Mangalam Tours', $customerTemplate, 'info@mangalamtours.com');
    $adminEmailSent = sendMail('info@mangalamtours.com', $emailSubject, $contactTemplate, $customerEmail);
    
    return [
        'customer_email_sent' => $customerEmailSent,
        'admin_email_sent' => $adminEmailSent
    ];
}

function getContactEnquiryTemplate($customerName, $customerEmail, $customerPhone, $subject, $message) {
    return '
<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Enquiry - Mangalam Tours</title>
  <style type="text/css">
    body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
    table, tr, td { vertical-align: top; border-collapse: collapse; }
    .container { max-width: 500px; margin: 0 auto; }
    .header { background-color: #ef4444; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .footer { background-color: #f5f5f5; padding: 20px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://mangalamtours.com/assets/images/logo.png" alt="Mangalam Tours" style="max-width: 200px;">
    </div>
    <div class="content">
      <h2>New Contact Enquiry</h2>
      <p><strong>Customer:</strong> ' . $customerName . '</p>
      <p><strong>Email:</strong> ' . $customerEmail . '</p>
      <p><strong>Phone:</strong> ' . $customerPhone . '</p>
      <p><strong>Subject:</strong> ' . htmlspecialchars($subject) . '</p>
      <p><strong>Message:</strong></p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 10px;">
        ' . nl2br(htmlspecialchars($message)) . '
      </div>
    </div>
    <div class="footer">
      <p>Mangalam Tours - Your Gateway to Amazing Adventures</p>
    </div>
  </div>
</body>
</html>';
}
?>
