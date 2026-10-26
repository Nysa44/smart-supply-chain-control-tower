# Validation record

## Executed checks
- Demo command exit code: 0
- Python unit test exit code: 0

### Demo output
```text
Recommendations for U01:
product_id           product_name    category  price_aed  rating  score                                                reason
      P115     Thermal Base Layer     Apparel        129     4.6   4.17  Matches categories and interests in your rated items
      P108      Everyday Sneakers    Footwear        199     4.4   3.63    Explore footwear selected for high customer rating
      P105 Minimal Leather Wallet Accessories        119     4.2   3.59 Explore accessories selected for high customer rating
      P111      Reusable Tote Bag Accessories         25     4.1   3.57 Explore accessories selected for high customer rating
      P104 Insulated Water Bottle Accessories         89     4.7   3.44 Explore accessories selected for high customer rating

Demand forecast for P100:
product_id  period_ahead_days  forecast_units  baseline_7d_avg  trend_units_per_day
      P100                  1           28.11            28.14               -0.032
      P100                  2           28.08            28.14               -0.032
      P100                  3           28.05            28.14               -0.032
      P100                  4           28.02            28.14               -0.032
      P100                  5           27.98            28.14               -0.032
      P100                  6           27.95            28.14               -0.032
      P100                  7           27.92            28.14               -0.032

Baseline holdout evaluation: {'product_id': 'P100', 'test_days': 14, 'mae_units': 2.214, 'wape_pct': 7.93, 'baseline': 'Mean demand over preceding 7 training days'}

Spreadsheet runtime warmup failed during python startup
Traceback (most recent call last):
  File "/tmp/tmp.QlpUkOUI9D/artifact_tool_v2-2.8.66/artifact_tool/patches/warm_spreadsheet_runtime_on_startup.py", line 26, in warm_spreadsheet_runtime_on_startup
  File "/tmp/tmp.QlpUkOUI9D/artifact_tool_v2-2.8.66/artifact_tool/spreadsheet_warmup.py", line 785, in warm_spreadsheet_runtime
  File "/tmp/tmp.QlpUkOUI9D/artifact_tool_v2-2.8.66/artifact_tool/spreadsheet_warmup.py", line 718, in _warm_feature_flows
  File "/tmp/tmp.QlpUkOUI9D/artifact_tool_v2-2.8.66/artifact_tool/spreadsheet_warmup.py", line 509, in _warm_drawing_and_image_flows
  File "/tmp/tmp.QlpUkOUI9D/artifact_tool_v2-2.8.66/artifact_tool/generated/interface/models.py", line 32861, in bring_to_front
  File "/tmp/tmp.QlpUkOUI9D/artifact_tool_v2-2.8.66/artifact_tool/rpc/remote.py", line 764, in __call__
  File "/tmp/tmp.QlpUkOUI9D/artifact_tool_v2-2.8.66/artifact_tool/rpc/client.py", line 175, in call
artifact_tool.rpc.client.RemoteError: Element ordering requires an owning element collection.

```

### Unit test output
```text

Spreadsheet runtime warmup failed during python startup
Traceback (most recent call last):
  File "/tmp/tmp.QlpUkOUI9D/artifact_tool_v2-2.8.66/artifact_tool/patches/warm_spreadsheet_runtime_on_startup.py", line 26, in warm_spreadsheet_runtime_on_startup
  File "/tmp/tmp.QlpUkOUI9D/artifact_tool_v2-2.8.66/artifact_tool/spreadsheet_warmup.py", line 785, in warm_spreadsheet_runtime
  File "/tmp/tmp.QlpUkOUI9D/artifact_tool_v2-2.8.66/artifact_tool/spreadsheet_warmup.py", line 718, in _warm_feature_flows
  File "/tmp/tmp.QlpUkOUI9D/artifact_tool_v2-2.8.66/artifact_tool/spreadsheet_warmup.py", line 509, in _warm_drawing_and_image_flows
  File "/tmp/tmp.QlpUkOUI9D/artifact_tool_v2-2.8.66/artifact_tool/generated/interface/models.py", line 32861, in bring_to_front
  File "/tmp/tmp.QlpUkOUI9D/artifact_tool_v2-2.8.66/artifact_tool/rpc/remote.py", line 764, in __call__
  File "/tmp/tmp.QlpUkOUI9D/artifact_tool_v2-2.8.66/artifact_tool/rpc/client.py", line 175, in call
artifact_tool.rpc.client.RemoteError: Element ordering requires an owning element collection.
test_evaluation_metrics_are_finite (test_retail_ai.RetailAITests.test_evaluation_metrics_are_finite) ... ok
test_forecast_horizon_and_nonnegative_values (test_retail_ai.RetailAITests.test_forecast_horizon_and_nonnegative_values) ... ok
test_recommendations_are_in_stock_and_not_previously_seen (test_retail_ai.RetailAITests.test_recommendations_are_in_stock_and_not_previously_seen) ... ok
test_unknown_product_fails_clearly (test_retail_ai.RetailAITests.test_unknown_product_fails_clearly) ... ok
test_unknown_user_fails_clearly (test_retail_ai.RetailAITests.test_unknown_user_fails_clearly) ... ok

----------------------------------------------------------------------
Ran 5 tests in 0.019s

OK

```

The test suite checks recommendation exclusions, invalid user handling, forecast horizon/non-negative output, finite evaluation metrics and invalid product handling. The project uses synthetic data and is a portfolio proof of concept, not a production AI service.
