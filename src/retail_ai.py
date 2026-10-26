"""Transparent retail AI portfolio demos: content-based recommendation and baseline demand forecast."""
from pathlib import Path
import argparse
import pandas as pd
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
OUT = ROOT / "outputs"

def load_products(path=DATA/"products.csv"):
    df = pd.read_csv(path)
    required={"product_id","product_name","category","tags","price_aed","rating","in_stock","eco_material","high_performance","recommendable"}
    missing=required-set(df.columns)
    if missing: raise ValueError(f"Product data missing columns: {sorted(missing)}")
    return df

def recommend(user_id, top_n=5, products_path=DATA/"products.csv", interactions_path=DATA/"interactions.csv"):
    """Rank unseen in-stock items by profile category/tag affinity, quality and a small stock bonus.
    This is a transparent content-based demo, not a trained production recommender.
    """
    products=load_products(products_path)
    interactions=pd.read_csv(interactions_path)
    if user_id not in set(interactions.user_id):
        raise ValueError(f"Unknown demo user {user_id}. Choose one of: {sorted(interactions.user_id.unique())}")
    user_history=interactions[interactions.user_id==user_id].merge(products,on="product_id",how="left")
    seen=set(user_history.product_id)
    category_affinity=user_history.groupby("category")["rating_x"].mean().to_dict()
    tag_affinity={}
    for _,row in user_history.iterrows():
        for tag in str(row.tags).split("|"):
            tag_affinity[tag]=max(tag_affinity.get(tag,0),float(row.rating_x))
    candidates=products[(~products.product_id.isin(seen))&(products.in_stock==1)&(products.recommendable==1)].copy()
    def score(row):
        cat=category_affinity.get(row.category,3.0)
        tag=max([tag_affinity.get(t,3.0) for t in str(row.tags).split("|")],default=3.0)
        # Scales are explicit and interpretable: category 50%, tag 25%, rating 20%, stock 5%.
        return 0.50*cat + 0.25*tag + 0.20*float(row.rating) + 0.05*5.0
    candidates["score"]=candidates.apply(score,axis=1)
    candidates["reason"]=candidates.apply(lambda r: "Matches categories and interests in your rated items" if r.category in category_affinity else f"Explore {r.category.lower()} selected for high customer rating",axis=1)
    return candidates.sort_values(["score","rating"],ascending=False).head(top_n)[["product_id","product_name","category","price_aed","rating","score","reason"]].reset_index(drop=True)

def forecast_demand(product_id, horizon=7, data_path=DATA/"daily_demand.csv"):
    """Simple moving-average baseline with a linear trend on the most recent 28 days.
    Returns forecasts only; it is not a production time-series model.
    """
    data=pd.read_csv(data_path,parse_dates=["date"])
    hist=data[data.product_id==product_id].sort_values("date")
    if hist.empty: raise ValueError(f"No demand history for product {product_id}")
    y=hist.units_sold.astype(float).to_numpy()
    window=min(28,len(y)); recent=y[-window:]
    x=np.arange(window,dtype=float)
    slope,intercept=np.polyfit(x,recent,1) if window>=2 else (0.0,float(recent[-1]))
    # Damp trend to avoid implausible extrapolation from a short synthetic history.
    slope=float(np.clip(slope,-0.25,0.25))
    base=float(np.mean(recent[-7:]))
    forecasts=[]
    for step in range(1,horizon+1):
        prediction=max(0.0,base+slope*step)
        forecasts.append({"product_id":product_id,"period_ahead_days":step,"forecast_units":round(prediction,2),"baseline_7d_avg":round(base,2),"trend_units_per_day":round(slope,3)})
    return pd.DataFrame(forecasts)

def evaluate_forecast(product_id, data_path=DATA/"daily_demand.csv", test_days=14):
    """Rolling-origin naive baseline evaluation using last test_days vs prior 7-day mean."""
    data=pd.read_csv(data_path,parse_dates=["date"])
    hist=data[data.product_id==product_id].sort_values("date")
    if len(hist)<=test_days+7: raise ValueError("Not enough observations for selected test window")
    y=hist.units_sold.astype(float).to_numpy()
    actual=y[-test_days:]
    train=y[:-test_days]
    prediction=np.repeat(np.mean(train[-7:]),test_days)
    mae=float(np.mean(np.abs(actual-prediction)))
    wape=float(np.sum(np.abs(actual-prediction))/max(1.0,np.sum(np.abs(actual)))*100)
    return {"product_id":product_id,"test_days":test_days,"mae_units":round(mae,3),"wape_pct":round(wape,2),"baseline":"Mean demand over preceding 7 training days"}

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--user",default="U01",help="Demo user ID, e.g. U01")
    parser.add_argument("--top-n",type=int,default=5)
    parser.add_argument("--product",default="P100",help="Product ID for demand forecast")
    parser.add_argument("--horizon",type=int,default=7)
    args=parser.parse_args()
    OUT.mkdir(exist_ok=True)
    recs=recommend(args.user,args.top_n)
    recs.to_csv(OUT/"recommendations.csv",index=False)
    forecast=forecast_demand(args.product,args.horizon)
    forecast.to_csv(OUT/"demand_forecast.csv",index=False)
    metrics=evaluate_forecast(args.product)
    pd.DataFrame([metrics]).to_csv(OUT/"forecast_evaluation.csv",index=False)
    print(f"Recommendations for {args.user}:\n{recs.to_string(index=False)}")
    print(f"\nDemand forecast for {args.product}:\n{forecast.to_string(index=False)}")
    print(f"\nBaseline holdout evaluation: {metrics}")

if __name__=="__main__":
    main()
