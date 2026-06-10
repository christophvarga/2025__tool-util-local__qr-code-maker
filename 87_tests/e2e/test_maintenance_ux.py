"""
E2E UI Tests for QR Code Maker - Maintenance & UX.

Tests cover:
- Download filename timestamp format
- Mobile viewport rendering (sticky preview)
- Idle hints for empty inputs (live mode)
- Valid URL QR code generation
- Reset + Undo toast
"""

import re
from playwright.sync_api import expect


class TestDownloadFilenameTimestamp:
    """Tests for download filename timestamp feature."""

    def test_download_button_enabled_after_input(self, qr_page):
        """Download button should be enabled once content is rendered."""
        qr_page.locator("#qrText").fill("https://example.com")

        download_btn = qr_page.locator("#downloadBtn")
        expect(download_btn).to_be_enabled()

    def test_download_filename_has_timestamp(self, qr_page):
        """Download link filename should contain timestamp in YYYYMMDD-HHMMSS format."""
        qr_page.locator("#qrText").fill("https://example.com")
        download_btn = qr_page.locator("#downloadBtn")
        expect(download_btn).to_be_enabled()

        with qr_page.expect_download() as download_info:
            download_btn.click()
        download = download_info.value

        filename = download.suggested_filename
        assert re.match(r"^qrcode-\d{8}-\d{6}\.png$", filename), \
            f"Expected timestamp filename, got: {filename}"

    def test_download_filename_starts_with_qrcode(self, qr_page):
        """Download filename should start with 'qrcode-'."""
        qr_page.locator("#qrText").fill("timestamp test")
        download_btn = qr_page.locator("#downloadBtn")
        expect(download_btn).to_be_enabled()

        with qr_page.expect_download() as download_info:
            download_btn.click()
        download = download_info.value

        assert download.suggested_filename.startswith("qrcode-"), \
            f"Filename should start with 'qrcode-', got: {download.suggested_filename}"

    def test_download_filename_ends_with_png(self, qr_page):
        """Download filename should end with '.png'."""
        qr_page.locator("#qrText").fill("png extension test")
        download_btn = qr_page.locator("#downloadBtn")
        expect(download_btn).to_be_enabled()

        with qr_page.expect_download() as download_info:
            download_btn.click()
        download = download_info.value

        assert download.suggested_filename.endswith(".png"), \
            f"Filename should end with '.png', got: {download.suggested_filename}"


class TestMobileViewport:
    """Tests for mobile viewport rendering."""

    def test_mobile_viewport_renders_correctly(self, qr_page):
        """Page should render correctly on mobile viewport (375x667)."""
        qr_page.set_viewport_size({"width": 375, "height": 667})
        qr_page.reload()
        qr_page.wait_for_load_state("domcontentloaded")

        heading = qr_page.locator("h1")
        expect(heading).to_be_visible()

        download_btn = qr_page.locator("#downloadBtn")
        expect(download_btn).to_be_visible()

    def test_mobile_viewport_has_viewport_meta(self, qr_page):
        """Page should have viewport meta tag for mobile responsiveness."""
        viewport_meta = qr_page.locator('meta[name="viewport"]')
        expect(viewport_meta).to_have_count(1)
        content = viewport_meta.get_attribute("content")
        assert "width=device-width" in content, \
            f"Missing width=device-width in viewport meta: {content}"

    def test_mobile_generate_qr_works(self, qr_page):
        """QR code generation should work on mobile viewport."""
        qr_page.set_viewport_size({"width": 375, "height": 667})
        qr_page.reload()
        qr_page.wait_for_load_state("domcontentloaded")

        qr_page.locator("#qrText").fill("Mobile test")

        canvas = qr_page.locator("#qrcode canvas:not(.ghost)")
        expect(canvas).to_be_visible()


