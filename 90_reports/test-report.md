# Test Report - QR Code Maker

## Uebersicht

| Metrik | Wert |
|--------|------|
| Datum | 2025-12-12 23:00 |
| Suite | Playwright E2E |
| Browser | Chromium |
| Passed | 33 |
| Failed | 0 |
| Skipped | 0 |
| Laufzeit | 28.57s |

## Test Kategorien

### TestPageLoad (7 Tests)
- test_page_title - PASSED
- test_heading_visible - PASSED
- test_subtitle_visible - PASSED
- test_tabs_present - PASSED
- test_text_tab_active_by_default - PASSED
- test_generate_button_visible - PASSED
- test_download_button_hidden_initially - PASSED

### TestTabNavigation (4 Tests)
- test_switch_to_wifi_tab - PASSED
- test_switch_to_design_tab - PASSED
- test_switch_back_to_text_tab - PASSED
- test_only_one_tab_active - PASSED

### TestTextURLQRCode (5 Tests)
- test_generate_url_qr_code - PASSED
- test_generate_text_qr_code - PASSED
- test_empty_text_shows_alert - PASSED
- test_download_button_appears_after_generation - PASSED
- test_enter_key_generates_qr - PASSED

### TestWLANQRCode (5 Tests)
- test_wifi_form_elements_present - PASSED
- test_generate_wifi_qr_code - PASSED
- test_empty_ssid_shows_alert - PASSED
- test_wifi_security_options - PASSED
- test_wifi_without_password - PASSED

### TestDesignOptions (4 Tests)
- test_color_pickers_present - PASSED
- test_gradient_checkbox - PASSED
- test_logo_size_slider - PASSED
- test_custom_colors_applied - PASSED

### TestAdvancedSettings (6 Tests)
- test_ecc_level_options - PASSED
- test_ecc_default_value - PASSED
- test_pixel_size_options - PASSED
- test_pixel_size_default_value - PASSED
- test_change_ecc_level - PASSED
- test_change_output_size - PASSED

### TestQRCodeRegeneration (2 Tests)
- test_regenerate_with_different_text - PASSED
- test_switch_from_text_to_wifi - PASSED

## Artefakte

- JUnit XML: `89_output/test_reports/20251212-2300/junit-playwright.xml`
- Symlink: `89_output/test_reports/latest`
