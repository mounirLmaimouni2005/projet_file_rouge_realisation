<?php
require_once '../database/database_connect.php';

$sql = "SELECT 
            a.id_annonce,
            a.titre,
            a.prix,
            a.etat,
            a.statut,
            a.photo,
            a.date_publication,
            c.categorie,
            v.ville
        FROM annonces a
        INNER JOIN categories c ON a.id_categorie = c.id_categorie
        INNER JOIN villes v ON a.id_ville = v.id_ville
        ORDER BY a.date_publication DESC";

$stmt = $pdo->query($sql);
$annonces = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechSwap - Mes annonces</title>
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
        .product-image {
            width: 80px;
            height: 60px;
            object-fit: cover;
            border-radius: 8px;
        }
        .table th {
            white-space: nowrap;
        }
        .badge {
            font-size: 0.8rem;
        }
    </style>
</head>

<body>

<div class="container py-5">
    <div class="card modern-card">
        <div class="card-header-custom d-flex justify-content-between align-items-center">
            <div>
                <h3 class="mb-1 fw-bold">
                    <i class="fa-solid fa-list me-2"></i> Mes annonces
                </h3>
                <p class="mb-0 small text-white-50">TechSwap Morocco</p>
            </div>
            <a href="add_annonce.php" class="btn btn-light rounded-pill px-4 fw-semibold">
                <i class="fa-solid fa-plus me-1"></i> Ajouter une annonce
            </a>
        </div>

        <div class="card-body p-4">
            <?php if (empty($annonces)): ?>
                <div class="text-center py-5">
                    <i class="fa-solid fa-box-open fa-3x text-secondary mb-3"></i>
                    <h5>Aucune annonce disponible</h5>
                    <p class="text-muted">Vous n'avez pas encore publié d'annonce.</p>
                    <a href="add_annonce.php" class="btn btn-primary rounded-pill px-4">
                        <i class="fa-solid fa-plus me-1"></i> Ajouter une annonce
                    </a>
                </div>
            <?php else: ?>
                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Photo</th>
                                <th>Titre</th>
                                <th>Catégorie</th>
                                <th>Ville</th>
                                <th>Prix</th>
                                <th>État</th>
                                <th>Statut</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        <?php foreach ($annonces as $annonce): ?>
                            <tr>
                                <td><?= htmlspecialchars($annonce['id_annonce']) ?></td>
                                <td>
                                    <?php if (!empty($annonce['photo'])): ?>
                                        <img src="<?= htmlspecialchars($annonce['photo']) ?>" alt="Photo" class="product-image">
                                    <?php else: ?>
                                        <span class="text-muted small">Pas de photo</span>
                                    <?php endif; ?>
                                </td>
                                <td><strong><?= htmlspecialchars($annonce['titre']) ?></strong></td>
                                <td><?= htmlspecialchars($annonce['categorie']) ?></td>
                                <td><?= htmlspecialchars($annonce['ville']) ?></td>
                                <td><strong><?= number_format($annonce['prix'], 2, ',', ' ') ?> MAD</strong></td>
                                <td>
                                    <?php
                                    $etatLabels = [
                                        'like_new'     => 'Comme neuf',
                                        'good'         => 'Bon état',
                                        'fair'         => 'État moyen',
                                        'needs_repair' => 'À réparer'
                                    ];
                                    echo htmlspecialchars($etatLabels[$annonce['etat']] ?? $annonce['etat']);
                                    ?>
                                </td>
                                <td>
                                    <?php if ($annonce['statut'] === 'available'): ?>
                                        <span class="badge bg-success">Disponible</span>
                                    <?php else: ?>
                                        <span class="badge bg-secondary">Vendu</span>
                                    <?php endif; ?>
                                </td>
                                <td><?= htmlspecialchars($annonce['date_publication']) ?></td>
                                <td>
                                    <div class="d-flex gap-2">
                                        <a href="edit_annonce.php?id=<?= $annonce['id_annonce'] ?>" class="btn btn-sm btn-outline-primary" title="Modifier">
                                            <i class="fa-solid fa-pen"></i>
                                        </a>
                                        <a href="delete_annonce.php?id=<?= $annonce['id_annonce'] ?>" class="btn btn-sm btn-outline-danger" title="Supprimer" onclick="return confirm('Voulez-vous vraiment supprimer cette annonce ?');">
                                            <i class="fa-solid fa-trash"></i>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>