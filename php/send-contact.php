<?php

require 'mailer.php';

header('Content-Type: application/json');

$name = trim($_POST['yourname'] ?? '');
$phone = trim($_POST['yourphone'] ?? '');
$message = trim($_POST['yourmessage'] ?? '');
$token = $_POST['recaptcha_token'] ?? '';

if (mb_strlen($name) < 2) {
    exit(json_encode(['success' => false, 'message' => 'Invalid name']));
}

if (!preg_match('/^[0-9+\s()-]{7,20}$/', $phone)) {
    exit(json_encode(['success' => false, 'message' => 'Invalid phone']));
}

if (mb_strlen($message) < 10) {
    exit(json_encode(['success' => false, 'message' => 'Message too short']));
}

if (!checkRecaptcha($token)) {
    exit(json_encode(['success' => false, 'message' => 'Spam detected']));
}

$body = "Name: $name\nPhone: $phone\n\nMessage:\n$message";

if (!sendMail('New contact request', $body)) {
    exit(json_encode(['success' => false, 'message' => 'Mail error']));
}

echo json_encode(['success' => true]);

