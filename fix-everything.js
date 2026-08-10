const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const assetsPath = path.join(__dirname, 'src', 'assets');
const juicesPath = path.join(assetsPath, 'juices');

console.log('Scanning for assets...');

// 1. Create juices folder inside src/assets
if (!fs.existsSync(juicesPath)) {
    fs.mkdirSync(juicesPath, { recursive: true });
}

// Map of base names to their proper relative paths
const targetImages = {
    'cabbage': 'cabbage.png',
    'grocery-bag': 'grocery-bag.png',
    'onions': 'onions.png',
    'peppers': 'peppers.png',
    'spinach': 'spinach.png',
    'cocktail': 'juices/cocktail.png',
    'mango': 'juices/mango.png',
    'passion': 'juices/passion.png',
    'pineapple_mint': 'juices/pineapple_mint.png', // Placed before pineapple to ensure exact match
    'pineapple': 'juices/pineapple.png',
    'strawberry': 'juices/strawberry.png',
    'ukwaju': 'juices/ukwaju.png'
};

if (fs.existsSync(assetsPath)) {
    const files = fs.readdirSync(assetsPath);
    let movedCount = 0;
    
    // Sort keys by length so 'pineapple_mint' is checked before 'pineapple'
    const keys = Object.keys(targetImages).sort((a, b) => b.length - a.length);

    files.forEach(file => {
        const fullPath = path.join(assetsPath, file);
        
        // Skip subdirectories
        if (fs.statSync(fullPath).isDirectory()) return;

        // Delete stray build files
        if (file.endsWith('.js') || file.endsWith('.css')) {
            fs.unlinkSync(fullPath);
            console.log(`🗑️ Deleted stray file: ${file}`);
            return;
        }

        // Dynamically fix PNG files regardless of their random hash
        if (file.endsWith('.png')) {
            for (let key of keys) {
                if (file.startsWith(key + '-') || file === key + '.png') {
                    const newRelativePath = targetImages[key];
                    const newPath = path.join(assetsPath, newRelativePath);
                    
                    if (fullPath !== newPath) {
                        fs.renameSync(fullPath, newPath);
                        console.log(`✅ Fixed: ${file} -> src/assets/${newRelativePath}`);
                        movedCount++;
                    }
                    break; // Move to the next file
                }
            }
        }
    });

    if (movedCount === 0) console.log('⚠️ No files needed renaming. Are they already clean?');
} else {
    console.log('❌ Could not find src/assets folder!');
}

// Execute Git commands to push the fix
try {
    console.log('\nSaving to GitHub...');
    execSync('git add .');
    execSync('git commit -m "Dynamically clean and fix image names"');
    execSync('git push origin main');
    console.log('🎉 ALL DONE! Check Render for the successful deployment.');
} catch (e) {
    console.log('⚠️ Push skipped (The files might already be fixed on GitHub).');
}