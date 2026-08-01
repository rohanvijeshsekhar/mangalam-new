<?php
require_once __DIR__ . '/smsConfig.php';

function smsBuildAuthSignature($expire)
{
    $timeKey = md5('send-sms' . 'sms@rits-v1.0' . $expire);
    return md5(md5(SMS_ACCESS_TOKEN . $timeKey) . SMS_ACCESS_KEY);
}

function smsLog($line)
{
    $dir = __DIR__ . '/logs';
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
    error_log('[' . date('Y-m-d H:i:s') . '] ' . $line . PHP_EOL, 3, $dir . '/otp-sms.log');
}

function smsBuildOtpMessage($otp)
{
    return str_replace(['{#var#}', '{#1#}'], (string) $otp, SMS_OTP_MESSAGE);
}

function smsSendOtp($phone10, $otp)
{
    if (trim(SMS_TEMPLATE_ID) === '') {
        return ['ok' => false, 'message' => 'SMS template is not configured.'];
    }

    $messageContent = smsBuildOtpMessage($otp);
    $expire = time() + 60;

    $payload = [
        'accessToken'            => SMS_ACCESS_TOKEN,
        'expire'                 => $expire,
        'authSignature'          => smsBuildAuthSignature($expire),
        'sender'                 => SMS_SENDER_ID,
        'smsHeader'              => SMS_SENDER_ID,
        'route'                  => 'transactional',
        'messageContent'         => $messageContent,
        'recipients'             => [$phone10],
        'contentType'            => 'text',
        'entityId'               => SMS_ENTITY_ID,
        'templateId'             => SMS_TEMPLATE_ID,
        'removeDuplicateNumbers' => '0',
        'flashSMS'               => '0',
        'countryCode'            => '91',
    ];

    $result = smsExecuteRequest($payload);
    $submissionId = $result['data']['data']['submissionId'] ?? '';

    smsLog("phone={$phone10} otp={$otp} http={$result['http_code']} ok=" . ($result['ok'] ? '1' : '0') . " submission={$submissionId}");

    if ($result['ok']) {
        return ['ok' => true, 'message' => 'OTP sent to your mobile number.'];
    }

    return ['ok' => false, 'message' => $result['message']];
}

function smsExecuteRequest(array $payload)
{
    if (!function_exists('curl_init')) {
        return ['ok' => false, 'message' => 'PHP cURL is required.', 'http_code' => 0, 'data' => null];
    }

    $ch = curl_init(SMS_API_URL);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 30,
        CURLOPT_POST           => true,
        CURLOPT_HTTPHEADER     => ['accept: application/json', 'content-type: application/json'],
        CURLOPT_POSTFIELDS     => json_encode($payload),
        CURLOPT_SSL_VERIFYPEER => false,
    ]);

    $response = curl_exec($ch);
    $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    $data = json_decode($response, true);

    if ($curlError !== '') {
        return ['ok' => false, 'message' => 'Could not reach SMS server.', 'http_code' => $httpCode, 'data' => $data];
    }

    if ($httpCode < 200 || $httpCode >= 300 || !is_array($data)) {
        $msg = is_array($data) && !empty($data['message']) ? (string) $data['message'] : 'SMS request failed.';
        return ['ok' => false, 'message' => $msg, 'http_code' => $httpCode, 'data' => $data];
    }

    $status = strtolower((string) ($data['status'] ?? ''));
    $hasIds = !empty($data['data']['messageIds']);

    if (in_array($status, ['success', 'ok', 'sent'], true) && $hasIds) {
        return ['ok' => true, 'message' => (string) ($data['message'] ?? 'Sent'), 'http_code' => $httpCode, 'data' => $data];
    }

    $msg = !empty($data['message']) ? (string) $data['message'] : 'SMS gateway rejected the request.';
    return ['ok' => false, 'message' => $msg, 'http_code' => $httpCode, 'data' => $data];
}

function smsSendOtpEmailBackup($email, $otp, $phone10)
{
    if (!SMS_OTP_EMAIL_BACKUP || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return false;
    }

    require_once __DIR__ . '/mailer.php';

    $subject = 'Your Mangalam Tours OTP';
    $body = '<p>Your verification code is: <strong style="font-size:22px;">' . htmlspecialchars($otp) . '</strong></p>'
        . '<p>Mobile: +91' . htmlspecialchars($phone10) . '</p>'
        . '<p>Valid for 10 minutes.</p>';

    return (bool) sendMail($email, $subject, $body, 'info@mangalamtours.com');
}
