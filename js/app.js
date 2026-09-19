// ==========================================================================
// KisanSetu B2B - Main Application Logic
// State management, persona filters, cart management, and PO generation
// ==========================================================================

import { initialProducts } from './data.js';
import { initWhatsAppSimulator } from './whatsapp-simulator.js';

class KisanSetuApp {
  constructor() {
    this.products = [...initialProducts];
    this.activeCategory = 'all';
    this.activePersona = 'all'; // 'all' | 'hospital' | 'college' | 'restaurant'
    this.searchQuery = '';
    this.onlyOrganic = false;
    this.onlyWhatsApp = false;
    this.sortBy = 'featured';

    this.cart = []; // [{ product, qtyQuintals, pricePerKg, lineTotal }]

    this.initDOMElements();
    this.bindEvents();
    this.renderProducts();
    this.updateCartBadge();
  }

  initDOMElements() {
    this.productsGrid = document.getElementById('productsGrid');
    this.searchInput = document.getElementById('searchInput');
    this.categoryPills = document.querySelectorAll('.category-pill');
    this.personaPills = document.querySelectorAll('.persona-pill-btn');
    this.personaChips = document.querySelectorAll('.persona-chip-input');
    this.sortSelect = document.getElementById('sortSelect');
    this.organicFilterCheckbox = document.getElementById('organicFilterCheckbox');
    this.whatsappFilterCheckbox = document.getElementById('whatsappFilterCheckbox');

    // Cart Drawer Elements
    this.cartDrawer = document.getElementById('cartDrawer');
    this.cartBackdrop = document.getElementById('cartDrawerBackdrop');
    this.cartItemsList = document.getElementById('cartItemsList');
    this.cartBadge = document.getElementById('cartBadge');
    this.cartSubtotal = document.getElementById('cartSubtotal');
    this.cartFreight = document.getElementById('cartFreight');
    this.cartGst = document.getElementById('cartGst');
    this.cartTotal = document.getElementById('cartTotal');
    this.cartWeightMetric = document.getElementById('cartWeightMetric');
    this.btnOpenCart = document.getElementById('btnOpenCart');
    this.btnCloseCart = document.getElementById('btnCloseCart');
    this.btnGeneratePo = document.getElementById('btnGeneratePo');

    // RFQ Dialog Elements
    this.rfqDialog = document.getElementById('rfqDialog');
    this.btnOpenRfqNav = document.getElementById('btnOpenRfqNav');
    this.btnCloseRfq = document.getElementById('btnCloseRfq');
    this.rfqForm = document.getElementById('rfqForm');

    // Toast Container
    this.toastContainer = document.getElementById('toastContainer');
  }

