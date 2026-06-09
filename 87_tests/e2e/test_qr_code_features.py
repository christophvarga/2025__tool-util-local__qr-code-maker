"""
E2E UI Tests for QR Code Maker Application - Features.

Tests cover:
- WLAN QR code generation
- Design options (colors, gradient)
- Advanced settings (ECC level, output size)
- QR code regeneration scenarios
"""

import re
import pytest
from playwright.sync_api import expect


class TestWLANQRCode:
    """Tests for WLAN QR code generation."""

    def test_wifi_form_elements_present(self, qr_page):
        """WLAN form should have all necessary elements."""
        wifi_tab = qr_page.locator('.tab[data-tab="wifi"]')
        wifi_tab.click()

        expect(qr_page.locator("#wifiSsid")).to_be_visible()
        expect(qr_page.locator("#wifiPassword")).to_be_visible()
        expect(qr_page.locator("#wifiSecurity")).to_be_visible()

    def test_generate_wifi_qr_code(self, qr_page):
        """Should generate QR code for WLAN credentials."""
        wifi_tab = qr_page.locator('.tab[data-tab="wifi"]')
        wifi_tab.click()

        qr_page.locator("#wifiSsid").fill("TestNetwork")
        qr_page.locator("#wifiPassword").fill("TestPassword123")

        generate_btn = qr_page.locator("#generateBtn")
        generate_btn.click()

        canvas = qr_page.locator("#qrcode canvas")
        expect(canvas).to_be_visible()

    def test_empty_ssid_shows_inline_error(self, qr_page):
        """Empty SSID should show inline error message."""
        wifi_tab = qr_page.locator('.tab[data-tab="wifi"]')
        wifi_tab.click()

        generate_btn = qr_page.locator("#generateBtn")
        generate_btn.click()

        error = qr_page.locator("#errorMessage")
        expect(error).to_be_visible()
        expect(error).to_contain_text("SSID")

    def test_wifi_security_options(self, qr_page):
        """Security dropdown should have all options."""
        wifi_tab = qr_page.locator('.tab[data-tab="wifi"]')
        wifi_tab.click()

        security = qr_page.locator("#wifiSecurity")
        options = security.locator("option")
        expect(options).to_have_count(3)

    def test_wifi_without_password(self, qr_page):
        """Should generate QR code for open network (no password)."""
        wifi_tab = qr_page.locator('.tab[data-tab="wifi"]')
        wifi_tab.click()

        qr_page.locator("#wifiSsid").fill("OpenNetwork")
        qr_page.locator("#wifiSecurity").select_option("nopass")

        generate_btn = qr_page.locator("#generateBtn")
        generate_btn.click()

        canvas = qr_page.locator("#qrcode canvas")
        expect(canvas).to_be_visible()

    def test_wifi_special_chars_in_ssid(self, qr_page):
        """WiFi SSID with special characters should not break generation."""
        wifi_tab = qr_page.locator('.tab[data-tab="wifi"]')
        wifi_tab.click()

        qr_page.locator("#wifiSsid").fill("My;Net:work\\Test")
        qr_page.locator("#wifiPassword").fill("pass;word:123\\end")

        generate_btn = qr_page.locator("#generateBtn")
        generate_btn.click()

        canvas = qr_page.locator("#qrcode canvas")
        expect(canvas).to_be_visible()


