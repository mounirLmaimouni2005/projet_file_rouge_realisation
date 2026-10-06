/**
 * annonces.js — Frontend CRUD operations for TechSwap Annonces API
 * Connects to /backend/api/annonces.php
 */

const API_URL = '../backend/api/annonces.php';

const ETAT_MAP = {
    'like_new': { label: 'Comme neuf', badge: 'bg-primary text-white' },
    'good': { label: 'Bon état', badge: 'bg-info text-dark' },
    'fair': { label: 'État moyen', badge: 'bg-warning text-dark' },
    'needs_repair': { label: 'À réparer', badge: 'bg-secondary text-white' }
};

const STATUT_MAP = {
    'available': { label: 'Disponible', badge: 'bg-success text-white' },
    'sold': { label: 'Vendu', badge: 'bg-secondary text-white' }
};

// ── Utility Helpers ─────────────────────────────────────────────────────────

function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatPrice(price) {
    const num = parseFloat(price);
    if (isNaN(num)) return '0.00 MAD';
    return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num) + ' MAD';
}

function showAlert(containerId, message, type = 'danger') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const icon = type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation';
    container.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show d-flex align-items-center" role="alert">
            <i class="fa-solid ${icon} me-2 fs-5"></i>
            <div class="flex-grow-1">${escapeHtml(message)}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fermer"></button>
        </div>
    `;
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearAlert(containerId) {
    const container = document.getElementById(containerId);
    if (container) container.innerHTML = '';
}

// ── API Fetch Functions ─────────────────────────────────────────────────────

async function fetchCategories() {
    const res = await fetch(`${API_URL}?action=categories`);
    const json = await res.json();
    if (!res.ok || !json.success) {
        throw new Error(json.error || 'Erreur lors du chargement des catégories.');
    }
    return json.data;
}

async function fetchVilles() {
    const res = await fetch(`${API_URL}?action=villes`);
    const json = await res.json();
    if (!res.ok || !json.success) {
        throw new Error(json.error || 'Erreur lors du chargement des villes.');
    }
    return json.data;
}

async function fetchAnnonces() {
    const res = await fetch(API_URL);
    const json = await res.json();
    if (!res.ok || !json.success) {
        throw new Error(json.error || 'Erreur lors du chargement des annonces.');
    }
    return json.data;
}

async function fetchAnnonce(id) {
    const res = await fetch(`${API_URL}?id=${encodeURIComponent(id)}`);
    const json = await res.json();
    if (!res.ok || !json.success) {
        throw new Error(json.error || 'Erreur lors du chargement de l\'annonce.');
    }
    return json.data;
}

async function createAnnonce(formData) {
    const res = await fetch(API_URL, {
        method: 'POST',
        body: formData
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
        throw new Error(json.error || 'Erreur lors de la création de l\'annonce.');
    }
    return json;
}

async function updateAnnonce(id, formData) {
    formData.append('_method', 'PUT');

    const res = await fetch(`${API_URL}?id=${encodeURIComponent(id)}`, {
        method: 'POST',
        body: formData
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
        throw new Error(json.error || 'Erreur lors de la mise à jour de l\'annonce.');
    }
    return json;
}

async function deleteAnnonce(id) {
    const res = await fetch(`${API_URL}?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
        throw new Error(json.error || 'Erreur lors de la suppression de l\'annonce.');
    }
    return json;
}

// ── Dropdown Populaters ─────────────────────────────────────────────────────

function populateDropdown(selectElement, items, idKey, textKey, selectedValue = '') {
    if (!selectElement) return;
    const defaultOption = selectElement.querySelector('option[value=""]');
    selectElement.innerHTML = '';
    if (defaultOption) {
        selectElement.appendChild(defaultOption);
    } else {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = '-- Choisir --';
        selectElement.appendChild(opt);
    }

    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item[idKey];
        option.textContent = item[textKey];
        if (String(item[idKey]) === String(selectedValue)) {
            option.selected = true;
        }
        selectElement.appendChild(option);
    });
}

