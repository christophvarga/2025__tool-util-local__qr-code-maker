"""
E2E UI Tests for QR Code Maker Application - Core UI.

Tests cover:
- Page loading and initial state (live preview, ghost QR)
- Content type navigation (chips + 'Mehr' menu)
- Live QR code generation for Text/URL
- Accessibility (ARIA attributes, keyboard navigation)
"""

import re
from playwright.sync_api import expect


class TestPageLoad:
    """Tests for initial page load and structure."""

    def test_page_title(self, qr_page):
        """Page should have correct title."""
        expect(qr_page).to_have_title("QR-Code Generator – kostenlos QR-Codes erstellen | varga.media")

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

    def test_type_tabs_present(self, qr_page):
        """All 9 content types should exist (3 chips + 6 menu items)."""
        tabs = qr_page.locator(".tab")
        expect(tabs).to_have_count(9)

    def test_primary_chips_visible(self, qr_page):
        """Primary type chips (Link, WLAN, Text) and Mehr button should be visible."""
        for tab in ("link", "wifi", "text"):
            expect(qr_page.locator(f'.tab[data-tab="{tab}"]')).to_be_visible()
        expect(qr_page.locator("#moreTypesBtn")).to_be_visible()

    def test_link_tab_active_by_default(self, qr_page):
        """Link tab should be active by default."""
        link_tab = qr_page.locator('.tab[data-tab="link"]')
        expect(link_tab).to_have_class(re.compile(r"active"))

    def test_no_generate_button(self, qr_page):
        """Live preview: there should be no generate button anymore."""
        expect(qr_page.locator("#generateBtn")).to_have_count(0)

    def test_download_button_disabled_initially(self, qr_page):
        """Download button should be visible but disabled before any content."""
        button = qr_page.locator("#downloadBtn")
        expect(button).to_be_visible()
        expect(button).to_be_disabled()

    def test_ghost_preview_shown_initially(self, qr_page):
        """An example ghost QR should be rendered while waiting for content."""
        ghost = qr_page.locator("#qrcode canvas.ghost")
        expect(ghost).to_be_visible()

    def test_status_idle_initially(self, qr_page):
        """Status card should show idle state initially."""
        expect(qr_page.locator("#statusCard")).to_have_attribute("data-state", "idle")
        expect(qr_page.locator("#statusText")).to_have_text("Warte auf Inhalt")

    def test_error_message_hidden_initially(self, qr_page):
        """Error message should be hidden on page load."""
        error = qr_page.locator("#errorMessage")
        expect(error).to_be_hidden()

    def test_noscript_not_visible(self, qr_page):
        """Noscript warning should not be visible when JS is enabled."""
        noscript = qr_page.locator(".noscript-warning")
        expect(noscript).to_have_count(0)

    def test_section_titles_present(self, qr_page):
        """The three always-visible sections should be labelled."""
        titles = qr_page.locator(".section-title")
        expect(titles).to_have_count(3)
        expect(titles.nth(0)).to_have_text("Inhalt")
        expect(titles.nth(1)).to_have_text("Stil")
        expect(titles.nth(2)).to_have_text("Farbe")

    def test_accordions_collapsed_by_default(self, qr_page):
        """Branding and Erweitert accordions should be collapsed."""
        assert qr_page.locator("#brandingDetails").get_attribute("open") is None
        assert qr_page.locator("#advancedDetails").get_attribute("open") is None


class TestTypeNavigation:
    """Tests for content type switching (chips + menu)."""

    def test_switch_to_wifi_tab(self, qr_page):
        """Clicking WLAN chip should show WLAN form."""
        wifi_tab = qr_page.locator('.tab[data-tab="wifi"]')
        wifi_tab.click()

        expect(wifi_tab).to_have_class(re.compile(r"active"))
        wifi_content = qr_page.locator("#wifiTab")
        expect(wifi_content).to_have_class(re.compile(r"active"))

    def test_switch_to_email_via_menu(self, qr_page, select_type):
        """Selecting E-Mail from the Mehr menu should show the E-Mail form."""
        select_type("email")

        email_content = qr_page.locator("#emailTab")
        expect(email_content).to_have_class(re.compile(r"active"))

    def test_more_chip_shows_selected_secondary_type(self, qr_page, select_type):
        """The Mehr chip should adopt the label of the selected secondary type."""
        expect(qr_page.locator("#moreTypesLabel")).to_have_text("Mehr")
        select_type("email")
        expect(qr_page.locator("#moreTypesLabel")).to_have_text("E-Mail")

        qr_page.locator('.tab[data-tab="link"]').click()
        expect(qr_page.locator("#moreTypesLabel")).to_have_text("Mehr")

    def test_switch_back_to_link_tab(self, qr_page):
        """Switching away and back to link tab should work."""
        qr_page.locator('.tab[data-tab="wifi"]').click()
        link_tab = qr_page.locator('.tab[data-tab="link"]')
        link_tab.click()

        expect(link_tab).to_have_class(re.compile(r"active"))
        link_content = qr_page.locator("#linkTab")
        expect(link_content).to_have_class(re.compile(r"active"))

    def test_only_one_tab_active(self, qr_page, select_type):
        """Only one tab should be active at a time."""
        select_type("email")

        active_tabs = qr_page.locator(".tab.active")
        expect(active_tabs).to_have_count(1)

    def test_menu_closes_after_selection(self, qr_page, select_type):
        """The Mehr menu should close after picking a type."""
        select_type("vcard")
        expect(qr_page.locator("#moreTypesMenu")).to_be_hidden()


