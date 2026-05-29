// v3.0 - forced .de domains - 2025

const AIRPORTS = [
  { iata:'BER', name:'Berlin Brandenburg',           city:'Berlin',        country:'Germany'     },
  { iata:'FRA', name:'Frankfurt Airport',            city:'Frankfurt',     country:'Germany'     },
  { iata:'MUC', name:'Munich Airport',               city:'Munich',        country:'Germany'     },
  { iata:'HAM', name:'Hamburg Airport',              city:'Hamburg',       country:'Germany'     },
  { iata:'DUS', name:'Dusseldorf Airport',           city:'Dusseldorf',    country:'Germany'     },
  { iata:'CGN', name:'Cologne Bonn Airport',         city:'Cologne',       country:'Germany'     },
  { iata:'STR', name:'Stuttgart Airport',            city:'Stuttgart',     country:'Germany'     },
  { iata:'LHR', name:'Heathrow',                     city:'London',        country:'UK'          },
  { iata:'LGW', name:'Gatwick',                      city:'London',        country:'UK'          },
  { iata:'STN', name:'Stansted',                     city:'London',        country:'UK'          },
  { iata:'MAN', name:'Manchester Airport',           city:'Manchester',    country:'UK'          },
  { iata:'EDI', name:'Edinburgh Airport',            city:'Edinburgh',     country:'UK'          },
  { iata:'CDG', name:'Charles de Gaulle',            city:'Paris',         country:'France'      },
  { iata:'ORY', name:'Orly',                         city:'Paris',         country:'France'      },
  { iata:'NCE', name:'Nice Airport',                 city:'Nice',          country:'France'      },
  { iata:'LYS', name:'Lyon Airport',                 city:'Lyon',          country:'France'      },
  { iata:'AMS', name:'Schiphol',                     city:'Amsterdam',     country:'Netherlands' },
  { iata:'EIN', name:'Eindhoven Airport',            city:'Eindhoven',     country:'Netherlands' },
  { iata:'BCN', name:'El Prat',                      city:'Barcelona',     country:'Spain'       },
  { iata:'MAD', name:'Barajas',                      city:'Madrid',        country:'Spain'       },
  { iata:'AGP', name:'Malaga Airport',               city:'Malaga',        country:'Spain'       },
  { iata:'PMI', name:'Palma de Mallorca',            city:'Palma',         country:'Spain'       },
  { iata:'VLC', name:'Valencia Airport',             city:'Valencia',      country:'Spain'       },
  { iata:'SVQ', name:'Seville Airport',              city:'Seville',       country:'Spain'       },
  { iata:'FCO', name:'Fiumicino',                    city:'Rome',          country:'Italy'       },
  { iata:'MXP', name:'Malpensa',                     city:'Milan',         country:'Italy'       },
  { iata:'BGY', name:'Bergamo Orio al Serio',        city:'Bergamo',       country:'Italy'       },
  { iata:'NAP', name:'Naples Airport',               city:'Naples',        country:'Italy'       },
  { iata:'VCE', name:'Venice Marco Polo',            city:'Venice',        country:'Italy'       },
  { iata:'VIE', name:'Vienna Airport',               city:'Vienna',        country:'Austria'     },
  { iata:'GRZ', name:'Graz Airport',                 city:'Graz',          country:'Austria'     },
  { iata:'SZG', name:'Salzburg Airport',             city:'Salzburg',      country:'Austria'     },
  { iata:'ZRH', name:'Zurich Airport',               city:'Zurich',        country:'Switzerland' },
  { iata:'GVA', name:'Geneva Airport',               city:'Geneva',        country:'Switzerland' },
  { iata:'BSL', name:'EuroAirport Basel',            city:'Basel',         country:'Switzerland' },
  { iata:'BRU', name:'Brussels Airport',             city:'Brussels',      country:'Belgium'     },
  { iata:'CRL', name:'Brussels South Charleroi',     city:'Charleroi',     country:'Belgium'     },
  { iata:'CPH', name:'Copenhagen Airport',           city:'Copenhagen',    country:'Denmark'     },
  { iata:'ARN', name:'Stockholm Arlanda',            city:'Stockholm',     country:'Sweden'      },
  { iata:'NYO', name:'Stockholm Skavsta',            city:'Stockholm',     country:'Sweden'      },
  { iata:'OSL', name:'Oslo Gardermoen',              city:'Oslo',          country:'Norway'      },
  { iata:'HEL', name:'Helsinki Airport',             city:'Helsinki',      country:'Finland'     },
  { iata:'LIS', name:'Lisbon Airport',               city:'Lisbon',        country:'Portugal'    },
  { iata:'OPO', name:'Porto Airport',                city:'Porto',         country:'Portugal'    },
  { iata:'FAO', name:'Faro Airport',                 city:'Faro',          country:'Portugal'    },
  { iata:'ATH', name:'Athens Eleftherios Venizelos', city:'Athens',        country:'Greece'      },
  { iata:'HER', name:'Heraklion Airport',            city:'Heraklion',     country:'Greece'      },
  { iata:'RHO', name:'Rhodes Airport',               city:'Rhodes',        country:'Greece'      },
  { iata:'SKG', name:'Thessaloniki Airport',         city:'Thessaloniki',  country:'Greece'      },
  { iata:'WAW', name:'Warsaw Chopin',                city:'Warsaw',        country:'Poland'      },
  { iata:'KRK', name:'Krakow Airport',               city:'Krakow',        country:'Poland'      },
  { iata:'PRG', name:'Prague Airport',               city:'Prague',        country:'Czech Rep.'  },
  { iata:'BUD', name:'Budapest Airport',             city:'Budapest',      country:'Hungary'     },
  { iata:'OTP', name:'Bucharest Otopeni',            city:'Bucharest',     country:'Romania'     },
  { iata:'SOF', name:'Sofia Airport',                city:'Sofia',         country:'Bulgaria'    },
  { iata:'DBV', name:'Dubrovnik Airport',            city:'Dubrovnik',     country:'Croatia'     },
  { iata:'SPU', name:'Split Airport',                city:'Split',         country:'Croatia'     },
  { iata:'ZAG', name:'Zagreb Airport',               city:'Zagreb',        country:'Croatia'     },
  { iata:'DUB', name:'Dublin Airport',               city:'Dublin',        country:'Ireland'     },
  { iata:'KEF', name:'Reykjavik Keflavik',           city:'Reykjavik',     country:'Iceland'     },
  { iata:'TLL', name:'Tallinn Airport',              city:'Tallinn',       country:'Estonia'     },
  { iata:'RIX', name:'Riga Airport',                 city:'Riga',          country:'Latvia'      },
  { iata:'VNO', name:'Vilnius Airport',              city:'Vilnius',       country:'Lithuania'   },
  { iata:'BEG', name:'Belgrade Nikola Tesla',        city:'Belgrade',      country:'Serbia'      },
  { iata:'LJU', name:'Ljubljana Airport',            city:'Ljubljana',     country:'Slovenia'    },
  { iata:'BTS', name:'Bratislava Airport',           city:'Bratislava',    country:'Slovakia'    },
  { iata:'MLA', name:'Malta International',          city:'Valletta',      country:'Malta'       },
  { iata:'IST', name:'Istanbul Airport',             city:'Istanbul',      country:'Turkey'      },
  { iata:'SAW', name:'Istanbul Sabiha Gokcen',       city:'Istanbul',      country:'Turkey'      },
  { iata:'AYT', name:'Antalya Airport',              city:'Antalya',       country:'Turkey'      },
  { iata:'ESB', name:'Ankara Esenboga',              city:'Ankara',        country:'Turkey'      },
  { iata:'ADB', name:'Izmir Adnan Menderes',         city:'Izmir',         country:'Turkey'      },
  { iata:'DEL', name:'Indira Gandhi Intl',           city:'New Delhi',     country:'India'       },
  { iata:'BOM', name:'Chhatrapati Shivaji Intl',     city:'Mumbai',        country:'India'       },
  { iata:'BLR', name:'Kempegowda Intl',              city:'Bangalore',     country:'India'       },
  { iata:'MAA', name:'Chennai Intl',                 city:'Chennai',       country:'India'       },
  { iata:'HYD', name:'Rajiv Gandhi Intl',            city:'Hyderabad',     country:'India'       },
  { iata:'CCU', name:'Netaji Subhas Chandra Bose',   city:'Kolkata',       country:'India'       },
  { iata:'COK', name:'Cochin Intl',                  city:'Kochi',         country:'India'       },
  { iata:'AMD', name:'Sardar Vallabhbhai Patel',     city:'Ahmedabad',     country:'India'       },
  { iata:'PNQ', name:'Pune Airport',                 city:'Pune',          country:'India'       },
  { iata:'GOI', name:'Goa Airport',                  city:'Goa',           country:'India'       },
  { iata:'JAI', name:'Jaipur Airport',               city:'Jaipur',        country:'India'       },
  { iata:'LKO', name:'Chaudhary Charan Singh',       city:'Lucknow',       country:'India'       },
  { iata:'ATQ', name:'Sri Guru Ram Dass Jee Intl',   city:'Amritsar',      country:'India'       },
  { iata:'TRV', name:'Trivandrum Intl',              city:'Thiruvananthapuram', country:'India'  },
  { iata:'IXC', name:'Chandigarh Airport',           city:'Chandigarh',    country:'India'       },
  { iata:'VNS', name:'Lal Bahadur Shastri Intl',     city:'Varanasi',      country:'India'       },
  { iata:'GAU', name:'Lokpriya Gopinath Bordoloi',   city:'Guwahati',      country:'India'       },
  { iata:'SXR', name:'Sheikh ul Alam Airport',       city:'Srinagar',      country:'India'       },
  { iata:'IXL', name:'Kushok Bakula Rimpochee',      city:'Leh',           country:'India'       },
  { iata:'NAG', name:'Dr Ambedkar Intl',             city:'Nagpur',        country:'India'       },
  { iata:'IDR', name:'Devi Ahilyabai Holkar',        city:'Indore',        country:'India'       },
  { iata:'IXJ', name:'Jammu Airport',                city:'Jammu',         country:'India'       },
  { iata:'RPR', name:'Swami Vivekananda Intl',       city:'Raipur',        country:'India'       },
  { iata:'BHO', name:'Raja Bhoj Airport',            city:'Bhopal',        country:'India'       },
  { iata:'IXR', name:'Birsa Munda Airport',          city:'Ranchi',        country:'India'       },
  { iata:'VTZ', name:'Vishakhapatnam Airport',       city:'Vizag',         country:'India'       },
  { iata:'DXB', name:'Dubai Intl',                   city:'Dubai',         country:'UAE'         },
  { iata:'AUH', name:'Abu Dhabi Intl',               city:'Abu Dhabi',     country:'UAE'         },
  { iata:'DOH', name:'Hamad Intl',                   city:'Doha',          country:'Qatar'       },
  { iata:'RUH', name:'King Khalid Intl',             city:'Riyadh',        country:'Saudi Arabia'},
  { iata:'JED', name:'King Abdulaziz Intl',          city:'Jeddah',        country:'Saudi Arabia'},
  { iata:'MCT', name:'Muscat Intl',                  city:'Muscat',        country:'Oman'        },
  { iata:'KUL', name:'Kuala Lumpur Intl',            city:'Kuala Lumpur',  country:'Malaysia'    },
  { iata:'SIN', name:'Changi Airport',               city:'Singapore',     country:'Singapore'   },
  { iata:'BKK', name:'Suvarnabhumi',                 city:'Bangkok',       country:'Thailand'    },
  { iata:'CMB', name:'Bandaranaike Intl',            city:'Colombo',       country:'Sri Lanka'   },
  { iata:'KTM', name:'Tribhuvan Intl',               city:'Kathmandu',     country:'Nepal'       },
  { iata:'DAC', name:'Hazrat Shahjalal Intl',        city:'Dhaka',         country:'Bangladesh'  },
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
  { from:'VIE', to:'DEL', label:'Vienna → Delhi',        fromPrice: 370 },
  { from:'ZRH', to:'BOM', label:'Zurich → Mumbai',       fromPrice: 430 },
  { from:'BER', to:'BCN', label:'Berlin → Barcelona',    fromPrice:  39 },
  { from:'LHR', to:'AMS', label:'London → Amsterdam',    fromPrice:  49 },
  { from:'CDG', to:'FCO', label:'Paris → Rome',          fromPrice:  35 },
  { from:'FRA', to:'ATH', label:'Frankfurt → Athens',    fromPrice:  59 },
  { from:'MUC', to:'IST', label:'Munich → Istanbul',     fromPrice:  79 },
  { from:'BER', to:'LIS', label:'Berlin → Lisbon',       fromPrice:  55 },
  { from:'AMS', to:'DEL', label:'Amsterdam → Delhi',     fromPrice: 410 },
  { from:'MUC', to:'BOM', label:'Munich → Mumbai',       fromPrice: 410 },
];

