SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
CREATE DATABASE IF NOT EXISTS avis CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE avis;

-- Site content (key-value store)
CREATE TABLE IF NOT EXISTS content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_key VARCHAR(100) NOT NULL UNIQUE,
    data JSON NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Settings
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data JSON NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Leads (form submissions)
CREATE TABLE IF NOT EXISTS leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(50) NOT NULL,
    name VARCHAR(255) DEFAULT '',
    source VARCHAR(100) DEFAULT '',
    processed TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Media files
CREATE TABLE IF NOT EXISTS media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_type ENUM('image', 'video') NOT NULL,
    file_size INT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Insert default content
INSERT INTO content (section_key, data) VALUES
('hero', '{"line1":"ЗАЩИТА ОБЪЕКТОВ ОТ БПЛА","subtitle":"СЕТКИ · ОГРАЖДЕНИЯ · УКРЫТИЯ","features":["Собственное производство","Монтаж от 5 дней","Проектирование по СП 542"]}'),
('stats', '[{"value":"9+","label":"лет на рынке"},{"value":"150+","label":"объектов"},{"value":"СП 542","label":"проектирование"},{"value":"3 года","label":"гарантия"}]'),
('products', '[]'),
('about', '{"description":"АВИС — российский производитель средств защиты объектов от БПЛА. 12 лет опыта, 200+ реализованных объектов, собственное производство.","advantages":["Собственное производство конструкций","Полный цикл: аудит → проект → монтаж → гарантия","Расширенная гарантия 3 года на все системы","Изготовление от 5 рабочих дней"]}'),
('contacts', '{"phone":"+7 (XXX) XXX-XX-XX","email":"info@avis.ru","telegram":"@avis","address":""}')
ON DUPLICATE KEY UPDATE section_key = section_key;

INSERT INTO settings (id, data) VALUES
(1, '{"phone":"+7 (XXX) XXX-XX-XX","email":"info@avis.ru","telegram":"@avis","address":"","companyName":"ООО АВИС","inn":"","ogrn":""}')
ON DUPLICATE KEY UPDATE id = id;
