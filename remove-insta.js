const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'index.html');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Use regex to remove the entire Instagram section
  // It starts with <!-- ══ INSTAGRAM and ends with </section>
  // We use [\s\S]*? for lazy matching across newlines
  const regex = /<!-- ══ INSTAGRAM [\s\S]*?<\/section>\n*/g;
  
  if (regex.test(content)) {
    content = content.replace(regex, '');
    fs.writeFileSync(file, content);
    console.log(`Removed Instagram from ${file}`);
  }
});
