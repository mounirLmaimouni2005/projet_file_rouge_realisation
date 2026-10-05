<?php

/**
 * Annonce — Model class for the `annonces` table.
 *
 * Responsibilities:
 *   - All SQL queries against annonces, categories, villes.
 *   - Input validation (throws InvalidArgumentException on failure).
 *   - No HTTP logic, no file I/O — that stays in the API layer.
 *
 * Requires PHP 8.0+  (union types: array|false, string|null)
 */
class Annonce
{
    // ENUM values mirroring the DB schema exactly
    private const VALID_ETATS   = ['like_new', 'good', 'fair', 'needs_repair'];
    private const VALID_STATUTS = ['available', 'sold'];

    public function __construct(private PDO $pdo) {}

    // ─────────────────────────────────────────────────────────────────────────
    // READ
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Return every annonce with its category and city names.
     * Ordered most-recent first (matches legacy list_annonces.php behaviour).
     *
     * @return array<int, array<string, mixed>>
     */
    public function getAll(): array
    {
        $sql = '
            SELECT
                a.id_annonce,
                a.titre,
                a.description,
                a.prix,
                a.etat,
                a.statut,
                a.photo,
                a.date_publication,
                a.date_modification,
                a.id_utilisateur,
                a.id_categorie,
                a.id_ville,
                c.categorie,
                v.ville
            FROM annonces a
            INNER JOIN categories c ON a.id_categorie = c.id_categorie
            INNER JOIN villes     v ON a.id_ville     = v.id_ville
            ORDER BY a.date_publication DESC
        ';

        return $this->pdo->query($sql)->fetchAll();
    }

    /**
     * Return a single annonce (with seller phone for WhatsApp link generation).
     * Returns false when the ID does not exist.
     *
     * @return array<string, mixed>|false
     */
    public function getOne(int $id): array|false
    {
        $sql = '
            SELECT
                a.id_annonce,
                a.titre,
                a.description,
                a.prix,
                a.etat,
                a.statut,
                a.photo,
                a.date_publication,
                a.date_modification,
                a.id_utilisateur,
                a.id_categorie,
                a.id_ville,
                c.categorie,
                v.ville,
                u.nom_complet,
                u.telephone
            FROM annonces a
            INNER JOIN categories  c ON a.id_categorie    = c.id_categorie
            INNER JOIN villes      v ON a.id_ville         = v.id_ville
            INNER JOIN utilisateurs u ON a.id_utilisateur  = u.id_utilisateur
            WHERE a.id_annonce = :id
            LIMIT 1
        ';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $id]);
        return $stmt->fetch();          // PDO::FETCH_ASSOC set globally; fetch() returns false when empty
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CREATE
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Insert a new annonce.
     *
     * @param  array<string, mixed> $data  Validated field set (photo already saved to disk).
     * @return int                         Last inserted ID.
     * @throws \InvalidArgumentException   On validation failure.
     */
    public function create(array $data): int
    {
        $this->validateFields($data, requirePhoto: true);

        $sql = '
            INSERT INTO annonces
                (id_utilisateur, id_categorie, id_ville, titre, description, prix, etat, statut, photo)
            VALUES
                (:id_utilisateur, :id_categorie, :id_ville, :titre, :description, :prix, :etat, \'available\', :photo)
        ';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':id_utilisateur' => (int) $data['id_utilisateur'],
            ':id_categorie'   => (int) $data['id_categorie'],
            ':id_ville'       => (int) $data['id_ville'],
            ':titre'          => trim((string) $data['titre']),
            ':description'    => trim((string) $data['description']),
            ':prix'           => (float) $data['prix'],
            ':etat'           => $data['etat'],
            ':photo'          => $data['photo'],
        ]);

        return (int) $this->pdo->lastInsertId();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // UPDATE
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Update an existing annonce.
     *
     * - If $data['photo'] is provided, it replaces the stored path.
     * - If omitted, the existing photo is preserved.
     * - date_modification is always set to NOW() (fixes the legacy bug).
     *
     * @param  array<string, mixed> $data
     * @return bool  false when the ID does not exist.
     * @throws \InvalidArgumentException  On validation failure.
     */
    public function update(int $id, array $data): bool
    {
        // Verify the record exists and grab its current photo path
        $existing = $this->getOne($id);
        if ($existing === false) {
            return false;
        }

        // Validation (photo not required on edit)
        $this->validateFields($data, requirePhoto: false);

        // Resolve statut
        $statut = $data['statut'] ?? $existing['statut'];
        if (!in_array($statut, self::VALID_STATUTS, true)) {
            throw new \InvalidArgumentException('Statut invalide.');
        }

        // Keep old photo if no new one was provided
        $photo = $data['photo'] ?? $existing['photo'];

        $sql = '
            UPDATE annonces SET
                titre             = :titre,
                description       = :description,
                prix              = :prix,
                etat              = :etat,
                statut            = :statut,
                id_categorie      = :id_categorie,
                id_ville          = :id_ville,
                photo             = :photo,
                date_modification = NOW()
            WHERE id_annonce = :id
        ';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':titre'        => trim((string) $data['titre']),
            ':description'  => trim((string) $data['description']),
            ':prix'         => (float) $data['prix'],
            ':etat'         => $data['etat'],
            ':statut'       => $statut,
            ':id_categorie' => (int) $data['id_categorie'],
            ':id_ville'     => (int) $data['id_ville'],
            ':photo'        => $photo,
            ':id'           => $id,
        ]);

