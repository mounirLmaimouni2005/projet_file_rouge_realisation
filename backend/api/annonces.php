<?php

/**
 * annonces.php — JSON REST API for the `annonces` resource.
 *
 * Supported endpoints:
 *
 *   GET    /backend/api/annonces.php                   List all annonces
 *   GET    /backend/api/annonces.php?id=X              Get one annonce
 *   GET    /backend/api/annonces.php?action=categories List categories (for forms)
 *   GET    /backend/api/annonces.php?action=villes     List villes (for forms)
 *   POST   /backend/api/annonces.php                   Create annonce (multipart/form-data)
 *   POST   /backend/api/annonces.php?id=X (_method=PUT) Update annonce (multipart/form-data)
 *   DELETE /backend/api/annonces.php?id=X              Delete annonce
 *
 * HTTP Method Override:
 *   PUT is sent as POST + FormData field _method=PUT because PHP does not
 *   populate $_FILES or $_POST for native PUT multipart requests.
 *
 * Response envelope:
 *   { "success": true,  "data": {...} }        on success
 *   { "success": false, "error": "..." }       on failure
 *
 * Requires PHP 8.0+
 */

// ── Output headers ────────────────────────────────────────────────────────────
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');                           // allow browser fetch from any origin (local dev)
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-HTTP-Method-Override');

// CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────
require_once dirname(__DIR__) . '/config/Database.php';
require_once dirname(__DIR__) . '/classes/Annonce.php';

try {
    $db  = new Database();
    $pdo = $db->getConnection();
} catch (PDOException $e) {
    http_response_code(503);
    echo json_encode([
        'success' => false,
        'error'   => 'Impossible de se connecter à la base de données.',
    ]);
    exit;
}

$model = new Annonce($pdo);

// ── Method resolution (with PUT override support) ─────────────────────────────
$method = strtoupper($_SERVER['REQUEST_METHOD']);

// JS sends POST + FormData field _method=PUT when updating with a file
if ($method === 'POST' && !empty($_POST['_method'])) {
    $method = strtoupper(trim((string) $_POST['_method']));
}

// ── Route parameters ──────────────────────────────────────────────────────────
$id     = (isset($_GET['id']) && ctype_digit((string) $_GET['id']))
            ? (int) $_GET['id']
            : null;

$action = $_GET['action'] ?? null;  // 'categories' | 'villes' | null

// ── Upload helper ─────────────────────────────────────────────────────────────

/**
 * Handle the uploaded 'photo' file.
 * - Returns the relative path stored in DB  (e.g. 'uploads/img_xxx.png')
 * - Returns false when no file was sent (UPLOAD_ERR_NO_FILE)
 * - Throws RuntimeException on any other error
 */
function handleUpload(): string|false
{
    if (!isset($_FILES['photo']) || $_FILES['photo']['error'] === UPLOAD_ERR_NO_FILE) {
        return false;
    }

    if ($_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
        throw new \RuntimeException(
            "Erreur lors de l'envoi de la photo (code PHP : {$_FILES['photo']['error']})."
        );
    }

    // 5 MB cap
    if ($_FILES['photo']['size'] > 5 * 1024 * 1024) {
        throw new \RuntimeException('La photo ne doit pas dépasser 5 Mo.');
    }

    // Extension allow-list
    $ext          = strtolower(pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION));
    $allowedExts  = ['jpg', 'jpeg', 'png', 'webp'];
    if (!in_array($ext, $allowedExts, true)) {
        throw new \RuntimeException('Format non autorisé. Utilisez JPG, PNG ou WEBP.');
    }

    // Real MIME check (prevents disguised uploads)
    $finfo        = new finfo(FILEINFO_MIME_TYPE);
    $mime         = $finfo->file($_FILES['photo']['tmp_name']);
    $allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!in_array($mime, $allowedMimes, true)) {
        throw new \RuntimeException('Type de fichier non autorisé.');
    }

    // Ensure the upload directory exists
    $uploadDir = dirname(__DIR__) . '/uploads/';
    if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true)) {
        throw new \RuntimeException("Impossible de créer le dossier d'upload.");
    }

    $filename = uniqid('img_', true) . '.' . $ext;
    $destPath = $uploadDir . $filename;

    if (!move_uploaded_file($_FILES['photo']['tmp_name'], $destPath)) {
        throw new \RuntimeException("Impossible d'enregistrer la photo sur le serveur.");
    }

    // Return the path relative to backend/  — what gets stored in the DB
    return 'uploads/' . $filename;
}

/**
 * Remove a photo file from disk.
 * Silently ignores missing files.
 *
 * @param string $dbPath  Relative path as stored in DB (e.g. 'uploads/img_xxx.png')
 */
function deletePhotoFile(string $dbPath): void
{
    if ($dbPath === '') return;
    $fullPath = dirname(__DIR__) . '/' . $dbPath;
    if (file_exists($fullPath)) {
        @unlink($fullPath);
    }
}

/**
 * Build an absolute public URL for a photo.
 * E.g. http://localhost/projet_file_rouge_realisation/backend/uploads/img_xxx.png
 *
 * @param  string|null $dbPath  Value stored in the `photo` DB column.
 * @return string|null
 */
