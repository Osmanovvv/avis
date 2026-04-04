<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$uploadDir = __DIR__ . '/uploads/';

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

if ($method === 'GET') {
    requireAuth();
    $stmt = $pdo->query('SELECT * FROM media ORDER BY uploaded_at DESC');
    $files = $stmt->fetchAll();

    foreach ($files as &$file) {
        $file['url'] = '/api/uploads/' . $file['filename'];
    }

    jsonResponse($files);
}

if ($method === 'POST') {
    requireAuth();

    if (empty($_FILES['file'])) {
        jsonResponse(['error' => 'No file uploaded'], 400);
    }

    $file = $_FILES['file'];
    $isImage = str_starts_with($file['type'], 'image/');
    $isVideo = str_starts_with($file['type'], 'video/');

    if (!$isImage && !$isVideo) {
        jsonResponse(['error' => 'Only images and videos allowed'], 400);
    }

    $maxSize = $isImage ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
    if ($file['size'] > $maxSize) {
        jsonResponse(['error' => 'File too large'], 400);
    }

    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;

    if (!move_uploaded_file($file['tmp_name'], $uploadDir . $filename)) {
        jsonResponse(['error' => 'Upload failed'], 500);
    }

    $stmt = $pdo->prepare('INSERT INTO media (filename, original_name, file_type, file_size) VALUES (?, ?, ?, ?)');
    $stmt->execute([$filename, $file['name'], $isImage ? 'image' : 'video', $file['size']]);

    jsonResponse([
        'success' => true,
        'id' => $pdo->lastInsertId(),
        'url' => '/api/uploads/' . $filename,
    ], 201);
}

if ($method === 'DELETE') {
    requireAuth();
    $id = $_GET['id'] ?? 0;

    $stmt = $pdo->prepare('SELECT filename FROM media WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();

    if ($row) {
        $filepath = $uploadDir . $row['filename'];
        if (file_exists($filepath)) unlink($filepath);

        $stmt = $pdo->prepare('DELETE FROM media WHERE id = ?');
        $stmt->execute([$id]);
    }

    jsonResponse(['success' => true]);
}
