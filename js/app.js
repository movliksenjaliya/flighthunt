// =============================================
// APP.JS v5.0 - Complete with auto cache clear
// =============================================

var state = {
  tripType:'roundtrip', origin:'', destination:'',
  departDate:'', returnDate:'',
  adults:1, children:0, cabinClass:'economy',
  checkedBaggage:false, directOnly:false, flexDates:false,
  results:[], sortBy:'price', maxStops:'any',
  currentBookingUrl:'', alerts:[], theme:'dark',
};

function $(id) { return document.getElementById(id); }
var dom = {};

function initDom() {
  dom.form            = $('searchForm');
  dom.origin          = $('origin');
  dom.destination     = $('destination');
  dom.departDate      = $('departDate');
  dom.returnDate      = $('returnDate');
  dom.returnDateGroup = $('returnDateGroup');
  dom.adultsCount     = $('adultsCount');
  dom.childrenCount   = $('childrenCount');
  dom.cabinClass      = $('cabinClass');
  dom.checkedBaggage  = $('checkedBaggage');
  dom.directOnly      = $('directOnly');
  dom.flexDates       = $('flexDates');
  dom.searchBtn       = $('searchBtn');
  dom.resultsSection  = $('resultsSection');
  dom.resultsTitle    = $('resultsTitle');
  dom.loadingState    = $('loadingState');
  dom.loadingText     = $('loadingText');
  dom.progressBar     = $('progressBar');
  dom.siteStatuses    = $('siteStatuses');
  dom.resultsGrid     = $('resultsGrid');
  dom.calendarView    = $('calendarView');
  dom.calendarGrid    = $('calendarGrid');
  dom.originDropdown  = $('originDropdown');
  dom.destDropdown    = $('destDropdown');
  dom.darkToggle      = $('darkToggle');
  dom.installBtn      = $('installBtn');
  dom.toast           = $('toast');
  dom.swapBtn         = $('swapBtn');
  dom.popularRoutes   = $('popularRoutes');
  dom.setAlertBtn     = $('setAlertBtn');
  dom.alertEmail      = $('alertEmail');
  dom.alertPrice      = $('alertPrice');
  dom.activeAlerts    = $('activeAlerts');
  dom.listViewBtn     = $('listViewBtn');
  dom.calendarViewBtn = $('calendarViewBtn');
  dom.maxStopsFilter  = $('maxStopsFilter');
}

// =============================================
// SERVICE WORKER + AUTO CACHE CLEAR
// =============================================

function setupServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  // Listen for SW messages — auto reload on update
  navigator.serviceWorker.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'SW_UPDATED') {
      console.log('✅ New version ' + event.data.version + ' — reloading...');
      if ('caches' in window) {
        caches.keys().then(function(names) {
          return Promise.all(names.map(function(name) {
            return caches.delete(name);
          }));
        }).then(function() {
          window.location.reload(true);
        });
      } else {
        window.location.reload(true);
      }
    }
  });

  // Register SW
  navigator.serviceWorker.register('/flighthunt/sw.js')
    .then(function(reg) {
      console.log('[SW] Registered:', reg.scope);

      // Check for updates on every page load
      reg.update();

      // When new SW found — activate immediately
      reg.addEventListener('updatefound', function() {
        var newWorker = reg.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', function() {
          if (newWorker.state === 'installed' &&
              navigator.serviceWorker.controller) {
            console.log('[SW] Update found — activating now...');
            newWorker.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      });
    })
    .catch(function(err) {
      console.warn('[SW] Registration failed:', err);
    });

  // Reload when new SW takes control
  var refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', function() {
    if (!refreshing) {
      refreshing = true;
      console.log('[SW] New version active — reloading page...');
      window.location.reload();
    }
  });
}

// =============================================
// INIT
// =============================================

function init() {
  initDom();
  setupServiceWorker();
  setDefaultDates();
  loadSavedState();
  renderPopularRoutes();
  renderAlerts();
  attachEventListeners();
  setupInstallPrompt();
  setTheme(Storage.get('theme', 'dark'));
  updateTripTypeUI();
  console.log('✅ FlightHunt v5.0 initialized');
}

// =============================================
// DEFAULT DATES — TODAY
// =============================================

