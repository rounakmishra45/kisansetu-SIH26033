// KisanSetu B2B - Authentic Indian Agricultural Dataset for Bulk Institutional Procurement
export const initialProducts = [
  {
    id: "KS-101",
    name: "Nashik Red Hybrid Onions",
    hindiName: "नासिक लाल प्याज",
    category: "vegetables",
    variety: "Garwa / Late Kharif Grade A",
    farmer: {
      name: "Ramesh Tukaram Patil",
      village: "Niphad, Nashik",
      state: "Maharashtra",
      phone: "+91 98220 XXXXX",
      experience: "16 years",
      fpo: "Godavari FPO Federation",
      verified: true,
      rating: 4.9,
      totalOrders: 142
    },
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80",
    harvestDate: "Harvested Yesterday (6:00 AM)",
    harvestTimeRelative: "20 hours ago",
    distanceKm: 34,
    totalAvailableQty: 250, // in quintals
    minOrderQty: 5, // quintals
    unit: "Quintal (100 kg)",
    pricingTiers: [
      { min: 5, max: 19, pricePerKg: 22, pricePerQuintal: 2200 },
      { min: 20, max: 49, pricePerKg: 19.5, pricePerQuintal: 1950 },
      { min: 50, max: 999, pricePerKg: 17.8, pricePerQuintal: 1780 }
    ],
    qualityCertificates: ["A-Grade Size (55mm+)", "Zero Rot Assured", "APEDA Mandi Tested"],
    specifications: {
      moisture: "12.4%",
      shelfLife: "60 Days in ventilated store",
      packaging: "50 kg breathable mesh bags"
    },
    tags: ["High Demand", "Mess Essential", "Kitchen Staple"],
    institutionFit: ["college", "restaurant", "hospital"],
    hospitalApproved: true,
    messBulkFit: true,
    restaurantFit: true,
    organic: false,
    whatsappListed: true
  },
  {
    id: "KS-102",
    name: "Kolar Field Fresh Hybrid Tomatoes",
    hindiName: "कोलार फार्म टमाटर",
    category: "vegetables",
    variety: "Abhinav 1057 (Firm Skin, High Pulp)",
    farmer: {
      name: "Venkataswamy Gowda",
      village: "Mulbagal, Kolar",
      state: "Karnataka",
      phone: "+91 94481 XXXXX",
      experience: "12 years",
      fpo: "Kolar Green Agri Producer Co.",
      verified: true,
      rating: 4.8,
      totalOrders: 98
    },
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
    harvestDate: "Harvested Today at 5:30 AM",
    harvestTimeRelative: "6 hours ago",
    distanceKm: 48,
    totalAvailableQty: 180,
    minOrderQty: 3,
    unit: "Crate (25 kg)",
    pricingTiers: [
      { min: 3, max: 15, pricePerKg: 24, pricePerQuintal: 2400 },
      { min: 16, max: 40, pricePerKg: 20.5, pricePerQuintal: 2050 },
      { min: 41, max: 999, pricePerKg: 18.2, pricePerQuintal: 1820 }
    ],
    qualityCertificates: ["FSSAI Lab Residue Tested", "Uniform Color >90%", "Tough Skin for Transit"],
    specifications: {
      brix: "4.8°",
      shelfLife: "10-12 Days",
      packaging: "25 kg Plastic Vent Crates"
    },
    tags: ["Same Day Plucked", "Rich Gravy Yield"],
    institutionFit: ["restaurant", "hospital", "college"],
    hospitalApproved: true,
    messBulkFit: true,
    restaurantFit: true,
    organic: false,
    whatsappListed: true
  },
  {
    id: "KS-103",
    name: "Sehore Premium Sharbati Golden Wheat",
    hindiName: "सीहोर शरबती गेहूं",
    category: "grains",
    variety: "C-306 Traditional Sharbati",
    farmer: {
      name: "Devendra Singh Bundela",
      village: "Ashta, Sehore",
      state: "Madhya Pradesh",
      phone: "+91 97554 XXXXX",
      experience: "24 years",
      fpo: "Narmada Valley Krishi Producer Co.",
      verified: true,
      rating: 5.0,
      totalOrders: 215
    },
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
    harvestDate: "Recent Season Harvest (Cleaned & Graded)",
    harvestTimeRelative: "12 days ago",
    distanceKm: 180,
    totalAvailableQty: 600,
    minOrderQty: 10,
    unit: "Quintal (100 kg)",
    pricingTiers: [
      { min: 10, max: 30, pricePerKg: 38, pricePerQuintal: 3800 },
      { min: 31, max: 80, pricePerKg: 35.5, pricePerQuintal: 3550 },
      { min: 81, max: 999, pricePerKg: 33.2, pricePerQuintal: 3320 }
    ],
    qualityCertificates: ["NPOP Organic Certified", "Zero Pesticide Residue", "14.2% Protein Tested"],
    specifications: {
      grainLuster: "Golden Amber",
      moisture: "9.8% (Weevil Resistant)",
      packaging: "50 kg HDPE Double Stitched Bags"
    },
    tags: ["Soft Roti Yield", "Premium Mess Grade", "NPOP Organic"],
    institutionFit: ["college", "hospital"],
    hospitalApproved: true,
    messBulkFit: true,
    restaurantFit: true,
    organic: true,
    whatsappListed: false
  },
  {
    id: "KS-104",
    name: "Agra LR & Chipsona Cold-Store Potatoes",
    hindiName: "आगरा चिपसोना व एलआर आलू",
    category: "vegetables",
    variety: "Kufri Chipsona-1 / LR Grade A",
    farmer: {
      name: "Mahavir Singh Yadav",
      village: "Khandauli, Agra",
      state: "Uttar Pradesh",
      phone: "+91 94122 XXXXX",
      experience: "19 years",
      fpo: "Braj Bhoomi Potato Farmer Union",
      verified: true,
      rating: 4.7,
      totalOrders: 310
    },
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
    harvestDate: "Temperature Controlled (4°C Controlled Store)",
    harvestTimeRelative: "Fresh Dispatch",
    distanceKm: 95,
    totalAvailableQty: 850,
    minOrderQty: 10,
    unit: "Quintal (100 kg)",
    pricingTiers: [
      { min: 10, max: 25, pricePerKg: 18, pricePerQuintal: 1800 },
      { min: 26, max: 70, pricePerKg: 15.8, pricePerQuintal: 1580 },
      { min: 71, max: 999, pricePerKg: 14.2, pricePerQuintal: 1420 }
    ],
    qualityCertificates: ["Low Sugar (<0.1%)", "Zero Green Tubers", "Uniform 50mm+ Size"],
    specifications: {
      dryMatter: "21.5%",
      shelfLife: "45 Days ambient",
      packaging: "50 kg Jute Gunny Bags"
    },
    tags: ["Best For Fries & Curry", "Hostel Mega Supply"],
    institutionFit: ["college", "restaurant"],
    hospitalApproved: false,
    messBulkFit: true,
    restaurantFit: true,
    organic: false,
    whatsappListed: true
  },
  {
    id: "KS-105",
    name: "Hydroponic Chemical-Free English Cucumber & Spinach",
    hindiName: "केमिकल-मुक्त पालक व खीरा",
    category: "vegetables",
    variety: "Crispy English Long & Dark Green Baby Spinach",
    farmer: {
      name: "Dr. Ananya Joshi (Agripreneur)",
      village: "Khed-Shivapur, Pune",
      state: "Maharashtra",
      phone: "+91 98603 XXXXX",
      experience: "7 years",
      fpo: "Sahyadri Hydrogreens Society",
      verified: true,
      rating: 5.0,
      totalOrders: 82
    },
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
    harvestDate: "Plucked this morning at 4:00 AM",
    harvestTimeRelative: "4 hours ago",
    distanceKm: 28,
    totalAvailableQty: 45,
    minOrderQty: 1,
    unit: "Crate (20 kg)",
    pricingTiers: [
      { min: 1, max: 5, pricePerKg: 42, pricePerQuintal: 4200 },
      { min: 6, max: 15, pricePerKg: 36, pricePerQuintal: 3600 },
      { min: 16, max: 999, pricePerKg: 31, pricePerQuintal: 3100 }
    ],
    qualityCertificates: ["NABARD Certified Hydroponic", "100% Pesticide Residue Free", "Hospital Clinical Grade"],
    specifications: {
      nitrateLevel: "<20 ppm",
      washedStatus: "Triple RO Washed & Ozone Sanitized",
      packaging: "Food Grade Perforated Crates"
    },
    tags: ["Hospital Dietary Recommended", "100% Residue Free"],
    institutionFit: ["hospital", "restaurant"],
    hospitalApproved: true,
    messBulkFit: false,
    restaurantFit: true,
    organic: true,
    whatsappListed: true
  },
  {
    id: "KS-106",
    name: "Karnal 1121 Steam Extra Long Basmati Rice",
    hindiName: "करनाल 1121 बासमती चावल",
    category: "grains",
    variety: "Traditional 1121 Aged 2 Years",
    farmer: {
      name: "Sardar Gurpreet Singh Gill",
      village: "Gharaunda, Karnal",
      state: "Haryana",
      phone: "+91 98120 XXXXX",
      experience: "21 years",
      fpo: "Haryana Kisan Basmati Pragati Sangh",
      verified: true,
      rating: 4.9,
      totalOrders: 184
    },
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
    harvestDate: "Naturally Aged for 24 Months",
    harvestTimeRelative: "Aged 2 Yrs",
    distanceKm: 140,
    totalAvailableQty: 400,
    minOrderQty: 5,
    unit: "Quintal (100 kg)",
    pricingTiers: [
      { min: 5, max: 20, pricePerKg: 86, pricePerQuintal: 8600 },
      { min: 21, max: 50, pricePerKg: 79, pricePerQuintal: 7900 },
      { min: 51, max: 999, pricePerKg: 74.5, pricePerQuintal: 7450 }
    ],
    qualityCertificates: ["AGMARK Special Grade", "Grain Length 8.35mm+", "Non-Sticky Cooking Verified"],
    specifications: {
      elongationRatio: "2.5x Post Cooking",
      brokenGrains: "<1.0%",
      packaging: "25 kg Non-Woven Laminated Fabric Bags"
    },
    tags: ["Chef Special", "Fine Dining Biryani Grade"],
    institutionFit: ["restaurant", "college"],
    hospitalApproved: true,
    messBulkFit: true,
    restaurantFit: true,
    organic: false,
    whatsappListed: true
  },
  {
    id: "KS-107",
    name: "Shimla Royal Delicious & Golden Apples",
    hindiName: "शिमला रॉयल डिलीशियस सेब",
    category: "fruits",
    variety: "Grade-A Orchard Selected (Size 80-90mm)",
    farmer: {
      name: "Tek Chand Thakur",
      village: "Kotkhai, Shimla",
      state: "Himachal Pradesh",
      phone: "+91 94180 XXXXX",
      experience: "28 years",
      fpo: "Giri Valley Apple Growers Consortium",
      verified: true,
      rating: 4.9,
      totalOrders: 112
    },
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
    harvestDate: "Direct Orchard Pluck with Protective Sleeves",
    harvestTimeRelative: "2 days ago",
    distanceKm: 260,
    totalAvailableQty: 120,
    minOrderQty: 4,
    unit: "Corrugated Box (20 kg)",
    pricingTiers: [
      { min: 4, max: 15, pricePerKg: 95, pricePerQuintal: 9500 },
      { min: 16, max: 35, pricePerKg: 86, pricePerQuintal: 8600 },
      { min: 36, max: 999, pricePerKg: 78, pricePerQuintal: 7800 }
    ],
    qualityCertificates: ["Zero Chemical Waxing", "Natural Sweetness TSS 13.5%", "Hospital Patient Nutrition Approved"],
    specifications: {
      colorCoverage: "85% Deep Crimson",
      firmness: "16 lbs/cm²",
      packaging: "Telescopic 4-Layer Tray Carton (20 kg net)"
    },
    tags: ["Hospital Diet Staple", "Wax-Free Natural"],
    institutionFit: ["hospital", "restaurant", "college"],
    hospitalApproved: true,
    messBulkFit: false,
    restaurantFit: true,
    organic: true,
    whatsappListed: false
  },
  {
    id: "KS-108",
    name: "Latur Unpolished High-Protein Desi Toor Dal",
    hindiName: "लातूर अनपॉलिश देशी तूर दाल",
    category: "pulses",
    variety: "BDN-711 Traditional Marathwada",
    farmer: {
      name: "Bhimrao Shinde",
      village: "Ausa, Latur",
      state: "Maharashtra",
      phone: "+91 98902 XXXXX",
      experience: "15 years",
      fpo: "Marathwada Pulses Collective",
      verified: true,
      rating: 4.8,
      totalOrders: 167
    },
    image: "https://images.unsplash.com/photo-1585994192701-f1a505c8574a?auto=format&fit=crop&w=800&q=80",
    harvestDate: "Fresh Crop Machine Graded",
    harvestTimeRelative: "5 days ago",
    distanceKm: 190,
    totalAvailableQty: 320,
    minOrderQty: 5,
    unit: "Quintal (100 kg)",
    pricingTiers: [
      { min: 5, max: 20, pricePerKg: 118, pricePerQuintal: 11800 },
      { min: 21, max: 50, pricePerKg: 110, pricePerQuintal: 11000 },
      { min: 51, max: 999, pricePerKg: 104, pricePerQuintal: 10400 }
    ],
    qualityCertificates: ["Zero Mineral Oil / Water Polish", "FSSAI Grade-1", "Protein 22.8% Certified"],
    specifications: {
      foreignMatter: "<0.1%",
      cookingTime: "18-20 mins (Fast Cooking)",
      packaging: "50 kg HDPE Woven Bags"
    },
    tags: ["Hostel High Protein", "Hospital Bland Diet Safe"],
    institutionFit: ["college", "hospital", "restaurant"],
    hospitalApproved: true,
    messBulkFit: true,
    restaurantFit: true,
    organic: false,
    whatsappListed: true
  }
];

