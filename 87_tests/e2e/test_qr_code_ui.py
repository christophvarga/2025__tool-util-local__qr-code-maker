"""
E2E UI Tests for QR Code Maker Application - Core UI.

Tests cover:
- Page loading and initial state
- Content type navigation
- Text/URL QR code generation
- Accessibility (ARIA attributes, keyboard navigation)
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
        expect(heading).to_have_text("QR Code Generator")

    def test_subtitle_visible(self, qr_page):
        """Subtitle should be visible."""
        subtitle = qr_page.locator(".subtitle")
        expect(subtitle).to_be_visible()
        expect(subtitle).to_have_text("Erstelle individuelle QR-Codes in Sekunden.")

    def test_tabs_present(self, qr_page):
        """All content type tabs should be present."""
        tabs = qr_page.locator(".tab")
        expect(tabs).to_have_count(9)

    def test_link_tab_active_by_default(self, qr_page):
        """Link tab should be active by default."""
        link_tab = qr_page.locator('.tab[data-tab="link"]')
        expect(link_tab).to_have_class(re.compile(r"active"))

    def test_generate_button_visible(self, qr_page):
        """Generate button should be visible."""
        button = qr_page.locator("#generateBtn")
        expect(button).to_be_visible()
        expect(button).to_have_text("QR-Code Generieren")

    def test_download_button_hidden_initially(self, qr_page):
        """Download button should be hidden before QR code generation."""
        button = qr_page.locator("#downloadBtn")
        expect(button).not_to_be_visible()

    def test_error_message_hidden_initially(self, qr_page):
        """Error message should be hidden on page load."""
        error = qr_page.locator("#errorMessage")
        expect(error).to_be_hidden()

    def test_noscript_not_visible(self, qr_page):
        """Noscript warning should not be visible when JS is enabled."""
        noscript = qr_page.locator(".noscript-warning")
        expect(noscript).to_have_count(0)


class TestTabNavigation:
    """Tests for content type switching functionality."""

    def test_switch_to_wifi_tab(self, qr_page):
        """Clicking WLAN tab should show WLAN form."""
        wifi_tab = qr_page.locator('.tab[data-tab="wifi"]')
        wifi_tab.click()

        expect(wifi_tab).to_have_class(re.compile(r"active"))
        wifi_content = qr_page.locator("#wifiTab")
        expect(wifi_content).to_have_class(re.compile(r"active"))

    def test_switch_to_email_tab(self, qr_page):
        """Clicking E-Mail tab should show E-Mail form."""
        email_tab = qr_page.locator('.tab[data-tab="email"]')
        email_tab.click()

        expect(email_tab).to_have_class(re.compile(r"active"))
        email_content = qr_page.locator("#emailTab")
        expect(email_content).to_have_class(re.compile(r"active"))

    def test_switch_back_to_link_tab(self, qr_page):
        """Switching away and back to link tab should work."""
        wifi_tab = qr_page.locator('.tab[data-tab="wifi"]')
        link_tab = qr_page.locator('.tab[data-tab="link"]')

        wifi_tab.click()
        link_tab.click()

        expect(link_tab).to_have_class(re.compile(r"active"))
        link_content = qr_page.locator("#linkTab")
        expect(link_content).to_have_class(re.compile(r"active"))

    def test_only_one_tab_active(self, qr_page):
        """Only one tab should be active at a time."""
        email_tab = qr_page.locator('.tab[data-tab="email"]')
        email_tab.click()

        active_tabs = qr_page.locator(".tab.active")
        expect(active_tabs).to_have_count(1)


class TestAccessibility:
    """Tests for ARIA attributes and keyboard navigation."""

    def test_tablist_role(self, qr_page):
        """Tab container should have role='tablist'."""
        tablist = qr_page.locator('[role="tablist"]')
        expect(tablist).to_have_count(1)

    def test_tab_roles(self, qr_page):
        """Each tab should have role='tab'."""
        tabs = qr_page.locator('[role="tab"]')
        expect(tabs).to_have_count(9)

    def test_tabpanel_roles(self, qr_page):
        """Each tab content should have role='tabpanel'."""
        panels = qr_page.locator('[role="tabpanel"]')
        expect(panels).to_have_count(9)

    def test_aria_selected_on_active_tab(self, qr_page):
        """Active tab should have aria-selected='true'."""
        active_tab = qr_page.locator('.tab.active')
        expect(active_tab).to_have_attribute('aria-selected', 'true')

    def test_aria_selected_updates_on_switch(self, qr_page):
        """aria-selected should update when switching tabs."""
        wifi_tab = qr_page.locator('.tab[data-tab="wifi"]')
        link_tab = qr_page.locator('.tab[data-tab="link"]')

        wifi_tab.click()

        expect(wifi_tab).to_have_attribute('aria-selected', 'true')
        expect(link_tab).to_have_attribute('aria-selected', 'false')

    def test_aria_controls_present(self, qr_page):
        """Tabs should have aria-controls linking to panels."""
        link_tab = qr_page.locator('#tab-link')
        expect(link_tab).to_have_attribute('aria-controls', 'linkTab')

    def test_keyboard_arrow_right_navigation(self, qr_page):
        """ArrowRight should move to next tab."""
        link_tab = qr_page.locator('.tab[data-tab="link"]')
        link_tab.focus()
        qr_page.keyboard.press("ArrowRight")

        wifi_tab = qr_page.locator('.tab[data-tab="wifi"]')
        expect(wifi_tab).to_have_attribute('aria-selected', 'true')

    def test_keyboard_arrow_left_wraps(self, qr_page):
        """ArrowLeft from first tab should wrap to last."""
        link_tab = qr_page.locator('.tab[data-tab="link"]')
        link_tab.focus()
        qr_page.keyboard.press("ArrowLeft")

        more_tab = qr_page.locator('.tab[data-tab="more"]')
        expect(more_tab).to_have_attribute('aria-selected', 'true')

    def test_error_message_has_alert_role(self, qr_page):
        """Error message container should have role='alert'."""
        error = qr_page.locator('#errorMessage')
        expect(error).to_have_attribute('role', 'alert')

    def test_canvas_has_aria_label(self, qr_page):
        """Generated canvas should have aria-label."""
        textarea = qr_page.locator("#qrText")
        textarea.fill("Accessibility test")
        qr_page.locator("#generateBtn").click()

        canvas = qr_page.locator("#qrcode canvas")
        expect(canvas).to_have_attribute('aria-label', 'Generierter QR-Code')
        expect(canvas).to_have_attribute('role', 'img')


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
        """Empty link input should show inline error message."""
        generate_btn = qr_page.locator("#generateBtn")
        generate_btn.click()

        error = qr_page.locator("#errorMessage")
        expect(error).to_be_visible()
        expect(error).to_contain_text("URL")

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

    def test_error_clears_on_successful_generation(self, qr_page):
        """Error should clear when QR code is successfully generated."""
        generate_btn = qr_page.locator("#generateBtn")
        generate_btn.click()

        error = qr_page.locator("#errorMessage")
        expect(error).to_be_visible()

        textarea = qr_page.locator("#qrText")
        textarea.fill("Valid text")
        generate_btn.click()

        expect(error).to_be_hidden()
