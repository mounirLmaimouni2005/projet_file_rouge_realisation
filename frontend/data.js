/**
 * TechSwap Maroc — Data Source
 * Seeded with realistic Moroccan listings matching MySQL & backend/storage/annonces.json
 */

const CATEGORIES = [
    "Smartphones & Tablets",
    "Computers & IT",
    "Household Appliances - Domestique",
    "TV & Audio",
    "Pro & Commercial Gear - HoReCa/POS/Vitrines",
    "Gaming & Consoles",
    "Cameras & Creator Gear",
    "Green Energy & Smart Home",
    "Networking & Telecom",
    "DIY, Repair & Lab Tools",
    "Pro Audio & Live Events",
    "Edge Computing & Mini-Data/NAS",
    "Micro-Mobility Tech - Trottinettes/E-bikes"
];

const VILLES = [
    "Casablanca",
    "Rabat",
    "Marrakech",
    "Tanger",
    "Agadir",
    "Fès",
    "Meknès",
    "Oujda",
    "Kenitra",
    "Tétouan",
    "Safi",
    "El Jadida",
    "Béni Mellal",
    "Nador",
    "Mohammedia",
    "Khouribga",
    "Settat",
    "Essaouira",
    "Ifrane",
    "Laâyoune",
    "Dakhla"
];

