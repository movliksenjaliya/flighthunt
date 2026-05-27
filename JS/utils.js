// =============================================
// UTILITIES: Airport data, URL builders, helpers
// =============================================

const AIRPORTS = [
  // EUROPE
  { iata:'BER', name:'Berlin Brandenburg',       city:'Berlin',        country:'Germany'      },
  { iata:'FRA', name:'Frankfurt Airport',        city:'Frankfurt',     country:'Germany'      },
  { iata:'MUC', name:'Munich Airport',           city:'Munich',        country:'Germany'      },
  { iata:'HAM', name:'Hamburg Airport',          city:'Hamburg',       country:'Germany'      },
  { iata:'DUS', name:'Dusseldorf Airport',       city:'Dusseldorf',    country:'Germany'      },
  { iata:'CGN', name:'Cologne Bonn Airport',     city:'Cologne',       country:'Germany'      },
  { iata:'STR', name:'Stuttgart Airport',        city:'Stuttgart',     country:'Germany'      },
  { iata:'NUE', name:'Nuremberg Airport',        city:'Nuremberg',     country:'Germany'      },
  { iata:'LHR', name:'Heathrow',                 city:'London',        country:'UK'           },
  { iata:'LGW', name:'Gatwick',                  city:'London',        country:'UK'           },
  { iata:'STN', name:'Stansted',                 city:'London',        country:'UK'           },
  { iata:'LTN', name:'Luton',                    city:'London',        country:'UK'           },
  { iata:'EDI', name:'Edinburgh Airport',        city:'Edinburgh',     country:'UK'           },
  { iata:'MAN', name:'Manchester Airport',       city:'Manchester',    country:'UK'           },
  { iata:'BHX', name:'Birmingham Airport',       city:'Birmingham',    country:'UK'           },
  { iata:'CDG', name:'Charles de Gaulle',        city:'Paris',         country:'France'       },
  { iata:'ORY', name:'Orly',                     city:'Paris',         country:'France'       },
  { iata:'NCE', name:'Nice Airport',             city:'Nice',          country:'France'       },
  { iata:'LYS', name:'Lyon Airport',             city:'Lyon',          country:'France'       },
  { iata:'MRS', name:'Marseille Airport',        city:'Marseille',     country:'France'       },
  { iata:'AMS', name:'Schiphol',                 city:'Amsterdam',     country:'Netherlands'  },
  { iata:'EIN', name:'Eindhoven Airport',        city:'Eindhoven',     country:'Netherlands'  },
  { iata:'BCN', name:'El Prat',                  city:'Barcelona',     country:'Spain'        },
  { iata:'MAD', name:'Barajas',                  city:'Madrid',        country:'Spain'        },
  { iata:'AGP', name:'Malaga Airport',           city:'Malaga',        country:'Spain'        },
  { iata:'PMI', name:'Palma de Mallorca',        city:'Palma',         country:'Spain'        },
  { iata:'VLC', name:'Valencia Airport',         city:'Valencia',      country:'Spain'        },
  { iata:'SVQ', name:'Seville Airport',          city:'Seville',       country:'Spain'        },
  { iata:'FCO', name:'Fiumicino',                city:'Rome',          country:'Italy'        },
  { iata:'CIA', name:'Ciampino',                 city:'Rome',          country:'Italy'        },
  { iata:'MXP', name:'Malpensa',                 city:'Milan',         country:'Italy'        },
  { iata:'LIN', name:'Linate',                   city:'Milan',         country:'Italy'        },
  { iata:'BGY', name:'Bergamo Orio al Serio',    city:'Bergamo',       country:'Italy'        },
  { iata:'NAP', name:'Naples Airport',           city:'Naples',        country:'Italy'        },
  { iata:'VCE', name:'Venice Marco Polo',        city:'Venice',        country:'Italy'        },
  { iata:'VIE', name:'Vienna Airport',           city:'Vienna',        country:'Austria'      },
  { iata:'ZRH', name:'Zurich Airport',           city:'Zurich',        country:'Switzerland'  },
  { iata:'GVA', name:'Geneva Airport',           city:'Geneva',        country:'Switzerland'  },
  { iata:'BSL', name:'EuroAirport Basel',        city:'Basel',         country:'Switzerland'  },
  { iata:'BRU', name:'Brussels Airport',         city:'Brussels',      country:'Belgium'      },
  { iata:'CRL', name:'Brussels South Charleroi', city:'Charleroi',     country:'Belgium'      },
  { iata:'CPH', name:'Copenhagen Airport',       city:'Copenhagen',    country:'Denmark'      },
  { iata:'ARN', name:'Stockholm Arlanda',        city:'Stockholm',     country:'Sweden'       },
  { iata:'NYO', name:'Stockholm Skavsta',        city:'Stockholm',     country:'Sweden'       },
  { iata:'OSL', name:'Oslo Gardermoen',          city:'Oslo',          country:'Norway'       },
  { iata:'HEL', name:'Helsinki Airport',         city:'Helsinki',      country:'Finland'      },
  { iata:'LIS', name:'Lisbon Airport',           city:'Lisbon',        country:'Portugal'     },
  { iata:'OPO', name:'Porto Airport',            city:'Porto',         country:'Portugal'     },
  { iata:'FAO', name:'Faro Airport',             city:'Faro',          country:'Portugal'     },
  { iata:'ATH', name:'Athens Eleftherios Venizelos', city:'Athens',    country:'Greece'       },
  { iata:'SKG', name:'Thessaloniki Airport',     city:'Thessaloniki',  country:'Greece'       },
  { iata:'HER', name:'Heraklion Airport',        city:'Heraklion',     country:'Greece'       },
  { iata:'RHO', name:'Rhodes Airport',           city:'Rhodes',        country:'Greece'       },
  { iata:'WAW', name:'Warsaw Chopin',            city:'Warsaw',        country:'Poland'       },
  { iata:'KRK', name:'Krakow Airport',           city:'Krakow',        country:'Poland'       },
  { iata:'PRG', name:'Prague Airport',           city:'Prague',        country:'Czech Rep.'   },
  { iata:'BUD', name:'Budapest Airport',         city:'Budapest',      country:'Hungary'      },
  { iata:'OTP', name:'Bucharest Otopeni',        city:'Bucharest',     country:'Romania'      },
  { iata:'SOF', name:'Sofia Airport',            city:'Sofia',         country:'Bulgaria'     },
  { iata:'DBV', name:'Dubrovnik Airport',        city:'Dubrovnik',     country:'Croatia'      },
  { iata:'SPU', name:'Split Airport',            city:'Split',         country:'Croatia'      },
  { iata:'ZAG', name:'Zagreb Airport',           city:'Zagreb',        country:'Croatia'      },
  { iata:'DUB', name:'Dublin Airport',           city:'Dublin',        country:'Ireland'      },
  { iata:'TXL', name:'Berlin Tegel (closed)',    city:'Berlin',        country:'Germany'      },
  { iata:'SXF', name:'Berlin Schonefeld (closed)', city:'Berlin',      country:'Germany'      },
  { iata:'KEF', name:'Reykjavik Keflavik',       city:'Reykjavik',     country:'Iceland'      },
  { iata:'TLL', name:'Tallinn Airport',          city:'Tallinn',       country:'Estonia'      },
  { iata:'RIX', name:'Riga Airport',             city:'Riga',          country:'Latvia'       },
  { iata:'VNO', name:'Vilnius Airport',          city:'Vilnius',       country:'Lithuania'    },
  { iata:'GRZ', name:'Graz Airport',             city:'Graz',          country:'Austria'      },
  { iata:'SZG', name:'Salzburg Airport',         city:'Salzburg',      country:'Austria'      },
  { iata:'INN', name:'Innsbruck Airport',        city:'Innsbruck',     country:'Austria'      },
  { iata:'SKP', name:'Skopje Airport',           city:'Skopje',        country:'N.Macedonia'  },
  { iata:'TGD', name:'Podgorica Airport',        city:'Podgorica',     country:'Montenegro'   },
  { iata:'TIV', name:'Tivat Airport',            city:'Tivat',         country:'Montenegro'   },
  { iata:'BEG', name:'Belgrade Nikola Tesla',    city:'Belgrade',      country:'Serbia'       },
  { iata:'LJU', name:'Ljubljana Airport',        city:'Ljubljana',     country:'Slovenia'     },
  { iata:'BTS', name:'Bratislava Airport',       city:'Bratislava',    country:'Slovakia'     },
  { iata:'MLA', name:'Malta International',      city:'Valletta',      country:'Malta'        },
  { iata:'TIA', name:'Tirana Airport',           city:'Tirana',        country:'Albania'      },
  { iata:'IST', name:'Istanbul Airport',         city:'Istanbul',      country:'Turkey'       },
  { iata:'SAW', name:'Istanbul Sabiha Gokcen',   city:'Istanbul',      country:'Turkey'       },
  { iata:'AYT', name:'Antalya Airport',          city:'Antalya',       country:'Turkey'       },
  { iata:'ADB', name:'Izmir Adnan Menderes',     city:'Izmir',         country:'Turkey'       },
  { iata:'ESB', name:'Ankara Esenboga',          city:'Ankara',        country:'Turkey'       },
  { iata:'TBS', name:'Tbilisi Airport',          city:'Tbilisi',       country:'Georgia'      },
  { iata:'EVN', name:'Yerevan Zvartnots',        city:'Yerevan',       country:'Armenia'      },
  { iata:'GYD', name:'Baku Heydar Aliyev',       city:'Baku',          country:'Azerbaijan'   },

  // INDIA
  { iata:'DEL', name:'Indira Gandhi Intl',       city:'New Delhi',     country:'India'        },
  { iata:'BOM', name:'Chhatrapati Shivaji Intl', city:'Mumbai',        country:'India'        },
  { iata:'BLR', name:'Kempegowda Intl',          city:'Bangalore',     country:'India'        },
  { iata:'MAA', name:'Chennai Intl',             city:'Chennai',       country:'India'        },
  { iata:'HYD', name:'Rajiv Gandhi Intl',        city:'Hyderabad',     country:'India'        },
  { iata:'CCU', name:'Netaji Subhas Chandra Bose', city:'Kolkata',     country:'India'        },
  { iata:'COK', name:'Cochin Intl',              city:'Kochi',         country:'India'        },
  { iata:'AMD', name:'Sardar Vallabhbhai Patel', city:'Ahmedabad',     country:'India'        },
  { iata:'PNQ', name:'Pune Airport',             city:'Pune',          country:'India'        },
  { iata:'GOI', name:'Goa Airport (Dabolim)',    city:'Goa',           country:'India'        },
  { iata:'GOX', name:'Mopa Intl (New Goa)',      city:'Goa',           country:'India'        },
  { iata:'JAI', name:'Jaipur Airport',           city:'Jaipur',        country:'India'        },
  { iata:'LKO', name:'Chaudhary Charan Singh',   city:'Lucknow',       country:'India'        },
  { iata:'IXC', name:'Chandigarh Airport',       city:'Chandigarh',    country:'India'        },
  { iata:'PAT', name:'Jay Prakash Narayan Intl', city:'Patna',         country:'India'        },
  { iata:'BBI', name:'Biju Patnaik Intl',        city:'Bhubaneswar',   country:'India'        },
  { iata:'TRV', name:'Trivandrum Intl',          city:'Thiruvananthapuram', country:'India'   },
  { iata:'CJB', name:'Coimbatore Intl',          city:'Coimbatore',    country:'India'        },
  { iata:'IXM', name:'Madurai Airport',          city:'Madurai',       country:'India'        },
  { iata:'VTZ', name:'Vishakhapatnam Airport',   city:'Vizag',         country:'India'        },
  { iata:'STV', name:'Surat Airport',            city:'Surat',         country:'India'        },
  { iata:'NAG', name:'Dr Ambedkar Intl',         city:'Nagpur',        country:'India'        },
  { iata:'VNS', name:'Lal Bahadur Shastri Intl', city:'Varanasi',      country:'India'        },
  { iata:'GAU', name:'Lokpriya Gopinath Bordoloi', city:'Guwahati',    country:'India'        },
  { iata:'IXB', name:'Bagdogra Airport',         city:'Siliguri',      country:'India'        },
  { iata:'IMF', name:'Imphal Airport',           city:'Imphal',        country:'India'        },
  { iata:'ATQ', name:'Sri Guru Ram Dass Jee Intl', city:'Amritsar',    country:'India'        },
  { iata:'IDR', name:'Devi Ahilyabai Holkar',    city:'Indore',        country:'India'        },
  { iata:'BHO', name:'Raja Bhoj Airport',        city:'Bhopal',        country:'India'        },
  { iata:'IXL', name:'Kushok Bakula Rimpochee',  city:'Leh',           country:'India'        },
  { iata:'SXR', name:'Sheikh ul Alam Airport',   city:'Srinagar',      country:'India'        },
  { iata:'DHM', name:'Gaggal Airport',           city:'Dharamshala',   country:'India'        },
  { iata:'KNU', name:'Kanpur Airport',           city:'Kanpur',        country:'India'        },
  { iata:'IXJ', name:'Jammu Airport',            city:'Jammu',         country:'India'        },
  { iata:'IXR', name:'Birsa Munda Airport',      city:'Ranchi',        country:'India'        },
  { iata:'RPR', name:'Swami Vivekananda Intl',   city:'Raipur',        country:'India'        },

  // HUB CONNECTIONS (Middle East / Asia via hubs)
  { iata:'DXB', name:'Dubai Intl',               city:'Dubai',         country:'UAE'          },
  { iata:'AUH', name:'Abu Dhabi Intl',           city:'Abu Dhabi',     country:'UAE'          },
  { iata:'DOH', name:'Hamad Intl',               city:'Doha',          country:'Qatar'        },
  { iata:'KWI', name:'Kuwait Intl',              city:'Kuwait City',   country:'Kuwait'       },
  { iata:'BAH', name:'Bahrain Intl',             city:'Bahrain',       country:'Bahrain'      },
  { iata:'RUH', name:'King Khalid Intl',         city:'Riyadh',        country:'Saudi Arabia' },
  { iata:'JED', name:'King Abdulaziz Intl',      city:'Jeddah',        country:'Saudi Arabia' },
  { iata:'MCT', name:'Muscat Intl',              city:'Muscat',        country:'Oman'         },
  { iata:'KUL', name:'Kuala Lumpur Intl',        city:'Kuala Lumpur',  country:'Malaysia'     },
  { iata:'SIN', name:'Changi Airport',           city:'Singapore',     country:'Singapore'    },
  { iata:'BKK', name:'Suvarnabhumi',             city:'Bangkok',       country:'Thailand'     },
  { iata:'CMB', name:'Bandaranaike Intl',        city:'Colombo',       country:'Sri Lanka'    },
  { iata:'KTM', name:'Tribhuvan Intl',           city:'Kathmandu',     country:'Nepal'        },
  { iata:'DAC', name:'Hazrat Shahjalal Intl',    city:'Dhaka',         country:'Bangladesh'   },
  { iata:'KHI', name:'Jinnah Intl',             city:'Karachi',       country:'Pakistan'     },
  { iata:'LHE', name:'Allama Iqbal Intl',        city:'Lahore',        country:'Pakistan'     },
  { iata:'ISB', name:'New Islamabad Intl',       city:'Islamabad',     country:'Pakistan'     },
];

