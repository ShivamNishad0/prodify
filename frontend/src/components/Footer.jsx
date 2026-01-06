const STYLES = {
  footer: {
    bottom: 0,
    width: "100%",
    height: "50px",
    backgroundColor: "#f5f5f5",
    textAlign: "center",
    padding: "10px 0",
    borderTop: "1px solid #eee",
    boxShadow: "0 -2px 8px rgba(60, 178, 168, 0.1)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  text: {
    fontSize: "14px",
    color: "#666",
    margin: 0,
  },
};

function Footer() {
  return (
    <footer style={STYLES.footer}>
      <p style={STYLES.text}>© 2025 prodify, Inc. All rights reserved.</p>
    </footer>
  );
}

export default Footer;