// =============================================
// SEARCH SITES — all .de = EUR guaranteed
// =============================================
const SEARCH_SITES = [
  {
    id:    'skyscanner',
    name:  'Skyscanner',
    icon:  '🌐',
    color: '#0770e3',
    note:  '✅ Route + Dates + Passengers + EUR',
    desc:  'Best overall aggregator. Fully pre-filled from your search.',
    buildUrl: buildSkyscannerUrl,
  },
  {
    id:    'kayak',
    name:  'Kayak',
    icon:  '🛶',
    color: '#ff690f',
    note:  '✅ Route + Dates + Passengers + EUR',
    desc:  'Price forecasting. Shows if fares will rise or drop.',
    buildUrl: buildKayakUrl,
  },
  {
    id:    'expedia',
    name:  'Expedia',
    icon:  '✈️',
    color: '#00355f',
    note:  '✅ Route + Dates + Passengers + EUR',
    desc:  'Flights and hotel bundles. Fully pre-filled.',
    buildUrl: buildExpediaUrl,
  },
  {
    id:    'momondo',
    name:  'Momondo',
    icon:  '🌸',
    color: '#6b0fa8',
    note:  '✅ Route + Dates + Passengers + EUR',
    desc:  'Finds hidden deals from smaller booking sites.',
    buildUrl: buildMomondoUrl,
  },
  {
    id:    'google_flights',
    name:  'Google Flights',
    icon:  '🔍',
    color: '#4285f4',
    note:  '✅ Route + EUR  ⚠️ Set dates manually',
    desc:  'Best price calendar. Origin pre-filled. Set dates manually.',
    buildUrl: buildGoogleFlightsUrl,
  },
  {
    id:    'booking',
    name:  'Booking.com',
    icon:  '🏨',
    color: '#003580',
    note:  '✅ Route + Dates + Passengers + EUR',
    desc:  'Trusted worldwide booking site.',
    buildUrl: buildBookingUrl,
  },
  {
    id:    'opodo',
    name:  'Opodo',
    icon:  '🟣',
    color: '#7b2d8b',
    note:  '✅ Route + Dates + Passengers + EUR',
    desc:  'Large European travel agency.',
    buildUrl: buildOpodoUrl,
  },
  {
    id:    'lastminute',
    name:  'lastminute.com',
    icon:  '⏰',
    color: '#e5002b',
    note:  '✅ Route + Dates + Passengers + EUR',
    desc:  'Great for last minute deals.',
    buildUrl: buildLastminuteUrl,
  },
  {
    id:    'edreams',
    name:  'eDreams',
    icon:  '💙',
    color: '#0066cc',
    note:  '✅ Route + Dates + Passengers + EUR',
    desc:  'Large European OTA with exclusive deals.',
    buildUrl: buildEdreamsUrl,
  },
  {
    id:    'bravofly',
    name:  'Bravofly',
    icon:  '🛫',
    color: '#ff6600',
    note:  '✅ Route + Dates + Passengers + EUR',
    desc:  'Searches multiple airlines including India routes.',
    buildUrl: buildBravoflyUrl,
  },
];

