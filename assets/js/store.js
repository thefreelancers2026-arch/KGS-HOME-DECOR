/* ═══════════════════════════════════════════════════════════
   KGS Home Décors — Unified Store (Cart + Wishlist)
   Single source of truth for all localStorage state.
═══════════════════════════════════════════════════════════ */

let GLOBAL_PRODUCTS = [];

async function initStore() {
  if (GLOBAL_PRODUCTS.length > 0) return GLOBAL_PRODUCTS;
  try {
    const response = await fetch('assets/products.json');
    GLOBAL_PRODUCTS = await response.json();
    return GLOBAL_PRODUCTS;
  } catch (e) {
    console.error('Store init failed:', e);
    return [];
  }
}

/* ─── CART ────────────────────────────────────────────── */
function getCart() {
  try { return JSON.parse(localStorage.getItem('kgs_cart')) || []; }
  catch(e) { return []; }
}
function saveCart(cart) {
  localStorage.setItem('kgs_cart', JSON.stringify(cart));
}

function addToCart(productId, quantity) {
  quantity = quantity || 1;
  // Use already-cached products (populated by initStore on page load)
  const product = GLOBAL_PRODUCTS.find(function(p){ return p.id === productId; });
  if (!product) {
    console.warn('addToCart: product not found in cache for id:', productId);
    return;
  }
  
  const cart = getCart();
  const idx = cart.findIndex(function(i){ return i.id === productId; });
  if (idx > -1) {
    cart[idx].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: quantity
    });
  }
  saveCart(cart);
  updateCartBadge();
  
  /* toast */
  const toast = document.getElementById('cart-toast');
  if (toast) {
    const txt = document.getElementById('toast-text');
    if (txt) txt.innerText = 'Added ' + product.name + ' to cart';
    toast.classList.add('show');
    setTimeout(function(){ toast.classList.remove('show'); }, 3000);
  }
}
function removeFromCart(productId) {
  saveCart(getCart().filter(function(i){ return i.id !== productId; }));
  updateCartBadge();
}
function updateQty(productId, qty) {
  let cart = getCart();
  if (qty <= 0) {
    cart = cart.filter(function(i){ return i.id !== productId; });
  } else {
    const item = cart.find(function(i){ return i.id === productId; });
    if (item) item.quantity = qty;
  }
  saveCart(cart);
}
function getCartCount() {
  return getCart().reduce(function(t, i){ return t + (Number(i.quantity) || 0); }, 0);
}
function getCartTotal() {
  return getCart().reduce(function(t, i){
    const price = typeof i.price === 'number' && !isNaN(i.price) ? i.price : 0;
    return t + (price * (Number(i.quantity) || 0));
  }, 0);
}
function clearCart() {
  localStorage.removeItem('kgs_cart');
  updateCartBadge();
}
function updateCartBadge() {
  const count = getCartCount();
  document.querySelectorAll('.cart-count').forEach(function(el){
    el.textContent = count;
    el.style.display = count > 0 ? 'inline-flex' : 'none';
  });
}

/* ─── WISHLIST ────────────────────────────────────────── */
function getWishlist() {
  try { return JSON.parse(localStorage.getItem('kgs_wishlist')) || []; }
  catch(e) { return []; }
}
function saveWishlist(list) {
  localStorage.setItem('kgs_wishlist', JSON.stringify(list));
}
function toggleWishlist(productId) {
  let list = getWishlist();
  if (list.indexOf(productId) > -1) {
    list = list.filter(function(id){ return id !== productId; });
  } else {
    list.push(productId);
  }
  saveWishlist(list);
  updateWishlistBadge();
  updateHeartIcons();
}
function isWishlisted(productId) {
  return getWishlist().indexOf(productId) > -1;
}
function updateWishlistBadge() {
  const count = getWishlist().length;
  document.querySelectorAll('.wishlist-count').forEach(function(el){
    el.textContent = count;
    el.style.display = count > 0 ? 'inline-flex' : 'none';
  });
}
function updateHeartIcons() {
  document.querySelectorAll('[data-product-id]').forEach(function(btn){
    if (!btn.classList.contains('heart-btn')) return;
    const id = btn.getAttribute('data-product-id');
    if (isWishlisted(id)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}
