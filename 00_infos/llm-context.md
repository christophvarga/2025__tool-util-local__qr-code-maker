# QR Code Maker - LLM Context

> Version: 2.4.1
> Stand: 13.07.2026
> Status: **FEATURE-COMPLETE**

## Ziel & Scope

Lokales und live verfuegbares QR-Code-Generator-Tool als standalone Web-App. Laeuft komplett client-side (Vanilla JS), keine Server-Komponente noetig. Generiert QR-Codes fuer Text/URLs und WLAN-Zugangsdaten mit umfangreichen Anpassungsmoeglichkeiten (Styles, Farben, Logos, Themes, Groessen und Exportformaten).

**Zielgruppe:** Lokale Nutzung und statisches Live-Hosting unter `qr.varga.media`.

## Implementierte Features

| Feature | Status |
|---------|--------|
| Text/URL QR-Codes | Fertig |
| WLAN QR-Codes (SSID, Passwort, Verschluesselung) | Fertig |
| Error Correction Levels (Auto/L/M/Q/H - Auto: M, mit Logo H) | Fertig (v2.0.0) |
| Output-Groessen (256/512/1024/2048px, Export-Select) | Fertig (v2.0.0) |
| Live-Preview (debounced, kein Generieren-Button mehr) | Fertig (v2.0.0) |
| 3-Ebenen-UX: Inhalt/Stil/Farbe sichtbar - Branding/Erweitert collapsed | Fertig (v2.0.0) |
| Typ-Chips (Link/WLAN/Text) + "Mehr"-Menue fuer 6 Sekundaertypen | Fertig (v2.0.0) |
| Stil-Presets mit echten Mini-QR-Thumbnails | Fertig (v2.0.0) |
| Farbmodus-Segment (Einfarbig/Verlauf/Transparent) + Paar-Swatches | Fertig (v2.0.0) |
| Scan-Check Ampel (Kontrast, Logo-Coverage, Payload-Laenge) | Fertig (v2.0.0) |
| Payload-Auto-Erkennung im Link-Feld (WIFI:/tel:/mailto:/vCard) | Fertig (v2.0.0) |
| Design-Persistenz via localStorage (kein Inhalt) | Fertig (v2.0.0) |
| Ein Reset + Undo-Toast, Cmd/Ctrl+S als Download-Shortcut | Fertig (v2.0.0) |
| QR-Code Styles (klassisch, abgerundet, Punkte, classy) | Fertig (v1.3.0) |
| SEO + Agent-Discoverability (Meta/OG/JSON-LD, robots.txt, sitemap.xml, llms.txt, favicon.svg) | Fertig (v2.3.0) |
| og:image Link-Preview (1200x630, og-template.html als Quelle, twitter summary_large_image) | Fertig (v2.3.1) |
| Self-hosted Fonts + QR-Lib (kein Google Fonts/CDN, CSP nur self+analytics) + Impressum-Footer | Fertig (v2.4.0) |
| Finder/Ecken-Styles (klassisch, abgerundet, Kreise) | Fertig (v1.3.0) |
| UI Themes & Farb-Presets | Fertig (v1.3.0) |
| Farbanpassung (Vorder-/Hintergrund) | Fertig |
| Farbverlauf mit Toggle und Verlaufstyp | Fertig |
| Logo-Integration (8-30%) und Mitte-Badge | Fertig |
| Download als PNG/SVG/PDF/EPS | Fertig (v1.3.0) |
| Responsive Glassmorphism-UI | Fertig |
| Input-Sanitization & WiFi-Escaping | Fertig (v1.2.0) |
| File-Upload-Validierung (5MB, Typ, Dimensions) | Fertig (v1.2.0) |
| CSP Meta-Tag & SRI-Hash | Fertig (v1.2.0) |
| ARIA-Attribute & Keyboard-Navigation | Fertig (v1.2.0) |
| Inline Error-Messages (statt alert()) | Fertig (v1.2.0) |
| prefers-reduced-motion Support | Fertig (v1.2.0) |
| Docker Health-Check & Nginx-Optimierung | Fertig (v1.2.0) |

