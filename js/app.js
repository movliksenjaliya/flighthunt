// =============================================
// APP.JS - Complete clean rewrite
// =============================================

// ---- STATE ----
var state = {
  tripType:       'roundtrip',
  origin:         '',
  destination:    '',
  departDate:     '',
  returnDate:     '',
  adults:         1,
  children:       0,
  cabinClass:     'economy',
  checkedBaggage: false,
  directOnly:     false,
  flexDates:      false,
  results:        [],
  sortBy:         'price',
  maxStops:       'any',
  currentBookingUrl: '',
  alerts:         [],
  theme:          'dark',
};

// ---- DOM HELPER ----
function $(id) { return document.getElementById(id); }

// ---- DOM REFS ----
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
  dom.bookingModal    = $('bookingModal');
  dom.modalMessage    = $('modalMessage');
  dom.confirmBooking  = $('confirmBooking');
  dom.copyLink        = $('copyLink');
  dom.closeModal      = $('closeModal');
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
// INIT
// =============================================

function init() {
  initDom();
  setDefaultDates();
  loadSavedState();
  renderPopularRoutes();
  renderAlerts();
  attachEventListeners();
  registerServiceWorker();
  setupInstallPrompt();
  var savedTheme = Storage.get('theme', 'dark');
  setTheme(savedTheme);
  updateTripTypeUI();
  console.log('✅ FlightHunt initialized');
}

// =============================================
// SET DEFAULT DATES — timezone safe
// =============================================

function setDefaultDates() {
  var now = new Date();
  var Y   = now.getFullYear();
  var M   = now.getMonth();
  var D   = now.getDate();

  var d0  = new Date(Y, M, D);
  var d1  = new Date(Y, M, D + 7);
  var d2  = new Date(Y, M, D + 14);

  function fmt(d) {
    var yy = d.getFullYear();
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    var dd = String(d.getDate()).padStart(2, '0');
    return yy + '-' + mm + '-' + dd;
  }

  var todayStr  = fmt(d0);
  var departStr = fmt(d1);
  var returnStr = fmt(d2);

  dom.departDate.min   = todayStr;
  dom.returnDate.min   = todayStr;
  dom.departDate.value = departStr;
  dom.returnDate.value = returnStr;

  state.departDate = departStr;
  state.returnDate = returnStr;

  console.log('Dates → depart:', departStr, '| return:', returnStr);
}

