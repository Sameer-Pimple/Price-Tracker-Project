import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "../components/StatusComponents";
import { formatCurrency, calculateTrends } from "../utils/frontend-helpers";
import History from "./History";
import "./Product.css";

const Product = () => {
  const { pid } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liveData, setLiveData] = useState(null);
  const [checkingLive, setCheckingLive] = useState(false);
  
  const fetchProduct = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProductById(pid);
      if (!data) {
        setError("Product not found.");
      } else {
        setProduct(data);
      }
    } catch (err) {
      console.error("Product fetch error:", err);
      setError(err.message || "Failed to fetch product data");
    } finally {
      setLoading(false);
    }
  }, [pid]);
  
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);
  
  const productURL = `https://www.amazon.in/dp/${pid}`;
  const handleLiveCheck = async () => {
    if (!product) return;
    setCheckingLive(true);
    try {
      const result = await api.checkLiveStatus(productURL);
      setLiveData(result);
    } catch (err) {
      alert(
        "Live check failed. Amazon might be limiting requests. Please try again later."
      );
    } finally {
      setCheckingLive(false);
    }
  };

  if (loading) return <LoadingState message="Loading product details..." />;

  if (error)
    return (
      <div>
        <ErrorState message={error} onRetry={fetchProduct} />
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button onClick={() => navigate("/")} className="btn-secondary">
            &larr; Back to Home
          </button>
        </div>
      </div>
    );

  if (!product) return <EmptyState message="Product not found" />;

  // Determine values to display (prefer live data if available)
  const displayPrice = liveData?.Price || product.price;
  const displayOriginalPrice = liveData?.MRP || product.mrp;
  const stats = calculateTrends(product.graph_data);
  const averagePrice =
    product.graph_data.reduce((sum, item) => sum + Number(item.min_price), 0) /
    product.graph_data.length;

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
              {liveData ? "Last tracked price" : "Live price from Amazon"}
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
          </div>
        </div>
      </div>

      <div style={{ marginTop: "2.5rem" }}>
        <History history={product.graph_data} />
      </div>
    </div>
  );
};

export default Product;