// =============================================
// URL BUILDERS — All .de = EUR guaranteed
// =============================================

// SKYSCANNER — skyscanner.de
function buildSkyscannerUrl(p) {
  var dep    = (p.departDate || '').replace(/-/g, '');
  var ret    = (p.returnDate || '').replace(/-/g, '');
  var from   = (p.origin      || '').toLowerCase();
  var to     = (p.destination || '').toLowerCase();
  var adults = parseInt(p.adults)   || 1;
  var kids   = parseInt(p.children) || 0;
  var cabin  = {
    economy:'economy', premium_economy:'premiumeconomy',
    business:'business', first:'first'
  }[p.cabinClass] || 'economy';

  var qs = 'adults='     + adults +
           '&children='  + kids +
           '&adultsv2='  + adults +
           '&childrenv2=&infants=0' +
           '&cabinclass='+ cabin +
           '&currency=EUR' +
           '&locale=de-DE' +
           '&market=DE';

  if (p.directOnly) { qs += '&stops=!2,!1'; }

  var base = 'https://www.skyscanner.de/transport/flights/' +
             from + '/' + to + '/';

  if (p.tripType === 'roundtrip' && ret) {
    return base + dep + '/' + ret + '/?' + qs;
  }
  return base + dep + '/?' + qs;
}

