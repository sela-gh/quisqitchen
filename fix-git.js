const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const gitignorePath = path.join(__dirname, '.gitignore');

// 1. Fix the .gitignore file
console.log('Checking .gitignore...');
let gitignoreContent = '';
if (fs.existsSync(gitignorePath)) {
    gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    // Remove accidental quotes around node_modules
    gitignoreContent = gitignoreContent.replace(/"node_modules\/?"/g, 'node_modules');
}

// Ensure clean node_modules rule exists
if (!gitignoreContent.includes('node_modules')) {
    gitignoreContent += '\nnode_modules\n';
}

fs.writeFileSync(gitignorePath, gitignoreContent.trim() + '\n');
console.log('✅ Fixed .gitignore file.');

// 2. Execute Git commands
try {
    console.log('Untracking node_modules from Git (this may take a moment)...');
    try {
        // Attempt to untrack the folder. (Ignores errors if it's already untracked)
        execSync('git rm -r --cached node_modules', { stdio: 'ignore' });
    } catch (e) {
        // Silently continue if it wasn't tracked
    }
    console.log('✅ Untracked node_modules.');

    console.log('Staging changes...');
    execSync('git add .');

    console.log('Committing changes...');
    try {
        execSync('git commit -m "Fix gitignore and remove node_modules"');
        console.log('✅ Committed changes.');
    } catch (e) {
        console.log('⚠️ Nothing new to commit (changes might already be staged).');
    }

    console.log('Pushing to GitHub...');
    execSync('git push origin main');
    console.log('✅ Successfully pushed to GitHub!');
    
    console.log('\n🎉 All done! Render should now detect the push, perform a clean install, and build successfully.');

} catch (error) {
    console.error('\n❌ An error occurred while running Git commands:');
    console.error(error.message);
}