// ── Page: list.html ─────────────────────────────────────────────────────────

async function initListPage() {
    const tableBody = document.getElementById('annonces-table-body');
    const tableContainer = document.getElementById('table-container');
    const emptyState = document.getElementById('empty-state');
    const loadingState = document.getElementById('loading-state');
    const alertContainerId = 'alert-container';

    // Check query params for notification flags (e.g. from redirect)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('created') === '1') {
        showAlert(alertContainerId, 'Annonce créée avec succès !', 'success');
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.get('updated') === '1') {
        showAlert(alertContainerId, 'Annonce mise à jour avec succès !', 'success');
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    async function loadData() {
        if (loadingState) loadingState.classList.remove('d-none');
        if (tableContainer) tableContainer.classList.add('d-none');
        if (emptyState) emptyState.classList.add('d-none');

        try {
            const annonces = await fetchAnnonces();
            if (loadingState) loadingState.classList.add('d-none');

            if (!annonces || annonces.length === 0) {
                if (emptyState) emptyState.classList.remove('d-none');
                return;
            }

            renderTable(annonces);
            if (tableContainer) tableContainer.classList.remove('d-none');
        } catch (err) {
            if (loadingState) loadingState.classList.add('d-none');
            showAlert(alertContainerId, err.message, 'danger');
        }
    }

    function renderTable(annonces) {
        if (!tableBody) return;
        tableBody.innerHTML = '';

        annonces.forEach(annonce => {
            const etatInfo = ETAT_MAP[annonce.etat] || { label: annonce.etat, badge: 'bg-light text-dark' };
            const statutInfo = STATUT_MAP[annonce.statut] || { label: annonce.statut, badge: 'bg-light text-dark' };
            
            const photoHtml = annonce.photo_url
                ? `<img src="${escapeHtml(annonce.photo_url)}" alt="Photo" class="product-thumb" onerror="this.onerror=null;this.parentElement.innerHTML='<span class=\\'text-muted small\\'>Photo non trouvée</span>';">`
                : `<span class="text-muted small">Aucune photo</span>`;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="fw-semibold">#${escapeHtml(annonce.id_annonce)}</td>
                <td>${photoHtml}</td>
                <td>
                    <div class="fw-bold text-dark">${escapeHtml(annonce.titre)}</div>
                    <div class="small text-muted text-truncate" style="max-width: 250px;">${escapeHtml(annonce.description || '')}</div>
                </td>
                <td><span class="badge bg-light text-dark border">${escapeHtml(annonce.categorie || '')}</span></td>
                <td><i class="fa-solid fa-location-dot text-danger me-1"></i>${escapeHtml(annonce.ville || '')}</td>
                <td class="fw-bold text-primary">${formatPrice(annonce.prix)}</td>
                <td><span class="badge ${etatInfo.badge}">${escapeHtml(etatInfo.label)}</span></td>
                <td><span class="badge ${statutInfo.badge}">${escapeHtml(statutInfo.label)}</span></td>
                <td class="small text-muted">${escapeHtml(annonce.date_publication || '')}</td>
                <td>
                    <div class="d-flex gap-2">
                        <a href="edit.html?id=${encodeURIComponent(annonce.id_annonce)}" class="btn btn-sm btn-outline-primary" title="Modifier">
                            <i class="fa-solid fa-pen"></i>
                        </a>
                        <button type="button" class="btn btn-sm btn-outline-danger btn-delete" data-id="${escapeHtml(annonce.id_annonce)}" data-title="${escapeHtml(annonce.titre)}" title="Supprimer">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        // Attach delete events
        tableBody.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const title = btn.getAttribute('data-title');
                handleDelete(id, title);
            });
        });
    }

    async function handleDelete(id, title) {
        const confirmMsg = `Êtes-vous sûr de vouloir supprimer l'annonce "${title}" (#${id}) ?`;
        if (!confirm(confirmMsg)) return;

        try {
            await deleteAnnonce(id);
            showAlert(alertContainerId, `L'annonce #${id} a été supprimée avec succès.`, 'success');
            await loadData();
        } catch (err) {
            showAlert(alertContainerId, err.message, 'danger');
        }
    }

    await loadData();
}

