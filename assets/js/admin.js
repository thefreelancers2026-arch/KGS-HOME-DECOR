/* ═══════════════════════════════════════════════════════════
   KGS Admin Panel — JavaScript
═══════════════════════════════════════════════════════════ */
const SB_URL='https://rgpkomngygapwjhnbgaf.supabase.co';
const SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncGtvbW5neWdhcHdqaG5iZ2FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNjg2MDYsImV4cCI6MjA5Mjk0NDYwNn0.1996CFXZp-QdQK8I4l2GoJDyqYPQU3OrmJ7-03DtMCE';
let sb;
function initSB(){sb=supabase.createClient(SB_URL,SB_KEY);return sb;}

// ─── AUTH ─────────────────────────────────────────────────
async function adminLogin(email,password){
  const{data,error}=await sb.auth.signInWithPassword({email,password});
  if(error)throw error;
  const{data:isAdmin}=await sb.rpc('check_is_admin',{check_email:email});
  if(!isAdmin){await sb.auth.signOut();throw new Error('Not an admin account');}
  return data;
}

async function checkAuth(){
  const{data:{session}}=await sb.auth.getSession();
  if(!session){showLogin();return false;}
  const{data:isAdmin}=await sb.rpc('check_is_admin',{check_email:session.user.email});
  if(!isAdmin){showLogin();return false;}
  document.getElementById('login-screen').style.display='none';
  document.getElementById('admin-app').style.display='flex';
  document.getElementById('admin-email').textContent=session.user.email;
  return true;
}

function showLogin(){
  document.getElementById('login-screen').style.display='flex';
  document.getElementById('admin-app').style.display='none';
}

async function handleLogout(){await sb.auth.signOut();showLogin();}

// ─── TOAST ────────────────────────────────────────────────
function toast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3000);
}

// ─── NAVIGATION ───────────────────────────────────────────
let currentPage='products';
function showPage(page){
  currentPage=page;
  document.querySelectorAll('.page-section').forEach(s=>s.style.display='none');
  document.getElementById('page-'+page).style.display='block';
  document.querySelectorAll('.sidebar nav a').forEach(a=>{
    a.classList.toggle('active',a.dataset.page===page);
  });
  if(page==='products')loadProducts();
  if(page==='orders')loadOrders();
  if(page==='dashboard')loadDashboard();
}

// ─── PRODUCTS ─────────────────────────────────────────────
let allProducts=[];
let currentProductPage=0;
const productsPerPage=50;
let currentSearch=null;

