# UX/UI-Konzept: QR Code Maker — SOTA-Redesign

> Version: 1.0.0
> Datum: 10.06.2026
> Status: KONZEPT (nicht implementiert)
> Bezug: index.html / script.js / styles.css v1.4.0

---

## 1. Ist-Analyse — warum das aktuelle UI nicht SOTA ist

Die App ist feature-complete, aber die Optionen sind **flach statt gestaffelt**:

| # | Problem | Beleg im Code |
|---|---------|---------------|
| 1 | **9 gleichwertige Tabs** für Inhaltstypen, obwohl die Nutzung extrem schief verteilt ist (URL ≫ WLAN ≫ Rest) | `content-tabs` mit 9 Buttons |
| 2 | **Generieren-Button als Zwischenschritt** — SOTA-Tools rendern live | `#generateBtn` |
| 3 | **Falsche Staffelung:** Experten-Optionen (ECC, Rand, Modul-Füllung) stehen gleichrangig neben Basis-Optionen (Farbe, Stil); Verlauf-Settings sind von der Farbe getrennt; Pixelgröße (Export-Concern) steht unter „Design" | `settings-table` + Accordion „Optionen" |
| 4 | **Doppelte Bedienelemente:** Select + Choice-Buttons für denselben Wert; 3 Reset-Buttons (`resetBtn`, `previewResetBtn`, `quickResetBtn`) | `native-value` + `choice-group` |
| 5 | **Kryptische Abkürzungen statt Vorschau:** „SQ / RD / DT / SF" — der Nutzer muss raten, wie der Stil aussieht | `choice-btn` Labels |
| 6 | **Kein Scanbarkeits-Feedback:** zu wenig Kontrast, zu großes Logo oder zu lange Payload werden nicht gewarnt | — |
| 7 | **Download-Button versteckt** bis generiert wurde; Status-Karte erklärt das textlich statt es einfach möglich zu machen | `#downloadBtn hidden` |

---

## 2. Leitprinzipien

