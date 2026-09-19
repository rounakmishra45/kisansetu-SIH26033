# KisanSetu B2B (किसान सेतु) 🌾
### Direct Farm-to-Institution Bulk Marketplace with WhatsApp Chatbot Listing Engine
**Smart India Hackathon (SIH) Project Prototype**

---

## 📌 Executive Summary
**KisanSetu B2B** solves one of India's biggest agricultural supply chain challenges: **the exploitation of farmers by multi-tiered mandi middlemen** and **the high food procurement costs borne by institutions** (hospitals, university messes, hostels, and restaurant chains).

### The Dual Innovation:
1. **For Farmers — Zero Tech Friction (WhatsApp Chatbot)**:
   - Indian farmers often struggle with complex apps, English forms, and KYC portals.
   - KisanSetu allows farmers to list their produce simply by sending a **WhatsApp text or audio note in their local language** (Hindi, Marathi, Punjabi, etc.) to the *KisanSetu Kisan Sahayak* bot.
   - Built-in AI parses the crop variety, quantity in quintals, asking price, harvest timestamp, and geotag, instantly publishing a verified batch to the marketplace.
2. **For Bulk Buyers — Institutional Wholesale Hub**:
   - **Hospitals & Dietary Canteens**: Access 100% pesticide-residue-tested produce, organic greens, and fresh patient dietary staples.
   - **Colleges & Hostels**: Procure high-volume 50kg+ sacks of grains, wheat, potatoes, and lentils with dynamic volume-tiered discounts and recurring weekly delivery contracts.
   - **Restaurants & HoReCa**: Plucked-same-day culinary produce delivered directly to kitchens within 12–18 hours of harvest.

---

## 🚀 Key Features of the Prototype

| Feature | Description |
| :--- | :--- |
| **Interactive WhatsApp Chatbot Simulator** | Real-time interactive WhatsApp window right on the site. Judges can click preset farmer voice notes or type custom crop listings to watch the AI parse it and sync live to the marketplace with a celebratory glow! |
| **Dynamic Tiered Wholesale Pricing** | As buyers increase order volume (e.g., 5 Qtl vs 20 Qtl vs 50 Qtl), the price per kg dynamically drops to reflect bulk farm-gate wholesale tiers. |
| **Institutional Buyer Persona Presets** | Filter products tailored for **Hospitals** (pesticide tested), **Colleges** (mega mess sacks), or **Restaurants** (chef grade). |
| **Bulk Purchase Order (PO) Drawer** | Real-time weight aggregator (in Quintals & Metric Tonnes), farm-gate subtotal, direct freight logistics estimation, and one-click printable PO. |
| **Institutional RFQ & Recurring Supply Planner** | Allows canteen managers to schedule recurring supply (Daily morning drops, bi-weekly mess batches, or monthly staple contracts). |
| **Mandi vs. KisanSetu Comparison Matrix** | Demonstrates the 0% commission vs 30%+ APDC mandi commissions, 18-hr freshness vs 48-hr transit delays, and direct Escrow settlement. |
| **Ministry of Food & Consumer Affairs Dashboard** | Executive command cockpit for the Department of Consumer Affairs & DFPD. Real-time Mandi vs. KisanSetu price disparity radar, AI anti-hoarding early warnings, state buffer stock quotas, and direct DBT payout ledger. |

---

## 💻 How to Run the Prototype Locally

Because this project uses modern native web standards (ES Modules, CSS Custom Properties, and HTML5 `<dialog>`), you can run it using any simple local server:

### Option 1: Using Node.js (Recommended)
```bash
node server.js
```
Then open `http://localhost:3000` in your web browser.

### Option 2: Using Python
```bash
python -m http.server 8000
```
Then open `http://localhost:8000` in your web browser.

### Option 3: Using VS Code Live Server
Right-click `index.html` in VS Code and click **"Open with Live Server"**.

---

## 🎯 2-Minute Presentation Pitch for SIH Judges

1. **The Hook (0:00 – 0:30)**:
   > *"Respected judges, institutions like AIIMS, IIT messes, and restaurant chains spend crores every year on agricultural produce, while our farmers struggle to get a fair price. Why? Because 4 to 6 layers of mandi middlemen pocket up to 35% margin. Meanwhile, existing agricultural apps fail because farmers find them too complicated."*

2. **The WhatsApp Breakthrough (0:30 – 1:00)**:
   > *"Our solution is simple: **Don't force farmers to download new apps. Meet them where they already are — on WhatsApp.** Click the 'WhatsApp Bot Demo' button here. Watch Ramesh from Nashik send an audio note in Hindi: '40 quintal Nashik pyaz ready at ₹19/kg'. Our AI parses the audio, extracts the parameters, and with one tap publishes the batch live to our institutional portal!"*

3. **The Institutional Buyer Experience (1:00 – 1:40)**:
   > *"Now look at the marketplace: Ramesh's lot appears at the very top with an AI-verified badge. Notice our dynamic wholesale pricing calculator: when a college hostel mess manager increases the order to 50 quintals, the price automatically drops. Hospitals can filter exclusively for pesticide-tested produce, and mess managers can schedule recurring Monday & Thursday 5:30 AM deliveries through our RFQ engine."*

4. **The Bottom Line (1:40 – 2:00)**:
   > *"Zero middlemen fees, 18-hour harvest-to-kitchen freshness, and 34% higher take-home income for Indian farmers. That is KisanSetu B2B."*

---

## 📂 File Architecture

```
SIH 206/
├── index.html              # Core semantic structure, hero, marketplace & modals
├── admin.html              # Ministry of Food & Consumer Affairs Command Dashboard
├── server.js               # Zero-dependency local Node.js HTTP server
├── css/
│   ├── style.css           # Design tokens, typography, hero & responsive layout
│   ├── components.css      # Product cards, tiered price stepper, cart & RFQ drawer
│   ├── whatsapp-chat.css   # Authentic WhatsApp phone UI, voice note waves & AI card
│   └── admin.css           # Sovereign GovTech dashboard styles, tables & print styles
├── js/
│   ├── data.js             # Indian agricultural dataset & WhatsApp demo scenarios
│   ├── app.js              # State management, search/filters, cart & PO generation
│   ├── whatsapp-simulator.js # Conversational parsing logic & real-time sync
│   ├── admin-data.js       # Ministry price intelligence, hoarding alerts & buffer stock
│   └── admin.js            # Ministry dashboard controller, filters & official orders
└── README.md               # Presentation guide & documentation
```
