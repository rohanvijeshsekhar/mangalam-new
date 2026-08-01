<?php
require '../smtp/PHPMailerAutoload.php';

function sendMail($sendAddress, $subject, $body, $replay)
{
    $mail = new PHPMailer(true);
    // Set to 0 in production; increase to 2 for verbose SMTP logs
    $mail->SMTPDebug = 0;
    $mail->isSMTP();
    $mail->Host        = 'smtp.hostinger.com'; // host name
    $mail->SMTPAuth    = true;
    $mail->Username    = 'test@webkyat.com'; // username ( mail id )
    $mail->Password    = 'Test@5656#'; // password
    $mail->SMTPSecure  = 'ssl';
    $mail->SMTPOptions = array('ssl' => array(
        'verify_peer' => false,
        'verify_peer_name'                                      => false,
        'allow_self_signed'                                     => true
    ));
    $mail->Port = 465;
    //Recipients
    $mail->setFrom('test@webkyat.com', 'Mangalam Tours'); // showing msg come from this mail id
    $mail->addAddress($sendAddress); // send to
    $mail->addReplyTo($replay); // replay to
    //Content
    $mail->isHTML(true);
    $mail->Subject = $subject; // add subject here
    $mail->Body    = ($body); // add html here
    try {
        if (!$mail->send()) {
            // Log detailed error for diagnostics
            $logFile = __DIR__ . '/mail_error.log';
            $timestamp = date('Y-m-d H:i:s');
            $errorInfo = $mail->ErrorInfo ?? 'Unknown error';
            $message = "[$timestamp] Failed to send to {$sendAddress}: {$errorInfo}\nSubject: {$subject}\n";
            error_log($message, 3, $logFile);
            // Also log to PHP error log for immediate visibility
            error_log("Mail send failed to {$sendAddress}: {$errorInfo}");
            throw new Exception("SMTP Error: {$errorInfo}");
        } else {
            // Optional: log success to verify flow
            $logFile = __DIR__ . '/mail_error.log';
            $timestamp = date('Y-m-d H:i:s');
            $message = "[$timestamp] Sent to {$sendAddress} with subject '{$subject}'\n";
            error_log($message, 3, $logFile);
            return 1;
        }
    } catch (Exception $e) {
        // Log exception and return 0
        $logFile = __DIR__ . '/mail_error.log';
        $timestamp = date('Y-m-d H:i:s');
        $message = "[$timestamp] Exception sending to {$sendAddress}: " . $e->getMessage() . "\nSubject: {$subject}\n";
        error_log($message, 3, $logFile);
        error_log("Mail exception to {$sendAddress}: " . $e->getMessage());
        return 0;
    }
}
// sendMail('webkyat@gmail.com', 'test', 'test', 'webkyat@gmail.com');