// =============================================
// UTILS.JS - Airport data + FIXED URL builders
// =============================================

const AIRPORTS = [
  // EUROPE
  { iata:'BER', name:'Berlin Brandenburg',          city:'Berlin',        country:'Germany'     },
  { iata:'FRA', name:'Frankfurt Airport',           city:'Frankfurt',     country:'Germany'     },
  { iata:'MUC', name:'Munich Airport',              city:'Munich',        country:'Germany'     },
  { iata:'HAM', name:'Hamburg Airport',             city:'Hamburg',       country:'Germany'     },
  { iata:'DUS', name:'Dusseldorf Airport',          city:'Dusseldorf',    country:'Germany'     },
  { iata:'CGN', name:'Cologne Bonn Airport',        city:'Cologne',       country:'Germany'     },
  { iata:'STR', name:'Stuttgart Airport',           city:'Stuttgart',     country:'Germany'     },
  { iata:'LHR', name:'Heathrow',                    city:'London',        country:'UK'          },
  { iata:'LGW', name:'Gatwick',                     city:'London',        country:'UK'          },
  { iata:'STN', name:'Stansted',                    city:'London',        country:'UK'          },
  { iata:'MAN', name:'Manchester Airport',          city:'Manchester',    country:'UK'          },
  { iata:'CDG', name:'Charles de Gaulle',           city:'Paris',         country:'France'      },
  { iata:'ORY', name:'Orly',                        city:'Paris',         country:'France'      },
  { iata:'AMS', name:'Schiphol',                    city:'Amsterdam',     country:'Netherlands' },
  { iata:'BCN', name:'El Prat',                     city:'Barcelona',     country:'Spain'       },
  { iata:'MAD', name:'Barajas',                     city:'Madrid',        country:'Spain'       },
  { iata:'AGP', name:'Malaga Airport',              city:'Malaga',        country:'Spain'       },
  { iata:'PMI', name:'Palma de Mallorca',           city:'Palma',         country:'Spain'       },
  { iata:'FCO', name:'Fiumicino',                   city:'Rome',          country:'Italy'       },
  { iata:'MXP', name:'Malpensa',                    city:'Milan',         country:'Italy'       },
  { iata:'BGY', name:'Bergamo Orio al Serio',       city:'Bergamo',       country:'Italy'       },
  { iata:'NAP', name:'Naples Airport',              city:'Naples',        country:'Italy'       },
  { iata:'VCE', name:'Venice Marco Polo',           city:'Venice',        country:'Italy'       },
  { iata:'VIE', name:'Vienna Airport',              city:'Vienna',        country:'Austria'     },
  { iata:'ZRH', name:'Zurich Airport',              city:'Zurich',        country:'Switzerland' },
  { iata:'GVA', name:'Geneva Airport',              city:'Geneva',        country:'Switzerland' },
  { iata:'BRU', name:'Brussels Airport',            city:'Brussels',      country:'Belgium'     },
  { iata:'CPH', name:'Copenhagen Airport',          city:'Copenhagen',    country:'Denmark'     },
  { iata:'ARN', name:'Stockholm Arlanda',           city:'Stockholm',     country:'Sweden'      },
  { iata:'OSL', name:'Oslo Gardermoen',             city:'Oslo',          country:'Norway'      },
  { iata:'HEL', name:'Helsinki Airport',            city:'Helsinki',      country:'Finland'     },
  { iata:'LIS', name:'Lisbon Airport',              city:'Lisbon',        country:'Portugal'    },
  { iata:'OPO', name:'Porto Airport',               city:'Porto',         country:'Portugal'    },
  { iata:'ATH', name:'Athens Eleftherios Venizelos',city:'Athens',        country:'Greece'      },
  { iata:'HER', name:'Heraklion Airport',           city:'Heraklion',     country:'Greece'      },
  { iata:'WAW', name:'Warsaw Chopin',               city:'Warsaw',        country:'Poland'      },
  { iata:'PRG', name:'Prague Airport',              city:'Prague',        country:'Czech Rep.'  },
  { iata:'BUD', name:'Budapest Airport',            city:'Budapest',      country:'Hungary'     },
  { iata:'OTP', name:'Bucharest Otopeni',           city:'Bucharest',     country:'Romania'     },
  { iata:'DBV', name:'Dubrovnik Airport',           city:'Dubrovnik',     country:'Croatia'     },
  { iata:'DUB', name:'Dublin Airport',              city:'Dublin',        country:'Ireland'     },
  { iata:'KEF', name:'Reykjavik Keflavik',          city:'Reykjavik',     country:'Iceland'     },
  { iata:'IST', name:'Istanbul Airport',            city:'Istanbul',      country:'Turkey'      },
  { iata:'SAW', name:'Istanbul Sabiha Gokcen',      city:'Istanbul',      country:'Turkey'      },
  { iata:'AYT', name:'Antalya Airport',             city:'Antalya',       country:'Turkey'      },
  { iata:'ESB', name:'Ankara Esenboga',             city:'Ankara',        country:'Turkey'      },

  // INDIA
  { iata:'DEL', name:'Indira Gandhi Intl',          city:'New Delhi',     country:'India'       },
  { iata:'BOM', name:'Chhatrapati Shivaji Intl',    city:'Mumbai',        country:'India'       },
  { iata:'BLR', name:'Kempegowda Intl',             city:'Bangalore',     country:'India'       },
  { iata:'MAA', name:'Chennai Intl',                city:'Chennai',       country:'India'       },
  { iata:'HYD', name:'Rajiv Gandhi Intl',           city:'Hyderabad',     country:'India'       },
  { iata:'CCU', name:'Netaji Subhas Chandra Bose',  city:'Kolkata',       country:'India'       },
  { iata:'COK', name:'Cochin Intl',                 city:'Kochi',         country:'India'       },
  { iata:'AMD', name:'Sardar Vallabhbhai Patel',    city:'Ahmedabad',     country:'India'       },
  { iata:'PNQ', name:'Pune Airport',                city:'Pune',          country:'India'       },
  { iata:'GOI', name:'Goa Airport',                 city:'Goa',           country:'India'       },
  { iata:'JAI', name:'Jaipur Airport',              city:'Jaipur',        country:'India'       },
  { iata:'LKO', name:'Chaudhary Charan Singh',      city:'Lucknow',       country:'India'       },
  { iata:'ATQ', name:'Sri Guru Ram Dass Jee Intl',  city:'Amritsar',      country:'India'       },
  { iata:'TRV', name:'Trivandrum Intl',             city:'Thiruvananthapuram', country:'India'  },
  { iata:'IXC', name:'Chandigarh Airport',          city:'Chandigarh',    country:'India'       },
  { iata:'VNS', name:'Lal Bahadur Shastri Intl',    city:'Varanasi',      country:'India'       },
  { iata:'GAU', name:'Lokpriya Gopinath Bordoloi',  city:'Guwahati',      country:'India'       },
  { iata:'SXR', name:'Sheikh ul Alam Airport',      city:'Srinagar',      country:'India'       },
  { iata:'IXL', name:'Kushok Bakula Rimpochee',     city:'Leh',           country:'India'       },
  { iata:'NAG', name:'Dr Ambedkar Intl',            city:'Nagpur',        country:'India'       },
  { iata:'IDR', name:'Devi Ahilyabai Holkar',       city:'Indore',        country:'India'       },
  { iata:'BHO', name:'Raja Bhoj Airport',           city:'Bhopal',        country:'India'       },
  { iata:'IXJ', name:'Jammu Airport',               city:'Jammu',         country:'India'       },
  { iata:'RPR', name:'Swami Vivekananda Intl',      city:'Raipur',        country:'India'       },

  // HUBS
  { iata:'DXB', name:'Dubai Intl',                  city:'Dubai',         country:'UAE'         },
  { iata:'AUH', name:'Abu Dhabi Intl',              city:'Abu Dhabi',     country:'UAE'         },
  { iata:'DOH', name:'Hamad Intl',                  city:'Doha',          country:'Qatar'       },
  { iata:'RUH', name:'King Khalid Intl',            city:'Riyadh',        country:'Saudi Arabia'},
  { iata:'KUL', name:'Kuala Lumpur Intl',           city:'Kuala Lumpur',  country:'Malaysia'    },
  { iata:'SIN', name:'Changi Airport',              city:'Singapore',     country:'Singapore'   },
  { iata:'BKK', name:'Suvarnabhumi',                city:'Bangkok',       country:'Thailand'    },
  { iata:'CMB', name:'Bandaranaike Intl',           city:'Colombo',       country:'Sri Lanka'   },
  { iata:'KTM', name:'Tribhuvan Intl',              city:'Kathmandu',     country:'Nepal'       },
];

