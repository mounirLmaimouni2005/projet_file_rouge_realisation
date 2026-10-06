/**
 * annonces.js — Frontend CRUD for TechSwap Annonces API
 * API endpoint: /backend/api/annonces.php
 * UI: Tailwind CSS sidebar dashboard layout
 */

'use strict';

const API_URL = '../backend/api/annonces.php';

// ── Badge maps ──────────────────────────────────────────────────────────────

/** Maps annonce.etat values to display labels and Tailwind badge classes */
const ETAT_MAP = {
    'like_new':     { label: 'Comme neuf',  badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    'good':         { label: 'Bon état',    badge: 'bg-slate-100 text-slate-700 border-slate-200' },
    'fair':         { label: 'État moyen',  badge: 'bg-amber-50 text-amber-700 border-amber-200' },
    'needs_repair': { label: 'À réparer',   badge: 'bg-red-50 text-red-600 border-red-200' },
};

/** Maps annonce.statut values to display labels/colors (used in État column) */
const STATUT_MAP = {
    'available': { label: 'Disponible', dot: 'bg-emerald-500', text: 'text-emerald-700' },
    'sold':      { label: 'Vendu',      dot: 'bg-slate-400',   text: 'text-slate-500'   },
};

// ── Utility helpers ──────────────────────────────────────────────────────────

function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g,  '&amp;')
        .replace(/</g,  '&lt;')
        .replace(/>/g,  '&gt;')
        .replace(/"/g,  '&quot;')
        .replace(/'/g,  '&#039;');
}

function formatPrice(price) {
    const num = parseFloat(price);
    if (isNaN(num)) return '—';
    return new Intl.NumberFormat('fr-MA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num) + ' MAD';
}

/**
 * Render an alert banner into the given container element ID.
 * @param {string} containerId
 * @param {string} message
 * @param {'success'|'danger'} type
 */
function showAlert(containerId, message, type = 'danger') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const isSuccess = type === 'success';
    const styles = isSuccess
        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
        : 'bg-red-50 text-red-800 border-red-200';
    const icon = isSuccess ? 'fa-circle-check text-emerald-500' : 'fa-circle-exclamation text-red-500';
    const closeCls = isSuccess ? 'text-emerald-400 hover:text-emerald-700' : 'text-red-400 hover:text-red-700';

    container.innerHTML = `
        <div role="alert" class="flex items-start justify-between gap-3 px-4 py-3 rounded-md border text-[13px] font-medium ${styles} shadow-sm">
            <div class="flex items-center gap-2.5 min-w-0">
                <i class="fa-solid ${icon} flex-shrink-0 text-[14px]"></i>
                <span class="leading-snug">${escapeHtml(message)}</span>
            </div>
            <button type="button" aria-label="Fermer"
                class="${closeCls} flex-shrink-0 transition-colors mt-0.5"
                onclick="this.closest('[role=alert]').remove()">
                <i class="fa-solid fa-xmark text-sm"></i>
            </button>
        </div>
    `;
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearAlert(containerId) {
    const el = document.getElementById(containerId);
    if (el) el.innerHTML = '';
}

// ── Error extraction ─────────────────────────────────────────────────────────

function extractErrorMessage(json, fallback) {
    if (!json) return fallback;
    if (json.detail) return `${json.error || fallback} : ${json.detail}`;
    return json.error || fallback;
}

// ── API calls ────────────────────────────────────────────────────────────────

async function fetchCategories() {
    const res  = await fetch(`${API_URL}?action=categories`);
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(extractErrorMessage(json, 'Impossible de charger les catégories.'));
    return json.data;
}

async function fetchVilles() {
    const res  = await fetch(`${API_URL}?action=villes`);
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(extractErrorMessage(json, 'Impossible de charger les villes.'));
    return json.data;
}

async function fetchAnnonces() {
    const res  = await fetch(API_URL);
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(extractErrorMessage(json, 'Impossible de charger les annonces.'));
    return json.data;
}

async function fetchAnnonce(id) {
    const res  = await fetch(`${API_URL}?id=${encodeURIComponent(id)}`);
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(extractErrorMessage(json, "Impossible de charger l'annonce."));
    return json.data;
}

async function createAnnonce(formData) {
    const res  = await fetch(API_URL, { method: 'POST', body: formData });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(extractErrorMessage(json, "Erreur lors de la création de l'annonce."));
    return json;
}

async function updateAnnonce(id, formData) {
    formData.append('_method', 'PUT');
    const res  = await fetch(`${API_URL}?id=${encodeURIComponent(id)}`, { method: 'POST', body: formData });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(extractErrorMessage(json, "Erreur lors de la mise à jour de l'annonce."));
    return json;
}

async function deleteAnnonce(id) {
    const res  = await fetch(`${API_URL}?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(extractErrorMessage(json, "Erreur lors de la suppression de l'annonce."));
    return json;
}

// ── Dropdown helper ──────────────────────────────────────────────────────────

function populateDropdown(selectEl, items, idKey, textKey, selectedValue = '') {
    if (!selectEl) return;
    const defaultOpt = selectEl.querySelector('option[value=""]');
    selectEl.innerHTML = '';
    if (defaultOpt) {
        selectEl.appendChild(defaultOpt);
    } else {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = '-- Choisir --';
        selectEl.appendChild(opt);
    }
    items.forEach(item => {
        const opt = document.createElement('option');
        opt.value       = item[idKey];
        opt.textContent = item[textKey];
        if (String(item[idKey]) === String(selectedValue)) opt.selected = true;
        selectEl.appendChild(opt);
    });
}

// ── Loading button helper ────────────────────────────────────────────────────

function setButtonLoading(btn, loadingText = 'Traitement...') {
    const original = btn.innerHTML;
    btn.disabled   = true;
    btn.innerHTML  = `
        <svg class="animate-spin h-3.5 w-3.5 text-white inline-block" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span class="ml-1.5">${loadingText}</span>
    `;
    return original;
}

function restoreButton(btn, originalHtml) {
    btn.disabled  = false;
    btn.innerHTML = originalHtml;
}

// ════════════════════════════════════════════════════════════════════════════
// PAGE: list.html
// ════════════════════════════════════════════════════════════════════════════

async function initListPage() {
    const tableBody      = document.getElementById('annonces-table-body');
    const tableContainer = document.getElementById('table-container');
    const emptyState     = document.getElementById('empty-state');
    const loadingState   = document.getElementById('loading-state');
    const ALERT_ID       = 'alert-container';

    // Flash messages from redirects
    const params = new URLSearchParams(window.location.search);
    if (params.get('created') === '1') {
        showAlert(ALERT_ID, 'Annonce publiée avec succès.', 'success');
        window.history.replaceState({}, '', window.location.pathname);
    } else if (params.get('updated') === '1') {
        showAlert(ALERT_ID, 'Annonce mise à jour avec succès.', 'success');
        window.history.replaceState({}, '', window.location.pathname);
    }

    async function loadData() {
        if (loadingState)   loadingState.classList.remove('hidden');
        if (tableContainer) tableContainer.classList.add('hidden');
        if (emptyState)     emptyState.classList.add('hidden');

        try {
            const annonces = await fetchAnnonces();
            if (loadingState) loadingState.classList.add('hidden');

            if (!annonces || annonces.length === 0) {
                if (emptyState) emptyState.classList.remove('hidden');
                return;
            }

            renderTable(annonces);
            if (tableContainer) tableContainer.classList.remove('hidden');
        } catch (err) {
            if (loadingState) loadingState.classList.add('hidden');
            showAlert(ALERT_ID, err.message, 'danger');
        }
    }

    /**
     * Renders the annonces table.
     * Columns: ID | Photo | Titre | Catégorie | Ville | Prix | État | Actions
     */
    function renderTable(annonces) {
        if (!tableBody) return;
        tableBody.innerHTML = '';

        annonces.forEach(a => {
            const etatInfo   = ETAT_MAP[a.etat]   || { label: a.etat   || '—', badge: 'bg-slate-100 text-slate-600 border-slate-200' };
            const statutInfo = STATUT_MAP[a.statut] || { label: a.statut || '',  dot: 'bg-slate-400', text: 'text-slate-500' };

            // Photo cell
            const photoCell = a.photo_url
                ? `<img src="${escapeHtml(a.photo_url)}" alt="Photo"
                        class="w-10 h-10 object-cover rounded-md border border-slate-200 bg-slate-50"
                        onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'text-[11px] text-slate-400 font-mono',textContent:'—'}))">`
                : `<div class="w-10 h-10 rounded-md border border-slate-200 bg-slate-100 flex items-center justify-center">
                       <i class="fa-regular fa-image text-slate-300 text-sm"></i>
                   </div>`;

            // État badge (état) + statut pill
            const etatBadge = `
                <span class="inline-flex items-center px-1.5 py-0.5 rounded border text-[11px] font-medium ${etatInfo.badge}">
                    ${escapeHtml(etatInfo.label)}
                </span>`;

            const statutPill = a.statut
                ? `<span class="mt-1 inline-flex items-center gap-1 text-[11px] font-medium ${statutInfo.text}">
                       <span class="w-1.5 h-1.5 rounded-full flex-shrink-0 ${statutInfo.dot}"></span>
                       ${escapeHtml(statutInfo.label)}
                   </span>`
                : '';

            const tr = document.createElement('tr');
            tr.className = 'hover:bg-slate-50/70 transition-colors';
            tr.innerHTML = `
                <td class="px-4 py-3 whitespace-nowrap">
                    <span class="text-[12px] font-mono text-slate-400">#${escapeHtml(a.id_annonce)}</span>
                </td>
                <td class="px-4 py-3">
                    ${photoCell}
                </td>
                <td class="px-4 py-3 max-w-[220px]">
                    <p class="text-[13px] font-medium text-slate-900 truncate">${escapeHtml(a.titre)}</p>
                    ${a.description ? `<p class="text-[11px] text-slate-400 truncate mt-0.5">${escapeHtml(a.description)}</p>` : ''}
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                    <span class="text-[12px] text-slate-600">${escapeHtml(a.categorie || '—')}</span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                    <span class="inline-flex items-center gap-1 text-[12px] text-slate-600">
                        <i class="fa-solid fa-location-dot text-[11px] text-slate-400"></i>
                        ${escapeHtml(a.ville || '—')}
                    </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                    <span class="text-[13px] font-semibold text-slate-900 tabular-nums">${formatPrice(a.prix)}</span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                    <div class="flex flex-col items-start gap-0.5">
                        ${etatBadge}
                        ${statutPill}
                    </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-right">
                    <div class="inline-flex items-center gap-1">
                        <a href="edit.html?id=${encodeURIComponent(a.id_annonce)}"
                            title="Modifier"
                            class="inline-flex items-center justify-center w-7 h-7 rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-colors">
                            <i class="fa-solid fa-pen text-[11px]"></i>
                        </a>
                        <button type="button"
                            class="btn-delete inline-flex items-center justify-center w-7 h-7 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-colors"
                            data-id="${escapeHtml(a.id_annonce)}"
                            data-title="${escapeHtml(a.titre)}"
                            title="Supprimer">
                            <i class="fa-solid fa-trash text-[11px]"></i>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        // Attach delete event listeners
        tableBody.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                handleDelete(btn.dataset.id, btn.dataset.title);
            });
        });
    }

    async function handleDelete(id, title) {
        if (!confirm(`Supprimer l'annonce « ${title} » (#${id}) ? Cette action est irréversible.`)) return;

        try {
            await deleteAnnonce(id);
            showAlert(ALERT_ID, `Annonce #${id} supprimée avec succès.`, 'success');
            await loadData();
        } catch (err) {
            showAlert(ALERT_ID, err.message, 'danger');
        }
    }

    await loadData();
}

