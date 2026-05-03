const fs = require('fs');

const newFontLink = `<link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Jost:wght@300;400;500;600;700&display=swap" rel="stylesheet">`;

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace Bodoni Moda link with Crimson Pro link
  const linkRegex = /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Bodoni\+Moda[^>]+>/g;
  if (linkRegex.test(content)) {
    content = content.replace(linkRegex, newFontLink);
    changed = true;
  }

  // Update Tailwind Configs
  if (content.includes(`'"Bodoni Moda"'`)) {
    content = content.replace(/serif:\s*\[['"]"Bodoni Moda"['"]\s*,\s*['"]serif['"]\]/g, `serif: ['"Crimson Pro"', 'serif']`);
    changed = true;
  }
  
  // Remove the injected Elite Typography Physics to restore natural spacing and weight
  const physicsRegex = /\/\* ——— ELITE TYPOGRAPHY PHYSICS ————————————————— \*\/[\s\S]*?\/\* ——— RESET & BASE ——————————————————————————————— \*\//;
  if (physicsRegex.test(content)) {
    content = content.replace(physicsRegex, '/* ——— RESET & BASE ——————————————————————————————— */');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Balanced typography in ' + file);
  }
}
