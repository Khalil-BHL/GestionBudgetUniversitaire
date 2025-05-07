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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type_marche_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (status_id) REFERENCES statuses(id),
    FOREIGN KEY (type_marche_id) REFERENCES type_marches(id)
);



-- Create notifications table
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    request_id INT,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
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
    status VARCHAR(255),
    comment TEXT,
    validated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES purchase_requests(id)
);
-- the database is fully inserted

-- saisir des entrées dans la table purchase_requests
INSERT INTO `purchase_requests` (`id`, `user_id`, `title`, `description`, `status_id`, `type_marche_id`, `created_at`, `updated_at`) VALUES
(1, 1, 'Achat de chaises', 'Chaises pour la salle de réunion', 3, 2, NOW(), NOW()),
(2, 1, 'Commande de PC portables', '5 PC portables pour les nouveaux employés', 4, 1, NOW(), NOW()),
(3, 2, 'Matériel sanitaire', 'Réapprovisionnement de savon et papier', 2, 3, NOW(), NOW()),
(4, 2, 'Achat projecteur', 'Projecteur pour salle de conférence', 1, 1, NOW(), NOW()),
(5, 3, 'Bureau ergonomique', 'Nouveau bureau pour le manager', 5, 2, NOW(), NOW());
