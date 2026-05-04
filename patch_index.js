const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const reviewSectionRegex = /<!-- ══ TESTIMONIALS ═════════════════════════════════════════ -->[\s\S]*?<\/section>/;

const newReviewSection = `<!-- ══ TESTIMONIALS ═════════════════════════════════════════ -->
<section class="bg-base py-12 md:py-20 border-b border-border" id="testimonials-section">
  <div class="max-w-[90rem] mx-auto px-5 md:px-12">
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4 gsap-rv">
      <div class="flex flex-wrap items-center gap-3">
        <h2 class="font-serif font-medium text-ink text-2xl md:text-3xl">What Our Customers Say</h2>
        <div class="flex items-center gap-1 text-gold">
          <span class="material-symbols-outlined text-[18px]" style="font-variation-settings:'FILL' 1;">star</span>
          <span class="text-ink font-semibold text-sm">4.8/5</span>
          <span class="text-muted text-[10px] font-normal ml-1 hidden md:inline">Based on Store reviews</span>
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-4">
        <button onclick="document.getElementById('review-modal').classList.remove('hidden')" class="btn-secondary text-[11px] py-2 px-4 whitespace-nowrap">Write a Review</button>
        <a href="https://www.google.com/search?q=KGS+Home+Decors+Virudhachalam#lrd=0x0:0x0,1,,," target="_blank" class="text-[10px] font-bold tracking-[.15em] uppercase text-ink border-b border-ink/20 pb-1 hover:border-ink transition-colors hidden md:block whitespace-nowrap">Google Reviews</a>
      </div>
    </div>
    
    <div id="reviews-container" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Fallback / Loading Skeletons -->
      <div class="bg-surface p-6 border border-border rounded-md flex flex-col h-40 animate-pulse"></div>
      <div class="bg-surface p-6 border border-border rounded-md flex flex-col h-40 animate-pulse hidden md:flex"></div>
      <div class="bg-surface p-6 border border-border rounded-md flex flex-col h-40 animate-pulse hidden md:flex"></div>
    </div>
  </div>
</section>`;

content = content.replace(reviewSectionRegex, newReviewSection);

