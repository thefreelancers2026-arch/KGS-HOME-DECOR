/* ═══════════════════════════════════════════════════════════
   KGS Home Décors — Unified Store (Cart + Wishlist)
   Single source of truth for all localStorage state.
   Product data is embedded inline — no fetch required.
═══════════════════════════════════════════════════════════ */

const GLOBAL_PRODUCTS = [
  { id: "sofa-3seater",     name: "Premium 3-Seater Sofa",       category: "sofas",         price: 18500, originalPrice: 22000, image: "assets/images/sofa.jpg",               badge: "Best Seller",  description: "Handcrafted from premium teak wood with soft linen-blend upholstery. Designed for Indian living rooms — spacious, durable, and elegant. Arrives fully assembled with free delivery inside Virudhachalam.", specs: { Material: "Premium Teak Wood", Seating: "3-Seater", Upholstery: "Soft Linen Blend", Assembly: "Fully Assembled" }, whatsappText: "Hi, I'm interested in Premium 3-Seater Sofa - ₹18,500" },
  { id: "clock-brass",      name: "Antique Brass Wall Clock",    category: "wall-clocks",   price:  1299, originalPrice: null,  image: "assets/images/clock.jpg",              badge: "New",          description: "Elegant antique brass finish wall clock. A statement piece for any living room or hallway.", specs: { Finish: "Antique Brass", Diameter: "14 inches", Movement: "Quartz", Battery: "AA x1" }, whatsappText: "Hi, I'm interested in Antique Brass Wall Clock - ₹1,299" },
  { id: "fountain-tabletop",name: "Indoor Tabletop Fountain",    category: "fountains",     price:  2850, originalPrice: null,  image: "assets/images/fountain.jpg",           badge: "Staff Pick",   description: "Peaceful tabletop water fountain for home or office. Creates a calming ambiance with the gentle sound of flowing water.", specs: { Type: "Tabletop", Power: "USB / Adapter", Material: "Resin", Size: "Medium" }, whatsappText: "Hi, I'm interested in Indoor Tabletop Fountain - ₹2,850" },
  { id: "wall-art-botanical",name:"Botanical Wall Art Panel",    category: "wall-art",      price:  1850, originalPrice: null,  image: "assets/images/wall_decor.jpg",         badge: null,           description: "Premium botanical wall art panel. Adds a natural, earthy touch to any wall.", specs: { Material: "MDF + Print", Size: "18x24 inches", Finish: "Matte", Hanging: "Included" }, whatsappText: "Hi, I'm interested in Botanical Wall Art Panel - ₹1,850" },
  { id: "plant-banana",     name: "Large Artificial Banana Plant",category:"plants",         price:  3200, originalPrice: null,  image: "assets/images/plant.png",              badge: "Popular",      description: "Lifelike large artificial banana plant. Zero maintenance, maximum visual impact for living rooms and offices.", specs: { Height: "5 feet", Type: "Artificial", Pot: "Included", Maintenance: "Zero" }, whatsappText: "Hi, I'm interested in Large Artificial Banana Plant - ₹3,200" },
  { id: "clock-vintage",    name: "Vintage Round Wall Clock",    category: "wall-clocks",   price:   899, originalPrice: null,  image: "assets/images/clock.jpg",              badge: null,           description: "Classic vintage round wall clock with a distressed finish. Perfect for rustic and modern interiors.", specs: { Finish: "Vintage Distressed", Diameter: "12 inches", Movement: "Quartz", Battery: "AA x1" }, whatsappText: "Hi, I'm interested in Vintage Round Wall Clock - ₹899" },
  { id: "wall-art-mandala", name: "Mandala Metal Wall Art",      category: "wall-art",      price:  1450, originalPrice: null,  image: "assets/images/wall_decor.jpg",         badge: "New",          description: "Intricate mandala design in powder-coated metal. A bold statement piece for feature walls.", specs: { Material: "Iron", Finish: "Powder Coated", Size: "24 inches", Hanging: "Included" }, whatsappText: "Hi, I'm interested in Mandala Metal Wall Art - ₹1,450" },
  { id: "light-pendant",    name: "Pendant Ceiling Light",       category: "led-lights",    price:  2400, originalPrice: null,  image: "assets/images/lighting.jpg",           badge: null,           description: "Decorative pendant ceiling light. Adds warm ambient lighting to dining rooms and living spaces.", specs: { Type: "Pendant", Bulb: "E27 (not included)", Shade: "Metal", Wire: "1.5m adjustable" }, whatsappText: "Hi, I'm interested in Pendant Ceiling Light - ₹2,400" },
  { id: "vase-ceramic",     name: "Designer Ceramic Vase",       category: "gift-items",    price:  1950, originalPrice: null,  image: "assets/images/ceramic_vase.png",       badge: "New",          description: "Hand-painted designer ceramic vase. A perfect gifting option and décor accent.", specs: { Material: "Ceramic", Height: "10 inches", Finish: "Hand-painted", Use: "Decorative" }, whatsappText: "Hi, I'm interested in Designer Ceramic Vase - ₹1,950" },
  { id: "shelf-geometric",  name: "Geometric Wall Shelf",        category: "wall-art",      price:  2750, originalPrice: null,  image: "assets/images/wall_shelf.png",         badge: "New",          description: "Modern geometric wall shelf for displaying décor, books, and plants.", specs: { Material: "MDF + Metal", Finish: "Walnut", Load: "5kg max", Size: "18x12 inches" }, whatsappText: "Hi, I'm interested in Geometric Wall Shelf - ₹2,750" },
  { id: "lamp-table",       name: "Artisan Table Lamp",          category: "led-lights",    price:  3400, originalPrice: null,  image: "assets/images/table_lamp.png",         badge: "New",          description: "Handcrafted artisan table lamp with a fabric shade. Creates warm ambiance for bedrooms and living rooms.", specs: { Base: "Ceramic", Shade: "Fabric", Bulb: "E27 (not included)", Height: "16 inches" }, whatsappText: "Hi, I'm interested in Artisan Table Lamp - ₹3,400" },
  { id: "cushion-ethnic",   name: "Ethnic Cushion Cover Set",    category: "gift-items",    price:  1299, originalPrice: null,  image: "assets/images/cushion_covers.png",     badge: "New",          description: "Set of 5 ethnic print cushion covers. Machine washable, vibrant colors that last.", specs: { Quantity: "5 covers", Size: "16x16 inches", Fabric: "Cotton Blend", Closure: "Zipper" }, whatsappText: "Hi, I'm interested in Ethnic Cushion Cover Set - ₹1,299" },
  { id: "mirror-sunburst",  name: "Sunburst Decorative Mirror",  category: "wall-art",      price:  4200, originalPrice: null,  image: "assets/images/decorative_mirror.png",  badge: "New",          description: "Stunning sunburst decorative mirror in gold finish. The centerpiece any wall deserves.", specs: { Material: "Metal + Glass", Finish: "Gold", Diameter: "28 inches", Hanging: "Included" }, whatsappText: "Hi, I'm interested in Sunburst Decorative Mirror - ₹4,200" },
  { id: "candle-gift",      name: "Aromatic Candle Gift Set",    category: "gift-items",    price:   899, originalPrice: null,  image: "assets/images/candle_set.png",         badge: "New",          description: "Premium aromatic candle gift set with 3 fragrances. Perfect for gifting occasions.", specs: { Quantity: "3 candles", Fragrance: "Rose, Jasmine, Sandalwood", Burn: "40 hrs each", Wax: "Soy blend" }, whatsappText: "Hi, I'm interested in Aromatic Candle Gift Set - ₹899" },
  { id: "frame-photo",      name: "Decorative Photo Frame Set",  category: "photo-frames",  price:   749, originalPrice: null,  image: "assets/images/frames.jpg",             badge: null,           description: "Set of 3 decorative photo frames in complementary finishes. Ideal for gallery walls.", specs: { Quantity: "3 frames", Sizes: "4x6, 5x7, 8x10", Material: "Wood + Glass", Finish: "Mixed" }, whatsappText: "Hi, I'm interested in Decorative Photo Frame Set - ₹749" },
  { id: "light-led-strip",  name: "LED Décor Strip Lights",      category: "led-lights",    price:  1199, originalPrice: null,  image: "assets/images/lighting.jpg",           badge: null,           description: "Flexible LED strip lights for TV backlighting, shelves, and room ambiance. Remote controlled.", specs: { Length: "5 meters", Colors: "RGB + White", Control: "Remote", Power: "USB" }, whatsappText: "Hi, I'm interested in LED Décor Strip Lights - ₹1,199" }
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
