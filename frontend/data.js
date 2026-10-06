/**
 * TechSwap Maroc — Data Source
 * Listings, Categories & Cities
 */

const CATEGORIES = [
    "Smartphones",
    "Ordinateurs portables",
    "Consoles & Jeux",
    "Tablettes",
    "Audio & Hi-Fi",
    "Écrans & Moniteurs",
    "Accessoires & Périphériques",
    "Photo & Caméras"
];

const VILLES = [
    "Casablanca",
    "Rabat",
    "Marrakech",
    "Tanger",
    "Fès",
    "Agadir",
    "Ifrane",
    "El Jadida"
];

const ANNONCES = [
    {
        id: 1,
        titre: "MacBook Pro 14\" M1 Pro (16 Go / 512 Go SSD)",
        description: "MacBook Pro 14 pouces en parfait état, santé batterie 94%, chargeur MagSafe 67W d'origine et boîte complète inclus.",
        categorie: "Ordinateurs portables",
        ville: "Casablanca",
        prix: 13500,
        etat: "Comme neuf",
        statut: "Disponible",
        photos: [
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80"
        ],
        date: "2026-03-28"
    },
    {
        id: 2,
        titre: "iPhone 14 Pro Max 256 Go Noir Sidéral",
        description: "Batterie 89%, aucun impact ni micro-rayure, protégé dès le premier jour avec verre trempé et coque Spigen. Facture d'achat fournie.",
        categorie: "Smartphones",
        ville: "Rabat",
        prix: 8900,
        etat: "Très bon état",
        statut: "Disponible",
        photos: [
            "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=500&auto=format&fit=crop&q=80"
        ],
        date: "2026-03-30"
    },
    {
        id: 3,
        titre: "PlayStation 5 Édition Standard + 2 Manettes DualSense",
        description: "PS5 avec lecteur disque, 2 manettes officielles sans aucun stick drift, câble HDMI 2.1 ultra high-speed et socle. Très peu servie.",
        categorie: "Consoles & Jeux",
        ville: "Marrakech",
        prix: 4600,
        etat: "Comme neuf",
        statut: "Disponible",
        photos: [
            "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&auto=format&fit=crop&q=80"
        ],
        date: "2026-04-01"
    },
    {
        id: 4,
        titre: "Dell XPS 15 9520 (i7 12th / 32 Go / 1 To SSD / RTX 3050)",
        description: "Station mobile de travail puissante pour dev et graphisme. Écran 3.5K OLED tactile somptueux. Légère trace d'usure sur le capot inférieur.",
        categorie: "Ordinateurs portables",
        ville: "Tanger",
        prix: 11200,
        etat: "Bon état",
        statut: "Vendu",
        photos: [
            "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=80"
        ],
        date: "2026-03-15"
    },
    {
        id: 5,
        titre: "iPad Air 5 (Puce M1 / 64 Go Wi-Fi) + Apple Pencil 2",
        description: "iPad Air couleur Bleu ciel avec stylet Apple Pencil 2ème génération et étui smart folio magnétique. Écran retina intact.",
        categorie: "Tablettes",
        ville: "Agadir",
        prix: 5400,
        etat: "Comme neuf",
        statut: "Disponible",
        photos: [
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80"
        ],
        date: "2026-04-02"
    },
    {
        id: 6,
        titre: "Écran Gaming ASUS TUF 27\" VG27AQ (2K 165Hz IPS 1ms)",
        description: "Moniteur gamer QHD 2560x1440, dalle IPS ultra réactive, compatible G-Sync/FreeSync, pied ergonomique ajustable et pivotant. Aucun pixel mort.",
        categorie: "Écrans & Moniteurs",
        ville: "Fès",
        prix: 2400,
        etat: "Très bon état",
        statut: "Disponible",
        photos: [
            "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=80"
        ],
        date: "2026-03-22"
    },
    {
        id: 7,
        titre: "Casque Sans Fil Sony WH-1000XM4 Réduction de Bruit",
        description: "Casque Bluetooth circum-aural avec réduction active de bruit référence. Coussinets changés à neuf, livré avec étui rigide et câble jack.",
        categorie: "Audio & Hi-Fi",
        ville: "Ifrane",
        prix: 1750,
        etat: "Bon état",
        statut: "Disponible",
        photos: [
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&auto=format&fit=crop&q=80"
        ],
        date: "2026-03-18"
    },
    {
        id: 8,
        titre: "Samsung Galaxy S23 Ultra 512 Go Vert Fantôme",
        description: "Flagship avec S-Pen intégré, capteur photo 200MP et zoom x100. État esthétique et fonctionnel irréprochable avec boîte et câble d'origine.",
        categorie: "Smartphones",
        ville: "El Jadida",
        prix: 7900,
        etat: "Comme neuf",
        statut: "Vendu",
        photos: [
            "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=80"
        ],
        date: "2026-03-25"
    }
];

// Global window exposure for compatibility
window.CATEGORIES = CATEGORIES;
window.VILLES = VILLES;
window.ANNONCES = ANNONCES;
