import React, { useState, useEffect } from "react";
import { useParams} from "react-router-dom";
import api from "../services/api";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useAuth } from "../context/AuthContext";
import {
  LoadingState,
  EmptyState,
} from "../components/StatusComponents";
import { formatCurrency, calculateTrends } from "../utils/frontend-helpers";
import History from "./History";
import "./Product.css";

const Product = () => {

  const [form, setForm] = useState({targetPrice: ''});
const {accessToken} = useAuth() ;

  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const { pid } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [liveData, setLiveData] = useState(null);
  const [checkingLive, setCheckingLive] = useState(false);
  
  const fetchProduct = React.useCallback(async () => {
    try {
      const data = await api.getProductById(pid);
      if (data) {
        setProduct(data);
      }
    } catch (err) {
//         console.error("Product fetch error:", err);
        setAlertType("error");
        setMessage(
          err.message || "Failed to fetch product data"
        );
        setShowAlert(true);
    } finally {
      setLoading(false);
    }
  }, [pid]);

 const handleCreateAlert = async (event) => {
        event.preventDefault();

        if (!form.targetPrice) {
            setAlertType("error");
            setMessage("Please enter target price");
            setShowAlert(true);
            return;
        }

        try {
              await api.createAlert({pid,
                targetPrice: Number(form.targetPrice)
            }, accessToken);
            setForm({ targetPrice: '' });
            setAlertType("success");
            setMessage("Alert created successfully");
            setShowAlert(true);
            return;
        } catch (err) {
            setAlertType("error");
            setMessage(err.message || "Unable to create alert");
            setShowAlert(true);
        }
    };
  
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);
  
  const productURL = `https://www.amazon.in/dp/${pid}`;
  const handleLiveCheck = async () => {
    if (!product) return;
    setCheckingLive(true);
    try {
      const result = await api.checkLiveStatus(productURL);
      if (result.success) {
            const freshProductDetails = await api.getProductById(pid);
            setProduct(freshProductDetails);
            setLiveData(true);
          }
    } catch (err) {
        setAlertType("error");
      setMessage(
        "Live check failed. Amazon might be limiting requests."
      );
      setShowAlert(true);
    } finally {
      setCheckingLive(false);
    }
  }

  if (loading) return <LoadingState message="Loading product details..." />;

  if (!product) return <EmptyState message="Product not found" />;

  // Determine values to display (prefer live data if available)
  const displayPrice = liveData?.Price || product.price;
  const displayOriginalPrice = liveData?.MRP || product.mrp;
  const stats = calculateTrends(product.graph_data);
  const averagePrice = product.graph_data && product.graph_data.length > 0
    ? product.graph_data.reduce((sum, item) => sum + Number(item.min_price || 0), 0) / product.graph_data.length
    : 0; // Default to 0 if there is no history data yet

  // Intelligence Data
  const { buySignal, predictedDrop } = product.intelligence || {};
  
  return (
    <div className="product-container">
      {/* Flattened Header */}
      <div className="product-header">
        {/* Image Section */}
        <div className="product-image-container">
          <img
            src={product.imgurl}
            alt={product.title}
            className="product-image"
          />
        </div>

        {/* Info Section */}
        <div className="product-info">
          {liveData && (
            <div className="live-indicator">
              <span style={{ fontSize: "1.2em" }}>●</span> Live Update
            </div>
          )}

          {buySignal && (
            <div style={{ marginBottom: "0.5rem" }}>
              <span
                className={`badge ${
                  buySignal === "STRONG_BUY" || buySignal === "BUY"
                    ? "badge-success"
                    : buySignal === "WAIT"
                    ? "badge-warning"
                    : "badge-danger"
                }`}
              >
                {buySignal.replace("_", " ")}
              </span>
            </div>
          )}

          <h1 className="product-title">{product.title}</h1>

          {/* Dominant Price */}
          <div className="price-block">
            <div className="current-price">
              {displayPrice ? formatCurrency(displayPrice) : "---"}
              {product.discount > 0 && (
                <span className="discount-badge">-{product.discount}%</span>
              )}
            </div>
            {displayOriginalPrice && (
              <div className="mrp-price">
                MRP: {formatCurrency(displayOriginalPrice)}
              </div>
            )}
            <div className="text-helper" style={{ marginTop: "0.5rem" }}>
              {liveData ? "Live price from Amazon" : "Last tracked price"}
            </div>
          </div>

          {/* Intelligence Strip */}
          <div className="intelligence-strip">
            <div className="intel-item">
              <span className="intel-label">Minimum</span>
              <span className="intel-value">{formatCurrency(stats.min)}</span>
            </div>
            <div className="intel-item">
              <span className="intel-label">Average</span>
              <span className="intel-value">
                {formatCurrency(averagePrice)}
              </span>
            </div>
            <div className="intel-item">
              <span className="intel-label">Maximum</span>
              <span className="intel-value">{formatCurrency(stats.max)}</span>
            </div>
            <div className="intel-item">
              <span className="intel-label">Trend</span>
              <span
                className="intel-value"
                style={{
                  color: predictedDrop
                    ? "var(--success-color)"
                    : "var(--text-muted)",
                }}
              >
                {predictedDrop ? "Dropping" : "Stable"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
                <div className="action-bar">
                  {product.pid && (
                    <a
                      href={productURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      View on Amazon ↗
                    </a>
                  )}

                  <button
                    onClick={handleLiveCheck}
                    disabled={checkingLive}
                    className="btn-secondary"
                  >
                    {checkingLive ? "Checking..." : "Check Live"}
                  </button>
                   <form className="alert-form" onSubmit={handleCreateAlert}>
                       <input
                          type="number"
                          placeholder="Target price"
                          required
                          value={form.targetPrice}
                          onChange={(event) => setForm(prev => ({ ...prev, targetPrice: event.target.value }))}
                          className="alert-input"
                          min="0"
                          />
                      <button type="submit" className="btn-primary">Set Alert</button>
                   </form>
                </div>

      <div style={{ marginTop: "2.5rem" }}>
        <History history={product.graph_data} />
      </div>

      <Snackbar
        open={showAlert}
        autoHideDuration={3000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={() => setShowAlert(false)}
          severity={alertType}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>
      </div>
  );
};

export default Product;
