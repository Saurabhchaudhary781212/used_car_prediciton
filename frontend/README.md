# AutoValue — Used Car Price Predictor UI

React + Vite frontend prepared for the car-price model in `car_prediciton.ipynb`.

## Model input fields

The notebook trains a `RandomForestRegressor` pipeline using:
- brand
- model
- transmission
- make_year
- fuel_type
- engine_capacity(CC)
- km_driven
- ownership
- has_insurance
- spare_key

The target is `price`.

## API contract expected by this UI

Start your Flask API on port 5000 and expose:

POST /predict

Request JSON:
{
  "brand": "Toyota",
  "model": "Fortuner",
  "transmission": "Automatic",
  "make_year": 2021,
  "fuel_type": "Diesel",
  "engine_capacity(CC)": 2755,
  "km_driven": 30000,
  "ownership": "1st owner",
  "has_insurance": true,
  "spare_key": "Yes"
}

Response JSON:
{
  "predicted_price": 1562640
}

The UI also accepts `price` or `prediction` as the response key.

## Run

1. Install Node.js.
2. Open this folder in terminal.
3. Run `npm install`
4. Copy `.env.example` to `.env` if needed.
5. Run `npm run dev`

By default the UI calls `http://127.0.0.1:5000/predict`.

## Important

The uploaded Colab notebook is a trained ML workflow/model, not itself an HTTP backend. It saves `car_price_model.pkl`. A small Flask API wrapper is needed to connect this React UI to the saved model.
