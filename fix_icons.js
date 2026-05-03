const fs = require('fs');

const duplicateLink = `<link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Jost:wght@300;400;500;600;700&display=swap" rel="stylesheet">\n<link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Jost:wght@300;400;500;600;700&display=swap" rel="stylesheet">`;

const fixedLinks = `<link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Jost:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">`;

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Sometimes there are slightly different line breaks or indentations, let's just do a regex replace
  const duplicateRegex = /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Crimson\+Pro:[^>]+>\s*<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Crimson\+Pro:[^>]+>/g;
  
  if (duplicateRegex.test(content)) {
    content = content.replace(duplicateRegex, fixedLinks);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Restored Material Icons in ' + file);
  }
}
