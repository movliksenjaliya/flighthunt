// =============================================
// SCRAPERS.JS
// Shows REAL prices via search redirects
// No fake prices — sends user directly to
// booking sites with correct search URLs
// =============================================

// =============================================
// SEARCH SITES — what we show as results
// =============================================

const RESULT_SITES = [
  {
    id:    'google_flights',
    name:  'Google Flights',
    icon:  '🔍',
    color: '#4285f4',
    note:  'Best price comparison',
  },
  {
    id:    'skyscanner',
    name:  'Skyscanner',
    icon:  '🌐',
    color: '#00a9e0',
    note:  'Compare all airlines',
  },
  {
    id:    'kayak',
    name:  'Kayak',
    icon:  '🛶',
    color: '#ff6600',
    note:  'Price forecasting',
  },
  {
    id:    'kiwi',
    name:  'Kiwi.com',
    icon:  '🥝',
    color: '#00b2a1',
    note:  'Flexible routes & dates',
  },
  {
    id:    'expedia',
    name:  'Expedia',
    icon:  '✈️',
    color: '#00355f',
    note:  'Flights + Hotels bundles',
  },
  {
    id:    'momondo',
    name:  'Momondo',
    icon:  '🌸',
    color: '#e91e8c',
    note:  'Hidden deal finder',
  },
];

// =============================================
// MAIN SEARCH FUNCTION
// Returns search links — NOT fake prices
// =============================================

async function searchFlights(params, onProgress) {
  const total = RESULT_SITES.length;
  let done = 0;

  // Simulate checking each site (UX progress)
  const sitePromises = RESULT_SITES.map((site, idx) =>
    new Promise(resolve => {
      setTimeout(() => {
        onProgress?.({
          type:   'status',
          siteId: site.id,
          status: 'searching',
          name:   site.name,
        });

        setTimeout(() => {
          done++;
          onProgress?.({
            type:    'status',
            siteId:  site.id,
            status:  'done',
            name:    site.name,
          });
          onProgress?.({
            type:    'progress',
            percent: Math.round((done / total) * 100),
          });
          resolve();
        }, 400 + Math.random() * 600);

      }, idx * 300);
    })
  );

  await Promise.all(sitePromises);

  // Build result cards — one per site
  // Each card links directly to that site's search results
  const results = RESULT_SITES.map(site => ({
    id:          `${site.id}_${generateId()}`,
    source:      site.name,
    sourceId:    site.id,
    sourceColor: site.color,
    sourceIcon:  site.icon,
    sourceNote:  site.note,
    bookingUrl:  SEARCH_SITES.find(s => s.id === site.id)?.buildUrl(params) || '#',
    params:      { ...params },
    isLowest:    false,
  }));

  return results;
}

// =============================================
// CALENDAR PRICE FETCHER
// Opens Google Flights calendar view
// =============================================

async function fetchCalendarPrices(params) {
  // Return empty — we now use real site redirects
  return {};
}
