const fs = require('fs');
const glob = require('fs').readdirSync('.');
const htmlFiles = glob.filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Top Announcement Bar
  content = content.replace(/Cash on Delivery/g, 'Secure Online Payments');
  
  // 2. Meta descriptions
  content = content.replace(/Cash on Delivery available across Tamil Nadu\./g, 'Secure UPI payments accepted across Tamil Nadu.');
  content = content.replace(/Cash on Delivery available\./g, 'Secure UPI payments accepted.');
  content = content.replace(/Cash on Delivery\./g, 'Secure Payments.');
  content = content.replace(/Cash on Delivery \u0026 UPI accepted\./g, 'Secure UPI payments accepted.');
  content = content.replace(/Cash on Delivery \u0026amp; UPI accepted\./g, 'Secure UPI payments accepted.');

  // 3. specific fixes for about.html
  if (file === 'about.html') {
    content = content.replace('Secure Online Payments option made it so easy.', 'The seamless ordering process made it so easy.');
    content = content.replace('Secure Online Payments available across Tamil Nadu.', 'Secure online payments available across Tamil Nadu.');
  }

  // 4. cart-checkout.html specific
  if (file === 'cart-checkout.html') {
    content = content.replace('<div class="flex items-center gap-2.5 text-[12px] text-muted"><span class="material-symbols-outlined text-warm text-[18px]">payments</span>Secure Online Payments Available</div>', '<div class="flex items-center gap-2.5 text-[12px] text-muted"><span class="material-symbols-outlined text-warm text-[18px]">lock</span>100% Secure UPI Payments</div>');
  }

  // 5. product-detail.html specific
  if (file === 'product-detail.html') {
    content = content.replace('<p class="font-semibold text-ink mb-1">Secure Online Payments</p>', '<p class="font-semibold text-ink mb-1">Secure Payments</p>');
    content = content.replace('<span class="text-[10px] sm:text-[10.5px] font-semibold tracking-[.14em] uppercase text-ink">Secure Online Payments</span>', '<span class="text-[10px] sm:text-[10.5px] font-semibold tracking-[.14em] uppercase text-ink">Secure Payments</span>');
  }
  
  // 6. fix terms.html and returns-policy.html
  if (file === 'terms.html' || file === 'returns-policy.html' || file === 'privacy-policy.html') {
    content = content.replace('Since most orders are Secure Online Payments, refunds (where applicable)', 'Refunds (where applicable)');
  }

  // Restore logic for order-tracking and account history where it actually means the historical COD.
  if (file === 'order-tracking.html' || file === 'account.html') {
    // revert the blind replace for historical checks
    content = content.replace(/Secure Online Payments' : 'Online \(UPI\)'/, "Cash on Delivery' : 'Online (UPI)'");
    content = content.replace(/Secure Online Payments' : 'UPI'/, "Cash on Delivery' : 'UPI'");
  }

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Fixed ' + file);
  }
});
