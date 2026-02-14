import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import React, { useState, useMemo } from "react";
import "chartjs-adapter-date-fns";

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const customTooltip = (context) => {
  const { chart, tooltip } = context;

  let tooltipEl = document.getElementById("custom-tooltip");

  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.id = "custom-tooltip";
    tooltipEl.style.position = "absolute";
    tooltipEl.style.pointerEvents = "none";
    tooltipEl.style.transition = "all .1s ease";

    document.body.appendChild(tooltipEl);
  }

  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  const dataPoint = tooltip.dataPoints[0];
  const date = new Date(dataPoint.raw.x);
  const price = dataPoint.raw.y;

  tooltipEl.innerHTML = `
  <div style="
    background: #ffffff;
    padding: 14px 16px;
    border-radius: 14px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    min-width: 150px;
    font-family: Inter, sans-serif;
  ">

    <div style="display:flex; align-items:center; gap:6px; margin-bottom:8px;">
      <div style="width:8px; height:8px; background:#2563eb; border-radius:2px;"></div>
      <span style="font-weight:600; font-size:14px; color:#374151;">
        Current Store
      </span>
    </div>

    <div style="font-size:11px; color:#9CA3AF; letter-spacing:0.5px;">
      DATE
    </div>
    <div style="font-weight:500; font-size:14px; color:#1F2937; margin-bottom:6px;">
      ${date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}
    </div>

    <div style="font-size:11px; color:#9CA3AF; letter-spacing:0.5px;">
      PRICE
    </div>
    <div style="font-weight:600; font-size:15px;color:#111827;">
      ₹${price}
    </div>

  </div>
`;


  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = positionX + tooltip.caretX + "px";
  tooltipEl.style.top = positionY + tooltip.caretY + "px";
};


const PriceChart = ({ priceHistory }) => {

  const [timeFrame, setTimeFrame] = useState("45D");

  const filteredData = useMemo(() => {
    const now = new Date();
    let days = 0;

    if (timeFrame === "15D") days = 15;
    else if (timeFrame === "45D") days = 45;
    else if (timeFrame === "6M") days = 180;
    else return priceHistory;

    const cutoff = new Date();
    cutoff.setDate(now.getDate() - days);

    return priceHistory.filter((item) => {
      const itemDate = new Date(item.time);
      return itemDate >= cutoff;
    });
  }, [priceHistory, timeFrame]);
    
     if (!priceHistory || priceHistory.length === 0) {
       return <div>No price history available.</div>;
     }

  const data = {
    datasets: [
      {
        data: filteredData.map((item) => ({
          x: new Date(item.time),
          y: item.min_price,
        })),
        borderColor: "rgb(37, 99, 235)",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        tension: 0.3,
        pointRadius: 0,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Price History",
      },
      tooltip: {
        enabled: false, // disable default
        external: customTooltip,
      },
    },
    scales: {
      x: {
        type: "time",
        grid: { display: false },
      },
      y: {
        beginAtZero: false,
      },
    },
    };
    
    

  return (
    <>
      <div style={{ marginBottom: "20px" }}>
        {["15D", "45D", "6M", "ALL"].map((frame) => (
          <button
            key={frame}
            onClick={() => setTimeFrame(frame)}
            style={{
              marginRight: "10px",
              padding: "6px 12px",
              borderRadius: "20px",
              border:
                timeFrame === frame
                  ? "2px solid #2563eb"
                  : "1px solid #ccc",
              background:
                timeFrame === frame ? "#2563eb" : "#fff",
              color:
                timeFrame === frame ? "#fff" : "#000",
              cursor: "pointer",
            }}
          >
            {frame === "ALL" ? "All Time" : frame}
          </button>
        ))}
      </div>

      <Line options={options} data={data} />
    </>
  );
};

export default PriceChart;