  bindEvents() {
    // Search input
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderProducts();
      });
    }

    // Category pills
    this.categoryPills.forEach(pill => {
      pill.addEventListener('click', () => {
        this.categoryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.activeCategory = pill.dataset.category || 'all';
        this.renderProducts();
      });
    });

    // Top Persona Switcher
    this.personaPills.forEach(pill => {
      pill.addEventListener('click', () => {
        this.personaPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.activePersona = pill.dataset.persona || 'all';
        this.syncPersonaCheckboxes(this.activePersona);
        this.renderProducts();
      });
    });

    // Checkbox filters
    if (this.organicFilterCheckbox) {
      this.organicFilterCheckbox.addEventListener('change', (e) => {
        this.onlyOrganic = e.target.checked;
        this.renderProducts();
      });
    }

    if (this.whatsappFilterCheckbox) {
      this.whatsappFilterCheckbox.addEventListener('change', (e) => {
        this.onlyWhatsApp = e.target.checked;
        this.renderProducts();
      });
    }

    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.renderProducts();
      });
    }

    // Cart Drawer toggling
    if (this.btnOpenCart) {
      this.btnOpenCart.addEventListener('click', () => this.openCart());
    }
    if (this.btnCloseCart) {
      this.btnCloseCart.addEventListener('click', () => this.closeCart());
    }
    if (this.cartBackdrop) {
      this.cartBackdrop.addEventListener('click', () => this.closeCart());
    }
    if (this.btnGeneratePo) {
      this.btnGeneratePo.addEventListener('click', () => this.handleGeneratePurchaseOrder());
    }

    // RFQ Dialog
    if (this.btnOpenRfqNav) {
      this.btnOpenRfqNav.addEventListener('click', () => this.openRfqDialog());
    }
    if (this.btnCloseRfq) {
      this.btnCloseRfq.addEventListener('click', () => this.closeRfqDialog());
    }
    if (this.rfqDialog) {
      this.rfqDialog.addEventListener('click', (e) => {
        if (e.target === this.rfqDialog) this.closeRfqDialog();
      });
    }
    if (this.rfqForm) {
      this.rfqForm.addEventListener('submit', (e) => this.handleRfqSubmit(e));
    }

    // Radio pills styling in RFQ form
    const freqLabels = document.querySelectorAll('.frequency-radio-label');
    freqLabels.forEach(label => {
      label.addEventListener('click', () => {
        freqLabels.forEach(l => l.classList.remove('selected'));
        label.classList.add('selected');
      });
    });

    // Listen for custom WhatsApp live listing events
    const handleListing = (e) => {
      const newProduct = e.detail;
      this.handleNewWhatsAppListing(newProduct);
    };
    window.addEventListener('kisansetu:new-whatsapp-listing', handleListing);
    window.addEventListener('krishi:new-whatsapp-listing', handleListing);
  }

  syncPersonaCheckboxes(persona) {
    const hospitalCheck = document.getElementById('personaHospitalCheck');
    const collegeCheck = document.getElementById('personaCollegeCheck');
    const restaurantCheck = document.getElementById('personaRestaurantCheck');

    if (persona === 'hospital') {
      if (hospitalCheck) hospitalCheck.checked = true;
      if (collegeCheck) collegeCheck.checked = false;
      if (restaurantCheck) restaurantCheck.checked = false;
    } else if (persona === 'college') {
      if (hospitalCheck) hospitalCheck.checked = false;
      if (collegeCheck) collegeCheck.checked = true;
      if (restaurantCheck) restaurantCheck.checked = false;
    } else if (persona === 'restaurant') {
      if (hospitalCheck) hospitalCheck.checked = false;
      if (collegeCheck) collegeCheck.checked = false;
      if (restaurantCheck) restaurantCheck.checked = true;
    }
  }

  renderProducts() {
    let filtered = this.products.filter(item => {
      // Category filter
      if (this.activeCategory !== 'all' && item.category !== this.activeCategory) {
        return false;
      }
      // Persona filter
      if (this.activePersona === 'hospital' && !item.hospitalApproved) return false;
      if (this.activePersona === 'college' && !item.messBulkFit) return false;
      if (this.activePersona === 'restaurant' && !item.restaurantFit) return false;

      // Organic filter
      if (this.onlyOrganic && !item.organic) return false;

      // WhatsApp listed filter
      if (this.onlyWhatsApp && !item.whatsappListed) return false;

      // Search query
      if (this.searchQuery) {
        const matchName = item.name.toLowerCase().includes(this.searchQuery);
        const matchHindi = item.hindiName.includes(this.searchQuery);
        const matchFarmer = item.farmer.name.toLowerCase().includes(this.searchQuery);
        const matchLocation = item.farmer.village.toLowerCase().includes(this.searchQuery);
        if (!matchName && !matchHindi && !matchFarmer && !matchLocation) return false;
      }

      return true;
    });

    // Sorting
    if (this.sortBy === 'price-low') {
      filtered.sort((a, b) => a.pricingTiers[0].pricePerKg - b.pricingTiers[0].pricePerKg);
    } else if (this.sortBy === 'price-high') {
      filtered.sort((a, b) => b.pricingTiers[0].pricePerKg - a.pricingTiers[0].pricePerKg);
    } else if (this.sortBy === 'distance') {
      filtered.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (this.sortBy === 'stock') {
      filtered.sort((a, b) => b.totalAvailableQty - a.totalAvailableQty);
    }

    if (filtered.length === 0) {
      this.productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: white; border-radius: 16px; border: 1px dashed var(--border-medium);">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">🌾</div>
          <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: var(--primary-900);">No matching bulk harvest lots found</h3>
          <p style="color: var(--text-muted); margin-top: 6px; font-size: 0.9rem;">Try clearing the search or switching categories to view all available farm batches.</p>
          <button id="btnClearFilters" style="margin-top: 18px; padding: 8px 20px; background: var(--primary-700); color: white; border: none; border-radius: 20px; font-weight: 700; cursor: pointer;">
            Reset All Filters
          </button>
        </div>
      `;
      const btnReset = document.getElementById('btnClearFilters');
      if (btnReset) {
        btnReset.addEventListener('click', () => {
          this.activeCategory = 'all';
          this.activePersona = 'all';
          this.searchQuery = '';
          this.onlyOrganic = false;
          this.onlyWhatsApp = false;
          if (this.searchInput) this.searchInput.value = '';
          this.categoryPills.forEach(p => p.classList.toggle('active', p.dataset.category === 'all'));
          this.personaPills.forEach(p => p.classList.toggle('active', p.dataset.persona === 'all'));
          this.renderProducts();
        });
      }
      return;
    }

    this.productsGrid.innerHTML = filtered.map(product => this.createProductCardHTML(product)).join('');
    this.attachCardEventListeners();
  }

  createProductCardHTML(item) {
    const lowestTier = item.pricingTiers[item.pricingTiers.length - 1];
    const initialQty = item.minOrderQty || 5;
    const initialTier = this.calculateTier(item, initialQty);

    return `
      <article class="product-card ${item.isFreshlyAdded ? 'card-whatsapp-glow' : ''}" id="card-${item.id}" data-id="${item.id}">
        <div class="card-media-wrapper">
          <img src="${item.image}" alt="${item.name}" class="card-image" loading="lazy" />
          
          <div class="card-badge-top-left">
            ${item.whatsappListed ? `
              <span class="badge-whatsapp-origin">
                <span>💬</span> WhatsApp AI Listed
              </span>
            ` : ''}
            ${item.organic ? `
              <span style="background:#047857; color:white; padding:3px 8px; border-radius:9999px; font-size:0.68rem; font-weight:700;">
                🌱 NPOP Organic
              </span>
            ` : ''}
          </div>

          <div class="card-distance-chip">
            📍 ${item.distanceKm} km away
          </div>

          <div class="card-freshness-chip">
            ⏱️ ${item.harvestTimeRelative}
          </div>
        </div>

        <div class="card-content">
          <div class="crop-names">
            <h3 class="crop-primary-name">${item.name}</h3>
            <span class="crop-secondary-name">${item.hindiName} • ${item.variety}</span>
          </div>

          <div class="farmer-strip">
            <div class="farmer-avatar">👨‍🌾</div>
            <div class="farmer-meta">
              <div class="farmer-name">
                ${item.farmer.name}
                <span class="verified-icon" title="Kisan Credit Card / Govt Verified Farmer">✓</span>
              </div>
              <div class="farmer-fpo">${item.farmer.fpo} (${item.farmer.village})</div>
            </div>
            <div style="font-size:0.75rem; font-weight:700; color:#065f46; background:#ecfdf5; padding:2px 6px; border-radius:4px;">
              ★ ${item.farmer.rating}
            </div>
          </div>

          <div class="spec-tags-row">
            ${item.qualityCertificates.map(c => `<span class="spec-tag">${c}</span>`).join('')}
            ${item.hospitalApproved ? `<span class="spec-tag tag-hospital">🏥 Hospital Safe</span>` : ''}
          </div>

          <div class="pricing-tier-box">
            <div class="tier-header">
              <div>
                <span class="active-price-kg" id="price-kg-${item.id}">₹${initialTier.pricePerKg}</span>
                <span class="active-price-unit">/ kg</span>
              </div>
              <span class="tier-discount-pill" id="tier-tag-${item.id}">
                Wholesale Tier: ${initialTier.min}+ Qtl
              </span>
            </div>

            <div class="card-qty-calculator">
              <span style="color:var(--text-muted);">Required Volume:</span>
              <div class="qty-stepper">
                <button type="button" class="btn-qty-step btn-step-down" data-id="${item.id}">-</button>
                <input type="number" class="qty-input" id="qty-input-${item.id}" value="${initialQty}" min="${item.minOrderQty}" max="${item.totalAvailableQty}" data-id="${item.id}" />
                <button type="button" class="btn-qty-step btn-step-up" data-id="${item.id}">+</button>
              </div>
              <span style="font-weight:700; color:var(--primary-700); font-size:0.8rem;">Qtl (100kg)</span>
            </div>
          </div>

          <div class="batch-stock-info">
            <span>📦 Total Available: <strong>${item.totalAvailableQty} Quintals</strong></span>
            <span>Min Order: <strong>${item.minOrderQty} Qtl</strong></span>
          </div>

          <div class="card-actions">
            <button type="button" class="btn-add-po" data-id="${item.id}">
              <span>🛒</span> Add to Bulk PO
            </button>
            <button type="button" class="btn-farmer-chat trigger-whatsapp-demo" title="Direct Contact with Farmer on WhatsApp">
              💬
            </button>
          </div>
        </div>
      </article>
    `;
  }

  calculateTier(product, qtyQuintals) {
    const q = Number(qtyQuintals);
    let matchedTier = product.pricingTiers[0];
    for (const tier of product.pricingTiers) {
      if (q >= tier.min) {
        matchedTier = tier;
      }
    }
    return matchedTier;
  }

  attachCardEventListeners() {
    // Stepper buttons & inputs
    this.productsGrid.querySelectorAll('.btn-step-up').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const input = document.getElementById(`qty-input-${id}`);
        if (!input) return;
        const product = this.products.find(p => p.id === id);
        let val = parseInt(input.value) || product.minOrderQty;
        if (val < product.totalAvailableQty) {
          val += (val >= 20 ? 5 : 2);
          if (val > product.totalAvailableQty) val = product.totalAvailableQty;
          input.value = val;
          this.updateCardTierPrice(product, val);
        }
      });
    });

    this.productsGrid.querySelectorAll('.btn-step-down').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const input = document.getElementById(`qty-input-${id}`);
        if (!input) return;
        const product = this.products.find(p => p.id === id);
        let val = parseInt(input.value) || product.minOrderQty;
        if (val > product.minOrderQty) {
          val -= (val > 20 ? 5 : 2);
          if (val < product.minOrderQty) val = product.minOrderQty;
          input.value = val;
          this.updateCardTierPrice(product, val);
        }
      });
    });

    this.productsGrid.querySelectorAll('.qty-input').forEach(input => {
      input.addEventListener('change', () => {
        const id = input.dataset.id;
        const product = this.products.find(p => p.id === id);
        let val = parseInt(input.value);
        if (isNaN(val) || val < product.minOrderQty) val = product.minOrderQty;
        if (val > product.totalAvailableQty) val = product.totalAvailableQty;
        input.value = val;
        this.updateCardTierPrice(product, val);
      });
    });

    // Add to Bulk PO button
    this.productsGrid.querySelectorAll('.btn-add-po').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const product = this.products.find(p => p.id === id);
        const qtyInput = document.getElementById(`qty-input-${id}`);
        const qty = parseInt(qtyInput ? qtyInput.value : product.minOrderQty);
        this.addToCart(product, qty);
      });
    });
  }

  updateCardTierPrice(product, qtyQuintals) {
    const tier = this.calculateTier(product, qtyQuintals);
    const priceDisplay = document.getElementById(`price-kg-${product.id}`);
    const tierTag = document.getElementById(`tier-tag-${product.id}`);
    if (priceDisplay) priceDisplay.textContent = `₹${tier.pricePerKg}`;
    if (tierTag) tierTag.textContent = `Wholesale Tier: ${tier.min}+ Qtl`;
  }

  addToCart(product, qtyQuintals) {
    const tier = this.calculateTier(product, qtyQuintals);
    const totalKg = qtyQuintals * 100;
    const lineTotal = totalKg * tier.pricePerKg;

    // Check if already in cart
    const existingIndex = this.cart.findIndex(item => item.product.id === product.id);
    if (existingIndex > -1) {
      this.cart[existingIndex].qtyQuintals = qtyQuintals;
      this.cart[existingIndex].pricePerKg = tier.pricePerKg;
      this.cart[existingIndex].lineTotal = lineTotal;
    } else {
      this.cart.push({
        product,
        qtyQuintals,
        pricePerKg: tier.pricePerKg,
        lineTotal
      });
    }

    this.updateCartBadge();
    this.renderCartItems();
    this.showToast(`✅ Added ${qtyQuintals} Quintals (${product.name}) to Bulk PO!`);
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.product.id !== productId);
    this.updateCartBadge();
    this.renderCartItems();
    this.showToast(`Removed lot from Purchase Order.`);
  }

  updateCartBadge() {
    const totalLots = this.cart.length;
    if (this.cartBadge) {
      this.cartBadge.textContent = totalLots;
      this.cartBadge.style.display = totalLots > 0 ? 'flex' : 'none';
    }
  }

  renderCartItems() {
    if (!this.cartItemsList) return;

    if (this.cart.length === 0) {
      this.cartItemsList.innerHTML = `
        <div style="text-align:center; padding:50px 20px; color:var(--text-muted);">
          <div style="font-size:2.5rem; margin-bottom:8px;">📦</div>
          <p style="font-weight:700; color:var(--text-main);">Your Purchase Order draft is empty</p>
          <p style="font-size:0.82rem; margin-top:4px;">Add fresh farm lots from the marketplace to generate institutional supply contracts.</p>
        </div>
      `;
      this.updateCartTotals(0, 0);
      return;
    }

    let subtotal = 0;
    let totalQuintals = 0;

    this.cartItemsList.innerHTML = this.cart.map(item => {
      subtotal += item.lineTotal;
      totalQuintals += item.qtyQuintals;

      return `
        <div class="cart-item">
          <img src="${item.product.image}" class="cart-item-thumb" alt="${item.product.name}" />
          <div class="cart-item-details">
            <div class="cart-item-title">${item.product.name}</div>
            <div class="cart-item-farmer">👨‍🌾 ${item.product.farmer.name} • ${item.product.farmer.village}</div>
            <div style="font-size:0.78rem; color:var(--text-muted); margin-top:2px;">
              Volume: <strong>${item.qtyQuintals} Qtl (${item.qtyQuintals * 100} kg)</strong> @ ₹${item.pricePerKg}/kg
            </div>
            <div class="cart-item-price">₹${item.lineTotal.toLocaleString('en-IN')}</div>
          </div>
          <button type="button" class="btn-remove-item" data-id="${item.product.id}" title="Remove Lot">✕</button>
        </div>
      `;
    }).join('');

    // Attach remove event
    this.cartItemsList.querySelectorAll('.btn-remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        this.removeFromCart(btn.dataset.id);
      });
    });

    this.updateCartTotals(subtotal, totalQuintals);
  }

  updateCartTotals(subtotal, totalQuintals) {
    // Estimated Freight Logistics: ₹1.8 per kg for bulk farm-gate dispatch
    const totalKg = totalQuintals * 100;
    const freight = totalQuintals > 0 ? Math.round(totalKg * 1.6) : 0;
    const gst = 0; // Essential raw unprocessed agricultural produce has 0% GST in India
    const total = subtotal + freight + gst;

    if (this.cartSubtotal) this.cartSubtotal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    if (this.cartFreight) this.cartFreight.textContent = `₹${freight.toLocaleString('en-IN')}`;
    if (this.cartGst) this.cartGst.textContent = `₹0 (Exempted)`;
    if (this.cartTotal) this.cartTotal.textContent = `₹${total.toLocaleString('en-IN')}`;
    if (this.cartWeightMetric) {
      const metricTonnes = (totalKg / 1000).toFixed(2);
      this.cartWeightMetric.textContent = `${totalQuintals} Quintals (${metricTonnes} MT)`;
    }
  }

  openCart() {
    this.renderCartItems();
    if (this.cartDrawer) this.cartDrawer.classList.add('open');
    if (this.cartBackdrop) this.cartBackdrop.classList.add('open');
  }

  closeCart() {
    if (this.cartDrawer) this.cartDrawer.classList.remove('open');
    if (this.cartBackdrop) this.cartBackdrop.classList.remove('open');
  }

  handleGeneratePurchaseOrder() {
    if (this.cart.length === 0) {
      this.showToast("⚠️ Please add at least one crop lot before generating a Purchase Order.");
      return;
    }
    const poNumber = "PO-KS-" + Math.floor(10000 + Math.random() * 90000);
    this.showToast(`📄 Purchase Order #${poNumber} generated successfully! Opening printable view...`);
    setTimeout(() => {
      window.print();
    }, 800);
  }

  // RFQ Modal logic
  openRfqDialog() {
    if (this.rfqDialog) this.rfqDialog.showModal();
  }

  closeRfqDialog() {
    if (this.rfqDialog) this.rfqDialog.close();
  }

  handleRfqSubmit(e) {
    e.preventDefault();
    const instName = document.getElementById('rfqInstName')?.value || 'Institution';
    const crops = document.getElementById('rfqCrops')?.value || 'General Produce';

    this.closeRfqDialog();
    this.showToast(`📋 RFQ Received for ${instName}! AI is matching 8 local FPOs within 45km.`);
    if (this.rfqForm) this.rfqForm.reset();
  }

  // WhatsApp listing live integration
  handleNewWhatsAppListing(newProduct) {
    this.products.unshift(newProduct);
    this.renderProducts();
    this.showWhatsAppCelebrationToast(newProduct);
  }

  showWhatsAppCelebrationToast(product) {
    const toast = document.createElement('div');
    toast.className = 'sync-celebration-toast';
    toast.innerHTML = `
      <div style="font-size: 1.8rem;">🎉</div>
      <div>
        <div style="font-weight: 800; font-size: 0.96rem; font-family: var(--font-heading);">
          New Harvest Listed via WhatsApp Chatbot!
        </div>
        <div style="font-size: 0.82rem; color: #a7f3d0; margin-top: 2px;">
          ${product.name} (${product.totalAvailableQty} Quintals) listed by ${product.farmer.name} is now live on the marketplace.
        </div>
      </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.5s ease';
      setTimeout(() => toast.remove(), 500);
    }, 4500);
  }

  showToast(message) {
    if (!this.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `<span>⚡</span><span>${message}</span>`;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.kisanApp = new KisanSetuApp();
  window.krishiApp = window.kisanApp; // Alias for backward compatibility
  window.waSimulator = initWhatsAppSimulator();
});
