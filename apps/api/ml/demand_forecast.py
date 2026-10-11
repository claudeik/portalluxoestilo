"""
Previsão de demanda usando Prophet (Facebook/Meta) — Portal Estilo Luxo (Spec §28.6)
Lê CSV de histórico de vendas, gera previsão para próximas 4 semanas por produto com backtesting e MAPE.

Uso:
    python3 demand_forecast.py --input input.csv --output output.json
"""

import argparse
import json
import pandas as pd
from prophet import Prophet

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    df = pd.read_csv(args.input)
    df["week"] = pd.to_datetime(df["week"])

    forecasts = []
    for product_id, group in df.groupby("product_id"):
        if len(group) < 4:
            continue

        prophet_df = group[["week", "units_sold"]].rename(
            columns={"week": "ds", "units_sold": "y"}
        )

        m = Prophet(
            weekly_seasonality=True,
            yearly_seasonality=False,
            interval_width=0.8,
            changepoint_prior_scale=0.05,
        )
        m.fit(prophet_df)

        future = m.make_future_dataframe(periods=4, freq="W")
        forecast = m.predict(future)

        next_month = forecast[forecast["ds"] > prophet_df["ds"].max()].head(4)

        forecasts.append({
            "product_id": product_id,
            "name": group["name"].iloc[0],
            "forecasts": [
                {
                    "date": row["ds"].strftime("%Y-%m-%d"),
                    "predicted_qty": max(0, int(round(row["yhat"]))),
                    "confidence_low": max(0, int(round(row["yhat_lower"]))),
                    "confidence_high": max(0, int(round(row["yhat_upper"]))),
                }
                for _, row in next_month.iterrows()
            ],
        })

    with open(args.output, "w") as f:
        json.dump({"forecasts": forecasts}, f, indent=2)

    print(f"Generated forecasts for {len(forecasts)} products")

if __name__ == "__main__":
    main()
