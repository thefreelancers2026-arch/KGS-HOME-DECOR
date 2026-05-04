const fs = require('fs');

// 1. PATCH ADMIN.CSS
let css = fs.readFileSync('assets/css/admin.css', 'utf8');

// Fix z-index issue
css = css.replace(
  '.admin-wrap { display: flex; min-height: 100vh; position: relative; z-index: 1 }',
  '.admin-wrap { display: flex; min-height: 100vh; position: relative; z-index: 10; } /* Fixed z-index for mobile overlay */'
);

// We should also ensure overlay is above main content but below sidebar.
// .sidebar-overlay is z-index: 190, .sidebar is z-index: 200.
// If admin-wrap has z-index: 10, then sidebar inside it will be capped at 10.
// Let's remove z-index: 10 and position relative to break the stacking context.
css = css.replace(
  '.admin-wrap { display: flex; min-height: 100vh; position: relative; z-index: 10; } /* Fixed z-index for mobile overlay */',
  '.admin-wrap { display: flex; min-height: 100vh; position: relative; }'
);

// Add Bento Grid Styles & Graph Styles
const bentoStyles = `
/* ─── Premium Bento Dashboard ───────────────────────────── */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
  margin-bottom: 36px;
}

.bento-card {
  background: linear-gradient(180deg, var(--surface) 0%, var(--bg) 100%);
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 28px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.03), 0 12px 32px rgba(0,0,0,0.2);
  transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1), box-shadow 0.4s ease;
}

.bento-card:hover {
  transform: translateY(-2px);
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.05), 0 20px 48px rgba(0,0,0,0.4);
  border-color: rgba(197,168,128,0.15);
}

.bento-card .label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--muted);
  margin-bottom: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.bento-card .value {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.8rem;
  font-weight: 500;
  color: var(--text);
  line-height: 1.1;
}

.bento-card .value.gold {
  background: linear-gradient(135deg, var(--gold), #e2c9a0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Col spans */
.col-span-12 { grid-column: span 12; }
.col-span-8 { grid-column: span 8; }
.col-span-6 { grid-column: span 6; }
.col-span-4 { grid-column: span 4; }
.col-span-3 { grid-column: span 3; }

@media (max-width: 1024px) {
  .col-span-4, .col-span-8, .col-span-3 { grid-column: span 6; }
}
@media (max-width: 768px) {
  .col-span-4, .col-span-8, .col-span-6, .col-span-3 { grid-column: span 12; }
  .bento-card { padding: 20px; border-radius: 16px; }
  .bento-grid { gap: 16px; }
}

/* ─── Sales Graph ───────────────────────────────────────── */
.sales-graph-container {
  height: 200px;
  margin-top: 24px;
  display: flex;
  align-items: flex-end;
  gap: 12px;
  padding-bottom: 24px;
  position: relative;
}

.sales-graph-container::before {
  content: '';
  position: absolute;
  bottom: 24px; left: 0; right: 0;
  height: 1px;
  background: var(--border);
  z-index: 1;
}

.graph-bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  position: relative;
  z-index: 2;
  group;
}

.graph-bar {
  width: 100%;
  max-width: 32px;
  background: linear-gradient(180deg, var(--gold) 0%, rgba(197,168,128,0.1) 100%);
  border-radius: 6px 6px 0 0;
  transition: height 1s cubic-bezier(0.32, 0.72, 0, 1), background 0.3s ease;
  position: relative;
  min-height: 2px;
}

.graph-bar:hover {
  background: linear-gradient(180deg, #d4b991 0%, rgba(197,168,128,0.3) 100%);
  cursor: pointer;
}

.graph-label {
  position: absolute;
  bottom: -24px;
  font-size: 10px;
  color: var(--muted);
  font-family: 'Jost', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.graph-tooltip {
  position: absolute;
  top: -36px;
  background: var(--surface2);
  color: var(--text);
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid var(--border);
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.2s ease;
  pointer-events: none;
  white-space: nowrap;
  box-shadow: var(--shadow);
}

.graph-bar-wrapper:hover .graph-tooltip {
  opacity: 1;
  transform: translateY(0);
}

/* ─── Mini Lists ────────────────────────────────────────── */
.mini-list {
  list-style: none;
  margin-top: 16px;
}

.mini-list li {
  padding: 12px 0;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mini-list li:last-child {
  border-bottom: none;
}

.mini-list .title {
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
}

.mini-list .subtitle {
  font-size: 11px;
  color: var(--muted);
  margin-top: 2px;
}

.mini-list .amount {
  font-family: 'Jost', sans-serif;
  font-weight: 600;
  font-size: 13px;
  color: var(--gold);
}
`;