// KAYAK — kayak.de
function buildKayakUrl(p) {
  var dep    = p.departDate || '';
  var ret    = p.returnDate || '';
  var from   = (p.origin      || '').toUpperCase();
  var to     = (p.destination || '').toUpperCase();
  var adults = parseInt(p.adults)   || 1;
  var kids   = parseInt(p.children) || 0;
  var cabin  = {
    economy:'e', premium_economy:'pe',
    business:'b', first:'f'
  }[p.cabinClass] || 'e';

  var pax = adults + 'adults';
  for (var i = 0; i < kids; i++) { pax += '-child10'; }

  var qs = '?currency=EUR&sort=price_a';
  if (p.directOnly) { qs += '&fs=stops=0'; }

  if (p.tripType === 'roundtrip' && ret) {
    return 'https://www.kayak.de/flights/' +
           from + '-' + to + '/' +
           dep + '/' + ret + '/' +
           pax + '/' + cabin + qs;
  }
  return 'https://www.kayak.de/flights/' +
         from + '-' + to + '/' +
         dep + '/' + pax + '/' + cabin + qs;
}

// EXPEDIA — expedia.de
function buildExpediaUrl(p) {
  var dep    = p.departDate || '';
  var ret    = p.returnDate || '';
  var from   = (p.origin      || '').toUpperCase();
  var to     = (p.destination || '').toUpperCase();
  var adults = parseInt(p.adults)   || 1;
  var kids   = parseInt(p.children) || 0;
  var cabin  = {
    economy:'economy', premium_economy:'premiumeconomy',
    business:'business', first:'first'
  }[p.cabinClass] || 'economy';

  var params = 'trip=' +
               (p.tripType === 'roundtrip' ? 'roundtrip' : 'oneway') +
               '&leg1=from:' + from +
               ',to:'        + to +
               ',departure:' + dep + 'TANYT' +
               '&passengers=adults:' + adults +
               ',children:'  + kids +
               ',seniors:0,infantinlap:0' +
               '&options=cabinclass:' + cabin +
               '&mode=search' +
               '&currency=EUR';

  if (p.tripType === 'roundtrip' && ret) {
    params += '&leg2=from:' + to +
              ',to:'        + from +
              ',departure:' + ret + 'TANYT';
  }

  return 'https://www.expedia.de/Flights-Search?' + params;
}

