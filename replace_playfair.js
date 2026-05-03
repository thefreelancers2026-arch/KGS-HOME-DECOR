const fs = require('fs');

const oldFontLink = `<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">`;
const newFontLink = `<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">`;

const oldConfig = `serif: ['"Playfair Display"', 'serif']`;
const newConfig = `serif: ['"Lora"', 'serif']`;

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes(oldFontLink)) {
    content = content.replace(oldFontLink, newFontLink);
    changed = true;
  }

  if (content.includes(oldConfig)) {
    content = content.replace(new RegExp(oldConfig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newConfig);
    changed = true;
  }

  // Also replace any specific Playfair references if they exist
  if (content.includes('Playfair Display')) {
     content = content.replace(/Playfair Display/g, 'Lora');
     changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Switched to Lora in ' + file);
  }
}
