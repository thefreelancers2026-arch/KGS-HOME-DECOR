const fs = require('fs');
const path = require('path');

const dir = '.';

// CART CHECKOUT
let cartPath = path.join(dir, 'cart-checkout.html');
let cartContent = fs.readFileSync(cartPath, 'utf8');

cartContent = cartContent.replace('01. Your Selection', '1. Cart');
cartContent = cartContent.replace('02. Shipping Destination', '2. Shipping Details');
cartContent = cartContent.replace('03. Secure Payment', '3. Payment');
cartContent = cartContent.replace('Review your selection and finalize your handcrafted interior journey.', 'Review your products and proceed with fast checkout.');
cartContent = cartContent.replace('Complete Purchase', 'Buy Now');
fs.writeFileSync(cartPath, cartContent, 'utf8');

// CUSTOMER ACCOUNT
let accountPath = path.join(dir, 'customer-account.html');
let accountContent = fs.readFileSync(accountPath, 'utf8');

accountContent = accountContent.replace('Curating a space is a journey. Manage your orders, review your wishlist, and update your Home settings here.', 'Manage your orders, review your wishlist, and update your profile here.');
accountContent = accountContent.replace('Recent Acquisitions', 'My Orders');
accountContent = accountContent.replace('Saved Addresses', 'Profile');
accountContent = accountContent.replace('Primary Residence', 'Default Address');

fs.writeFileSync(accountPath, accountContent, 'utf8');

// GLOBAL FOOTER (COD) -> applying to all files
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if hasn't been added yet
    if (content.includes('Privacy Policy') && !content.includes('Cash on Delivery Available')) {
        content = content.replace('<div class="flex gap-6"><a href="#" class="hover:text-ink">Privacy Policy</a>', '<div class="flex gap-6 items-center"><span class="font-bold text-accent mr-4 hidden md:inline">✓ Cash on Delivery Available</span> <a href="#" class="hover:text-ink">Privacy Policy</a>');
        fs.writeFileSync(filePath, content, 'utf8');
    }
});
