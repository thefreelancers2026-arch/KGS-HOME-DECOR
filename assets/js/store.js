/* ═══════════════════════════════════════════════════════════
   KGS Home Décors — Unified Store (Cart + Wishlist)
   Single source of truth for all localStorage state.
   Product data is embedded inline — no fetch required.
═══════════════════════════════════════════════════════════ */

const GLOBAL_PRODUCTS = [
  // Furniture
  { id: "sofa-3seater", parentCategory: "furniture", category: "sofas", name: "Premium 3-Seater Sofa", price: 18500, originalPrice: 22000, image: "assets/images/sofa.jpg", badge: "Best Seller", description: "Handcrafted from premium teak wood with soft linen-blend upholstery.", specs: { Material: "Premium Teak Wood", Seating: "3-Seater", Upholstery: "Soft Linen Blend" }, whatsappText: "Hi, I'm interested in Premium 3-Seater Sofa - ₹18,500" },
  { id: "chair-velvet", parentCategory: "furniture", category: "chairs", name: "Velvet Accent Chair", price: 8500, originalPrice: 10000, image: "assets/images/chairs.png", badge: "New", description: "Dark luxury velvet accent chair for moody living rooms.", specs: { Material: "Velvet & Metal", Seating: "1-Seater", Color: "Dark Teal" }, whatsappText: "Hi, I'm interested in Velvet Accent Chair - ₹8,500" },
  { id: "table-marble", parentCategory: "furniture", category: "table", name: "Marble Coffee Table", price: 12500, originalPrice: 15000, image: "assets/images/table.png", badge: null, description: "Minimalist dark wood and marble coffee table.", specs: { Material: "Marble & Dark Wood", Shape: "Round", Assembly: "Required" }, whatsappText: "Hi, I'm interested in Marble Coffee Table - ₹12,500" },
  { id: "locker-safe", parentCategory: "furniture", category: "lockers", name: "Premium Safe Locker", price: 21000, originalPrice: null, image: "assets/images/locker.png", badge: "Popular", description: "Modern minimalist steel and wood safe locker.", specs: { Material: "Steel & Wood", Lock: "Digital + Key", Capacity: "40L" }, whatsappText: "Hi, I'm interested in Premium Safe Locker - ₹21,000" },
  { id: "bed-combo", parentCategory: "furniture", category: "premium-bed-combo", name: "King Size Bed Combo", price: 45000, originalPrice: 52000, image: "assets/images/bed_combo.png", badge: "Premium", description: "King size bed with tufted headboard and matching side tables.", specs: { Material: "Engineered Wood", Size: "King Size", Includes: "Bed + 2 Side Tables" }, whatsappText: "Hi, I'm interested in King Size Bed Combo - ₹45,000" },

  // Décor
  { id: "fountain-tabletop", parentCategory: "decor", category: "water-fountain", name: "Indoor Tabletop Fountain", price: 2850, originalPrice: null, image: "assets/images/fountain.jpg", badge: "Staff Pick", description: "Peaceful tabletop water fountain for home or office.", specs: { Type: "Tabletop", Power: "USB / Adapter", Material: "Resin" }, whatsappText: "Hi, I'm interested in Indoor Tabletop Fountain - ₹2,850" },
  { id: "statue-marble", parentCategory: "decor", category: "statue", name: "Abstract Marble Statue", price: 4500, originalPrice: null, image: "assets/images/statue.png", badge: "New", description: "Premium dark luxury marble abstract art piece.", specs: { Material: "Marble", Finish: "Matte", Size: "14 inches" }, whatsappText: "Hi, I'm interested in Abstract Marble Statue - ₹4,500" },
  { id: "clock-brass", parentCategory: "decor", category: "wall-clocks", name: "Antique Brass Wall Clock", price: 1299, originalPrice: null, image: "assets/images/clock.jpg", badge: null, description: "Elegant antique brass finish wall clock.", specs: { Finish: "Antique Brass", Diameter: "14 inches", Movement: "Quartz" }, whatsappText: "Hi, I'm interested in Antique Brass Wall Clock - ₹1,299" },
  { id: "frame-photo", parentCategory: "decor", category: "photo-frames", name: "Decorative Photo Frame Set", price: 749, originalPrice: null, image: "assets/images/frames.jpg", badge: null, description: "Set of 3 decorative photo frames.", specs: { Quantity: "3 frames", Material: "Wood + Glass", Finish: "Mixed" }, whatsappText: "Hi, I'm interested in Photo Frame Set - ₹749" },
  { id: "vase-ceramic", parentCategory: "decor", category: "flower-vase", name: "Designer Ceramic Vase", price: 1950, originalPrice: null, image: "assets/images/ceramic_vase.png", badge: "New", description: "Hand-painted designer ceramic vase.", specs: { Material: "Ceramic", Height: "10 inches", Use: "Decorative" }, whatsappText: "Hi, I'm interested in Designer Ceramic Vase - ₹1,950" },
  { id: "horse-statue", parentCategory: "decor", category: "horse", name: "Metallic Horse Statue", price: 5200, originalPrice: null, image: "assets/images/horse.png", badge: "Premium", description: "Metallic horse head statue on a marble base.", specs: { Material: "Metal & Marble", Finish: "Antique Gold", Height: "16 inches" }, whatsappText: "Hi, I'm interested in Metallic Horse Statue - ₹5,200" },
  { id: "decor-tray", parentCategory: "decor", category: "accessories", name: "Marble & Brass Decor Tray", price: 2100, originalPrice: null, image: "assets/images/accessories.png", badge: null, description: "Decorative tray for small accessories.", specs: { Material: "Marble & Brass", Size: "12x8 inches", Use: "Vanity / Table" }, whatsappText: "Hi, I'm interested in Marble & Brass Decor Tray - ₹2,100" },

  // Lighting
  { id: "light-pendant", parentCategory: "lighting", category: "ceiling-lights", name: "Pendant Ceiling Light", price: 2400, originalPrice: null, image: "assets/images/lighting.jpg", badge: null, description: "Decorative pendant ceiling light.", specs: { Type: "Pendant", Bulb: "E27 (not included)", Shade: "Metal" }, whatsappText: "Hi, I'm interested in Pendant Ceiling Light - ₹2,400" },
  { id: "mirror-led", parentCategory: "lighting", category: "led-mirror", name: "Circular LED Wall Mirror", price: 6800, originalPrice: null, image: "assets/images/led_mirror.png", badge: "New", description: "Modern circular LED backlit wall mirror.", specs: { Diameter: "24 inches", Light: "Warm White", Power: "Plug-in" }, whatsappText: "Hi, I'm interested in Circular LED Wall Mirror - ₹6,800" },

  // Botanicals
  { id: "plant-banana", parentCategory: "botanicals", category: "artificial-plants", name: "Large Artificial Banana Plant", price: 3200, originalPrice: null, image: "assets/images/plant.png", badge: "Popular", description: "Lifelike large artificial banana plant.", specs: { Height: "5 feet", Type: "Artificial", Pot: "Included" }, whatsappText: "Hi, I'm interested in Artificial Banana Plant - ₹3,200" },

  // Gifting
  { id: "candle-gift", parentCategory: "gifting", category: "gifts", name: "Aromatic Candle Gift Set", price: 899, originalPrice: null, image: "assets/images/candle_set.png", badge: "New", description: "Premium aromatic candle gift set with 3 fragrances.", specs: { Quantity: "3 candles", Fragrance: "Rose, Jasmine, Sandalwood", Wax: "Soy blend" }, whatsappText: "Hi, I'm interested in Aromatic Candle Gift Set - ₹899" }
];

function initStore() {
  // Data is already loaded inline — return immediately (kept async-compatible with Promise)
  return Promise.resolve(GLOBAL_PRODUCTS);
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
