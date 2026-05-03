const fs = require('fs');
const path = require('path');

const premiumPrimary = `.btn-primary {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 15px 36px; background: #C97840; color: #fff;
  font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 600;
  letter-spacing: .14em; text-transform: uppercase; text-decoration: none;
  border: 1px solid #C97840; cursor: pointer;
  transition: all 400ms cubic-bezier(0.25, 1, 0.5, 1);
  box-shadow: 0 4px 14px rgba(201,120,64,0.15);
}
@media (hover: hover) and (pointer: fine) {
  .btn-primary:hover { 
    background: #a8612d; border-color: #a8612d; 
    transform: translateY(-2px) scale(1.02); 
    box-shadow: 0 20px 40px -10px rgba(201,120,64,0.45);
  }
}
.btn-primary:active { transform: scale(0.96) translateY(0); box-shadow: 0 2px 8px rgba(201,120,64,0.15); }`;

const premiumSecondary = `.btn-secondary {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 14px 34px; background: transparent; color: #1A1A1A;
  font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 600;
  letter-spacing: .14em; text-transform: uppercase; text-decoration: none;
  border: 1px solid rgba(26,26,26,0.3); cursor: pointer;
  transition: all 400ms cubic-bezier(0.25, 1, 0.5, 1);
}
@media (hover: hover) and (pointer: fine) {
  .btn-secondary:hover { 
    border-color: #1A1A1A; color: #1A1A1A;
    transform: translateY(-2px); 
    box-shadow: 0 20px 40px -10px rgba(26,26,26,0.1); 
  }
}
.btn-secondary:active { transform: scale(0.96); }`;

// List of HTML files
const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html') && f !== 'index.html');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace primary button CSS
  const regexPrimary = /\.btn-primary\s*\{[\s\S]*?\}\s*(\@media[^{]+\{[\s\S]*?\}\s*)?(\.btn-primary:active\s*\{[\s\S]*?\}\s*)?/;
  if (regexPrimary.test(content) && !content.includes('.btn-primary:active { transform: scale(0.96) translateY(0)')) {
    content = content.replace(regexPrimary, premiumPrimary + '\n');
    changed = true;
  }

  // Replace secondary button CSS
  const regexSecondary = /\.btn-secondary\s*\{[\s\S]*?\}\s*(\@media[^{]+\{[\s\S]*?\}\s*)?(\.btn-secondary:active\s*\{[\s\S]*?\}\s*)?/;
  if (regexSecondary.test(content) && !content.includes('.btn-secondary:active { transform: scale(0.96)')) {
    content = content.replace(regexSecondary, premiumSecondary + '\n');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Upgraded buttons in ' + file);
  }
}