// ════════════════════════════════════════════════════════════════════════════
// PAGE: add.html
// ════════════════════════════════════════════════════════════════════════════

async function initAddPage() {
    const form           = document.getElementById('add-annonce-form');
    const selectCategorie = document.getElementById('id_categorie');
    const selectVille    = document.getElementById('id_ville');
    const photoInput     = document.getElementById('photo');
    const photoPreview   = document.getElementById('photo-preview-img') || document.getElementById('photo-preview');
    const submitBtn      = document.getElementById('submit-btn');
    const ALERT_ID       = 'alert-container';

    // Load dropdowns from API (override hard-coded HTML options)
    try {
        const [categories, villes] = await Promise.all([fetchCategories(), fetchVilles()]);
        populateDropdown(selectCategorie, categories, 'id_categorie', 'categorie');
        populateDropdown(selectVille,     villes,     'id_ville',     'ville');
    } catch (err) {
        showAlert(ALERT_ID, err.message, 'danger');
    }

    // Photo preview (handled in HTML inline script but also covered here for safety)
    if (photoInput && photoPreview) {
        photoInput.addEventListener('change', () => {
            const file = photoInput.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = e => {
                if (photoPreview.tagName === 'IMG') {
                    photoPreview.src = e.target.result;
                    photoPreview.classList.remove('hidden');
                    const wrapper = document.getElementById('photo-preview');
                    if (wrapper && wrapper.tagName === 'DIV') wrapper.classList.remove('hidden');
                }
            };
            reader.readAsDataURL(file);
        });
    }

    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();
        clearAlert(ALERT_ID);

        const titre       = form.titre.value.trim();
        const description = form.description ? form.description.value.trim() : '';
        const prix        = parseFloat(form.prix.value);
        const idCategorie = form.id_categorie.value;
        const idVille     = form.id_ville.value;
        const etat        = form.etat.value;
        const photoFile   = photoInput && photoInput.files[0];

        if (titre.length < 5 || titre.length > 150) {
            showAlert(ALERT_ID, 'Le titre doit comporter entre 5 et 150 caractères.', 'danger'); return;
        }
        if (description.length < 10) {
            showAlert(ALERT_ID, 'La description doit comporter au moins 10 caractères.', 'danger'); return;
        }
        if (isNaN(prix) || prix < 0) {
            showAlert(ALERT_ID, 'Le prix doit être un nombre positif.', 'danger'); return;
        }
        if (!idCategorie) {
            showAlert(ALERT_ID, 'Veuillez sélectionner une catégorie.', 'danger'); return;
        }
        if (!idVille) {
            showAlert(ALERT_ID, 'Veuillez sélectionner une ville.', 'danger'); return;
        }
        if (!etat) {
            showAlert(ALERT_ID, 'Veuillez sélectionner un état.', 'danger'); return;
        }
        if (!photoFile) {
            showAlert(ALERT_ID, 'La photo est obligatoire pour créer une annonce.', 'danger'); return;
        }

        const formData  = new FormData(form);
        const origHtml  = setButtonLoading(submitBtn, 'Publication en cours...');

        try {
            const result = await createAnnonce(formData);
            showAlert(ALERT_ID, result.message || 'Annonce publiée avec succès.', 'success');
            setTimeout(() => { window.location.href = 'list.html?created=1'; }, 800);
        } catch (err) {
            showAlert(ALERT_ID, err.message, 'danger');
            restoreButton(submitBtn, origHtml);
        }
    });
}