// =============================================
// LOAD SAVED STATE
// =============================================

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

  // Trip type
  var radios = document.querySelectorAll('input[name="tripType"]');
  radios.forEach(function(radio) {
    radio.addEventListener('change', function(e) {
      state.tripType = e.target.value;
      updateTripTypeUI();
    });
  });

  // Search form
  dom.form.addEventListener('submit', handleSearch);

  // Swap airports
  dom.swapBtn.addEventListener('click', function() {
    var tmp           = dom.origin.value;
    dom.origin.value      = dom.destination.value;
    dom.destination.value = tmp;
    var tmpState      = state.origin;
    state.origin      = state.destination;
    state.destination = tmpState;
    showToast('Airports swapped ↔');
  });

  // Airport autocomplete
  dom.origin.addEventListener('input', debounce(function(e) {
    showAirportDropdown(e.target.value, 'origin');
  }, 200));

  dom.destination.addEventListener('input', debounce(function(e) {
    showAirportDropdown(e.target.value, 'dest');
  }, 200));

  // Close dropdowns on outside click
  document.addEventListener('click', function(e) {
    if (!e.target.closest('#origin') && !e.target.closest('#originDropdown')) {
      if (dom.originDropdown) dom.originDropdown.classList.add('hidden');
    }
    if (!e.target.closest('#destination') && !e.target.closest('#destDropdown')) {
      if (dom.destDropdown) dom.destDropdown.classList.add('hidden');
    }
  });

  // Date changes
  dom.departDate.addEventListener('change', function(e) {
    state.departDate = e.target.value;
    if (state.tripType === 'roundtrip') {
      if (!state.returnDate || state.returnDate <= e.target.value) {
        var autoRet = addDays(e.target.value, 7);
        dom.returnDate.value = autoRet;
        state.returnDate     = autoRet;
      }
      dom.returnDate.min = e.target.value;
    }
  });

  dom.returnDate.addEventListener('change', function(e) {
    state.returnDate = e.target.value;
  });

  // Passengers
  var countBtns = document.querySelectorAll('.count-btn');
  countBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var type   = btn.dataset.type;
      var action = btn.dataset.action;
      if (action === 'plus')  updateCounter(type, state[type] + 1);
      if (action === 'minus') updateCounter(type, state[type] - 1);
    });
  });

  // Cabin class
  dom.cabinClass.addEventListener('change', function(e) {
    state.cabinClass = e.target.value;
  });

  // Toggles
  dom.checkedBaggage.addEventListener('change', function(e) { state.checkedBaggage = e.target.checked; });
  dom.directOnly.addEventListener('change',     function(e) { state.directOnly     = e.target.checked; });
  dom.flexDates.addEventListener('change',      function(e) { state.flexDates      = e.target.checked; });

  // Theme toggle
  dom.darkToggle.addEventListener('click', function() {
    setTheme(state.theme === 'dark' ? 'light' : 'dark');
  });

  // Sort buttons
  var filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      state.sortBy = btn.dataset.sort;
      renderResults();
    });
  });

  // Max stops filter
  dom.maxStopsFilter.addEventListener('change', function(e) {
    state.maxStops = e.target.value;
    renderResults();
  });

  // Modal controls
  dom.closeModal.addEventListener('click', closeModal);
  dom.bookingModal.addEventListener('click', function(e) {
    if (e.target === dom.bookingModal) closeModal();
  });

  dom.confirmBooking.addEventListener('click', function() {
    if (state.currentBookingUrl) {
      var result = openPrivateBookingTab(state.currentBookingUrl);
      if (!result.success) {
        showToast('Popup blocked — use Copy Link instead');
      } else {
        showToast('✈️ Opening booking page...');
        closeModal();
      }
    }
  });

  dom.copyLink.addEventListener('click', function() {
    if (state.currentBookingUrl) {
      copyToClipboard(state.currentBookingUrl).then(function() {
        showToast('📋 Link copied! Paste in private/incognito window.');
      });
    }
  });

  // Price alerts
  dom.setAlertBtn.addEventListener('click', handleSetAlert);

  // View toggles
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
    renderCalendarView();
  });

  // Keyboard
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });
}

// =============================================
// TRIP TYPE UI
// =============================================

function updateTripTypeUI() {
  var isRound = state.tripType === 'roundtrip';
  if (dom.returnDateGroup) {
    dom.returnDateGroup.classList.toggle('hidden', !isRound);
  }
}

// =============================================
// COUNTER
// =============================================

function updateCounter(type, value) {
  var limits = { adults:[1,9], children:[0,8] };
  var lim    = limits[type] || [0,9];
  var clamped = Math.max(lim[0], Math.min(lim[1], value));
  state[type] = clamped;
  var el = $(type + 'Count');
  if (el) el.textContent = clamped;
}

// =============================================
// AIRPORT DROPDOWN
// =============================================

function showAirportDropdown(query, which) {
  var dropdown = which === 'origin' ? dom.originDropdown : dom.destDropdown;
  var input    = which === 'origin' ? dom.origin          : dom.destination;
  var matches  = searchAirports(query);

  if (!matches.length || query.length < 2) {
    if (dropdown) dropdown.classList.add('hidden');
    return;
  }

  dropdown.innerHTML = matches.map(function(a) {
    return '<div class="airport-item" data-iata="' + a.iata + '" data-city="' + a.city + '">' +
           '<span>' + a.city + ' — ' + a.name + '</span>' +
           '<span class="iata">' + a.iata + '</span>' +
           '</div>';
  }).join('');

  dropdown.classList.remove('hidden');

  var items = dropdown.querySelectorAll('.airport-item');
  items.forEach(function(item) {
    item.addEventListener('click', function() {
      var iata = item.dataset.iata;
      var city = item.dataset.city;
      input.value = city + ' (' + iata + ')';
      if (which === 'origin') {
        state.origin = iata;
      } else {
        state.destination = iata;
      }
      dropdown.classList.add('hidden');
    });
  });
}

