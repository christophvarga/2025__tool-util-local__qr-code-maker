# QR Code Maker - LLM Context

> Version: 1.0.0
> Stand: 2025-12-12
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
| Download als PNG | Fertig |
| Responsive Glassmorphism-UI | Fertig |

## Tech Stack

- **Frontend:** Vanilla JS (ES6+), HTML5, CSS3
- **QR-Library:** qrcode-generator@1.4.4 (CDN)
- **Fonts:** Google Fonts - Outfit
- **Tests:** Playwright (Python) - 5 Testsuites

## STOP/HOLD/ASK/CONFIRM

- **STOP:** Keine aktiven STOPs.
- **HOLD:** Keine offenen HOLDs.
- **ASK:** Bei neuen Features oder groesseren Aenderungen.
- **CONFIRM:** Bei Aenderungen am Design System.

## Tests & Reports

**Gruen bedeutet:**
- Alle 5 Playwright-Testsuites bestanden
- Core-Funktionalitaet, Edge Cases, Visual Rendering abgedeckt

**Testausfuehrung:**
```bash
# Server starten (Port 8000)
python -m http.server 8000

# Tests ausfuehren
pytest test_*.py
```

## Strukturkonventionen

- `index.html`, `script.js`, `styles.css` - Hauptanwendung (Root-Level, da standalone Tool)
- `00_infos/` - Dokumentation und Kontext
- `test_*.py` - Playwright-Tests
- `venv/` - Python Virtual Environment fuer Tests
- Keine `85_code/`, `87_tests/` Struktur - zu klein fuer volle Ordnerstruktur
