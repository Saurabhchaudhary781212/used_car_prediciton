import React, { useMemo, useState } from "react";
import axios from "axios";
import {
  CarFront,
  Gauge,
  Fuel,
  Settings2,
  CalendarDays,
  ShieldCheck,
  KeyRound,
  IndianRupee,
  RotateCcw,
  Sparkles,
  ArrowRight
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

const initialForm = {
  brand: "",
  model: "",
  transmission: "Manual",
  make_year: 2021,
  fuel_type: "Petrol",
  engine_capacity: 1500,
  km_driven: 30000,
  ownership: "1st owner",
  has_insurance: true,
  spare_key: "Yes"
};

const brands = [
  "Maruti", "Hyundai", "Tata", "Mahindra", "Honda", "Toyota",
  "Ford", "Kia", "Volkswagen", "Renault", "Skoda", "Nissan",
  "MG", "Jeep", "BMW", "Mercedes-Benz", "Audi"
];

function formatINR(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function Field({ label, icon: Icon, children, hint }) {
  return (
    <label className="field">
      <span className="field-label">
        <span className="field-name"><Icon size={16} />{label}</span>
        {hint && <span className="hint">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const age = useMemo(
    () => Math.max(0, new Date().getFullYear() - Number(form.make_year || 0)),
    [form.make_year]
  );

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    setForm(initialForm);
    setPrediction(null);
    setError("");
  };

  async function predictPrice(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPrediction(null);

    const payload = {
      brand: form.brand,
      model: form.model,
      transmission: form.transmission,
      make_year: Number(form.make_year),
      fuel_type: form.fuel_type,
      "engine_capacity(CC)": Number(form.engine_capacity),
      km_driven: Number(form.km_driven),
      ownership: form.ownership,
      has_insurance: Boolean(form.has_insurance),
      spare_key: form.spare_key
    };

    try {
      const response = await axios.post(`${API_URL}/predict`, payload);
      const price =
        response.data?.predicted_price ??
        response.data?.price ??
        response.data?.prediction;

      if (price === undefined) {
        throw new Error("The API response does not contain predicted_price.");
      }

      setPrediction(Number(price));
    } catch (err) {
      const apiMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message;

      setError(
        `Prediction request failed. Make sure the Flask API is running at ${API_URL}. ${apiMessage}`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><CarFront size={22} /></div>
          <div>
            <strong>AutoValue</strong>
            <span>Used Car Price Predictor</span>
          </div>
        </div>
        <div className="model-pill">
          <Sparkles size={15} />
          Random Forest Model
        </div>
      </header>

      <main className="page">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">AI-POWERED ESTIMATION</span>
            <h1>Know what your<br /><span>used car is worth.</span></h1>
            <p>
              Enter the car details below and get an estimated resale price
              based on the trained car-price prediction model.
            </p>

            <div className="hero-stats">
              <div><strong>92.38%</strong><span>R² score</span></div>
              <div><strong>₹62.9K</strong><span>Mean absolute error</span></div>
              <div><strong>2,806</strong><span>Dataset records</span></div>
            </div>
          </div>

          <div className="hero-car">
            <div className="glow"></div>
            <CarFront size={150} strokeWidth={1.1} />
            <div className="hero-car-caption">PRE-OWNED VEHICLES</div>
          </div>
        </section>

        <section className="content-grid">
          <form className="card form-card" onSubmit={predictPrice}>
            <div className="card-heading">
              <div>
                <span className="section-kicker">CAR DETAILS</span>
                <h2>Tell us about the vehicle</h2>
              </div>
              <button type="button" className="reset-btn" onClick={reset}>
                <RotateCcw size={15} /> Reset
              </button>
            </div>

            <div className="form-section">
              <h3><CarFront size={17} /> Basic information</h3>
              <div className="form-grid">
                <Field label="Brand" icon={CarFront}>
                  <select value={form.brand} onChange={(e) => update("brand", e.target.value)} required>
                    <option value="">Select brand</option>
                    {brands.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </Field>

                <Field label="Model" icon={CarFront} hint="e.g. City, Fortuner">
                  <input
                    value={form.model}
                    onChange={(e) => update("model", e.target.value)}
                    placeholder="Enter model"
                    required
                  />
                </Field>

                <Field label="Manufacturing year" icon={CalendarDays}>
                  <input
                    type="number"
                    min="1990"
                    max={new Date().getFullYear()}
                    value={form.make_year}
                    onChange={(e) => update("make_year", e.target.value)}
                    required
                  />
                </Field>

                <Field label="Transmission" icon={Settings2}>
                  <select value={form.transmission} onChange={(e) => update("transmission", e.target.value)}>
                    <option>Manual</option>
                    <option>Automatic</option>
                  </select>
                </Field>
              </div>
            </div>

            <div className="form-section">
              <h3><Gauge size={17} /> Performance & usage</h3>
              <div className="form-grid">
                <Field label="Fuel type" icon={Fuel}>
                  <select value={form.fuel_type} onChange={(e) => update("fuel_type", e.target.value)}>
                    <option>Petrol</option>
                    <option>Diesel</option>
                    <option>CNG</option>
                    <option>Electric</option>
                    <option>Hybrid</option>
                  </select>
                </Field>

                <Field label="Engine capacity" icon={Gauge} hint="CC">
                  <input
                    type="number"
                    min="500"
                    max="10000"
                    value={form.engine_capacity}
                    onChange={(e) => update("engine_capacity", e.target.value)}
                    required
                  />
                </Field>

                <Field label="Kilometres driven" icon={Gauge} hint="km">
                  <input
                    type="number"
                    min="0"
                    value={form.km_driven}
                    onChange={(e) => update("km_driven", e.target.value)}
                    required
                  />
                </Field>

                <Field label="Ownership" icon={KeyRound}>
                  <select value={form.ownership} onChange={(e) => update("ownership", e.target.value)}>
                    <option>1st owner</option>
                    <option>2nd owner</option>
                    <option>3rd owner</option>
                    <option>4th owner</option>
                    <option>5th owner</option>
                  </select>
                </Field>
              </div>
            </div>

            <div className="form-section last">
              <h3><ShieldCheck size={17} /> Condition & documents</h3>
              <div className="toggle-row">
                <div className="toggle-copy">
                  <ShieldCheck size={20} />
                  <div>
                    <strong>Insurance available</strong>
                    <span>Does the vehicle currently have insurance?</span>
                  </div>
                </div>
                <button
                  type="button"
                  className={`switch ${form.has_insurance ? "on" : ""}`}
                  onClick={() => update("has_insurance", !form.has_insurance)}
                  aria-label="Toggle insurance"
                >
                  <span></span>
                </button>
              </div>

              <div className="key-options">
                <span>Spare key available</span>
                <div className="segmented">
                  {["Yes", "No"].map((value) => (
                    <button
                      type="button"
                      key={value}
                      className={form.spare_key === value ? "active" : ""}
                      onClick={() => update("spare_key", value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button className="predict-btn" disabled={loading}>
              {loading ? "Calculating..." : "Predict car price"}
              {!loading && <ArrowRight size={19} />}
            </button>

            {error && <div className="error-box">{error}</div>}
          </form>

          <aside className="side-column">
            <div className={`card result-card ${prediction !== null ? "has-result" : ""}`}>
              <div className="result-top">
                <span className="section-kicker">ESTIMATED VALUE</span>
                <div className="rupee-icon"><IndianRupee size={19} /></div>
              </div>

              {prediction !== null ? (
                <>
                  <div className="price">{formatINR(prediction)}</div>
                  <p className="result-message">
                    Estimated resale value for your {form.brand} {form.model}.
                  </p>
                  <div className="result-meta">
                    <span>{form.make_year} model</span>
                    <span>{Number(form.km_driven).toLocaleString("en-IN")} km</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="empty-price">₹ —</div>
                  <p className="result-message">
                    Your prediction will appear here after you submit the car details.
                  </p>
                  <div className="waiting">
                    <span></span> Ready for prediction
                  </div>
                </>
              )}
            </div>

            <div className="card summary-card">
              <span className="section-kicker">CURRENT INPUT</span>
              <h3>Vehicle summary</h3>
              <div className="summary-list">
                <div><span>Vehicle</span><strong>{form.brand || "—"} {form.model || ""}</strong></div>
                <div><span>Age</span><strong>{age ? `${age} years` : "—"}</strong></div>
                <div><span>Engine</span><strong>{Number(form.engine_capacity || 0).toLocaleString("en-IN")} CC</strong></div>
                <div><span>Fuel</span><strong>{form.fuel_type}</strong></div>
                <div><span>Transmission</span><strong>{form.transmission}</strong></div>
              </div>
            </div>

            <div className="model-note">
              <Sparkles size={17} />
              <div>
                <strong>Model confidence</strong>
                <p>R² score of 0.9238 on the test set.</p>
              </div>
            </div>
          </aside>
        </section>
      </main>

      <footer>AutoValue · Used Car Price Prediction</footer>
    </div>
  );
}
