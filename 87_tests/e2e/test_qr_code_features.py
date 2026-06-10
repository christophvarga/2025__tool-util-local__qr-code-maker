"""
E2E UI Tests for QR Code Maker Application - Features.

Tests cover:
- WLAN QR code generation (live)
- Style presets and color modes
- Branding (logo, badge) and advanced settings (ECC auto, export size)
- Download formats and regeneration scenarios
"""

import re
import pytest
from playwright.sync_api import expect


class TestWLANQRCode:
    """Tests for WLAN QR code generation."""

    def test_wifi_form_elements_present(self, qr_page):
        """WLAN form should have all necessary elements."""
        qr_page.locator('.tab[data-tab="wifi"]').click()

        expect(qr_page.locator("#wifiSsid")).to_be_visible()
        expect(qr_page.locator("#wifiPassword")).to_be_visible()
        expect(qr_page.locator("#wifiSecurity")).to_be_visible()

    def test_generate_wifi_qr_code(self, qr_page):
        """Filling WLAN credentials should render a QR code live."""
        qr_page.locator('.tab[data-tab="wifi"]').click()

        qr_page.locator("#wifiSsid").fill("TestNetwork")
        qr_page.locator("#wifiPassword").fill("TestPassword123")

        canvas = qr_page.locator("#qrcode canvas:not(.ghost)")
        expect(canvas).to_be_visible()

    def test_empty_ssid_shows_hint(self, qr_page):
        """Empty SSID should show an idle hint mentioning SSID."""
        qr_page.locator('.tab[data-tab="wifi"]').click()

        expect(qr_page.locator("#statusCard")).to_have_attribute("data-state", "idle")
        expect(qr_page.locator("#statusSubtext")).to_contain_text("SSID")
        expect(qr_page.locator("#downloadBtn")).to_be_disabled()

    def test_wifi_security_options(self, qr_page):
        """Security dropdown should have all options."""
        qr_page.locator('.tab[data-tab="wifi"]').click()

        security = qr_page.locator("#wifiSecurity")
        options = security.locator("option")
        expect(options).to_have_count(3)

    def test_wifi_without_password(self, qr_page):
        """Should generate QR code for open network (no password)."""
        qr_page.locator('.tab[data-tab="wifi"]').click()

        qr_page.locator("#wifiSsid").fill("OpenNetwork")
        qr_page.locator("#wifiSecurity").select_option("nopass")

        canvas = qr_page.locator("#qrcode canvas:not(.ghost)")
        expect(canvas).to_be_visible()

    def test_wifi_special_chars_in_ssid(self, qr_page):
        """WiFi SSID with special characters should not break generation."""
        qr_page.locator('.tab[data-tab="wifi"]').click()

        qr_page.locator("#wifiSsid").fill("My;Net:work\\Test")
        qr_page.locator("#wifiPassword").fill("pass;word:123\\end")

        canvas = qr_page.locator("#qrcode canvas:not(.ghost)")
        expect(canvas).to_be_visible()


class TestStylePresets:
    """Tests for the style preset tiles."""

    def test_preset_tiles_present(self, qr_page):
        """Six preset tiles should be rendered (5 styles + Eigene)."""
        presets = qr_page.locator(".style-preset")
        expect(presets).to_have_count(6)

    def test_orchid_preset_active_by_default(self, qr_page):
        """Orchid preset should be the default."""
        expect(qr_page.locator('.style-preset[data-style-preset="orchid"]')).to_have_class(
            re.compile(r"active"))

    def test_preset_applies_shapes(self, qr_page):
        """Clicking the Dots preset should set module and finder shape."""
        qr_page.locator('.style-preset[data-style-preset="dots"]').click()

        expect(qr_page.locator("#qrStyle")).to_have_value("dots")
        expect(qr_page.locator("#finderStyle")).to_have_value("circle")

    def test_manual_shape_change_marks_custom(self, qr_page):
        """Changing a shape under Erweitert should mark the Eigene preset."""
        qr_page.locator("#advancedDetails summary").click()
        qr_page.locator("#qrStyle").select_option("square")

        expect(qr_page.locator('.style-preset[data-style-preset="custom"]')).to_have_class(
            re.compile(r"active"))

    def test_custom_tile_opens_advanced(self, qr_page):
        """The Eigene tile should open the Erweitert accordion."""
        qr_page.locator('.style-preset[data-style-preset="custom"]').click()
        assert qr_page.locator("#advancedDetails").get_attribute("open") is not None