// MOMONDO — momondo.de (confirmed EUR working)
function buildMomondoUrl(p) {
  var dep    = p.departDate || '';
  var ret    = p.returnDate || '';
  var from   = (p.origin      || '').toUpperCase();
  var to     = (p.destination || '').toUpperCase();
  var adults = parseInt(p.adults)   || 1;
  var kids   = parseInt(p.children) || 0;
  var cabin  = {
    economy:'e', premium_economy:'pe',
    business:'b', first:'f'
  }[p.cabinClass] || 'e';

  var qs = '?currency=EUR' +
           '&cabin='       + cabin +
           '&children='    + kids +
           '&lang=de' +
           '&sort=bestflight_a';

  if (p.directOnly) { qs += '&fs=stops=0'; }

  if (p.tripType === 'roundtrip' && ret) {
    return 'https://www.momondo.de/flight-search/' +
           from + '-' + to + '/' +
           dep + '/' + ret + '/' +
           adults + 'adults' + qs;
  }
  return 'https://www.momondo.de/flight-search/' +
         from + '-' + to + '/' +
         dep + '/oneway/' + adults + 'adults' + qs;
}

// GOOGLE FLIGHTS — always EUR via curr=EUR
function buildGoogleFlightsUrl(p) {
  var from = (p.origin      || '').toUpperCase();
  var to   = (p.destination || '').toUpperCase();
  var dep  = p.departDate   || '';

  return 'https://www.google.de/travel/flights?q=flights+from+' +
         from + '+to+' + to + '+on+' + dep +
         '&hl=de&curr=EUR';
}

