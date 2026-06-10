"""Pytest configuration for QR Code Maker UI tests."""

import pytest
from pathlib import Path

PRIMARY_TYPES = ("link", "wifi", "text")


@pytest.fixture(scope="session")
def base_url():
    """Return the base URL for the QR Code Maker app."""
    project_root = Path(__file__).parent.parent
    index_path = project_root / "index.html"
    return f"file://{index_path.absolute()}"


@pytest.fixture(scope="function")
def qr_page(page, base_url):
    """Navigate to the QR Code Maker page before each test."""
    page.goto(base_url)
    page.wait_for_load_state("domcontentloaded")
    return page


@pytest.fixture(scope="function")
def select_type(qr_page):
    """Select a content type: primary types via chip, secondary via 'Mehr' menu."""

    def _select(tab):
        if tab in PRIMARY_TYPES:
            qr_page.locator(f'.tab[data-tab="{tab}"]').click()
        else:
            qr_page.locator("#moreTypesBtn").click()
            qr_page.locator(f'.tab[data-tab="{tab}"]').click()

    return _select