class TestColorModes:
    """Tests for the color mode segment."""

    def test_gradient_mode_default(self, qr_page):
        """Gradient mode should be active by default (Orchid preset)."""
        expect(qr_page.locator('.mode-btn[data-color-mode="gradient"]')).to_have_class(
            re.compile(r"active"))
        expect(qr_page.locator("#gradientField")).to_be_visible()

    def test_solid_mode_hides_gradient_picker(self, qr_page):
        """Solid mode should hide the gradient color picker."""
        qr_page.locator('.mode-btn[data-color-mode="solid"]').click()
        expect(qr_page.locator("#gradientField")).to_be_hidden()

    def test_transparent_mode_hides_background_picker(self, qr_page):
        """Transparent mode should hide the background color picker."""
        qr_page.locator('.mode-btn[data-color-mode="transparent"]').click()
        expect(qr_page.locator("#bgField")).to_be_hidden()

    def test_color_pickers_present(self, qr_page):
        """Color pickers should be visible in the Farbe section."""
        expect(qr_page.locator("#fgColor")).to_be_visible()
        expect(qr_page.locator("#bgColor")).to_be_visible()

    def test_color_swatch_pairs_present(self, qr_page):
        """Curated color pair swatches should be rendered."""
        expect(qr_page.locator(".pair-swatch")).to_have_count(6)

    def test_swatch_applies_colors(self, qr_page):
        """Clicking a swatch should apply its colors."""
        qr_page.locator('.pair-swatch[data-swatch="black"]').click()
        expect(qr_page.locator("#fgColor")).to_have_value("#111827")

    def test_custom_colors_applied(self, qr_page):
        """Custom colors should still produce a QR code."""
        qr_page.locator("#qrText").fill("Color test")
        qr_page.locator("#fgColor").evaluate(
            "el => { el.value = '#ff0000'; el.dispatchEvent(new Event('input', {bubbles: true})); }")

        canvas = qr_page.locator("#qrcode canvas:not(.ghost)")
        expect(canvas).to_be_visible()


class TestBranding:
    """Tests for the Branding accordion (logo + badge)."""

    def test_branding_collapsed_by_default(self, qr_page):
        """Logo options should be hidden until Branding is opened."""
        expect(qr_page.locator("#logoOptions")).to_be_hidden()

        qr_page.locator("#brandingDetails summary").click()
        expect(qr_page.locator("#useBadge")).to_be_visible()
        qr_page.locator("#logoEnabled").check()

        expect(qr_page.locator("#logoOptions")).to_be_visible()

    def test_logo_size_slider(self, qr_page):
        """Logo size slider should update displayed value."""
        qr_page.locator("#brandingDetails summary").click()
        qr_page.locator("#logoEnabled").check()

        slider = qr_page.locator("#logoSize")
        value_display = qr_page.locator("#logoSizeVal")

        expect(value_display).to_have_text("20%")

        slider.fill("30")
        slider.dispatch_event("input")
        expect(value_display).to_have_text("30%")

    def test_branding_summary_shows_state(self, qr_page):
        """Branding summary should reflect the badge state while collapsed."""
        expect(qr_page.locator("#brandingSummary")).to_contain_text("Badge")

    def test_orchid_theme_is_fixed(self, qr_page):
        """UI theme should stay fixed to Orchid."""
        expect(qr_page.locator("#appTheme")).to_have_count(0)
        expect(qr_page.locator("body")).to_have_attribute("data-theme", "orchid")

    @pytest.mark.parametrize(
        "tab,field,value",
        [
            ("text", "#plainText", "Plain text QR"),
            ("email", "#emailTo", "mail@example.com"),
            ("phone", "#phoneNumber", "+436600000000"),
            ("sms", "#smsPhone", "+436600000000"),
            ("vcard", "#vcardFirst", "Max"),
            ("paypal", "#paypalHandle", "vargamedia"),
            ("more", "#customPayload", "geo:48.2082,16.3738"),
        ],
    )
    def test_content_modes_generate_qr(self, qr_page, select_type, tab, field, value):
        """All content modes should generate a QR canvas live."""
        select_type(tab)
        qr_page.locator(field).fill(value)

        canvas = qr_page.locator("#qrcode canvas:not(.ghost)")
        expect(canvas).to_be_visible()