const ANNONCES = [
    {
        id: 15,
        titre: "Apple MacBook Pro 14\" M2 Pro (16 Go / 512 Go SSD)",
        description: "MacBook Pro 14 pouces gris sidéral en parfait état cosmétique et fonctionnel. Santé de la batterie 95%, vendu avec chargeur d'origine 67W, câble MagSafe et boîte. Jamais réparé, acheté à la Fnac.",
        categorie: "Computers & IT",
        ville: "Casablanca",
        prix: 14500,
        etat: "like_new",
        statut: "available",
        photos: [
            "../backend/uploads/img_6ac439eeaa0309.27805554.png"
        ],
        date: "2026-10-08"
    },
    {
        id: 16,
        titre: "iPhone 14 Pro 256 Go Noir Sidéral (Batterie 91%)",
        description: "iPhone 14 Pro 256 Go sans aucune micro-rayure ni choc. Toujours protégé avec verre trempé et coque Spigen. Vendu avec boîte d'origine, câble lightning et facture. Face ID et caméras impeccables.",
        categorie: "Smartphones & Tablets",
        ville: "Rabat",
        prix: 8200,
        etat: "like_new",
        statut: "available",
        photos: [
            "../backend/uploads/img_6ac43d4d4c3885.28261854.png"
        ],
        date: "2026-10-08"
    },
    {
        id: 17,
        titre: "Sony PlayStation 5 Standard + 2 Manettes DualSense + FIFA",
        description: "Console PS5 édition avec lecteur blu-ray en très bon état. Livrée avec deux manettes officielles DualSense blanches en parfait état (zéro drift), socle, câble HDMI 2.1 et jeu EA FC 24.",
        categorie: "Gaming & Consoles",
        ville: "Marrakech",
        prix: 4800,
        etat: "like_new",
        statut: "available",
        photos: [
            "../backend/uploads/img_6ac4d62f9001f9.73026289.png"
        ],
        date: "2026-10-08"
    },
    {
        id: 18,
        titre: "Dell XPS 15 9520 Core i7-12700H 32 Go 1 To RTX 3050",
        description: "Station de travail haut de gamme pour graphistes et développeurs. Écran 3.5K OLED tactile magnifique, 32 Go RAM DDR5, SSD NVMe 1 To, batterie en très bonne santé. Chargeur 130W Type-C d'origine.",
        categorie: "Computers & IT",
        ville: "Tanger",
        prix: 11900,
        etat: "good",
        statut: "available",
        photos: [
            "../backend/uploads/img_6ac4df64b0d899.75438926.png"
        ],
        date: "2026-10-08"
    },
    {
        id: 19,
        titre: "iPad Air 5 M1 64 Go Wi-Fi Bleu + Apple Pencil 2",
        description: "iPad Air 5ème génération avec puce M1. Écran Liquid Retina impeccable, stylet Apple Pencil 2 d'origine et étui magnétique Smart Folio. Idéal pour études, dessin ou prise de note.",
        categorie: "Smartphones & Tablets",
        ville: "Agadir",
        prix: 5600,
        etat: "like_new",
        statut: "available",
        photos: [
            "../backend/uploads/img_6ac4e5408091e5.18087206.png"
        ],
        date: "2026-10-08"
    },
    {
        id: 20,
        titre: "Appareil Photo Sony Alpha 7 III (A7 III) Boîtier Nu",
        description: "Boîtier photo hybride plein format 24.2 MP, parfait pour vidéo 4K et photographie de portrait/paysage. 18 400 déclenchements, capteur très propre, livré avec 2 batteries et chargeur double.",
        categorie: "Cameras & Creator Gear",
        ville: "Fès",
        prix: 10500,
        etat: "good",
        statut: "available",
        photos: [
            "../backend/uploads/img_6ac4e55f22fcd8.03311833.png"
        ],
        date: "2026-10-08"
    },
    {
        id: 21,
        titre: "Écran PC Gamer ASUS TUF Gaming 27\" WQHD 165Hz",
        description: "Moniteur gaming 27 pouces 2560x1440 dalle IPS, temps de réponse 1ms, compatibilité G-Sync et HDR10. Pied ergonomique ajustable en hauteur et rotation portrait. Aucun pixel mort.",
        categorie: "Computers & IT",
        ville: "El Jadida",
        prix: 2400,
        etat: "good",
        statut: "available",
        photos: [
            "../backend/uploads/img_6ac4e56e914e11.49311293.png"
        ],
        date: "2026-10-08"
    },
    {
        id: 22,
        titre: "Casque Sans Fil Sony WH-1000XM4 Réduction de Bruit",
        description: "Casque arceau Bluetooth avec la meilleure réduction active du bruit du marché. Coussinets confortables changés à neuf, autonomie 30h. Livré avec étui de transport rigide, adaptateur avion et câble jack.",
        categorie: "TV & Audio",
        ville: "Ifrane",
        prix: 1750,
        etat: "good",
        statut: "available",
        photos: [
            "../backend/uploads/img_6ac4e5763075f7.26194256.png"
        ],
        date: "2026-10-08"
    },
    {
        id: 23,
        titre: "Samsung Galaxy S23 Ultra 512 Go Vert Fantôme",
        description: "Smartphone premium avec stylet S-Pen intégré, capteur photo 200 Mpx et zoom optique x100. État esthétique irréprochable avec boîte d'origine, câble USB-C et deux coques offertes.",
        categorie: "Smartphones & Tablets",
        ville: "Casablanca",
        prix: 7800,
        etat: "like_new",
        statut: "sold",
        photos: [
            "../backend/uploads/img_6ac4e57d319087.47889508.png"
        ],
        date: "2026-10-08"
    },
    {
        id: 24,
        titre: "Serveur NAS Synology DS220+ avec 2x 4 To WD Red Plus",
        description: "NAS 2 baies parfait pour sauvegarde réseau, stockage photo familial et serveur multimédia Plex. Livré avec 8 To de stockage total (disques WD Red NAS en santé parfaite 100% SMART).",
        categorie: "Edge Computing & Mini-Data/NAS",
        ville: "Rabat",
        prix: 3900,
        etat: "good",
        statut: "available",
        photos: [
            "../backend/uploads/img_6ac4e583298dd8.25534753.png"
        ],
        date: "2026-10-08"
    }
];

window.CATEGORIES = CATEGORIES;
window.VILLES = VILLES;
window.ANNONCES = ANNONCES;
