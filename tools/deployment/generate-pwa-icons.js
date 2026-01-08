/**
 * PWA Icon Generator Script
 * 
 * This script helps generate PWA icons from your logo.
 * 
 * INSTRUCTIONS:
 * 1. Install sharp: npm install --save-dev sharp
 * 2. Place your logo (PNG format, at least 512x512) at: platform/shell/main-shell/zionix-main-host/src/assets/logo-source.png
 * 3. Run: node tools/deployment/generate-pwa-icons.js
 * 
 * If you don't have a PNG logo, you can:
 * - Convert your SVG to PNG using an online tool
 * - Or manually create icons at https://www.pwabuilder.com/imageGenerator
 * 
 * Required icon sizes: 72, 96, 128, 144, 152, 192, 384, 512
 */

const fs = require('fs');
const path = require('path');

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const SOURCE_LOGO = path.join(__dirname, '../../platform/shell/main-shell/zionix-main-host/src/assets/logo-source.png');
const OUTPUT_DIR = path.join(__dirname, '../../platform/shell/main-shell/zionix-main-host/src/assets/pwa-icons');

async function generateIcons() {
    try {
        // Check if sharp is installed
        let sharp;
        try {
            sharp = require('sharp');
        } catch (error) {
            console.error('❌ Sharp is not installed. Please run: npm install --save-dev sharp');
            console.log('\n📝 Alternative: Generate icons manually at https://www.pwabuilder.com/imageGenerator');
            process.exit(1);
        }

        // Check if source logo exists
        if (!fs.existsSync(SOURCE_LOGO)) {
            console.error(`❌ Source logo not found at: ${SOURCE_LOGO}`);
            console.log('\n📝 Please place a PNG logo (at least 512x512) at:');
            console.log('   platform/shell/main-shell/zionix-main-host/src/assets/logo-source.png');
            console.log('\n📝 Alternative: Generate icons manually at https://www.pwabuilder.com/imageGenerator');
            process.exit(1);
        }

        // Create output directory
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }

        console.log('🎨 Generating PWA icons...\n');

        // Generate regular icons
        for (const size of ICON_SIZES) {
            await sharp(SOURCE_LOGO)
                .resize(size, size, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 0 }
                })
                .png()
                .toFile(path.join(OUTPUT_DIR, `icon-${size}x${size}.png`));

            console.log(`✅ Generated icon-${size}x${size}.png`);
        }

        // Generate maskable icons (with padding for safe area)
        const maskableSizes = [192, 512];
        for (const size of maskableSizes) {
            const padding = Math.floor(size * 0.1); // 10% padding
            await sharp(SOURCE_LOGO)
                .resize(size - (padding * 2), size - (padding * 2), {
                    fit: 'contain',
                    background: { r: 0, g: 25, b: 104, alpha: 1 } // Theme color background
                })
                .extend({
                    top: padding,
                    bottom: padding,
                    left: padding,
                    right: padding,
                    background: { r: 0, g: 25, b: 104, alpha: 1 }
                })
                .png()
                .toFile(path.join(OUTPUT_DIR, `icon-${size}x${size}-maskable.png`));

            console.log(`✅ Generated icon-${size}x${size}-maskable.png`);
        }

        console.log('\n✨ All PWA icons generated successfully!');
        console.log(`📁 Icons saved to: ${OUTPUT_DIR}`);

    } catch (error) {
        console.error('❌ Error generating icons:', error.message);
        console.log('\n📝 Alternative: Generate icons manually at https://www.pwabuilder.com/imageGenerator');
        process.exit(1);
    }
}

generateIcons();
