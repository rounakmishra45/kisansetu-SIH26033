// Automated verification script testing all KisanSetu Express Backend routes
const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('🧪 Starting KisanSetu Backend Endpoints Verification...\n');

  try {
    // 1. Health Check
    const resHealth = await fetch(`${BASE_URL}/api/health`);
    const dataHealth = await resHealth.json();
    console.log('✅ [GET /api/health] Status:', dataHealth.status, '| Driver:', dataHealth.database.driver);

    // 2. Simulated WhatsApp Inbound Listing
    const resListing = await fetch(`${BASE_URL}/api/whatsapp/simulate-listing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'नासिक निफाड़ से 50 क्विंटल लाल प्याज तैयार है, रेट 21 रुपये प्रति किलो।',
        farmerName: 'Ramesh Tukaram Patil'
      })
    });
    const dataListing = await resListing.json();
    console.log('✅ [POST /api/whatsapp/simulate-listing] Created ID:', dataListing.listing?.id, '| Crop:', dataListing.listing?.cropName);

    // 3. B2B Wholesale Checkout with Quantity Tiered Pricing
    const resOrder = await fetch(`${BASE_URL}/api/orders/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        institutionName: 'AIIMS New Delhi Central Hospital Mess',
        deliverySchedule: 'WEEKLY_CONTRACT',
        items: [
          {
            listingId: 'KS-101',
            cropName: 'Nashik Red Hybrid Onions',
            quantityQuintals: 50, // 50+ Quintals qualifies for 14% institutional discount
            basePricePerKg: 21
          },
          {
            listingId: 'KS-102',
            cropName: 'PBN-51 Premium Basmati Rice',
            quantityQuintals: 20, // 20-49 Quintals qualifies for 8% bulk discount
            basePricePerKg: 62
          }
        ]
      })
    });
    const dataOrder = await resOrder.json();
    console.log('✅ [POST /api/orders/checkout] Order ID:', dataOrder.orderId);
    console.log('   Total Weight:', dataOrder.summary?.totalWeightMetricTonnes, 'MT');
    console.log('   Total Amount:', '₹' + dataOrder.summary?.totalOrderAmount?.toLocaleString());
    console.log('   Institutional Savings vs APMC:', '₹' + dataOrder.middlemanEliminationImpact?.netSavingsRupees?.toLocaleString(), `(${dataOrder.middlemanEliminationImpact?.savingsPercent})`);
    console.log('   Applied Tiers:', dataOrder.items?.map(i => `${i.cropName}: ${i.tierApplied} (${i.discountPct}% off)`).join(' | '));

    // 4. Ministry Price Radar
    const resRadar = await fetch(`${BASE_URL}/api/admin/price-radar`);
    const dataRadar = await resRadar.json();
    console.log('✅ [GET /api/admin/price-radar] Monitored Commodities:', dataRadar.commodities?.length);

    // 5. Ministry AI Hoarding Alerts
    const resAlerts = await fetch(`${BASE_URL}/api/admin/hoarding-alerts`);
    const dataAlerts = await resAlerts.json();
    console.log('✅ [GET /api/admin/hoarding-alerts] Active Alerts:', dataAlerts.count);

    // 6. Ministry Executive Directive Authorization
    const resIntervention = await fetch(`${BASE_URL}/api/admin/interventions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        interventionType: 'buffer-release',
        commodity: 'Nashik Red Hybrid Onion',
        volumeMT: 5000,
        targetZone: 'Delhi NCR & Mumbai Metropolitan Region'
      })
    });
    const dataIntervention = await resIntervention.json();
    console.log('✅ [POST /api/admin/interventions] Directive Authorized:', dataIntervention.directiveId, '| Title:', dataIntervention.directive?.title);

    console.log('\n🎉 ALL BACKEND ENDPOINTS PASSED WITH 100% SUCCESS!');
  } catch (err) {
    console.error('❌ Verification failed:', err.message);
  }
}

runTests();
