/* ============================================
   GArocery Store — Main JavaScript
   Features: Cart, Products, Filters, Animations
   ============================================ */

/* ============================================
   PRODUCT DATA
   ============================================ */
const products = [
  // Fruits
  { id:1,  name:"Honey Crisp Apples",  cat:"Fruits",     emoji:"🍎", price:149, oldPrice:199, weight:"1 kg",  badge:"sale", featured:true  },
  { id:2,  name:"Cavendish Bananas",   cat:"Fruits",     emoji:"🍌", price:49,  oldPrice:null, weight:"6 pcs", badge:"new",  featured:true  },
  { id:3,  name:"Sweet Oranges",       cat:"Fruits",     emoji:"🍊", price:99,  oldPrice:129,  weight:"1 kg",  badge:"sale", featured:false },
  { id:4,  name:"Alphonso Mangoes",    cat:"Fruits",     emoji:"🥭", price:299, oldPrice:null, weight:"2 pcs", badge:"new",  featured:true  },
  { id:5,  name:"Strawberries",        cat:"Fruits",     emoji:"🍓", price:129, oldPrice:159,  weight:"250g",  badge:"sale", featured:false },
  { id:6,  name:"Watermelon",          cat:"Fruits",     emoji:"🍉", price:59,  oldPrice:null, weight:"1 pc",  badge:null,   featured:false },
  // Vegetables
  { id:7,  name:"Broccoli Crown",      cat:"Vegetables", emoji:"🥦", price:79,  oldPrice:null, weight:"500g",  badge:"new",  featured:true  },
  { id:8,  name:"Carrot Bundle",       cat:"Vegetables", emoji:"🥕", price:39,  oldPrice:55,   weight:"500g",  badge:"sale", featured:false },
  { id:9,  name:"Cherry Tomatoes",     cat:"Vegetables", emoji:"🍅", price:89,  oldPrice:null, weight:"250g",  badge:null,   featured:true  },
  { id:10, name:"Baby Spinach",        cat:"Vegetables", emoji:"🥬", price:59,  oldPrice:79,   weight:"200g",  badge:"sale", featured:false },
  { id:11, name:"Bell Peppers Mix",    cat:"Vegetables", emoji:"🫑", price:119, oldPrice:null, weight:"3 pcs", badge:"new",  featured:false },
  { id:12, name:"Corn on the Cob",     cat:"Vegetables", emoji:"🌽", price:29,  oldPrice:null, weight:"1 pc",  badge:null,   featured:false },
  // Dairy
  { id:13, name:"Full Cream Milk",     cat:"Dairy",      emoji:"🥛", price:62,  oldPrice:null, weight:"1 L",   badge:null,   featured:true  },
  { id:14, name:"Greek Yogurt",        cat:"Dairy",      emoji:"🍶", price:99,  oldPrice:115,  weight:"400g",  badge:"sale", featured:true  },
  { id:15, name:"Cheddar Cheese",      cat:"Dairy",      emoji:"🧀", price:229, oldPrice:null, weight:"200g",  badge:"new",  featured:false },
  { id:16, name:"Salted Butter",       cat:"Dairy",      emoji:"🧈", price:85,  oldPrice:95,   weight:"100g",  badge:"sale", featured:false },
  // Snacks
  { id:17, name:"Mixed Nuts Pack",     cat:"Snacks",     emoji:"🥜", price:299, oldPrice:349,  weight:"200g",  badge:"sale", featured:true  },
  { id:18, name:"Dark Chocolate",      cat:"Snacks",     emoji:"🍫", price:149, oldPrice:null, weight:"100g",  badge:"new",  featured:false },
  { id:19, name:"Potato Chips",        cat:"Snacks",     emoji:"🍿", price:45,  oldPrice:55,   weight:"100g",  badge:"sale", featured:false },
  { id:20, name:"Granola Bars (6pk)",  cat:"Snacks",     emoji:"🍪", price:189, oldPrice:null, weight:"6 pcs", badge:null,   featured:false },
  // Beverages
  { id:21, name:"Orange Juice",        cat:"Beverages",  emoji:"🍹", price:119, oldPrice:139,  weight:"1 L",   badge:"sale", featured:true  },
  { id:22, name:"Green Tea (25 bags)", cat:"Beverages",  emoji:"🍵", price:149, oldPrice:null, weight:"25 bags",badge:"new", featured:false },
  { id:23, name:"Sparkling Water",     cat:"Beverages",  emoji:"💧", price:49,  oldPrice:null, weight:"1 L",   badge:null,   featured:false },
  { id:24, name:"Cold Brew Coffee",    cat:"Beverages",  emoji:"☕", price:199, oldPrice:249,  weight:"250ml", badge:"sale", featured:false },
  // Bakery
  { id:25, name:"Sourdough Loaf",      cat:"Bakery",     emoji:"🍞", price:149, oldPrice:null, weight:"400g",  badge:"new",  featured:true  },
  { id:26, name:"Croissants (4pk)",    cat:"Bakery",     emoji:"🥐", price:129, oldPrice:159,  weight:"4 pcs", badge:"sale", featured:false },
  { id:27, name:"Whole Grain Bread",   cat:"Bakery",     emoji:"🥖", price:99,  oldPrice:null, weight:"350g",  badge:null,   featured:false },
  { id:28, name:"Blueberry Muffins",   cat:"Bakery",     emoji:"🧁", price:199, oldPrice:229,  weight:"4 pcs", badge:"sale", featured:false },
];

