async function searchFlights(params, onProgress) {
  var sites = SEARCH_SITES;
  var total = sites.length;
  var done  = 0;

  // Simulate searching each site with progress updates
  var promises = sites.map(function(site, idx) {
    return new Promise(function(resolve) {
      setTimeout(function() {

        // Show "searching" status
        if (onProgress) {
          onProgress({
            type:   'status',
            siteId: site.id,
            status: 'searching',
            name:   site.name
          });
        }

        setTimeout(function() {
          done++;

          // Show "done" status
          if (onProgress) {
            onProgress({
              type:   'status',
              siteId: site.id,
              status: 'done',
              name:   site.name
            });
            onProgress({
              type:    'progress',
              percent: Math.round((done / total) * 100)
            });
          }

          resolve();
        }, 150 + Math.random() * 300);

      }, idx * 130);
    });
  });

  await Promise.all(promises);

  // Build one result card per site
  var results = sites.map(function(site) {
    var url = '#';
    try {
      if (site.buildUrl) {
        url = site.buildUrl(params);
      }
    } catch(e) {
      console.warn('URL build error for ' + site.id + ':', e.message);
      url = '#';
    }

    return {
      id:          site.id + '_' + generateId(),
      source:      site.name,
      sourceId:    site.id,
      sourceColor: site.color,
      sourceIcon:  site.icon,
      sourceNote:  site.note  || '',
      sourceDesc:  site.desc  || '',
      bookingUrl:  url,
      // Deep copy params so each card has its own copy
      params:      JSON.parse(JSON.stringify(params)),
      isBestDeal:  false,
      isGoodDeal:  false,
    };
  });

  return results;
}

async function fetchCalendarPrices(params) {
  return {};
}