// ── Page: add.html ──────────────────────────────────────────────────────────

async function initAddPage() {
    const form = document.getElementById('add-annonce-form');
    const selectCategorie = document.getElementById('id_categorie');
    const selectVille = document.getElementById('id_ville');
    const photoInput = document.getElementById('photo');
    const photoPreview = document.getElementById('photo-preview');
    const submitBtn = document.getElementById('submit-btn');
    const alertContainerId = 'alert-container';

    // Load categories and cities
    try {
        const [categories, villes] = await Promise.all([
            fetchCategories(),
            fetchVilles()
        ]);
        populateDropdown(selectCategorie, categories, 'id_categorie', 'categorie');
        populateDropdown(selectVille, villes, 'id_ville', 'ville');
    } catch (err) {
        showAlert(alertContainerId, err.message, 'danger');
    }

    // Photo preview
    if (photoInput && photoPreview) {
        photoInput.addEventListener('change', () => {
            const file = photoInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = e => {
                    photoPreview.src = e.target.result;
                    photoPreview.classList.remove('d-none');
                };
                reader.readAsDataURL(file);
            } else {
                photoPreview.src = '';
                photoPreview.classList.add('d-none');
            }
        });
    }

    // Handle form submit
    if (form) {
        form.addEventListener('submit', async e => {
            e.preventDefault();
            clearAlert(alertContainerId);

            // Validation checks
            const titre = form.titre.value.trim();
            const description = form.description.value.trim();
            const prix = parseFloat(form.prix.value);
            const idCategorie = form.id_categorie.value;
            const idVille = form.id_ville.value;
            const etat = form.etat.value;
            const photoFile = photoInput && photoInput.files[0];

            if (titre.length < 5 || titre.length > 150) {
                showAlert(alertContainerId, 'Le titre doit comporter entre 5 et 150 caractères.', 'danger');
                return;
            }
            if (description.length < 10) {
                showAlert(alertContainerId, 'La description doit comporter au moins 10 caractères.', 'danger');
                return;
            }
            if (isNaN(prix) || prix < 0) {
                showAlert(alertContainerId, 'Le prix doit être un nombre positif.', 'danger');
                return;
            }
            if (!idCategorie) {
                showAlert(alertContainerId, 'Veuillez sélectionner une catégorie.', 'danger');
                return;
            }
            if (!idVille) {
                showAlert(alertContainerId, 'Veuillez sélectionner une ville.', 'danger');
                return;
            }
            if (!etat) {
                showAlert(alertContainerId, 'Veuillez sélectionner un état.', 'danger');
                return;
            }
            if (!photoFile) {
                showAlert(alertContainerId, 'La photo est obligatoire pour créer une annonce.', 'danger');
                return;
            }

            const formData = new FormData(form);

            // Submit with loading indicator
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Publication en cours...';

            try {
                const result = await createAnnonce(formData);
                showAlert(alertContainerId, result.message || 'Annonce créée avec succès !', 'success');
                setTimeout(() => {
                    window.location.href = 'list.html?created=1';
                }, 1000);
            } catch (err) {
                showAlert(alertContainerId, err.message, 'danger');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
            }
        });
    }
}

// ── Page: edit.html ─────────────────────────────────────────────────────────

