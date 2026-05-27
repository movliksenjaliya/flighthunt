# ✈️ FlightHunt

> Track and compare flight prices across all major booking sites.
> Europe & India focused. Works as a browser app AND installable PWA.
> All searches done in private mode.

---

## 🚀 Features

- 🔍 Searches 12+ booking sites simultaneously
- 🇪🇺 Optimized for Europe & India routes
- 🔒 Private mode searching — cookies cleared, no tracking
- 💶 All prices in Euro (€)
- 🔔 Price alerts with notifications
- 📅 Flexible dates with price calendar
- 📱 Installable as a phone/desktop app (PWA)
- 🌙 Dark/Light theme
- ✈️ Round trip, one-way, multi-city
- 🧳 Checked baggage toggle
- 🔌 Works offline (cached version)

---

## 📁 Project Structure
flighthunt/
├── index.html ← Main app shell
├── manifest.json ← PWA manifest
├── sw.js ← Service Worker (offline + push)
├── css/
│ └── style.css ← All styles (dark/light theme)
├── js/
│ ├── app.js ← Main app logic
│ ├── scrapers.js ← Price fetching + URL builders
│ └── utils.js ← Airport data, helpers, URL builders
---

## 🛠️ Setup

### Option 1 — Run Locally (Zero install)

```bash
# Clone the repo
git clone https://github.com/yourusername/flighthunt.git
cd flighthunt

# Serve with any static server
npx serve .
# OR
python3 -m http.server 8080
# OR
php -S localhost:8080**
