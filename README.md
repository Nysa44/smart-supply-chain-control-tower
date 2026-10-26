# Retail Reimagined — AI Innovation & Customer Experience

A retail AI strategy portfolio with an editable five-slide PowerPoint, research brief, customer-journey design, KPI framework, implementation roadmap, and a runnable Python proof of concept.

## What's technically included
- **Content-based product recommender:** ranks unseen, in-stock products from synthetic user ratings and product attributes with interpretable scoring.
- **Demand forecasting baseline:** forecasts the next N days from a recent moving average and damped linear trend.
- **Holdout evaluation:** evaluates a simple 7-day-mean baseline using MAE and WAPE on the last 14 observations.
- **Editable strategy deck:** `presentation/Retail_Reimagined_AI_Innovation.pptx`.
- **Research and governance:** customer journey, 90-day roadmap, KPI framework and source notes.

## Quick start
Python 3.10+ recommended.
```bash
python -m venv .venv
# Windows PowerShell: .venv\\Scripts\\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python src/retail_ai.py --user U01 --top-n 5 --product P100 --horizon 7
python -m unittest discover -s tests -v
```

Generated files are written to `outputs/`:
- `recommendations.csv`
- `demand_forecast.csv`
- `forecast_evaluation.csv`

## Data
All product, interaction and demand data is synthetic and included under `data/`. No customer data, API key or external service is required.

## Recommender methodology
The score is a transparent weighted combination of category affinity (50%), tag affinity (25%), product rating (20%) and stock availability (5%). Previously rated items and out-of-stock items are excluded. This simple proof of concept is intentionally interpretable and is not a production recommendation model.

## Forecast methodology
The baseline uses recent demand with a damped trend and reports MAE/WAPE for a naive holdout benchmark. For real deployment, compare against seasonal naive, exponential smoothing or a suitable forecasting model with rolling-origin backtests and inventory-cost evaluation.

## Presentation
Open `presentation/Retail_Reimagined_AI_Innovation.pptx` in PowerPoint or import it into Canva. The five-slide deck covers personalisation, predictive fulfilment, omnichannel experience and a 90-day pilot roadmap. It frames benefits as hypotheses rather than measured outcomes.

## Limitations
This is a learning/portfolio proof of concept, not a production AI service. It does not use deep learning, live inventory, customer identity, real-time events or production-grade evaluation. See `research/industry_research_brief.md` and `research/sources.md`.

## License
MIT.
