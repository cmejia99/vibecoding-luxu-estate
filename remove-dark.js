const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            // Remove 'dark:...' classes including hover variations
            content = content.replace(/\s?dark:[a-zA-Z0-9\/-]+/g, '');
            fs.writeFileSync(fullPath, content);
            console.log(`Updated ${fullPath}`);
        }
    }
}

replaceInDir('./app');
replaceInDir('./components');
