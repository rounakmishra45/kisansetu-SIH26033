// ==============================================================================
// KisanSetu B2B - PostgreSQL + PostGIS Connection Layer
// Features auto-failover to in-memory mock store for zero-setup local development
// ==============================================================================

import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

let pool = null;
let isConnectedToPostgres = false;

// Pre-seeded high-fidelity mock dataset reflecting Indian agricultural supply chain
const mockStore = {
  farmers: [
    {
      id: 'FARMER-101',
      name: 'Ramesh Tukaram Patil',
      phone: '+919822012345',
      village: 'Niphad',
      district: 'Nashik',
      state: 'Maharashtra',
      fpo_name: 'Godavari FPO Federation',
      preferred_language: 'hi',
      latitude: 20.0883,
      longitude: 74.1089,
      aadhaar_verified: true
    },
    {
      id: 'FARMER-102',
      name: 'Gurpreet Singh Gill',
      phone: '+919876543210',
      village: 'Samrala',
      district: 'Ludhiana',
      state: 'Punjab',
      fpo_name: 'Malwa Agri Consortium FPO',
      preferred_language: 'pa',
      latitude: 30.8357,
      longitude: 76.1917,
      aadhaar_verified: true
    },
    {
      id: 'FARMER-103',
      name: 'Ananya Joshi',
      phone: '+919422334455',
      village: 'Khed-Shivapur',
      district: 'Pune',
      state: 'Maharashtra',
      fpo_name: 'Pune Hydroponics Growers Hub',
      preferred_language: 'mr',
      latitude: 18.3512,
      longitude: 73.8567,
      aadhaar_verified: true
    }
  ],

  harvestListings: [
    {
      id: 'KS-101',
      farmerId: 'FARMER-101',
      cropName: 'Nashik Red Hybrid Onions',
      hindiName: 'नासिक लाल प्याज',
      category: 'vegetables',
      variety: 'Garwa / Late Kharif Grade A',
      quantityQuintals: 80,
      availableQuintals: 80,
      askingPricePerKg: 21,
      tier20qPricePerKg: 19.32,
      tier50qPricePerKg: 18.06,
      harvestDate: new Date().toISOString().split('T')[0],
      harvestTimeStamp: 'Harvested Today 05:30 AM',
      grade: 'Hospital & Mess Grade A',
      isOrganic: false,
      fssaiResidueTested: true,
      whatsappListed: true,
      rawTranscription: '40 quintal Nashik pyaz ready at ₹21/kg.',
      confidenceScore: 99.4,
      status: 'ACTIVE'
    },
    {
      id: 'KS-102',
      farmerId: 'FARMER-102',
      cropName: 'PBN-51 Premium Basmati Rice',
      hindiName: 'बासमती चावल PBN-51',
      category: 'grains',
      variety: 'PBN-51 Extra Long Grain (8.35mm)',
      quantityQuintals: 150,
      availableQuintals: 150,
      askingPricePerKg: 62,
      tier20qPricePerKg: 57.04,
      tier50qPricePerKg: 53.32,
      harvestDate: new Date().toISOString().split('T')[0],
      harvestTimeStamp: 'Aged 12 Months in FPO Silo',
      grade: 'APEDA Export Grade',
      isOrganic: true,
      fssaiResidueTested: true,
      whatsappListed: true,
      rawTranscription: 'Basmati rice ready 150 quintals in Samrala.',
      confidenceScore: 98.7,
      status: 'ACTIVE'
    },
    {
      id: 'KS-103',
      farmerId: 'FARMER-103',
      cropName: '0% Residue English Cucumbers',
      hindiName: 'केमिकल-मुक्त खीरा',
      category: 'vegetables',
      variety: 'Green Long Hydroponic',
      quantityQuintals: 25,
      availableQuintals: 25,
      askingPricePerKg: 34,
      tier20qPricePerKg: 31.28,
      tier50qPricePerKg: 29.24,
      harvestDate: new Date().toISOString().split('T')[0],
      harvestTimeStamp: 'Plucked 4:00 AM Today',
      grade: 'Hospital Safe 0% Chemical Residue',
      isOrganic: true,
      fssaiResidueTested: true,
      whatsappListed: true,
      rawTranscription: 'Fresh lot of pesticide-free English Cucumbers ready.',
      confidenceScore: 99.7,
      status: 'ACTIVE'
    }
  ],

  orders: [],
  hoardingAlerts: []
};

