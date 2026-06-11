# Changes - QR Code Maker


## [2026-06-11 01:37] Session 20260611-013726

### Commits
d5be442 feat(ui): Visuelles Redesign v2.2.0 'Fine Print Atelier'
e118777 fix(ui): Mobile-Layout + Spacing-Feinschliff v2.1.0
00b115a chore(docs): Session-Doku v2.0.1 + gitignore fuer Deploy-Worktrees/Session-Locks
1a7eba0 fix(ci): deploy-trigger auf local-backend Agent umstellen (image bash statt alpine)
6dfcbc3 feat(ui): SOTA-Redesign v2.0.0 - Live-Preview, 3-Ebenen-UX, Stil-Presets, Scan-Check

### Staged Changes
- Keine staged Changes

### Unstaged Changes
00_infos/llm-context.md | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

---


## [2026-06-11] Visuelles Redesign v2.2.0 "Fine Print Atelier"

### Aenderungen
- **Typografie:** Fraunces (Display-Serif) fuer H1/Export-Label + Outfit 400-600 fuer UI; 800-Gewichte komplett entfernt
- **Tiefe statt flacher Kaesten:** Haarlinien (rgba-Borders), Inner-Highlights, Orchid-Glows, feines SVG-Korn ueber der Buehne
- **Preset-Kacheln:** abgerundete Thumbs mit Schatten statt "Briefmarken", aktive Kachel mit weichem Glow
- **Farb-Paar-Swatches:** zweigeteilte Dots (Hintergrund/Vordergrund) - dunkle Paletten jetzt sichtbar (script.js)
- **Farb-Picker:** runde Color-Inputs statt Formularfeld-Optik
- **Akkordeons:** feiner Chevron, ruhige Summary-Zeilen
- **Status:** pulsierender Erfolgs-Dot, schlankere Karte; Ghost-QR besser sichtbar (0.38)
- **Buttons:** Download mit Innen-Highlight + Glow, Ghost-Buttons konsistent, Mode-Segment mit Schatten
- **Micro-Motion:** Shell-Rise beim Laden, Tab-Fade, Toast-Rise - alles unter prefers-reduced-motion deaktiviert
- Asset-Version v2.2.0; 94 E2E-Tests gruen; Screenshot-verifiziert (Desktop/Mobile)

---


## [2026-06-11 01:19] Session 20260611-011937

### Commits
e118777 fix(ui): Mobile-Layout + Spacing-Feinschliff v2.1.0
00b115a chore(docs): Session-Doku v2.0.1 + gitignore fuer Deploy-Worktrees/Session-Locks
1a7eba0 fix(ci): deploy-trigger auf local-backend Agent umstellen (image bash statt alpine)
6dfcbc3 feat(ui): SOTA-Redesign v2.0.0 - Live-Preview, 3-Ebenen-UX, Stil-Presets, Scan-Check

### Staged Changes
- Keine staged Changes

### Unstaged Changes
00_infos/llm-context.md | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

---


## [2026-06-11] Mobile/Spacing-Feinschliff v2.1.0 (Screenshot-verifiziert)

### Aenderungen
- **Mobile-Layout repariert:** Sticky-Leiste oben zeigt nur noch kompakten Live-QR (76-92px) + Scan-Status; der komplette Export-Block wandert ans Seitenende (vorher fuellte er den ganzen ersten Screen)
- **Sticky-Fix:** `overflow: hidden` auf `.app-shell` brach `position: sticky` - auf Mobile/Tablet `overflow: visible`, Panel via `display: contents` aufgeloest
- **Kompakter Mobile-Header:** einzeilig, Subtitle ausgeblendet, kleinere Brand-Mark
- **Tablet:** Stil-Presets 6-spaltig (vorher 3 riesige Kacheln); Mobile bleibt 3-spaltig
- **Mobile-Polish:** Farbmodus-Segment full-width, Format-Grid 4-spaltig, Undo-Toast full-width
- **Verifikation:** Playwright-Screenshots Desktop 1440 / Tablet 820 / Mobile 375 (top, gescrollt, mit Inhalt); 94 E2E-Tests gruen
- Asset-Version auf v2.1.0 (Cache-Bust)

---


## [2026-06-11 00:40] Session 20260611-004000

### Commits
00b115a chore(docs): Session-Doku v2.0.1 + gitignore fuer Deploy-Worktrees/Session-Locks
1a7eba0 fix(ci): deploy-trigger auf local-backend Agent umstellen (image bash statt alpine)
6dfcbc3 feat(ui): SOTA-Redesign v2.0.0 - Live-Preview, 3-Ebenen-UX, Stil-Presets, Scan-Check