// Presets for WhatsApp Chatbot demonstration scenarios
export const whatsappDemoScenarios = [
  {
    id: "sc-1",
    farmerName: "Ramesh Tukaram (Nashik)",
    voiceNoteDuration: "0:14",
    avatar: "👨‍🌾",
    incomingRawText: "राम-राम साब, हमारे पास नासिक लाल प्याज का 40 क्विंटल माल तैयार है। A-Grade साइज़ है। रेट 19 रुपये किलो चाहिए, डिलीवरी निफाड़ फार्म से। फोटो भी भेज रहा हूँ।",
    parsedDetails: {
      crop: "Nashik Red Onion",
      hindiName: "नासिक लाल प्याज",
      category: "vegetables",
      quantity: "40 Quintals (4,000 kg)",
      askingPrice: "₹19 / kg (₹1,900 / Qtl)",
      location: "Niphad, Nashik, MH",
      grade: "A-Grade (55mm+)",
      harvestTime: "Plucked Yesterday",
      confidence: "98.4% AI Match"
    }
  },
  {
    id: "sc-2",
    farmerName: "Gurpreet Singh (Karnal)",
    voiceNoteDuration: "0:18",
    avatar: "👳‍🌾",
    incomingRawText: "Sat Sri Akal ji! I have 80 quintals of pure PR-126 Golden Paddy/Rice packed in 50kg bags. Grade 1 quality. Expecting 28 rupees per kg. Location Karnal near GT road.",
    parsedDetails: {
      crop: "Karnal Golden Rice PR-126",
      hindiName: "करनाल गोल्डन चावल",
      category: "grains",
      quantity: "80 Quintals (8,000 kg)",
      askingPrice: "₹28 / kg (₹2,800 / Qtl)",
      location: "Gharaunda, Karnal, HR",
      grade: "Grade 1 Machine Cleaned",
      harvestTime: "Fresh Season Lot",
      confidence: "99.1% AI Match"
    }
  },
  {
    id: "sc-3",
    farmerName: "Ananya Joshi (Pune Hydroponics)",
    voiceNoteDuration: "0:11",
    avatar: "👩‍🔬",
    incomingRawText: "Hello KisanSetu, fresh lot of pesticide-free English Cucumbers & Spinach ready. 15 quintals available for hospital canteens. Harvested 4am today. Rate 34 rs per kg.",
    parsedDetails: {
      crop: "Pesticide-Free English Cucumbers & Spinach",
      hindiName: "केमिकल-मुक्त खीरा व पालक",
      category: "vegetables",
      quantity: "15 Quintals (1,500 kg)",
      askingPrice: "₹34 / kg (₹3,400 / Qtl)",
      location: "Khed-Shivapur, Pune, MH",
      grade: "Hospital Safe 0% Residue",
      harvestTime: "Harvested Today 4:00 AM",
      confidence: "99.7% AI Match"
    }
  }
];
