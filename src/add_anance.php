<?php
require_once '../database/database_connect.php';


$categories = $pdo->query("SELECT id_categorie, categorie FROM categories ORDER BY categorie ASC")->fetchAll(PDO::FETCH_ASSOC);
$villes     = $pdo->query("SELECT id_ville, ville FROM villes ORDER BY ville ASC")->fetchAll(PDO::FETCH_ASSOC);

$errorMsg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $titre          = trim($_POST['titre'] ?? '');
    $description    = trim($_POST['description'] ?? '');
    $prix           = $_POST['prix'] ?? 0;
    $etat           = $_POST['etat'] ?? '';
    $id_categorie   = intval($_POST['id_categorie'] ?? 0);
    $id_ville       = intval($_POST['id_ville'] ?? 0);
    $id_utilisateur = 1; // Default hardcoded user ID

    // Validation Image
    if (!isset($_FILES['photo']) || $_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
        $errorMsg = "Veuillez sélectionner une photo valide.";
    } else {
        $uploadDir = 'uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        $ext = strtolower(pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION));
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
        
        if (!in_array($ext, $allowedExtensions)) {
            $errorMsg = "Format de photo non autorisé (JPG, JPEG, PNG, WEBP).";
        } else {
            $photoPath = $uploadDir . uniqid('img_', true) . '.' . $ext;
            if (!move_uploaded_file($_FILES['photo']['tmp_name'], $photoPath)) {
                $errorMsg = "Impossible de déplacer la photo.";
            }
        }
    }

    if (empty($errorMsg)) {
        $sql = "INSERT INTO annonces 
                (id_utilisateur, id_categorie, id_ville, titre, description, prix, etat, statut, photo)
                VALUES 
                (:id_utilisateur, :id_categorie, :id_ville, :titre, :description, :prix, :etat, 'available', :photo)";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id_utilisateur' => $id_utilisateur,
            ':id_categorie'   => $id_categorie,
            ':id_ville'       => $id_ville,
            ':titre'          => $titre,
            ':description'    => $description,
            ':prix'           => $prix,
            ':etat'           => $etat,
            ':photo'          => $photoPath
        ]);

        header('Location: list_annonces.php');
        exit;
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechSwap - Ajouter une annonce</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #f8f9fa;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .modern-card {
            border: none;
            border-radius: 1rem;
            box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.08);
            overflow: hidden;
        }
        .card-header-custom {
            background: linear-gradient(135deg, #0d6efd, #0dcaf0);
            color: white;
            padding: 1.5rem;
        }
        .form-label {
            font-weight: 600;
            color: #343a40;
            font-size: 0.9rem;
        }
        .form-control, .form-select {
            border-radius: 0.5rem;
            padding: 0.65rem 0.90rem;
            border-color: #dee2e6;
        }
        .form-control:focus, .form-select:focus {
            box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
        }
    </style>
</head>
<body>

<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <div class="card modern-card">
                <div class="card-header-custom text-center">
                    <h3 class="mb-0 fw-bold"><i class="fa-solid fa-plus-circle me-2"></i>Publier une annonce</h3>
                    <p class="mb-0 text-white-55 small">TechSwap Morocco - Espace Vendeur</p>
                </div>
                
                <div class="card-body p-4 p-md-5 bg-white">
                    <?php if (!empty($errorMsg)): ?>
                        <div class="alert alert-danger d-flex align-items-center mb-4 rounded-3" role="alert">
                            <i class="fa-solid fa-triangle-exclamation me-2"></i>
                            <div><?= htmlspecialchars($errorMsg) ?></div>
                        </div>
                    <?php endif; ?>

                    <form action="" method="POST" enctype="multipart/form-data">
                        
                        <div class="mb-3">
                            <label for="titre" class="form-label">Titre de l'annonce</label>
                            <input type="text" name="titre" id="titre" class="form-control" placeholder="Ex: iPhone 14 Pro Max 256GB" required>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="id_categorie" class="form-label">Catégorie</label>
                                <select name="id_categorie" id="id_categorie" class="form-select" required>
                                    <option value="">-- Choisir --</option>
                                    <?php foreach ($categories as $cat): ?>
                                        <option value="<?= $cat['id_categorie'] ?>"><?= htmlspecialchars($cat['categorie']) ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>

                            <div class="col-md-6 mb-3">
                                <label for="id_ville" class="form-label">Ville</label>
                                <select name="id_ville" id="id_ville" class="form-select" required>
                                    <option value="">-- Choisir une ville --</option>
                                    <?php foreach ($villes as $v): ?>
                                        <option value="<?= $v['id_ville'] ?>"><?= htmlspecialchars($v['ville']) ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="prix" class="form-label">Prix (MAD)</label>
                                <div class="input-group">
                                    <input type="number" name="prix" id="prix" class="form-control" step="0.01" placeholder="0.00" required>
                                    <span class="input-group-text">MAD</span>
                                </div>
                            </div>

                            <div class="col-md-6 mb-3">
                                <label for="etat" class="form-label">État du produit</label>
                                <select name="etat" id="etat" class="form-select" required>
                                    <option value="like_new">Comme neuf</option>
                                    <option value="good" selected>Bon état</option>
                                    <option value="fair">État moyen</option>
                                    <option value="needs_repair">À réparer</option>
                                </select>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="description" class="form-label">Description détaillée</label>
                            <textarea name="description" id="description" class="form-control" rows="4" placeholder="Précisez les caractéristiques, l'autonomie, les accessoires..." required></textarea>
                        </div>

                        <div class="mb-4">
                            <label for="photo" class="form-label">Photo du produit</label>
                            <input type="file" name="photo" id="photo" class="form-control" accept="image/*" required>
                            <div class="form-text">Formats acceptés : JPG, JPEG, PNG, WEBP.</div>
                        </div>

                        <div class="d-flex justify-content-between align-items-center pt-3 border-top">
                            <a href="list_annonces.php" class="btn btn-outline-secondary rounded-pill px-4">
                                <i class="fa-solid fa-arrow-left me-1"></i> Retour
                            </a>
                            <button type="submit" class="btn btn-primary rounded-pill px-5 fw-semibold shadow-sm">
                                <i class="fa-solid fa-check me-1"></i> Publier
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