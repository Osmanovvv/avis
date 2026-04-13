<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $key = $_GET['key'] ?? null;

    if ($key) {
        $stmt = $pdo->prepare('SELECT data FROM content WHERE section_key = ?');
        $stmt->execute([$key]);
        $row = $stmt->fetch();
        jsonResponse($row ? json_decode($row['data'], true) : null);
    } else {
        $stmt = $pdo->query('SELECT section_key, data FROM content');
        $result = [];
        foreach ($stmt->fetchAll() as $row) {
            $result[$row['section_key']] = json_decode($row['data'], true);
        }
        jsonResponse($result);
    }
}

if ($method === 'PUT') {
    requireAuth();
    $body = getRequestBody();
    $key = $body['key'] ?? '';
    $data = $body['data'] ?? null;

    if (!$key || $data === null) {
        jsonResponse(['error' => 'key and data required'], 400);
    }

    $stmt = $pdo->prepare('INSERT INTO content (section_key, data) VALUES (?, ?) ON DUPLICATE KEY UPDATE data = ?');
    $json = json_encode($data, JSON_UNESCAPED_UNICODE);
    $stmt->execute([$key, $json, $json]);

    jsonResponse(['success' => true]);
}