async function loadProducts(search=null){
  if(search!==null){currentSearch=search;currentProductPage=0;}
  const tbody=document.getElementById('products-tbody');
  tbody.innerHTML='<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--muted)">Loading...</td></tr>';
  
  const from=currentProductPage*productsPerPage;
  const to=from+productsPerPage-1;
  
  let q=sb.from('products').select('*',{count:'exact'}).order('created_at',{ascending:false});
  if(currentSearch)q=q.ilike('name','%'+currentSearch+'%');
  const{data,error,count}=await q.range(from,to);
  if(error){toast('Error: '+error.message);return;}
  allProducts=data||[];
  document.getElementById('product-count').textContent=count||0;
  
  // Pagination UI
  document.getElementById('page-start').textContent=count>0?from+1:0;
  document.getElementById('page-end').textContent=Math.min(to+1,count||0);
  document.getElementById('page-total').textContent=count||0;
  document.getElementById('btn-prev').disabled=currentProductPage===0;
  document.getElementById('btn-next').disabled=(to+1)>=(count||0);
  
  if(!allProducts.length){
    tbody.innerHTML='<tr><td colspan="7"><div class="empty-state"><span class="material-symbols-outlined">inventory_2</span><p>No products yet. Add your first product!</p></div></td></tr>';
    return;
  }
  tbody.innerHTML=allProducts.map(p=>`
    <tr>
      <td><img src="${p.image_url||''}" alt="" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22><rect fill=%22%23242424%22 width=%2248%22 height=%2248%22/></svg>'"></td>
      <td><strong>${p.name}</strong><br><span style="color:var(--muted);font-size:11px">${p.handle}</span></td>
      <td>${p.category}</td>
      <td style="font-weight:600;color:var(--gold)">₹${Number(p.price).toLocaleString('en-IN')}</td>
      <td>${p.in_stock?'<span class="badge badge-green">In Stock</span>':'<span class="badge badge-red">Out</span>'}</td>
      <td>${p.stock_quantity||0}</td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="editProduct('${p.id}')">Edit</button>
        <button class="btn btn-red btn-sm" onclick="deleteProduct('${p.id}','${p.name.replace(/'/g,"\\'")}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function changePage(delta){
  currentProductPage+=delta;
  loadProducts(null);
}

function openAddProduct(){
  document.getElementById('modal-title').textContent='Add Product';
  document.getElementById('product-form').reset();
  document.getElementById('edit-id').value='';
  document.getElementById('img-preview').innerHTML='';
  document.getElementById('product-modal').classList.add('active');
}

async function editProduct(id){
  const p=allProducts.find(x=>x.id===id);
  if(!p)return;
  document.getElementById('modal-title').textContent='Edit Product';
  document.getElementById('edit-id').value=p.id;
  document.getElementById('f-name').value=p.name;
  document.getElementById('f-handle').value=p.handle;
  document.getElementById('f-category').value=p.category;
  document.getElementById('f-price').value=p.price;
  document.getElementById('f-compare').value=p.compare_at_price||'';
  document.getElementById('f-stock').value=p.stock_quantity||0;
  document.getElementById('f-material').value=p.material||'';
  document.getElementById('f-desc').value=p.description||'';
  document.querySelectorAll('.f-tag').forEach(cb=>{cb.checked=(p.tags||[]).includes(cb.value);});
  
  // Extract custom specifications (tags with colons)
  const specs = (p.tags||[]).filter(t => t.includes(':'));
  const specsInput = document.getElementById('f-specs');
  if (specsInput) specsInput.value = specs.join('\n');

  document.getElementById('f-instock').checked=p.in_stock;
  const prev=document.getElementById('img-preview');
  prev.innerHTML='';
  const imgs = p.images && p.images.length ? p.images : (p.image_url ? [p.image_url] : []);
  imgs.forEach(url => {
    prev.innerHTML += `<img src="${url}" style="width:60px;height:60px;object-fit:cover;border-radius:4px;">`;
  });
  document.getElementById('product-modal').classList.add('active');
}

async function saveProduct(e){
  e.preventDefault();
  const id=document.getElementById('edit-id').value;
  const fileInput=document.getElementById('f-image');
  let imageUrl=null;
  let imageUrls=[];
  // Upload images if selected
  if(fileInput.files.length){
    for (let i = 0; i < fileInput.files.length; i++) {
      const file = fileInput.files[i];
      const fname=`products/${Date.now()}_${i}_${file.name.replace(/\s/g,'_')}`;
      const{error:upErr}=await sb.storage.from('product-images').upload(fname,file);
      if(upErr){toast('Image upload failed: '+upErr.message);return;}
      const{data:urlData}=sb.storage.from('product-images').getPublicUrl(fname);
      imageUrls.push(urlData.publicUrl);
    }
    if (imageUrls.length > 0) {
      imageUrl = imageUrls[0];
    }
  }
  const name=document.getElementById('f-name').value.trim();
  
  // Parse specifications
  const specLines = document.getElementById('f-specs').value.split('\n')
                      .filter(l => l.trim().includes(':'))
                      .map(l => l.trim());
  const checkboxTags = [...document.querySelectorAll('.f-tag:checked')].map(cb=>cb.value);

  const product={
    name,
    handle:document.getElementById('f-handle').value.trim()||name.toLowerCase().replace(/[^a-z0-9]+/g,'-'),
    category:document.getElementById('f-category').value,
    price:parseFloat(document.getElementById('f-price').value),
    compare_at_price:parseFloat(document.getElementById('f-compare').value)||null,
    stock_quantity:parseInt(document.getElementById('f-stock').value)||0,
    material:document.getElementById('f-material').value.trim()||null,
    description:document.getElementById('f-desc').value.trim(),
    tags: [...checkboxTags, ...specLines],
    in_stock:document.getElementById('f-instock').checked,
    is_active:true,
  };
  if(imageUrl) product.image_url=imageUrl;
  if(imageUrls.length > 0) product.images=imageUrls;
  try{
    if(id){
      const p = allProducts.find(x=>x.id===id);
      if(p && imageUrls.length > 0) {
        product.images = [...(p.images || []), ...imageUrls];
      }
      const{error}=await sb.from('products').update(product).eq('id',id);
      if(error)throw error;
      toast('Product updated!');
    }else{
      if(!imageUrl){toast('Please upload an image');return;}
      const{error}=await sb.from('products').insert(product);
      if(error)throw error;
      toast('Product added!');
    }
    closeModal();loadProducts();
  }catch(err){toast('Error: '+err.message);}
}

async function deleteProduct(id,name){
  if(!confirm(`Delete "${name}"?`))return;
  const{error}=await sb.from('products').update({is_active:false}).eq('id',id);
  if(error){toast('Error: '+error.message);return;}
  toast('Product deleted');loadProducts();
}

function closeModal(){document.getElementById('product-modal').classList.remove('active');}

// Auto-generate handle from name
function autoHandle(){
  const name=document.getElementById('f-name').value;
  const handle=document.getElementById('f-handle');
  if(!handle.value||handle.dataset.auto==='true'){
    handle.value=name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    handle.dataset.auto='true';
  }
}

// ─── ORDERS ───────────────────────────────────────────────
let currentOrderPage=0;
const ordersPerPage=50;

async function loadOrders(){
  const tbody=document.getElementById('orders-tbody');
  tbody.innerHTML='<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--muted)">Loading...</td></tr>';
  
  const from=currentOrderPage*ordersPerPage;
  const to=from+ordersPerPage-1;
  const{data,error,count}=await sb.from('orders').select('*,order_items(*)',{count:'exact'}).order('created_at',{ascending:false}).range(from,to);
  if(error){toast('Error: '+error.message);return;}
  
  // Pagination UI
  document.getElementById('order-page-start').textContent=count>0?from+1:0;
  document.getElementById('order-page-end').textContent=Math.min(to+1,count||0);
  document.getElementById('order-page-total').textContent=count||0;
  document.getElementById('btn-order-prev').disabled=currentOrderPage===0;
  document.getElementById('btn-order-next').disabled=(to+1)>=(count||0);

  if(!data||!data.length){
    tbody.innerHTML='<tr><td colspan="6"><div class="empty-state"><span class="material-symbols-outlined">receipt_long</span><p>No orders yet</p></div></td></tr>';
    return;
  }
  const statusBadge=s=>({placed:'badge-gold',confirmed:'badge-gold',packed:'badge-gold',shipped:'badge-green',delivered:'badge-green',cancelled:'badge-red'}[s]||'badge-gold');
  tbody.innerHTML=data.map(o=>`
    <tr>
      <td><strong>KGS-${o.order_number}</strong></td>
      <td>${o.customer_name||o.shipping_name||'—'}<br><span style="color:var(--muted);font-size:11px">${o.customer_phone||o.shipping_phone||''}</span></td>
      <td style="font-weight:600;color:var(--gold)">₹${Number(o.total).toLocaleString('en-IN')}</td>
      <td><span class="badge ${statusBadge(o.status)}">${o.status}</span></td>
      <td>${(o.payment_method||'cod').toUpperCase()}</td>
      <td>
        <select onchange="updateOrderStatus('${o.id}',this.value)" style="background:var(--surface2);border:1px solid var(--border);color:var(--text);padding:4px 8px;border-radius:4px;font-size:12px">
          ${['placed','confirmed','packed','shipped','delivered','cancelled'].map(s=>`<option value="${s}"${o.status===s?' selected':''}>${s}</option>`).join('')}
        </select>
      </td>
    </tr>
  `).join('');
}

function changeOrderPage(delta){
  currentOrderPage+=delta;
  loadOrders();
}

async function updateOrderStatus(id,status){
  const{error}=await sb.from('orders').update({status}).eq('id',id);
  if(error)toast('Error: '+error.message);
  else toast('Order status updated to: '+status);
}


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
    
    // Last 7 Days Revenue (Total)
    // We fetch last 30 days upfront so we can render either 7 or 30
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    thirtyDaysAgo.setHours(0,0,0,0);
    
    const {data:graphOrders} = await sb.from('orders').select('total, created_at, status').gte('created_at', thirtyDaysAgo.toISOString());
    window.allGraphOrders = graphOrders || []; // cache for the toggle
    
    let totalRevenue7Days = 0;
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0,0,0,0);

    if(graphOrders) {
      graphOrders.forEach(o => {
        if(o.status !== 'cancelled' && new Date(o.created_at) >= sevenDaysAgo) {
          totalRevenue7Days += Number(o.total);
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
      currentRev += (totalRevenue7Days / 20);
      if(currentRev >= totalRevenue7Days) {
        currentRev = totalRevenue7Days;
        clearInterval(interval);
      }
      revEl.textContent = '₹' + Math.floor(currentRev).toLocaleString('en-IN');
    }, 20);

    // Render Recent Orders
    const recentUl = document.getElementById('dashboard-recent-orders');
    if(recentOrders && recentOrders.length > 0) {
      recentUl.innerHTML = recentOrders.map(o => `
        <li>
          <div>
            <div class="title">KGS-${o.order_number}</div>
            <div class="subtitle">${o.customer_name || o.shipping_name || 'Guest'} • ${new Date(o.created_at).toLocaleDateString()}</div>
          </div>
          <div style="text-align:right">
            <div class="amount">₹${Number(o.total).toLocaleString('en-IN')}</div>
            <span class="badge ${o.status === 'delivered' ? 'badge-green' : (o.status === 'cancelled' ? 'badge-red' : 'badge-gold')}" style="font-size:9px; padding:2px 6px; margin-top:4px;">${o.status}</span>
          </div>
        </li>
      `).join('');
    } else {
      recentUl.innerHTML = '<li style="color:var(--muted); font-size:12px; font-style:italic;">No recent orders</li>';
    }

    // Render Low Stock
    const stockUl = document.getElementById('dashboard-low-stock');
    if(lowStock && lowStock.length > 0) {
      stockUl.innerHTML = lowStock.map(p => `
        <li>
          <div>
            <div class="title">${p.name}</div>
            <div class="subtitle" style="color:var(--red)">Out of Stock</div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="showPage('products'); setTimeout(()=>editProduct('${p.id}'), 100)">Restock</button>
        </li>
      `).join('');
    } else {
      stockUl.innerHTML = '<li><div><div class="title" style="color:var(--green)">All products in stock</div></div></li>';
    }

    // Initial Graph Render
    renderSalesGraph(7);

  } catch (err) {
    console.error('Dashboard Load Error:', err);
  }
}

function renderSalesGraph(numDays) {
  const graphContainer = document.getElementById('sales-graph');
  const revEl = document.getElementById('stat-revenue');
  const graphOrders = window.allGraphOrders || [];
  
  const days = [];
  for(let i = numDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      date: d.toISOString().split('T')[0],
      label: numDays <= 7 ? d.toLocaleDateString('en-US', {weekday:'short'}) : d.getDate(),
      total: 0
    });
  }

  let totalRevenue = 0;
  graphOrders.forEach(o => {
    if(o.status !== 'cancelled') {
      const oDate = new Date(o.created_at).toISOString().split('T')[0];
      const day = days.find(d => d.date === oDate);
      if(day) {
        day.total += Number(o.total);
        totalRevenue += Number(o.total);
      }
    }
  });

  // Update total revenue immediately if switching timeframe
  revEl.textContent = '₹' + Math.floor(totalRevenue).toLocaleString('en-IN');

  const maxSales = Math.max(...days.map(d => d.total), 1);
  
  // For 30 days, make bars thinner
  const barMaxWidth = numDays > 7 ? '12px' : '32px';

  graphContainer.innerHTML = days.map((d, index) => {
    const heightPercent = Math.max((d.total / maxSales) * 100, 2);
    // Show label every 3 days if 30 days, or all if 7 days
    const showLabel = numDays <= 7 || index % 3 === 0;
    return `
      <div class="graph-bar-wrapper">
        <div class="graph-tooltip">₹${d.total.toLocaleString('en-IN')}</div>
        <div class="graph-bar" style="height: 0%; max-width: ${barMaxWidth}" data-target-height="${heightPercent}%"></div>
        <div class="graph-label">${showLabel ? d.label : ''}</div>
      </div>
    `;
  }).join('');

  setTimeout(() => {
    document.querySelectorAll('.graph-bar').forEach(bar => {
      bar.style.height = bar.getAttribute('data-target-height');
    });
  }, 50);
}

// ─── INIT ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',async()=>{
  initSB();
  const ok=await checkAuth();
  if(ok)showPage('dashboard');
});


/* ─── REVIEWS ───────────────────────────────────────────── */

async function loadAdminReviews() {
  const tbody = document.getElementById('reviews-tbody');
  tbody.innerHTML = '<tr><td colspan="5" style="text-align:center">Loading reviews...</td></tr>';
  const status = document.getElementById('review-filter').value;
  
  try {
    const reviews = await adminGetStoreReviews({ status });
    if (reviews.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--muted)">No ' + status + ' reviews found.</td></tr>';
      return;
    }
    
    tbody.innerHTML = reviews.map(r => `
      <tr>
        <td style="font-size:12px;color:var(--muted)">${new Date(r.created_at).toLocaleDateString()}</td>
        <td style="font-weight:600">${r.guest_name}</td>
        <td style="color:var(--gold)">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</td>
        <td style="max-width:300px;font-style:italic;font-size:13px;line-height:1.4">"${r.review_text}"</td>
        <td>
          <div style="display:flex;gap:8px">
            ${status === 'pending' ? `<button class="btn btn-outline btn-sm" style="color:green;border-color:green" onclick="approveReview('${r.id}')">Approve</button>` : ''}
            <button class="btn btn-outline btn-sm" style="color:red;border-color:red" onclick="deleteReview('${r.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch(err) {
    console.error(err);
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:red">Error loading reviews</td></tr>';
  }
}

async function approveReview(id) {
  try {
    await adminApproveStoreReview(id);
    showToast('Review approved successfully!');
    loadAdminReviews();
  } catch(err) {
    showToast('Failed to approve review');
  }
}

async function deleteReview(id) {
  if(!confirm('Are you sure you want to delete this review?')) return;
  try {
    await adminDeleteStoreReview(id);
    showToast('Review deleted');
    loadAdminReviews();
  } catch(err) {
    showToast('Failed to delete review');
  }
}
