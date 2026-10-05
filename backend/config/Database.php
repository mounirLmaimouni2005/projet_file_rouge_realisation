<?php

/**
 * Database — PDO connection factory (singleton per instance).
 *
 * Usage:
 *   $db  = new Database();
 *   $pdo = $db->getConnection();
 *
 * Throws \PDOException on connection failure (let the caller handle it).
 */
class Database
{
    private string  $host;
    private string  $dbname;
    private string  $username;
    private string  $password;
    private string  $charset;
    private ?PDO    $connection = null;

    public function __construct(
        string $host     = 'localhost',
        string $dbname   = 'techswap_morocco',
        string $username = 'root',
        string $password = '13737115',   // ⚠ Move to env var before any deployment
        string $charset  = 'utf8mb4'
    ) {
        $this->host     = $host;
        $this->dbname   = $dbname;
        $this->username = $username;
        $this->password = $password;
        $this->charset  = $charset;
    }

    /**
     * Returns a singleton PDO connection.
     * Subsequent calls return the same object (no reconnect overhead).
     *
     * @throws \PDOException if the connection cannot be established.
     */
    public function getConnection(): PDO
    {
        if ($this->connection === null) {
            $dsn = sprintf(
                'mysql:host=%s;dbname=%s;charset=%s',
                $this->host,
                $this->dbname,
                $this->charset
            );

            $this->connection = new PDO($dsn, $this->username, $this->password, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,   // throw on error
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,         // array by default
                PDO::ATTR_EMULATE_PREPARES   => false,                    // real prepared stmts
            ]);
        }

        return $this->connection;
    }
}
