# Architecture and technical notes

- **Presentation:** static HTML and CSS in `prototype/`.
- **Client behavior:** vanilla JavaScript in `prototype/app.js`.
- **Demo records:** the exception and shipment fixtures are embedded in `app.js` for immediate offline operation; matching CSV source files are provided under `data/`.
- **State:** exception statuses persist in browser `localStorage`. Reset demo restores the initial state.
- **KPI calculation:** open/critical counts, affected units, category mix and on-time delivery are calculated from the fixture arrays at runtime.
- **Export:** exports currently filtered exception rows as CSV.
- **Hosting:** static assets can be served locally or published via GitHub Pages.
- **Security boundary:** no authentication, backend, live tracking or personal data. Do not connect this prototype to production systems without adding access control, server-side validation, audit logging and privacy/security review.
