import React, { useState } from "react";
import Footer from "./Footer";
import RevenueChart from "./charts/RevenueChart";
import CustomerChart from "./charts/CustomerChart";
import SalesByCategoryChart from "./charts/SalesByCategoryChart";
import OrderStatusChart from "./charts/OrderStatusChart";
import { 
  generateRevenueData, 
  generateCustomerData, 
  generateOrderStatusData, 
  generateSalesByCategoryData, 
} from "../utils/dataHelpers";

const STYLES = {
  container: {
    padding: "20px",
    fontFamily: "sans-serif",
    minHeight: "100vh",
  },
  filterContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  headerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  card: {
    height: "120px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #eee",
    boxShadow: "0 2px 8px rgba(60, 178, 168, 0.59)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  chartRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "40px",
  },

  chartItem: {
    width: "calc(50% - 10px)",
    boxShadow: "0 2px 8px rgba(60, 178, 168, 0.59)",
    borderRadius: "12px",
    overflow: "hidden",
  },

  chartWrapper: {
    height: "450px",
    backgroundColor: "#fff",
    borderRadius: "15px",
    border: "1px solid #eee",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    padding: "20px",
    boxSizing: "border-box",
  },

  button: (active) => ({
    padding: "8px 20px",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
    backgroundColor: active ? "#3cb2a8" : "#e0e0e0",
    color: active ? "#fff" : "#333",
    fontWeight: 600,
    transition: "all 0.2s ease",
  }),
};

// Safe fallback data functions
const getSafeRevenueData = () => {
  try {
    const data = generateRevenueData();
    return data || {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [{
        label: "Revenue",
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: "#3cb2a8",
        backgroundColor: "rgba(60, 178, 168, 0.2)",
        fill: true,
        tension: 0.4,
      }]
    };
  } catch (error) {
    console.warn("Error generating revenue data, using fallback:", error);
    return {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [{
        label: "Revenue",
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: "#3cb2a8",
        backgroundColor: "rgba(60, 178, 168, 0.2)",
        fill: true,
        tension: 0.4,
      }]
    };
  }
};

const getSafeCustomerData = () => {
  try {
    const data = generateCustomerData();
    return data || {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [{
        label: "New Customers",
        data: [45, 67, 52, 78, 65, 89],
        backgroundColor: "rgba(139, 69, 19, 0.8)",
        borderColor: "rgba(139, 69, 19, 1)",
        borderWidth: 1,
      }]
    };
  } catch (error) {
    console.warn("Error generating customer data, using fallback:", error);
    return {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [{
        label: "New Customers",
        data: [45, 67, 52, 78, 65, 89],
        backgroundColor: "rgba(139, 69, 19, 0.8)",
        borderColor: "rgba(139, 69, 19, 1)",
        borderWidth: 1,
      }]
    };
  }
};

const getSafeOrderStatusData = () => {
  try {
    const data = generateOrderStatusData();
    return data || {
      labels: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      datasets: [{
        data: [30, 45, 25, 80, 12],
        backgroundColor: [
          "rgba(251, 191, 36, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(239, 68, 68, 0.8)"
        ],
        borderColor: [
          "rgba(251, 191, 36, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(239, 68, 68, 1)"
        ],
        borderWidth: 2,
      }]
    };
  } catch (error) {
    console.warn("Error generating order status data, using fallback:", error);
    return {
      labels: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      datasets: [{
        data: [30, 45, 25, 80, 12],
        backgroundColor: [
          "rgba(251, 191, 36, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(239, 68, 68, 0.8)"
        ],
        borderColor: [
          "rgba(251, 191, 36, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(239, 68, 68, 1)"
        ],
        borderWidth: 2,
      }]
    };
  }
};

const getSafeCategoryData = () => {
  try {
    const data = generateSalesByCategoryData();
    return data || {
      labels: ["Electronics", "Clothing", "Home & Garden", "Sports", "Books"],
      datasets: [{
        data: [35000, 28000, 22000, 18000, 12000],
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(139, 92, 246, 0.8)"
        ],
        borderColor: [
          "rgba(239, 68, 68, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(139, 92, 246, 1)"
        ],
        borderWidth: 1,
      }]
    };
  } catch (error) {
    console.warn("Error generating category data, using fallback:", error);
    return {
      labels: ["Electronics", "Clothing", "Home & Garden", "Sports", "Books"],
      datasets: [{
        data: [35000, 28000, 22000, 18000, 12000],
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(139, 92, 246, 0.8)"
        ],
        borderColor: [
          "rgba(239, 68, 68, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(139, 92, 246, 1)"
        ],
        borderWidth: 1,
      }]
    };
  }
};


// Generate chart data with safe fallbacks
const CHART_DATA = getSafeRevenueData();
const CUSTOMER_CHART_DATA = getSafeCustomerData();
const CATEGORY_CHART_DATA = getSafeCategoryData();
const ORDER_STATUS_DATA = getSafeOrderStatusData();

const HEADER_DATA = [
  { id: "total-cust", label: "Total Customer", value: 150 },
  { id: "active-cust", label: "Active Customer", value: 150 },
  { id: "new-cust", label: "New Customer", value: 150 },
  { id: "rev-month", label: "Revenue This Month", value: 150 },
];

function Homepage() {
  const [timeRange, setTimeRange] = useState("This Month");

  const formatValue = ({ label, value }) =>
    label.includes("Revenue")
      ? `₹ ${value.toLocaleString()}`
      : value.toLocaleString();

  return (
    <div style={STYLES.container}>
      <h2 style={{ marginBottom: "20px", color: "#333" }}>
        Business Overview
      </h2>

      {/* Filters */}
      <div style={STYLES.filterContainer}>
        {["Today", "This Week", "This Month"].map((range) => (
          <button
            key={range}
            style={STYLES.button(timeRange === range)}
            onClick={() => setTimeRange(range)}
          >
            {range}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div style={STYLES.headerGrid}>
        {HEADER_DATA.map((item) => (
          <div key={item.id} style={STYLES.card}>
            <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 5px" }}>
              {formatValue(item)}
            </p>
            <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={STYLES.chartRow}>
        <div style={STYLES.chartItem}>
          <div style={STYLES.chartWrapper}>
            <RevenueChart data={CHART_DATA} title="Revenue Analysis" />
          </div>
        </div>

        <div style={STYLES.chartItem}>
          <div style={STYLES.chartWrapper}>
            <OrderStatusChart data={ORDER_STATUS_DATA} />
          </div>
        </div>
      </div>

      <div style={STYLES.chartRow}>
        <div style={STYLES.chartItem}>
          <div style={STYLES.chartWrapper}>
            <CustomerChart data={CUSTOMER_CHART_DATA} />
          </div>
        </div>

        <div style={STYLES.chartItem}>
          <div style={STYLES.chartWrapper}>
            <SalesByCategoryChart data={CATEGORY_CHART_DATA} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Homepage;