function setDefaultDates() {
  var now = new Date();
  var Y   = now.getFullYear();
  var M   = now.getMonth();
  var D   = now.getDate();

  var today  = new Date(Y, M, D);
  var retDay = new Date(Y, M, D + 7);

  function fmt(d) {
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  var todayStr  = fmt(today);
  var returnStr = fmt(retDay);

  dom.departDate.min   = todayStr;
  dom.returnDate.min   = todayStr;
  dom.departDate.value = todayStr;
  dom.returnDate.value = returnStr;

  state.departDate = todayStr;
  state.returnDate = returnStr;

  console.log('Depart:', todayStr, '| Return:', returnStr);
}

function loadSavedState() {
  var saved = Storage.get('lastSearch');
  if (saved) {
    if (saved.origin)      dom.origin.value      = saved.origin;
    if (saved.destination) dom.destination.value = saved.destination;
    if (saved.cabinClass)  dom.cabinClass.value  = saved.cabinClass;
    if (saved.adults)      updateCounter('adults',   saved.adults);
    if (saved.children)    updateCounter('children', saved.children);
  }
  state.alerts = Storage.get('priceAlerts', []);
}

// =============================================
// EVENT LISTENERS
// =============================================

function attachEventListeners() {

  document.querySelectorAll('input[name="tripType"]').forEach(function(r) {
    r.addEventListener('change', function(e) {
      state.tripType = e.target.value;
      updateTripTypeUI();
    });
  });

  dom.form.addEventListener('submit', handleSearch);

  dom.swapBtn.addEventListener('click', function() {
    var tmp           = dom.origin.value;
    dom.origin.value      = dom.destination.value;
    dom.destination.value = tmp;
    var ts            = state.origin;
    state.origin      = state.destination;
    state.destination = ts;
    showToast('✈ Airports swapped');
  });

  dom.origin.addEventListener('input', debounce(function(e) {
    showAirportDropdown(e.target.value, 'origin');
  }, 150));

  dom.destination.addEventListener('input', debounce(function(e) {
    showAirportDropdown(e.target.value, 'dest');
  }, 150));

  document.addEventListener('click', function(e) {
    if (!e.target.closest('#origin') &&
        !e.target.closest('#originDropdown')) {
      if (dom.originDropdown) dom.originDropdown.classList.add('hidden');
    }
    if (!e.target.closest('#destination') &&
        !e.target.closest('#destDropdown')) {
      if (dom.destDropdown) dom.destDropdown.classList.add('hidden');
    }
  });

  dom.departDate.addEventListener('change', function(e) {
    state.departDate = e.target.value;
    if (state.tripType === 'roundtrip') {
      if (!state.returnDate || state.returnDate <= e.target.value) {
        var ar = addDays(e.target.value, 7);
        dom.returnDate.value = ar;
        state.returnDate     = ar;
      }
      dom.returnDate.min = e.target.value;
    }
  });

  dom.returnDate.addEventListener('change', function(e) {
    state.returnDate = e.target.value;
  });

  document.querySelectorAll('.count-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      updateCounter(
        btn.dataset.type,
        state[btn.dataset.type] + (btn.dataset.action === 'plus' ? 1 : -1)
      );
    });
  });

  dom.cabinClass.addEventListener('change', function(e) {
    state.cabinClass = e.target.value;
  });
  dom.checkedBaggage.addEventListener('change', function(e) {
    state.checkedBaggage = e.target.checked;
  });
  dom.directOnly.addEventListener('change', function(e) {
    state.directOnly = e.target.checked;
  });
  dom.flexDates.addEventListener('change', function(e) {
    state.flexDates = e.target.checked;
  });

  dom.darkToggle.addEventListener('click', function() {
    setTheme(state.theme === 'dark' ? 'light' : 'dark');
  });

  document.querySelectorAll('.filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(function(b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      state.sortBy = btn.dataset.sort;
      renderResults();
    });
  });

  dom.maxStopsFilter.addEventListener('change', function(e) {
    state.maxStops = e.target.value;
    renderResults();
  });

  dom.setAlertBtn.addEventListener('click', handleSetAlert);

  dom.listViewBtn.addEventListener('click', function() {
    dom.listViewBtn.classList.add('active');
    dom.calendarViewBtn.classList.remove('active');
    dom.resultsGrid.classList.remove('hidden');
    dom.calendarView.classList.add('hidden');
  });

  dom.calendarViewBtn.addEventListener('click', function() {
    dom.calendarViewBtn.classList.add('active');
    dom.listViewBtn.classList.remove('active');
    dom.resultsGrid.classList.add('hidden');
    dom.calendarView.classList.remove('hidden');
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (dom.originDropdown) dom.originDropdown.classList.add('hidden');
      if (dom.destDropdown)   dom.destDropdown.classList.add('hidden');
    }
  });
}

