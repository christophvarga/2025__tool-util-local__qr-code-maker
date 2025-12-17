"""
E2E UI Tests for QR Code Maker Application.

Tests cover:
- Page loading and initial state
- Tab navigation (Text/URL, WLAN, Design)
- Text/URL QR code generation
- WLAN QR code generation
- Design options (colors, gradient)
- Error handling for empty inputs
- Download functionality
"""

import re
import pytest
from playwright.sync_api import expect


class TestPageLoad:
    """Tests for initial page load and structure."""

    def test_page_title(self, qr_page):
        """Page should have correct title."""
        expect(qr_page).to_have_title("QR-Code Generator")

    def test_heading_visible(self, qr_page):
        """Main heading should be visible."""
        heading = qr_page.locator("h1")
        expect(heading).to_be_visible()
        expect(heading).to_have_text("QR-Code Generator")

    def test_subtitle_visible(self, qr_page):
        """Subtitle should be visible."""
        subtitle = qr_page.locator(".subtitle")
        expect(subtitle).to_be_visible()
        expect(subtitle).to_have_text("Erstelle individuelle QR-Codes")

    def test_tabs_present(self, qr_page):
        """All three tabs should be present."""
        tabs = qr_page.locator(".tab")
        expect(tabs).to_have_count(3)

    def test_text_tab_active_by_default(self, qr_page):
        """Text/URL tab should be active by default."""
        text_tab = qr_page.locator('.tab[data-tab="text"]')
        expect(text_tab).to_have_class(re.compile(r"active"))

    def test_generate_button_visible(self, qr_page):
        """Generate button should be visible."""
        button = qr_page.locator("#generateBtn")
        expect(button).to_be_visible()
        expect(button).to_contain_text("QR-Code Generieren")

    def test_download_button_hidden_initially(self, qr_page):
        """Download button should be hidden before QR code generation."""
        button = qr_page.locator("#downloadBtn")
        expect(button).not_to_be_visible()


class TestTabNavigation:
    """Tests for tab switching functionality."""

    def test_switch_to_wifi_tab(self, qr_page):
        """Clicking WLAN tab should show WLAN form."""
        wifi_tab = qr_page.locator('.tab[data-tab="wifi"]')
        wifi_tab.click()

        expect(wifi_tab).to_have_class(re.compile(r"active"))
        wifi_content = qr_page.locator("#wifiTab")
        expect(wifi_content).to_have_class(re.compile(r"active"))

    def test_switch_to_design_tab(self, qr_page):
        """Clicking Design tab should show design options."""
        design_tab = qr_page.locator('.tab[data-tab="design"]')
        design_tab.click()

        expect(design_tab).to_have_class(re.compile(r"active"))
        design_content = qr_page.locator("#designTab")
        expect(design_content).to_have_class(re.compile(r"active"))

    def test_switch_back_to_text_tab(self, qr_page):
        """Switching away and back to text tab should work."""
        wifi_tab = qr_page.locator('.tab[data-tab="wifi"]')
        text_tab = qr_page.locator('.tab[data-tab="text"]')

        wifi_tab.click()
        text_tab.click()

        expect(text_tab).to_have_class(re.compile(r"active"))
        text_content = qr_page.locator("#textTab")
        expect(text_content).to_have_class(re.compile(r"active"))

    def test_only_one_tab_active(self, qr_page):
        """Only one tab should be active at a time."""
        design_tab = qr_page.locator('.tab[data-tab="design"]')
        design_tab.click()

        active_tabs = qr_page.locator(".tab.active")
        expect(active_tabs).to_have_count(1)


class TestTextURLQRCode:
    """Tests for Text/URL QR code generation."""

    def test_generate_url_qr_code(self, qr_page):
        """Should generate QR code for URL."""
        textarea = qr_page.locator("#qrText")
        textarea.fill("https://example.com")

        generate_btn = qr_page.locator("#generateBtn")
        generate_btn.click()

        canvas = qr_page.locator("#qrcode canvas")
        expect(canvas).to_be_visible()

    def test_generate_text_qr_code(self, qr_page):
        """Should generate QR code for plain text."""
        textarea = qr_page.locator("#qrText")
        textarea.fill("Hello World!")

        generate_btn = qr_page.locator("#generateBtn")
        generate_btn.click()

        canvas = qr_page.locator("#qrcode canvas")
        expect(canvas).to_be_visible()

    def test_empty_text_shows_inline_error(self, qr_page):
        """Empty text input should show inline error message."""
        generate_btn = qr_page.locator("#generateBtn")
        error_message = qr_page.locator("#textError")

        generate_btn.click()

        expect(error_message).to_be_visible()
        expect(error_message).to_contain_text("Text oder URL")

    def test_download_button_appears_after_generation(self, qr_page):
        """Download button should appear after QR code generation."""
        textarea = qr_page.locator("#qrText")
        textarea.fill("Test content")

        generate_btn = qr_page.locator("#generateBtn")
        generate_btn.click()

        download_btn = qr_page.locator("#downloadBtn")
        expect(download_btn).to_be_visible()

    def test_enter_key_generates_qr(self, qr_page):
        """Pressing Enter in textarea should generate QR code."""
        textarea = qr_page.locator("#qrText")
        textarea.fill("Enter key test")
        textarea.press("Enter")

        canvas = qr_page.locator("#qrcode canvas")
        expect(canvas).to_be_visible()


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

        error_message = qr_page.locator("#wifiError")
        generate_btn = qr_page.locator("#generateBtn")
        generate_btn.click()

        expect(error_message).to_be_visible()
        expect(error_message).to_contain_text("SSID")

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