### Staged Changes
- Keine staged Changes

### Unstaged Changes
00_infos/llm-context.md | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

---


## [2026-06-11 00:36] Session 20260611-003611

### Commits
1a7eba0 fix(ci): deploy-trigger auf local-backend Agent umstellen (image bash statt alpine)
6dfcbc3 feat(ui): SOTA-Redesign v2.0.0 - Live-Preview, 3-Ebenen-UX, Stil-Presets, Scan-Check

### Staged Changes
- Keine staged Changes

### Unstaged Changes
00_infos/llm-context.md | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

---


## [2026-06-11] UX/UI-Redesign v2.0.0 (SOTA-Konzept umgesetzt)

### Aenderungen
- **Live-Preview:** Generieren-Button entfernt, debounced Rendering (150ms) bei jeder Eingabe
- **3-Ebenen-UX:** Inhalt/Stil/Farbe immer sichtbar; Branding + Erweitert als collapsed Accordions
- **Typ-Auswahl:** 3 Chips (Link/WLAN/Text) + "Mehr"-Menue fuer E-Mail/Telefon/SMS/vCard/PayPal/Custom
- **Stil-Presets:** 5 kuratierte Presets mit echten Mini-QR-Thumbnails + "Eigene"-Kachel
- **Farb-Block konsolidiert:** Modus-Segment (Einfarbig/Verlauf/Transparent) + 6 Paar-Swatches
- **Scan-Check:** Ampel-Status mit Kontrast- (WCAG-Luminanz), Logo-Coverage- und Payload-Warnungen
- **ECC Auto:** Default Auto (M, bei Logo H); Export-Groessen 256-2048px als Select
- **Polish:** Payload-Auto-Erkennung, localStorage-Design-Persistenz, ein Reset + Undo-Toast, Cmd/Ctrl+S
- **Tests:** Suite an neue UI angepasst, 94 Playwright-E2E-Tests gruen
- **Konzept:** `00_infos/details/ux-ui-konzept-sota.md`

---


## [2026-06-10 23:12] Session 20260610-231252

### Commits
5e953c0 chore(contract): smoke-Kommando (Fleet-Gap)
4c1305e feat(ui): convert QR maker to compact one-pager

### Staged Changes
- Keine staged Changes

### Unstaged Changes
00_infos/llm-context.md | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

---


## [2026-02-27] Cleanup: Stale Test-PNGs entfernt (v1.2.15)

### Aenderungen
- **18 PNG-Dateien entfernt**: test_*.png, fix_verified_*.png, wlan_qr_*.png aus Repo-Root (~5MB)
- **llm-context.md**: Hinweis ergaenzt, dass generierte Screenshots nach `89_output/` gehoeren; Version 1.2.15

### Entfernte Dateien
- 18 PNG-Testbilder (generiert waehrend Entwicklung, gitignored aber im Working Directory)

### Geaenderte Dateien
- `00_infos/llm-context.md` - v1.2.15, Strukturhinweis fuer 89_output/
- `90_reports/changes.md` - Aktualisiert

### Tests
- Keine Testaenderungen (nur Cleanup)

### Risiken/HOLDs
- Keine

---

## [2026-02-26 13:14] Session 20260226-131437

### Commits
3574ffc chore(session): Auto-commit at session end
274f17a docs: bump llm-context to v1.2.6 and update changes report
2788232 feat(tests): split test suite into core UI and feature tests

### Staged Changes
- Keine staged Changes

### Unstaged Changes
00_infos/llm-context.md |  2 +-
 90_reports/changes.md   | 50 +++++++++++++++++++++++++++++++++++++++++++++++++
 2 files changed, 51 insertions(+), 1 deletion(-)

---

## [2026-02-26 13:14] Session 20260226-131403

### Commits
3574ffc chore(session): Auto-commit at session end
274f17a docs: bump llm-context to v1.2.6 and update changes report
2788232 feat(tests): split test suite into core UI and feature tests

### Staged Changes
- Keine staged Changes

### Unstaged Changes
00_infos/llm-context.md |  2 +-
 90_reports/changes.md   | 33 +++++++++++++++++++++++++++++++++
 2 files changed, 34 insertions(+), 1 deletion(-)

---

## [2026-02-26 12:49] Session 20260226-124909

### Commits
3574ffc chore(session): Auto-commit at session end
274f17a docs: bump llm-context to v1.2.6 and update changes report
2788232 feat(tests): split test suite into core UI and feature tests

### Staged Changes
- Keine staged Changes

### Unstaged Changes
00_infos/llm-context.md |  2 +-
 90_reports/changes.md   | 16 ++++++++++++++++
 2 files changed, 17 insertions(+), 1 deletion(-)

