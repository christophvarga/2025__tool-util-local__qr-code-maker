"""SEO- und Agent-Discoverability-Regressionstests.

Statische Checks gegen die ausgelieferten Dateien — kein Browser noetig.
Sichern ab, dass Meta-Tags, JSON-LD und die Discovery-Dateien
(robots.txt, sitemap.xml, llms.txt, favicon.svg) vorhanden bleiben
und vom Docker-Image ausgeliefert werden.
"""

import json
import re
from pathlib import Path

import pytest

PROJECT_ROOT = Path(__file__).parent.parent.parent
CANONICAL_URL = "https://qr.varga.media/"


@pytest.fixture(scope="module")
def index_html():
    return (PROJECT_ROOT / "index.html").read_text(encoding="utf-8")


def test_meta_description(index_html):
    assert 'name="description"' in index_html
    match = re.search(r'name="description"\s+content="([^"]+)"', index_html)
    assert match, "meta description ohne content"
    assert 50 <= len(match.group(1)) <= 170, "Description-Laenge ausserhalb SERP-Range"


def test_canonical_url(index_html):
    assert f'rel="canonical" href="{CANONICAL_URL}"' in index_html


def test_open_graph_tags(index_html):
    for prop in ("og:type", "og:url", "og:title", "og:description", "og:site_name"):
        assert f'property="{prop}"' in index_html, f"Open-Graph-Tag {prop} fehlt"


def test_twitter_card(index_html):
    assert 'name="twitter:card"' in index_html


def test_json_ld_webapplication(index_html):
    match = re.search(
        r'<script type="application/ld\+json">\s*(\{.*?\})\s*</script>',
        index_html,
        re.DOTALL,
    )
    assert match, "JSON-LD Block fehlt"
    data = json.loads(match.group(1))
    assert data["@type"] == "WebApplication"
    assert data["url"] == CANONICAL_URL
    assert data["featureList"], "featureList leer"


def test_favicon_linked_and_present(index_html):
    assert 'href="favicon.svg"' in index_html
    assert (PROJECT_ROOT / "favicon.svg").is_file()


def test_robots_txt():
    robots = (PROJECT_ROOT / "robots.txt").read_text(encoding="utf-8")
    assert "User-agent: *" in robots
    assert "Sitemap: https://qr.varga.media/sitemap.xml" in robots
    assert "Disallow" not in robots, "robots.txt darf nichts blocken"


def test_sitemap_xml():
    sitemap = (PROJECT_ROOT / "sitemap.xml").read_text(encoding="utf-8")
    assert f"<loc>{CANONICAL_URL}</loc>" in sitemap


def test_llms_txt():
    llms = (PROJECT_ROOT / "llms.txt").read_text(encoding="utf-8")
    assert llms.startswith("# "), "llms.txt muss mit H1 beginnen (llmstxt.org)"
    assert "client-seitig" in llms


def test_dockerfile_ships_discovery_files():
    dockerfile = (PROJECT_ROOT / "Dockerfile").read_text(encoding="utf-8")
    for fname in ("favicon.svg", "robots.txt", "sitemap.xml", "llms.txt"):
        assert f"COPY {fname}" in dockerfile, f"Dockerfile kopiert {fname} nicht"
