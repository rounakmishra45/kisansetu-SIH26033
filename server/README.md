# KisanSetu B2B — Express Backend Engine 🌾
### SIH 2026 Problem Statement 26033: Farmer-to-Consumer / Institution Agri-Marketplace

Modular Node.js Express backend powering voice-first WhatsApp farmer listings via **Bhashini**, B2B institutional wholesale cart checkout, **PostgreSQL + PostGIS** geospatial layer, and the **Ministry of Consumer Affairs & Food** market surveillance dashboard.

---

## 🏗️ Architecture & Core Components

```
                     [ Farmer (WhatsApp Voice Note / Text) ]
                                        │
                                        ▼
                        [ Twilio Inbound Webhook ]
                                        │
                                        ▼
                      [ POST /api/whatsapp/webhook ]
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 ▼                                             ▼
     [ services/bhashini.js ]                       [ services/aiProxy.js ]
     (MeitY ULCA ASR Pipeline)                   (Python FastAPI / Heuristic)
                 │                                             │
                 └──────────────────────┬──────────────────────┘
                                        ▼
                          [ harvest_listings Table ]
                         (PostgreSQL / Mock Fallback)
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 ▼                                             ▼
    [ WebSocket Stream: /ws ]                      [ B2B & Ministry REST APIs ]
   (Live Sync to Marketplace)                  (Orders, RFQ, Price Radar & Hoarding)
```

---

## 🚀 Quickstart Guide

### 1. Install Dependencies
```bash
cd server
npm.cmd install
# or
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Note: If you don't have PostgreSQL or Bhashini keys configured yet, the backend automatically boots with an **in-memory PostGIS dataset & mock ASR engine** for instant local evaluation).*

### 3. Start the Server
```bash
# Production mode
node server.js

# Development mode (Hot reloading)
npm.cmd run dev
```

The backend boots on **Port 5000**:
- **Health Check & Diagnostics**: `http://localhost:5000/api/health`
- **Live WebSocket Stream**: `ws://localhost:5000/ws`
- **WhatsApp Twilio Webhook**: `http://localhost:5000/api/whatsapp/webhook`
- **B2B Bulk Orders**: `http://localhost:5000/api/orders/checkout`
- **Ministry Price Intelligence**: `http://localhost:5000/api/admin/price-radar`

---

## 📡 REST API Reference

### 1. Health & Status
- **`GET /api/health`**
  - Returns backend status, uptime, database driver mode (PostGIS vs Mock), and active WebSocket subscribers.

### 2. WhatsApp Conversational Listing Router
- **`POST /api/whatsapp/webhook`**
  - Twilio WhatsApp webhook receiving incoming voice notes (`MediaUrl0`) or text (`Body`).
  - Transcribes audio through **Bhashini ULCA Speech-to-Text**.
  - Extracts crop name, quintals, and asking price through **FastAPI AI proxy**.
  - Persists listing and broadcasts to connected frontend browsers via WebSocket.
  - Returns formatted vernacular TwiML confirmation.

- **`POST /api/whatsapp/simulate-listing`**
  - Direct JSON testing endpoint to simulate a farmer WhatsApp listing without needing an active Twilio number:
  ```bash
  curl -X POST http://localhost:5000/api/whatsapp/simulate-listing \
    -H "Content-Type: application/json" \
    -d "{\"text\": \"40 क्विंटल नासिक लाल प्याज तैयार है, रेट 21 रुपये प्रति किलो।\", \"farmerName\": \"Ramesh Patil\"}"
  ```

### 3. B2B Wholesale Orders & Dynamic Tier Pricing
- **`POST /api/orders/checkout`**
  - Bulk institutional checkout applying volume tier discounts:
    - **< 20 Qtl**: Base wholesale rate
    - **20 – 49 Qtl**: 8% Bulk discount (`tier_20q`)
    - **50+ Qtl**: 14% Mega institutional discount (`tier_50q`)
  - Calculates subtotal, cold-chain freight, 0% middleman commission, and Escrow deposit.
  ```bash
  curl -X POST http://localhost:5000/api/orders/checkout \
    -H "Content-Type: application/json" \
    -d "{\"institutionName\": \"AIIMS Delhi Dietary Mess\", \"items\": [{\"listingId\": \"KS-101\", \"cropName\": \"Nashik Red Onion\", \"quantityQuintals\": 50, \"basePricePerKg\": 21}]}"
  ```

- **`POST /api/orders/rfq`**
  - Submits institutional forward procurement contracts for recurring daily or weekly kitchen deliveries.

- **`GET /api/orders`**
  - Lists purchase orders with escrow settlement status.

### 4. Ministry of Consumer Affairs & Food Dashboard
- **`GET /api/admin/price-radar`**
  - Live comparison of APMC mandi retail vs. KisanSetu direct farm gate vs. Government MSP baseline.
- **`GET /api/admin/hoarding-alerts`**
  - Active AI alerts flagging synthetic scarcity (e.g. Lasalgaon cold storage withholdings) with Section 3 ECA inspection protocols.
- **`GET /api/admin/state-buffer`**
  - State-wise buffer procurement progress against national targets.
- **`POST /api/admin/interventions`**
  - Dispatches official executive market directives (Buffer releases, ECA stock limits, green corridors) and broadcasts via WebSocket.

---

## 🗄️ Database Architecture (`db/schema.sql`)
Includes PostGIS geometries (`Point, 4326`) and spatial indexing for farm-gate and mandi proximity queries:
1. `farmers` (Aadhaar verification, FPO federation, farm location geometry)
2. `harvest_listings` (Crop, vernacular names, quantity quintals, tiered prices, Bhashini transcription)
3. `institutions` (Hospitals, college messes, restaurants, GSTIN, delivery coordinates)
4. `orders` & `order_items` (B2B wholesale transactions with 0% middleman fee)
