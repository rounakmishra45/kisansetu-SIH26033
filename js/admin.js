// ==========================================================================
// KisanSetu B2B - Ministry of Consumer Affairs, Food & Public Distribution
// Executive Command & Price Intelligence Dashboard Controller
// ==========================================================================

import { ministryData } from './admin-data.js';

class MinistryDashboard {
  constructor() {
    this.data = JSON.parse(JSON.stringify(ministryData));
    this.activeCategory = 'all';
    this.searchQuery = '';

    this.initElements();
    this.bindEvents();
    this.renderAll();
  }

  initElements() {
    // Tabs
    this.tabButtons = document.querySelectorAll('.admin-tab-btn');
    this.tabPanels = document.querySelectorAll('.admin-panel-view');

    // Commodity Radar
    this.commodityTableBody = document.getElementById('commodityTableBody');
    this.categoryFilter = document.getElementById('commodityCategoryFilter');
    this.searchInput = document.getElementById('commoditySearchInput');

    // Hoarding Alerts
    this.hoardingContainer = document.getElementById('hoardingAlertsContainer');
    this.hoardingCountBadge = document.getElementById('hoardingCountBadge');

    // State Procurement
    this.stateProgressContainer = document.getElementById('stateProgressContainer');

    // DBT Table
    this.dbtTableBody = document.getElementById('dbtTableBody');

    // Orders Table
    this.ordersTableBody = document.getElementById('ordersTableBody');

    // Modal
    this.modal = document.getElementById('interventionModal');
    this.openInterventionBtn = document.getElementById('openInterventionBtn');
    this.triggerNewOrderBtn = document.getElementById('triggerNewOrderBtn');
    this.closeModalBtn = document.getElementById('closeModalBtn');
    this.cancelModalBtn = document.getElementById('cancelModalBtn');
    this.interventionForm = document.getElementById('interventionForm');
    this.orderPreviewBox = document.getElementById('orderPreviewBox');

    // Modal Inputs
    this.orderTypeSelect = document.getElementById('orderInterventionType');
    this.orderCommoditySelect = document.getElementById('orderCommodity');
    this.orderVolumeInput = document.getElementById('orderVolume');
    this.orderZoneInput = document.getElementById('orderZone');

    // Print
    this.printBtn = document.getElementById('printReportBtn');
  }

