<?php
require_once __DIR__ . '/config.php';

$body = getRequestBody();
$username = $body['username'] ?? '';
$password = $body['password'] ?? '';

$envUsername = getenv('ADMIN_USERNAME') ?: 'admin';

if ($username === $envUsername && $password === $ADMIN_PASSWORD) {
    jsonResponse(['token' => createToken($username, $JWT_SECRET)]);
} else {
    jsonResponse(['error' => 'Неверный логин или пароль'], 401);
}
