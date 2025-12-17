# QR Code Maker - LLM Context

> Version: 1.1.0
> Stand: 2025-12-13
> Status: **FEATURE-COMPLETE**

## Ziel & Scope

Lokales QR-Code-Generator-Tool als standalone Web-App. Laeuft komplett client-side (Vanilla JS), keine Server-Komponente noetig. Generiert QR-Codes fuer Text/URLs und WLAN-Zugangsdaten mit umfangreichen Anpassungsmoeglichkeiten (Farben, Logos, Groessen).

**Zielgruppe:** Lokale Nutzung, kein Deployment vorgesehen.

## Implementierte Features

| Feature | Status |
|---------|--------|
| Text/URL QR-Codes | Fertig |
| WLAN QR-Codes (SSID, Passwort, Verschluesselung) | Fertig |
| Error Correction Levels (L/M/Q/H) | Fertig |
| Output-Groessen (256/400/512/800px) | Fertig |
| Farbanpassung (Vorder-/Hintergrund) | Fertig |
| Farbverlauf mit Toggle | Fertig |
| Logo-Integration (5-30%) | Fertig |
| Logo-Entfernung | Fertig |
| Download als PNG | Fertig |
| Responsive Glassmorphism-UI | Fertig |
| **Accessibility (ARIA, Keyboard-Nav)** | Fertig |
| **Inline-Fehlermeldungen** | Fertig |
| **Passwort-Toggle WLAN** | Fertig |
| **Loading/Success State** | Fertig |
| **Reset Button** | Fertig |

## Tech Stack

- **Frontend:** Vanilla JS (ES6+), HTML5, CSS3
- **QR-Library:** qrcode-generator@1.4.4 (CDN)
- **Fonts:** Google Fonts - Outfit
- **Tests:** Playwright (Python) - 10 Testsuites, 47 Tests

## STOP/HOLD/ASK/CONFIRM

- **STOP:** Keine aktiven STOPs.
- **HOLD:** Keine offenen HOLDs.
- **ASK:** Bei neuen Features oder groesseren Aenderungen.
- **CONFIRM:** Bei Aenderungen am Design System.

## Tests & Reports

**Gruen bedeutet:**
- Alle 10 Playwright-Testsuites bestanden (47 Tests)
- Core-Funktionalitaet, Edge Cases, Accessibility, UX-Features abgedeckt

**Testsuites:**
- TestPageLoad (7 Tests)
- TestTabNavigation (4 Tests)
- TestTextURLQRCode (5 Tests)
- TestWLANQRCode (5 Tests)
- TestDesignOptions (4 Tests)
- TestAdvancedSettings (6 Tests)
- TestAccessibility (6 Tests) - NEU
- TestPasswordToggle (4 Tests) - NEU
- TestResetButton (4 Tests) - NEU
- TestQRCodeRegeneration (2 Tests)

**Testausfuehrung:**
```bash
# Tests ausfuehren (kein Server noetig - file:// Protokoll)
./venv/bin/pytest 87_tests/e2e/ --browser chromium -v
```

## Strukturkonventionen

- `index.html`, `script.js`, `styles.css` - Hauptanwendung (Root-Level, da standalone Tool)
- `00_infos/` - Dokumentation und Kontext
- `87_tests/e2e/` - Playwright E2E Tests
- `87_tests/conftest.py` - Pytest Fixtures
- `89_output/test_reports/` - Testartefakte (JUnit XML)
- `venv/` - Python Virtual Environment fuer Tests
