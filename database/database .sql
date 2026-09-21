-- =========================================================
-- TechSwap Morocco
-- Technical relational schema
-- =========================================================

CREATE DATABASE IF NOT EXISTS techswap_morocco
    DEFAULT CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE techswap_morocco;


-- =========================================================
-- 1. UTILISATEUR
-- =========================================================

CREATE TABLE utilisateurs (
    id_utilisateur INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom_complet VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    role ENUM('admin', 'seller', 'buyer') NOT NULL DEFAULT 'buyer',
    telephone VARCHAR(20) NOT NULL,
    date_creation_compte DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 2. CATEGORIE
-- =========================================================

CREATE TABLE categories (
    id_categorie SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    categorie VARCHAR(150) NOT NULL UNIQUE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 3. VILLE
-- =========================================================

CREATE TABLE villes (
    id_ville SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ville VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 4. ANNONCE
-- =========================================================

CREATE TABLE annonces (
    id_annonce INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    prix DECIMAL(10,2) UNSIGNED NOT NULL,
    etat ENUM('like_new', 'good', 'fair', 'needs_repair') NOT NULL,
    statut ENUM('available', 'sold') NOT NULL DEFAULT 'available',
    photo VARCHAR(255) NOT NULL,
    date_publication DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modification DATETIME NULL DEFAULT NULL,
    date_vente DATETIME NULL DEFAULT NULL,

    id_utilisateur INT UNSIGNED NOT NULL,
    id_categorie SMALLINT UNSIGNED NOT NULL,
    id_ville SMALLINT UNSIGNED NOT NULL,

    CONSTRAINT fk_annonce_utilisateur
        FOREIGN KEY (id_utilisateur)
        REFERENCES utilisateurs(id_utilisateur)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_annonce_categorie
        FOREIGN KEY (id_categorie)
        REFERENCES categories(id_categorie)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_annonce_ville
        FOREIGN KEY (id_ville)
        REFERENCES villes(id_ville)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    INDEX idx_annonces_utilisateur (id_utilisateur),
    INDEX idx_annonces_categorie (id_categorie),
    INDEX idx_annonces_ville (id_ville),
    INDEX idx_annonces_statut (statut),
    INDEX idx_annonces_prix (prix)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 5. SEED : 13 CATEGORIES FIXES
-- =========================================================

INSERT INTO categories (categorie) VALUES
('Smartphones & Tablets'),
('Computers & IT'),
('Household Appliances - Domestique'),
('TV & Audio'),
('Pro & Commercial Gear - HoReCa/POS/Vitrines'),
('Gaming & Consoles'),
('Cameras & Creator Gear'),
('Green Energy & Smart Home'),
('Networking & Telecom'),
('DIY, Repair & Lab Tools'),
('Pro Audio & Live Events'),
('Edge Computing & Mini-Data/NAS'),
('Micro-Mobility Tech - Trottinettes/E-bikes');


-- =========================================================
-- 6. SEED : GRANDES VILLES MAROCAINES
-- =========================================================

INSERT INTO villes (ville) VALUES
('Casablanca'),
('Rabat'),
('Marrakech'),
('Tanger'),
('Agadir'),
('Fès'),
('Meknès'),
('Oujda'),
('Kenitra'),
('Tétouan'),
('Safi'),
('El Jadida'),
('Béni Mellal'),
('Nador'),
('Mohammedia'),
('Khouribga'),
('Settat'),
('Essaouira'),
('Ifrane'),
('Laâyoune'),
('Dakhla');


-- =========================================================
-- NOTE :
-- message_whatsapp et lien_whatsapp ne sont pas stockés.
-- Ils sont dérivés dynamiquement à partir de telephone,
-- titre et prix selon les DF établies.
-- =========================================================


SHOW TABLES;