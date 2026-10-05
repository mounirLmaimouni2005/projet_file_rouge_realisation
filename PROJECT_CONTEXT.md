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

- **Backend:** PHP (procedural, no framework, no OOP)
- **Database:** MySQL/MariaDB via PDO (prepared statements)
- **Frontend:** HTML + Bootstrap 5.3.3 (CDN) + Font Awesome 6.4.0 (CDN)
- **CSS:** Inline `<style>` blocks per page (spec says "external style.css" but not followed)
- **JS:** None — all interactions are full-page form submissions
- **Server:** Local LAMP/WAMP/XAMPP
- **No package manager** — no composer.json, no package.json

## Project Structure

```
projet_file_rouge_realisation/
├── database/
│   ├── database .sql            # DDL + seed data (note: space in filename)
│   └── database_connect.php     # PDO connection → exposes global $pdo
├── src/                         # All application pages (webroot context)
│   ├── add_anance.php           # Create listing (⚠ typo: should be add_annonce)
│   ├── list_annonces.php        # List all listings (table view)
│   ├── edit_annonce.php         # Edit listing form + update logic
│   ├── delete_annonce.php       # Delete listing + remove photo file
│   └── uploads/                 # Uploaded product images
├── realisation_donnee/          # MERISE design docs (not code)
│   ├── promt.text.txt           # Full project requirements / prompts
│   ├── dectionair_de_donnee.csv # Data dictionary
│   └── depandence_cordinalites.csv  # Functional dependencies (actually Marp slides)
└── PROJECT_CONTEXT.md           # This file
```

## Database: `techswap_morocco`

| Table | Purpose | PK | Notes |
|---|---|---|---|
| `utilisateurs` | Users | `id_utilisateur INT UNSIGNED AI` | role ENUM('admin','seller','buyer') |
| `categories` | 13 fixed categories | `id_categorie SMALLINT UNSIGNED AI` | Seeded, not user-editable |
| `villes` | 21 Moroccan cities | `id_ville SMALLINT UNSIGNED AI` | Seeded, not user-editable |
| `annonces` | Product listings | `id_annonce INT UNSIGNED AI` | FKs → utilisateurs, categories, villes |

**Key columns on `annonces`:**
- `etat` ENUM: `like_new`, `good`, `fair`, `needs_repair`
- `statut` ENUM: `available`, `sold`
- `photo` VARCHAR: relative file path to uploaded image
- `date_modification`, `date_vente`: nullable, currently never set by code

**All FKs:** `ON UPDATE CASCADE / ON DELETE RESTRICT`

## What Is Implemented ✅

- **CRUD for annonces** (create, list, edit, delete) — seller-side only
- **Image upload** on create and edit (JPG/JPEG/PNG/WEBP)
- **Photo cleanup** on delete (unlinks file from disk)
- Categories and cities loaded dynamically from DB into `<select>` dropdowns

## What Is NOT Implemented ❌

- Authentication / registration / login / sessions
- Role-based access control
- Public catalog / browse page for buyers
- Product detail page (`product-detail.php?id=X`)
- WhatsApp contact button (pre-filled message with title + price)
- Category / city / price filtering
- Admin dashboard and moderation
- Search functionality
- Pagination

## Page Responsibilities

| File | Method | What It Does |
|---|---|---|
| `list_annonces.php` | GET | Fetches all annonces (JOIN categories + villes), renders Bootstrap table with edit/delete action links |
| `add_anance.php` | GET/POST | GET: shows create form. POST: validates image, inserts row, redirects to list |
| `edit_annonce.php` | GET/POST | GET: loads annonce by `?id=`, pre-fills form. POST: updates row, shows success message (stays on page) |
| `delete_annonce.php` | GET | Receives `?id=`, deletes photo file + DB row, redirects to list |

## Data Flow Pattern

Every page follows the same pattern:
1. `require_once '../database/database_connect.php'` → gets global `$pdo`
2. PHP logic block at top (query/insert/update/delete)
3. HTML+Bootstrap markup below with embedded `<?php ?>` for rendering
4. After create/delete: `header('Location: list_annonces.php')` redirect
5. No AJAX, no API, no JavaScript logic

## Conventions to Preserve

- **French UI labels**, French DB column/table names, English ENUM values
- **PDO prepared statements** for all queries (consistently used)
- **Bootstrap 5 card layout** with gradient header (`.modern-card` + `.card-header-custom`)
- **Inline `<style>`** per page (duplicated — no shared CSS file exists)
- **`id_utilisateur = 1`** hardcoded everywhere (no auth yet)
- Upload naming: `uniqid('img_', true)` on create, `'annonce_' . time()` on edit

## Known Bugs & Issues

| Severity | Issue |
|---|---|
| 🔴 Critical | **No authentication** — all pages publicly accessible, anyone can CRUD |
| 🔴 Critical | **Delete via GET** with no CSRF token — link-click deletes data |
| 🔴 Critical | **DB password hardcoded** in `database_connect.php` (`13737115`) |
| 🟡 Moderate | **Filename typo**: `add_anance.php` — the empty-state link in `list_annonces.php:86` points to `add_annonce.php` (correct spelling) → **broken link** |
| 🟡 Moderate | **Inconsistent upload paths**: add uses `uploads/` (relative), edit uses `../uploads/` — files may land in different directories |
| 🟡 Moderate | **`date_modification` never updated** on edit — UPDATE query omits it |
| 🟡 Moderate | **No MIME type validation** on uploads — only file extension is checked |
| 🟢 Minor | PDO connection try/catch doesn't wrap the `new PDO()` call itself |
| 🟢 Minor | Seed user password in plain text (`123456`) in SQL file |
| 🟢 Minor | No `.gitignore` — uploads and credentials at risk of being committed |
| 🟢 Minor | CSS duplicated across all pages instead of a shared stylesheet |

## Constraints for Future Development

1. **Respect MERISE design** — the 4-entity model (utilisateurs, annonces, categories, villes) and their cardinalities are formal design deliverables
2. **No e-commerce features** — no cart, no checkout, no payment. Contact is WhatsApp-only
3. **13 categories are fixed** — seeded in DB, not user-manageable
4. **Cities are fixed** — 21 Moroccan cities seeded in DB
5. **Items must be second-hand only** — this is a core business rule
6. **Keep procedural PHP** — the project is not OOP; don't introduce frameworks or MVC unless explicitly asked
7. **Keep French UI** — all user-facing text is in French
8. **Currency is MAD** (Moroccan Dirham) throughout
