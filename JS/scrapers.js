// =============================================
// SCRAPERS.JS
// Simulates price fetching via public search APIs
// In a real deployment, use a backend proxy or
// affiliate APIs (Skyscanner, Amadeus free tier)
// =============================================

// ---- Amadeus free API config (get free key at developers.amadeus.com) ----
const AMADEUS_CONFIG = {
  clientId:     'YOUR_AMADEUS_CLIENT_ID',     // Replace after signup
  clientSecret: 'YOUR_AMADEUS_CLIENT_SECRET', // Replace after signup
  baseUrl:      'https://test.api.amadeus.com',
  tokenUrl:     'https://test.api.amadeus.com/v1/security/oauth2/token',
  token:        null,
  tokenExpiry:  0,
};

// =============================================
// AMADEUS TOKEN MANAGER
// =============================================

async function getAmadeusToken() {
  const now = Date.now();
  if (AMADEUS_CONFIG.token && now < AMADEUS_CONFIG.tokenExpiry) {
    return AMADEUS_CONFIG.token;
  }

  // Check cache
  const cached = Storage.get('amadeus_token');
  if (cached && now < cached.expiry) {
    AMADEUS_CONFIG.token      = cached.token;
    AMADEUS_CONFIG.tokenExpiry = cached.expiry;
    return cached.token;
  }

  // Skip if placeholder keys
  if (
    AMADEUS_CONFIG.clientId === 'YOUR_AMADEUS_CLIENT_ID' ||
    !AMADEUS_CONFIG.clientId
  ) {
    return null;
  }

  try {
    const res = await fetch(AMADEUS_CONFIG.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type:    'client_credentials',
        client_id:     AMADEUS_CONFIG.clientId,
        client_secret: AMADEUS_CONFIG.clientSecret,
      }),
    });

    if (!res.ok) throw new Error(`Token error: ${res.status}`);
    const data = await res.json();

    const expiry = now + (data.expires_in - 60) * 1000;
    AMADEUS_CONFIG.token       = data.access_token;
    AMADEUS_CONFIG.tokenExpiry = expiry;
    Storage.set('amadeus_token', { token: data.access_token, expiry });
    return data.access_token;
  } catch (err) {
    console.warn('Amadeus token error:', err.message);
    return null;
  }
}

// =============================================
// AMADEUS FLIGHT SEARCH
// =============================================