class TestAccessibility:
    """Tests for accessibility features."""

    def test_tabs_have_role_tablist(self, qr_page):
        """Tab container should have role=tablist."""
        tablist = qr_page.locator('[role="tablist"]')
        expect(tablist).to_be_visible()

    def test_tabs_have_role_tab(self, qr_page):
        """Each tab should have role=tab."""
        tabs = qr_page.locator('[role="tab"]')
        expect(tabs).to_have_count(3)

    def test_tab_panels_have_role_tabpanel(self, qr_page):
        """Tab panels should have role=tabpanel."""
        panels = qr_page.locator('[role="tabpanel"]')
        expect(panels).to_have_count(3)

    def test_active_tab_has_aria_selected(self, qr_page):
        """Active tab should have aria-selected=true."""
        text_tab = qr_page.locator('[data-tab="text"]')
        expect(text_tab).to_have_attribute("aria-selected", "true")

    def test_inactive_tabs_have_aria_selected_false(self, qr_page):
        """Inactive tabs should have aria-selected=false."""
        wifi_tab = qr_page.locator('[data-tab="wifi"]')
        expect(wifi_tab).to_have_attribute("aria-selected", "false")

    def test_keyboard_tab_navigation(self, qr_page):
        """Arrow keys should navigate between tabs."""
        text_tab = qr_page.locator('[data-tab="text"]')
        text_tab.focus()
        text_tab.press("ArrowRight")

        wifi_tab = qr_page.locator('[data-tab="wifi"]')
        expect(wifi_tab).to_have_class(re.compile(r"active"))


class TestPasswordToggle:
    """Tests for password visibility toggle."""

    def test_password_toggle_button_exists(self, qr_page):
        """Password toggle button should exist."""
        wifi_tab = qr_page.locator('.tab[data-tab="wifi"]')
        wifi_tab.click()

        toggle = qr_page.locator("#togglePassword")
        expect(toggle).to_be_visible()

    def test_password_initially_hidden(self, qr_page):
        """Password field should be type=password initially."""
        wifi_tab = qr_page.locator('.tab[data-tab="wifi"]')
        wifi_tab.click()

        password_field = qr_page.locator("#wifiPassword")
        expect(password_field).to_have_attribute("type", "password")

    def test_toggle_shows_password(self, qr_page):
        """Clicking toggle should show password."""
        wifi_tab = qr_page.locator('.tab[data-tab="wifi"]')
        wifi_tab.click()

        password_field = qr_page.locator("#wifiPassword")
        toggle = qr_page.locator("#togglePassword")
        toggle.click()

        expect(password_field).to_have_attribute("type", "text")

    def test_toggle_hides_password_again(self, qr_page):
        """Clicking toggle twice should hide password again."""
        wifi_tab = qr_page.locator('.tab[data-tab="wifi"]')
        wifi_tab.click()

        password_field = qr_page.locator("#wifiPassword")
        toggle = qr_page.locator("#togglePassword")
        toggle.click()
        toggle.click()

        expect(password_field).to_have_attribute("type", "password")


class TestResetButton:
    """Tests for reset functionality."""

    def test_reset_button_hidden_initially(self, qr_page):
        """Reset button should be hidden before QR code generation."""
        reset_btn = qr_page.locator("#resetBtn")
        expect(reset_btn).not_to_be_visible()

    def test_reset_button_appears_after_generation(self, qr_page):
        """Reset button should appear after QR code generation."""
        textarea = qr_page.locator("#qrText")
        textarea.fill("Test content")

        generate_btn = qr_page.locator("#generateBtn")
        generate_btn.click()

        reset_btn = qr_page.locator("#resetBtn")
        expect(reset_btn).to_be_visible()

    def test_reset_clears_qr_code(self, qr_page):
        """Reset should clear the QR code display."""
        textarea = qr_page.locator("#qrText")
        textarea.fill("Test content")

        generate_btn = qr_page.locator("#generateBtn")
        generate_btn.click()

        reset_btn = qr_page.locator("#resetBtn")
        reset_btn.click()

        canvas = qr_page.locator("#qrcode canvas")
        expect(canvas).not_to_be_visible()

    def test_reset_clears_input(self, qr_page):
        """Reset should clear the text input."""
        textarea = qr_page.locator("#qrText")
        textarea.fill("Test content")

        generate_btn = qr_page.locator("#generateBtn")
        generate_btn.click()

        reset_btn = qr_page.locator("#resetBtn")
        reset_btn.click()

        expect(textarea).to_have_value("")


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