// ---- POPULAR ROUTES for homepage ----
const POPULAR_ROUTES = [
  { from:'BER', to:'DEL', label:'Berlin → Delhi',       fromPrice:320 },
  { from:'FRA', to:'BOM', label:'Frankfurt → Mumbai',   fromPrice:380 },
  { from:'LHR', to:'DEL', label:'London → Delhi',       fromPrice:290 },
  { from:'AMS', to:'BLR', label:'Amsterdam → Bangalore',fromPrice:410 },
  { from:'CDG', to:'BOM', label:'Paris → Mumbai',       fromPrice:350 },
  { from:'BCN', to:'DEL', label:'Barcelona → Delhi',    fromPrice:395 },
  { from:'FCO', to:'MAA', label:'Rome → Chennai',       fromPrice:430 },
  { from:'MUC', to:'HYD', label:'Munich → Hyderabad',   fromPrice:360 },
  { from:'BER', to:'BCN', label:'Berlin → Barcelona',   fromPrice: 29 },
  { from:'LHR', to:'AMS', label:'London → Amsterdam',   fromPrice: 45 },
  { from:'CDG', to:'FCO', label:'Paris → Rome',         fromPrice: 35 },
  { from:'FRA', to:'ATH', label:'Frankfurt → Athens',   fromPrice: 55 },
];