function updateTripTypeUI() {
  if (dom.returnDateGroup) {
    dom.returnDateGroup.classList.toggle(
      'hidden', state.tripType !== 'roundtrip'
    );
  }
}

function updateCounter(type, value) {
  var lims    = { adults:[1,9], children:[0,8] };
  var lim     = lims[type] || [0,9];
  state[type] = Math.max(lim[0], Math.min(lim[1], value));
  var el      = $(type + 'Count');
  if (el) el.textContent = state[type];
}

// =============================================
// AIRPORT DROPDOWN
// =============================================

function showAirportDropdown(query, which) {
  var dropdown = which === 'origin' ? dom.originDropdown : dom.destDropdown;
  var input    = which === 'origin' ? dom.origin         : dom.destination;
  var matches  = searchAirports(query);

  if (!matches.length || query.length < 2) {
    dropdown.classList.add('hidden');
    return;
  }

  dropdown.innerHTML = matches.map(function(a) {
    return '<div class="airport-item"' +
           ' data-iata="' + a.iata + '"' +
           ' data-city="' + a.city + '">' +
           '<div>' +
           '<div class="city-name">' + a.city + ' — ' + a.name + '</div>' +
           '<div class="country-name">' + a.country + '</div>' +
           '</div>' +
           '<span class="iata">' + a.iata + '</span>' +
           '</div>';
  }).join('');

  dropdown.classList.remove('hidden');

  dropdown.querySelectorAll('.airport-item').forEach(function(item) {
    item.addEventListener('click', function() {
      var iata = item.dataset.iata;
      var city = item.dataset.city;
      input.value = city + ' (' + iata + ')';
      if (which === 'origin') state.origin = iata;
      else state.destination = iata;
      dropdown.classList.add('hidden');
    });
  });
}

function extractIATA(str) {
  if (!str) return '';
  var m = str.match(/\(([A-Z]{3})\)/);
  if (m) return m[1];
  var c = str.trim().toUpperCase();
  if (/^[A-Z]{3}$/.test(c)) return c;
  var f = AIRPORTS.find(function(a) {
    return a.city.toLowerCase() === str.toLowerCase();
  });
  return f ? f.iata : c;
}

// =============================================
// BEST DEAL RANKING
// =============================================

function rankResults(results) {
  if (!results || !results.length) return results;

  var params  = results[0].params || {};
  var isEU    = isEuropeOnlyRoute(params.origin, params.destination);
  var isIndia = isIndiaRoute2(params.origin, params.destination);

  var scores = {
    skyscanner:    isIndia ? 2 : 3,
    kayak:         isIndia ? 3 : 2,
    expedia:       4,
    momondo:       isIndia ? 1 : 2,
    google_flights:6,
    booking:       3,
    lastminute:    5,
  };

  results.sort(function(a, b) {
    return (scores[a.sourceId] || 9) - (scores[b.sourceId] || 9);
  });

  results.forEach(function(r, idx) {
    r.isBestDeal = idx === 0;
    r.isGoodDeal = idx === 1 || idx === 2;
    r.dealRank   = idx;
  });

  return results;
}

function isEuropeOnlyRoute(origin, destination) {
  var eu = ['Germany','UK','France','Netherlands','Spain','Italy',
    'Austria','Switzerland','Belgium','Denmark','Sweden','Norway',
    'Finland','Portugal','Greece','Poland','Czech Rep.','Hungary',
    'Romania','Bulgaria','Croatia','Ireland','Iceland','Turkey',
    'Serbia','Slovenia','Slovakia','Malta','Estonia','Latvia','Lithuania'];
  function check(iata) {
    var a = getAirportByIATA(iata);
    return a && eu.indexOf(a.country) !== -1;
  }
  return check(origin) && check(destination);
}

function isIndiaRoute2(origin, destination) {
  function check(iata) {
    var a = getAirportByIATA(iata);
    return a && a.country === 'India';
  }
  return check(origin) || check(destination);
}