function extractIATA(str) {
  if (!str) return '';
  var match = str.match(/\(([A-Z]{3})\)/);
  if (match) return match[1];
  var clean = str.trim().toUpperCase();
  if (/^[A-Z]{3}$/.test(clean)) return clean;
  var found = AIRPORTS.find(function(a) {
    return a.city.toLowerCase() === str.toLowerCase();
  });
  return found ? found.iata : clean;
}

// =============================================
// SEARCH HANDLER
// =============================================

async function handleSearch(e) {
  e.preventDefault();

  var originRaw = dom.origin.value.trim();
  var destRaw   = dom.destination.value.trim();

  state.origin      = extractIATA(originRaw);
  state.destination = extractIATA(destRaw);

  // Read dates DIRECTLY from form inputs
  state.departDate  = dom.departDate.value;
  state.returnDate  = dom.returnDate.value;
  state.cabinClass  = dom.cabinClass.value;

  console.log('Search:', state.origin, '→', state.destination,
    '| depart:', state.departDate,
    '| return:', state.returnDate,
    '| adults:', state.adults,
    '| children:', state.children);

  if (!state.origin || !state.destination) {
    showToast('⚠️ Please enter origin and destination airports'); return;
  }
  if (state.origin === state.destination) {
    showToast('⚠️ Origin and destination cannot be the same'); return;
  }
  if (!state.departDate) {
    showToast('⚠️ Please select a departure date'); return;
  }

  // Save last search
  Storage.set('lastSearch', {
    origin:      state.origin,
    destination: state.destination,
    cabinClass:  state.cabinClass,
    adults:      state.adults,
    children:    state.children,
  });

  // Show results section
  dom.resultsSection.classList.remove('hidden');
  dom.loadingState.classList.remove('hidden');
  dom.resultsGrid.innerHTML    = '';
  dom.siteStatuses.innerHTML   = '';
  dom.progressBar.style.width  = '0%';

  var originInfo = getAirportByIATA(state.origin);
  var destInfo   = getAirportByIATA(state.destination);
  dom.resultsTitle.textContent =
    (originInfo ? originInfo.city : state.origin) + ' → ' +
    (destInfo   ? destInfo.city   : state.destination);

  dom.loadingText.textContent = 'Searching across all sites privately...';

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
    var results = await searchFlights(searchParams, handleSearchProgress);
    state.results = results;
    dom.loadingState.classList.add('hidden');
    renderResults();
    checkPriceAlerts(results);
  } catch(err) {
    console.error('Search error:', err);
    showToast('❌ Search failed. Please try again.');
    dom.loadingState.classList.add('hidden');
  }

  dom.searchBtn.classList.remove('loading');
  dom.searchBtn.querySelector('span').textContent = 'Search All Sites (Private Mode)';
}

// =============================================
// PROGRESS HANDLER
// =============================================

