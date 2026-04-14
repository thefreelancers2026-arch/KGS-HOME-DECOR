const fs = require('fs');
const path = require('path');

const dir = '.';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    content = content.replace(/Atelier/gi, 'Store');
    content = content.replace(/Curated Journey/gi, 'Shopping Experience');
    content = content.replace(/Sanctuary/gi, 'Home');
    content = content.replace(/Curated pairings for your living space/gi, 'Best Quality Products');

    // Currency formatting
    content = content.replace(/\$([0-9,]+)\.00/g, '₹$1');
    content = content.replace(/\$([0-9,]+)/g, '₹$1');

    // Tracking
    content = content.replace(/tracking-\[0\.25em\]/g, '');
    content = content.replace(/tracking-\[0\.2em\]/g, 'tracking-wide');
    content = content.replace(/tracking-\[0\.15em\]/g, '');
    content = content.replace(/tracking-\[0\.1em\]/g, '');
    content = content.replace(/tracking-widest/g, 'tracking-wide');

    // Uppercase overload
    content = content.replace(/uppercase text-\[10px\]/g, 'text-sm font-medium');
    content = content.replace(/text-\[10px\] uppercase/g, 'text-sm font-medium');
    content = content.replace(/text-\[10px\] font-bold uppercase/g, 'text-sm font-bold');

    fs.writeFileSync(filePath, content, 'utf8');
});
