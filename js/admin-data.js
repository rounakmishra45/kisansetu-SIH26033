// ==========================================================================
// KisanSetu B2B - Ministry of Consumer Affairs, Food & Public Distribution
// Official Agricultural Price Intelligence, Anti-Hoarding & Buffer Stock Dataset
// ==========================================================================

export const ministryData = {
  officer: {
    name: "Dr. Rajeshwar Sharma, IAS",
    designation: "Joint Secretary (Price Monitoring & Direct Procurement)",
    department: "Department of Consumer Affairs & DFPD",
    ministry: "Ministry of Consumer Affairs, Food and Public Distribution",
    avatar: "🇮🇳",
    lastSynced: "Just now (Live Bhashini & Mandi API Gateway)"
  },

  kpis: {
    priceParityIndex: {
      value: "-28.4%",
      label: "Institutional Cost Reduction",
      subtext: "vs Traditional APMC Mandi Procurement",
      trend: "positive",
      badge: "₹14.2 Cr Saved YTD"
    },
    farmerRealization: {
      value: "74.6%",
      label: "Farmer Price Realization",
      subtext: "vs 38.2% via APMC middlemen tiers",
      trend: "positive",
      badge: "+36.4% Take-Home Income"
    },
    bufferStockProcured: {
      value: "18,450 MT",
      label: "Direct Buffer Stock Inflow",
      subtext: "Secured from 4,800+ Verified FPO Farmers",
      trend: "neutral",
      badge: "91.2% of Q3 Target"
    },
    fssaiTestingPassRate: {
      value: "99.4%",
      label: "Residue & Quality Pass Rate",
      subtext: "Institutional Hospital & Defense Batch Audits",
      trend: "positive",
      badge: "Zero Rejections at Kitchen"
    }
  },

  commodityRadar: [
    {
      id: "onion-red",
      commodity: "Nashik Red Hybrid Onion",
      hindiName: "नासिक लाल प्याज",
      category: "vegetables",
      keyMandi: "Lasalgaon APMC, MH",
      mandiRetailRate: 44, // ₹/kg
      mandiWholesaleRate: 30, // ₹/kg
      kisanSetuFarmGateRate: 21, // ₹/kg
      mspBufferBenchmark: 18, // ₹/kg
      middlemanSpreadPct: 109,
      hoardingRisk: "CRITICAL",
      hoardingRiskScore: 94,
      weeklyInflationTrend: "+18.2%",
      availableFpoVolumeMT: 3400,
      activeIntervention: "Buffer Release Triggered"
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
      availableFpoVolumeMT: 2100,
      activeIntervention: "Monitoring Artificial Bottleneck"
    },
    {
      id: "wheat-sharbati",
      commodity: "Sehore Sharbati Golden Wheat",
      hindiName: "सीहोर शरबती शरबती गेहूं",
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
      availableFpoVolumeMT: 6200,
      activeIntervention: "Stable Direct Supply"
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
      mspBufferBenchmark: 54.4,
      middlemanSpreadPct: 50,
      hoardingRisk: "MEDIUM",
      hoardingRiskScore: 68,
      weeklyInflationTrend: "+6.5%",
      availableFpoVolumeMT: 1850,
      activeIntervention: "Direct NAFED Tie-in"
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
      mspBufferBenchmark: 11.5,
      middlemanSpreadPct: 115,
      hoardingRisk: "MEDIUM",
      hoardingRiskScore: 62,
      weeklyInflationTrend: "+4.2%",
      availableFpoVolumeMT: 4500,
      activeIntervention: "Institutional Bulk Offtake"
    },
    {
      id: "apple-royal",
      commodity: "Himachal Grade-A Royal Delicious Apple",
      hindiName: "हिमाचल रॉयल सेब",
      category: "fruits",
      keyMandi: "Parwanoo Mandi, HP",
      mandiRetailRate: 145,
      mandiWholesaleRate: 105,
      kisanSetuFarmGateRate: 78,
      mspBufferBenchmark: 65,
      middlemanSpreadPct: 86,
      hoardingRisk: "LOW",
      hoardingRiskScore: 31,
      weeklyInflationTrend: "-2.1%",
      availableFpoVolumeMT: 1200,
      activeIntervention: "Normal Cold Chain Inflow"
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
      anomalyDescription: "3 private cold storages holding 5,400 MT despite harvest peak. Daily mandi arrivals dropped 42% in 72 hours while farm-gate supplies remain abundant.",
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
      anomalyDescription: "Syndicate commission agents demanding ₹6/kg unloading cut, causing 18-hour transport delays to Bengaluru & Chennai institutional kitchens.",
      recommendedAction: "Activate KisanSetu direct green corridor bypassing APMC gate with digital transit pass.",
      status: "IN_REVIEW"
    },
    {
      id: "ALT-2026-903",
      mandi: "Azadpur Subzi Mandi (Wholesale Influx)",
      district: "North Delhi, NCT",
      commodity: "Green Capsicum & Cucumbers",
      severity: "MEDIUM",
      confidence: "82.1%",
      anomalyDescription: "Intermediary cartel marking up farm produce by 130% before reaching AIIMS & Safdarjung Hospital diet catering suppliers.",
      recommendedAction: "Reroute hospital procurement to Sonipat & Meerut FPOs on KisanSetu Escrow.",
      status: "RESOLVED"
    }
  ],

  stateProcurement: [
    {
      state: "Maharashtra",
      code: "MH",
      targetMT: 12000,
      achievedMT: 10840,
      activeFpos: 54,
      participatingInstitutions: 82,
      topCrops: ["Red Onion", "Pomegranate", "Soybean", "Chana Dal"],
      status: "EXCELLENT"
    },
    {
      state: "Madhya Pradesh",
      code: "MP",
      targetMT: 15000,
      achievedMT: 14200,
      activeFpos: 68,
      participatingInstitutions: 65,
      topCrops: ["Sharbati Wheat", "Garlic", "Desi Chana", "Mustard"],
      status: "EXCELLENT"
    },
    {
      state: "Punjab",
      code: "PB",
      targetMT: 10000,
      achievedMT: 9150,
      activeFpos: 42,
      participatingInstitutions: 48,
      topCrops: ["Basmati Rice", "Table Potato", "Green Peas", "Wheat"],
      status: "EXCELLENT"
    },
    {
      state: "Karnataka",
      code: "KA",
      targetMT: 8000,
      achievedMT: 6350,
      activeFpos: 34,
      participatingInstitutions: 52,
      topCrops: ["Tomato", "Chilli", "Capsicum", "Millets"],
      status: "ATTENTION"
    },
    {
      state: "Uttar Pradesh",
      code: "UP",
      targetMT: 14000,
      achievedMT: 11600,
      activeFpos: 58,
      participatingInstitutions: 74,
      topCrops: ["Agra Potato", "Cauliflower", "Sugarcane Gur", "Paddy"],
      status: "GOOD"
    },
    {
      state: "Gujarat",
      code: "GJ",
      targetMT: 7500,
      achievedMT: 6920,
      activeFpos: 31,
      participatingInstitutions: 43,
      topCrops: ["Groundnut", "Cottonseed", "Cumin", "Caster"],
      status: "GOOD"
    }
  ],

  dbtDisbursements: [
    {
      txId: "DBT-2026-78891",
      farmerName: "Ramesh Tukaram Patil",
      fpo: "Godavari Valley Farmers Producer Co.",
      buyerInstitution: "AIIMS Delhi Medical Mess",
      amount: "₹1,26,000",
      crop: "Red Hybrid Onions (60 Qtl)",
      payoutMode: "Aadhaar / Escrow UPI",
      bankRef: "SBIN0029381029",
      leakage: "₹0 (0% Intermediary Fee)",
      timestamp: "Today, 09:24 AM",
      status: "SETTLED"
    },
    {
      txId: "DBT-2026-78892",
      farmerName: "Gurpreet Singh Gill",
      fpo: "Malwa Agri Consortium FPO",
      buyerInstitution: "IIT Bombay Central Hostel Kitchen",
      amount: "₹2,48,000",
      crop: "PBN-51 Basmati Rice (40 Qtl)",
      payoutMode: "Direct RTGS Escrow",
      bankRef: "HDFC0001827391",
      leakage: "₹0 (0% Intermediary Fee)",
      timestamp: "Today, 08:45 AM",
      status: "SETTLED"
    },
    {
      txId: "DBT-2026-78893",
      farmerName: "Ananya Joshi",
      fpo: "Pune Hydroponics Growers Hub",
      buyerInstitution: "Fortis Memorial Research Canteen",
      amount: "₹51,000",
      crop: "0% Residue English Cucumbers (15 Qtl)",
      payoutMode: "UPI Instant Payout",
      bankRef: "ICIC0091823741",
      leakage: "₹0 (0% Intermediary Fee)",
      timestamp: "Today, 07:12 AM",
      status: "SETTLED"
    },
    {
      txId: "DBT-2026-78894",
      farmerName: "Devendra Malviya",
      fpo: "Narmada Valley Krishi Producer Co.",
      buyerInstitution: "Western Railway Staff Canteens",
      amount: "₹4,35,000",
      crop: "Sharbati Wheat Grade A (150 Qtl)",
      payoutMode: "Direct RTGS Escrow",
      bankRef: "PUNB0082736192",
      leakage: "₹0 (0% Intermediary Fee)",
      timestamp: "Yesterday, 06:30 PM",
      status: "SETTLED"
    }
  ],

  recentOfficialOrders: [
    {
      id: "GOI-DOCA-2026-ORD-109",
      title: "Immediate Buffer Stock Release: 5,000 MT Onion",
      authorizedBy: "Dr. Rajeshwar Sharma, IAS",
      targetZones: "NCT of Delhi, Mumbai Metropolitan, Bengaluru Urban",
      effect: "Wholesale prices cooled down by ₹7.50/kg across institutional supply lines.",
      date: "16 Sep 2026",
      status: "EXECUTED"
    },
    {
      id: "GOI-DOCA-2026-ORD-108",
      title: "Section 3 ECA Anti-Hoarding Directive (Lasalgaon Hub)",
      authorizedBy: "Cabinet Secretary / DFPD Review",
      targetZones: "Nashik APMC Mandi Cartels",
      effect: "Declared maximum stock holding limit of 250 MT per wholesale trader.",
      date: "14 Sep 2026",
      status: "ACTIVE"
    },
    {
      id: "GOI-DOCA-2026-ORD-107",
      title: "Perishable Green Corridor Fast-Track & Toll Waiver",
      authorizedBy: "Joint Secretary (Procurement)",
      targetZones: "Pune-Mumbai Expressway, Delhi-Meerut Expressway",
      effect: "Transit time for direct hospital vegetable reefers reduced by 4.5 hours.",
      date: "10 Sep 2026",
      status: "ACTIVE"
    }
  ]
};
