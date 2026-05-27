// =============================================
// APP.JS — Main Application Logic
// =============================================

// ---- STATE ----
const state = {
  tripType:        'roundtrip',
  origin:          '',
  destination:     '',
  departDate:      '',
  returnDate:      '',
  adults:          1,
  children:        0,
  cabinClass:      'economy',
  checkedBaggage:  false,
  directOnly:      false,
  flexDates:       false,
  results:         [],
  sortBy:          'price',
  maxStops:        'any',
  currentBookingUrl: '',
  alerts:          [],
  theme:           'dark',
};

// ---- DOM REFS ----
const $ = id => document.getElementById(id);

const dom = {
  form:            $('searchForm'),
  origin:          $('origin'),
  destination:     $('destination'),
  departDate:      $('departDate'),
  returnDate:      $('returnDate'),
  returnDateGroup: $('returnDateGroup'),
  adultsCount:     $('adultsCount'),
  childrenCount:   $('childrenCount'),
  cabinClass:      $('cabinClass'),
  checkedBaggage:  $('checkedBaggage'),
  directOnly:      $('directOnly'),
  flexDates:       $('flexDates'),
  searchBtn:       $('searchBtn'),
  resultsSection:  $('resultsSection'),
  resultsTitle:    $('resultsTitle'),
  loadingState:    $('loadingState'),
  loadingText:     $('loadingText'),
  progressBar:     $('progressBar'),
  siteStatuses:    $('siteStatuses'),
  resultsGrid:     $('resultsGrid'),
  calendarView:    $('calendarView'),
  calendarGrid:    $('calendarGrid'),
  originDropdown:  $('originDropdown'),
  destDropdown:    $('destDropdown'),
  darkToggle:      $('darkToggle'),
  installBtn:      $('installBtn'),
  bookingModal:    $('bookingModal'),
  modalMessage:    $('modalMessage'),
  confirmBooking:  $('confirmBooking'),
  copyLink:        $('copyLink'),
  closeModal:      $('closeModal'),
  toast:           $('toast'),
  swapBtn:         $('swapBtn'),
  popularRoutes:   $('popularRoutes'),
  setAlertBtn:     $('setAlertBtn'),
  alertEmail:      $('alertEmail'),
  alertPrice:      $('alertPrice'),
  activeAlerts:    $('activeAlerts'),
  listViewBtn:     $('listViewBtn'),
  calendarViewBtn: $('calendarViewBtn'),
  maxStopsFilter:  $('maxStopsFilter'),
};

// =============================================
// INIT
// =============================================

function init() {
  setDefaultDates();
  loadSavedState();
  renderPopularRoutes();
  renderAlerts();
  attachEventListeners();
  registerServiceWorker();
  setupInstallPrompt();

  // Apply saved theme
  const savedTheme = Storage.get('theme', 'dark');
  setTheme(savedTheme);

  // Show trip type
  updateTripTypeUI();
}