1. **Der 10-Sekunden-Pfad.** Der häufigste Use-Case (URL → PNG) braucht exakt **2 Interaktionen und 0 Entscheidungen**: einfügen → Download. Alles andere ist optional.
2. **Live statt Generieren.** Jede Änderung rendert die Vorschau sofort (debounced ~150 ms). Der Generieren-Button entfällt ersatzlos.
3. **3 Ebenen Progressive Disclosure.** Alle Optionen bleiben erhalten, aber gestaffelt:
   - **Ebene 1 (immer sichtbar):** Inhalt, Stil-Presets, Download
   - **Ebene 2 (ein Klick entfernt):** Farben, Branding/Logo
   - **Ebene 3 („Erweitert", collapsed):** ECC, Rand, Modul-Füllung, Augen-/Modulform einzeln, Verlaufstyp
4. **Zeigen statt benennen.** Stil-Optionen sind **echte Mini-QR-Renderings** (von der eigenen Engine erzeugt), keine Abkürzungs-Buttons und keine Dropdowns.
5. **Smart Defaults + Guardrails.** ECC steht auf „Auto" (M, springt auf H sobald Logo aktiv); Kontrast- und Logo-Größen-Warnungen statt stillem Scheitern.
6. **Eine Aktion = ein Ort.** Ein Reset (Header), ein Download-Bereich (Preview-Panel), keine Doppel-Controls.

---

## 3. Informationsarchitektur (Soll)

```
┌──────────────────────────────────────┬──────────────────────────┐
│ LINKE SPALTE — Eingabe & Gestaltung │ RECHTE SPALTE — Ergebnis │
│                                      │ (sticky)                 │
│ ① INHALT                             │                          │
│   [🔗 Link] [📶 WLAN] [📝 Text] [⋯ Mehr ▾]                      │
│   ─ Eingabefelder des aktiven Typs   │   ┌──────────────┐       │
│                                      │   │   QR LIVE    │       │
│ ② STIL — 6 Preset-Kacheln            │   │   PREVIEW    │       │
│   [Mini-QR][Mini-QR][Mini-QR]        │   └──────────────┘       │
│   [Mini-QR][Mini-QR][Eigene…]        │   ● Scan-Check: Gut      │
│                                      │                          │
│ ③ FARBE (kompakt, sichtbar)          │   Größe  [512 ▾]         │
│   Swatch-Paare + Custom              │   Format [PNG|SVG|PDF|EPS]│
│   Modus: Einfarbig|Verlauf|Transp.   │   [⬇ Herunterladen]      │
│                                      │   [Teilen] [Historie]    │
│ ④ ▸ BRANDING (collapsed)             │                          │
│   Logo-Upload, Badge                 │                          │
│                                      │                          │
│ ⑤ ▸ ERWEITERT (collapsed)            │                          │
│   Modulform, Augenform, ECC,         │                          │
│   Rand, Modul-Füllung, Verlaufstyp   │                          │
└──────────────────────────────────────┴──────────────────────────┘
```

### ① Inhalt — Typ-Auswahl entlasten

- **3 primäre Chips + „Mehr"-Menü** statt 9 Tabs: `Link`, `WLAN`, `Text` sichtbar; `E-Mail`, `Telefon`, `SMS`, `vCard`, `PayPal`, `Eigener Inhalt` im Dropdown.
- Wählt man einen Sekundärtyp, **ersetzt er das „Mehr"-Chip-Label** (z. B. `[Link] [WLAN] [Text] [✉ E-Mail ▾]`) — der aktive Typ ist immer sichtbar, ohne dass 9 Chips Platz fressen.
- **Auto-Erkennung beim Einfügen:** `WIFI:` / `mailto:` / `tel:` / `BEGIN:VCARD` im Link-Feld → unaufdringlicher Vorschlag „Als WLAN-Code übernehmen?".

### ② Stil — Presets statt Einzelregler

- **6 kuratierte Presets** als Kacheln mit echtem Mini-QR-Rendering (~64 px), je eine feste Kombination aus Modulform + Augenform + Farbschema:
  `Klassik` (schwarz, eckig) · `Soft` (abgerundet) · `Dots` · `Orchid` (Verlauf, Theme-Farben) · `Mono` (einfarbig akzent) · `Eigene…`
- `Eigene…` öffnet/scrollt zu **Erweitert** — dort liegen Modulform und Augenform weiterhin als Einzeloptionen (nichts geht verloren).
- Ändert der Nutzer unter Erweitert etwas, springt die Preset-Auswahl auf `Eigene` (kein stiller Widerspruch zwischen Preset und Realität).

### ③ Farbe — ein Block statt drei Orte

Heute verteilt auf: Farb-Row (Design), `useGradient` + `gradientType` + `transparentBackground` (Accordion „Optionen"). Neu **ein Block**:

- **Modus-Segment:** `Einfarbig | Verlauf | Transparent` — der Modus steuert, welche Picker sichtbar sind (Verlauf zeigt 2. Farbe + Linear/Radial; Transparent blendet Hintergrund-Picker aus).
- **6 kuratierte Farb-Paare als Swatches** (inkl. klassisch Schwarz/Weiß) + Custom-Picker. Klick = sofort angewandt.

### ④ Branding (collapsed, Zustand sichtbar)

- Logo-Upload (Drag & Drop auf die Kachel **und** auf die Preview), Logo-Größe, Badge-Toggle + Text.
- Summary-Zeile zeigt den Zustand auch zugeklappt: `Branding — Logo aktiv · Badge „LINK"`.
- Logo aktiv ⇒ ECC-Auto schaltet auf H, Hinweis erscheint inline („Fehlerkorrektur automatisch erhöht").

### ⑤ Erweitert (collapsed — der einzige „Experten"-Ort)

Alles, was 95 % der Nutzer nie anfassen, gesammelt an genau einer Stelle:

| Option | Default | Anmerkung |
|--------|---------|-----------|
| Modulform | aus Preset | square/rounded/dots/classy |
| Augenform | aus Preset | square/rounded/circle |
| Fehlerkorrektur | **Auto** (M / H bei Logo) | L/M/Q/H weiter manuell wählbar |
| Rand (Quiet Zone) | Standard | Kompakt/Standard/Groß |
| Modul-Füllung | 92 % | Slider wie bisher |
| Verlaufstyp | Linear | nur bei Modus „Verlauf" relevant |

### Rechte Spalte — Ergebnis & Export

- **Preview sticky**, größtes Element der Seite — sie IST das Produkt.
- **Scan-Check (Ampel)** direkt unter der Preview, ersetzt die heutige Status-Karte:
  - 🟢 „Gut scanbar"
  - 🟡 konkrete Warnung: „Kontrast zu gering — Vordergrund dunkler wählen" / „Logo verdeckt 28 % — kleiner stellen oder ECC H" / „Sehr viele Daten — QR wird feinteilig"
- **Export-Block:** Größe (Dropdown `512 / 1024 / 2048 px` + frei; gilt nur für PNG/PDF — bei SVG/EPS ausgeblendet, da vektoriell), Format-Segment, **ein immer sichtbarer Download-Button** (disabled nur bei leerem/invalidem Inhalt), Teilen + Historie als Sekundäraktionen.
- Export-Historie bleibt als Drawer, Trigger wandert vom Header in den Export-Block.

---

## 4. Visuelles Konzept

**Behalten:** Orchid-Theme, dunkler Verlauf-Hintergrund, Outfit, Akzent `#6c5ce7`, Glas-Panels — die Identität stimmt.

**Vereinfachen:**

1. **Eine Surface-Ebene weniger.** Heute: Panel → Card → Settings-Table → Row (3–4 verschachtelte Rahmen). Neu: Panel + flache Sektionen, getrennt nur durch Abstand und eine `h2`-Zeile — Ruhe statt Kästchen-in-Kästchen.
2. **Sektionstitel als einzige Strukturgeber:** kleine Caps-Labels (`INHALT`, `STIL`, `FARBE` …), kein Border um jede Gruppe.
3. **Icons statt Text-Glyphen:** die Pseudo-Glyphen („URL", „Wi", „PP", „OK", „Undo") durch ein konsistentes Inline-SVG-Set ersetzen (~12 Icons, kein neues Dependency — CSP bleibt unverändert).
4. **Preview dominiert:** rechte Spalte visuell ruhig, QR auf weißer Karte mit echtem Quiet-Zone-Rand (zeigt, wie der Export aussieht).
5. **Ein Akzent reicht:** Primärbutton (Download) ist das einzige gefüllte Akzent-Element; alles andere ghost/outline.

---

## 5. Interaktionsdetails

- **Live-Render:** Input-Events debounced 150 ms; Slider rendern auf `input`, nicht erst `change`.
- **Leerer Zustand:** Preview zeigt einen dezenten Beispiel-QR (Platzhalter-URL) in 30 % Opazität — nie ein leeres Loch; Download bleibt disabled bis echter Inhalt da ist.
- **Ein Reset** im Header („Zurücksetzen"), mit kurzem Undo-Toast („Rückgängig", 5 s) statt Confirm-Dialog.
- **Persistenz:** Stil/Farbe/Erweitert in `localStorage` (Inhalt aus Datenschutzgründen NICHT) — Wiederkehrer landen direkt in ihrem Look.
- **Tastatur:** `Cmd/Ctrl+S` = Download im aktiven Format; Chips/Segmente mit Pfeiltasten (bestehendes Tab-ARIA-Pattern übernehmen).
- **Mobile (< 900 px):** Preview als kompakte sticky Top-Bar (QR ~96 px + Scan-Ampel + Download-Button), Optionen darunter in gleicher Reihenfolge. Kein Layout-Fork, nur CSS.

---

## 6. Was bewusst NICHT passiert

- Kein Framework, kein Build-Step — bleibt Vanilla JS / statisch (repo-contract).
- Keine neuen Dependencies (Icons als Inline-SVG, Mini-QRs aus vorhandener Engine).
- Keine Option wird entfernt — nur neu gestaffelt.
- Kein Theme-Wechsel — Orchid bleibt.

---

## 7. Umsetzungsphasen

| Phase | Inhalt | Größe |
|-------|--------|-------|
| **P1 — Struktur** | Live-Render statt Generieren-Button; Typ-Chips (3 + Mehr); Umgruppierung in die 5 Sektionen; Farb-Block konsolidieren; ein Reset; Download immer sichtbar | MEDIUM |
| **P2 — Visualisierung** | Stil-Presets mit Mini-QR-Renderings; Farb-Swatch-Paare; Scan-Check (Kontrast nach WCAG-Luminanz, Logo-Coverage, Payload-Länge); Icon-Set | MEDIUM |
| **P3 — Polish** | Auto-Typ-Erkennung beim Einfügen; localStorage-Persistenz; Undo-Toast; Tastatur-Shortcuts; Mobile-Sticky-Preview | SMALL–MEDIUM |

Jede Phase ist einzeln shippable; Playwright-Tests (87_tests/) pro Phase anpassen.