// =============================================
// SEARCH HANDLER
// =============================================

async function handleSearch(e) {
  e.preventDefault();

  state.origin      = extractIATA(dom.origin.value.trim());
  state.destination = extractIATA(dom.destination.value.trim());
  state.departDate  = dom.departDate.value;
  state.returnDate  = dom.returnDate.value;
  state.cabinClass  = dom.cabinClass.value;

  console.log('Search:', state.origin, '→', state.destination);
  console.log('Dates:', state.departDate, '→', state.returnDate);
  console.log('Pax:', state.adults, 'adults,', state.children, 'children');

  if (!state.origin || !state.destination) {
    showToast('⚠️ Please enter origin and destination'); return;
  }
  if (state.origin === state.destination) {
    showToast('⚠️ Origin and destination cannot be the same'); return;
  }
  if (!state.departDate) {
    showToast('⚠️ Please select a departure date'); return;
  }

  Storage.set('lastSearch', {
    origin:      state.origin,
    destination: state.destination,
    cabinClass:  state.cabinClass,
    adults:      state.adults,
    children:    state.children,
  });

  dom.resultsSection.classList.remove('hidden');
  dom.loadingState.classList.remove('hidden');
  dom.resultsGrid.innerHTML   = '';
  dom.siteStatuses.innerHTML  = '';
  dom.progressBar.style.width = '0%';

  var originInfo = getAirportByIATA(state.origin);
  var destInfo   = getAirportByIATA(state.destination);
  dom.resultsTitle.textContent =
    (originInfo ? originInfo.city : state.origin) + ' → ' +
    (destInfo   ? destInfo.city   : state.destination);

  dom.loadingText.textContent =
    'Searching ' + SEARCH_SITES.length + ' sites privately...';

  dom.resultsSection.scrollIntoView({ behavior:'smooth', block:'start' });

  dom.searchBtn.classList.add('loading');
  dom.searchBtn.querySelector('span').textContent = 'Searching...';

  var searchParams = {
    origin:         state.origin,
    destination:    state.destination,
    departDate:     state.departDate,
    returnDate:     state.tripType === 'roundtrip' ? state.returnDate : null,
    adults:         state.adults,
    children:       state.children,
    cabinClass:     state.cabinClass,
    tripType:       state.tripType,
    directOnly:     state.directOnly,
    checkedBaggage: state.checkedBaggage,
  };

  try {
    var results = await searchFlights(searchParams, handleProgress);
    results     = rankResults(results);
    state.results = results;
    dom.loadingState.classList.add('hidden');
    renderResults();
  } catch(err) {
    console.error('Search error:', err);
    showToast('❌ Search failed. Please try again.');
    dom.loadingState.classList.add('hidden');
  }

  dom.searchBtn.classList.remove('loading');
  dom.searchBtn.querySelector('span').textContent =
    'Search All Sites (Private Mode)';
}

function handleProgress(event) {
  if (event.type === 'progress') {
    dom.progressBar.style.width = event.percent + '%';
    return;
  }
  if (event.type === 'status') {
    var el = document.querySelector(
      '.site-status[data-site="' + event.siteId + '"]'
    );
    if (!el) {
      el = document.createElement('div');
      el.className    = 'site-status';
      el.dataset.site = event.siteId;
      dom.siteStatuses.appendChild(el);
    }
    var icons = { searching:'⏳', done:'✅', error:'❌' };
    el.className   = 'site-status ' + event.status;
    el.textContent = (icons[event.status] || '') + ' ' + event.name;
  }
}

// =============================================
// RENDER RESULTS
// =============================================

function renderResults() {
  var filtered = state.results.slice();

  if (!filtered.length) {
    dom.resultsGrid.innerHTML =
      '<div style="text-align:center;padding:2rem;color:var(--text-muted);">' +
      '<i class="fas fa-search" style="font-size:2rem;display:block;' +
      'margin-bottom:0.8rem;"></i>No results. Please search again.</div>';
    return;
  }

  dom.resultsGrid.innerHTML = filtered.map(function(r, idx) {
    return renderResultCard(r, idx);
  }).join('');

  // Direct open — no modal popup
  dom.resultsGrid.querySelectorAll('.book-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var url = btn.dataset.url;
      if (!url || url === '#') {
        showToast('⚠️ URL not available');
        return;
      }
      clearAppCookies();
      var win = window.open(url, '_blank', 'noopener,noreferrer');
      if (!win) {
        copyToClipboard(url).then(function() {
          showToast('📋 Popup blocked — link copied!');
        });
      } else {
        showToast('✈️ Opening ' + btn.dataset.site + '...');
      }
    });
  });
}

