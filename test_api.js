const SHOPIFY_DOMAIN = 'kgs-home-decors.myshopify.com';
const STOREFRONT_TOKEN = 'f88234851fd7abbbfb315676198349e7';
const API_URL = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;

const query = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      priceRange { minVariantPrice { amount } }
      compareAtPriceRange { minVariantPrice { amount } }
      variants(first: 1) { edges { node { id availableForSale quantityAvailable } } }
    }
  }
`;

fetch(API_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN
  },
  body: JSON.stringify({ query, variables: { handle: "vintage-gear-mechanism-wall-clock" } })
})
.then(r => r.json())
.then(json => {
  console.log("DATA:", JSON.stringify(json.data, null, 2));
  if (json.errors) console.error("ERRORS:", JSON.stringify(json.errors, null, 2));
})
.catch(console.error);