async function initEditPage() {
    const form = document.getElementById('edit-annonce-form');
    const selectCategorie = document.getElementById('id_categorie');
    const selectVille = document.getElementById('id_ville');
    const photoInput = document.getElementById('photo');
    const currentPhoto = document.getElementById('current-photo');
    const photoPreview = document.getElementById('photo-preview');
    const submitBtn = document.getElementById('submit-btn');
    const loadingState = document.getElementById('loading-state');
    const formCard = document.getElementById('form-card');
    const alertContainerId = 'alert-container';

    // Extract ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id || !/^\d+$/.test(id)) {
        if (loadingState) loadingState.classList.add('d-none');
        showAlert(alertContainerId, 'Identifiant d\'annonce invalide ou manquant.', 'danger');
        return;
    }

    // Load data
    try {
        const [categories, villes, annonce] = await Promise.all([
            fetchCategories(),
            fetchVilles(),
            fetchAnnonce(id)
        ]);

        populateDropdown(selectCategorie, categories, 'id_categorie', 'categorie', annonce.id_categorie);
        populateDropdown(selectVille, villes, 'id_ville', 'ville', annonce.id_ville);

        // Pre-fill form values
        form.titre.value = annonce.titre || '';
        form.description.value = annonce.description || '';
        form.prix.value = annonce.prix || '';
        form.etat.value = annonce.etat || 'good';
        form.statut.value = annonce.statut || 'available';

        // Display current photo
        if (annonce.photo_url && currentPhoto) {
            currentPhoto.src = annonce.photo_url;
            currentPhoto.classList.remove('d-none');
        }

        if (loadingState) loadingState.classList.add('d-none');
        if (formCard) formCard.classList.remove('d-none');

    } catch (err) {
        if (loadingState) loadingState.classList.add('d-none');
        showAlert(alertContainerId, err.message, 'danger');
        return;
    }

    // New photo preview listener
    if (photoInput && photoPreview) {
        photoInput.addEventListener('change', () => {
            const file = photoInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = e => {
                    photoPreview.src = e.target.result;
                    photoPreview.classList.remove('d-none');
                };
                reader.readAsDataURL(file);
            } else {
                photoPreview.src = '';
                photoPreview.classList.add('d-none');
            }
        });
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', async e => {
            e.preventDefault();
            clearAlert(alertContainerId);

            const titre = form.titre.value.trim();
            const description = form.description.value.trim();
            const prix = parseFloat(form.prix.value);
            const idCategorie = form.id_categorie.value;
            const idVille = form.id_ville.value;
            const etat = form.etat.value;
            const statut = form.statut.value;

            if (titre.length < 5 || titre.length > 150) {
                showAlert(alertContainerId, 'Le titre doit comporter entre 5 et 150 caractères.', 'danger');
                return;
            }
            if (description.length < 10) {
                showAlert(alertContainerId, 'La description doit comporter au moins 10 caractères.', 'danger');
                return;
            }
            if (isNaN(prix) || prix < 0) {
                showAlert(alertContainerId, 'Le prix doit être un nombre positif.', 'danger');
                return;
            }
            if (!idCategorie) {
                showAlert(alertContainerId, 'Veuillez sélectionner une catégorie.', 'danger');
                return;
            }
            if (!idVille) {
                showAlert(alertContainerId, 'Veuillez sélectionner une ville.', 'danger');
                return;
            }
            if (!etat) {
                showAlert(alertContainerId, 'Veuillez sélectionner un état.', 'danger');
                return;
            }
            if (!statut) {
                showAlert(alertContainerId, 'Veuillez sélectionner un statut.', 'danger');
                return;
            }

            const formData = new FormData(form);

            // If no new photo was selected, remove the empty photo field so API doesn't trip
            if (photoInput && photoInput.files.length === 0) {
                formData.delete('photo');
            }

            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Enregistrement...';

            try {
                const result = await updateAnnonce(id, formData);
                showAlert(alertContainerId, result.message || 'Annonce mise à jour avec succès !', 'success');

                // If updated photo returned, refresh the current photo display
                if (result.data && result.data.photo_url && currentPhoto) {
                    currentPhoto.src = result.data.photo_url;
                    if (photoPreview) {
                        photoPreview.classList.add('d-none');
                        photoPreview.src = '';
                    }
                    if (photoInput) {
                        photoInput.value = '';
                    }
                }

                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;

                setTimeout(() => {
                    window.location.href = 'list.html?updated=1';
                }, 1000);
            } catch (err) {
                showAlert(alertContainerId, err.message, 'danger');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
            }
        });
    }
}