async function fetchAmadeusFlights(params) {
  const token = await getAmadeusToken();
  if (!token) return [];

  const {
    origin, destination, departDate, returnDate,
    adults, children, cabinClass, tripType, directOnly
  } = params;

  const cabinMap = {
    economy:         'ECONOMY',
    premium_economy: 'PREMIUM_ECONOMY',
    business:        'BUSINESS',
    first:           'FIRST',
  };

  const queryParams = new URLSearchParams({
    originLocationCode:      origin,
    destinationLocationCode: destination,
    departureDate:           formatDateYMD(departDate),
    adults:                  adults || 1,
    currencyCode:            'EUR',
    max:                     20,
    travelClass:             cabinMap[cabinClass] || 'ECONOMY',
  });

  if (children > 0) queryParams.set('children', children);
  if (tripType === 'roundtrip' && returnDate) {
    queryParams.set('returnDate', formatDateYMD(returnDate));
  }
  if (directOnly) queryParams.set('nonStop', 'true');

  try {
    const res = await fetch(
      `${AMADEUS_CONFIG.baseUrl}/v2/shopping/flight-offers?${queryParams}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.warn('Amadeus flight search error:', res.status, errText);
      return [];
    }

    const data = await res.json();
    if (!data.data || !data.data.length) return [];

    return data.data.map(offer => parseAmadeusOffer(offer, data.dictionaries));
  } catch (err) {
    console.warn('Amadeus fetch error:', err.message);
    return [];
  }
}

function parseAmadeusOffer(offer, dicts) {
  const price      = parseFloat(offer.price.grandTotal);
  const currency   = offer.price.currency;
  const itinerary  = offer.itineraries[0];
  const segments   = itinerary.segments;

  const firstSeg   = segments[0];
  const lastSeg    = segments[segments.length - 1];
  const stops      = segments.length - 1;

  const depTime    = firstSeg.departure.at.slice(11, 16); // HH:MM
  const arrTime    = lastSeg.arrival.at.slice(11, 16);
  const depAirport = firstSeg.departure.iataCode;
  const arrAirport = lastSeg.arrival.iataCode;

  // Duration from ISO 8601 (PT2H30M)
  const durStr   = itinerary.duration || 'PT0H';
  const durMatch = durStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  const durMins  = (parseInt(durMatch[1] || 0) * 60) + parseInt(durMatch[2] || 0);

  const carrierCode = firstSeg.carrierCode;
  const airlineName = (dicts?.carriers?.[carrierCode]) || carrierCode;

  const includedBags = offer.travelerPricings?.[0]
    ?.fareDetailsBySegment?.[0]
    ?.includedCheckedBags?.quantity || 0;

  return {
    id:           offer.id,
    source:       'Amadeus',
    sourceId:     'amadeus',
    airline:      airlineName,
    airlineCode:  carrierCode,
    flightNumber: `${carrierCode}${firstSeg.number}`,
    depTime,
    arrTime,
    depAirport,
    arrAirport,
    duration:     durMins,
    stops,
    price,
    currency,
    includedBags,
    bookingUrl:   buildGoogleFlightsUrl({
      origin:     depAirport,
      destination:arrAirport,
      departDate: firstSeg.departure.at.slice(0, 10),
      returnDate: offer.itineraries[1]
        ? offer.itineraries[1].segments[0].departure.at.slice(0, 10)
        : null,
      tripType:   offer.itineraries.length > 1 ? 'roundtrip' : 'oneway',
      adults:     offer.travelerPricings.filter(t => t.travelerType === 'ADULT').length,
      children:   offer.travelerPricings.filter(t => t.travelerType === 'CHILD').length,
      cabinClass: 'economy',
    }),
    rawOffer: offer,
  };
}

// =============================================
// MOCK PRICE GENERATOR
// Used as fallback when no API key is configured
// Generates realistic prices for demo purposes
// =============================================

const AIRLINE_LIST = [
  { name:'Lufthansa',       code:'LH', logo:'LH' },
  { name:'Air India',       code:'AI', logo:'AI' },
  { name:'Emirates',        code:'EK', logo:'EK' },
  { name:'Qatar Airways',   code:'QR', logo:'QR' },
  { name:'Ryanair',         code:'FR', logo:'FR' },
  { name:'easyJet',         code:'U2', logo:'U2' },
  { name:'British Airways', code:'BA', logo:'BA' },
  { name:'KLM',             code:'KL', logo:'KL' },
  { name:'Air France',      code:'AF', logo:'AF' },
  { name:'Turkish Airlines',code:'TK', logo:'TK' },
  { name:'Eurowings',       code:'EW', logo:'EW' },
  { name:'Wizz Air',        code:'W6', logo:'W6' },
  { name:'Vueling',         code:'VY', logo:'VY' },
  { name:'Swiss',           code:'LX', logo:'LX' },
  { name:'Finnair',         code:'AY', logo:'AY' },
  { name:'IndiGo',          code:'6E', logo:'6E' },
];

const SITE_PRICE_FACTORS = {
  google_flights:  [0.97, 1.02],
  kayak:           [0.98, 1.05],
  skyscanner:      [0.96, 1.03],
  momondo:         [0.95, 1.04],
  expedia:         [1.00, 1.08],
  kiwi:            [0.94, 1.06],
  ryanair:         [0.85, 1.00],
  easyjet:         [0.88, 1.02],
  lufthansa:       [1.05, 1.20],
  airindiaexpress: [0.90, 1.05],
  emirates:        [0.95, 1.10],
};

function getBasePrice(origin, destination, cabinClass) {
  // Rough distance-based pricing
  const indiaEuropePairs = [
    'DEL','BOM','BLR','MAA','HYD','CCU','COK','AMD','PNQ','GOI',
    'JAI','LKO','ATQ','IXC','VNS','GOX','TRV','CJB','IXM'
  ];
  const isLongHaul = (
    indiaEuropePairs.includes(origin) || indiaEuropePairs.includes(destination)
  );

  let base = isLongHaul ? 350 : 80;

  const classMult = { economy:1, premium_economy:1.8, business:3.5, first:6 };
  base *= (classMult[cabinClass] || 1);

  // Add randomness ±20%
  const variance = base * 0.2;
  return base + (Math.random() * variance * 2) - variance;
}

function generateMockFlights(params) {
  const {
    origin, destination, departDate, returnDate,
    adults, children, cabinClass, tripType, directOnly,
    checkedBaggage
  } = params;

  const totalPax  = (adults || 1) + (children || 0);
  const basePrice = getBasePrice(origin, destination, cabinClass);

  // Select relevant airlines
  const isLongHaul = basePrice > 200;
  let airlines = isLongHaul
    ? AIRLINE_LIST.filter(a => ['LH','AI','EK','QR','BA','KL','AF','TK','AY','LX'].includes(a.code))
    : AIRLINE_LIST.filter(a => ['LH','FR','U2','EW','W6','VY','BA','KL','AF'].includes(a.code));

  // Shuffle
  airlines = airlines.sort(() => Math.random() - 0.5).slice(0, 6);

  const results = [];

  SEARCH_SITES.forEach(site => {
    // Skip low-cost Europe sites for long-haul
    if (site.europeOnly && isLongHaul) return;
    // Skip India-only for Europe routes
    if (site.indiaOnly && !isLongHaul) return;

    const [minF, maxF] = SITE_PRICE_FACTORS[site.id] || [0.98, 1.04];
    const factor = minF + Math.random() * (maxF - minF);

    // Pick 1-3 flights per site
    const count = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < count; i++) {
      const airline     = airlines[i % airlines.length];
      const price       = Math.round(basePrice * factor * totalPax + (Math.random() * 30 - 15));
      const pricePerPax = Math.round(price / totalPax);

      // Generate realistic times
      const depHour = Math.floor(Math.random() * 20) + 4;
      const depMin  = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
      const depTime = `${String(depHour).padStart(2,'0')}:${String(depMin).padStart(2,'0')}`;

      // Duration
      const isLH   = basePrice > 200;
      const minDur = isLH ? 360 : 60;
      const maxDur = isLH ? 600 : 240;
      const dur    = Math.floor(Math.random() * (maxDur - minDur) + minDur);
      const arrTime = minutesToTime(depTime, dur);

      // Stops
      const stopChances = directOnly ? [1] : [0.45, 0.35, 0.20];
      const stopRoll    = Math.random();
      const stops = directOnly ? 0
        : stopRoll < stopChances[0] ? 0
        : stopRoll < stopChances[0] + stopChances[1] ? 1 : 2;

      const hasBags = checkedBaggage
        ? true
        : Math.random() > 0.5;

      const flightNum = `${airline.code}${Math.floor(Math.random() * 9000 + 1000)}`;

      results.push({
        id:          `${site.id}_${generateId()}`,
        source:      site.name,
        sourceId:    site.id,
        sourceColor: site.color,
        sourceIcon:  site.icon,
        airline:     airline.name,
        airlineCode: airline.code,
        flightNumber: flightNum,
        depTime,
        arrTime,
        depAirport:  origin,
        arrAirport:  destination,
        duration:    dur,
        stops,
        price:       pricePerPax,
        totalPrice:  price,
        currency:    'EUR',
        includedBags: hasBags ? 1 : 0,
        bookingUrl:  site.buildUrl(params),
        isLowest:    false,
      });
    }
  });

  // Mark the lowest price
  if (results.length > 0) {
    const minPrice = Math.min(...results.map(r => r.price));
    results.forEach(r => { r.isLowest = r.price === minPrice; });
  }

  // Sort by price
  results.sort((a, b) => a.price - b.price);
  return results;
}

// =============================================
// MAIN SEARCH ORCHESTRATOR
// =============================================

async function searchFlights(params, onProgress) {
  const results    = [];
  const sites      = SEARCH_SITES.filter(s => {
    if (s.europeOnly && !isEuropeRoute(params.origin, params.destination)) return false;
    if (s.indiaOnly  && !isIndiaRoute(params.origin, params.destination))  return false;
    return true;
  });
  const total = sites.length;
  let done    = 0;

  // Try Amadeus API first
  onProgress?.({ type:'status', siteId:'amadeus', status:'searching', name:'Amadeus API' });

  let amadeusResults = [];
  try {
    amadeusResults = await fetchAmadeusFlights(params);
    if (amadeusResults.length > 0) {
      results.push(...amadeusResults);
      onProgress?.({ type:'status', siteId:'amadeus', status:'done', name:'Amadeus API', count: amadeusResults.length });
    } else {
      onProgress?.({ type:'status', siteId:'amadeus', status:'error', name:'Amadeus API (using demo data)' });
    }
  } catch (e) {
    onProgress?.({ type:'status', siteId:'amadeus', status:'error', name:'Amadeus API (using demo data)' });
  }

  // Simulate fetching from each site (with staggered delays for UX)
  const sitePromises = sites.map((site, idx) =>
    new Promise(resolve => {
      const delay = 300 + idx * 250 + Math.random() * 400;
      setTimeout(() => {
        onProgress?.({ type:'status', siteId: site.id, status:'searching', name: site.name });

        // Simulate occasional site "failure"
        const failed = Math.random() < 0.08;

        setTimeout(() => {
          if (failed) {
            onProgress?.({ type:'status', siteId: site.id, status:'error', name: site.name });
          } else {
            onProgress?.({ type:'status', siteId: site.id, status:'done', name: site.name });
          }
          done++;
          const percent = Math.round((done / total) * 100);
          onProgress?.({ type:'progress', percent });
          resolve();
        }, 200 + Math.random() * 300);
      }, delay);
    })
  );

  // Generate mock results (will show while sites "load")
  const mockResults = generateMockFlights(params);

  // Merge Amadeus + mock
  const allResults = amadeusResults.length > 0
    ? [...amadeusResults, ...mockResults.slice(0, 8)]
    : mockResults;

  // Wait for all simulated sites to respond
  await Promise.all(sitePromises);

  // Final sort
  allResults.sort((a, b) => a.price - b.price);

  // Re-mark lowest
  if (allResults.length > 0) {
    const minP = Math.min(...allResults.map(r => r.price));
    allResults.forEach(r => { r.isLowest = r.price === minP; });
  }

  return allResults;
}

// =============================================
// CALENDAR PRICE FETCHER
// =============================================

async function fetchCalendarPrices(params) {
  const prices = {};
  const baseDate = new Date(params.departDate);
  const base     = getBasePrice(params.origin, params.destination, params.cabinClass);

  for (let i = -3; i <= 3; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    const key   = d.toISOString().slice(0, 10);
    const noise = base * 0.15 * (Math.random() * 2 - 1);
    prices[key] = Math.max(10, Math.round(base + noise));
  }
  return prices;
}