function handleSearchProgress(event) {
  if (event.type === 'progress') {
    dom.progressBar.style.width = event.percent + '%';
    return;
  }
  if (event.type === 'status') {
    var el = document.querySelector('.site-status[data-site="' + event.siteId + '"]');
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
      '<i class="fas fa-search" style="font-size:2rem;margin-bottom:0.8rem;display:block;"></i>' +
      'No results found. Try again.' +
      '</div>';
    return;
  }

  dom.resultsGrid.innerHTML = filtered.map(function(r, idx) {
    return renderResultCard(r, idx);
  }).join('');

  var bookBtns = dom.resultsGrid.querySelectorAll('.book-btn');
  bookBtns.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var url  = decodeURIComponent(btn.dataset.url);
      var name = btn.dataset.site;
      openBookingModal(url, name);
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

  var descriptions = {
    google_flights: '⚠️ Google blocks date pre-filling. Airports pre-filled — set dates manually after opening.',
    skyscanner:     '✅ Opens with your exact dates, route and passengers pre-filled.',
    kayak:          '✅ Opens with your exact dates, route and passengers pre-filled.',
    kiwi:           '✅ Opens with your exact dates, route and passengers pre-filled.',
    expedia:        '✅ Opens with your exact dates, route and passengers pre-filled.',
    momondo:        '✅ Opens with your exact dates, route and passengers pre-filled.',
  };

  var googleWarning = isGoogle
    ? '<div style="background:rgba(255,152,0,0.15);border:1px solid rgba(255,152,0,0.4);border-radius:6px;padding:0.4rem 0.7rem;font-size:0.75rem;color:#ff9800;margin-top:0.4rem;">⚠️ Set your dates manually after opening Google Flights</div>'
    : '';

  var encodedUrl = encodeURIComponent(r.bookingUrl || '#');

  return '<div class="result-card site-card">' +
    '<div class="site-card-left">' +
      '<div class="site-icon-name">' +
        '<span style="font-size:1.5rem">' + r.sourceIcon + '</span>' +
        '<div>' +
          '<div style="font-weight:700;font-size:1rem;">' + r.source + '</div>' +
          '<div style="font-size:0.75rem;color:var(--text-muted);">' + (r.sourceNote || '') + '</div>' +
        '</div>' +
      '</div>' +
      '<div style="font-size:0.8rem;color:var(--text-secondary);margin-top:0.5rem;line-height:1.5;">' +
        (descriptions[r.sourceId] || '') +
      '</div>' +
      googleWarning +
      '<div style="margin-top:0.6rem;font-size:0.75rem;color:var(--text-muted);display:flex;gap:0.8rem;flex-wrap:wrap;">' +
        '<span>✈ ' + (params.origin || '') + ' → ' + (params.destination || '') + '</span>' +
        '<span>📅 ' + formatDateDisplay(params.departDate) + '</span>' +
        '<span>👤 ' + totalPax + ' passenger' + (totalPax > 1 ? 's' : '') + '</span>' +
        (params.tripType === 'roundtrip'
          ? '<span>🔄 Return: ' + formatDateDisplay(params.returnDate) + '</span>'
          : '<span>➡ One way</span>') +
        (params.checkedBaggage ? '<span>🧳 Bag included</span>' : '') +
      '</div>' +
    '</div>' +
    '<div class="site-card-right">' +
      '<div style="font-size:0.72rem;color:var(--text-muted);text-align:center;margin-bottom:0.4rem;">' +
        (isGoogle ? 'Airports pre-filled<br>Set dates manually' : 'Opens with your<br>search pre-filled') +
      '</div>' +
      '<button class="book-btn" data-url="' + encodedUrl + '" data-site="' + r.source + '" style="background:' + (r.sourceColor || 'var(--accent)') + ';width:100%;justify-content:center;">' +
        '<i class="fas fa-external-link-alt"></i> Search on ' + r.source +
      '</button>' +
      '<div style="font-size:0.68rem;color:var(--text-muted);text-align:center;margin-top:0.3rem;">🔒 Opens privately</div>' +
    '</div>' +
  '</div>';
}

// =============================================
// BOOKING MODAL
// =============================================

function openBookingModal(url, siteName) {
  state.currentBookingUrl = url;
  dom.modalMessage.innerHTML =
    'Taking you to <strong>' + siteName + '</strong> to complete your booking.<br>' +
    '<small style="color:var(--text-muted)">For maximum privacy, open in incognito/private mode.</small>';
  dom.bookingModal.classList.remove('hidden');
}

function closeModal() {
  dom.bookingModal.classList.add('hidden');
  state.currentBookingUrl = '';
}

// =============================================
// CALENDAR VIEW
// =============================================

async function renderCalendarView() {
  dom.calendarGrid.innerHTML =
    '<div style="grid-column:1/-1;text-align:center;padding:1rem;color:var(--text-muted);">Calendar view requires a search first.</div>';
}

// =============================================
// POPULAR ROUTES
// =============================================

