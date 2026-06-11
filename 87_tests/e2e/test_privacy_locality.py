"""Privacy-/Lokalitaets-Guards: sichert den Claim "100% lokal im Browser" ab.

Erlaubter externer Host ist ausschliesslich analytics.varga.media (Umami,
selbst gehostet). Fonts und QR-Library sind self-hosted; script.js darf
keinerlei Netzwerkoperationen enthalten.
"""

import re
from pathlib import Path

import pytest

PROJECT_ROOT = Path(__file__).parent.parent.parent
ALLOWED_EXTERNAL = {"analytics.varga.media", "varga.media", "qr.varga.media", "schema.org"}


@pytest.fixture(scope="module")
def index_html():
    return (PROJECT_ROOT / "index.html").read_text(encoding="utf-8")


def test_no_third_party_resource_hosts(index_html):
    hosts = set(re.findall(r"https://([a-z0-9.-]+)", index_html))
    # Platzhalter in Input-Beispielen zaehlen nicht als geladene Ressourcen
    hosts -= {"example.com", "portfolio-twin.com"}
    assert hosts <= ALLOWED_EXTERNAL, f"Unerwartete externe Hosts: {hosts - ALLOWED_EXTERNAL}"


def test_fonts_self_hosted(index_html):
    assert "fonts.googleapis.com" not in index_html
    assert "fonts.gstatic.com" not in index_html
    assert 'href="fonts/fonts.css"' in index_html
    css = (PROJECT_ROOT / "fonts" / "fonts.css").read_text(encoding="utf-8")
    assert "https://" not in css, "fonts.css darf keine Remote-URLs enthalten"
    woff2 = list((PROJECT_ROOT / "fonts").glob("*.woff2"))
    assert len(woff2) >= 4
    referenced = set(re.findall(r"url\(([^)]+\.woff2)\)", css))
    assert referenced == {f.name for f in woff2}, "fonts.css und woff2-Dateien inkonsistent"


def test_qr_library_vendored(index_html):
    assert "cdn.jsdelivr.net" not in index_html
    assert '<script src="vendor/qrcode.min.js"></script>' in index_html
    lib = PROJECT_ROOT / "vendor" / "qrcode.min.js"
    assert lib.is_file() and lib.stat().st_size > 10_000


def test_script_js_makes_no_network_calls():
    js = (PROJECT_ROOT / "script.js").read_text(encoding="utf-8")
    for pattern in ("fetch(", "XMLHttpRequest", "sendBeacon", "new WebSocket", "EventSource"):
        assert pattern not in js, f"script.js enthaelt Netzwerk-API: {pattern}"


def test_csp_restricts_to_self_plus_analytics(index_html):
    match = re.search(r'Content-Security-Policy"\s+content="([^"]+)"', index_html)
    assert match, "CSP meta tag fehlt"
    csp = match.group(1)
    assert "default-src 'none'" in csp
    assert "font-src 'self'" in csp
    assert "connect-src https://analytics.varga.media" in csp
    assert "cdn.jsdelivr.net" not in csp and "googleapis" not in csp
    nginx = (PROJECT_ROOT / "nginx.conf").read_text(encoding="utf-8")
    assert "cdn.jsdelivr.net" not in nginx and "googleapis" not in nginx


def test_legal_footer_links(index_html):
    assert 'href="https://varga.media/impressum"' in index_html
    assert 'href="https://varga.media/datenschutz"' in index_html
    assert "Christoph Varga e.U." in index_html


def test_dockerfile_ships_fonts_and_vendor():
    dockerfile = (PROJECT_ROOT / "Dockerfile").read_text(encoding="utf-8")
    assert "COPY fonts/ /usr/share/nginx/html/fonts/" in dockerfile
    assert "COPY vendor/ /usr/share/nginx/html/vendor/" in dockerfile
