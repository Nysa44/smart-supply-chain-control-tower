# Data dictionary

| Field | Definition |
|---|---|
| id | Unique synthetic exception identifier |
| title | Short issue headline |
| sku | Illustrative stock keeping unit |
| partner | Supplier or logistics partner |
| location | Distribution centre / port location |
| due_date | Illustrative action due date in ISO format |
| category | Inventory, Supplier, or Shipment |
| units_affected | Approximate units/orders/pallets exposed; mixed units are illustrative |
| severity | Critical, High, Medium, Low |
| status | Open, In review, Resolved |
| delay_days | Illustrative delay estimate |
| recommended_action | Suggested next operational step |

All records are synthetic. `units_affected` deliberately represents a simplified impact measure across exception types, so it should not be aggregated as a physical inventory count in a real deployment.
