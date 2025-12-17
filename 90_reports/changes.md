# Changes Report

> Datum: 2025-12-17
> Version: 1.1.0 -> 1.2.0

## Aenderungen

### Deployment auf Edge-Stack

| Aenderung | Dateien | Status |
|-----------|---------|--------|
| Docker-Containerisierung (nginx:alpine) | Dockerfile, docker-compose.yml | Fertig |
| Traefik-Routing | docker-compose.yml | Fertig |
| GitHub Actions CI/CD | .github/workflows/deploy.yml | Fertig |
| Cloudflare Tunnel DNS | cloudflared-config.yml (infra) | Fertig |

**Live:** https://qr.varga.media

### Neue Features

| Aenderung | Dateien | Tests |
|-----------|---------|-------|
| SVG Download Option | index.html, script.js | - |

## Betroffene Dateien

- `/index.html` - SVG Download Button hinzugefuegt
- `/script.js` - getQRText() Helper, downloadSvgBtn Handler
- `/Dockerfile` - NEU: nginx:alpine Container
- `/docker-compose.yml` - NEU: Traefik-Labels, web-Netzwerk
- `/deploy.sh` - NEU: Build & Deploy Script
- `/.github/workflows/deploy.yml` - NEU: Edge Deployment Workflow

## Deployment-Konfiguration

- **App-Name:** qr
- **Hostname:** qr.varga.media
- **Auth:** Public (keine Authentifizierung)
- **Container:** nginx:alpine, Port 80
- **Registry:** apps-registry.json (0000__infra-multi__ci-cd)

## Risiken/HOLDs

Keine.

---

## Vorherige Version (1.0.0 -> 1.1.0)

> Datum: 2025-12-13

### Accessibility Fixes
- Semantische Tabs mit ARIA
- Focus-visible Styles
- Verbesserter Farbkontrast
- Inline-Fehlermeldungen statt alert()

### UX Verbesserungen
- Passwort-Toggle WLAN
- Logo-Entfernung
- Loading/Success State
- Reset Button