function setDefaultDates() {
  // Get today's real date
  const today = new Date();

  // Depart = 7 days from today
  const depart = new Date(today);
  depart.setDate(today.getDate() + 7);

  // Return = 14 days from today
  const ret = new Date(today);
  ret.setDate(today.getDate() + 14);

  // Format as YYYY-MM-DD using LOCAL date not UTC
  function toLocalYMD(d) {
    const y  = d.getFullYear();
    const m  = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  const todayStr  = toLocalYMD(today);
  const departStr = toLocalYMD(depart);
  const retStr    = toLocalYMD(ret);

  // Set minimum selectable date to today
  dom.departDate.min = todayStr;
  dom.returnDate.min = todayStr;

  // Set default values
  dom.departDate.value = departStr;
  dom.returnDate.value = retStr;

  // Save to state
  state.departDate = departStr;
  state.returnDate = retStr;

  console.log('Dates set:', departStr, retStr);
}

function loadSavedState() {
  const saved = Storage.get('lastSearch');
  if (saved) {
    if (saved.origin)      dom.origin.value      = saved.origin;
    if (saved.destination) dom.destination.value = saved.destination;
    if (saved.cabinClass)  dom.cabinClass.value   = saved.cabinClass;
    if (saved.adults)      updateCounter('adults',   saved.adults);
    if (saved.children)    updateCounter('children', saved.children);
  }
  state.alerts = Storage.get('priceAlerts', []);
}

// =============================================
// EVENT LISTENERS
// =============================================

function attachEventListeners() {

  // ---- Trip type radio ----
  document.querySelectorAll('input[name="tripType"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.tripType = e.target.value;
      updateTripTypeUI();
    });
  });

  // ---- Search form ----
  dom.form.addEventListener('submit', handleSearch);

  // ---- Swap airports ----
  dom.swapBtn.addEventListener('click', () => {
    const tmp          = dom.origin.value;
    dom.origin.value      = dom.destination.value;
    dom.destination.value = tmp;
    showToast('Airports swapped ↔');
  });

  // ---- Airport autocomplete ----
  dom.origin.addEventListener('input', debounce((e) => {
    showAirportDropdown(e.target.value, 'origin');
  }, 200));

  dom.destination.addEventListener('input', debounce((e) => {
    showAirportDropdown(e.target.value, 'dest');
  }, 200));

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#origin') && !e.target.closest('#originDropdown')) {
      dom.originDropdown.classList.add('hidden');
    }
    if (!e.target.closest('#destination') && !e.target.closest('#destDropdown')) {
      dom.destDropdown.classList.add('hidden');
    }
  });

  // ---- Date changes ----
  dom.departDate.addEventListener('change', (e) => {
  const picked = e.target.value;
  state.departDate = picked;

  // Auto-update return date if it's before depart date
  if (state.tripType === 'roundtrip') {
    if (!state.returnDate || state.returnDate <= picked) {
      const autoReturn = addDays(picked, 7);
      dom.returnDate.value = autoReturn;
      state.returnDate     = autoReturn;
    }
    dom.returnDate.min = picked;
  }
});

dom.returnDate.addEventListener('change', (e) => {
  state.returnDate = e.target.value;
});

  // ---- Passengers ----
  document.querySelectorAll('.count-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type   = btn.dataset.type;
      const action = btn.dataset.action;
      if (action === 'plus')  updateCounter(type, state[type] + 1);
      if (action === 'minus') updateCounter(type, state[type] - 1);
    });
  });

  // ---- Cabin class ----
  dom.cabinClass.addEventListener('change', (e) => {
    state.cabinClass = e.target.value;
  });

  // ---- Toggles ----
  dom.checkedBaggage.addEventListener('change', (e) => {
    state.checkedBaggage = e.target.checked;
  });
  dom.directOnly.addEventListener('change', (e) => {
    state.directOnly = e.target.checked;
  });
  dom.flexDates.addEventListener('change', (e) => {
    state.flexDates = e.target.checked;
  });

  // ---- Theme toggle ----
  dom.darkToggle.addEventListener('click', () => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });

  // ---- Sort buttons ----
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.sortBy = btn.dataset.sort;
      renderResults();
    });
  });

  // ---- Max stops filter ----
  dom.maxStopsFilter.addEventListener('change', (e) => {
    state.maxStops = e.target.value;
    renderResults();
  });

  // ---- Modal controls ----
  dom.closeModal.addEventListener('click', closeModal);
  dom.bookingModal.addEventListener('click', (e) => {
    if (e.target === dom.bookingModal) closeModal();
  });

  dom.confirmBooking.addEventListener('click', () => {
    if (state.currentBookingUrl) {
      const result = openPrivateBookingTab(state.currentBookingUrl);
      if (!result.success) {
        showToast('⚠️ Popup blocked. Use the copy button instead.');
      } else {
        showToast('✈️ Opening booking page...');
        closeModal();
      }
    }
  });

  dom.copyLink.addEventListener('click', () => {
    if (state.currentBookingUrl) {
      copyToClipboard(state.currentBookingUrl).then(() => {
        showToast('📋 Link copied! Open in a private/incognito window.');
      });
    }
  });

  // ---- Price alerts ----
  dom.setAlertBtn.addEventListener('click', handleSetAlert);

  // ---- View toggles ----
  dom.listViewBtn.addEventListener('click', () => {
    dom.listViewBtn.classList.add('active');
    dom.calendarViewBtn.classList.remove('active');
    dom.resultsGrid.classList.remove('hidden');
    dom.calendarView.classList.add('hidden');
  });

  dom.calendarViewBtn.addEventListener('click', async () => {
    dom.calendarViewBtn.classList.add('active');
    dom.listViewBtn.classList.remove('active');
    dom.resultsGrid.classList.add('hidden');
    dom.calendarView.classList.remove('hidden');
    await renderCalendarView();
  });

  // ---- Keyboard shortcuts ----
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

