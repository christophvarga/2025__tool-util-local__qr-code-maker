from playwright.sync_api import sync_playwright
import time

def test_high_pixel_settings():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        print("🔬 Test: Hohe Pixel-Einstellungen & Layout")
        print("=" * 70)
        
        page.goto("http://localhost:8000")
        time.sleep(0.5)
        
        # Test verschiedene Texte
        test_cases = [
            ("Kurz", "Test"),
            ("URL", "https://example.com/test/path"),
            ("WLAN", "WIFI")
        ]
        
        pixel_sizes = [256, 400, 512, 800]
        
        for test_name, content in test_cases:
            print(f"\n{'='*70}")
            print(f"📝 Test-Szenario: {test_name}")
            print(f"{'='*70}")
            
            # Setup für WLAN oder Text
            if test_name == "WLAN":
                wifi_tab = page.locator('.tab[data-tab="wifi"]')
                wifi_tab.click()
                time.sleep(0.3)
                page.fill("#wifiSsid", "TestWLAN-VeryLongName-2024")
                page.fill("#wifiPassword", "SuperSecretPassword123456")
                page.select_option("#wifiSecurity", "WPA")
            else:
                text_tab = page.locator('.tab[data-tab="text"]')
                text_tab.click()
                time.sleep(0.3)
                page.fill("#qrText", content)
            
            for pixel in pixel_sizes:
                print(f"\n🔍 Pixel-Größe: {pixel}px")
                
                page.select_option("#pixelSize", str(pixel))
                page.select_option("#eccLevel", "M")
                page.click("#generateBtn")
                time.sleep(0.8)
                
                # Canvas Größe
                canvas_width = page.evaluate("document.querySelector('#qrcode canvas')?.width")
                canvas_height = page.evaluate("document.querySelector('#qrcode canvas')?.height")
                
                # Container Größe
                container_box = page.locator("#qrcode").bounding_box()
                container_width = container_box['width']
                container_height = container_box['height']
                
                # Canvas bounding box (wie es angezeigt wird)
                canvas_box = page.locator("#qrcode canvas").bounding_box()
                displayed_width = canvas_box['width']
                displayed_height = canvas_box['height']
                
                # Overflow check
                overflow_h = displayed_width > container_width
                overflow_v = displayed_height > container_height
                
                print(f"   📐 Canvas (tatsächlich): {canvas_width}x{canvas_height}px")
                print(f"   🖼️  Canvas (angezeigt):  {displayed_width:.0f}x{displayed_height:.0f}px")
                print(f"   📦 Container:            {container_width:.0f}x{container_height:.0f}px")
                
                if overflow_h or overflow_v:
                    print(f"   ⚠️  OVERFLOW DETECTED!")
                    if overflow_h:
                        print(f"      → Horizontal: Canvas {displayed_width:.0f}px > Container {container_width:.0f}px")
                    if overflow_v:
                        print(f"      → Vertikal: Canvas {displayed_height:.0f}px > Container {container_height:.0f}px")
                else:
                    padding_h = (container_width - displayed_width) / 2
                    padding_v = (container_height - displayed_height) / 2
                    print(f"   ✅ Kein Overflow")
                    print(f"   📏 Padding: horizontal {padding_h:.0f}px, vertikal {padding_v:.0f}px")
                
                # Screenshot für Dokumentation
                if pixel >= 800:
                    screenshot_name = f"test_high_{test_name.lower()}_{pixel}.png"
                    page.screenshot(
                        path=f"/Users/christophvarga/Documents/03_code_repos/2025_qr-code-maker/{screenshot_name}",
                        full_page=True
                    )
                    print(f"   📸 Screenshot: {screenshot_name}")
        
        # Extremtest: Was passiert mit sehr hohen Werten?
        print(f"\n{'='*70}")
        print("🚨 EXTREMTEST: Sehr hohe Pixel-Werte")
        print(f"{'='*70}")
        
        text_tab = page.locator('.tab[data-tab="text"]')
        text_tab.click()
        time.sleep(0.3)
        page.fill("#qrText", "Test")
        
        # Simuliere manuelles Setzen von sehr hohen Werten
        extreme_values = [1024, 2048]
        
        for extreme in extreme_values:
            print(f"\n⚡ Test mit {extreme}px (manuell gesetzt)...")
            
            # JavaScript ausführen um Wert zu setzen
            page.evaluate(f"""
                document.getElementById('pixelSize').innerHTML += '<option value="{extreme}">{extreme} px</option>';
                document.getElementById('pixelSize').value = '{extreme}';
            """)
            
            page.click("#generateBtn")
            time.sleep(1)
            
            try:
                canvas_width = page.evaluate("document.querySelector('#qrcode canvas')?.width")
                canvas_box = page.locator("#qrcode canvas").bounding_box()
                container_box = page.locator("#qrcode").bounding_box()
                
                print(f"   📐 Canvas: {canvas_width}x{canvas_width}px")
                print(f"   🖼️  Angezeigt: {canvas_box['width']:.0f}x{canvas_box['height']:.0f}px")
                print(f"   📦 Container: {container_box['width']:.0f}x{container_box['height']:.0f}px")
                
                if canvas_box['width'] > container_box['width']:
                    overflow_amount = canvas_box['width'] - container_box['width']
                    print(f"   ⚠️  KRITISCHER OVERFLOW: {overflow_amount:.0f}px über Container hinaus!")
                else:
                    print(f"   ✅ Passt noch in Container")
                
                screenshot_name = f"test_extreme_{extreme}.png"
                page.screenshot(
                    path=f"/Users/christophvarga/Documents/03_code_repos/2025_qr-code-maker/{screenshot_name}",
                    full_page=True
                )
                print(f"   📸 Screenshot: {screenshot_name}")
                
            except Exception as e:
                print(f"   ❌ Fehler bei {extreme}px: {e}")
        
        # Zusammenfassung
        print(f"\n{'='*70}")
        print("📊 ANALYSE & EMPFEHLUNGEN")
        print(f"{'='*70}")
        print("\nGetestete Pixel-Werte:")
        print("  • 256px - 800px: Standard-Optionen")
        print("  • 1024px, 2048px: Extreme Werte")
        print("\nBeobachtungen:")
        print("  • Container max-width: 520px")
        print("  • Container padding: 32px")
        print("  • Verfügbare Breite: ~456px für Canvas")
        print("\nEmpfehlung:")
        print("  ⚠️  Bei Werten >512px kann es zu Overflow kommen")
        print("  💡 Entweder: max-width erhöhen oder Pixel-Limit setzen")
        
        time.sleep(3)
        browser.close()

if __name__ == "__main__":
    try:
        test_high_pixel_settings()
    except Exception as e:
        print(f"\n❌ Test fehlgeschlagen: {e}")
        import traceback
        traceback.print_exc()
        raise
