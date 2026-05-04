const fs = require('fs');

// PATCH kgsadmin.html
let adminHtml = fs.readFileSync('kgsadmin.html', 'utf8');

// Add Sidebar Link
adminHtml = adminHtml.replace(
  '<a href="#" data-page="orders" onclick="showPage(\'orders\')">',
  `<a href="#" data-page="reviews" onclick="showPage('reviews')">
        <span class="material-symbols-outlined" style="font-size:20px">rate_review</span> Reviews
      </a>
      <a href="#" data-page="orders" onclick="showPage('orders')">`
);

// Add Reviews Section
const reviewsSection = `
    <!-- ── REVIEWS ────────────────────────────────────────── -->
    <section id="page-reviews" class="page-section" style="display:none">
      <div class="page-header">
        <h1>Store Reviews</h1>
        <div style="display:flex;gap:12px">
          <select id="review-filter" onchange="loadAdminReviews()" style="padding:8px; border-radius:4px; border:1px solid var(--border)">
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved</option>
          </select>
        </div>
      </div>
      <table class="data-table">
        <thead>
          <tr><th>Date</th><th>Name</th><th>Rating</th><th>Review Text</th><th>Actions</th></tr>
        </thead>
        <tbody id="reviews-tbody"></tbody>
      </table>
    </section>
`;

adminHtml = adminHtml.replace('<!-- ── ORDERS ─────────────────────────────────────────── -->', reviewsSection + '\n    <!-- ── ORDERS ─────────────────────────────────────────── -->');

fs.writeFileSync('kgsadmin.html', adminHtml);
console.log('kgsadmin.html patched');


// PATCH assets/js/admin.js
let adminJs = fs.readFileSync('assets/js/admin.js', 'utf8');

// Add to showPage function
adminJs = adminJs.replace(
  "if (pageId === 'orders') loadOrders();",
  "if (pageId === 'orders') loadOrders();\n  if (pageId === 'reviews') loadAdminReviews();"
);

// Add review functions to the end
const reviewFunctions = `
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
    
    tbody.innerHTML = reviews.map(r => \`
      <tr>
        <td style="font-size:12px;color:var(--muted)">\${new Date(r.created_at).toLocaleDateString()}</td>
        <td style="font-weight:600">\${r.guest_name}</td>
        <td style="color:var(--gold)">\${'★'.repeat(r.rating)}\${'☆'.repeat(5-r.rating)}</td>
        <td style="max-width:300px;font-style:italic;font-size:13px;line-height:1.4">"\${r.review_text}"</td>
        <td>
          <div style="display:flex;gap:8px">
            \${status === 'pending' ? \`<button class="btn btn-outline btn-sm" style="color:green;border-color:green" onclick="approveReview('\${r.id}')">Approve</button>\` : ''}
            <button class="btn btn-outline btn-sm" style="color:red;border-color:red" onclick="deleteReview('\${r.id}')">Delete</button>
          </div>
        </td>
      </tr>
    \`).join('');
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
`;

fs.writeFileSync('assets/js/admin.js', adminJs + '\n' + reviewFunctions);
console.log('admin.js patched');