/* ============================================
   CART MODULE
   ============================================ */
const Cart = {
  /* Load cart from localStorage */
  load() {
    return JSON.parse(localStorage.getItem('garocery_cart') || '[]');
  },
  /* Save cart to localStorage */
  save(cart) {
    localStorage.setItem('garocery_cart', JSON.stringify(cart));
  },
  /* Add item to cart */
  add(productId) {
    const cart  = this.load();
    const prod  = products.find(p => p.id === productId);
    if (!prod) return;
    const idx   = cart.findIndex(i => i.id === productId);
    if (idx > -1) {
      cart[idx].qty += 1;
    } else {
      cart.push({ id: prod.id, name: prod.name, emoji: prod.emoji,
                  cat: prod.cat, weight: prod.weight, price: prod.price, qty: 1 });
    }
    this.save(cart);
    this.updateCount();
    showToast(`🛒 ${prod.name} added to cart!`);
  },
  /* Remove item from cart */
  remove(productId) {
    let cart = this.load().filter(i => i.id !== productId);
    this.save(cart);
    this.updateCount();
  },
  /* Change quantity */
  setQty(productId, qty) {
    let cart = this.load();
    const idx = cart.findIndex(i => i.id === productId);
    if (idx < 0) return;
    if (qty < 1) {
      this.remove(productId);
      return;
    }
    cart[idx].qty = qty;
    this.save(cart);
    this.updateCount();
  },
  /* Total item count */
  totalCount() {
    return this.load().reduce((s, i) => s + i.qty, 0);
  },
  /* Total price */
  totalPrice() {
    return this.load().reduce((s, i) => s + i.price * i.qty, 0);
  },
  /* Update cart counter badge in navbar */
  updateCount() {
    const count = this.totalCount();
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }
};

/* ============================================
   PRODUCT CARD RENDERER
   ============================================ */
function renderProductCard(prod) {
  const badgeHtml = prod.badge
    ? `<span class="badge ${prod.badge}">${prod.badge === 'new' ? 'New' : 'Sale'}</span>`
    : '';
  const oldPriceHtml = prod.oldPrice
    ? `<span class="price-old">₹${prod.oldPrice}</span>`
    : '';
  return `
    <div class="product-card reveal" data-id="${prod.id}" data-cat="${prod.cat}">
      <div class="product-card-img">
        ${badgeHtml}
        ${prod.emoji}
        <button class="wishlist-btn" title="Wishlist">♡</button>
      </div>
      <div class="product-card-body">
        <span class="product-cat">${prod.cat}</span>
        <div class="product-name">${prod.name}</div>
        <div class="product-weight">${prod.weight}</div>
      </div>
      <div class="product-footer">
        <div class="product-price">
          <span class="price-now">₹${prod.price}</span>
          ${oldPriceHtml}
        </div>
        <button class="add-to-cart-btn" onclick="Cart.add(${prod.id}); this.classList.add('added'); setTimeout(()=>this.classList.remove('added'),1200)">
          + Cart
        </button>
      </div>
    </div>`;
}

