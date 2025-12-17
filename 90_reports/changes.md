# Changes Report

> Datum: 2025-12-13
> Version: 1.0.0 -> 1.1.0

## Aenderungen

### Prioritaet 1: Accessibility Fixes

| Aenderung | Dateien | Tests |
|-----------|---------|-------|
| Semantische Tabs mit ARIA | index.html, script.js | 6 neue Tests |
| Focus-visible Styles | styles.css | - |
| Verbesserter Farbkontrast | styles.css | - |
| Inline-Fehlermeldungen statt alert() | index.html, script.js, styles.css | 2 aktualisierte Tests |

### Prioritaet 2: UX Verbesserungen

| Aenderung | Dateien | Tests |
|-----------|---------|-------|
| Passwort-Toggle WLAN | index.html, script.js, styles.css | 4 neue Tests |
| Logo-Entfernung | index.html, script.js, styles.css | - |
| Loading/Success State | index.html, script.js, styles.css | 1 aktualisierter Test |

### Prioritaet 3: Features

| Aenderung | Dateien | Tests |
|-----------|---------|-------|
| Reset Button | index.html, script.js, styles.css | 4 neue Tests |

## Betroffene Dateien

- `/index.html` - Tab ARIA, Error Container, Passwort-Toggle, Reset Button, Loading State
- `/script.js` - Keyboard Navigation, Error Handling, Toggle Logic, Reset Logic
- `/styles.css` - Focus-visible, Error Styles, Toggle Styles, Reset Button Styles
- `/87_tests/e2e/test_qr_code_ui.py` - 14 neue Tests, 3 aktualisierte Tests

## Tests

- Vorher: 33 Tests
- Nachher: 47 Tests (+14)
- Status: Alle gruen

## Risiken/HOLDs

Keine.