  bindEvents() {
    // Tab switching
    this.tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        this.switchTab(targetId, btn);
      });
    });

    // Filters
    if (this.categoryFilter) {
      this.categoryFilter.addEventListener('change', (e) => {
        this.activeCategory = e.target.value;
        this.renderCommodityRadar();
      });
    }

    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderCommodityRadar();
      });
    }

    // Modal Controls
    if (this.openInterventionBtn) {
      this.openInterventionBtn.addEventListener('click', () => this.openInterventionModal());
    }

    if (this.triggerNewOrderBtn) {
      this.triggerNewOrderBtn.addEventListener('click', () => this.openInterventionModal());
    }

    if (this.closeModalBtn) {
      this.closeModalBtn.addEventListener('click', () => this.modal.close());
    }

    if (this.cancelModalBtn) {
      this.cancelModalBtn.addEventListener('click', () => this.modal.close());
    }

    // Dynamic order preview update
    const updatePreview = () => this.updateOrderPreview();
    [this.orderTypeSelect, this.orderCommoditySelect, this.orderVolumeInput, this.orderZoneInput].forEach(elem => {
      if (elem) elem.addEventListener('input', updatePreview);
    });

    // Form Submit
    if (this.interventionForm) {
      this.interventionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleOrderSubmission();
      });
    }

    // Print Daily Bulletin
    if (this.printBtn) {
      this.printBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  switchTab(targetId, activeBtn) {
    this.tabButtons.forEach(btn => btn.classList.remove('active'));
    this.tabPanels.forEach(panel => panel.classList.remove('active-panel'));

    activeBtn.classList.add('active');
    const activePanel = document.getElementById(targetId);
    if (activePanel) {
      activePanel.classList.add('active-panel');
    }
  }

  renderAll() {
    this.renderCommodityRadar();
    this.renderHoardingAlerts();
    this.renderStateProcurement();
    this.renderDbtDisbursements();
    this.renderOrders();
  }

  // 1. Render Commodity Radar
  renderCommodityRadar() {
    if (!this.commodityTableBody) return;

    let filtered = this.data.commodityRadar.filter(item => {
      const matchCat = this.activeCategory === 'all' || item.category === this.activeCategory;
      const matchSearch = !this.searchQuery ||
        item.commodity.toLowerCase().includes(this.searchQuery) ||
        item.keyMandi.toLowerCase().includes(this.searchQuery);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      this.commodityTableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 32px; color: #94a3b8;">
            No commodities match your filter criteria.
          </td>
        </tr>
      `;
      return;
    }

    this.commodityTableBody.innerHTML = filtered.map(item => {
      let riskTag = 'success';
      if (item.hoardingRisk === 'CRITICAL') riskTag = 'critical';
      else if (item.hoardingRisk === 'HIGH' || item.hoardingRisk === 'MEDIUM') riskTag = 'warning';

      let spreadClass = 'spread-low';
      if (item.middlemanSpreadPct > 100) spreadClass = 'spread-high';
      else if (item.middlemanSpreadPct > 60) spreadClass = 'spread-med';

      return `
        <tr>
          <td>
            <div class="commodity-name-cell">
              <span class="commodity-main">${item.commodity}</span>
              <span class="commodity-sub">${item.hindiName}</span>
            </div>
          </td>
          <td>
            <div style="font-size: 0.84rem; color: #cbd5e1;">${item.keyMandi}</div>
            <span style="font-size: 0.72rem; color: #94a3b8;">Available: ${item.availableFpoVolumeMT.toLocaleString()} MT</span>
          </td>
          <td>
            <span class="price-box-bad">₹${item.mandiRetailRate}</span>
            <span style="font-size: 0.72rem; color: #94a3b8; display: block;">Wholesale: ₹${item.mandiWholesaleRate}</span>
          </td>
          <td>
            <span class="price-box-good">₹${item.kisanSetuFarmGateRate}</span>
            <span style="font-size: 0.72rem; color: #34d399; display: block;">Direct Farm Gate</span>
          </td>
          <td>
            <span style="color: #94a3b8; font-weight: 600;">₹${item.mspBufferBenchmark}</span>
            <span style="font-size: 0.7rem; color: #64748b; display: block;">Govt Baseline</span>
          </td>
          <td>
            <span class="price-spread-badge ${spreadClass}">
              +${item.middlemanSpreadPct}% Markup
            </span>
          </td>
          <td>
            <span class="status-tag ${riskTag}">
              ● ${item.hoardingRisk} (${item.hoardingRiskScore}%)
            </span>
          </td>
          <td>
            <button type="button" class="table-btn-action" data-quick-action="${item.commodity}">
              ⚡ Intervene
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Bind quick action intervention buttons
    this.commodityTableBody.querySelectorAll('[data-quick-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const cropName = btn.getAttribute('data-quick-action');
        this.openInterventionModal(cropName);
      });
    });
  }

  // 2. Render Hoarding Alerts
  renderHoardingAlerts() {
    if (!this.hoardingContainer) return;

    this.hoardingContainer.innerHTML = this.data.hoardingAlerts.map(alert => {
      let severityClass = 'medium';
      if (alert.severity === 'CRITICAL') severityClass = 'critical';
      else if (alert.severity === 'HIGH') severityClass = 'high';

      return `
        <div class="alert-card ${severityClass}">
          <div class="alert-card-top">
            <span class="alert-id">${alert.id}</span>
            <span class="status-tag ${severityClass === 'critical' ? 'critical' : 'warning'}">
              ${alert.severity} • ${alert.confidence} Conf.
            </span>
          </div>
          <div>
            <div class="alert-title">${alert.commodity} Inflow Suppression</div>
            <div class="alert-location">📍 ${alert.mandi} (${alert.district})</div>
          </div>
          <div class="alert-desc-box">
            ${alert.anomalyDescription}
          </div>
          <div class="alert-rec-box">
            <strong>📋 Directive Recommendation:</strong><br />
            ${alert.recommendedAction}
          </div>
          <div class="alert-actions-bar">
            <span style="font-size: 0.74rem; color: #94a3b8;">Status: <strong>${alert.status}</strong></span>
            <button type="button" class="table-btn-action" data-alert-resolve="${alert.id}">
              Execute Protocol
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Bind resolve buttons
    this.hoardingContainer.querySelectorAll('[data-alert-resolve]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-alert-resolve');
        this.resolveHoardingAlert(id);
      });
    });
  }

  resolveHoardingAlert(alertId) {
    const alert = this.data.hoardingAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = "DIRECTIVE_DISPATCHED";
      this.showToast(`🚨 ECA Inspection notice dispatched for ${alert.mandi}!`);
      this.renderHoardingAlerts();
    }
  }

  // 3. Render State Procurement
  renderStateProcurement() {
    if (!this.stateProgressContainer) return;

    this.stateProgressContainer.innerHTML = this.data.stateProcurement.map(state => {
      const pct = Math.min(100, Math.round((state.achievedMT / state.targetMT) * 100));
      return `
        <div class="state-progress-card">
          <div class="state-header-row">
            <div>
              <span class="state-name-bold">🇮🇳 ${state.state} (${state.code})</span>
              <div style="font-size: 0.76rem; color: #94a3b8; margin-top: 2px;">
                ${state.activeFpos} Partner FPOs • ${state.participatingInstitutions} Kitchens Supplied
              </div>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 1.1rem; font-weight: 800; color: #34d399;">${pct}%</span>
              <span style="font-size: 0.7rem; color: #94a3b8; display: block;">Achieved</span>
            </div>
          </div>

          <div class="progress-track" title="${pct}% Completed">
            <div class="progress-fill" style="width: ${pct}%;"></div>
          </div>

          <div class="progress-meta-row">
            <span>Procured: <strong style="color: #ffffff;">${state.achievedMT.toLocaleString()} MT</strong> / ${state.targetMT.toLocaleString()} MT</span>
            <span style="color: #cbd5e1;">Top: ${state.topCrops.slice(0, 2).join(', ')}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // 4. Render DBT Table
  renderDbtDisbursements() {
    if (!this.dbtTableBody) return;

    this.dbtTableBody.innerHTML = this.data.dbtDisbursements.map(tx => `
      <tr>
        <td>
          <span style="font-family: monospace; font-size: 0.8rem; color: #94a3b8;">${tx.txId}</span>
          <span style="font-size: 0.72rem; color: #64748b; display: block;">${tx.timestamp}</span>
        </td>
        <td>
          <strong style="color: #ffffff;">${tx.farmerName}</strong>
          <span style="font-size: 0.74rem; color: #94a3b8; display: block;">${tx.fpo}</span>
        </td>
        <td>
          <span style="font-size: 0.84rem; color: #e2e8f0;">${tx.buyerInstitution}</span>
        </td>
        <td>
          <span style="font-size: 0.84rem; color: #cbd5e1;">${tx.crop}</span>
        </td>
        <td>
          <span style="color: #34d399; font-weight: 700; font-size: 0.92rem;">${tx.amount}</span>
          <span style="font-size: 0.7rem; color: #94a3b8; display: block;">${tx.payoutMode}</span>
        </td>
        <td>
          <span class="status-tag success">${tx.leakage}</span>
        </td>
        <td>
          <span class="status-tag success">✓ ${tx.status}</span>
        </td>
      </tr>
    `).join('');
  }

  // 5. Render Orders Table
  renderOrders() {
    if (!this.ordersTableBody) return;

    this.ordersTableBody.innerHTML = this.data.recentOfficialOrders.map(order => `
      <tr>
        <td>
          <span style="font-family: monospace; font-weight: 700; color: #60a5fa;">${order.id}</span>
        </td>
        <td>
          <strong style="color: #ffffff;">${order.title}</strong>
        </td>
        <td>
          <span style="font-size: 0.84rem; color: #cbd5e1;">${order.authorizedBy}</span>
        </td>
        <td>
          <span style="font-size: 0.82rem; color: #94a3b8;">${order.targetZones}</span>
        </td>
        <td>
          <span style="font-size: 0.82rem; color: #34d399;">${order.effect}</span>
        </td>
        <td>
          <span style="font-size: 0.78rem; color: #94a3b8;">${order.date}</span>
        </td>
        <td>
          <span class="status-tag ${order.status === 'ACTIVE' ? 'warning' : 'success'}">
            ${order.status}
          </span>
        </td>
      </tr>
    `).join('');
  }

  // Modal & Order Generation
  openInterventionModal(preselectedCommodity = null) {
    if (preselectedCommodity && this.orderCommoditySelect) {
      // Find matching option
      for (let option of this.orderCommoditySelect.options) {
        if (option.text.toLowerCase().includes(preselectedCommodity.toLowerCase().slice(0, 5))) {
          option.selected = true;
          break;
        }
      }
    }
    this.updateOrderPreview();
    if (this.modal) this.modal.showModal();
  }

  updateOrderPreview() {
    if (!this.orderPreviewBox) return;

    const typeText = this.orderTypeSelect ? this.orderTypeSelect.options[this.orderTypeSelect.selectedIndex].text : 'Buffer Release';
    const commodity = this.orderCommoditySelect ? this.orderCommoditySelect.value : 'Onion';
    const volume = this.orderVolumeInput ? this.orderVolumeInput.value : 4000;
    const zone = this.orderZoneInput ? this.orderZoneInput.value : 'All India';
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    this.orderPreviewBox.innerHTML = `
      GOVERNMENT OF INDIA<br />
      MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION<br />
      DEPARTMENT OF CONSUMER AFFAIRS • PRICE MONITORING DIVISION<br />
      --------------------------------------------------------------<br />
      ORDER REFERENCE : GOI-DOCA-2026-ORD-${Math.floor(100 + Math.random() * 900)}<br />
      DATE            : ${dateStr}<br />
      ACTION PROTOCOL : ${typeText.toUpperCase()}<br />
      TARGET PRODUCE  : ${commodity.toUpperCase()} (${volume.toLocaleString()} METRIC TONNES)<br />
      INTERVENTION HUB: ${zone.toUpperCase()}<br />
      SIGNATORY       : DR. RAJESHWAR SHARMA, IAS (JOINT SECRETARY)<br />
      STATUS          : PENDING TRANSMISSION TO NAFED & STATE AGENCIES
    `;
  }

  handleOrderSubmission() {
    const typeText = this.orderTypeSelect.options[this.orderTypeSelect.selectedIndex].text;
    const commodity = this.orderCommoditySelect.value;
    const volume = Number(this.orderVolumeInput.value);
    const zone = this.orderZoneInput.value;
    const newId = `GOI-DOCA-2026-ORD-${Math.floor(200 + Math.random() * 800)}`;

    const newOrder = {
      id: newId,
      title: `${typeText.split('(')[0].trim()}: ${volume.toLocaleString()} MT ${commodity}`,
      authorizedBy: "Dr. Rajeshwar Sharma, IAS",
      targetZones: zone,
      effect: `Immediate price stabilization protocol active. Buffer stock dispatched via KisanSetu direct rail/road network.`,
      date: "Today",
      status: "ACTIVE"
    };

    // Prepend order
    this.data.recentOfficialOrders.unshift(newOrder);
    this.renderOrders();

    // Close modal
    this.modal.close();

    // Success Toast
    this.showToast(`🏛️ Ministerial Order ${newId} authorized & broadcasted successfully!`);

    // Switch to orders tab
    const ordersTabBtn = document.querySelector('[data-target="tabOrders"]');
    if (ordersTabBtn) {
      this.switchTab('tabOrders', ordersTabBtn);
    }
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'gov-toast';
    toast.innerHTML = `<span>🛡️</span> <span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.ministryDashboard = new MinistryDashboard();
});