const modalHtml = `<!-- Review Submission Modal -->
<div id="review-modal" class="fixed inset-0 bg-ink/80 z-[100] hidden flex items-center justify-center backdrop-blur-sm p-4">
  <div class="bg-surface w-full max-w-md rounded-md border border-border p-6 md:p-8 relative shadow-2xl">
    <button onclick="document.getElementById('review-modal').classList.add('hidden')" class="absolute top-4 right-4 text-muted hover:text-ink transition-colors">
      <span class="material-symbols-outlined">close</span>
    </button>
    <h3 class="font-serif font-medium text-xl text-ink mb-2">Write a Review</h3>
    <p class="text-[13px] text-muted leading-relaxed mb-6">Share your experience with KGS Home Décors. Your feedback helps us improve!</p>
    
    <form id="review-form" onsubmit="handleReviewSubmit(event)" class="space-y-5">
      <div>
        <label class="block text-[11px] font-bold tracking-[.15em] uppercase text-ink mb-2">Rating</label>
        <div class="flex items-center gap-1 text-muted cursor-pointer" id="star-selector">
          <span class="material-symbols-outlined text-[28px] hover:text-gold transition-colors" data-val="1">star</span>
          <span class="material-symbols-outlined text-[28px] hover:text-gold transition-colors" data-val="2">star</span>
          <span class="material-symbols-outlined text-[28px] hover:text-gold transition-colors" data-val="3">star</span>
          <span class="material-symbols-outlined text-[28px] hover:text-gold transition-colors" data-val="4">star</span>
          <span class="material-symbols-outlined text-[28px] hover:text-gold transition-colors" data-val="5">star</span>
        </div>
        <input type="hidden" id="review-rating" value="0" required>
      </div>

      <div>
        <label class="block text-[11px] font-bold tracking-[.15em] uppercase text-ink mb-2">Your Name *</label>
        <input type="text" id="review-name" class="w-full border border-border bg-white p-3 text-[14px] outline-none focus:border-ink transition-colors" placeholder="John Doe" required>
      </div>

      <div>
        <label class="block text-[11px] font-bold tracking-[.15em] uppercase text-ink mb-2">Your Review *</label>
        <textarea id="review-text" rows="4" class="w-full border border-border bg-white p-3 text-[14px] outline-none focus:border-ink transition-colors resize-none" placeholder="I bought a vintage clock..." required></textarea>
      </div>
      
      <button type="submit" id="submit-review-btn" class="btn-primary w-full mt-4">Submit Review</button>
    </form>
    
    <div id="review-success" class="hidden flex flex-col items-center justify-center py-6 text-center">
      <div class="w-12 h-12 rounded-full bg-[#f4fbf6] flex items-center justify-center mb-4 border border-[#25d366]">
        <span class="material-symbols-outlined text-[#25d366]">check</span>
      </div>
      <h4 class="font-serif text-lg text-ink mb-2">Thank You!</h4>
      <p class="text-[13px] text-muted">Your review has been submitted and is pending approval.</p>
      <button onclick="document.getElementById('review-modal').classList.add('hidden'); document.getElementById('review-success').classList.add('hidden'); document.getElementById('review-form').classList.remove('hidden');" class="btn-secondary w-full mt-6">Close</button>
    </div>
  </div>
</div>

<script>
  const stars = document.querySelectorAll('#star-selector span');
  const ratingInput = document.getElementById('review-rating');
  
  stars.forEach(star => {
    star.addEventListener('mouseover', function() {
      const val = parseInt(this.getAttribute('data-val'));
      stars.forEach(s => {
        if(parseInt(s.getAttribute('data-val')) <= val) {
          s.style.color = 'var(--color-gold)';
          s.style.fontVariationSettings = "'FILL' 1";
        } else {
          s.style.color = '';
          s.style.fontVariationSettings = "'FILL' 0";
        }
      });
    });
    
    star.addEventListener('mouseout', function() {
      const selected = parseInt(ratingInput.value);
      stars.forEach(s => {
        if(parseInt(s.getAttribute('data-val')) <= selected) {
          s.style.color = 'var(--color-gold)';
          s.style.fontVariationSettings = "'FILL' 1";
        } else {
          s.style.color = '';
          s.style.fontVariationSettings = "'FILL' 0";
        }
      });
    });
    
    star.addEventListener('click', function() {
      ratingInput.value = parseInt(this.getAttribute('data-val'));
    });
  });

  async function loadStoreReviews() {
    try {
      if (typeof getStoreReviews !== 'function') return;
      const reviews = await getStoreReviews();
      const container = document.getElementById('reviews-container');
      
      if (!reviews || reviews.length === 0) {
        container.innerHTML = '<p class="text-muted text-[13px] italic col-span-1 md:col-span-3 text-center py-10">No reviews yet. Be the first to share your experience!</p>';
        return;
      }
      
      const displayReviews = reviews.slice(0, 3);
      
      container.innerHTML = displayReviews.map(r => \`<div class="bg-surface p-6 border border-border rounded-md flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-tint flex items-center justify-center text-ink font-serif text-lg">\${r.guest_name.charAt(0).toUpperCase()}</div>
            <div>
              <p class="text-ink font-semibold text-[13px]">\${r.guest_name}</p>
              <div class="flex text-gold text-[12px] mt-0.5">\${Array(r.rating).fill('<span class="material-symbols-outlined text-[14px]" style="font-variation-settings:\\'FILL\\' 1;">star</span>').join('')}</div>
            </div>
          </div>
          <p class="text-ink text-[13px] font-sans italic leading-relaxed flex-grow">\\"\${r.review_text}\\"</p>
          <p class="text-[10px] text-muted mt-4 uppercase tracking-widest">\${new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
        </div>\`).join('');
    } catch (err) {
      console.error('Failed to load reviews:', err);
    }
  }

  async function handleReviewSubmit(e) {
    e.preventDefault();
    const rating = parseInt(document.getElementById('review-rating').value);
    const name = document.getElementById('review-name').value.trim();
    const text = document.getElementById('review-text').value.trim();
    
    if (rating === 0) {
      alert('Please select a star rating');
      return;
    }
    
    const btn = document.getElementById('submit-review-btn');
    btn.disabled = true;
    btn.innerHTML = 'Submitting...';
    
    try {
      await submitStoreReview({ guest_name: name, rating: rating, review_text: text });
      document.getElementById('review-form').reset();
      ratingInput.value = 0;
      stars.forEach(s => { s.style.color = ''; s.style.fontVariationSettings = "'FILL' 0"; });
      document.getElementById('review-form').classList.add('hidden');
      document.getElementById('review-success').classList.remove('hidden');
    } catch (err) {
      alert('Error submitting review. Please try again.');
      console.error(err);
    } finally {
      btn.disabled = false;
      btn.innerHTML = 'Submit Review';
    }
  }

  document.addEventListener('DOMContentLoaded', loadStoreReviews);
</script>
</body>`;

content = content.replace('</body>', modalHtml);
fs.writeFileSync('index.html', content);
console.log('Index.html patched');