class TestDesignOptions:
    """Tests for design customization options."""

    def test_color_pickers_present(self, qr_page):
        """Color pickers should be present in design tab."""
        design_tab = qr_page.locator('.tab[data-tab="design"]')
        design_tab.click()

        expect(qr_page.locator("#fgColor")).to_be_visible()
        expect(qr_page.locator("#bgColor")).to_be_visible()

    def test_gradient_checkbox(self, qr_page):
        """Gradient checkbox should toggle gradient color picker."""
        design_tab = qr_page.locator('.tab[data-tab="design"]')
        design_tab.click()

        gradient_checkbox = qr_page.locator("#useGradient")
        gradient_color = qr_page.locator("#gradientColor")

        expect(gradient_color).to_be_disabled()

        gradient_checkbox.check()
        expect(gradient_color).to_be_enabled()

        gradient_checkbox.uncheck()
        expect(gradient_color).to_be_disabled()

    def test_logo_size_slider(self, qr_page):
        """Logo size slider should update displayed value."""
        design_tab = qr_page.locator('.tab[data-tab="design"]')
        design_tab.click()

        slider = qr_page.locator("#logoSize")
        value_display = qr_page.locator("#logoSizeVal")

        expect(value_display).to_have_text("20%")

        slider.fill("30")
        slider.dispatch_event("input")
        expect(value_display).to_have_text("30%")

    def test_custom_colors_applied(self, qr_page):
        """Custom colors should be applied to generated QR code."""
        textarea = qr_page.locator("#qrText")
        textarea.fill("Color test")

        design_tab = qr_page.locator('.tab[data-tab="design"]')
        design_tab.click()

        fg_color = qr_page.locator("#fgColor")
        fg_color.fill("#ff0000")

        text_tab = qr_page.locator('.tab[data-tab="text"]')
        text_tab.click()

        generate_btn = qr_page.locator("#generateBtn")
        generate_btn.click()

        canvas = qr_page.locator("#qrcode canvas")
        expect(canvas).to_be_visible()

    def test_style_controls_present(self, qr_page):
        """Extended QR style controls should be available in design tab."""
        design_tab = qr_page.locator('.tab[data-tab="design"]')
        design_tab.click()

        expect(qr_page.locator("#qrStyle")).to_be_visible()
        expect(qr_page.locator("#finderStyle")).to_be_visible()
        expect(qr_page.locator("#useBadge")).to_be_visible()

    def test_dot_style_generation(self, qr_page):
        """Dot module and circle finder styles should still generate a QR canvas."""
        qr_page.locator("#qrText").fill("Styled QR")
        qr_page.locator('.tab[data-tab="design"]').click()

        qr_page.locator("#qrStyle").select_option("dots")
        qr_page.locator("#finderStyle").select_option("circle")
        qr_page.locator("#generateBtn").click()

        canvas = qr_page.locator("#qrcode canvas")
        expect(canvas).to_be_visible()

    def test_orchid_theme_is_fixed(self, qr_page):
        """UI theme should stay fixed to Orchid."""
        qr_page.locator('.tab[data-tab="design"]').click()

        expect(qr_page.locator("#appTheme")).to_have_count(0)
        expect(qr_page.locator("body")).to_have_attribute("data-theme", "orchid")


class TestDownloadFormats:
    """Tests for additional export formats."""

    def test_svg_download_filename(self, qr_page):
        """SVG export should download an SVG file."""
        qr_page.locator("#qrText").fill("SVG export")
        qr_page.locator("#generateBtn").click()
        qr_page.locator('.format-btn[data-format="svg"]').click()

        with qr_page.expect_download() as download_info:
            qr_page.locator("#downloadBtn").click()
        download = download_info.value

        assert re.match(r"^qrcode-\d{8}-\d{6}\.svg$", download.suggested_filename), \
            f"Expected SVG timestamp filename, got: {download.suggested_filename}"


class TestAdvancedSettings:
    """Tests for advanced settings (ECC level, output size)."""

    def test_ecc_level_options(self, qr_page):
        """ECC level dropdown should have all options."""
        ecc_select = qr_page.locator("#eccLevel")
        options = ecc_select.locator("option")
        expect(options).to_have_count(4)

    def test_ecc_default_value(self, qr_page):
        """Default ECC level should be H (Sehr Hoch)."""
        ecc_select = qr_page.locator("#eccLevel")
        expect(ecc_select).to_have_value("H")

    def test_pixel_size_options(self, qr_page):
        """Pixel size dropdown should have all options."""
        size_select = qr_page.locator("#pixelSize")
        options = size_select.locator("option")
        expect(options).to_have_count(4)

    def test_pixel_size_default_value(self, qr_page):
        """Default pixel size should be 400."""
        size_select = qr_page.locator("#pixelSize")
        expect(size_select).to_have_value("400")

    def test_change_ecc_level(self, qr_page):
        """Should be able to change ECC level."""
        ecc_select = qr_page.locator("#eccLevel")
        ecc_select.select_option("L")
        expect(ecc_select).to_have_value("L")

    def test_change_output_size(self, qr_page):
        """Should be able to change output size."""
        size_select = qr_page.locator("#pixelSize")
        size_select.select_option("800")
        expect(size_select).to_have_value("800")


class TestQRCodeRegeneration:
    """Tests for QR code regeneration scenarios."""

    def test_regenerate_with_different_text(self, qr_page):
        """Regenerating with different text should update QR code."""
        textarea = qr_page.locator("#qrText")
        generate_btn = qr_page.locator("#generateBtn")

        textarea.fill("First text")
        generate_btn.click()

        first_canvas = qr_page.locator("#qrcode canvas")
        expect(first_canvas).to_be_visible()

        textarea.fill("Second different text")
        generate_btn.click()

        second_canvas = qr_page.locator("#qrcode canvas")
        expect(second_canvas).to_be_visible()

    def test_switch_from_text_to_wifi(self, qr_page):
        """Should be able to generate text QR then wifi QR."""
        textarea = qr_page.locator("#qrText")
        textarea.fill("Text QR")
        qr_page.locator("#generateBtn").click()

        expect(qr_page.locator("#qrcode canvas")).to_be_visible()

        wifi_tab = qr_page.locator('.tab[data-tab="wifi"]')
        wifi_tab.click()

        qr_page.locator("#wifiSsid").fill("MyWifi")
        qr_page.locator("#wifiPassword").fill("password123")
        qr_page.locator("#generateBtn").click()

        expect(qr_page.locator("#qrcode canvas")).to_be_visible()
