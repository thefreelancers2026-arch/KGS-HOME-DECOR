const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// The file has raw UTF-8 mis-decoded characters. Let's fix them:
let fixed = content
  .replace(/â€”/g, '&mdash;')
  .replace(/â€“/g, '&ndash;')
  .replace(/â€"/g, '&mdash;')
  .replace(/â€˜/g, '&lsquo;')
  .replace(/â€™/g, '&rsquo;');
  
fs.writeFileSync('index.html', fixed, 'utf8');
console.log('Fixed index.html');
