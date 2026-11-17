---
marp: true
theme: default
size: 16:9
paginate: true
style: |
  section {
    font-family: "Aptos", "Segoe UI", sans-serif;
    background: #f8fafc;
    color: #172033;
    padding: 48px 64px;
  }
  h1, h2 {
    color: #243b6b;
  }
  h1 {
    font-size: 2.4em;
  }
  h2 {
    font-size: 1.8em;
    margin-bottom: 0.7em;
  }
  ul {
    font-size: 1.25em;
    line-height: 1.65;
  }
  section.title-slide {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    text-align: center;
    gap: 0;
    padding: 28px 68px 32px;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
  }
  section.title-slide::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: linear-gradient(90deg, #243b6b, #328b98);
  }
  section.title-slide .brand-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: 0 0 14px;
  }
  section.title-slide .brand-row img {
    height: 68px;
    object-fit: contain;
  }
  section.title-slide .brand-row img:first-child {
    width: 68px;
  }
  section.title-slide .brand-row img:last-child {
    width: 190px;
  }
  section.title-slide .cover-kicker {
    color: #52658c;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.16em;
    margin-bottom: 8px;
  }
  section.title-slide h1 {
    color: #243b6b;
    font-size: 2.45em;
    letter-spacing: 0.04em;
    line-height: 1.05;
    margin: 0;
  }
  section.title-slide .cover-subtitle {
    color: #4b5568;
    font-size: 20px;
    line-height: 1.45;
    margin-top: 10px;
    max-width: 790px;
  }
  section.title-slide .cover-rule {
    background: #328b98;
    border-radius: 2px;
    height: 3px;
    margin: 20px auto 22px;
    width: 72px;
  }
  section.title-slide .academic-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    max-width: 1000px;
    text-align: left;
    width: 100%;
  }
  section.title-slide .academic-item {
    background: #ffffff;
    border: 1px solid #e3e9f1;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    grid-column: span 2;
    justify-content: center;
    min-height: 68px;
    padding: 10px 16px;
  }
  section.title-slide .academic-item:nth-child(4) {
    grid-column: 2 / span 2;
  }
  section.title-slide .academic-item:nth-child(5) {
    grid-column: 4 / span 2;
  }
  section.title-slide .academic-label {
    color: #64748b;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin-bottom: 4px;
    text-transform: uppercase;
  }
  section.title-slide .academic-value {
    color: #243b6b;
    font-size: 15px;
    font-weight: 600;
    line-height: 1.25;
  }
  section.title-slide .academic-value.placeholder {
    color: #64748b;
    font-style: italic;
    font-weight: 400;
  }
  section.image-only {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 24px;
  }
  section.image-only h2 {
    flex: 0 0 auto;
    margin: 0;
  }
  section.image-only p {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1 1 0;
    min-height: 0;
    margin: 0;
    width: 100%;
  }
  section.image-only img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
---

<!-- _class: title-slide -->

<div class="brand-row">
  <img src="assets/ofppt.png" alt="Logo OFPPT" />
  <img src="assets/solicode.png" alt="Logo SOLICODE" />
</div>

<div class="cover-kicker">PRÉSENTATION DU PROJET FIL ROUGE</div>

# TECHSWAP MOROCCO

<div class="cover-subtitle">Plateforme de vente et d'achat d'appareils électroniques d'occasion.</div>

<div class="cover-rule"></div>

<div class="academic-grid">
  <div class="academic-item">
    <span class="academic-label">RÉALISÉ PAR</span>
    <span class="academic-value">Mounir L Maimouni</span>
  </div>
  <div class="academic-item">
    <span class="academic-label">FILIÈRE</span>
    <span class="academic-value">Développement Web-Mobile</span>
  </div>
  <div class="academic-item">
    <span class="academic-label">ÉTABLISSEMENT</span>
    <span class="academic-value">Solicode Tanger</span>
  </div>
  <div class="academic-item">
    <span class="academic-label">ENCADRANT</span>
    <span class="academic-value placeholder">ES-seraj Fouad</span>
  </div>
  <div class="academic-item">
    <span class="academic-label">ANNÉE DE FORMATION</span>
    <span class="academic-value placeholder">2026-2027</span>
  </div>
</div>

---

## Remerciements

---

## Introduction

---

## Contexte du projet

---
# #methode de travail
---
<!-- _class: image-only -->

## Scrum

![Méthode Scrum](assets/scrum.png)

---
<!-- _class: image-only -->

## Processus 2TUP

![Processus 2TUP](assets/images.jpg)

---
<!-- _class: image-only -->

## Design Thinking

![Design Thinking](assets/design_thinking.jpg)

---

## planification
---
## Branche fonctionnelle

---

## Carte d'empathie

---

## Définition du problème

---

## Idéation

---
<!-- _class: image-only -->

## Diagramme de cas d'utilisation

![Diagramme de cas d'utilisation](assets/diagram-case-landscape.svg)

---

## Stack technologique

- **Backend** · PHP 8.2 · Laravel 12
- **Autorisations** · Spatie Laravel Permission
- **Mobile** · NativePHP
- **Frontend** · Blade · Tailwind CSS · Alpine · Preline · Vite
- **Base de données** · MySQL
- **Diagrammes** · Mermaid · PlantUML

---
<!-- _class: image-only -->

## Architecture

![Architecture du système](assets/architecture-diagram.png)

---
<!-- _class: image-only -->

## Diagramme de classes

![Diagramme de classes](assets/diagram-de-class.png)

---
## Prototype musical

- Genres · Artistes · Morceaux
- Création · Consultation · Modification · Suppression
- Statut · Brouillon ou publié
- Couvertures · Fichiers audio

---

## Relations des données

- **Artiste** → plusieurs morceaux
- **Genre** → plusieurs morceaux
- **Morceau** → un artiste + un genre

---

## Structure technique

- **Frontend** · HTML · CSS / Tailwind · JavaScript
- **Backend** · PHP · Contrôleurs · Services · DAO
- **API** · REST
- **Données** · MySQL / MariaDB · prototype JSON


## Maquettes

---

## realisation

---

## Conclusion