// ---- SEARCH SITES configuration ----
const SEARCH_SITES = [
  {
    id:      'google_flights',
    name:    'Google Flights',
    icon:    '🔍',
    color:   '#4285f4',
    buildUrl: (p) => {
      const dep  = formatDateYMD(p.departDate);
      const ret  = p.returnDate ? formatDateYMD(p.returnDate) : '';
      const trip = p.tripType === 'roundtrip' ? '1' : '2';
      const cls  = cabinMap_google(p.cabinClass);
      const pax  = `${p.adults}`;
      // Google Flights deep link
      let url = `https://www.google.com/travel/flights?hl=en&curr=EUR`;
      url += `&tfs=CBwQAhoeEgoyMDI0LTAxLTAxagcIARIDQkVScgcIARIDREVMGgASBAAQAQ`;
      // Simplified direct search URL
      url = `https://www.google.com/travel/flights/search?tfs=`;
      url = buildGoogleFlightsUrl(p);
      return url;
    }
  },
  {
    id:      'kayak',
    name:    'Kayak',
    icon:    '🛶',
    color:   '#f60',
    buildUrl: (p) => buildKayakUrl(p)
  },
  {
    id:      'skyscanner',
    name:    'Skyscanner',
    icon:    '🌐',
    color:   '#00a9e0',
    buildUrl: (p) => buildSkyscannerUrl(p)
  },
  {
    id:      'momondo',
    name:    'Momondo',
    icon:    '🌸',
    color:   '#e91e8c',
    buildUrl: (p) => buildMomondoUrl(p)
  },
  {
    id:      'expedia',
    name:    'Expedia',
    icon:    '✈️',
    color:   '#00355f',
    buildUrl: (p) => buildExpediaUrl(p)
  },
  {
    id:      'kiwi',
    name:    'Kiwi.com',
    icon:    '🥝',
    color:   '#00b2a1',
    buildUrl: (p) => buildKiwiUrl(p)
  },
  {
    id:      'ryanair',
    name:    'Ryanair',
    icon:    '🟡',
    color:   '#073590',
    buildUrl: (p) => buildRyanairUrl(p),
    europeOnly: true
  },
  {
    id:      'easyjet',
    name:    'easyJet',
    icon:    '🟠',
    color:   '#ff6600',
    buildUrl: (p) => buildEasyjetUrl(p),
    europeOnly: true
  },
  {
    id:      'lufthansa',
    name:    'Lufthansa',
    icon:    '✈',
    color:   '#05164d',
    buildUrl: (p) => buildLufthansaUrl(p)
  },
  {
    id:      'airindiaexpress',
    name:    'Air India',
    icon:    '🇮🇳',
    color:   '#e30613',
    buildUrl: (p) => buildAirIndiaUrl(p),
    indiaOnly: true
  },
  {
    id:      'emirates',
    name:    'Emirates',
    icon:    '🇦🇪',
    color:   '#b8170d',
    buildUrl: (p) => buildEmiratesUrl(p)
  },
  {
    id:      'flightradar_alert',
    name:    'Azul / Others',
    icon:    '🔔',
    color:   '#9c27b0',
    buildUrl: (p) => buildGenericUrl(p)
  },
];

