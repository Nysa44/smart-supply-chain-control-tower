# QA checklist

- [x] Automated static checks for KPI element IDs, interaction handlers, CSV fixture size and lack of embedded API credentials.
- [ ] Open the prototype in Chrome/Edge and verify initial dashboard rendering.
- [ ] Search `Polar Freight` and confirm the temperature-excursion record remains.
- [ ] Filter severity to `Critical`, then status to `Open`.
- [ ] Open details and mark an exception `In review`; reload and verify local persistence.
- [ ] Mark a critical exception resolved and verify open/critical KPI values recalculate.
- [ ] Export the currently filtered CSV and verify row count.
- [ ] Click Reset demo and verify original fixture restored.
- [ ] Resize viewport to mobile width and confirm horizontal table scrolling.
- [ ] Keyboard-test filters, buttons, dialog close and focus order.

Automated checks do not replace browser QA; complete the manual checklist before describing this as fully tested.
