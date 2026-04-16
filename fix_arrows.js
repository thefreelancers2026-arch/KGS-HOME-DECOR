const fs = require('fs');
const files = ['index.html', 'product-listing.html', 'product-detail.html', 'cart-checkout.html', 'customer-account.html', 'wishlist.html'];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/â†’/g, "&rarr;");
    fs.writeFileSync(f, c, 'utf8');
  }
});
console.log('Fixed arrow mojibake in all files.');
