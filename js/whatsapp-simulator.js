// ==========================================================================
// KisanSetu B2B - WhatsApp Chatbot Simulator Logic
// Natural Language / Voice Note parsing and live synchronization with marketplace
// ==========================================================================

import { whatsappDemoScenarios } from './data.js';

class WhatsAppBotSimulator {
  constructor() {
    this.dialog = document.getElementById('whatsappSimulatorDialog');
    this.messagesContainer = document.getElementById('waMessagesContainer');
    this.scenarioChips = document.querySelectorAll('.wa-chip');
    this.inputField = document.getElementById('waInputField');
    this.sendBtn = document.getElementById('waSendBtn');
    this.micBtn = document.getElementById('waMicBtn');
    this.closeBtn = document.getElementById('waCloseBtn');
    this.triggers = document.querySelectorAll('.trigger-whatsapp-demo');

    this.activeScenarioIndex = 0;
    this.isListeningVoice = false;
    this.init();
  }

  init() {
    // Attach trigger listeners
    this.triggers.forEach(trigger => {
      trigger.addEventListener('click', () => this.openSimulator());
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeSimulator());
    }

    // Light dismiss when clicking outside dialog
    if (this.dialog) {
      this.dialog.addEventListener('click', (e) => {
        if (e.target === this.dialog) this.closeSimulator();
      });
    }

    // Scenario chip clicks
    this.scenarioChips.forEach((chip, index) => {
      chip.addEventListener('click', () => {
        this.scenarioChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.loadScenario(index);
      });
    });

    // Custom message submission
    if (this.sendBtn && this.inputField) {
      this.sendBtn.addEventListener('click', () => this.handleCustomMessage());
      this.inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.handleCustomMessage();
      });
    }

    // Voice note simulation button
    if (this.micBtn) {
      this.micBtn.addEventListener('click', () => this.simulateVoiceRecording());
    }

    // Load first scenario by default
    this.loadScenario(0);
  }

  openSimulator() {
    if (this.dialog) {
      this.dialog.showModal();
      this.scrollToBottom();
    }
  }

  closeSimulator() {
    if (this.dialog) {
      this.dialog.close();
    }
  }

  loadScenario(index) {
    const scenario = whatsappDemoScenarios[index];
    if (!scenario) return;
    this.activeScenarioIndex = index;

    // Clear and build realistic chat history
    this.messagesContainer.innerHTML = '';

    // Initial greeting from bot
    this.appendBotBubble(
      `🙏 **राम-राम! किसान सेतु किसान सहायक में आपका स्वागत है।**\n\nआप अपनी नई फसल की जानकारी (फसल का नाम, मात्रा, रेट, और जगह) यहाँ बोलकर (ऑडियो नोट) या लिखकर भेज सकते हैं।`
    );

    // Farmer's voice note mockup
    this.appendVoiceNoteBubble(scenario.farmerName, scenario.voiceNoteDuration);

    // Farmer's transcription text
    this.appendFarmerBubble(scenario.incomingRawText);

    // Bot AI Processing & extraction card
    setTimeout(() => {
      this.appendAiExtractionCard(scenario.parsedDetails, scenario.farmerName);
    }, 450);
  }

  appendFarmerBubble(text) {
    const bubble = document.createElement('div');
    bubble.className = 'wa-bubble wa-bubble-sent';
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    bubble.innerHTML = `
      <div>${text}</div>
      <div class="wa-msg-meta">
        <span>${now}</span>
        <span class="wa-read-check">✓✓</span>
      </div>
    `;
    this.messagesContainer.appendChild(bubble);
    this.scrollToBottom();
  }

  appendVoiceNoteBubble(farmerName, duration) {
    const bubble = document.createElement('div');
    bubble.className = 'wa-bubble wa-bubble-sent';
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    bubble.innerHTML = `
      <div class="wa-voice-note">
        <button type="button" class="wa-play-btn" title="Play Voice Note">▶</button>
        <div class="wa-waveform">
          <div class="wa-waveform-bar"></div>
          <div class="wa-waveform-bar"></div>
          <div class="wa-waveform-bar"></div>
          <div class="wa-waveform-bar"></div>
          <div class="wa-waveform-bar"></div>
          <div class="wa-waveform-bar"></div>
          <div class="wa-waveform-bar"></div>
          <div class="wa-waveform-bar"></div>
          <div class="wa-waveform-bar"></div>
        </div>
        <span style="font-size:0.75rem; color:#54656f; font-weight:600;">${duration}</span>
      </div>
      <div style="font-size:0.72rem; color:#075e54; font-weight:600; margin-top:2px;">
        🎤 Audio Note from ${farmerName} (Transcribed via Bhashini AI)
      </div>
      <div class="wa-msg-meta">
        <span>${now}</span>
        <span class="wa-read-check">✓✓</span>
      </div>
    `;
    this.messagesContainer.appendChild(bubble);
    this.scrollToBottom();
  }

  appendBotBubble(text) {
    const bubble = document.createElement('div');
    bubble.className = 'wa-bubble wa-bubble-received';
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    bubble.innerHTML = `
      <div style="white-space: pre-line;">${text}</div>
      <div class="wa-msg-meta">
        <span>${now}</span>
      </div>
    `;
    this.messagesContainer.appendChild(bubble);
    this.scrollToBottom();
  }

  appendAiExtractionCard(details, farmerName) {
    const bubble = document.createElement('div');
    bubble.className = 'wa-bubble wa-bubble-received';
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    bubble.innerHTML = `
      <div><strong>✅ AI Parsing Successful!</strong></div>
      <div style="font-size: 0.8rem; color:#334155; margin-top: 2px;">
        किसान सेतु AI ने आपकी फसल की जानकारी स्वचालित रूप से निकाल ली है:
      </div>
      <div class="wa-ai-parsed-card">
        <div class="ai-badge">⚡ ${details.confidence}</div>
        <div class="ai-parsed-row">
          <span class="ai-parsed-key">🌾 फसल (Crop):</span>
          <span class="ai-parsed-val">${details.crop} (${details.hindiName})</span>
        </div>
        <div class="ai-parsed-row">
          <span class="ai-parsed-key">📦 कुल मात्रा (Qty):</span>
          <span class="ai-parsed-val">${details.quantity}</span>
        </div>
        <div class="ai-parsed-row">
          <span class="ai-parsed-key">💰 मांग दर (Price):</span>
          <span class="ai-parsed-val">${details.askingPrice}</span>
        </div>
        <div class="ai-parsed-row">
          <span class="ai-parsed-key">📍 स्थान (Location):</span>
          <span class="ai-parsed-val">${details.location}</span>
        </div>
        <div class="ai-parsed-row">
          <span class="ai-parsed-key">🎖️ गुणवत्ता (Grade):</span>
          <span class="ai-parsed-val">${details.grade}</span>
        </div>
      </div>
      <button type="button" class="btn-wa-publish-action" id="btnPublishToLiveMarket">
        🚀 Publish Live to Institutional Marketplace
      </button>
      <div class="wa-msg-meta">
        <span>${now}</span>
      </div>
    `;

    this.messagesContainer.appendChild(bubble);
    this.scrollToBottom();

    // Attach publish event
    const publishBtn = bubble.querySelector('#btnPublishToLiveMarket');
    if (publishBtn) {
      publishBtn.addEventListener('click', () => {
        this.publishListingToMarketplace(details, farmerName);
      });
    }
  }

  handleCustomMessage() {
    const text = this.inputField.value.trim();
    if (!text) return;
    this.inputField.value = '';

    this.appendFarmerBubble(text);

    // Simple natural language extractor simulation
    const parsed = this.parseNaturalText(text);

    setTimeout(() => {
      this.appendAiExtractionCard(parsed, "Kisan Bhai (Custom WhatsApp)");
    }, 600);
  }

  simulateVoiceRecording() {
    this.appendVoiceNoteBubble("Voice Note (Mic Input)", "0:09");
    const simulatedTranscription = "50 quintal fresh A-Grade potatoes from Aligarh farm, expecting 16 rupees per kg, ready for college mess.";
    setTimeout(() => {
      this.appendFarmerBubble(simulatedTranscription);
      const parsed = this.parseNaturalText(simulatedTranscription);
      setTimeout(() => {
        this.appendAiExtractionCard(parsed, "Farmer (Voice Transcribed)");
      }, 500);
    }, 400);
  }

  parseNaturalText(text) {
    const lower = text.toLowerCase();
    let crop = "Fresh Harvest Lot";
    let hindiName = "ताज़ी फसल";
    let category = "vegetables";
    let qty = "30 Quintals (3,000 kg)";
    let price = "₹22 / kg";
    let location = "Local Regional Farm";

    if (lower.includes("onion") || lower.includes("प्याज") || lower.includes("pyaaz")) {
      crop = "Direct Farm Red Onions";
      hindiName = "नासिक लाल प्याज";
      category = "vegetables";
      price = "₹19 / kg";
    } else if (lower.includes("rice") || lower.includes("चावल") || lower.includes("basmati")) {
      crop = "Direct Farm Basmati Rice";
      hindiName = "बासमती चावल";
      category = "grains";
      price = "₹78 / kg";
    } else if (lower.includes("potato") || lower.includes("आलू") || lower.includes("aloo")) {
      crop = "Fresh Harvest Cold-Store Potatoes";
      hindiName = "खेत से ताज़ा आलू";
      category = "vegetables";
      price = "₹16 / kg";
    } else if (lower.includes("apple") || lower.includes("सेब")) {
      crop = "Shimla Orchard Royal Apples";
      hindiName = "शिमला सेब";
      category = "fruits";
      price = "₹85 / kg";
    }

    // Try to extract numbers for quantity and price
    const numMatches = text.match(/\d+/g);
    if (numMatches && numMatches.length > 0) {
      qty = `${numMatches[0]} Quintals (${parseInt(numMatches[0]) * 100} kg)`;
      if (numMatches.length > 1) {
        price = `₹${numMatches[1]} / kg`;
      }
    }

    return {
      crop,
      hindiName,
      category,
      quantity: qty,
      askingPrice: price,
      location: location,
      grade: "A-Grade FSSAI Compliant",
      harvestTime: "Harvested Today",
      confidence: "97.8% AI Match"
    };
  }

  publishListingToMarketplace(details, farmerName) {
    // Synthesize clean numerical values
    const cleanQty = parseInt(details.quantity) || 30;
    const priceKgMatch = details.askingPrice.match(/\d+(\.\d+)?/);
    const basePriceKg = priceKgMatch ? parseFloat(priceKgMatch[0]) : 20;

    const newProduct = {
      id: "KS-" + Math.floor(1000 + Math.random() * 9000),
      name: details.crop,
      hindiName: details.hindiName,
      category: details.category || "vegetables",
      variety: details.grade || "A-Grade Farm Graded",
      farmer: {
        name: farmerName.replace(/👨|🌾|👳|👩|🔬/g, '').trim() || "Kisan Sahayak Member",
        village: details.location.split(',')[0] || "Regional Farm Cluster",
        state: details.location.split(',')[1] || "India",
        phone: "+91 98XXX XXXXX",
        experience: "10+ years",
        fpo: "Local Kisan Samriddhi FPO",
        verified: true,
        rating: 5.0,
        totalOrders: 1
      },
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
      harvestDate: "Just Plucked & Verified",
      harvestTimeRelative: "Just Now via WhatsApp",
      distanceKm: 24,
      totalAvailableQty: cleanQty,
      minOrderQty: 2,
      unit: "Quintal (100 kg)",
      pricingTiers: [
        { min: 2, max: 10, pricePerKg: Math.round(basePriceKg * 1.15 * 10) / 10, pricePerQuintal: Math.round(basePriceKg * 1.15 * 100) },
        { min: 11, max: 25, pricePerKg: basePriceKg, pricePerQuintal: basePriceKg * 100 },
        { min: 26, max: 999, pricePerKg: Math.round(basePriceKg * 0.9 * 10) / 10, pricePerQuintal: Math.round(basePriceKg * 0.9 * 100) }
      ],
      qualityCertificates: ["WhatsApp AI Inspected", "Direct From Farm Gate", "Zero Middleman Margin"],
      specifications: {
        listingSource: "WhatsApp Conversational Bot (Bhashini AI)",
        packaging: "Standard 50kg Gunny / Mesh",
        verificationConfidence: details.confidence || "98% AI Matched"
      },
      tags: ["Just Listed via WhatsApp", "Instant Farm Gate Dispatch"],
      institutionFit: ["hospital", "college", "restaurant"],
      hospitalApproved: true,
      messBulkFit: true,
      restaurantFit: true,
      organic: true,
      whatsappListed: true,
      isFreshlyAdded: true
    };

    // Play subtle audio tone using Web Audio API
    this.playSuccessChime();

    // Dispatch event to app.js
    const event = new CustomEvent('kisansetu:new-whatsapp-listing', {
      detail: newProduct
    });
    window.dispatchEvent(event);
    window.dispatchEvent(new CustomEvent('krishi:new-whatsapp-listing', { detail: newProduct }));

    // Show bot confirmation bubble
    this.appendBotBubble(
      `🎉 **बधाई हो! आपकी फसल सफलतापूर्बक लिस्ट हो गई है!**\n\n🔖 **Listing ID**: #${newProduct.id}\n🛒 अब अस्पताल, कॉलेज कैंटीन और रेस्टोरेंट आपकी फसल को सीधे खरीद सकते हैं।`
    );

    // Close WhatsApp dialog after 1.2s to guide user attention to the glowing new item on the marketplace!
    setTimeout(() => {
      this.closeSimulator();
      const marketSection = document.getElementById('marketplace');
      if (marketSection) {
        marketSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1400);
  }

  playSuccessChime() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880.00, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      // AudioContext unavailable or restricted, fail silently
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }, 50);
  }
}

export function initWhatsAppSimulator() {
  return new WhatsAppBotSimulator();
}