---

## [2026-02-26 12:46] Session 20260226-124623

### Commits
3574ffc chore(session): Auto-commit at session end
274f17a docs: bump llm-context to v1.2.6 and update changes report
2788232 feat(tests): split test suite into core UI and feature tests

### Staged Changes
- Keine staged Changes

### Unstaged Changes
00_infos/llm-context.md | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

---

## [2026-02-26 12:43] Session 20260226-124344

### Commits
274f17a docs: bump llm-context to v1.2.6 and update changes report
2788232 feat(tests): split test suite into core UI and feature tests

### Staged Changes
- Keine staged Changes

### Unstaged Changes
00_infos/llm-context.md | 17 +++++++++++-----
 90_reports/changes.md   | 52 +++++++++++++++++++++++++++++++++++++++++++++++++
 2 files changed, 64 insertions(+), 5 deletions(-)

---
## [2026-02-26] Add requirements.txt and Makefile (v1.2.9)

### Aenderungen
- **requirements.txt**: Test-Dependencies mit gepinnten Versionen (playwright==1.57.0, pytest==9.0.2, pytest-playwright==0.7.2, pytest-base-url==2.1.0, pytest-cov==7.0.0)
- **Makefile**: Targets `install`, `test`, `test-report` (kanonisches Format)
- **llm-context.md**: Setup-Anleitung aktualisiert, neue Dateien dokumentiert, Version 1.2.9

### Neue Dateien
- `requirements.txt`
- `Makefile`

### Geaenderte Dateien
- `00_infos/llm-context.md` - v1.2.9, Setup-Docs

### Tests
- 47 Tests, alle bestanden (keine Aenderung an Testcode)

### Risiken/HOLDs
- Keine

---

## [2026-02-26 12:35] Session 20260226-123505

### Commits
274f17a docs: bump llm-context to v1.2.6 and update changes report
2788232 feat(tests): split test suite into core UI and feature tests

### Staged Changes
- Keine staged Changes

### Unstaged Changes
00_infos/llm-context.md |  2 +-
 90_reports/changes.md   | 15 +++++++++++++++
 2 files changed, 16 insertions(+), 1 deletion(-)

---

## [2026-02-26 12:34] Session 20260226-123400

### Commits
274f17a docs: bump llm-context to v1.2.6 and update changes report
2788232 feat(tests): split test suite into core UI and feature tests

### Staged Changes
- Keine staged Changes

### Unstaged Changes
00_infos/llm-context.md | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

---

## [2026-02-26 12:22] Session 20260226-122220

### Commits
2788232 feat(tests): split test suite into core UI and feature tests

### Staged Changes
- Keine staged Changes

### Unstaged Changes
00_infos/llm-context.md | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

---

## [2026-02-08 16:41] Session 20260208-164124

### Commits
- Keine neuen Commits

### Staged Changes
- Keine staged Changes

### Unstaged Changes
00_infos/llm-context.md | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

---

## [2026-02-07 22:13] Session 20260207-221320

### Commits
79e9a6a chore(cleanup): post-audit fixes -- remove legacy tests, fix nginx headers, cleanup docker-compose
1deda27 chore(session): Auto-commit at session end
bd8713f feat(security,a11y,refactor): harden app with input validation, ARIA, and code quality improvements; bump v1.2.0

### Staged Changes
- Keine staged Changes

### Unstaged Changes
00_infos/llm-context.md | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

---
## [2026-02-07] Post-Audit Cleanup (v1.2.2)

### Aenderungen
- **Legacy-Tests entfernt**: 5 veraltete Root-Level Testdateien entfernt (test_qr_generator.py, test_wlan_visual.py, test_ecc_pixel.py, test_high_pixel.py, test_fix_verification.py). Diese waren nach dem Security/A11y-Refactoring nicht mehr funktional (erwarteten alert() statt inline errors, falscher ECC-Default, hardcoded localhost, headless=False).
- **nginx.conf Security-Headers**: X-Frame-Options und Referrer-Policy in location-Bloecken ergaenzt (nginx add_header Vererbung ist nicht additiv -- location-Block-Headers ersetzen Server-Level-Headers).
- **docker-compose.yml**: Deprecated `version` Key entfernt (Docker Compose V2).
- **Test-Report korrigiert**: TestAccessibility Zaehlerfehler behoben (10, nicht 11 Tests).
- **coverage.md erstellt**: Fehlender Report nach Workflow-Standard.
- **llm-context.md**: Version auf 1.2.2 gebumpt.

### Entfernte Dateien
- `test_qr_generator.py` (Legacy, broken)
- `test_wlan_visual.py` (Legacy, broken)
- `test_ecc_pixel.py` (Legacy, broken)
- `test_high_pixel.py` (Legacy, broken)
- `test_fix_verification.py` (Legacy, broken)