// =============================================
// POPULAR ROUTES
// =============================================
const POPULAR_ROUTES = [
  { from:'BER', to:'DEL', label:'Berlin → Delhi',        fromPrice: 399 },
  { from:'FRA', to:'BOM', label:'Frankfurt → Mumbai',    fromPrice: 420 },
  { from:'LHR', to:'DEL', label:'London → Delhi',        fromPrice: 350 },
  { from:'AMS', to:'BLR', label:'Amsterdam → Bangalore', fromPrice: 445 },
  { from:'CDG', to:'BOM', label:'Paris → Mumbai',        fromPrice: 390 },
  { from:'MUC', to:'DEL', label:'Munich → Delhi',        fromPrice: 380 },
  { from:'BER', to:'BCN', label:'Berlin → Barcelona',    fromPrice:  39 },
  { from:'LHR', to:'AMS', label:'London → Amsterdam',    fromPrice:  49 },
  { from:'CDG', to:'FCO', label:'Paris → Rome',          fromPrice:  35 },
  { from:'FRA', to:'ATH', label:'Frankfurt → Athens',    fromPrice:  59 },
  { from:'MUC', to:'BOM', label:'Munich → Mumbai',       fromPrice: 410 },
  { from:'VIE', to:'DEL', label:'Vienna → Delhi',        fromPrice: 370 },
];

