const fs = require('fs');

const newFontLink = `<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">`;

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

  // Replace Google Fonts Link
  const fontLinkRegex = /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Cormorant\+Garamond[^>]+>/g;
  if (fontLinkRegex.test(content)) {
    content = content.replace(fontLinkRegex, newFontLink);
    changed = true;
  }

  // Replace Tailwind Config for Fonts
  const configRegex1 = /sans:\s*\[['"]"Jost"['"]\s*,\s*['"]sans-serif['"]\]/g;
  if (configRegex1.test(content)) {
    content = content.replace(configRegex1, `sans: ['"Plus Jakarta Sans"', 'sans-serif']`);
    changed = true;
  }
  const configRegex2 = /serif:\s*\[['"]"Cormorant Garamond"['"]\s*,\s*['"]serif['"]\]/g;
  if (configRegex2.test(content)) {
    content = content.replace(configRegex2, `serif: ['"Playfair Display"', 'serif']`);
    changed = true;
  }
  
  // Replace inline CSS references to Jost
  if (content.includes("font-family: 'Jost', sans-serif;")) {
    content = content.replace(/font-family:\s*'Jost',\s*sans-serif;/g, "font-family: 'Plus Jakarta Sans', sans-serif;");
    changed = true;
  }

  // Inject Typography CSS if not present
  if (content.includes('/* ——— RESET & BASE ——————————————————————————————— */') && !content.includes('ELITE TYPOGRAPHY PHYSICS')) {
    content = content.replace('/* ——— RESET & BASE ——————————————————————————————— */', typographyCSS);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Robust typography upgrade applied to ' + file);
  }
}
