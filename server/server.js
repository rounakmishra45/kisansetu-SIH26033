// ==============================================================================
// KisanSetu B2B - Main Express & WebSocket Server Entry Point
// SIH 2026 Problem Statement 26033: Farmer-to-Consumer Agri-Marketplace
// ==============================================================================

import express from 'express';
import http from 'http';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import dotenv from 'dotenv';
dotenv.config();

// Route Handlers
import whatsappRouter from './routes/whatsapp.js';
import ordersRouter from './routes/orders.js';
import adminRouter from './routes/admin.js';
import db from './db/index.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Create shared HTTP server for both Express and WebSocket
const server = http.createServer(app);

// Initialize WebSocket Server for real-time live synchronization
const wss = new WebSocketServer({ server, path: '/ws' });

// Track connected WebSocket clients
const connectedClients = new Set();

wss.on('connection', (ws, req) => {
  connectedClients.add(ws);
  const clientIp = req.socket.remoteAddress;
  console.log(`🔌 [WebSocket] Client connected from ${clientIp}. Total active clients: ${connectedClients.size}`);

  // Send initial handshake message
  ws.send(JSON.stringify({
    type: 'WS_CONNECTED',
    message: 'Connected to KisanSetu Real-Time Agri-Exchange Stream',
    timestamp: new Date().toISOString()
  }));

  ws.on('close', () => {
    connectedClients.delete(ws);
    console.log(`🔌 [WebSocket] Client disconnected. Remaining clients: ${connectedClients.size}`);
  });

  ws.on('error', (err) => {
    console.error('⚠️ [WebSocket Client Error]', err.message);
    connectedClients.delete(ws);
  });
});

/**
 * Universal WebSocket broadcast function
 * Pushes live updates (new WhatsApp harvest listings, purchase orders, government directives)
 */
export function broadcastWebSocket(payload) {
  const message = JSON.stringify({
    ...payload,
    broadcastAt: new Date().toISOString()
  });

  connectedClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Attach broadcast helper to Express app locals for access inside routers
app.locals.broadcastWebSocket = broadcastWebSocket;

// ==============================================================================
// Middleware Configuration
// ==============================================================================

// Cross-Origin Resource Sharing (CORS)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Parse JSON bodies (e.g. B2B cart checkout, admin interventions)
app.use(express.json({ limit: '10mb' }));

// Parse application/x-www-form-urlencoded (MANDATORY for Twilio WhatsApp Webhooks)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logger in development
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// ==============================================================================
// Route Mounts
// ==============================================================================

// Health Check & Diagnostic Gateway
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    service: 'KisanSetu B2B Enterprise Backend',
    sihProblemStatement: '26033 - Direct Farmer-to-Consumer / Institution Agri-Marketplace',
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      isMockMode: db.isMock(),
      driver: db.isMock() ? 'In-Memory PostGIS Fallback' : 'PostgreSQL + PostGIS Live'
    },
    websocket: {
      path: '/ws',
      activeSubscribers: connectedClients.size
    },
    timestamp: new Date().toISOString()
  });
});

// Mount modular sub-routers
app.use('/api/whatsapp', whatsappRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Centralized Global Error Handler
app.use((err, req, res, next) => {
  console.error('💥 [Server Unhandled Exception]', err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    trace: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ==============================================================================
// Start Server
// ==============================================================================
server.listen(PORT, () => {
  console.log('================================================================');
  console.log(`🌾 KisanSetu Express Backend Running Successfully on Port ${PORT}`);
  console.log(`📡 Local API Gateway: http://localhost:${PORT}/api/health`);
  console.log(`🔌 WebSocket Stream:  ws://localhost:${PORT}/ws`);
  console.log(`📥 WhatsApp Webhook:  http://localhost:${PORT}/api/whatsapp/webhook`);
  console.log(`🛒 B2B Orders API:    http://localhost:${PORT}/api/orders/checkout`);
  console.log(`🏛️ Ministry Admin API: http://localhost:${PORT}/api/admin/price-radar`);
  console.log('================================================================');
});

// Graceful Shutdown
function handleShutdown(signal) {
  console.log(`\n🛑 Received ${signal}. Gracefully shutting down KisanSetu backend...`);
  server.close(() => {
    console.log('✅ HTTP & WebSocket servers closed.');
    process.exit(0);
  });
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

export default app;
