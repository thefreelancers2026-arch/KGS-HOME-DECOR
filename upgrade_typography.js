const fs = require('fs');

const oldFontLink = `<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Jost:wght@300;400;500;600;700&display=swap" rel="stylesheet">`;
const newFontLink = `<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">`;

const oldConfig = `fontFamily: {
      sans: ['"Jost"', 'sans-serif'],
      serif: ['"Cormorant Garamond"', 'serif'],
    }`;
const newConfig = `fontFamily: {
      sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      serif: ['"Playfair Display"', 'serif'],
    }`;

const typographyCSS = `
/* ——— ELITE TYPOGRAPHY PHYSICS ————————————————— */
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
h1, h2, h3, .font-serif {
  letter-spacing: -0.02em;
  line-height: 1.1;
}
p {
  letter-spacing: -0.01em;
}
/* ——— RESET & BASE ——————————————————————————————— */`;

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes(oldFontLink)) {
    content = content.replace(oldFontLink, newFontLink);
    changed = true;
  }

  if (content.includes(oldConfig)) {
    content = content.replace(oldConfig, newConfig);
    changed = true;
  }
  
  if (content.includes('/* ——— RESET & BASE ——————————————————————————————— */') && !content.includes('ELITE TYPOGRAPHY PHYSICS')) {
    content = content.replace('/* ——— RESET & BASE ——————————————————————————————— */', typographyCSS);
    changed = true;
  }

  // Also replace 'font-serif font-medium' with 'font-serif font-semibold' on huge numbers if needed, but Playfair looks great at medium.

  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Upgraded typography in ' + file);
  }
}
