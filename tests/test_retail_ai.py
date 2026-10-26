import sys
from pathlib import Path
import unittest
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"src"))
from retail_ai import recommend, forecast_demand, evaluate_forecast

class RetailAITests(unittest.TestCase):
    def test_recommendations_are_in_stock_and_not_previously_seen(self):
        result=recommend("U01",top_n=5)
        self.assertLessEqual(len(result),5)
        self.assertEqual(len(result.product_id),len(set(result.product_id)))
        self.assertTrue((result.score>0).all())
        import pandas as pd
        seen=set(pd.read_csv(ROOT/"data"/"interactions.csv").query("user_id == 'U01'").product_id)
        self.assertTrue(seen.isdisjoint(set(result.product_id)))
    def test_unknown_user_fails_clearly(self):
        with self.assertRaises(ValueError): recommend("UNKNOWN")
    def test_forecast_horizon_and_nonnegative_values(self):
        result=forecast_demand("P100",horizon=10)
        self.assertEqual(len(result),10)
        self.assertTrue((result.forecast_units>=0).all())
    def test_evaluation_metrics_are_finite(self):
        result=evaluate_forecast("P100")
        self.assertGreaterEqual(result["mae_units"],0)
        self.assertGreaterEqual(result["wape_pct"],0)
    def test_unknown_product_fails_clearly(self):
        with self.assertRaises(ValueError): forecast_demand("UNKNOWN")
if __name__=="__main__": unittest.main()
