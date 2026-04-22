function getWishlist() {
  const wishlistJson = localStorage.getItem("kgs_wishlist");
  return wishlistJson ? JSON.parse(wishlistJson) : [];
}

function saveWishlist(wishlist) {
  localStorage.setItem("kgs_wishlist", JSON.stringify(wishlist));
}

function toggleWishlist(productId) {
  let wishlist = getWishlist();
  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter(id => id !== productId);
  } else {
    wishlist.push(productId);
  }
  saveWishlist(wishlist);
  updateWishlistBadge();
  updateHeartIcons();
}

function isWishlisted(productId) {
  const wishlist = getWishlist();
  return wishlist.includes(productId);
}

function updateWishlistBadge() {
  const wishlist = getWishlist();
  const count = wishlist.length;
  const badgeElements = document.querySelectorAll('.wishlist-count');
  badgeElements.forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'inline-flex' : 'none';
  });
}

function updateHeartIcons() {
  const heartIcons = document.querySelectorAll('[data-product-id]');
  heartIcons.forEach(icon => {
    if (icon.classList.contains("heart-btn")) {
      const productId = icon.getAttribute("data-product-id");
      if (isWishlisted(productId)) {
        icon.classList.add("wishlisted");
        icon.classList.add("active"); // fallback just in case css requires active
      } else {
        icon.classList.remove("wishlisted");
        icon.classList.remove("active");
      }
    }
  });
}
