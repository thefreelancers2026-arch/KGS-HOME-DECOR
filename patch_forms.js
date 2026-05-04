const fs = require('fs');

let css = fs.readFileSync('assets/css/admin.css', 'utf8');

const formStyles = `
/* ─── Custom Form Elements ──────────────────────────────── */
/* Style Select Dropdown */
select {
  appearance: none;
  background-color: var(--surface2);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 10px 14px;
  border-radius: 6px;
  font-family: inherit;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23C5A880' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 40px;
}
select:focus {
  border-color: var(--gold);
}

/* Style Checkboxes */
input[type="checkbox"] {
  appearance: none;
  background-color: transparent;
  margin: 0;
  font: inherit;
  color: currentColor;
  width: 18px;
  height: 18px;
  border: 1px solid var(--border);
  border-radius: 4px;
  display: grid;
  place-content: center;
  transition: all 0.2s ease;
  cursor: pointer;
}

input[type="checkbox"]::before {
  content: "";
  width: 10px;
  height: 10px;
  clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
  transform: scale(0);
  background-color: var(--bg);
  transition: 120ms transform ease-in-out;
}

input[type="checkbox"]:checked {
  background-color: var(--gold);
  border-color: var(--gold);
}

input[type="checkbox"]:checked::before {
  transform: scale(1);
}

/* Labels for Tags */
.f-tag {
  accent-color: var(--gold);
}
`;

css = css.replace('/* ─── Typography & Utilities ────────────────────────────── */', formStyles + '\n/* ─── Typography & Utilities ────────────────────────────── */');

fs.writeFileSync('assets/css/admin.css', css);
console.log('admin.css updated with form styles');