        return true;    // execute() throws on error; reaching here means success
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DELETE
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Delete an annonce by ID.
     * Returns the full row (so the caller can remove the photo file)
     * or false when the ID does not exist.
     *
     * @return array<string, mixed>|false
     */
    public function delete(int $id): array|false
    {
        $existing = $this->getOne($id);
        if ($existing === false) {
            return false;
        }

        $stmt = $this->pdo->prepare('DELETE FROM annonces WHERE id_annonce = :id');
        $stmt->execute([':id' => $id]);

        return $existing;   // caller uses $existing['photo'] to unlink the file
    }

    // ─────────────────────────────────────────────────────────────────────────
    // FORM HELPERS (dropdown data)
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @return array<int, array{id_categorie: int, categorie: string}>
     */
    public function getCategories(): array
    {
        return $this->pdo
            ->query('SELECT id_categorie, categorie FROM categories ORDER BY categorie ASC')
            ->fetchAll();
    }

    /**
     * @return array<int, array{id_ville: int, ville: string}>
     */
    public function getVilles(): array
    {
        return $this->pdo
            ->query('SELECT id_ville, ville FROM villes ORDER BY ville ASC')
            ->fetchAll();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PRIVATE HELPERS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Validate fields against the data-dictionary rules.
     * Throws \InvalidArgumentException with a French message on the first failure.
     *
     * @param  array<string, mixed> $data
     * @param  bool                 $requirePhoto  true on create, false on edit.
     * @throws \InvalidArgumentException
     */
    private function validateFields(array $data, bool $requirePhoto = true): void
    {
        $titre = trim((string)($data['titre'] ?? ''));
        if ($titre === '') {
            throw new \InvalidArgumentException('Le titre est obligatoire.');
        }
        if (mb_strlen($titre) < 5 || mb_strlen($titre) > 150) {
            throw new \InvalidArgumentException('Le titre doit comporter entre 5 et 150 caractères.');
        }

        $description = trim((string)($data['description'] ?? ''));
        if ($description === '') {
            throw new \InvalidArgumentException('La description est obligatoire.');
        }
        if (mb_strlen($description) < 10) {
            throw new \InvalidArgumentException('La description doit comporter au moins 10 caractères.');
        }

        if (!isset($data['prix']) || !is_numeric($data['prix']) || (float)$data['prix'] < 0) {
            throw new \InvalidArgumentException('Le prix doit être un nombre positif.');
        }

        if (empty($data['id_categorie']) || (int)$data['id_categorie'] <= 0) {
            throw new \InvalidArgumentException('La catégorie est obligatoire.');
        }

        if (empty($data['id_ville']) || (int)$data['id_ville'] <= 0) {
            throw new \InvalidArgumentException('La ville est obligatoire.');
        }

        if (!in_array($data['etat'] ?? '', self::VALID_ETATS, true)) {
            throw new \InvalidArgumentException(
                'L\'état du produit doit être : like_new, good, fair ou needs_repair.'
            );
        }

        if ($requirePhoto && empty($data['photo'])) {
            throw new \InvalidArgumentException('La photo est obligatoire.');
        }
    }
}
