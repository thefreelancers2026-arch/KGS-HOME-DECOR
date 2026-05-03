const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('kgshomedecors_virudhachalam')) {
    content = content.replace(/kgshomedecors_virudhachalam/g, 'kgshomedecors');
    fs.writeFileSync(file, content);
    console.log(`Fixed Instagram link in ${file}`);
  }
});

let refactorJs = fs.readFileSync('refactor.js', 'utf8');
if (refactorJs.includes('kgshomedecors_virudhachalam')) {
  refactorJs = refactorJs.replace(/kgshomedecors_virudhachalam/g, 'kgshomedecors');
  fs.writeFileSync('refactor.js', refactorJs);
  console.log(`Fixed Instagram link in refactor.js`);
}
