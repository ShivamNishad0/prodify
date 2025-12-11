import React from "react";
import Footer from "./Footer";

function Homepage() {
  const homeHeaderData = [
    { id: 'total-customer', type: "Total Customer", number: 150 },
    { id: 'active-customer', type: "Active Customer", number: 150 },
    { id: 'new-customer', type: "New Customer", number: 150 },
    { id: 'revenue', type: "Revenue This Month", number: 150 },
  ];

  // Format number with commas for readability
  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  // Format metric value based on type
  const formatMetricValue = (item) => {
    if (item.type === "Revenue This Month") {
      return `₨. ${formatNumber(item.number)}`;
    }
    return formatNumber(item.number);
  };

  // Inline styles for the grid container and the individual cards
  const headerGridStyle = {
    padding: "20px",
    maxWidth: "1450px",
    width: "120%",
    marginLeft: "0px",
    marginTop: "10px",
    marginRight: "5px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
  };

  const cardStyle = {
    height: "100px",
    textAlign: "center",
    padding: "10px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 2px 5px #3cb2a8",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  };

  return (
    <>
      {/* Header Metrics Section 
        Uses CSS Grid for a responsive dashboard layout
      */}
      <div style={headerGridStyle}>
        {homeHeaderData.map((item) => (
          <div key={item.id} style={cardStyle}>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>
              {formatMetricValue(item)}
            </p>
            <p style={{ fontSize: "14px", color: "gray" }}>{item.type}</p>
          </div>
        ))}
      </div>

      {/* Footer Section */}
      <div style={headerGridStyle}>
        <Footer />
      </div>
    </>
  );
}

export default Homepage;