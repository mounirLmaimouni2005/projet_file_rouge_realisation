<?php

/**
 * JsonStorage — File-based storage handler for annonces.
 *
 * Persists annonces data in JSON format in backend/storage/annonces.json.
 */
class JsonStorage
{
    private string $filePath;

    public function __construct(?string $filePath = null)
    {
        $this->filePath = $filePath ?? dirname(__DIR__) . '/storage/annonces.json';
    }

    /**
     * Save an array of annonces to the JSON file.
     * Uses LOCK_EX to avoid race conditions.
     *
     * @param  array<int, array<string, mixed>> $data
     * @return bool
     */
    public function save(array $data): bool
    {
        $dir = dirname($this->filePath);
        if (!is_dir($dir) && !mkdir($dir, 0755, true)) {
            return false;
        }

        $json = json_encode(
            $data,
            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        );

        if ($json === false) {
            return false;
        }

        return file_put_contents($this->filePath, $json, LOCK_EX) !== false;
    }

    /**
     * Load annonces from the JSON file.
     *
     * @return array<int, array<string, mixed>>
     */
    public function load(): array
    {
        if (!file_exists($this->filePath)) {
            return [];
        }

        $content = file_get_contents($this->filePath);
        if ($content === false || trim($content) === '') {
            return [];
        }

        $decoded = json_decode($content, true);
        return is_array($decoded) ? $decoded : [];
    }

    /**
     * Get the configured file path.
     */
    public function getFilePath(): string
    {
        return $this->filePath;
    }
}