function buildPhotoUrl(?string $dbPath): ?string
{
    if (empty($dbPath)) return null;

    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host   = $_SERVER['HTTP_HOST'] ?? 'localhost';

    // SCRIPT_NAME = /project_dir/backend/api/annonces.php
    // Two dirname() calls → /project_dir/backend
    $backendPath = dirname(dirname($_SERVER['SCRIPT_NAME']));

    return $scheme . '://' . $host . $backendPath . '/' . $dbPath;
}

// ── Router ────────────────────────────────────────────────────────────────────
try {

    switch ($method) {

        // ─────────────────────────────────────────────────────────────────────
        case 'GET':
        // ─────────────────────────────────────────────────────────────────────

            // Sub-resources for form dropdowns
            if ($action === 'categories') {
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'data'    => $model->getCategories(),
                ]);
                break;
            }

            if ($action === 'villes') {
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'data'    => $model->getVilles(),
                ]);
                break;
            }

            if ($id !== null) {
                // ── GET single ────────────────────────────────────────────────
                $annonce = $model->getOne($id);
                if ($annonce === false) {
                    http_response_code(404);
                    echo json_encode(['success' => false, 'error' => 'Annonce introuvable.']);
                    break;
                }
                $annonce['photo_url'] = buildPhotoUrl($annonce['photo']);
                http_response_code(200);
                echo json_encode(['success' => true, 'data' => $annonce]);

            } else {
                // ── GET all ───────────────────────────────────────────────────
                $annonces = $model->getAll();
                foreach ($annonces as &$a) {
                    $a['photo_url'] = buildPhotoUrl($a['photo']);
                }
                unset($a);
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'count'   => count($annonces),
                    'data'    => $annonces,
                ]);
            }
            break;

        // ─────────────────────────────────────────────────────────────────────
        case 'POST':
        // ─────────────────────────────────────────────────────────────────────

            $photoPath = handleUpload();

            if ($photoPath === false) {
                http_response_code(422);
                echo json_encode(['success' => false, 'error' => 'La photo est obligatoire pour créer une annonce.']);
                break;
            }

            $newId   = $model->create([
                'id_utilisateur' => 1,                                   // hardcoded until auth phase
                'id_categorie'   => (int)($_POST['id_categorie'] ?? 0),
                'id_ville'       => (int)($_POST['id_ville']     ?? 0),
                'titre'          => trim((string)($_POST['titre']       ?? '')),
                'description'    => trim((string)($_POST['description'] ?? '')),
                'prix'           => $_POST['prix'] ?? 0,
                'etat'           => $_POST['etat'] ?? '',
                'photo'          => $photoPath,
            ]);

            $created = $model->getOne($newId);
            $created['photo_url'] = buildPhotoUrl($created['photo']);

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Annonce créée avec succès.',
                'data'    => $created,
            ]);
            break;

        // ─────────────────────────────────────────────────────────────────────
        case 'PUT':
        // ─────────────────────────────────────────────────────────────────────

            if ($id === null) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => "L'identifiant de l'annonce est requis."]);
                break;
            }

            // Grab the current record so we can delete the old photo if replaced
            $existing = $model->getOne($id);
            if ($existing === false) {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Annonce introuvable.']);
                break;
            }

            $newPhotoPath = handleUpload();      // false = no new file

            $updateData = [
                'titre'        => trim((string)($_POST['titre']       ?? '')),
                'description'  => trim((string)($_POST['description'] ?? '')),
                'prix'         => $_POST['prix']          ?? 0,
                'etat'         => $_POST['etat']          ?? '',
                'statut'       => $_POST['statut']        ?? '',
                'id_categorie' => (int)($_POST['id_categorie'] ?? 0),
                'id_ville'     => (int)($_POST['id_ville']     ?? 0),
            ];

            // Only override photo key when a new file was uploaded
            if ($newPhotoPath !== false) {
                $updateData['photo'] = $newPhotoPath;
            }

            $model->update($id, $updateData);

            // Remove old photo from disk ONLY after a successful DB update
            if ($newPhotoPath !== false && !empty($existing['photo'])) {
                deletePhotoFile($existing['photo']);
            }

            $updated = $model->getOne($id);
            $updated['photo_url'] = buildPhotoUrl($updated['photo']);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Annonce mise à jour avec succès.',
                'data'    => $updated,
            ]);
            break;

        // ─────────────────────────────────────────────────────────────────────
        case 'DELETE':
        // ─────────────────────────────────────────────────────────────────────

            if ($id === null) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => "L'identifiant de l'annonce est requis."]);
                break;
            }

            $deleted = $model->delete($id);

            if ($deleted === false) {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Annonce introuvable.']);
                break;
            }

            // Delete photo AFTER the DB row is gone
            if (!empty($deleted['photo'])) {
                deletePhotoFile($deleted['photo']);
            }

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Annonce supprimée avec succès.',
            ]);
            break;

        // ─────────────────────────────────────────────────────────────────────
        default:
        // ─────────────────────────────────────────────────────────────────────
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Méthode HTTP non supportée.']);
    }

} catch (\InvalidArgumentException $e) {
    // Validation errors → 422 Unprocessable Entity
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);

} catch (\RuntimeException $e) {
    // Upload / filesystem errors → 400 Bad Request
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);

} catch (\PDOException $e) {
    // Database errors → 500 (message kept server-side in production)
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error'   => 'Erreur base de données.',
        'detail'  => $e->getMessage(),      // remove in production
    ]);

} catch (\Throwable $e) {
    // Catch-all
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error'   => 'Erreur interne du serveur.',
        'detail'  => $e->getMessage(),      // remove in production
    ]);
}