// BOOKING.COM — booking.de
function buildBookingUrl(p) {
  var dep    = p.departDate || '';
  var ret    = p.returnDate || '';
  var from   = (p.origin      || '').toUpperCase();
  var to     = (p.destination || '').toUpperCase();
  var adults = parseInt(p.adults)   || 1;
  var kids   = parseInt(p.children) || 0;
  var cabin  = {
    economy:'ECONOMY', premium_economy:'PREMIUM_ECONOMY',
    business:'BUSINESS', first:'FIRST'
  }[p.cabinClass] || 'ECONOMY';
  var type = p.tripType === 'roundtrip' ? 'ROUNDTRIP' : 'ONEWAY';

  var params = 'type='        + type +
               '&from='       + from +
               '&to='         + to +
               '&fromDate='   + dep +
               '&adults='     + adults +
               '&children='   + kids +
               '&cabinClass=' + cabin +
               '&currency=EUR' +
               '&lang=de';

  if (p.tripType === 'roundtrip' && ret) {
    params += '&toDate=' + ret;
  }
  if (p.directOnly) { params += '&stops=NONSTOP'; }

  return 'https://flights.booking.com/flights/' +
         from + '-' + to + '/?' + params;
}

// OPODO — opodo.de
function buildOpodoUrl(p) {
  var dep    = p.departDate || '';
  var ret    = p.returnDate || '';
  var from   = (p.origin      || '').toUpperCase();
  var to     = (p.destination || '').toUpperCase();
  var adults = parseInt(p.adults)   || 1;
  var kids   = parseInt(p.children) || 0;
  var cabin  = {
    economy:'Y', premium_economy:'W',
    business:'C', first:'F'
  }[p.cabinClass] || 'Y';

  var params = 'adults='     + adults +
               '&children='  + kids +
               '&infants=0' +
               '&from='      + from +
               '&to='        + to +
               '&cabin='     + cabin +
               '&type='      + (p.tripType === 'roundtrip' ? 'R' : 'OW') +
               '&outbound='  + dep +
               '&currency=EUR';

  if (p.tripType === 'roundtrip' && ret) {
    params += '&inbound=' + ret;
  }

  return 'https://www.opodo.de/flights/?' + params;
}

// LASTMINUTE — lastminute.de
function buildLastminuteUrl(p) {
  var dep    = p.departDate || '';
  var ret    = p.returnDate || '';
  var from   = (p.origin      || '').toUpperCase();
  var to     = (p.destination || '').toUpperCase();
  var adults = parseInt(p.adults)   || 1;
  var kids   = parseInt(p.children) || 0;
  var cabin  = {
    economy:'eco', premium_economy:'pre',
    business:'bus', first:'fir'
  }[p.cabinClass] || 'eco';

  var params = 'adults='     + adults +
               '&children='  + kids +
               '&infants=0' +
               '&from='      + from +
               '&to='        + to +
               '&class='     + cabin +
               '&type='      + (p.tripType === 'roundtrip' ? 'rt' : 'ow') +
               '&departure=' + dep +
               '&currency=EUR';

  if (p.tripType === 'roundtrip' && ret) {
    params += '&return=' + ret;
  }

  return 'https://www.lastminute.de/fluege/?' + params;
}

// EDREAMS — edreams.de
function buildEdreamsUrl(p) {
  var dep    = p.departDate || '';
  var ret    = p.returnDate || '';
  var from   = (p.origin      || '').toUpperCase();
  var to     = (p.destination || '').toUpperCase();
  var adults = parseInt(p.adults)   || 1;
  var kids   = parseInt(p.children) || 0;
  var cabin  = {
    economy:'Y', premium_economy:'W',
    business:'C', first:'F'
  }[p.cabinClass] || 'Y';

  // eDreams uses DD-MM-YYYY
  function toED(d) {
    if (!d) return '';
    var pts = d.split('-');
    return pts[2] + '-' + pts[1] + '-' + pts[0];
  }

  var params = 'adults='     + adults +
               '&children='  + kids +
               '&infants=0' +
               '&from='      + from +
               '&to='        + to +
               '&departure=' + toED(dep) +
               '&cabin='     + cabin +
               '&currency=EUR';

  if (p.tripType === 'roundtrip' && ret) {
    params += '&return=' + toED(ret) + '&type=RT';
  } else {
    params += '&type=OW';
  }

  return 'https://www.edreams.de/flights/?' + params;
}

