// =============================================
// SCRAPERS.JS - Clean rewrite
// =============================================

var RESULT_SITES = [
  { id:'skyscanner',    name:'Skyscanner',     icon:'🌐', color:'#00a9e0', note:'Compare all airlines — best overall'          },
  { id:'kayak',         name:'Kayak',          icon:'🛶', color:'#ff6600', note:'Compares 100s of travel sites at once'        },
  { id:'kiwi',          name:'Kiwi.com',       icon:'🥝', color:'#00b2a1', note:'Cheapest combinations and flexible dates'     },
  { id:'expedia',       name:'Expedia',        icon:'✈️', color:'#00355f', note:'Flights and hotel bundles'                    },
  { id:'momondo',       name:'Momondo',        icon:'🌸', color:'#e91e8c', note:'Finds hidden deals from smaller sites'        },
  { id:'google_flights',name:'Google Flights', icon:'🔍', color:'#4285f4', note:'Great overview — set dates after opening'     },
];

async function searchFlights(params, onProgress) {
  var total = RESULT_SITES.length;
  var done  = 0;

  var promises = RESULT_SITES.map(function(site, idx) {
    return new Promise(function(resolve) {
      setTimeout(function() {
        if (onProgress) {
          onProgress({ type:'status', siteId:site.id, status:'searching', name:site.name });
        }
        setTimeout(function() {
          done++;
          if (onProgress) {
            onProgress({ type:'status', siteId:site.id, status:'done', name:site.name });
            onProgress({ type:'progress', percent: Math.round((done / total) * 100) });
          }
          resolve();
        }, 300 + Math.random() * 400);
      }, idx * 200);
    });
  });

  await Promise.all(promises);

  // Build one result card per site
  var results = RESULT_SITES.map(function(site) {
    // Find matching builder in SEARCH_SITES
    var siteConfig = SEARCH_SITES.find(function(s) { return s.id === site.id; });
    var url = '#';
    if (siteConfig && siteConfig.buildUrl) {
      try {
        url = siteConfig.buildUrl(params);
      } catch(e) {
        console.warn('URL build error for', site.id, e);
        url = '#';
      }
    }
    return {
      id:          site.id + '_' + generateId(),
      source:      site.name,
      sourceId:    site.id,
      sourceColor: site.color,
      sourceIcon:  site.icon,
      sourceNote:  site.note,
      bookingUrl:  url,
      params:      JSON.parse(JSON.stringify(params)),
    };
  });

  return results;
}

async function fetchCalendarPrices(params) {
  return {};
}