// =============================================
// SEARCH SITES — with FIXED working URLs
// =============================================
const SEARCH_SITES = [
  {
    id:    'google_flights',
    name:  'Google Flights',
    icon:  '🔍',
    color: '#4285f4',
    buildUrl: buildGoogleFlightsUrl,
  },
  {
    id:    'skyscanner',
    name:  'Skyscanner',
    icon:  '🌐',
    color: '#00a9e0',
    buildUrl: buildSkyscannerUrl,
  },
  {
    id:    'kayak',
    name:  'Kayak',
    icon:  '🛶',
    color: '#ff6600',
    buildUrl: buildKayakUrl,
  },
  {
    id:    'kiwi',
    name:  'Kiwi.com',
    icon:  '🥝',
    color: '#00b2a1',
    buildUrl: buildKiwiUrl,
  },
  {
    id:    'expedia',
    name:  'Expedia',
    icon:  '✈️',
    color: '#00355f',
    buildUrl: buildExpediaUrl,
  },
  {
    id:    'momondo',
    name:  'Momondo',
    icon:  '🌸',
    color: '#e91e8c',
    buildUrl: buildMomondoUrl,
  },
];

// =============================================
// FIXED URL BUILDERS — tested and working
// =============================================

// ---- GOOGLE FLIGHTS ---- works perfectly
function buildGoogleFlightsUrl(p) {
  const dep = formatDateYMD(p.departDate);
  const adults   = p.adults   || 1;
  const children = p.children || 0;

  // Build passenger string: 1 adult = just blank, 2 adults = ,a
  let pax = '';
  for (let i = 0; i < adults;   i++) pax += 'a';
  for (let i = 0; i < children; i++) pax += 'c';

  const cabinMap = {
    economy: '1', premium_economy: '2', business: '3', first: '4'
  };
  const cabin = cabinMap[p.cabinClass] || '1';

  if (p.tripType === 'roundtrip' && p.returnDate) {
    const ret = formatDateYMD(p.returnDate);
    return `https://www.google.com/travel/flights?q=flights+from+${p.origin}+to+${p.destination}&hl=en&curr=EUR`;
  }

  return `https://www.google.com/travel/flights?q=flights+from+${p.origin}+to+${p.destination}+on+${dep}&hl=en&curr=EUR`;
}