// =============================================
// TRIP TYPE UI
// =============================================

function updateTripTypeUI() {
  const isRound = state.tripType === 'roundtrip';
  dom.returnDateGroup.classList.toggle('hidden', !isRound);
}

// =============================================
// COUNTER LOGIC
// =============================================

function updateCounter(type, value) {
  const limits = { adults: [1, 9], children: [0, 8] };
  const [min, max] = limits[type] || [0, 9];
  const clamped    = Math.max(min, Math.min(max, value));
  state[type]      = clamped;
  $(`${type}Count`).textContent = clamped;
}

// =============================================
// AIRPORT DROPDOWN
// =============================================

function showAirportDropdown(query, which) {
  const dropdown = which === 'origin' ? dom.originDropdown : dom.destDropdown;
  const input    = which === 'origin' ? dom.origin          : dom.destination;
  const matches  = searchAirports(query);

  if (!matches.length || query.length < 2) {
    dropdown.classList.add('hidden');
    return;
  }

  dropdown.innerHTML = matches.map(a => `
    <div class="airport-item" data-iata="${a.iata}" data-city="${a.city}">
      <span>${a.city} — ${a.name}</span>
      <span class="iata">${a.iata}</span>
    </div>
  `).join('');

  dropdown.classList.remove('hidden');

  dropdown.querySelectorAll('.airport-item').forEach(item => {
    item.addEventListener('click', () => {
      const iata = item.dataset.iata;
      const city = item.dataset.city;
      input.value = `${city} (${iata})`;

      if (which === 'origin') {
        state.origin = iata;
      } else {
        state.destination = iata;
      }
      dropdown.classList.add('hidden');
    });
  });
}

// Extract IATA from "City (XXX)" format or plain "XXX"
function extractIATA(str) {
  if (!str) return '';
  const match = str.match(/\(([A-Z]{3})\)/);
  if (match) return match[1];
  const clean = str.trim().toUpperCase();
  if (/^[A-Z]{3}$/.test(clean)) return clean;
  // Try to find by city name
  const found = AIRPORTS.find(a =>
    a.city.toLowerCase() === str.toLowerCase() ||
    a.name.toLowerCase() === str.toLowerCase()
  );
  return found ? found.iata : clean;
}

// =============================================
// SEARCH HANDLER
// =============================================