// =============================================
// RESULT CARD
// =============================================

function renderResultCard(r, idx) {
  var params   = r.params || {};
  var adults   = parseInt(params.adults)   || 1;
  var children = parseInt(params.children) || 0;
  var totalPax = adults + children;
  var isGoogle = r.sourceId === 'google_flights';

  var badgeHtml = '';
  if (r.isBestDeal) {
    badgeHtml = '<div class="best-deal-badge">' +
                '<i class="fas fa-trophy"></i> Best Deal</div>';
  } else if (r.isGoodDeal) {
    badgeHtml = '<div class="good-deal-badge">' +
                '<i class="fas fa-thumbs-up"></i> Good Deal</div>';
  }

  var cardClass = 'result-card';
  if (r.isBestDeal)      cardClass += ' best-deal-card';
  else if (r.isGoodDeal) cardClass += ' good-deal-card';

  var descriptions = {
    google_flights: '⚠️ Origin pre-filled. Set destination and dates manually after opening.',
    skyscanner:     '✅ Full search pre-filled — route, dates, passengers.',
    kayak:          '✅ Full search pre-filled — route, dates, passengers.',
    expedia:        '✅ Full search pre-filled — route, dates, passengers.',
    momondo:        '✅ Full search pre-filled — route, dates, passengers.',
    booking:        '✅ Full search pre-filled — route, dates, passengers.',
    lastminute:     '✅ Full search pre-filled — route, dates, passengers.',
  };

  var googleNote = isGoogle
    ? '<div style="background:rgba(255,152,0,0.12);border:1px solid ' +
      'rgba(255,152,0,0.3);border-radius:6px;padding:0.4rem 0.7rem;' +
      'font-size:0.75rem;color:#e07b00;margin-top:0.4rem;">' +
      '⚠️ Set destination and dates manually on Google Flights</div>'
    : '';

  var url = r.bookingUrl || '#';

  return '<div class="' + cardClass + '">' +
    badgeHtml +
    '<div class="site-card-left">' +
      '<div class="site-icon-name">' +
        '<span style="font-size:1.6rem;line-height:1;">' +
          r.sourceIcon +
        '</span>' +
        '<div>' +
          '<div class="site-name-text">' + r.source + '</div>' +
          '<div class="site-note-text">'  + (r.sourceNote || '') + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="site-desc-text">' +
        (descriptions[r.sourceId] || '') +
      '</div>' +
      googleNote +
      '<div class="site-meta">' +
        '<span>✈ ' + (params.origin || '') +
        ' → ' + (params.destination || '') + '</span>' +
        '<span>📅 ' + formatDateDisplay(params.departDate) + '</span>' +
        '<span>👤 ' + totalPax + ' pax</span>' +
        (params.tripType === 'roundtrip' && params.returnDate
          ? '<span>🔄 ' + formatDateDisplay(params.returnDate) + '</span>'
          : '<span>➡ One way</span>') +
        (params.checkedBaggage ? '<span>🧳 Bag</span>' : '') +
        (params.directOnly     ? '<span>⚡ Direct</span>' : '') +
      '</div>' +
    '</div>' +
    '<div class="site-card-right">' +
      '<div class="site-open-label">' +
        (isGoogle
          ? 'Set dates manually<br>after opening'
          : 'Opens with your<br>search pre-filled') +
      '</div>' +
      '<button class="book-btn"' +
        ' data-url="' + url + '"' +
        ' data-site="' + r.source + '"' +
        ' style="background:' + (r.sourceColor || 'var(--accent)') + ';">' +
        '<i class="fas fa-external-link-alt"></i>' +
        ' Search on ' + r.source +
      '</button>' +
      '<div class="private-label">' +
        '<i class="fas fa-lock"></i> Opens privately' +
      '</div>' +
    '</div>' +
  '</div>';
}

// =============================================
// POPULAR ROUTES
// =============================================

