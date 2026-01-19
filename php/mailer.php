<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../vendor/phpmailer/src/Exception.php';
require __DIR__ . '/../vendor/phpmailer/src/PHPMailer.php';
require __DIR__ . '/../vendor/phpmailer/src/SMTP.php';

function sendMail(string $subject, string $body): bool
{
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;

        $mail->Username = 'yourmail@gmail.com';      // 🔴
        $mail->Password = 'APP_PASSWORD';             // 🔴
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->CharSet = 'UTF-8';
        $mail->setFrom('yourmail@gmail.com', 'Website');
        $mail->addAddress('yourmail@gmail.com');

        $mail->Subject = $subject;
        $mail->Body = $body;

        return $mail->send();
    } catch (Exception $e) {
        return false;
    }
}

function checkRecaptcha(string $token): bool
{
    $secret = 'SECRET_KEY'; // 🔴

    if (!$token) return false;

    $response = file_get_contents(
        'https://www.google.com/recaptcha/api/siteverify?secret=' .
        $secret . '&response=' . $token
    );

    if (!$response) return false;

    $result = json_decode($response, true);

    return $result['success'] === true && $result['score'] >= 0.5;
}
