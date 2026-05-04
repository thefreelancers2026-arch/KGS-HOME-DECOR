const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Set viewport to iPhone X/11/12 size
  await page.setViewport({
    width: 375,
    height: 812,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });

  await page.goto('http://localhost:3000/product-listing.html', { waitUntil: 'networkidle0' });

  const overflows = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const scrollWidth = document.documentElement.scrollWidth;
    
    if (scrollWidth <= docWidth) {
      return { msg: 'No overflow found in DOM. Widths match.', docWidth, scrollWidth };
    }
    
    const elements = document.querySelectorAll('*');
    const overflowing = [];
    
    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      if (rect.right > docWidth || rect.width > docWidth) {
        // Find deepest child only to avoid noise
        overflowing.push({
          tag: el.tagName,
          id: el.id,
          className: el.className,
          width: rect.width,
          right: rect.right,
          scrollWidth: el.scrollWidth
        });
      }
    }
    
    return {
      docWidth,
      scrollWidth,
      elements: overflowing
    };
  });
  
  console.log(JSON.stringify(overflows, null, 2));
  
  await browser.close();
})();
