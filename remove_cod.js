const fs = require('fs');

// 1. shipping-policy.html
let sp = fs.readFileSync('shipping-policy.html', 'utf8');
sp = sp.replace('<p>Cash on Delivery (COD) is our primary payment method. Pay the full amount to our delivery person when your order arrives. UPI payment at delivery is also accepted. No advance payment is required for standard orders.</p>', '<p>We accept secure online payments via UPI (GPay, PhonePe, Paytm). Full payment is required to process and dispatch your order.</p>');
fs.writeFileSync('shipping-policy.html', sp);

// 2. order-confirmation.html
let oc = fs.readFileSync('order-confirmation.html', 'utf8');
oc = oc.replace('Free delivery within Virudhachalam. COD accepted.', 'Free delivery within Virudhachalam.');
fs.writeFileSync('order-confirmation.html', oc);

// 3. index.html
let idx = fs.readFileSync('index.html', 'utf8');
idx = idx.replace('<h4 class="text-ink text-[12px] font-bold uppercase tracking-wider mb-1">COD Available</h4>', '<h4 class="text-ink text-[12px] font-bold uppercase tracking-wider mb-1">Secure Payments</h4>');
idx = idx.replace('<h4 class="text-ink text-[12px] font-semibold tracking-wide">COD Available</h4>', '<h4 class="text-ink text-[12px] font-semibold tracking-wide">Secure Payments</h4>');
idx = idx.replace('<p class="text-muted text-[10px]">Pay on Delivery</p>', '<p class="text-muted text-[10px]">100% Safe via UPI</p>');
// Replace the cash/payments icon with a lock/secure icon
idx = idx.replace(/<span class="material-symbols-outlined text-\[28px\] text-gold mb-3">payments<\/span>/g, '<span class="material-symbols-outlined text-[28px] text-gold mb-3">lock</span>');
idx = idx.replace(/<span class="material-symbols-outlined text-\[24px\] text-gold">payments<\/span>/g, '<span class="material-symbols-outlined text-[24px] text-gold">lock</span>');
fs.writeFileSync('index.html', idx);

// 4. cart-checkout.html
let cc = fs.readFileSync('cart-checkout.html', 'utf8');
// Remove the COD option block
const codBlockRegex = /<label class="pay-option selected" onclick="selectPay\(this,'cod'\)">[\s\S]*?<\/label>\s*/;
cc = cc.replace(codBlockRegex, '');

// Make UPI the selected one
cc = cc.replace('<label class="pay-option" onclick="selectPay(this,\'upi\')">', '<label class="pay-option selected" onclick="selectPay(this,\'upi\')">');
cc = cc.replace('<input type="radio" name="pay" value="upi" style="display:none;">', '<input type="radio" name="pay" value="upi" checked style="display:none;">');

// Change defaults in script
cc = cc.replace(/let payMethod = 'cod';/, "let payMethod = 'upi';");
cc = cc.replace(/payMethod === 'cod' \? 'Cash on Delivery' : 'UPI Payment'/, "'UPI Payment'");
cc = cc.replace(/orderData\.payment === 'cod' \? 'COD' : 'UPI'/, "'UPI'");
fs.writeFileSync('cart-checkout.html', cc);

console.log('COD removal complete!');
