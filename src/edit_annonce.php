<?php
require_once '../database/database_connect.php';


if (!isset($_GET['id']) || empty($_GET['id'])) {
    header('Location: list_annonces.php');
    exit;
}

$id_annonce = (int) $_GET['id'];


$stmt = $pdo->prepare("SELECT * FROM annonces WHERE id_annonce = ?");
$stmt->execute([$id_annonce]);
$annonce = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$annonce) {
    die("Annonce introuvable !");
}


$categories = $pdo->query("SELECT id_categorie, categorie FROM categories ORDER BY categorie ASC")->fetchAll(PDO::FETCH_ASSOC);
$villes     = $pdo->query("SELECT id_ville, ville FROM villes ORDER BY ville ASC")->fetchAll(PDO::FETCH_ASSOC);

$error = '';
$success = '';


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $titre        = trim($_POST['titre'] ?? '');
    $description  = trim($_POST['description'] ?? '');
    $prix         = trim($_POST['prix'] ?? '');
    $etat         = $_POST['etat'] ?? 'good';
    $statut       = $_POST['statut'] ?? 'available';
    $id_categorie = (int) ($_POST['id_categorie'] ?? 0);
    $id_ville     = (int) ($_POST['id_ville'] ?? 0);
    
    $photoPath = $annonce['photo'];

   
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath   = $_FILES['photo']['tmp_name'];
        $fileName      = $_FILES['photo']['name'];
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        
        $allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
        if (in_array($fileExtension, $allowedExts)) {
            $newFileName = 'annonce_' . time() . '.' . $fileExtension;
            $uploadFileDir = '../uploads/';
            
            
            if (!is_dir($uploadFileDir)) {
                mkdir($uploadFileDir, 0755, true);
            }
            
            $dest_path = $uploadFileDir . $newFileName;
            if (move_uploaded_file($fileTmpPath, $dest_path)) {
                
                if (!empty($annonce['photo']) && file_exists($annonce['photo'])) {
                    @unlink($annonce['photo']);
                }
                $photoPath = $dest_path;
            }
        } else {
            $error = "Format de photo non autorisé (JPG, PNG, WEBP uniquement).";
        }
    }

    if (empty($titre) || empty($prix) || $id_categorie <= 0 || $id_ville <= 0) {
        $error = "Veuillez remplir tous les champs obligatoires.";
    }

    if (empty($error)) {
        $updateStmt = $pdo->prepare("UPDATE annonces SET 
            titre = ?, 
            description = ?, 
            prix = ?, 
            etat = ?, 
            statut = ?, 
            id_categorie = ?, 
            id_ville = ?, 
            photo = ? 
            WHERE id_annonce = ?");
        
        $updateStmt->execute([
            $titre,
            $description,
            $prix,
            $etat,
            $statut,
            $id_categorie,
            $id_ville,
            $photoPath,
            $id_annonce
        ]);

        $success = "Annonce modifiée avec succès !";
        

        $stmt->execute([$id_annonce]);
        $annonce = $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechSwap - Modifier l'annonce</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        body { background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .modern-card { border: none; border-radius: 1rem; box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.08); overflow: hidden; }
        .card-header-custom { background: linear-gradient(135deg, #0d6efd, #0dcaf0); color: white; padding: 1.5rem; }
        .preview-img { width: 100px; height: 80px; object-fit: cover; border-radius: 8px; }
    </style>
</head>
<body>

<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <div class="card modern-card">
                <div class="card-header-custom d-flex justify-content-between align-items-center">
                    <h3 class="mb-0 fw-bold"><i class="fa-solid fa-pen-to-square me-2"></i>Modifier l'annonce</h3>
                    <a href="list_annonces.php" class="btn btn-light btn-sm rounded-pill px-3">
                        <i class="fa-solid fa-arrow-left me-1"></i>Retour
                    </a>
                </div>

                <div class="card-body p-4">
                    <?php if (!empty($error)): ?>
                        <div class="alert alert-danger"><?= htmlspecialchars($error) ?></div>
                    <?php endif; ?>

                    <?php if (!empty($success)): ?>
                        <div class="alert alert-success"><?= htmlspecialchars($success) ?></div>
                    <?php endif; ?>

                    <form action="" method="POST" enctype="multipart/form-data">
                        <div class="mb-3">
                            <label class="form-label fw-semibold">Titre de l'annonce *</label>
                            <input type="text" name="titre" class="form-control" value="<?= htmlspecialchars($annonce['titre']) ?>" required>
                        </div>

                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Catégorie *</label>
                                <select name="id_categorie" class="form-select" required>
                                    <?php foreach ($categories as $cat): ?>
                                        <option value="<?= $cat['id_categorie'] ?>" <?= ($annonce['id_categorie'] == $cat['id_categorie']) ? 'selected' : '' ?>>
                                            <?= htmlspecialchars($cat['categorie']) ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Ville *</label>
                                <select name="id_ville" class="form-select" required>
                                    <?php foreach ($villes as $v): ?>
                                        <option value="<?= $v['id_ville'] ?>" <?= ($annonce['id_ville'] == $v['id_ville']) ? 'selected' : '' ?>>
                                            <?= htmlspecialchars($v['ville']) ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                        </div>

                        <div class="row mb-3">
                            <div class="col-md-4">
                                <label class="form-label fw-semibold">Prix (MAD) *</label>
                                <input type="number" step="0.01" name="prix" class="form-control" value="<?= htmlspecialchars($annonce['prix']) ?>" required>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-semibold">État *</label>
                                <select name="etat" class="form-select">
                                    <option value="like_new"     <?= $annonce['etat'] === 'like_new' ? 'selected' : '' ?>>Comme neuf</option>
                                    <option value="good"         <?= $annonce['etat'] === 'good' ? 'selected' : '' ?>>Bon état</option>
                                    <option value="fair"         <?= $annonce['etat'] === 'fair' ? 'selected' : '' ?>>État moyen</option>
                                    <option value="needs_repair" <?= $annonce['etat'] === 'needs_repair' ? 'selected' : '' ?>>À réparer</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-semibold">Statut *</label>
                                <select name="statut" class="form-select">
                                    <option value="available" <?= $annonce['statut'] === 'available' ? 'selected' : '' ?>>Disponible</option>
                                    <option value="sold"      <?= $annonce['statut'] === 'sold' ? 'selected' : '' ?>>Vendu</option>
                                </select>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-semibold">Description</label>
                            <textarea name="description" class="form-control" rows="4"><?= htmlspecialchars($annonce['description'] ?? '') ?></textarea>
                        </div>

                        <div class="mb-4">
                            <label class="form-label fw-semibold">Photo actuelle / Modifier</label>
                            <div class="d-flex align-items-center gap-3">
                                <?php if (!empty($annonce['photo'])): ?>
                                    <img src="<?= htmlspecialchars($annonce['photo']) ?>" alt="Photo" class="preview-img">
                                <?php endif; ?>
                                <input type="file" name="photo" class="form-control" accept="image/*">
                            </div>
                        </div>

                        <div class="d-flex justify-content-end gap-2">
                            <a href="list_annonces.php" class="btn btn-secondary rounded-pill px-4">Annuler</a>
                            <button type="submit" class="btn btn-primary rounded-pill px-4">
                                <i class="fa-solid fa-save me-1"></i>Enregistrer les modifications
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>