css = css.replace('/* ─── Page Section Toggle ───────────────────────────────── */', bentoStyles + '\n/* ─── Page Section Toggle ───────────────────────────────── */');

// Remove old stat-grid
css = css.replace(/\.stat-grid \{[\s\S]*?\}\n\.stat-card \{[\s\S]*?\}\n\.stat-card::before \{[\s\S]*?\}\n\.stat-card:hover \{[\s\S]*?\}\n\.stat-card \.label \{[\s\S]*?\}\n\.stat-card \.value \{[\s\S]*?\}/, '');

fs.writeFileSync('assets/css/admin.css', css);
console.log('admin.css patched');


// 2. PATCH KGSADMIN.HTML
let html = fs.readFileSync('kgsadmin.html', 'utf8');

const newDashboardHTML = `
    <!-- ── DASHBOARD ──────────────────────────────────────── -->
    <section id="page-dashboard" class="page-section">
      <div class="page-header">
        <h1>Dashboard</h1>
        <div style="color:var(--muted); font-size:12px; letter-spacing:0.1em; text-transform:uppercase;">Live Overview</div>
      </div>
      
      <div class="bento-grid">
        <!-- Revenue & Graph -->
        <div class="bento-card col-span-8">
          <div class="label"><span class="material-symbols-outlined" style="font-size:16px;">monitoring</span> Revenue (Last 7 Days)</div>
          <div class="value gold" id="stat-revenue">₹0</div>
          <div class="sales-graph-container" id="sales-graph">
            <!-- Bars injected via JS -->
          </div>
        </div>

        <!-- Metric Stack -->
        <div class="bento-card col-span-4" style="display:flex; flex-direction:column; justify-content:space-between; gap:24px;">
          <div>
            <div class="label"><span class="material-symbols-outlined" style="font-size:16px;">receipt_long</span> Total Orders</div>
            <div class="value" id="stat-orders">0</div>
          </div>
          <div>
            <div class="label"><span class="material-symbols-outlined" style="font-size:16px;">pending_actions</span> Pending Fulfillment</div>
            <div class="value" id="stat-pending">0</div>
          </div>
        </div>

        <!-- Recent Orders -->
        <div class="bento-card col-span-6">
          <div class="label"><span class="material-symbols-outlined" style="font-size:16px;">flash_on</span> Recent Orders</div>
          <ul class="mini-list" id="dashboard-recent-orders">
            <li style="color:var(--muted); font-size:12px; font-style:italic;">Loading...</li>
          </ul>
          <button class="btn btn-outline btn-sm" style="margin-top:16px; width:100%; justify-content:center;" onclick="showPage('orders')">View All Orders</button>
        </div>

        <!-- Low Stock Alerts -->
        <div class="bento-card col-span-6">
          <div class="label" style="color:var(--red);"><span class="material-symbols-outlined" style="font-size:16px;">warning</span> Out of Stock Alerts</div>
          <ul class="mini-list" id="dashboard-low-stock">
            <li style="color:var(--muted); font-size:12px; font-style:italic;">Loading...</li>
          </ul>
          <button class="btn btn-outline btn-sm" style="margin-top:16px; width:100%; justify-content:center;" onclick="showPage('products')">Manage Inventory</button>
        </div>
      </div>
    </section>
`;

html = html.replace(/<section id="page-dashboard"[\s\S]*?<\/section>/, newDashboardHTML);

// Fix z-index issue: move sidebar-overlay inside admin-wrap? Or just keep it as is since we removed z-index:1 on admin-wrap.
// Actually, `.admin-mobile-bar` and `.sidebar-overlay` are outside `.admin-wrap`, which is fine now that `.admin-wrap` doesn't trap `.sidebar`.

fs.writeFileSync('kgsadmin.html', html);
console.log('kgsadmin.html patched');


// 3. PATCH ADMIN.JS
let js = fs.readFileSync('assets/js/admin.js', 'utf8');

