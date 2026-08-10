const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const rootAssetsPath = path.join(__dirname, 'assets');
const srcAssetsPath = path.join(__dirname, 'src', 'assets');
const srcJuicesPath = path.join(srcAssetsPath, 'juices');

console.log('Starting asset cleanup...');

// 1. Create the destination folders inside 'src'
if (!fs.existsSync(srcAssetsPath)) {
    fs.mkdirSync(srcAssetsPath, { recursive: true });
}
if (!fs.existsSync(srcJuicesPath)) {
    fs.mkdirSync(srcJuicesPath, { recursive: true });
}

// 2. Map of the old hashed names to the clean names
const fileMap = {
    'cabbage-RJshbfVS.png': 'cabbage.png',
    'cocktail-bFzl4BRs.png': 'juices/cocktail.png',
    'grocery-bag-Bv2KXfSk.png': 'grocery-bag.png',
    'mango-BgB0_9PQ.png': 'juices/mango.png',
    'onions-BemCiYao.png': 'onions.png',
    'passion-B_ZgAwPX.png': 'juices/passion.png',
    'peppers-DOtH8Tt2.png': 'peppers.png',
    'pineapple_mint-DG5VR-BA.png': 'juices/pineapple_mint.png',
    'pineapple-DICLbnHg.png': 'juices/pineapple.png',
    'spinach-oKsWFpk0.png': 'spinach.png',
    'strawberry-Bmo_59sV.png': 'juices/strawberry.png',
    'ukwaju-B2GAvnIL.png': 'juices/ukwaju.png'
};

// 3. Move and rename files from root/assets to src/assets
let filesMoved = 0;
Object.entries(fileMap).forEach(([oldName, newName]) => {
    const oldPath = path.join(rootAssetsPath, oldName);
    const newPath = path.join(srcAssetsPath, newName);
    
    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`✅ Moved: ${oldName} -> src/assets/${newName}`);
        filesMoved++;
    }
});

if (filesMoved === 0) {
    console.log('⚠️ No files were moved. Make sure your hashed images are in the root "assets" folder!');
}

// 4. Delete the stray compiled output files
['index-CJEHQSNQ.js', 'index-pG_L6C_1.css'].forEach(file => {
    const filePath = path.join(rootAssetsPath, file);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Deleted stray build file: ${file}`);
    }
});

// 5. Automatically push the fix to GitHub
try {
    console.log('\nStaging changes to Git...');
    execSync('git add .');
    
    console.log('Committing changes...');
    execSync('git commit -m "Move assets into src and fix filenames"');
    
    console.log('Pushing to GitHub...');
    execSync('git push origin main');
    
    console.log('\n🎉 ALL DONE! Check Render for the new successful deployment.');
} catch (error) {
    console.log('\n⚠️ Push step skipped (or nothing new to commit). Check your terminal for details.');
}