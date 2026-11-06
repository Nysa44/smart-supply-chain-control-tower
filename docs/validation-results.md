# Validation record

## Static checks
- Node executable available: yes
- Test command: `npm test`
- Result:
```
Node.js test exit code: 0
TAP version 13
# Subtest: prototype contains all primary KPI targets
ok 1 - prototype contains all primary KPI targets
  ---
  duration_ms: 0.893657
  type: 'test'
  ...
# Subtest: prototype implements search, filters, status actions and export
ok 2 - prototype implements search, filters, status actions and export
  ---
  duration_ms: 0.193
  type: 'test'
  ...
# Subtest: CSV has a header and 12 synthetic exception rows
ok 3 - CSV has a header and 12 synthetic exception rows
  ---
  duration_ms: 0.266652
  type: 'test'
  ...
# Subtest: prototype has no production API credentials or endpoints
ok 4 - prototype has no production API credentials or endpoints
  ---
  duration_ms: 0.482317
  type: 'test'
  ...
1..4
# tests 4
# suites 0
# pass 4
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 61.021766


```

## Manual browser QA
Not run in a real browser in this build environment. Follow `docs/test-plan.md` before calling the app fully browser-tested.