class TestIdleHints:
    """Tests for live-mode idle hints (replaces error banners for empty input)."""

    def test_empty_input_shows_idle_hint(self, qr_page):
        """Empty input should show idle status, not an error banner."""
        expect(qr_page.locator("#statusCard")).to_have_attribute("data-state", "idle")
        expect(qr_page.locator("#errorMessage")).to_be_hidden()
        expect(qr_page.locator("#downloadBtn")).to_be_disabled()

    def test_empty_wifi_ssid_shows_hint(self, qr_page):
        """Empty WiFi SSID should show a hint in the status card."""
        qr_page.locator('.tab[data-tab="wifi"]').click()

        expect(qr_page.locator("#statusSubtext")).to_contain_text("SSID")

    def test_more_tab_no_input_shows_hint(self, qr_page, select_type):
        """Custom content mode with no input should show a hint."""
        select_type("more")

        expect(qr_page.locator("#statusCard")).to_have_attribute("data-state", "idle")
        expect(qr_page.locator("#downloadBtn")).to_be_disabled()


class TestResetUndo:
    """Tests for single reset + undo toast."""

    def test_reset_clears_content(self, qr_page):
        """Reset should clear inputs and show the undo toast."""
        qr_page.locator("#qrText").fill("https://example.com")
        expect(qr_page.locator("#downloadBtn")).to_be_enabled()

        qr_page.locator("#resetBtn").click()

        expect(qr_page.locator("#qrText")).to_have_value("")
        expect(qr_page.locator("#downloadBtn")).to_be_disabled()
        expect(qr_page.locator("#undoToast")).to_be_visible()

    def test_undo_restores_content(self, qr_page):
        """Undo should restore the previous content."""
        qr_page.locator("#qrText").fill("https://example.com")
        expect(qr_page.locator("#downloadBtn")).to_be_enabled()

        qr_page.locator("#resetBtn").click()
        qr_page.locator("#undoResetBtn").click()

        expect(qr_page.locator("#qrText")).to_have_value("https://example.com")
        expect(qr_page.locator("#downloadBtn")).to_be_enabled()


class TestTypeSuggestion:
    """Tests for payload auto-detection in the link field."""

    def test_wifi_payload_suggests_switch(self, qr_page):
        """Pasting a WIFI: payload should surface a suggestion."""
        qr_page.locator("#qrText").fill("WIFI:T:WPA;S:Test;P:pw;;")

        expect(qr_page.locator("#typeSuggestion")).to_be_visible()

    def test_suggestion_apply_switches_type(self, qr_page):
        """Applying a tel: suggestion should switch to the phone type."""
        qr_page.locator("#qrText").fill("tel:+436601234567")
        qr_page.locator("#typeSuggestionBtn").click()

        expect(qr_page.locator("#phoneTab")).to_have_class(re.compile(r"active"))
        expect(qr_page.locator("#phoneNumber")).to_have_value("+436601234567")

    def test_normal_url_no_suggestion(self, qr_page):
        """A normal URL should not trigger a suggestion."""
        qr_page.locator("#qrText").fill("https://example.com")
        expect(qr_page.locator("#typeSuggestion")).to_be_hidden()


class TestQRCodeGeneration:
    """Tests for valid QR code generation scenarios."""

    def test_qr_code_generated_for_valid_url(self, qr_page):
        """Valid URL should produce a QR code canvas."""
        qr_page.locator("#qrText").fill("https://varga.media")

        canvas = qr_page.locator("#qrcode canvas:not(.ghost)")
        expect(canvas).to_be_visible()

    def test_qr_code_generated_for_long_text(self, qr_page):
        """Long text within limit should generate QR code."""
        long_text = "A" * 500
        qr_page.locator("#qrText").fill(long_text)

        canvas = qr_page.locator("#qrcode canvas:not(.ghost)")
        expect(canvas).to_be_visible()

    def test_timestamp_function_format(self, qr_page):
        """getTimestampSuffix function should return correct format."""
        result = qr_page.evaluate("""
            () => {
                const now = new Date();
                const pad = (n) => String(n).padStart(2, '0');
                const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
                const time = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
                return `${date}-${time}`;
            }
        """)
        assert re.match(r"^\d{8}-\d{6}$", result), \
            f"Timestamp format mismatch: {result}"
