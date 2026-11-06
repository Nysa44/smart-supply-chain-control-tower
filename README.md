# Smart Supply Chain Control Tower

An interactive, responsive supply-chain operations dashboard built with HTML, CSS and JavaScript. It demonstrates KPI calculation, exception prioritisation, searchable/filterable records, workflow status changes, local persistence and CSV export.

## Demo features
- KPI calculations from a synthetic exception/shipment dataset.
- Open exception and critical exception counts.
- On-time delivery calculated from delivered shipments only.
- Units-affected exposure for unresolved exceptions.
- Exception mix chart and severity-first priority queue.
- Search by exception ID, SKU, partner, location or category.
- Filter by severity, status and category.
- Detail dialog with recommended next action.
- Status updates persisted in browser local storage.
- Export filtered records to CSV and reset the demo.
- Responsive layout and GitHub Pages deployment workflow.

## Run locally
No build process or dependencies are required. Open `prototype/index.html` in a modern browser, or run:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000/prototype/`.

## Test
Requires Node.js 18+:
```bash
npm test
```

## Project structure
```text
prototype/          Interactive web application
data/               Synthetic CSV fixtures
tests/              Node.js built-in test suite
docs/               Architecture, user flows, data dictionary and QA plan
.github/workflows/  GitHub Pages deployment workflow
```

## Metric definitions
- **Open exceptions:** records whose status is not `Resolved`.
- **Critical exceptions:** unresolved records with severity `Critical`.
- **On-time delivery:** delivered sample shipments whose actual arrival date is on or before planned arrival, divided by all delivered sample shipments.
- **Units affected:** sum of `units_affected` across unresolved exceptions. This is a simplified demo exposure measure and mixes operational units across issue types; it is not a literal inventory total.


## License
MIT.