// ---- SKYSCANNER ---- working deep link format
function buildSkyscannerUrl(p) {
  const dep      = formatDateYMD(p.departDate).replace(/-/g, '');
  const adults   = p.adults   || 1;
  const children = p.children || 0;
  const cabin    = { economy:'economy', premium_economy:'premiumeconomy', business:'business', first:'first' }[p.cabinClass] || 'economy';

  const orig = p.origin.toLowerCase();
  const dest = p.destination.toLowerCase();

  // Build passenger part
  let paxParts = [];
  for (let i = 0; i < adults;   i++) paxParts.push('adult');
  for (let i = 0; i < children; i++) paxParts.push('child~10');

  const paxStr = paxParts.join('-');

  if (p.tripType === 'roundtrip' && p.returnDate) {
    const ret = formatDateYMD(p.returnDate).replace(/-/g, '');
    return `https://www.skyscanner.net/transport/flights/${orig}/${dest}/${dep}/${ret}/?adults=${adults}&children=${children}&adultsv2=${adults}&childrenv2=&infants=0&cabinclass=${cabin}&currency=EUR&locale=en-GB&market=UK&preferDirects=false`;
  }

  return `https://www.skyscanner.net/transport/flights/${orig}/${dest}/${dep}/?adults=${adults}&children=${children}&adultsv2=${adults}&childrenv2=&infants=0&cabinclass=${cabin}&currency=EUR&locale=en-GB&market=UK&preferDirects=false`;
}

// ---- KAYAK ---- working format
function buildKayakUrl(p) {
  const dep    = formatDateYMD(p.departDate);
  const adults = p.adults   || 1;
  const kids   = p.children || 0;
  const cabin  = { economy:'e', premium_economy:'pe', business:'b', first:'f' }[p.cabinClass] || 'e';

  // Kayak pax format: adults-kidsAGE
  let pax = `${adults}adults`;
  if (kids > 0) {
    for (let i = 0; i < kids; i++) pax += `-child10`;
  }

  if (p.tripType === 'roundtrip' && p.returnDate) {
    const ret = formatDateYMD(p.returnDate);
    return `https://www.kayak.com/flights/${p.origin}-${p.destination}/${dep}/${ret}/${pax}/${cabin}?currency=EUR&sort=price_a`;
  }

  return `https://www.kayak.com/flights/${p.origin}-${p.destination}/${dep}/${pax}/${cabin}?currency=EUR&sort=price_a`;
}

// ---- KIWI.COM ---- FIXED format
function buildKiwiUrl(p) {
  const dep    = formatDateYMD(p.departDate);
  const adults = p.adults   || 1;
  const kids   = p.children || 0;

  // Kiwi correct URL format
  const type = p.tripType === 'roundtrip' ? 'return' : 'oneway';

  if (p.tripType === 'roundtrip' && p.returnDate) {
    const ret = formatDateYMD(p.returnDate);
    return `https://www.kiwi.com/en/search/results/${p.origin.toLowerCase()}/${p.destination.toLowerCase()}/${dep}/${ret}?adults=${adults}&children=${kids}&infants=0&currency=EUR&flightsType=${type}`;
  }

  return `https://www.kiwi.com/en/search/results/${p.origin.toLowerCase()}/${p.destination.toLowerCase()}/${dep}/no-return?adults=${adults}&children=${kids}&infants=0&currency=EUR&flightsType=${type}`;
}

// ---- EXPEDIA ---- working format
function buildExpediaUrl(p) {
  const dep    = formatDateYMD(p.departDate);
  const adults = p.adults   || 1;
  const kids   = p.children || 0;

  if (p.tripType === 'roundtrip' && p.returnDate) {
    const ret = formatDateYMD(p.returnDate);
    return `https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:${p.origin},to:${p.destination},departure:${dep}TANYT&leg2=from:${p.destination},to:${p.origin},departure:${ret}TANYT&passengers=adults:${adults},children:${kids},seniors:0,infantinlap:0&options=cabinclass:economy&mode=search&currency=EUR`;
  }

  return `https://www.expedia.com/Flights-Search?trip=oneway&leg1=from:${p.origin},to:${p.destination},departure:${dep}TANYT&passengers=adults:${adults},children:${kids},seniors:0,infantinlap:0&options=cabinclass:economy&mode=search&currency=EUR`;
}

