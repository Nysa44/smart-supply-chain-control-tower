# Smart Supply Chain Control Tower

A functional, browser-based supply chain operations dashboard built with HTML, CSS and vanilla JavaScript. No build step, package installation or API key is required.

## Design deliverables
- Figma Design: https://www.figma.com/design/OgwIkvzDkkPsf1AZ16atAf
- PowerPoint case study: `smart-supply-chain-control-tower-presentation.pptx`
  
## Run locally
1. Download and unzip the project.
2. Open `index.html` in a modern browser.
3. Use the left navigation to explore the dashboard.

For a local development server, run `python -m http.server 8000` from this folder and open `http://localhost:8000`.

## Features
- Executive overview with inventory health, supplier on-time rate, delayed shipments and open exceptions.
- Inventory table with SKU, location, on-hand stock, reorder points and value.
- Supplier scorecard with on-time rate, lead time and risk rating.
- Shipment tracker with origin, destination, ETA, mode and status.
- Exception management: add, edit, search, filter, resolve and reopen issues.
- Analytics view with operational trend and calculated roll-up metrics.
- CSV export for each data area.
- Browser localStorage persistence: edits remain after refresh on the same browser/device.
- Responsive layout for desktop, tablet and mobile.

## Data and assumptions
The initial dataset is realistic **sample/demo data**, not a live ERP, WMS, TMS or supplier feed. The performance trend chart is illustrative. The top-level KPI values shown in the overview are demo indicators; operational table counts and analytics roll-ups update when you edit records.

## Project structure
- `index.html` — application shell and page layout
- `styles.css` — responsive dashboard styling
- `app.js` — sample data, rendering, CRUD, filters, persistence and CSV export