async function handleSearch(e) {
  e.preventDefault();

  const originRaw = dom.origin.value.trim();
  const destRaw   = dom.destination.value.trim();

  state.origin      = extractIATA(originRaw);
  state.destination = extractIATA(destRaw);
  state.departDate  = dom.departDate.value;
  state.returnDate  = dom.returnDate.value;
  state.cabinClass  = dom.cabinClass.value;

  if (!state.origin || !state.destination) {
    showToast('⚠️ Please enter valid origin and destination airports.');
    return;
  }
  if (state.origin === state.destination) {
    showToast('⚠️ Origin and destination cannot be the same!');
    return;
  }
  if (!state.departDate) {
    showToast('⚠️ Please select a departure date.');
    return;
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
  dom.resultsGrid.innerHTML = '';
  dom.siteStatuses.innerHTML = '';
  dom.progressBar.style.width = '0%';

  const originInfo = getAirportByIATA(state.origin);
  const destInfo   = getAirportByIATA(state.destination);
  dom.resultsTitle.textContent =
    `${originInfo ? originInfo.city : state.origin} → ${destInfo ? destInfo.city : state.destination}`;

  dom.loadingText.textContent =
    `Searching ${SEARCH_SITES.length}+ sites in private mode...`;

  // Scroll to results
  dom.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Disable search button
  dom.searchBtn.classList.add('loading');
  dom.searchBtn.querySelector('span').textContent = 'Searching...';
// Read dates DIRECTLY from the form inputs
// This avoids any state sync issues
  const rawDepart = dom.departDate.value;
  const rawReturn = dom.returnDate.value;
  
  console.log('Search dates from form:',
    'depart =', rawDepart,
    'return =', rawReturn
  );
  
  const searchParams = {
    origin:         state.origin,
    destination:    state.destination,
    departDate:     rawDepart,
    returnDate:     state.tripType === 'roundtrip' ? rawReturn : null,
    adults:         state.adults,
    children:       state.children,
    cabinClass:     state.cabinClass,
    tripType:       state.tripType,
    directOnly:     state.directOnly,
    checkedBaggage: state.checkedBaggage,
  };


  try {
    const results = await searchFlights(searchParams, handleSearchProgress);

    state.results = results;
    dom.loadingState.classList.add('hidden');
    dom.progressBar.style.width = '100%';

    renderResults();

    // Check alerts
    checkPriceAlerts(results);

  } catch (err) {
    console.error('Search error:', err);
    showToast('❌ Search failed. Please try again.');
    dom.loadingState.classList.add('hidden');
  }

  // Re-enable button
  dom.searchBtn.classList.remove('loading');
  dom.searchBtn.querySelector('span').textContent = 'Search All Sites (Private Mode)';
}

// =============================================
// SEARCH PROGRESS HANDLER
// =============================================

function handleSearchProgress(event) {
  if (event.type === 'progress') {
    dom.progressBar.style.width = `${event.percent}%`;
    dom.loadingText.textContent =
      `Searching... ${event.percent}% complete`;
    return;
  }

  if (event.type === 'status') {
    let el = document.querySelector(`.site-status[data-site="${event.siteId}"]`);

    if (!el) {
      el = document.createElement('div');
      el.className       = 'site-status';
      el.dataset.site    = event.siteId;
      dom.siteStatuses.appendChild(el);
    }

    const icons = { searching: '⏳', done: '✅', error: '❌' };
    el.className = `site-status ${event.status}`;
    el.textContent = `${icons[event.status] || ''} ${event.name}`;

    if (event.count) {
      el.textContent += ` (${event.count})`;
    }
  }
}

// =============================================
// RENDER RESULTS
// =============================================

function renderResults() {
  let filtered = [...state.results];

  if (!filtered.length) {
    dom.resultsGrid.innerHTML = `
      <div style="text-align:center;padding:2rem;color:var(--text-muted);">
        <i class="fas fa-search" style="font-size:2rem;margin-bottom:0.8rem;display:block;"></i>
        No results. Try searching again.
      </div>`;
    return;
  }

  dom.resultsGrid.innerHTML = filtered.map((r, idx) =>
    renderResultCard(r, idx)
  ).join('');

  dom.resultsGrid.querySelectorAll('.book-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const url  = decodeURIComponent(btn.dataset.url);
      const name = btn.dataset.site;
      openBookingModal(url, name);
    });
  });
}

// =============================================
// RESULT CARD HTML
// =============================================

// =============================================
// RESULT CARD — shows search links not fake prices
// =============================================