function renderPopularRoutes() {
  if (!dom.popularRoutes) return;
  dom.popularRoutes.innerHTML = POPULAR_ROUTES.map(function(route) {
    return '<div class="route-card" data-from="' + route.from + '" data-to="' + route.to + '">' +
      '<div class="route-from-to">' + route.label + '</div>' +
      '<div class="route-price">from ' + formatEUR(route.fromPrice) + '</div>' +
      '<div class="route-airline">✈ Multiple airlines</div>' +
    '</div>';
  }).join('');

  var cards = dom.popularRoutes.querySelectorAll('.route-card');
  cards.forEach(function(card) {
    card.addEventListener('click', function() {
      var from = card.dataset.from;
      var to   = card.dataset.to;
      var fromA = getAirportByIATA(from);
      var toA   = getAirportByIATA(to);
      dom.origin.value      = fromA ? fromA.city + ' (' + from + ')' : from;
      dom.destination.value = toA   ? toA.city   + ' (' + to   + ')' : to;
      state.origin      = from;
      state.destination = to;
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
  if (!email || !email.includes('@')) { showToast('⚠️ Enter a valid email'); return; }
  if (!price || price <= 0)           { showToast('⚠️ Enter a valid max price'); return; }
  if (!state.origin || !state.destination) { showToast('⚠️ Search for a route first'); return; }

  var alert = {
    id:          generateId(),
    email:       email,
    maxPrice:    price,
    origin:      state.origin,
    destination: state.destination,
    departDate:  state.departDate,
    cabinClass:  state.cabinClass,
    createdAt:   new Date().toISOString(),
  };

  state.alerts.push(alert);
  Storage.set('priceAlerts', state.alerts);
  renderAlerts();
  dom.alertEmail.value = '';
  dom.alertPrice.value = '';
  showToast('🔔 Alert set for ' + formatEUR(price) + ' on ' + state.origin + ' → ' + state.destination);
}

function renderAlerts() {
  if (!dom.activeAlerts) return;
  if (!state.alerts.length) {
    dom.activeAlerts.innerHTML = '<small style="color:var(--text-muted)">No active alerts</small>';
    return;
  }
  dom.activeAlerts.innerHTML = state.alerts.map(function(a) {
    return '<div class="alert-item">' +
      '<span><strong>' + a.origin + ' → ' + a.destination + '</strong> · Max ' + formatEUR(a.maxPrice) + ' · ' + a.email + '</span>' +
      '<button class="remove-alert" data-id="' + a.id + '"><i class="fas fa-times"></i></button>' +
    '</div>';
  }).join('');

  var removeBtns = dom.activeAlerts.querySelectorAll('.remove-alert');
  removeBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      state.alerts = state.alerts.filter(function(a) { return a.id !== btn.dataset.id; });
      Storage.set('priceAlerts', state.alerts);
      renderAlerts();
      showToast('Alert removed');
    });
  });
}

function checkPriceAlerts(results) {
  // No prices to check in redirect-only mode
}

// =============================================
// THEME
// =============================================

function setTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  Storage.set('theme', theme);
  var icon = dom.darkToggle ? dom.darkToggle.querySelector('i') : null;
  if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
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
// SERVICE WORKER
// =============================================

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/flighthunt/sw.js')
      .then(function(reg) { console.log('SW registered'); })
      .catch(function(err) { console.warn('SW failed:', err); });
  }
}

// =============================================
// INSTALL PROMPT
// =============================================

var deferredInstallPrompt = null;

function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredInstallPrompt = e;
    if (dom.installBtn) dom.installBtn.classList.remove('hidden');
  });

  if (dom.installBtn) {
    dom.installBtn.addEventListener('click', async function() {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      var result = await deferredInstallPrompt.userChoice;
      if (result.outcome === 'accepted') {
        showToast('✅ FlightHunt installed!');
        dom.installBtn.classList.add('hidden');
      }
      deferredInstallPrompt = null;
    });
  }
}

// =============================================
// START APP
// =============================================

document.addEventListener('DOMContentLoaded', init);
