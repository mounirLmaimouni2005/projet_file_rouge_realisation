<?php
require_once '../database/database_connect.php';

if (!isset($_GET['id']) || empty($_GET['id'])) {
    header('Location: list_annonces.php');
    exit;
}

$id_annonce = (int) $_GET['id'];


$stmtSelect = $pdo->prepare("SELECT photo FROM annonces WHERE id_annonce = ?");
$stmtSelect->execute([$id_annonce]);
$annonce = $stmtSelect->fetch(PDO::FETCH_ASSOC);

if ($annonce) {
   
    if (!empty($annonce['photo']) && file_exists($annonce['photo'])) {
        @unlink($annonce['photo']);
    }

   
    $stmtDelete = $pdo->prepare("DELETE FROM annonces WHERE id_annonce = ?");
    $stmtDelete->execute([$id_annonce]);
}


header('Location: list_annonces.php');
exit;