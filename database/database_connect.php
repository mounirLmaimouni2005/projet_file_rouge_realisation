<?php

$host = "localhost";
$dbname = "techswap_morocco";
$username = "root";
$password = "";
$charset = "utf8mb4";

$dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";

$pdo = new PDO($dsn, $username, $password, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
]);

// Usage test:
try {
    
    //echo "Database connected successfully.";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}