# QR Code Maker - Architektur

> Version: 1.0.0

## Bausteine & Flow

```
[User Input]
     │
     ▼
┌─────────────────────────────────────┐
│         index.html (UI)             │
│  ┌─────────┬─────────┬───────────┐  │
│  │ Text-Tab│WLAN-Tab │Design-Tab │  │
│  └─────────┴─────────┴───────────┘  │
└─────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│         script.js (Logik)           │
│  - generateQRCode()                 │
│  - Tab-Switching                    │
│  - Canvas-Rendering                 │
│  - Logo-Overlay                     │
│  - Gradient-Rendering               │
│  - PNG/SVG/PDF/EPS-Export           │
└─────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│   qrcode-generator (CDN Library)    │
│   - QR-Matrix generieren            │
│   - ECC-Level verarbeiten           │
└─────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│      Canvas (Browser-API)           │
│   - Pixel-Rendering                 │
│   - PNG/PDF-Export                  │
└─────────────────────────────────────┘
```

## Services & Schnittstellen

**Keine externen Services.** Die App laeuft komplett client-side im Browser. Die einzige externe Abhaengigkeit ist die QR-Code-Generator-Library via CDN (`https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js`).

**Interne Module (script.js):**
- `generateQRCode()` - Haupt-Entry-Point, koordiniert QR-Generierung
- Tab-Event-Listener - UI-Navigation
- Canvas-Manipulation - Rendering mit Styles, Farben, Gradienten, Logos und Badge
- SVG/EPS/PDF-Builder - Client-side Export ohne Backend
- FileReader-API - Logo-Upload verarbeiten
- Blob/URL-API - Datei-Downloads

## Nicht-Ziele & Constraints

- **Kein Backend:** Rein client-side, keine Server-Logik
- **Deployment nur statisch:** Auslieferung als nginx-Container hinter Traefik
- **Keine Persistenz:** Kein LocalStorage, keine DB
- **Keine User-Verwaltung:** Single-User Tool
- **Browser-Abhaengig:** Benoetigt moderne Browser mit Canvas-Support
