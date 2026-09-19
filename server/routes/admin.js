// ==============================================================================
// KisanSetu B2B - Ministry of Consumer Affairs, Food & Public Distribution Router
// Market Surveillance, Price Parity Radar, Anti-Hoarding & Executive Directives
// ==============================================================================

import { Router } from 'express';

const router = Router();

// Master agricultural price intelligence dataset
const marketIntelligenceData = {
  kpis: {
    institutionalSavingsRate: "28.4%",
    farmerTakeHomeRealization: "74.6%",
    totalBufferDirectProcuredMT: 18450,
    fssaiResiduePassRate: "99.4%",
    totalDirectDisbursedRupees: "₹42.8 Crore",
    monitoredApmsCount: 2410
  },

  commodityRadar: [
    {
      id: "onion-red",
      commodity: "Nashik Red Hybrid Onion",
      hindiName: "नासिक लाल प्याज",
      category: "vegetables",
      keyMandi: "Lasalgaon APMC, MH",
      mandiRetailRate: 44,
      mandiWholesaleRate: 30,
      kisanSetuFarmGateRate: 21,
      mspBufferBenchmark: 18,
      middlemanSpreadPct: 109,
      hoardingRisk: "CRITICAL",
      hoardingRiskScore: 94,
      weeklyInflationTrend: "+18.2%",
      availableFpoVolumeMT: 3400
    },
    {
      id: "tomato-hybrid",
      commodity: "Kolar Field Fresh Hybrid Tomato",
      hindiName: "कोलार हाइब्रिड टमाटर",
      category: "vegetables",
      keyMandi: "Kolar APMC, KA",
      mandiRetailRate: 38,
      mandiWholesaleRate: 27,
      kisanSetuFarmGateRate: 18,
      mspBufferBenchmark: 15,
      middlemanSpreadPct: 111,
      hoardingRisk: "HIGH",
      hoardingRiskScore: 82,
      weeklyInflationTrend: "+12.4%",
      availableFpoVolumeMT: 2100
    },
    {
      id: "wheat-sharbati",
      commodity: "Sehore Sharbati Golden Wheat",
      hindiName: "सीहोर शरबती गेहूं",
      category: "grains",
      keyMandi: "Sehore Mandi, MP",
      mandiRetailRate: 46,
      mandiWholesaleRate: 36,
      kisanSetuFarmGateRate: 29,
      mspBufferBenchmark: 22.75,
      middlemanSpreadPct: 58,
      hoardingRisk: "LOW",
      hoardingRiskScore: 24,
      weeklyInflationTrend: "-1.8%",
      availableFpoVolumeMT: 6200
    },
    {
      id: "chana-dal",
      commodity: "Latur Unpolished Desi Chana Dal",
      hindiName: "लातूर चना दाल",
      category: "pulses",
      keyMandi: "Latur Grain Mandi, MH",
      mandiRetailRate: 96,
      mandiWholesaleRate: 80,
      kisanSetuFarmGateRate: 64,
      mspBufferBenchmark: 54.40,
      middlemanSpreadPct: 50,
      hoardingRisk: "MEDIUM",
      hoardingRiskScore: 68,
      weeklyInflationTrend: "+6.5%",
      availableFpoVolumeMT: 1850
    },
    {
      id: "potato-jyoti",
      commodity: "Agra Cold-Chain Table Potato",
      hindiName: "आगरा टेबल आलू",
      category: "vegetables",
      keyMandi: "Fatehabad Mandi, UP",
      mandiRetailRate: 28,
      mandiWholesaleRate: 20,
      kisanSetuFarmGateRate: 13,
      mspBufferBenchmark: 11.50,
      middlemanSpreadPct: 115,
      hoardingRisk: "MEDIUM",
      hoardingRiskScore: 62,
      weeklyInflationTrend: "+4.2%",
      availableFpoVolumeMT: 4500
    }
  ],

  hoardingAlerts: [
    {
      id: "ALT-2026-901",
      mandi: "Lasalgaon & Pimpalgaon Wholesale Market",
      district: "Nashik, Maharashtra",
      commodity: "Red Onion",
      severity: "CRITICAL",
      confidence: "95.4%",
      anomalyDescription: "3 private cold storages holding 5,400 MT despite harvest peak. Daily arrivals dropped 42% while farm-gate supplies remain abundant.",
      recommendedAction: "Invoke Essential Commodities Act (ECA) Section 3 stock-holding inspection & release 4,000 MT buffer stock.",
      status: "ACTION_REQUIRED"
    },
    {
      id: "ALT-2026-902",
      mandi: "Kolar Vegetable Terminal Market",
      district: "Kolar, Karnataka",
      commodity: "Hybrid Tomato",
      severity: "HIGH",
      confidence: "88.7%",
      anomalyDescription: "Syndicate commission agents demanding ₹6/kg unloading cut, causing 18-hour transport delays to institutional kitchens.",
      recommendedAction: "Activate KisanSetu direct green corridor bypassing APMC gate with digital transit pass.",
      status: "IN_REVIEW"
    }
  ],

  stateBufferQuotas: [
    { state: "Maharashtra", code: "MH", targetMT: 12000, achievedMT: 10840, activeFpos: 54, status: "EXCELLENT" },
    { state: "Madhya Pradesh", code: "MP", targetMT: 15000, achievedMT: 14200, activeFpos: 68, status: "EXCELLENT" },
    { state: "Punjab", code: "PB", targetMT: 10000, achievedMT: 9150, activeFpos: 42, status: "EXCELLENT" },
    { state: "Karnataka", code: "KA", targetMT: 8000, achievedMT: 6350, activeFpos: 34, status: "ATTENTION" },
    { state: "Uttar Pradesh", code: "UP", targetMT: 14000, achievedMT: 11600, activeFpos: 58, status: "GOOD" },
    { state: "Gujarat", code: "GJ", targetMT: 7500, achievedMT: 6920, activeFpos: 31, status: "GOOD" }
  ],

  recentDirectives: [
    {
      id: "GOI-DOCA-2026-ORD-109",
      title: "Immediate Buffer Stock Release: 5,000 MT Onion",
      authorizedBy: "Dr. Rajeshwar Sharma, IAS",
      targetZones: "NCT of Delhi, Mumbai Metropolitan, Bengaluru Urban",
      effect: "Wholesale prices cooled down by ₹7.50/kg across institutional supply lines.",
      date: "16 Sep 2026",
      status: "EXECUTED"
    }
  ]
};