class TestAccessibility:
    """Tests for ARIA attributes and keyboard navigation."""

    def test_tablist_role(self, qr_page):
        """Type row should have role='tablist'."""
        tablist = qr_page.locator('[role="tablist"]')
        expect(tablist).to_have_count(1)

    def test_tab_roles(self, qr_page):
        """Each type button should have role='tab'."""
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

    def test_more_menu_aria_expanded(self, qr_page):
        """Mehr button should toggle aria-expanded."""
        more_btn = qr_page.locator("#moreTypesBtn")
        expect(more_btn).to_have_attribute("aria-expanded", "false")
        more_btn.click()
        expect(more_btn).to_have_attribute("aria-expanded", "true")

    def test_keyboard_arrow_right_navigation(self, qr_page):
        """ArrowRight should move to next tab."""
        link_tab = qr_page.locator('.tab[data-tab="link"]')
        link_tab.focus()
        qr_page.keyboard.press("ArrowRight")

        wifi_tab = qr_page.locator('.tab[data-tab="wifi"]')
        expect(wifi_tab).to_have_attribute('aria-selected', 'true')

    def test_keyboard_arrow_left_wraps(self, qr_page):
        """ArrowLeft from first tab should wrap to last type (Eigener Inhalt)."""
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
        qr_page.locator("#qrText").fill("Accessibility test")

        canvas = qr_page.locator("#qrcode canvas:not(.ghost)")
        expect(canvas).to_have_attribute('aria-label', 'Generierter QR-Code')
        expect(canvas).to_have_attribute('role', 'img')


class TestLiveGeneration:
    """Tests for live (debounced) QR code generation."""

    def test_generate_url_qr_code(self, qr_page):
        """Typing a URL should render a QR code without any button click."""
        qr_page.locator("#qrText").fill("https://example.com")

        canvas = qr_page.locator("#qrcode canvas:not(.ghost)")
        expect(canvas).to_be_visible()

    def test_generate_text_qr_code(self, qr_page):
        """Typing plain text should render a QR code."""
        qr_page.locator("#qrText").fill("Hello World!")

        canvas = qr_page.locator("#qrcode canvas:not(.ghost)")
        expect(canvas).to_be_visible()

    def test_download_enables_after_input(self, qr_page):
        """Download button should become enabled once content exists."""
        qr_page.locator("#qrText").fill("Test content")

        download_btn = qr_page.locator("#downloadBtn")
        expect(download_btn).to_be_enabled()

    def test_status_ok_after_input(self, qr_page):
        """Status card should switch to scannable state."""
        qr_page.locator("#qrText").fill("https://example.com")

        expect(qr_page.locator("#statusCard")).to_have_attribute("data-state", "ok")
        expect(qr_page.locator("#statusText")).to_have_text("Gut scanbar")

    def test_clearing_input_disables_download(self, qr_page):
        """Clearing the input should return to idle state."""
        qr_page.locator("#qrText").fill("https://example.com")
        expect(qr_page.locator("#downloadBtn")).to_be_enabled()

        qr_page.locator("#qrText").fill("")

        expect(qr_page.locator("#downloadBtn")).to_be_disabled()
        expect(qr_page.locator("#statusCard")).to_have_attribute("data-state", "idle")

    def test_clear_field_button(self, qr_page):
        """The field clear button should empty the URL field."""
        qr_page.locator("#qrText").fill("https://example.com")
        qr_page.locator('.clear-field[data-clear="qrText"]').click()

        expect(qr_page.locator("#qrText")).to_have_value("")
        expect(qr_page.locator("#downloadBtn")).to_be_disabled()