// BRAVOFLY — bravofly.de
function buildBravoflyUrl(p) {
  var dep    = p.departDate || '';
  var ret    = p.returnDate || '';
  var from   = (p.origin      || '').toUpperCase();
  var to     = (p.destination || '').toUpperCase();
  var adults = parseInt(p.adults)   || 1;
  var kids   = parseInt(p.children) || 0;

  // Bravofly uses DD/MM/YYYY
  function toBF(d) {
    if (!d) return '';
    var pts = d.split('-');
    return pts[2] + '/' + pts[1] + '/' + pts[0];
  }

  var params = 'adults='     + adults +
               '&children='  + kids +
               '&infants=0' +
               '&from='      + from +
               '&to='        + to +
               '&departure=' + toBF(dep) +
               '&currency=EUR';

  if (p.tripType === 'roundtrip' && ret) {
    params += '&return=' + toBF(ret) + '&type=RT';
  } else {
    params += '&type=OW';
  }

  return 'https://www.bravofly.de/fluege/?' + params;
}

// =============================================
// DATE HELPERS
// =============================================

function formatDateYMD(dateStr) {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  return dateStr;
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return '';
  var parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  var d = new Date(
    parseInt(parts[0]),
    parseInt(parts[1]) - 1,
    parseInt(parts[2])
  );
  return d.toLocaleDateString('en-GB', {
    day:'2-digit', month:'short', year:'numeric'
  });
}

function addDays(dateStr, days) {
  if (!dateStr) return '';
  var parts = dateStr.split('-');
  var d = new Date(
    parseInt(parts[0]),
    parseInt(parts[1]) - 1,
    parseInt(parts[2]) + days
  );
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

function formatDuration(minutes) {
  var h = Math.floor(minutes / 60);
  var m = minutes % 60;
  return m > 0 ? h + 'h ' + m + 'm' : h + 'h';
}

function minutesToTime(baseTime, addMinutes) {
  var parts = baseTime.split(':');
  var total = parseInt(parts[0]) * 60 + parseInt(parts[1]) + addMinutes;
  var h     = Math.floor(total / 60) % 24;
  var m     = total % 60;
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
}

// =============================================
// AIRPORT HELPERS
// =============================================

function searchAirports(query) {
  if (!query || query.length < 2) return [];
  var q = query.toLowerCase().trim();
  return AIRPORTS.filter(function(a) {
    return a.iata.toLowerCase().startsWith(q) ||
           a.city.toLowerCase().startsWith(q) ||
           a.city.toLowerCase().includes(q)   ||
           a.name.toLowerCase().includes(q)   ||
           a.country.toLowerCase().startsWith(q);
  }).slice(0, 8);
}

function getAirportByIATA(iata) {
  if (!iata) return null;
  return AIRPORTS.find(function(a) {
    return a.iata.toUpperCase() === iata.toUpperCase();
  }) || null;
}

// =============================================
// FORMATTING
// =============================================

function formatEUR(amount) {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(amount);
}

// =============================================
// PRIVACY
// =============================================

function openPrivateBookingTab(url) {
  clearAppCookies();
  var win = window.open(url, '_blank', 'noopener,noreferrer');
  return win ? { success: true } : { success: false, url: url };
}

function clearAppCookies() {
  document.cookie.split(';').forEach(function(c) {
    var name = c.split('=')[0].trim();
    document.cookie = name +
      '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
  });
  try { sessionStorage.clear(); } catch(e) {}
}

// =============================================
// STORAGE
// =============================================

var Storage = {
  get: function(key, fallback) {
    if (fallback === undefined) fallback = null;
    try {
      var v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch(e) { return fallback; }
  },
  set: function(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch(e) {}
  },
  remove: function(key) {
    try { localStorage.removeItem(key); } catch(e) {}
  }
};

// =============================================
// MISC
// =============================================

function debounce(fn, ms) {
  var timer;
  return function() {
    var args = arguments;
    var ctx  = this;
    clearTimeout(timer);
    timer = setTimeout(function() {
      fn.apply(ctx, args);
    }, ms);
  };
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  return Promise.resolve();
}
