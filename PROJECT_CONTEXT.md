# PROJECT CONTEXT — TechSwap Morocco

## What This Is

A **second-hand electronics classifieds marketplace** for Morocco. Sellers post used tech items; buyers browse and contact sellers directly via WhatsApp. **No cart, no checkout, no online payment.** This is a school capstone project ("projet fil rouge") built following MERISE methodology.

## User Roles

| Role | Permissions |
|---|---|
| **Admin** | Moderate all listings, manage users (not yet implemented) |
| **Seller** | Register, login, create/edit/delete own listings, toggle available/sold |
| **Buyer/Guest** | Browse catalog, filter by category/city/price, view details, contact seller via WhatsApp |

## Tech Stack

- **Backend:** PHP 8.0+ (OOP Model Architecture, RESTful JSON API)
- **Database:** MySQL / MariaDB via PDO (prepared statements, strict error mode)
- **Frontend:** HTML5 + Tailwind CSS (CDN) + Font Awesome 6.4.0 (CDN) + JavaScript (ES6+, Fetch API)
- **Storage:** Local server uploads (`backend/uploads/`) + JSON mirror backup (`backend/storage/annonces.json`)
- **Server:** Local LAMP/WAMP/XAMPP with Apache (`.htaccess` rules)
- **No external package manager** — Native PHP & standard web APIs

## Project Structure

```text
projet_file_rouge_realisation/
│
├── backend/
│   ├── api/
│   │   └── annonces.php                  # RESTful JSON API endpoint (Controller / Router)
│   ├── classes/
│   │   ├── Annonce.php                   # OOP Model (SQL operations, validation, JSON sync)
│   │   └── JsonStorage.php               # File-based JSON storage synchronizer
│   ├── config/
│   │   └── Database.php                  # PDO connection factory (Singleton)
│   ├── storage/
│   │   └── annonces.json                 # Synchronized JSON data backup
│   ├── uploads/                          # Stored announcement photos
│   │   └── .htaccess                     # Upload directory security
│   └── .htaccess                         # Backend CORS / routing rules
│
├── frontend/
│   ├── js/
│   │   └── annonces.js                   # Client-side controller (Fetch API, DOM events, UI alerts)
│   ├── add.html                          # Create listing view (CREATE)
│   ├── edit.html                         # Edit listing view (UPDATE)
│   └── list.html                         # List & delete listings view (READ / DELETE)
│
├── database/
│   ├── database .sql                     # Relational schema DDL + initial seeds
│   └── database_connect.php              # PDO connection script
│
├── realisation_donnee/                   # MERISE design deliverables & sprint requirements
│   ├── dectionair_de_donnee.csv          # Data dictionary
│   ├── depandence_cordinalites.csv       # Functional dependencies & cardinalities
│   ├── promt_sprint1.txt                 # Sprint 1 prompts & requirements
│   └── promt_sprint2.txt                 # Sprint 2 prompts & requirements
│
├── .vscode/
│   └── settings.json
└── PROJECT_CONTEXT.md                    # This architecture and context documentation
```

## Database: `techswap_morocco`

| Table | Purpose | PK | Notes |
|---|---|---|---|
| `utilisateurs` | Users | `id_utilisateur INT UNSIGNED AI` | role ENUM('admin','seller','buyer') |
| `categories` | 13 fixed categories | `id_categorie SMALLINT UNSIGNED AI` | Seeded, fixed business categories |
| `villes` | 21 Moroccan cities | `id_ville SMALLINT UNSIGNED AI` | Seeded, fixed list of major cities |
| `annonces` | Product listings | `id_annonce INT UNSIGNED AI` | FKs → utilisateurs, categories, villes |

**Key columns on `annonces`:**
- `etat` ENUM: `like_new`, `good`, `fair`, `needs_repair`
- `statut` ENUM: `available`, `sold`
- `photo` VARCHAR: relative path to uploaded image (`uploads/img_...`)
- `date_publication`: DATETIME DEFAULT CURRENT_TIMESTAMP
- `date_modification`: DATETIME NULL (automatically updated via `NOW()` on edit)
- `date_vente`: DATETIME NULL