function renderPopularRoutes() {
  if (!dom.popularRoutes) return;
  dom.popularRoutes.innerHTML = POPULAR_ROUTES.map(function(route) {
    return '<div class="route-card"' +
           ' data-from="' + route.from + '"' +
           ' data-to="'   + route.to   + '">' +
           '<div class="route-from-to">' + route.label + '</div>' +
           '<div class="route-price">from ' + formatEUR(route.fromPrice) + '</div>' +
           '<div class="route-airline">✈ Multiple airlines</div>' +
           '</div>';
  }).join('');

  dom.popularRoutes.querySelectorAll('.route-card').forEach(function(card) {
    card.addEventListener('click', function() {
      var from  = card.dataset.from;
      var to    = card.dataset.to;
      var fromA = getAirportByIATA(from);
      var toA   = getAirportByIATA(to);
      dom.origin.value      = fromA ? fromA.city + ' (' + from + ')' : from;
      dom.destination.value = toA   ? toA.city   + ' (' + to   + ')' : to;
      state.origin      = from;
      state.destination = to;
      window.scrollTo({ top:0, behavior:'smooth' });
      showToast('Route set: ' + from + ' → ' + to);
    });
  });
}

// =============================================
// PRICE ALERTS
// =============================================

function handleSetAlert() {
  var email = dom.alertEmail.value.trim();
  var price = parseFloat(dom.alertPrice.value);
  if (!email || !email.includes('@')) {
    showToast('⚠️ Enter a valid email'); return;
  }
  if (!price || price <= 0) {
    showToast('⚠️ Enter a valid max price'); return;
  }
  if (!state.origin || !state.destination) {
    showToast('⚠️ Search for a route first'); return;
  }

  var alert = {
    id:          generateId(),
    email:       email,
    maxPrice:    price,
    origin:      state.origin,
    destination: state.destination,
    departDate:  state.departDate,
    createdAt:   new Date().toISOString(),
  };

  state.alerts.push(alert);
  Storage.set('priceAlerts', state.alerts);
  renderAlerts();
  dom.alertEmail.value = '';
  dom.alertPrice.value = '';
  showToast('🔔 Alert set for ' + formatEUR(price));
}

function renderAlerts() {
  if (!dom.activeAlerts) return;
  if (!state.alerts || !state.alerts.length) {
    dom.activeAlerts.innerHTML =
      '<small style="color:var(--text-muted)">No active alerts</small>';
    return;
  }
  dom.activeAlerts.innerHTML = state.alerts.map(function(a) {
    return '<div class="alert-item">' +
      '<span><strong>' + a.origin + ' → ' + a.destination +
      '</strong> · Max ' + formatEUR(a.maxPrice) +
      ' · ' + a.email + '</span>' +
      '<button class="remove-alert" data-id="' + a.id + '">' +
        '<i class="fas fa-times"></i>' +
      '</button>' +
    '</div>';
  }).join('');

  dom.activeAlerts.querySelectorAll('.remove-alert').forEach(function(btn) {
    btn.addEventListener('click', function() {
      state.alerts = state.alerts.filter(function(a) {
        return a.id !== btn.dataset.id;
      });
      Storage.set('priceAlerts', state.alerts);
      renderAlerts();
      showToast('Alert removed');
    });
  });
}

// =============================================
// THEME
// =============================================

function setTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  Storage.set('theme', theme);
  var icon = dom.darkToggle ? dom.darkToggle.querySelector('i') : null;
  if (icon) {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
}

// =============================================
// TOAST
// =============================================

var toastTimer;
function showToast(message, duration) {
  if (!duration) duration = 3000;
  if (!dom.toast) return;
  dom.toast.textContent = message;
  dom.toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() {
    dom.toast.classList.add('hidden');
  }, duration);
}

// =============================================
// INSTALL PROMPT
// =============================================

var deferredInstall = null;

function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredInstall = e;
    if (dom.installBtn) dom.installBtn.classList.remove('hidden');
  });

  if (dom.installBtn) {
    dom.installBtn.addEventListener('click', async function() {
      if (!deferredInstall) return;
      deferredInstall.prompt();
      var result = await deferredInstall.userChoice;
      if (result.outcome === 'accepted') {
        showToast('✅ FlightHunt installed!');
      }
      deferredInstall = null;
      dom.installBtn.classList.add('hidden');
    });
  }
}

// =============================================
// START
// =============================================

document.addEventListener('DOMContentLoaded', init);
