-- Create the database
CREATE DATABASE IF NOT EXISTS unibudget;
USE unibudget;

-- Create departments table
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    UNIQUE KEY (name)
);

-- Create roles table
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    UNIQUE KEY (name)
);

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INT,
    department_id INT,
    UNIQUE KEY (email),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Create type_marches table
CREATE TABLE type_marches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    UNIQUE KEY (name)
);

-- Create statuses table
CREATE TABLE status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    UNIQUE KEY (name)
);

-- Create purchase_requests table
CREATE TABLE purchase_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INT NOT NULL,
    status_id INT,
    motif TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type_marche_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (status_id) REFERENCES statuses(id),
    FOREIGN KEY (type_marche_id) REFERENCES type_marches(id)
);

-- Create notifications table
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    destinator_user_id INT,
    request_id INT,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (request_id) REFERENCES purchase_requests(id)
);

-- Create budgets table
CREATE TABLE budgets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department_id INT,
    year INT NOT NULL,
    allocated_amount DECIMAL(12,2),
    spent_amount DECIMAL(12,2) DEFAULT 0,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Create validations table
CREATE TABLE validations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT,
    validator_id INT,
    status_id INT,
    comment TEXT,
    validated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES purchase_requests(id),
    FOREIGN KEY (status_id) REFERENCES statuses(id)
);

-- Create trigger for notifications on validation
DELIMITER //
CREATE TRIGGER after_validation_insert
AFTER INSERT ON validations
FOR EACH ROW
BEGIN
    -- Get the request creator and their department head
    DECLARE request_creator_id INT;
    DECLARE department_head_id INT;
    DECLARE request_id INT;
    DECLARE validation_comment TEXT;
    
    -- Get the request creator's ID and department head's ID
    SELECT pr.user_id, u.department_id INTO request_creator_id, department_head_id
    FROM purchase_requests pr
    JOIN users u ON pr.user_id = u.id
    WHERE pr.id = NEW.request_id;
    
    -- Get the department head's user ID
    SELECT id INTO department_head_id
    FROM users
    WHERE department_id = department_head_id AND role_id = 2; -- Assuming role_id 2 is for department head
    
    -- Create notification for request creator
    INSERT INTO notifications (destinator_user_id, request_id, title, message, created_at)
    VALUES (
        request_creator_id,
        NEW.request_id,
        CONCAT('Mises à jour concernant votre demande #', NEW.request_id),
        NEW.comment,
        CURRENT_TIMESTAMP
    );
    
    -- Create notification for department head
    INSERT INTO notifications (destinator_user_id, request_id, title, message, created_at)
    VALUES (
        department_head_id,
        NEW.request_id,
        CONCAT('Mises à jour concernant la demande #', NEW.request_id),
        NEW.comment,
        CURRENT_TIMESTAMP
    );
END //
DELIMITER ;

-- the database is fully inserted

-- saisir des entrées dans la table purchase_requests
INSERT INTO `purchase_requests` (`id`, `user_id`, `title`, `description`, `status_id`, `type_marche_id`, `created_at`, `updated_at`) VALUES
(1, 1, 'Achat de chaises', 'Chaises pour la salle de réunion', 3, 2, NOW(), NOW()),
(2, 1, 'Commande de PC portables', '5 PC portables pour les nouveaux employés', 4, 1, NOW(), NOW()),
(3, 2, 'Matériel sanitaire', 'Réapprovisionnement de savon et papier', 2, 3, NOW(), NOW()),
(4, 2, 'Achat projecteur', 'Projecteur pour salle de conférence', 1, 1, NOW(), NOW()),
(5, 3, 'Bureau ergonomique', 'Nouveau bureau pour le manager', 5, 2, NOW(), NOW());