/* ============================================
   CART PAGE RENDERER
   ============================================ */
function renderCart() {
  const container = document.getElementById('cart-items-container');
  if (!container) return;

  const cart = Cart.load();
  const emptyEl  = document.getElementById('cart-empty');
  const summaryEl = document.getElementById('cart-summary-wrap');

  if (cart.length === 0) {
    if (emptyEl) emptyEl.style.display = 'block';
    if (summaryEl) summaryEl.style.opacity = '.5';
    container.innerHTML = '';
    updateSummary();
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';
  if (summaryEl) summaryEl.style.opacity = '1';

  container.innerHTML = cart.map(item => `
    <div class="cart-item" id="cart-item-${item.id}">
      <div class="cart-item-emoji">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="item-cat">${item.cat}</div>
        <div class="item-name">${item.name}</div>
        <div class="item-weight">${item.weight}</div>
      </div>
      <div class="qty-control">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, +1)">+</button>
      </div>
      <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString()}</div>
      <button class="remove-btn" title="Remove" onclick="removeFromCart(${item.id})">🗑️</button>
    </div>
  `).join('');

  updateSummary();
}

function changeQty(id, delta) {
  const cart = Cart.load();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  Cart.setQty(id, item.qty + delta);
  renderCart();
}

function removeFromCart(id) {
  Cart.remove(id);
  renderCart();
  showToast('🗑️ Item removed from cart');
}

function updateSummary() {
  const cart     = Cart.load();
  const subtotal = Cart.totalPrice();
  const delivery = subtotal > 499 ? 0 : 49;
  const discount = currentDiscount || 0;
  const total    = subtotal + delivery - discount;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('summary-subtotal', `₹${subtotal.toLocaleString()}`);
  set('summary-delivery', delivery === 0 ? 'FREE' : `₹${delivery}`);
  set('summary-discount', discount > 0 ? `-₹${discount}` : '₹0');
  set('summary-total',    `₹${Math.max(0, total).toLocaleString()}`);
  set('summary-items', `${Cart.totalCount()} item${Cart.totalCount() !== 1 ? 's' : ''}`);
}

let currentDiscount = 0;

function applyCoupon() {
  const input = document.getElementById('coupon-input');
  const msg   = document.getElementById('coupon-msg');
  if (!input || !msg) return;
  const code  = input.value.trim().toUpperCase();
  const coupons = { 'FRESH10': 50, 'SAVE20': 100, 'GAROCERY': 149 };
  if (coupons[code]) {
    currentDiscount = coupons[code];
    msg.style.color = '#2e8b57';
    msg.textContent = `✅ Coupon applied! You saved ₹${coupons[code]}`;
  } else {
    currentDiscount = 0;
    msg.style.color = '#e74c3c';
    msg.textContent = '❌ Invalid coupon code';
  }
  updateSummary();
}

/* ============================================
   PRODUCTS PAGE — FILTERS & SEARCH
   ============================================ */
let activeFilters  = [];
let searchQuery    = '';
let sortOrder      = 'default';
let maxPriceFilter = 500;

function renderAllProducts() {
  const container = document.getElementById('all-products-grid');
  if (!container) return;

  let filtered = [...products];

  /* Category filter */
  if (activeFilters.length > 0) {
    filtered = filtered.filter(p => activeFilters.includes(p.cat));
  }

  /* Search */
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q)
    );
  }

  /* Price filter */
  filtered = filtered.filter(p => p.price <= maxPriceFilter);

  /* Sort */
  if (sortOrder === 'price-asc')  filtered.sort((a,b) => a.price - b.price);
  if (sortOrder === 'price-desc') filtered.sort((a,b) => b.price - a.price);
  if (sortOrder === 'name-asc')   filtered.sort((a,b) => a.name.localeCompare(b.name));

  const countEl = document.getElementById('product-count');
  if (countEl) countEl.textContent = `Showing ${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;

  container.innerHTML = filtered.length > 0
    ? filtered.map(renderProductCard).join('')
    : '<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-light)"><div style="font-size:3rem">🔍</div><p>No products found. Try adjusting filters.</p></div>';

  /* Re-trigger reveal */
  observeReveal();
}

function initProductFilters() {
  /* Category checkboxes */
  document.querySelectorAll('.cat-filter-check').forEach(cb => {
    cb.addEventListener('change', () => {
      activeFilters = [...document.querySelectorAll('.cat-filter-check:checked')].map(c => c.value);
      renderAllProducts();
    });
  });

  /* Search input */
  const searchInput = document.getElementById('product-search');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      searchQuery = e.target.value;
      renderAllProducts();
    });
  }

  /* Sort select */
  const sortSel = document.getElementById('sort-select');
  if (sortSel) {
    sortSel.addEventListener('change', e => {
      sortOrder = e.target.value;
      renderAllProducts();
    });
  }

  /* Price range */
  const priceRange = document.getElementById('price-range');
  if (priceRange) {
    priceRange.addEventListener('input', e => {
      maxPriceFilter = parseInt(e.target.value);
      const lbl = document.getElementById('price-max-lbl');
      if (lbl) lbl.textContent = `₹${maxPriceFilter}`;
      /* Update gradient */
      const pct = ((maxPriceFilter - 20) / (500 - 20)) * 100;
      e.target.style.background = `linear-gradient(to right, var(--green-main) 0%, var(--green-main) ${pct}%, var(--border) ${pct}%)`;
      renderAllProducts();
    });
  }
}

/* Category strip (home page) */
function initCatStrip() {
  document.querySelectorAll('.cat-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
      chip.classList.toggle('active');
      const cat = chip.dataset.cat;
      const grid = document.getElementById('featured-grid');
      if (!grid) return;
      const toShow = cat === 'all'
        ? products.filter(p => p.featured)
        : products.filter(p => p.cat === cat).slice(0, 8);
      grid.innerHTML = toShow.map(renderProductCard).join('');
      observeReveal();
    });
  });
}

/* ============================================
   CONTACT FORM VALIDATION
   ============================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    /* Clear previous errors */
    form.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
    form.querySelectorAll('input, textarea').forEach(el => el.classList.remove('error'));

    /* Validate name */
    const name = document.getElementById('c-name');
    if (!name.value.trim() || name.value.trim().length < 2) {
      setErr('c-name', 'Please enter your full name (min 2 chars)');
      valid = false;
    }

    /* Validate email */
    const email = document.getElementById('c-email');
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email.value.trim())) {
      setErr('c-email', 'Please enter a valid email address');
      valid = false;
    }

    /* Validate phone (optional but if filled must be 10 digits) */
    const phone = document.getElementById('c-phone');
    if (phone && phone.value.trim() && !/^\d{10}$/.test(phone.value.trim())) {
      setErr('c-phone', 'Phone must be 10 digits');
      valid = false;
    }

    /* Validate message */
    const msg = document.getElementById('c-message');
    if (!msg.value.trim() || msg.value.trim().length < 10) {
      setErr('c-message', 'Message must be at least 10 characters');
      valid = false;
    }

    if (valid) {
      const btn = form.querySelector('.form-submit');
      btn.textContent = 'Sending...';
      btn.disabled = true;
      setTimeout(() => {
        document.getElementById('contact-success').style.display = 'block';
        form.reset();
        btn.textContent = 'Send Message';
        btn.disabled = false;
      }, 1200);
    }
  });
}

function setErr(id, msg) {
  const el = document.getElementById(id);
  if (el) el.classList.add('error');
  const errEl = document.getElementById(id + '-err');
  if (errEl) errEl.textContent = msg;
}

/* ============================================
   NEWSLETTER
   ============================================ */
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input');
    const msg   = document.getElementById('newsletter-msg');
    const rx    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (rx.test(input.value.trim())) {
      msg.textContent = '🎉 You\'re subscribed! Welcome to the family.';
      input.value = '';
    } else {
      msg.style.color = '#ff6b6b';
      msg.textContent = '⚠️ Please enter a valid email.';
    }
  });
}

/* ============================================
   COUNTDOWN TIMER (Offer section)
   ============================================ */
function initCountdown() {
  const end = new Date();
  end.setDate(end.getDate() + 1);
  end.setHours(23, 59, 59, 0);

  function tick() {
    const now  = new Date();
    const diff = Math.max(0, end - now);
    const h    = String(Math.floor(diff / 3600000)).padStart(2,'0');
    const m    = String(Math.floor((diff % 3600000) / 60000)).padStart(2,'0');
    const s    = String(Math.floor((diff % 60000) / 1000)).padStart(2,'0');

    const setNum = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setNum('cd-hours', h);
    setNum('cd-mins',  m);
    setNum('cd-secs',  s);
  }
  tick();
  setInterval(tick, 1000);
}

/* ============================================
   TOAST NOTIFICATION
   ============================================ */
let toastTimeout;
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function observeReveal() {
  const els = document.querySelectorAll('.reveal:not(.visible)');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
}

/* ============================================
   STICKY NAVBAR
   ============================================ */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });

  /* Hamburger */
  const ham  = document.querySelector('.hamburger');
  const menu = document.querySelector('.mobile-nav');
  if (ham && menu) {
    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      menu.classList.toggle('open');
    });
  }
}

/* Active nav link highlight */
function highlightNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ============================================
   LOADING SCREEN
   ============================================ */
function hideLoader() {
  const loader = document.getElementById('loading-screen');
  if (!loader) return;
  setTimeout(() => loader.classList.add('hidden'), 1700);
}

/* ============================================
   WISHLIST TOGGLE
   ============================================ */
document.addEventListener('click', e => {
  const btn = e.target.closest('.wishlist-btn');
  if (!btn) return;
  const filled = btn.textContent.trim() === '♥';
  btn.textContent = filled ? '♡' : '♥';
  btn.style.color = filled ? '' : 'var(--accent-red)';
  showToast(filled ? '💔 Removed from wishlist' : '❤️ Added to wishlist');
});

/* ============================================
   CHECKOUT BUTTON
   ============================================ */
function initCheckout() {
  const btn = document.getElementById('checkout-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const cart = Cart.load();
    if (cart.length === 0) {
      showToast('🛒 Your cart is empty!');
      return;
    }
    showToast('✅ Order placed successfully! Thank you 🎉');
    localStorage.removeItem('garocery_cart');
    Cart.updateCount();
    setTimeout(renderCart, 800);
  });
}

/* ============================================
   INIT — runs on every page load
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  hideLoader();
  initNavbar();
  highlightNav();
  Cart.updateCount();
  observeReveal();
  initCountdown();
  initNewsletter();

  /* Home page specific */
  const featuredGrid = document.getElementById('featured-grid');
  if (featuredGrid) {
    featuredGrid.innerHTML = products.filter(p => p.featured).map(renderProductCard).join('');
    observeReveal();
    initCatStrip();
  }

  /* Products page */
  const allGrid = document.getElementById('all-products-grid');
  if (allGrid) {
    renderAllProducts();
    initProductFilters();
  }

  /* Cart page */
  if (document.getElementById('cart-items-container')) {
    renderCart();
    initCheckout();
  }

  /* Contact page */
  initContactForm();
});

/* Scroll reveal re-trigger on scroll */
window.addEventListener('scroll', () => {
  observeReveal();
}, { passive: true });