// ════════════════════════════════════════════════════════════════════════════
// PAGE: edit.html
// ════════════════════════════════════════════════════════════════════════════

async function initEditPage() {
    const form            = document.getElementById('edit-annonce-form');
    const selectCategorie = document.getElementById('id_categorie');
    const selectVille     = document.getElementById('id_ville');
    const photoInput      = document.getElementById('photo');
    const currentPhoto    = document.getElementById('current-photo');
    const photoPreview    = document.getElementById('photo-preview');
    const submitBtn       = document.getElementById('submit-btn');
    const loadingState    = document.getElementById('loading-state');
    const formCard        = document.getElementById('form-card');
    const ALERT_ID        = 'alert-container';

    const params = new URLSearchParams(window.location.search);
    const id     = params.get('id');

    if (!id || !/^\d+$/.test(id)) {
        if (loadingState) loadingState.classList.add('hidden');
        showAlert(ALERT_ID, "Identifiant d'annonce invalide ou manquant.", 'danger');
        return;
    }

    try {
        const [categories, villes, annonce] = await Promise.all([
            fetchCategories(),
            fetchVilles(),
            fetchAnnonce(id),
        ]);

        populateDropdown(selectCategorie, categories, 'id_categorie', 'categorie', annonce.id_categorie);
        populateDropdown(selectVille,     villes,     'id_ville',     'ville',     annonce.id_ville);

        form.titre.value       = annonce.titre       || '';
        form.description.value = annonce.description || '';
        form.prix.value        = annonce.prix        || '';
        form.etat.value        = annonce.etat        || '';
        form.statut.value      = annonce.statut      || 'available';

        if (annonce.photo_url && currentPhoto) {
            currentPhoto.src = annonce.photo_url;
            currentPhoto.classList.remove('hidden');
        }

        if (loadingState) loadingState.classList.add('hidden');
        if (formCard)     formCard.classList.remove('hidden');

    } catch (err) {
        if (loadingState) loadingState.classList.add('hidden');
        showAlert(ALERT_ID, err.message, 'danger');
        return;
    }

    // New photo preview
    if (photoInput && photoPreview) {
        photoInput.addEventListener('change', () => {
            const file = photoInput.files[0];
            if (!file) { photoPreview.classList.add('hidden'); return; }
            const reader = new FileReader();
            reader.onload = e => {
                photoPreview.src = e.target.result;
                photoPreview.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        });
    }

    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();
        clearAlert(ALERT_ID);

        const titre       = form.titre.value.trim();
        const description = form.description.value.trim();
        const prix        = parseFloat(form.prix.value);
        const idCategorie = form.id_categorie.value;
        const idVille     = form.id_ville.value;
        const etat        = form.etat.value;
        const statut      = form.statut.value;

        if (titre.length < 5 || titre.length > 150) {
            showAlert(ALERT_ID, 'Le titre doit comporter entre 5 et 150 caractères.', 'danger'); return;
        }
        if (description.length < 10) {
            showAlert(ALERT_ID, 'La description doit comporter au moins 10 caractères.', 'danger'); return;
        }
        if (isNaN(prix) || prix < 0) {
            showAlert(ALERT_ID, 'Le prix doit être un nombre positif.', 'danger'); return;
        }
        if (!idCategorie) {
            showAlert(ALERT_ID, 'Veuillez sélectionner une catégorie.', 'danger'); return;
        }
        if (!idVille) {
            showAlert(ALERT_ID, 'Veuillez sélectionner une ville.', 'danger'); return;
        }
        if (!etat) {
            showAlert(ALERT_ID, 'Veuillez sélectionner un état.', 'danger'); return;
        }
        if (!statut) {
            showAlert(ALERT_ID, 'Veuillez sélectionner un statut.', 'danger'); return;
        }

        const formData = new FormData(form);
        // If no new photo selected, strip the empty file field so backend keeps the old image
        if (photoInput && photoInput.files.length === 0) {
            formData.delete('photo');
        }

        const origHtml = setButtonLoading(submitBtn, 'Enregistrement...');

        try {
            const result = await updateAnnonce(id, formData);
            showAlert(ALERT_ID, result.message || 'Annonce mise à jour avec succès.', 'success');

            if (result.data && result.data.photo_url && currentPhoto) {
                currentPhoto.src = result.data.photo_url;
                if (photoPreview) { photoPreview.classList.add('hidden'); photoPreview.src = ''; }
                if (photoInput)   photoInput.value = '';
            }

            restoreButton(submitBtn, origHtml);
            setTimeout(() => { window.location.href = 'list.html?updated=1'; }, 800);
        } catch (err) {
            showAlert(ALERT_ID, err.message, 'danger');
            restoreButton(submitBtn, origHtml);
        }
    });
}