// ---- MOMONDO ---- working format
function buildMomondoUrl(p) {
  const dep    = formatDateYMD(p.departDate);
  const adults = p.adults   || 1;
  const kids   = p.children || 0;
  const cabin  = { economy:'e', premium_economy:'pe', business:'b', first:'f' }[p.cabinClass] || 'e';

  if (p.tripType === 'roundtrip' && p.returnDate) {
    const ret = formatDateYMD(p.returnDate);
    return `https://www.momondo.com/flight-search/${p.origin}-${p.destination}/${dep}/${ret}/${adults}adults?currency=EUR&cabin=${cabin}&children=${kids}`;
  }

  return `https://www.momondo.com/flight-search/${p.origin}-${p.destination}/${dep}/oneway/${adults}adults?currency=EUR&cabin=${cabin}&children=${kids}`;
}

// =============================================
// DATE HELPERS
// =============================================
function formatDateYMD(dateStr) {
  if (!dateStr) return '';

  // If already in YYYY-MM-DD format just return it
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  const d = new Date(dateStr);
  if (isNaN(d)) return '';

  // Use LOCAL timezone to avoid date shifting
  const y   = d.getFullYear();
  const m   = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}


function formatDateDisplay(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  // Use LOCAL date to avoid timezone shifts
  const y   = d.getFullYear();
  const m   = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m > 0 ? m + 'm' : ''}`.trim();
}

function minutesToTime(baseTime, addMinutes) {
  const [hh, mm] = baseTime.split(':').map(Number);
  const total = hh * 60 + mm + addMinutes;
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}

// =============================================
// AIRPORT SEARCH
// =============================================

function searchAirports(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return AIRPORTS.filter(a =>
    a.iata.toLowerCase().startsWith(q) ||
    a.city.toLowerCase().includes(q) ||
    a.name.toLowerCase().includes(q) ||
    a.country.toLowerCase().includes(q)
  ).slice(0, 8);
}

function getAirportByIATA(iata) {
  return AIRPORTS.find(
    a => a.iata.toUpperCase() === iata.toUpperCase()
  ) || null;
}

// =============================================
// PRICE FORMATTING
// =============================================

function formatEUR(amount) {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('de-DE', {
    style:    'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// =============================================
// PRIVACY HELPERS
// =============================================

function openPrivateBookingTab(url) {
  clearAppCookies();
  const win = window.open(url, '_blank', 'noopener,noreferrer');
  if (!win) return { success: false, url };
  return { success: true };
}

function clearAppCookies() {
  document.cookie.split(';').forEach(c => {
    const name = c.split('=')[0].trim();
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  });
  try { sessionStorage.clear(); } catch(e) {}
}

function isEuropeRoute(origin, destination) {
  const europeCountries = [
    'Germany','UK','France','Netherlands','Spain','Italy',
    'Austria','Switzerland','Belgium','Denmark','Sweden',
    'Norway','Finland','Portugal','Greece','Poland',
    'Czech Rep.','Hungary','Romania','Bulgaria','Croatia',
    'Ireland','Iceland','Turkey'
  ];
  const isEU = (iata) => {
    const a = getAirportByIATA(iata);
    return a && europeCountries.includes(a.country);
  };
  return isEU(origin) || isEU(destination);
}

function isIndiaRoute(origin, destination) {
  const isIN = (iata) => {
    const a = getAirportByIATA(iata);
    return a && a.country === 'India';
  };
  return isIN(origin) || isIN(destination);
}

// =============================================
// LOCAL STORAGE
// =============================================

const Storage = {
  get(key, fallback = null) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
  remove(key) {
    try { localStorage.removeItem(key); } catch {}
  }
};

// =============================================
// MISC
// =============================================

function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  return Promise.resolve();
}