function renderResultCard(r, idx) {
  const params = r.params || {};
  const adults   = params.adults   || 1;
  const children = params.children || 0;
  const totalPax = adults + children;

  const siteDescriptions = {
    google_flights: 'Search across all airlines. See real prices, filter by stops, dates, airline. Best overall.',
    skyscanner:     'Compare prices from 100s of airlines and travel agents. Great price alerts.',
    kayak:          'Compares hundreds of travel sites at once. Has price forecast feature.',
    kiwi:           'Finds cheapest combinations. Great for flexible travel dates.',
    expedia:        'Book flights + hotel together for better deals.',
    momondo:        'Finds hidden deals from smaller booking sites.',
  };

  const desc = siteDescriptions[r.sourceId] || 'Compare flight prices';

  return `
    <div class="result-card site-card">
      <div class="site-card-left">
        <div class="site-icon-name">
          <span class="site-icon" style="font-size:1.5rem">${r.sourceIcon}</span>
          <div>
            <div class="site-name" style="font-weight:700;font-size:1rem;">
              ${r.source}
            </div>
            <div class="site-note" style="font-size:0.75rem;color:var(--text-muted);">
              ${r.sourceNote || ''}
            </div>
          </div>
        </div>
        <div class="site-desc" style="
          font-size:0.8rem;
          color:var(--text-secondary);
          margin-top:0.5rem;
          line-height:1.5;
        ">
          ${desc}
        </div>
        <div style="
          margin-top:0.6rem;
          font-size:0.75rem;
          color:var(--text-muted);
          display:flex;
          gap:1rem;
          flex-wrap:wrap;
        ">
          <span>✈ ${params.origin || ''} → ${params.destination || ''}</span>
          <span>📅 ${formatDateDisplay(params.departDate)}</span>
          <span>👤 ${totalPax} passenger${totalPax > 1 ? 's' : ''}</span>
          ${params.tripType === 'roundtrip'
            ? `<span>🔄 Return: ${formatDateDisplay(params.returnDate)}</span>`
            : '<span>➡ One way</span>'
          }
        </div>
      </div>

      <div class="site-card-right">
        <div style="
          font-size:0.75rem;
          color:var(--text-muted);
          text-align:center;
          margin-bottom:0.5rem;
        ">
          Opens with your<br/>search pre-filled
        </div>
        <button
          class="book-btn"
          data-url="${encodeURIComponent(r.bookingUrl)}"
          data-site="${r.source}"
          style="background:${r.sourceColor || 'var(--accent)'}"
        >
          <i class="fas fa-external-link-alt"></i>
          Search on ${r.source}
        </button>
        <div style="
          font-size:0.68rem;
          color:var(--text-muted);
          text-align:center;
          margin-top:0.4rem;
        ">
          🔒 Opens privately
        </div>
      </div>
    </div>
  `;
}
// =============================================
// BOOKING MODAL
// =============================================

function openBookingModal(encodedUrl, siteName) {
  const url = decodeURIComponent(encodedUrl);
  state.currentBookingUrl = url;

  dom.modalMessage.innerHTML = `
    Taking you to <strong>${siteName}</strong> to complete your booking.
    <br/><small style="color:var(--text-muted)">
      Tip: For maximum privacy, open this in your browser's incognito/private mode.
    </small>`;

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
  dom.calendarGrid.innerHTML = `
    <div style="text-align:center;padding:1rem;grid-column:1/-1;color:var(--text-muted);">
      <div class="spinner" style="width:30px;height:30px;margin:0 auto 0.5rem;"></div>
      Loading price calendar...
    </div>`;

  if (!state.origin || !state.destination) {
    dom.calendarGrid.innerHTML = `
      <p style="grid-column:1/-1;color:var(--text-muted);text-align:center;">
        Please search for a route first.
      </p>`;
    return;
  }

  const prices = await fetchCalendarPrices({
    origin:      state.origin,
    destination: state.destination,
    departDate:  state.departDate,
    cabinClass:  state.cabinClass,
  });

  const entries  = Object.entries(prices).sort((a,b) => a[0].localeCompare(b[0]));
  const minPrice = Math.min(...entries.map(([,v]) => v));

  // Day headers
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  dom.calendarGrid.innerHTML = days.map(d =>
    `<div style="text-align:center;font-size:0.72rem;color:var(--text-muted);font-weight:600;padding:0.25rem;">
      ${d}
    </div>`
  ).join('') +
  entries.map(([date, price]) => {
    const d          = new Date(date);
    const dayLabel   = d.toLocaleDateString('en-GB', { day:'2-digit', month:'short' });
    const isCheapest = price === minPrice;
    return `
      <div
        class="cal-cell ${isCheapest ? 'cheapest' : ''}"
        title="${date}: ${formatEUR(price)}"
        data-date="${date}"
        data-price="${price}"
      >
        <div class="cal-date">${dayLabel}</div>
        <div class="cal-price">${formatEUR(price)}</div>
        ${isCheapest ? '<div style="font-size:0.6rem;color:var(--success);">Cheapest</div>' : ''}
      </div>
    `;
  }).join('');

  // Click calendar cell to update search date
  dom.calendarGrid.querySelectorAll('.cal-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      const date = cell.dataset.date;
      dom.departDate.value = date;
      state.departDate = date;
      dom.listViewBtn.click();
      showToast(`📅 Date updated to ${formatDateDisplay(date)}`);
    });
  });
}

// =============================================
// POPULAR ROUTES
// =============================================

