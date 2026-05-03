const fs = require('fs');

const newFontLink = `<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,600;0,6..96,700;1,6..96,400&family=Jost:wght@300;400;500;600;700&display=swap" rel="stylesheet">`;

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace Lora/Plus Jakarta link with Bodoni Moda/Jost link
  const linkRegex = /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Lora[^>]+>/g;
  if (linkRegex.test(content)) {
    content = content.replace(linkRegex, newFontLink);
    changed = true;
  }
  
  // Just in case there are old Playfair links lying around
  const oldLinkRegex = /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Playfair\+Display[^>]+>/g;
  if (oldLinkRegex.test(content)) {
    content = content.replace(oldLinkRegex, newFontLink);
    changed = true;
  }

  // Update Tailwind Configs
  content = content.replace(/sans:\s*\[['"]"Plus Jakarta Sans"['"]\s*,\s*['"]sans-serif['"]\]/g, `sans: ['"Jost"', 'sans-serif']`);
  content = content.replace(/serif:\s*\[['"]"Lora"['"]\s*,\s*['"]serif['"]\]/g, `serif: ['"Bodoni Moda"', 'serif']`);
  
  // Replace inline CSS fonts back to Jost
  content = content.replace(/font-family:\s*'Plus Jakarta Sans',\s*sans-serif;/g, "font-family: 'Jost', sans-serif;");

  fs.writeFileSync(file, content);
  console.log('Restored thin elegance to ' + file);
}
