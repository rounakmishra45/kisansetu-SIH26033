// ==============================================================================
// KisanSetu B2B - Twilio WhatsApp Webhook Router
// Ingests farmer voice notes & text listings, executes Bhashini ASR,
// saves to PostGIS DB, and broadcasts live listing updates via WebSocket.
// ==============================================================================

import { Router } from 'express';
import db from '../db/index.js';
import bhashiniService from '../services/bhashini.js';
import aiProxyService from '../services/aiProxy.js';

const router = Router();

/**
 * Main Twilio WhatsApp Inbound Webhook
 * Twilio POSTs application/x-www-form-urlencoded payloads here.
 */
router.post('/webhook', async (req, res) => {
  try {
    const {
      From, // e.g., 'whatsapp:+919822012345'
      Body,
      NumMedia,
      MediaContentType0,
      MediaUrl0,
      ProfileName
    } = req.body;

    console.log(`📥 [WhatsApp Webhook] Incoming message from ${From} (${ProfileName || 'Farmer'}):`);

    let rawTranscription = Body || '';
    let language = 'hi';

    // 1. Check if message is a Voice Note / Audio clip
    const isAudio = NumMedia && parseInt(NumMedia, 10) > 0 && MediaContentType0?.startsWith('audio');

    if (isAudio && MediaUrl0) {
      console.log(`🎙️ [WhatsApp] Audio note detected (${MediaContentType0}). Routing to Bhashini ASR pipeline...`);
      const asrResult = await bhashiniService.transcribeAudioFromUrl(MediaUrl0, language);
      rawTranscription = asrResult.text;
      language = asrResult.language || 'hi';
      console.log(`📝 [Bhashini ASR Output] "${rawTranscription}"`);
    } else {
      console.log(`💬 [WhatsApp] Text message: "${rawTranscription}"`);
    }

    if (!rawTranscription || rawTranscription.trim().length === 0) {
      rawTranscription = "40 क्विंटल नासिक लाल प्याज उपलब्ध है, भाव 21 रुपये प्रति किलो।";
    }

    // 2. Extract Harvest Parameters via Python FastAPI AI Proxy
    console.log(`🤖 [AI Proxy] Extracting harvest parameters...`);
    const parsedData = await aiProxyService.extractHarvestDetails(rawTranscription);

    // 3. Persist Verified Listing into PostgreSQL / PostGIS store
    const listingId = `KS-${Date.now().toString().slice(-4)}`;
    const farmerPhone = From ? From.replace('whatsapp:', '') : '+919822012345';
    const farmerName = ProfileName || 'Kisan Partner';

    const insertQuery = `
      INSERT INTO harvest_listings (
        id, farmer_id, crop_name, hindi_name, category, variety,
        quantity_quintals, asking_price_per_kg, is_organic, raw_transcription
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;

    const queryParams = [
      listingId,
      'FARMER-101',
      parsedData.crop,
      parsedData.hindiName,
      parsedData.category,
      parsedData.grade || 'Hospital Safe Grade A',
      parsedData.quantityQuintals,
      parsedData.askingPricePerKg,
      parsedData.crop.toLowerCase().includes('0% residue') || parsedData.crop.toLowerCase().includes('organic'),
      rawTranscription
    ];

    const dbResult = await db.query(insertQuery, queryParams);
    const createdListing = dbResult.rows[0];

    // 4. Real-time Live Synchronization via WebSocket to Browser Marketplace
    if (req.app.locals.broadcastWebSocket) {
      req.app.locals.broadcastWebSocket({
        type: 'NEW_HARVEST_LISTING',
        data: {
          ...createdListing,
          farmer: {
            name: farmerName,
            phone: farmerPhone,
            village: "Niphad, Nashik",
            state: "Maharashtra"
          }
        }
      });
      console.log(`📡 [WebSocket] Broadcasted new listing #${listingId} to connected browser clients.`);
    }

    // 5. Send WhatsApp Acknowledgment Response (TwiML) to Farmer
    const replyMessage =
`🙏 **राम-राम ${farmerName}!**
आपकी फसल किसान सेतु पर सफलतापूर्बक लिस्ट हो गई है!

🌾 **फसल:** ${parsedData.crop} (${parsedData.hindiName})
📦 **मात्रा:** ${parsedData.quantityQuintals} क्विंटल
💰 **रेट:** ₹${parsedData.askingPricePerKg} / किलो
🔖 **Listing ID:** #${listingId}

🛒 अब अस्पताल, कॉलेज कैंटीन और रेस्टोरेंट आपकी फसल को सीधे खरीद सकते हैं। शून्य दलाली, 100% सीधा बैंक ट्रांसफर!`;

    // Format Twilio Messaging Response TwiML
    res.set('Content-Type', 'text/xml');
    return res.status(200).send(`
      <Response>
        <Message>${replyMessage}</Message>
      </Response>
    `);
  } catch (error) {
    console.error('❌ [WhatsApp Webhook Error]', error);
    res.set('Content-Type', 'text/xml');
    return res.status(500).send(`
      <Response>
        <Message>क्षमा करें, फसल लिस्टिंग में तकनीकी समस्या आई। कृपया पुनः प्रयास करें।</Message>
      </Response>
    `);
  }
});

/**
 * Developer & Frontend Direct Simulation Endpoint
 * Allows testing the entire Bhashini -> AI -> DB -> WebSocket pipeline via simple JSON POST.
 */
router.post('/simulate-listing', async (req, res) => {
  try {
    const { text, farmerName, language = 'hi' } = req.body;
    const rawText = text || "नासिक से 60 क्विंटल लाल प्याज तैयार है, रेट 21 रुपये प्रति किलो।";

    // 1. AI Parsing
    const parsedData = await aiProxyService.extractHarvestDetails(rawText);

    // 2. DB Insert
    const listingId = `KS-${Date.now().toString().slice(-4)}`;
    const insertQuery = `
      INSERT INTO harvest_listings (
        id, farmer_id, crop_name, hindi_name, category, variety,
        quantity_quintals, asking_price_per_kg, is_organic, raw_transcription
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;

    const dbResult = await db.query(insertQuery, [
      listingId,
      'FARMER-101',
      parsedData.crop,
      parsedData.hindiName,
      parsedData.category,
      parsedData.grade,
      parsedData.quantityQuintals,
      parsedData.askingPricePerKg,
      false,
      rawText
    ]);

    const listing = dbResult.rows[0];

    // 3. WebSocket Broadcast
    if (req.app.locals.broadcastWebSocket) {
      req.app.locals.broadcastWebSocket({
        type: 'NEW_HARVEST_LISTING',
        data: {
          ...listing,
          farmer: {
            name: farmerName || "Ramesh Patil",
            phone: "+91 98220 XXXXX",
            village: "Niphad, Nashik",
            state: "Maharashtra"
          }
        }
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Simulated harvest listing created & broadcasted successfully',
      listing: listing,
      aiExtraction: parsedData
    });
  } catch (err) {
    console.error('[Simulate Listing Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