**All Foreign Keys:** `ON UPDATE CASCADE / ON DELETE RESTRICT`

## Data Flow Pattern

```text
Frontend (HTML/JS) ──fetch()──► REST API (annonces.php) ──► Model (Annonce.php) ──► PDO ──► MySQL
                                        │                           │
                             JSON Response Envelopes          syncJsonStorage()
                             {success, data/error}                  │
                                        ▲                           ▼
                                        └───────── JsonStorage (annonces.json)
```

1. **Frontend:** HTML forms and events trigger async requests in `annonces.js` via `fetch()`.
2. **REST API (`backend/api/annonces.php`):**
   - Validates HTTP method (`GET`, `POST`, `DELETE`, and method override `_method=PUT` for multipart).
   - Validates file uploads with `finfo` MIME type checks, size restrictions (<= 5 MB), and extension whitelisting.
   - Cleans up replaced/deleted images from disk.
   - Builds public absolute URLs for photos (`photo_url`).
3. **OOP Model (`backend/classes/Annonce.php`):**
   - Centralizes SQL prepared queries.
   - Enforces data dictionary validations (field lengths, mandatory constraints, positive price, valid ENUMs).
   - Automatically synchronizes data state to `backend/storage/annonces.json` via `JsonStorage`.
4. **Database & PDO (`backend/config/Database.php`):**
   - Provides an isolated, singleton PDO connection with exception handling and prepared statement emulation disabled.

## What Is Implemented ✅

- **Full decoupled CRUD for annonces** (create, read list, read single, update, delete).
- **RESTful API** returning standardized JSON payloads (`{ success: true|false, data/error }`).
- **OOP Architecture** separating HTTP controller logic, business validation, and database operations.
- **Secure Image Uploads:**
  - Real MIME verification (`finfo`) for `image/jpeg`, `image/png`, `image/webp`.
  - Maximum upload size enforcement (5 MB).
  - Unique naming (`uniqid('img_', true)`).
  - Automatic unlinking of old photos on edit and delete.
- **Dynamic Dropdowns:** Categories and Moroccan cities fetched asynchronously via API.
- **Client-Side UX:** Live image preview, inline alerts, empty/loading states, confirmation prompts.
- **JSON Mirror Backup:** Auto-sync to `backend/storage/annonces.json` on write operations.
- **Fixed `date_modification`:** Updated to current timestamp on edits.

## What Is NOT Implemented ❌

- Authentication / registration / login / JWT or sessions (currently hardcoded to `id_utilisateur = 1`).
- Role-based access control (Admin / Seller / Buyer).
- Public catalog / browse page for buyers.
- Product detail page with dynamic WhatsApp chat generator (`https://wa.me/...`).
- Client-side filtering by category / city / price range.
- Full-text search and pagination.
- Admin moderation panel.

## API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/backend/api/annonces.php` | Retrieve all listings |
| `GET` | `/backend/api/annonces.php?id={id}` | Retrieve a single listing |
| `GET` | `/backend/api/annonces.php?action=categories` | Retrieve all categories for dropdowns |
| `GET` | `/backend/api/annonces.php?action=villes` | Retrieve all cities for dropdowns |
| `POST` | `/backend/api/annonces.php` | Create a new listing (`multipart/form-data`) |
| `POST` | `/backend/api/annonces.php?id={id}` (`_method=PUT`) | Update an existing listing (`multipart/form-data`) |
| `DELETE` | `/backend/api/annonces.php?id={id}` | Delete a listing and remove its photo |

## Conventions to Preserve

- **French UI labels**, French database column/table names, English ENUM values.
- **MERISE methodology design deliverables** in `realisation_donnee/` must remain respected.
- **PDO prepared statements** for all SQL execution.
- **Currency is MAD** (Moroccan Dirham) throughout.
- **Second-hand items only** (core business model of TechSwap).
