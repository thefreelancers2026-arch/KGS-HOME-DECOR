function getCart() {
  const cartJson = localStorage.getItem("kgs_cart");
  return cartJson ? JSON.parse(cartJson) : [];
}

function saveCart(cart) {
  localStorage.setItem("kgs_cart", JSON.stringify(cart));
}

function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  
  const existingItemIndex = cart.findIndex(item => item.id === productId);
  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
  
  saveCart(cart);
  updateCartBadge();
  
  // Show toast notification
  const toast = document.getElementById("cart-toast");
  if (toast) {
    toast.querySelector('#toast-text').innerText = "Added " + product.name + " to cart";
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
}

function removeFromCart(productId) {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.id !== productId);
  saveCart(updatedCart);
  updateCartBadge();
}

function updateQty(productId, qty) {
  let cart = getCart();
  if (qty <= 0) {
    cart = cart.filter(item => item.id !== productId);
  } else {
    const item = cart.find(item => item.id === productId);
    if (item) {
      item.quantity = qty;
    }
  }
  saveCart(cart);
}

function getCartCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateCartBadge() {
  const count = getCartCount();
  const badgeElements = document.querySelectorAll('.cart-count');
  badgeElements.forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'inline-flex' : 'none';
  });
}

function clearCart() {
  localStorage.removeItem("kgs_cart");
  updateCartBadge();
}
