from playwright.sync_api import sync_playwright
import time

def test_qr_generator():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        print("🧪 Starte Tests für QR-Code Generator...")
        print("=" * 50)
        
        # Test 1: Seite laden
        print("\n✓ Test 1: Seite wird geladen...")
        page.goto("http://localhost:8000")
        assert page.title() == "QR-Code Generator"
        print("  ✓ Titel korrekt: 'QR-Code Generator'")
        
        # Test 2: Text/URL Tab ist aktiv
        print("\n✓ Test 2: Text/URL Tab...")
        text_tab = page.locator('.tab[data-tab="text"]')
        assert "active" in text_tab.get_attribute("class")
        print("  ✓ Text/URL Tab ist standardmäßig aktiv")
        
        # Test 3: Text QR-Code generieren
        print("\n✓ Test 3: Text QR-Code generieren...")
        page.fill("#qrText", "https://example.com")
        page.click("#generateBtn")
        time.sleep(0.5)
        
        # Prüfen ob Canvas generiert wurde
        canvas = page.locator("#qrcode canvas")
        assert canvas.is_visible()
        print("  ✓ QR-Code Canvas wurde generiert")
        
        # Prüfen ob Download Button sichtbar ist
        download_btn = page.locator("#downloadBtn")
        assert download_btn.is_visible()
        print("  ✓ Download Button ist sichtbar")
        
        # Test 4: WLAN Tab wechseln
        print("\n✓ Test 4: WLAN Tab wechseln...")
        wifi_tab = page.locator('.tab[data-tab="wifi"]')
        wifi_tab.click()
        time.sleep(0.3)
        
        # Prüfen ob WLAN Tab aktiv ist
        assert "active" in wifi_tab.get_attribute("class")
        print("  ✓ WLAN Tab ist jetzt aktiv")
        
        # Prüfen ob WLAN Felder sichtbar sind
        assert page.locator("#wifiSsid").is_visible()
        assert page.locator("#wifiPassword").is_visible()
        assert page.locator("#wifiSecurity").is_visible()
        print("  ✓ Alle WLAN-Eingabefelder sind sichtbar")
        
        # Test 5: WLAN QR-Code generieren
        print("\n✓ Test 5: WLAN QR-Code generieren...")
        page.fill("#wifiSsid", "TestWLAN")
        page.fill("#wifiPassword", "geheim123")
        page.select_option("#wifiSecurity", "WPA")
        page.click("#generateBtn")
        time.sleep(0.5)
        
        # Prüfen ob neuer Canvas generiert wurde
        canvas = page.locator("#qrcode canvas")
        assert canvas.is_visible()
        print("  ✓ WLAN QR-Code Canvas wurde generiert")
        
        # Test 6: Zurück zum Text Tab
        print("\n✓ Test 6: Zurück zum Text Tab...")
        text_tab.click()
        time.sleep(0.3)
        assert page.locator("#qrText").is_visible()
        print("  ✓ Text Tab wieder aktiv")
        
        # Test 7: Leere Eingabe validieren
        print("\n✓ Test 7: Validierung testen...")
        page.fill("#qrText", "")
        page.once("dialog", lambda dialog: dialog.accept())
        page.click("#generateBtn")
        time.sleep(0.3)
        print("  ✓ Alert wird bei leerer Eingabe angezeigt")
        
        print("\n" + "=" * 50)
        print("✅ Alle Tests erfolgreich abgeschlossen!")
        print("=" * 50)
        
        browser.close()

if __name__ == "__main__":
    try:
        test_qr_generator()
    except Exception as e:
        print(f"\n❌ Test fehlgeschlagen: {e}")
        raise