function renderPopularRoutes() {
  dom.popularRoutes.innerHTML = POPULAR_ROUTES.map(route => `
    <div class="route-card" data-from="${route.from}" data-to="${route.to}">
      <div class="route-from-to">${route.label}</div>
      <div class="route-price">from ${formatEUR(route.fromPrice)}</div>
      <div class="route-airline">✈ Multiple airlines</div>
    </div>
  `).join('');

  dom.popularRoutes.querySelectorAll('.route-card').forEach(card => {
    card.addEventListener('click', () => {
      const from = card.dataset.from;
      const to   = card.dataset.to;
      const fromAirport = getAirportByIATA(from);
      const toAirport   = getAirportByIATA(to);

      dom.origin.value      = fromAirport
        ? `${fromAirport.city} (${from})` : from;
      dom.destination.value = toAirport
        ? `${toAirport.city} (${to})` : to;

      state.origin      = from;
      state.destination = to;

      dom.form.scrollIntoView({ behavior: 'smooth' });
      showToast(`Route set: ${from} → ${to}`);
    });
  });
}

// =============================================
// PRICE ALERTS
// =============================================

function handleSetAlert() {
  const email = dom.alertEmail.value.trim();
  const price = parseFloat(dom.alertPrice.value);

  if (!email || !email.includes('@')) {
    showToast('⚠️ Please enter a valid email address.');
    return;
  }
  if (!price || price <= 0) {
    showToast('⚠️ Please enter a valid max price.');
    return;
  }
  if (!state.origin || !state.destination) {
    showToast('⚠️ Please search for a route first.');
    return;
  }

  const alert = {
    id:          generateId(),
    email,
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
  showToast(`🔔 Alert set! We'll notify ${email} when price drops below ${formatEUR(price)}`);
}

function renderAlerts() {
  if (!state.alerts.length) {
    dom.activeAlerts.innerHTML =
      `<small style="color:var(--text-muted)">No active alerts</small>`;
    return;
  }

  dom.activeAlerts.innerHTML = state.alerts.map(a => `
    <div class="alert-item">
      <span>
        <strong>${a.origin} → ${a.destination}</strong>
        · Max ${formatEUR(a.maxPrice)}
        · ${a.email}
      </span>
      <button class="remove-alert" data-id="${a.id}" title="Remove alert">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `).join('');

  dom.activeAlerts.querySelectorAll('.remove-alert').forEach(btn => {
    btn.addEventListener('click', () => {
      state.alerts = state.alerts.filter(a => a.id !== btn.dataset.id);
      Storage.set('priceAlerts', state.alerts);
      renderAlerts();
      showToast('Alert removed.');
    });
  });
}

function checkPriceAlerts(results) {
  if (!results.length || !state.alerts.length) return;

  const lowestPrice = Math.min(...results.map(r => r.price));

  state.alerts.forEach(alert => {
    if (
      alert.origin      === state.origin &&
      alert.destination === state.destination &&
      lowestPrice <= alert.maxPrice
    ) {
      showToast(
        `🔔 Price alert! Found ${formatEUR(lowestPrice)} — below your limit of ${formatEUR(alert.maxPrice)}`,
        5000
      );
    }
  });
}

// =============================================
// THEME
// =============================================

function setTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  Storage.set('theme', theme);

  const icon = dom.darkToggle.querySelector('i');
  icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// =============================================
// TOAST NOTIFICATIONS
// =============================================

let toastTimer;
function showToast(message, duration = 3000) {
  dom.toast.textContent = message;
  dom.toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    dom.toast.classList.add('hidden');
  }, duration);
}

// =============================================
// SERVICE WORKER (PWA)
// =============================================

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.warn('SW registration failed:', err));
  }
}

// =============================================
// INSTALL PROMPT (PWA)
// =============================================

let deferredInstallPrompt = null;

function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    dom.installBtn.classList.remove('hidden');
  });

  dom.installBtn.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') {
      showToast('✅ FlightHunt installed!');
      dom.installBtn.classList.add('hidden');
    }
    deferredInstallPrompt = null;
  });

  window.addEventListener('appinstalled', () => {
    showToast('✅ FlightHunt installed successfully!');
    dom.installBtn.classList.add('hidden');
    deferredInstallPrompt = null;
  });
}

// =============================================
// START
// =============================================

document.addEventListener('DOMContentLoaded', init);