### Geaenderte Dateien
- `nginx.conf` - Security-Headers in location-Bloecken
- `docker-compose.yml` - version Key entfernt
- `90_reports/test-report.md` - Zaehlerfehler behoben
- `90_reports/coverage.md` - Neu erstellt
- `90_reports/changes.md` - Aktualisiert
- `00_infos/llm-context.md` - v1.2.2

### Tests
- 47 Tests, alle bestanden (keine Aenderung an Testcode)

### Risiken/HOLDs
- Keine

---

## [2026-02-07 22:06] Session 20260207-220631

### Commits
bd8713f feat(security,a11y,refactor): harden app with input validation, ARIA, and code quality improvements; bump v1.2.0

### Staged Changes
- Keine staged Changes

### Unstaged Changes
00_infos/llm-context.md | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

---
## Datum: 07.02.2026

## Aenderungen

### Security Fixes
- **Input-Sanitization**: Max-Length Validierung (4296 Zeichen) fuer QR-Text, 32/63 Zeichen fuer SSID/Passwort
- **WiFi-Format-Escaping**: Sonderzeichen (`;`, `\`, `:`, `"`) in SSID/Passwort werden per Backslash escaped
- **File-Upload-Validierung**: 5MB Groessenlimit, MIME-Type-Pruefung (PNG/JPG/GIF/WebP), Dimensions-Check (4096px max)
- **SRI-Hash**: Subresource Integrity auf CDN-Link fuer qrcode-generator@1.4.4
- **CSP Meta-Tag**: Content Security Policy in index.html (script-src, style-src, font-src, img-src)
- **noscript Fallback**: Hinweis wenn JavaScript deaktiviert

### Accessibility
- **ARIA-Attribute**: `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`, `aria-labelledby`
- **Keyboard-Navigation**: Pfeiltasten (Links/Rechts/Hoch/Runter) plus Home/End zwischen Tabs
- **Canvas-Accessibility**: `aria-label="Generierter QR-Code"` und `role="img"` auf Canvas
- **prefers-reduced-motion**: CSS Media Query die alle Animationen deaktiviert
- **alert() ersetzt**: Durch inline Error-Messages (div mit `role="alert"` und `aria-live="assertive"`)
- **Farbkontrast verbessert**: Subtitle (#555 statt #666), Tab-Text (#475569 statt #64748b), Download-Button (#064e2c)
- **Focus-Visible**: Sichtbarer Fokus-Ring fuer Keyboard-Navigation auf Buttons und Tabs

### Code-Refactoring
- **generateQRCode() aufgeteilt**: In `getInputText()`, `createQRMatrix()`, `renderToCanvas()`, `drawLogo()`, plus `showError()`/`clearError()`
- **Error-Handling**: try-catch um Canvas-Operationen, FileReader, und Download
- **Inline-Styles entfernt**: 4 inline Styles nach CSS verschoben (`.color-label`, `.logo-name-display`)
- **Doppelten Font-Import entfernt**: Nur noch in HTML (CSS @import entfernt)

### Docker-Optimierung
- **Health-Check**: In Dockerfile (`HEALTHCHECK` Directive) und docker-compose.yml
- **Custom nginx.conf**: Gzip-Kompression, Caching-Headers (7d/30d), Security-Headers, `/health` Endpoint

### Dokumentation
- **open-questions.md** erstellt (HOLD-Template)
- **llm-context.md** aktualisiert auf v1.2.0

### Neue Dateien
- `nginx.conf` - Custom Nginx-Konfiguration
- `00_infos/meta/open-questions.md` - HOLD-Template

### Geaenderte Dateien
- `index.html` - ARIA, SRI, CSP, noscript, Inline-Styles entfernt
- `script.js` - Security, Accessibility, Refactoring
- `styles.css` - prefers-reduced-motion, Kontrast, Font-Import-Dedup, neue CSS-Klassen
- `Dockerfile` - Custom nginx.conf, HEALTHCHECK
- `docker-compose.yml` - Health-Check Konfiguration
- `87_tests/e2e/test_qr_code_ui.py` - 14 neue Tests (Accessibility, Security, Error-Handling)
- `00_infos/llm-context.md` - Version 1.2.0
- `90_reports/test-report.md` - Aktualisiert
- `90_reports/changes.md` - Aktualisiert

## Tests
- 47 Tests total (vorher 33), alle bestanden
- 14 neue Tests: Accessibility (10), Security (1), Error-Handling (2), Canvas A11y (1)

## Risiken/HOLDs
- Keine
