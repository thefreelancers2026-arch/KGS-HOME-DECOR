const fs = require('fs');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Extremely robust regex to replace any fontFamily configuration block with the correct one
  const configRegex = /fontFamily\s*:\s*\{[^}]+\}/g;
  
  if (configRegex.test(content)) {
    const replacement = `fontFamily: {
      sans: ['"Jost"', 'sans-serif'],
      serif: ['"Crimson Pro"', 'serif']
    }`;
    content = content.replace(configRegex, replacement);
    changed = true;
  }
  
  // Make sure the link is absolutely correct too, regardless of what was there before
  // We look for any fonts.googleapis.com link that contains family=
  const googleFontsRegex = /<link[^>]+href=["']https:\/\/fonts\.googleapis\.com\/css2\?family=[^>]+>/g;
  const newLink = `<link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Jost:wght@300;400;500;600;700&display=swap" rel="stylesheet">`;
  
  if (googleFontsRegex.test(content)) {
    content = content.replace(googleFontsRegex, newLink);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Cross-checked and enforced typography in ' + file);
  }
}
