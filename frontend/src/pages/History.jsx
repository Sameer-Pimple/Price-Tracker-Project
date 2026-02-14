import React from "react";
import PriceChart from "../components/PriceChart";
import { EmptyState } from "../components/StatusComponents";
import { formatCurrency, calculateTrends } from "../utils/frontend-helpers";
import "./History.css";

const History = ({ history}) => {
  if (!history || history.length === 0) {
    return <EmptyState message="No price history available yet." />;
  }

  const stats = calculateTrends(history);

  const averagePrice =
    history.reduce((sum, item) => sum + Number(item.min_price), 0) / history.length;

  return (
   
      <div className="chart-section">
        {history.length < 2 ? (
          <EmptyState message="Not enough data for chart." />
        ) : (
          <PriceChart priceHistory={history} />
        )}
      </div>
  );
};

export default History;
