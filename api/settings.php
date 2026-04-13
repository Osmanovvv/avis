<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT data FROM settings WHERE id = 1');
    $row = $stmt->fetch();
    jsonResponse($row ? json_decode($row['data'], true) : null);
}

if ($method === 'PUT') {
    requireAuth();
    $body = getRequestBody();

    $json = json_encode($body, JSON_UNESCAPED_UNICODE);
    $stmt = $pdo->prepare('INSERT INTO settings (id, data) VALUES (1, ?) ON DUPLICATE KEY UPDATE data = ?');
    $stmt->execute([$json, $json]);

    jsonResponse(['success' => true]);
}