class TestDownloadFormats:
    """Tests for additional export formats."""

    def test_svg_download_filename(self, qr_page):
        """SVG export should download an SVG file."""
        qr_page.locator("#qrText").fill("SVG export")
        qr_page.locator('.format-btn[data-format="svg"]').click()

        download_btn = qr_page.locator("#downloadBtn")
        expect(download_btn).to_be_enabled()

        with qr_page.expect_download() as download_info:
            download_btn.click()
        download = download_info.value

        assert re.match(r"^qrcode-\d{8}-\d{6}\.svg$", download.suggested_filename), \
            f"Expected SVG timestamp filename, got: {download.suggested_filename}"

    def test_vector_format_disables_size(self, qr_page):
        """SVG/EPS formats should disable the pixel size selector."""
        qr_page.locator('.format-btn[data-format="svg"]').click()
        expect(qr_page.locator("#pixelSize")).to_be_disabled()

        qr_page.locator('.format-btn[data-format="png"]').click()
        expect(qr_page.locator("#pixelSize")).to_be_enabled()


class TestAdvancedSettings:
    """Tests for advanced settings (ECC level, output size)."""

    def test_ecc_level_options(self, qr_page):
        """ECC level dropdown should have Auto + 4 manual options."""
        ecc_select = qr_page.locator("#eccLevel")
        options = ecc_select.locator("option")
        expect(options).to_have_count(5)

    def test_ecc_default_is_auto(self, qr_page):
        """Default ECC level should be Auto."""
        ecc_select = qr_page.locator("#eccLevel")
        expect(ecc_select).to_have_value("auto")

    def test_change_ecc_level(self, qr_page):
        """Should be able to change ECC level."""
        qr_page.locator("#advancedDetails summary").click()
        ecc_select = qr_page.locator("#eccLevel")
        ecc_select.select_option("L")
        expect(ecc_select).to_have_value("L")

    def test_pixel_size_default_value(self, qr_page):
        """Default export size should be 512."""
        size_select = qr_page.locator("#pixelSize")
        expect(size_select).to_have_value("512")

    def test_pixel_size_options(self, qr_page):
        """Export size should offer 256-2048 px."""
        options = qr_page.locator("#pixelSize option")
        expect(options).to_have_count(4)

    def test_change_output_size(self, qr_page):
        """Should be able to change output size."""
        size_select = qr_page.locator("#pixelSize")
        size_select.select_option("1024")
        expect(size_select).to_have_value("1024")


class TestQRCodeRegeneration:
    """Tests for QR code regeneration scenarios."""

    def test_regenerate_with_different_text(self, qr_page):
        """Changing text should update the QR code live."""
        textarea = qr_page.locator("#qrText")

        textarea.fill("First text")
        expect(qr_page.locator("#qrcode canvas:not(.ghost)")).to_be_visible()

        textarea.fill("Second different text")
        expect(qr_page.locator("#qrcode canvas:not(.ghost)")).to_be_visible()

    def test_switch_from_text_to_wifi(self, qr_page):
        """Should be able to generate text QR then wifi QR."""
        qr_page.locator("#qrText").fill("Text QR")
        expect(qr_page.locator("#qrcode canvas:not(.ghost)")).to_be_visible()

        qr_page.locator('.tab[data-tab="wifi"]').click()

        qr_page.locator("#wifiSsid").fill("MyWifi")
        qr_page.locator("#wifiPassword").fill("password123")
        expect(qr_page.locator("#qrcode canvas:not(.ghost)")).to_be_visible()
