function Footer() {
    const footerStyle = {
        bottom: 0,
        width: "100%",
        height: "50px",
        backgroundColor: "lightgray",
        textAlign: "center",
        padding: "10px 0"
    };

    return (
        <footer style={footerStyle}>
            <p>© 2025 prodify, Inc. All rights reserved.</p>
        </footer>
    );
}

export default Footer;