const newLoadDashboard = `
// ─── DASHBOARD ────────────────────────────────────────────
async function loadDashboard(){
  try {
    // Basic Counts
    const {count:orderCount} = await sb.from('orders').select('*',{count:'exact',head:true});
    const {count:pendingCount} = await sb.from('orders').select('*',{count:'exact',head:true}).in('status', ['placed', 'confirmed']);
    
    // Low Stock Products
    const {data:lowStock} = await sb.from('products').select('id, name, stock_quantity').eq('is_active', true).eq('in_stock', false).limit(4);
    
    // Recent Orders
    const {data:recentOrders} = await sb.from('orders').select('order_number, customer_name, shipping_name, total, created_at, status').order('created_at', {ascending:false}).limit(4);
    
    // Last 7 Days Revenue
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0,0,0,0);
    
    const {data:graphOrders} = await sb.from('orders').select('total, created_at, status').gte('created_at', sevenDaysAgo.toISOString());
    
    let totalRevenue = 0;
    
    // Build Graph Data
    const days = [];
    const maxDate = new Date();
    for(let i=6; i>=0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        label: d.toLocaleDateString('en-US', {weekday:'short'}),
        total: 0
      });
    }

    if(graphOrders) {
      graphOrders.forEach(o => {
        if(o.status !== 'cancelled') {
          totalRevenue += Number(o.total);
          const oDate = new Date(o.created_at).toISOString().split('T')[0];
          const day = days.find(d => d.date === oDate);
          if(day) day.total += Number(o.total);
        }
      });
    }
    
    // Update DOM
    document.getElementById('stat-orders').textContent = orderCount || 0;
    document.getElementById('stat-pending').textContent = pendingCount || 0;
    
    // Animate Revenue counter
    let currentRev = 0;
    const revEl = document.getElementById('stat-revenue');
    const interval = setInterval(() => {
      currentRev += (totalRevenue / 20);
      if(currentRev >= totalRevenue) {
        currentRev = totalRevenue;
        clearInterval(interval);
      }
      revEl.textContent = '₹' + Math.floor(currentRev).toLocaleString('en-IN');
    }, 20);

    // Render Recent Orders
    const recentUl = document.getElementById('dashboard-recent-orders');
    if(recentOrders && recentOrders.length > 0) {
      recentUl.innerHTML = recentOrders.map(o => \`
        <li>
          <div>
            <div class="title">KGS-\${o.order_number}</div>
            <div class="subtitle">\${o.customer_name || o.shipping_name || 'Guest'} • \${new Date(o.created_at).toLocaleDateString()}</div>
          </div>
          <div style="text-align:right">
            <div class="amount">₹\${Number(o.total).toLocaleString('en-IN')}</div>
            <span class="badge \${o.status === 'delivered' ? 'badge-green' : (o.status === 'cancelled' ? 'badge-red' : 'badge-gold')}" style="font-size:9px; padding:2px 6px; margin-top:4px;">\${o.status}</span>
          </div>
        </li>
      \`).join('');
    } else {
      recentUl.innerHTML = '<li style="color:var(--muted); font-size:12px; font-style:italic;">No recent orders</li>';
    }

    // Render Low Stock
    const stockUl = document.getElementById('dashboard-low-stock');
    if(lowStock && lowStock.length > 0) {
      stockUl.innerHTML = lowStock.map(p => \`
        <li>
          <div>
            <div class="title">\${p.name}</div>
            <div class="subtitle" style="color:var(--red)">Out of Stock</div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="showPage('products'); setTimeout(()=>editProduct('\${p.id}'), 100)">Restock</button>
        </li>
      \`).join('');
    } else {
      stockUl.innerHTML = '<li><div><div class="title" style="color:var(--green)">All products in stock</div></div></li>';
    }

    // Render Sales Graph
    const graphContainer = document.getElementById('sales-graph');
    const maxSales = Math.max(...days.map(d => d.total), 1); // Avoid div by 0
    
    graphContainer.innerHTML = days.map((d, index) => {
      const heightPercent = Math.max((d.total / maxSales) * 100, 2);
      return \`
        <div class="graph-bar-wrapper">
          <div class="graph-tooltip">₹\${d.total.toLocaleString('en-IN')}</div>
          <div class="graph-bar" style="height: 0%" data-target-height="\${heightPercent}%"></div>
          <div class="graph-label">\${d.label}</div>
        </div>
      \`;
    }).join('');

    // Trigger graph animation after a short delay
    setTimeout(() => {
      document.querySelectorAll('.graph-bar').forEach(bar => {
        bar.style.height = bar.getAttribute('data-target-height');
      });
    }, 100);

  } catch (err) {
    console.error('Dashboard Load Error:', err);
  }
}
`;

js = js.replace(/\/\/ ─── DASHBOARD ────────────────────────────────────────────[\s\S]*?(?=\/\/ ─── INIT ─────────────────────────────────────────────────)/, newLoadDashboard + '\n');

fs.writeFileSync('assets/js/admin.js', js);
console.log('admin.js patched');

