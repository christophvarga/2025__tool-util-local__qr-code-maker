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
│  - Download-Handler                 │
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
│   - PNG-Export                      │
└─────────────────────────────────────┘
```

## Services & Schnittstellen

**Keine externen Services.** Die App laeuft komplett client-side im Browser. Die einzige externe Abhaengigkeit ist die QR-Code-Generator-Library via CDN (`https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js`).

**Interne Module (script.js):**
- `generateQRCode()` - Haupt-Entry-Point, koordiniert QR-Generierung
- Tab-Event-Listener - UI-Navigation
- Canvas-Manipulation - Rendering mit Farben, Gradienten, Logos
- FileReader-API - Logo-Upload verarbeiten
- Blob/URL-API - PNG-Download

## Nicht-Ziele & Constraints

- **Kein Backend:** Rein client-side, keine Server-Logik
- **Kein Deployment:** Lokales Tool, keine Edge-Integration
- **Keine Persistenz:** Kein LocalStorage, keine DB
- **Keine User-Verwaltung:** Single-User Tool
- **Browser-Abhaengig:** Benoetigt moderne Browser mit Canvas-Support
- **Keine SVG-Ausgabe:** Nur PNG-Export implementiert
