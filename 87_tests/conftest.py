"""Pytest configuration for QR Code Maker UI tests."""

import os
import pytest
from pathlib import Path


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