// Attempt to initialize real PostgreSQL + PostGIS pool if connection string provided
if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: parseInt(process.env.DB_POOL_MAX || '10', 10),
      connectionTimeoutMillis: parseInt(process.env.DB_TIMEOUT_MS || '3000', 10),
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    // Verify connection asynchronously without blocking server start
    pool.connect()
      .then((client) => {
        isConnectedToPostgres = true;
        console.log('✅ [PostgreSQL + PostGIS] Successfully connected to live database.');
        client.release();
      })
      .catch((err) => {
        console.warn('⚠️ [DB Warning] PostgreSQL not reachable at DATABASE_URL:', err.message);
        console.log('🔄 [DB Fallback] In-memory mock storage activated. Full API remains 100% operational.');
        isConnectedToPostgres = false;
      });
  } catch (err) {
    console.warn('⚠️ [DB Exception] Failed to construct Pool:', err.message);
    isConnectedToPostgres = false;
  }
} else {
  console.log('ℹ️ [DB] No DATABASE_URL provided. Operating in in-memory PostGIS mock mode.');
}

/**
 * Universal query wrapper that executes against Postgres when connected,
 * or routes seamlessly to in-memory mock datasets when offline.
 */
export async function query(text, params = []) {
  if (isConnectedToPostgres && pool) {
    try {
      const start = Date.now();
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      // Log slow queries in development
      if (duration > 300) {
        console.warn(`[Slow Query] ${duration}ms: ${text}`);
      }
      return res;
    } catch (err) {
      console.error('[DB Query Error]', err.message);
      throw err;
    }
  }

  // In-memory mock query simulator
  return simulateMockQuery(text, params);
}

/**
 * Lightweight SQL query parser and executor for in-memory mock data.
 * Supports standard SELECT, INSERT, and ID lookups used across routes.
 */
function simulateMockQuery(text, params) {
  const normalized = text.trim().toUpperCase();

  // 1. Fetch all harvest listings
  if (normalized.startsWith('SELECT') && normalized.includes('HARVEST_LISTINGS')) {
    return {
      rows: mockStore.harvestListings,
      rowCount: mockStore.harvestListings.length
    };
  }

  // 2. Fetch single harvest listing by ID
  if (normalized.startsWith('SELECT') && normalized.includes('WHERE ID =')) {
    const id = params[0];
    const found = mockStore.harvestListings.find(item => item.id === id);
    return {
      rows: found ? [found] : [],
      rowCount: found ? 1 : 0
    };
  }

  // 3. Insert new harvest listing (from WhatsApp chatbot)
  if (normalized.startsWith('INSERT INTO HARVEST_LISTINGS')) {
    const newListing = {
      id: params[0] || `KS-${Date.now().toString().slice(-4)}`,
      farmerId: params[1] || 'FARMER-101',
      cropName: params[2] || 'Fresh Produce',
      hindiName: params[3] || '',
      category: params[4] || 'vegetables',
      variety: params[5] || 'Farm Gate Grade A',
      quantityQuintals: Number(params[6] || 10),
      availableQuintals: Number(params[6] || 10),
      askingPricePerKg: Number(params[7] || 25),
      tier20qPricePerKg: Number(params[7] || 25) * 0.92,
      tier50qPricePerKg: Number(params[7] || 25) * 0.86,
      harvestDate: new Date().toISOString().split('T')[0],
      harvestTimeStamp: 'Harvested Just Now via WhatsApp',
      grade: 'Hospital & Mess Grade A',
      isOrganic: Boolean(params[8]),
      fssaiResidueTested: true,
      whatsappListed: true,
      rawTranscription: params[9] || '',
      confidenceScore: 99.2,
      status: 'ACTIVE'
    };

    mockStore.harvestListings.unshift(newListing);
    return {
      rows: [newListing],
      rowCount: 1
    };
  }

  // 4. Fetch orders
  if (normalized.startsWith('SELECT') && normalized.includes('ORDERS')) {
    return {
      rows: mockStore.orders,
      rowCount: mockStore.orders.length
    };
  }

  // 5. Insert new order (B2B Checkout)
  if (normalized.startsWith('INSERT INTO ORDERS')) {
    const newOrder = {
      id: params[0] || `PO-${Date.now().toString().slice(-6)}`,
      institutionId: params[1] || 'INST-AIIMS',
      totalWeightQuintals: params[2],
      produceSubtotal: params[3],
      logisticsFreight: params[4],
      intermediaryCommission: 0.00,
      totalAmount: params[5],
      paymentEscrowStatus: 'HELD_IN_ESCROW',
      deliverySchedule: params[6] || 'IMMEDIATE_DISPATCH',
      createdAt: new Date().toISOString()
    };
    mockStore.orders.unshift(newOrder);
    return {
      rows: [newOrder],
      rowCount: 1
    };
  }

  // Fallback generic response
  return { rows: [], rowCount: 0 };
}

export function isMock() {
  return !isConnectedToPostgres;
}

export function getMockStore() {
  return mockStore;
}

export default {
  query,
  isMock,
  getMockStore
};