// =============================================
// DATE HELPERS
// =============================================

function formatDateYMD(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
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
// CABIN CLASS MAPPERS
// =============================================

function cabinMap_google(cls) {
  const map = { economy:'1', premium_economy:'2', business:'3', first:'4' };
  return map[cls] || '1';
}

function cabinMap_skyscanner(cls) {
  const map = { economy:'economy', premium_economy:'premiumeconomy', business:'business', first:'first' };
  return map[cls] || 'economy';
}

function cabinMap_kayak(cls) {
  const map = { economy:'e', premium_economy:'pe', business:'b', first:'f' };
  return map[cls] || 'e';
}

function cabinMap_kiwi(cls) {
  const map = { economy:'M', premium_economy:'W', business:'C', first:'F' };
  return map[cls] || 'M';
}

// =============================================
// URL BUILDERS — each booking site
// =============================================

function buildGoogleFlightsUrl(p) {
  const dep    = formatDateYMD(p.departDate);
  const ret    = p.returnDate ? formatDateYMD(p.returnDate) : '';
  const adults = p.adults || 1;
  const kids   = p.children || 0;
  const cls    = cabinMap_google(p.cabinClass);

  let url = `https://www.google.com/travel/flights?hl=en&curr=EUR`;
  url    += `&q=Flights+from+${p.origin}+to+${p.destination}`;
  url    += `+on+${dep}`;
  if (p.tripType === 'roundtrip' && ret) url += `+returning+${ret}`;

  // Google's newer tfs parameter approach
  const base = `https://www.google.com/travel/flights/search`;
  const params = new URLSearchParams({
    hl:   'en',
    curr: 'EUR',
  });

  // Build the itinerary string
  // Format: /flights/search?tfs=...
  // Simpler fallback using query params
  let finalUrl = `https://www.google.com/travel/flights?hl=en&curr=EUR`;
  finalUrl    += `#flt=${p.origin}.${p.destination}.${dep}`;
  if (p.tripType === 'roundtrip' && ret) finalUrl += `*${p.destination}.${p.origin}.${ret}`;
  finalUrl    += `;c:EUR;e:1;sd:1;t:f`;
  return finalUrl;
}

function buildSkyscannerUrl(p) {
  const dep    = formatDateYMD(p.departDate).replace(/-/g,'');  // YYYYMMDD
  const ret    = p.returnDate ? formatDateYMD(p.returnDate).replace(/-/g,'') : '';
  const adults = p.adults || 1;
  const kids   = p.children || 0;
  const cls    = cabinMap_skyscanner(p.cabinClass);
  const cabin  = cls;

  let path = '';
  if (p.tripType === 'roundtrip' && ret) {
    path = `https://www.skyscanner.net/transport/flights/${p.origin.toLowerCase()}/${p.destination.toLowerCase()}/${dep}/${ret}/`;
  } else {
    path = `https://www.skyscanner.net/transport/flights/${p.origin.toLowerCase()}/${p.destination.toLowerCase()}/${dep}/`;
  }

  const params = new URLSearchParams({
    adults:       adults,
    children:     kids,
    adultsv2:     adults,
    childrenv2:   kids > 0 ? Array(kids).fill(10).join(',') : '',
    infants:      0,
    cabinclass:   cabin,
    currency:     'EUR',
    locale:       'en-GB',
    market:       'DE',
    preferDirects: p.directOnly ? 'true' : 'false',
  });

  return `${path}?${params.toString()}`;
}

function buildKayakUrl(p) {
  const dep    = formatDateYMD(p.departDate);
  const ret    = p.returnDate ? formatDateYMD(p.returnDate) : '';
  const adults = p.adults || 1;
  const kids   = p.children || 0;
  const cls    = cabinMap_kayak(p.cabinClass);

  let paxStr = `${adults}adults`;
  if (kids > 0) paxStr += `-${kids}children`;

  let url = '';
  if (p.tripType === 'roundtrip' && ret) {
    url = `https://www.kayak.com/flights/${p.origin}-${p.destination}/${dep}/${ret}/${paxStr}/${cls}?currency=EUR`;
  } else {
    url = `https://www.kayak.com/flights/${p.origin}-${p.destination}/${dep}/${paxStr}/${cls}?currency=EUR`;
  }
  if (p.directOnly) url += '&fs=stops=0';
  return url;
}

function buildMomondoUrl(p) {
  const dep    = formatDateYMD(p.departDate);
  const ret    = p.returnDate ? formatDateYMD(p.returnDate) : '';
  const adults = p.adults || 1;
  const kids   = p.children || 0;
  const cls    = cabinMap_kayak(p.cabinClass);

  let paxStr = `${adults}adults`;
  if (kids > 0) paxStr += `-${kids}children`;

  let url = '';
  if (p.tripType === 'roundtrip' && ret) {
    url = `https://www.momondo.com/flight-search/${p.origin}-${p.destination}/${dep}/${ret}/${paxStr}/${cls}?currency=EUR`;
  } else {
    url = `https://www.momondo.com/flight-search/${p.origin}-${p.destination}/${dep}/${paxStr}/${cls}?currency=EUR`;
  }
  return url;
}

function buildExpediaUrl(p) {
  const dep    = formatDateYMD(p.departDate);
  const ret    = p.returnDate ? formatDateYMD(p.returnDate) : '';
  const adults = p.adults || 1;
  const kids   = p.children || 0;

  const params = new URLSearchParams({
    trip:       p.tripType === 'roundtrip' ? 'roundtrip' : 'oneway',
    leg1:       `from:${p.origin},to:${p.destination},departure:${dep}TANYT`,
    passengers: `adults:${adults},children:${kids},seniors:0`,
    mode:       'search',
    currency:   'EUR',
  });

  if (p.tripType === 'roundtrip' && ret) {
    params.set('leg2', `from:${p.destination},to:${p.origin},departure:${ret}TANYT`);
  }

  return `https://www.expedia.com/Flights-Search?${params.toString()}`;
}

function buildKiwiUrl(p) {
  const dep    = formatDateYMD(p.departDate);
  const ret    = p.returnDate ? formatDateYMD(p.returnDate) : '';
  const adults = p.adults || 1;
  const kids   = p.children || 0;
  const cls    = cabinMap_kiwi(p.cabinClass);

  const params = new URLSearchParams({
    from:           p.origin,
    to:             p.destination,
    depart:         dep,
    adults:         adults,
    children:       kids,
    infants:        0,
    currency:       'EUR',
    cabinClass:     cls,
    flightsType:    p.tripType === 'roundtrip' ? 'return' : 'oneway',
  });

  if (p.tripType === 'roundtrip' && ret) params.set('return', ret);
  if (p.directOnly) params.set('stopNumber', '0');
  if (p.checkedBaggage) params.set('bags', '1');

  return `https://www.kiwi.com/en/search/${params.toString()}`;
}

function buildRyanairUrl(p) {
  const [depY, depM, depD] = formatDateYMD(p.departDate).split('-');
  const adults  = p.adults || 1;
  const teens   = 0;
  const kids    = p.children || 0;

  let url = `https://www.ryanair.com/en/en/trip/flights/select`;
  const params = new URLSearchParams({
    adults:          adults,
    teens:           teens,
    children:        kids,
    infants:         0,
    dateOut:         `${depY}-${depM}-${depD}`,
    isConnectedFlight: false,
    discount:        0,
    promoCode:       '',
    isReturn:        p.tripType === 'roundtrip' ? 'true' : 'false',
    originIata:      p.origin,
    destinationIata: p.destination,
    tpAdults:        adults,
    tpTeens:         teens,
    tpChildren:      kids,
    tpInfants:       0,
    tpStartDate:     `${depY}-${depM}-${depD}`,
    currency:        'EUR',
  });

  if (p.tripType === 'roundtrip' && p.returnDate) {
    const [retY, retM, retD] = formatDateYMD(p.returnDate).split('-');
    params.set('dateIn', `${retY}-${retM}-${retD}`);
    params.set('tpEndDate', `${retY}-${retM}-${retD}`);
  }

  return `${url}?${params.toString()}`;
}

function buildEasyjetUrl(p) {
  const dep    = formatDateYMD(p.departDate);
  const ret    = p.returnDate ? formatDateYMD(p.returnDate) : '';
  const adults = p.adults || 1;
  const kids   = p.children || 0;

  const params = new URLSearchParams({
    'origin-iata':      p.origin,
    'destination-iata': p.destination,
    'outbound-date':    dep,
    'adult-count':      adults,
    'child-count':      kids,
    'infant-count':     0,
    'flight-type':      p.tripType === 'roundtrip' ? 'return' : 'oneway',
  });

  if (p.tripType === 'roundtrip' && ret) params.set('inbound-date', ret);

  return `https://www.easyjet.com/en/cheap-flights/${p.origin}-${p.destination}?${params.toString()}`;
}

function buildLufthansaUrl(p) {
  const dep    = formatDateYMD(p.departDate);
  const ret    = p.returnDate ? formatDateYMD(p.returnDate) : '';
  const adults = p.adults || 1;
  const kids   = p.children || 0;
  const cls    = { economy:'Y', premium_economy:'M', business:'C', first:'F' }[p.cabinClass] || 'Y';

  const params = new URLSearchParams({
    origin:       p.origin,
    destination:  p.destination,
    outwardDate:  dep,
    adults:       adults,
    children:     kids,
    infants:      0,
    cabinClass:   cls,
    tripType:     p.tripType === 'roundtrip' ? 'ROUND_TRIP' : 'ONE_WAY',
    currency:     'EUR',
  });

  if (p.tripType === 'roundtrip' && ret) params.set('returnDate', ret);

  return `https://www.lufthansa.com/de/en/homepage?${params.toString()}#//stateful/booking-servlet/de/en/flightSearch`;
}

function buildAirIndiaUrl(p) {
  const dep    = formatDateYMD(p.departDate);
  const ret    = p.returnDate ? formatDateYMD(p.returnDate) : '';
  const adults = p.adults || 1;
  const kids   = p.children || 0;
  const cls    = { economy:'E', premium_economy:'PE', business:'B', first:'F' }[p.cabinClass] || 'E';

  const params = new URLSearchParams({
    tripType:    p.tripType === 'roundtrip' ? 'R' : 'O',
    from:        p.origin,
    to:          p.destination,
    departure:   dep,
    adult:       adults,
    child:       kids,
    infant:      0,
    class:       cls,
    currency:    'EUR',
  });

  if (p.tripType === 'roundtrip' && ret) params.set('return', ret);
  return `https://www.airindia.com/book-flights.htm?${params.toString()}`;
}

function buildEmiratesUrl(p) {
  const dep    = formatDateYMD(p.departDate);
  const ret    = p.returnDate ? formatDateYMD(p.returnDate) : '';
  const adults = p.adults || 1;
  const kids   = p.children || 0;
  const cls    = { economy:'Y', premium_economy:'B', business:'J', first:'F' }[p.cabinClass] || 'Y';

  const params = new URLSearchParams({
    type:      p.tripType === 'roundtrip' ? 'ROUND_TRIP' : 'ONE_WAY',
    from:      p.origin,
    to:        p.destination,
    depart:    dep,
    adult:     adults,
    child:     kids,
    infant:    0,
    cabin:     cls,
    currency:  'EUR',
  });

  if (p.tripType === 'roundtrip' && ret) params.set('return', ret);
  return `https://www.emirates.com/english/book-and-manage/book-flights/?${params.toString()}`;
}

function buildGenericUrl(p) {
  return buildSkyscannerUrl(p);
}

// =============================================
// AIRPORT SEARCH
// =============================================

function searchAirports(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return AIRPORTS.filter(a =>
    a.iata.toLowerCase().includes(q) ||
    a.city.toLowerCase().includes(q) ||
    a.name.toLowerCase().includes(q) ||
    a.country.toLowerCase().includes(q)
  ).slice(0, 8);
}

function getAirportByIATA(iata) {
  return AIRPORTS.find(a => a.iata.toUpperCase() === iata.toUpperCase()) || null;
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
// PRIVACY / COOKIE HELPERS
// =============================================

function openPrivateBookingTab(url) {
  // We can't force incognito from JS (browser policy)
  // Best we can do: clear our own cookies, open new tab, guide user
  clearAppCookies();

  // Open in a new blank window with minimal features
  const win = window.open(url, '_blank', 'noopener,noreferrer');
  if (!win) {
    // Popup blocked — return url for manual copy
    return { success: false, url };
  }
  return { success: true };
}

function clearAppCookies() {
  // Clear all cookies for this domain
  document.cookie.split(';').forEach(c => {
    const eqPos = c.indexOf('=');
    const name  = eqPos > -1 ? c.slice(0, eqPos).trim() : c.trim();
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  });
  // Clear sessionStorage and caches (not localStorage — we need alerts)
  try { sessionStorage.clear(); } catch(e) {}
}

// Check if route is Europe-only
function isEuropeRoute(origin, destination) {
  const europeCodes = AIRPORTS
    .filter(a => [
      'Germany','UK','France','Netherlands','Spain','Italy','Austria',
      'Switzerland','Belgium','Denmark','Sweden','Norway','Finland',
      'Portugal','Greece','Poland','Czech Rep.','Hungary','Romania',
      'Bulgaria','Croatia','Ireland','Iceland','Estonia','Latvia',
      'Lithuania','N.Macedonia','Montenegro','Serbia','Slovenia',
      'Slovakia','Malta','Albania','Turkey'
    ].includes(a.country))
    .map(a => a.iata);
  return europeCodes.includes(origin) || europeCodes.includes(destination);
}

function isIndiaRoute(origin, destination) {
  const indiaCodes = AIRPORTS
    .filter(a => a.country === 'India')
    .map(a => a.iata);
  return indiaCodes.includes(origin) || indiaCodes.includes(destination);
}

// =============================================
// LOCAL STORAGE HELPERS
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
  ta.style.position = 'fixed';
  ta.style.opacity  = '0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  return Promise.resolve();
}
