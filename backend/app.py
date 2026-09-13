from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib

app = Flask(__name__)
CORS(app)

# Load trained model
model = joblib.load("car_price_model.pkl")


@app.route("/")
def home():
    return jsonify({
        "message": "Used Car Price Prediction API is running"
    })


@app.route("/predict", methods=["POST"])
def predict():

    try:
        data = request.get_json()

        car = pd.DataFrame([{
            "brand": data["brand"],
            "model": data["model"],
            "transmission": data["transmission"],
            "make_year": float(data["make_year"]),
            "fuel_type": data["fuel_type"],
            "engine_capacity(CC)": float(data["engine_capacity(CC)"]),
            "km_driven": float(data["km_driven"]),
            "ownership": data["ownership"],
            "has_insurance": bool(data["has_insurance"]),
            "spare_key": data["spare_key"]
        }])

        predicted_price = model.predict(car)[0]

        return jsonify({
            "success": True,
            "predicted_price": round(float(predicted_price))
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 400


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )