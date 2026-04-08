<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    requireAuth();
    $date = $_GET['date'] ?? null;

    $sql = 'SELECT * FROM leads ORDER BY created_at DESC';
    $params = [];

    if ($date) {
        $sql = 'SELECT * FROM leads WHERE DATE(created_at) = ? ORDER BY created_at DESC';
        $params[] = $date;
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    jsonResponse($stmt->fetchAll());
}

if ($method === 'POST') {
    $body = getRequestBody();
    $phone = $body['phone'] ?? '';
    $name = $body['name'] ?? '';
    $source = $body['source'] ?? '';

    if (!$phone) {
        jsonResponse(['error' => 'phone required'], 400);
    }

    $stmt = $pdo->prepare('INSERT INTO leads (phone, name, source) VALUES (?, ?, ?)');
    $stmt->execute([$phone, $name, $source]);
    $leadId = $pdo->lastInsertId();

    // Send to Telegram
    $tgToken = getenv('TG_BOT_TOKEN') ?: '';
    $tgChatId = getenv('TG_CHAT_ID') ?: '';
    if ($tgToken && $tgChatId) {
        $lines = ["📩 *Новая заявка с сайта*", "📞 Телефон: $phone"];
        if ($name) $lines[] = "👤 Имя/компания: $name";
        if ($source) $lines[] = "📄 Страница: $source";
        $lines[] = "🕐 " . date('d.m.Y H:i');
        $text = implode("\n", $lines);

        @file_get_contents("https://api.telegram.org/bot$tgToken/sendMessage?" . http_build_query([
            'chat_id' => $tgChatId,
            'text' => $text,
            'parse_mode' => 'Markdown',
        ]));
    }

    jsonResponse(['success' => true, 'id' => $leadId], 201);
}

if ($method === 'PUT') {
    requireAuth();
    $body = getRequestBody();
    $id = $body['id'] ?? 0;
    $processed = $body['processed'] ?? false;

    $stmt = $pdo->prepare('UPDATE leads SET processed = ? WHERE id = ?');
    $stmt->execute([$processed ? 1 : 0, $id]);

    jsonResponse(['success' => true]);
}
