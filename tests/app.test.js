const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const app = fs.readFileSync(path.join(__dirname,"../prototype/app.js"),"utf8");
const html = fs.readFileSync(path.join(__dirname,"../prototype/index.html"),"utf8");
const data = fs.readFileSync(path.join(__dirname,"../data/exceptions.csv"),"utf8").trim().split(/\r?\n/);

test("prototype contains all primary KPI targets", () => {
  for (const id of ["k-open","k-critical","k-otd","k-units"]) assert.ok(html.includes(`id="${id}"`));
});
test("prototype implements search, filters, status actions and export", () => {
  for (const token of ["addEventListener(\"input\"","addEventListener(\"change\"","updateStatus(\"Resolved\")","supply-chain-exceptions.csv","localStorage"]) assert.ok(app.includes(token), token);
});
test("CSV has a header and 12 synthetic exception rows", () => {
  assert.equal(data.length,13);
  assert.match(data[0],/id,title,sku,partner/);
});
test("prototype has no production API credentials or endpoints", () => {
  assert.doesNotMatch(app,/api[_-]?key\s*[:=]\s*["'][^"']+/i);
  assert.doesNotMatch(app,/https?:\/\/(?!fonts\.googleapis\.com)[^\s"']+\/api\//i);
});
