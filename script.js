// মোবাইল মেনু টগল
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');

menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    nav.classList.toggle('active');
    menuToggle.textContent = nav.classList.contains('active') ? '✕' : '☰';
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
});

// মেনুর বাইরে ক্লিক করলে বন্ধ হবে
document.addEventListener('click', (e) => {
    if (nav.classList.contains('active') && !nav.contains(e.target) && e.target !== menuToggle) {
        nav.classList.remove('active');
        menuToggle.textContent = '☰';
        document.body.style.overflow = '';
    }
});

// মেনু আইটেমে ক্লিক করলে মেনু বন্ধ করুন
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        menuToggle.textContent = '☰';
        document.body.style.overflow = '';
    });
});

// বুকমার্ক ফাংশনালিটি - উন্নত ভার্সন
document.querySelectorAll('.bookmark-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isBookmarked = this.classList.contains('bookmarked');
        
        // এনিমেশন ক্লাস যোগ করুন
        this.classList.add(isBookmarked ? 'unbookmark-animation' : 'bookmark-animation');
        
        // স্থানীয় স্টোরেজে স্টেট সেভ করুন
        const bookId = this.dataset.bookId;
        localStorage.setItem(`book-${bookId}-bookmarked`, !isBookmarked);
        
        // এনিমেশন শেষ হওয়ার পর স্টেট আপডেট করুন
        setTimeout(() => {
            this.classList.toggle('bookmarked');
            const span = this.querySelector('span');
            if (span) {
                span.textContent = this.classList.contains('bookmarked') 
                    ? 'বুকমার্ক করা হয়েছে' 
                    : 'বুকমার্ক করুন';
            }
            
            // এনিমেশন ক্লাস সরান
            this.classList.remove('unbookmark-animation', 'bookmark-animation');
            
            // AJAX কল সিমুলেশন
            console.log(`বুকমার্ক ${this.classList.contains('bookmarked') ? 'করা হয়েছে' : 'অপসারণ করা হয়েছে'} বই ID: ${bookId}`);
        }, 300);
    });
    
    // পৃষ্ঠা লোড করার সময় বুকমার্ক স্টেট চেক করুন
    const bookId = btn.dataset.bookId;
    if (localStorage.getItem(`book-${bookId}-bookmarked`) === 'true') {
        btn.classList.add('bookmarked');
        const span = btn.querySelector('span');
        if (span) span.textContent = 'বুকমার্ক করা হয়েছে';
    }
});

// সার্চ ফাংশনালিটি
const searchBox = document.querySelector('.search-box input');
const searchButton = document.querySelector('.search-box button');

const performSearch = (query) => {
    if (query.trim() !== '') {
        // লোডিং স্টেট দেখান
        const originalText = searchButton.innerHTML;
        searchButton.innerHTML = `<span>অনুসন্ধান হচ্ছে...</span><span class="loading"></span>`;
        
        // সিমুলেটেড লোডিং
        setTimeout(() => {
            searchButton.innerHTML = originalText;
            alert(`আপনি খুঁজছেন: ${query}`);
            // এখানে সার্চ রেজাল্ট পেজে রিডাইরেক্ট করা যায়
            // window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }, 1500);
    }
};

searchButton.addEventListener('click', () => {
    performSearch(searchBox.value);
});

searchBox.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch(searchBox.value);
    }
});

// উন্নত সার্চ ফর্ম
const advancedSearchForm = document.querySelector('.advanced-search');
if (advancedSearchForm) {
    advancedSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const searchParams = new URLSearchParams();
        
        for (const [key, value] of formData.entries()) {
            if (value) searchParams.append(key, value);
        }
        
        // লোডিং স্টেট দেখান
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span class="loading"></span>`;
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            console.log('অনুসন্ধান করা হচ্ছে:', Object.fromEntries(searchParams));
            // এখানে AJAX কল বা পেজ রিডাইরেক্ট করা যায়
            // window.location.href = `search.html?${searchParams.toString()}`;
        }, 1500);
    });
}

// স্ক্রল এফেক্ট - হেডার
let lastScroll = 0;
const header = document.querySelector('header');
const headerHeight = header.offsetHeight;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.style.transform = 'translateY(0)';
        return;
    }
    
    if (currentScroll > lastScroll && currentScroll > headerHeight && !header.classList.contains('scrolled-down')) {
        header.style.transform = 'translateY(-100%)';
        header.classList.add('scrolled-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scrolled-down')) {
        header.style.transform = 'translateY(0)';
        header.classList.remove('scrolled-down');
    }
    
    lastScroll = currentScroll;
});

// ইমেজ লোডিং অপ্টিমাইজেশন
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = [].slice.call(document.querySelectorAll('img[loading="lazy"]'));
    
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src || lazyImage.src;
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        }, {
            rootMargin: '200px 0px'
        });
        
        lazyImages.forEach((lazyImage) => {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    }
});

// টাচ ডিভাইস ডিটেকশন
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints;
}

if (isTouchDevice()) {
    document.documentElement.classList.add('touch-device');
} else {
    document.documentElement.classList.add('no-touch-device');
}



// Ripple effect on click
document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('click', function (e) {
      const circle = document.createElement('span');
      circle.classList.add('ripple');
      this.appendChild(circle);
      
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      circle.style.width = circle.style.height = size + 'px';
      circle.style.left = (e.clientX - rect.left - size/2) + 'px';
      circle.style.top = (e.clientY - rect.top - size/2) + 'px';

      circle.addEventListener('animationend', () => {
        circle.remove();
      });
    });
  });