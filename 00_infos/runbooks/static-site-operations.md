# Static-Site-Betrieb

## Lokal

```bash
python3 -m http.server 8765
```

Danach `/`, `robots.txt`, `sitemap.xml` und `llms.txt` lokal pruefen.

## Live

```bash
curl -sS -o /dev/null -w '%{http_code}\n' https://qr.varga.media/
```

Ein Cloudflare-Redirect ist im geschuetzten Normalbetrieb zulaessig. Bei Fehlern
zuerst Pipeline und Edge-Route read-only pruefen; Live-Aenderung oder Rollback
benoetigen eine Freigabe.
