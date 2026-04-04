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
('hero', '{"line1":"ЗАЩИТА ОБЪЕКТОВ ОТ БПЛА","line2":"СЕТКИ, ОГРАЖДЕНИЯ, УКРЫТИЯ","subtitle":"Пассивная инженерная защита. От аудита до монтажа под ключ"}'),
('stats', '[{"value":"200+","label":"объектов"},{"value":"12","label":"лет опыта"},{"value":"5","label":"изготовление"},{"value":"100%","label":"производство"}]'),
('products', '[{"name":"Сетки периметровые","description":"Защита периметра объекта от БПЛА"},{"name":"Сетки фасадные","description":"Защита фасадов зданий и сооружений"},{"name":"Ограждения бетонные","description":"Бетонные ограждения для критической инфраструктуры"},{"name":"Шторы защитные","description":"Быстроразвёртываемые защитные шторы"},{"name":"Роллеты защитные","description":"Автоматические защитные роллеты"},{"name":"Убежища и укрытия","description":"Модульные укрытия для персонала"}]'),
('about', '{"description":"АВИС — производитель систем пассивной защиты объектов от БПЛА. Собственное производство, гарантия 3 года.","advantages":["Собственное производство","Гарантия 3 года","200+ объектов","Монтаж под ключ"]}'),
('contacts', '{"phone":"+7 (XXX) XXX-XX-XX","email":"info@avis.ru","telegram":"@avis","address":""}')
ON DUPLICATE KEY UPDATE section_key = section_key;

INSERT INTO settings (id, data) VALUES
(1, '{"phone":"+7 (XXX) XXX-XX-XX","email":"info@avis.ru","telegram":"@avis","address":"","companyName":"ООО АВИС","inn":"","ogrn":""}')
ON DUPLICATE KEY UPDATE id = id;