## Tech Stack

- **Frontend:** Vanilla JS (ES6+), HTML5, CSS3
- **QR-Library:** qrcode-generator@1.4.4, lokal unter `vendor/qrcode.min.js`
- **Fonts:** Fraunces und Outfit, lokal unter `fonts/`
- **Tests:** Playwright (Python) - 94 E2E-Tests
- **CI/CD:** Woodpecker CI, Deployment aus `main`
- **Container:** Nginx Alpine mit Custom-Config (Gzip, Caching, Health-Endpoint)

## Architektur

`index.html`, `styles.css` und `script.js` bilden eine rein clientseitige App.
Die QR-Bibliothek und Fonts liegen versioniert im Repo. Nginx liefert die
statischen Dateien aus; es gibt weder Backend noch Datenbank.

## Betrieb

Die App laeuft auf `hetzner-fsn1` hinter isoliertem Cloudflare Access. Der
kanonische Health-Zielpfad ist `https://qr.varga.media/`. Diagnose und lokaler
Smoke stehen in `00_infos/runbooks/static-site-operations.md`.

## Schnittstellen

- Browser-Eingaben bleiben clientseitig; Inhalte werden nicht serverseitig gespeichert.
- Oeffentliche Artefakte: `/`, `robots.txt`, `sitemap.xml` und `llms.txt`.
- Fleet-Deployment und Access-Grenze kommen aus `infra--ci-cd`.

## STOP/HOLD/ASK/CONFIRM

- **STOP:** Keine aktiven STOPs.
- **HOLD:** Keine offenen HOLDs (siehe `00_infos/meta/open-questions.md`).
- **ASK:** Bei neuen Features oder groesseren Aenderungen.
- **CONFIRM:** Bei Aenderungen am Design System.

## Tests & Reports

**Gruen bedeutet:**
- Alle 94 Playwright-Tests bestanden (Stand v2.0.0)
- Core-Funktionalitaet, Edge Cases, Visual Rendering, Accessibility, Security abgedeckt

**Testausfuehrung:**
```bash
# Setup (einmalig)
pip install -r requirements.txt && playwright install chromium

# Tests ausfuehren
pytest 87_tests/ -v

# Oder via Make
make install   # Setup
make test      # Tests ausfuehren
make test-report  # Tests mit JUnit/Coverage-Artefakten
```

## Strukturkonventionen

- `index.html`, `script.js`, `styles.css` - Hauptanwendung (Root-Level, da standalone Tool)
- `nginx.conf` - Custom Nginx-Konfiguration (Gzip, Caching, Health-Endpoint)
- `00_infos/` - Dokumentation und Kontext
- `00_infos/details/ux-ui-konzept-sota.md` - UX/UI-Konzept hinter dem v2.0.0-Redesign
- `87_tests/e2e/test_qr_code_ui.py` - Core UI Tests (PageLoad, Tabs, Accessibility, Text/URL)
- `87_tests/e2e/test_qr_code_features.py` - Feature Tests (WLAN, Design, Settings, Regeneration)
- `87_tests/conftest.py` - Test-Fixtures
- `requirements.txt` - Test-Dependencies (Playwright, pytest)
- `Makefile` - Build-Targets (install, test, test-report)
- `venv/` - Python Virtual Environment fuer Tests
- `89_output/` - Test-Artefakte und generierte Screenshots (NICHT ins Repo-Root!)

## Security

- **CSP:** Content Security Policy begrenzt aktive Inhalte auf lokale Quellen und Analytics
- **Supply Chain:** QR-Bibliothek und Fonts sind versioniert und werden lokal ausgeliefert
- **Input-Validierung:** Max-Length auf Textfeldern, WiFi-Sonderzeichen-Escaping
- **File-Upload:** 5MB Limit, MIME-Type-Pruefung, Dimensions-Check (4096px max)
- **Error-Handling:** try-catch um Canvas-Ops, FileReader, Download
