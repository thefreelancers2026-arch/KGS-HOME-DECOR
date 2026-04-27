/* ═══════════════════════════════════════════════════════════
   KGS Home Décors — Shopify Storefront API Integration
   Vanilla JS GraphQL Client
═══════════════════════════════════════════════════════════ */

const SHOPIFY_DOMAIN = "kgs-home-decors.myshopify.com";
const STOREFRONT_TOKEN = "f88234851fd7abbbfb315676198349e7"; // <-- PASTE YOUR STOREFRONT API TOKEN HERE
const API_URL = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;

/* ─── CORE FETCH UTILITY ────────────────────────────────── */
async function shopifyFetch({ query, variables = {} }) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });
    const json = await response.json();
    if (json.errors) {
      console.error("Shopify API Errors:", json.errors);
      return null;
    }
    return json.data;
  } catch (error) {
    console.error("Shopify Fetch failed:", error);
    return null;
  }
}

/* ─── PRODUCT CATALOG ───────────────────────────────────── */

// Fetches all products (used for search and general listing)
async function initStore() {
  const query = `
    query getProducts {
      products(first: 250) {
        edges {
          node {
            id
            handle
            title
            description
            productType
            tags
            priceRange {
              minVariantPrice { amount }
            }
            images(first: 1) {
              edges { node { url } }
            }
            variants(first: 1) {
              edges { node { id } }
            }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch({ query });
  if (!data) return [];

  // Map Shopify data to our old UI structure
  return data.products.edges.map(({ node }) => ({
    id: node.variants.edges[0]?.node.id, // We use Variant ID for adding to cart
    handle: node.handle,
    name: node.title,
    description: node.description,
    category: node.productType,
    tags: node.tags || [],
    price: parseFloat(node.priceRange.minVariantPrice.amount),
    image: node.images.edges[0]?.node.url || 'assets/images/placeholder.jpg'
  }));
}

// Fetches products for a specific collection
async function fetchCollectionProducts(handle) {
  const query = `
    query getCollection($handle: String!) {
      collection(handle: $handle) {
        products(first: 50) {
          edges {
            node {
              id
              handle
              title
              priceRange { minVariantPrice { amount } }
              images(first: 1) { edges { node { url } } }
              variants(first: 1) { edges { node { id } } }
            }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch({ query, variables: { handle } });
  if (!data || !data.collection) return [];
  return data.collection.products.edges.map(({ node }) => ({
    id: node.variants.edges[0]?.node.id,
    handle: node.handle,
    name: node.title,
    price: parseFloat(node.priceRange.minVariantPrice.amount),
    image: node.images.edges[0]?.node.url || 'assets/images/placeholder.jpg'
  }));
}

// Fetches a single product for the PDP (Product Detail Page)
async function fetchProductByHandle(handle) {
  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        descriptionHtml
        productType
        tags
        priceRange { minVariantPrice { amount } }
        compareAtPriceRange { minVariantPrice { amount } }
        images(first: 5) { edges { node { url } } }
        variants(first: 1) { edges { node { id availableForSale quantityAvailable } } }
      }
    }
  `;
  const data = await shopifyFetch({ query, variables: { handle } });
  if (!data || !data.product) return null;
  return data.product;
}

/* ─── SHOPIFY CART API ──────────────────────────────────── */

// Gets or creates a Shopify Cart ID
async function getOrCreateCart() {
  let cartId = localStorage.getItem("shopify_cart_id");
  if (cartId) return cartId;

  const query = `
    mutation createCart {
      cartCreate {
        cart { id }
      }
    }
  `;
  const data = await shopifyFetch({ query });
  if (data && data.cartCreate.cart) {
    cartId = data.cartCreate.cart.id;
    localStorage.setItem("shopify_cart_id", cartId);
    return cartId;
  }
  return null;
}

// Fetch current cart state to update badges and UI
async function getCart() {
  const cartId = await getOrCreateCart();
  if (!cartId) return null;

  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        totalQuantity
        cost { totalAmount { amount } }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product { title handle }
                  image { url }
                  price { amount }
                }
              }
            }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch({ query, variables: { cartId } });
  return data?.cart || null;
}

// Adds an item to the Shopify Cart
async function addToCart(variantId, quantity = 1) {
  const cartId = await getOrCreateCart();
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { id totalQuantity }
      }
    }
  `;
  const variables = {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }]
  };

  await shopifyFetch({ query, variables });
  await updateCartBadge();

  // Show Toast
  const toast = document.getElementById('cart-toast');
  if (toast) {
    const txt = document.getElementById('toast-text');
    if (txt) txt.innerText = 'Item added to secure cart';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}

// Removes a line item from the Shopify Cart
async function removeFromCart(lineId) {
  const cartId = localStorage.getItem("shopify_cart_id");
  if (!cartId) return;

  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { id }
      }
    }
  `;
  await shopifyFetch({ query, variables: { cartId, lineIds: [lineId] } });
  await updateCartBadge();
}

// Updates quantity of a line item
async function updateCartLine(lineId, quantity) {
  const cartId = localStorage.getItem("shopify_cart_id");
  if (!cartId) return;

  if (quantity <= 0) {
    return removeFromCart(lineId);
  }

  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { id }
      }
    }
  `;
  const variables = {
    cartId,
    lines: [{ id: lineId, quantity }]
  };
  await shopifyFetch({ query, variables });
  await updateCartBadge();
}

// Redirects to Shopify's secure checkout page
async function proceedToCheckout() {
  const cart = await getCart();
  if (cart && cart.checkoutUrl) {
    window.location.href = cart.checkoutUrl;
  } else {
    alert("Unable to process checkout. Please try again.");
  }
}

// Updates the navigation cart badge
async function updateCartBadge() {
  const cartId = localStorage.getItem("shopify_cart_id");
  if (!cartId) return;

  const query = `query { cart(id: "${cartId}") { totalQuantity } }`;
  const data = await shopifyFetch({ query });
  const count = data?.cart?.totalQuantity || 0;

  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'inline-flex' : 'none';
  });
}

/* ─── WISHLIST (Unchanged, uses localStorage) ───────────── */
function getWishlist() {
  try { return JSON.parse(localStorage.getItem('kgs_wishlist')) || []; }
  catch (e) { return []; }
}
function saveWishlist(list) {
  localStorage.setItem('kgs_wishlist', JSON.stringify(list));
}
function toggleWishlist(productId) {
  let list = getWishlist();
  if (list.includes(productId)) {
    list = list.filter(id => id !== productId);
  } else {
    list.push(productId);
  }
  saveWishlist(list);
  updateWishlistBadge();
  updateHeartIcons();
}
function isWishlisted(productId) {
  return getWishlist().includes(productId);
}
function updateWishlistBadge() {
  const count = getWishlist().length;
  document.querySelectorAll('.wishlist-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'inline-flex' : 'none';
  });
}
function updateHeartIcons() {
  document.querySelectorAll('[data-product-id]').forEach(btn => {
    if (!btn.classList.contains('heart-btn')) return;
    const id = btn.getAttribute('data-product-id');
    if (isWishlisted(id)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

/* ─── UTILS ─────────────────────────────────────────────── */
const formatINR = val => '₹' + parseInt(val, 10).toLocaleString('en-IN');

// Initial badge render
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  if (typeof updateWishlistBadge === 'function') updateWishlistBadge();
  if (typeof updateHeartIcons === 'function') updateHeartIcons();
});