/**
 * GET /api/admin/price-radar
 * Real-time Mandi vs. Farm-Gate price parity radar
 */
router.get('/price-radar', (req, res) => {
  try {
    const { category, search } = req.query;
    let list = marketIntelligenceData.commodityRadar;

    if (category && category !== 'all') {
      list = list.filter(item => item.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(item =>
        item.commodity.toLowerCase().includes(q) ||
        item.keyMandi.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      kpis: marketIntelligenceData.kpis,
      commodities: list
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/admin/hoarding-alerts
 * Live AI Anti-Hoarding alerts across Indian mandis
 */
router.get('/hoarding-alerts', (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      count: marketIntelligenceData.hoardingAlerts.length,
      alerts: marketIntelligenceData.hoardingAlerts
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/admin/state-buffer
 * State-wise buffer procurement progress against national targets
 */
router.get('/state-buffer', (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      states: marketIntelligenceData.stateBufferQuotas
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/interventions
 * Authorize and transmit official ministerial directive
 */
router.post('/interventions', (req, res) => {
  try {
    const {
      interventionType = 'buffer-release',
      commodity = 'Nashik Red Hybrid Onion',
      volumeMT = 4000,
      targetZone = 'NCT Delhi & NCR Clusters',
      officer = 'Dr. Rajeshwar Sharma, IAS'
    } = req.body;

    const directiveId = `GOI-DOCA-2026-ORD-${Math.floor(200 + Math.random() * 800)}`;
    const newDirective = {
      id: directiveId,
      title: `${interventionType.toUpperCase()}: ${volumeMT} MT ${commodity}`,
      authorizedBy: officer,
      targetZones: targetZone,
      effect: `Immediate price stabilization protocol active. Buffer stock allocated via KisanSetu direct rail/road network.`,
      date: "Today",
      status: "ACTIVE"
    };

    marketIntelligenceData.recentDirectives.unshift(newDirective);

    // Broadcast directive via WebSocket
    if (req.app.locals.broadcastWebSocket) {
      req.app.locals.broadcastWebSocket({
        type: 'MINISTERIAL_DIRECTIVE_EXECUTED',
        data: newDirective
      });
    }

    return res.status(201).json({
      success: true,
      directiveId,
      message: 'Ministerial directive authorized and broadcasted to state civil supplies boards.',
      directive: newDirective
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
