import Footer from "./Footer";

function About() {
    const containerStyle = {
        padding: '30px',
        maxWidth: '1400px',
        margin: '0 auto',
        minHeight: '90vh'
    };

    const cardStyle = {
        background: 'white',
        borderRadius: '15px',
        padding: '25px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #e0e0e0',
        marginBottom: '25px'
    };

    return (
        <div style={containerStyle}>
            <div style={{
                ...cardStyle,
                background: 'linear-gradient(135deg, #3cb2a8 0%, #2a8a81 100%)',
                color: 'white',
                marginBottom: '30px'
            }}>
                <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>About CRM System</h1>
                <p style={{ margin: '0', opacity: '0.9' }}>Empowering businesses through intelligent relationship management</p>
            </div>

            <div style={cardStyle}>
                <p style={{ fontSize: "18px", lineHeight: "1.8", color: "#444", margin: 0 }}>
                    Welcome to our Customer Relationship Management (CRM) system. This comprehensive platform
                    is designed to help businesses manage their customer interactions, track sales, and analyze
                    business performance effectively. Our goal is to provide a seamless experience for both
                    administrators and staff to drive growth and efficiency.
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "25px", marginBottom: "30px" }}>
                <div style={cardStyle}>
                    <h3 style={{ color: "#3cb2a8", marginBottom: "15px", marginTop: 0 }}>Our Mission</h3>
                    <p style={{ color: "#666", lineHeight: "1.6", margin: 0 }}>
                        To empower businesses with intelligent CRM solutions that enhance customer relationships
                        and drive sustainable growth through data-driven insights.
                    </p>
                </div>

                <div style={cardStyle}>
                    <h3 style={{ color: "#3cb2a8", marginBottom: "15px", marginTop: 0 }}>Key Features</h3>
                    <ul style={{ color: "#666", lineHeight: "1.6", paddingLeft: "1.2rem", margin: 0 }}>
                        <li>Comprehensive Customer Profiles</li>
                        <li>Dynamic Inventory Control</li>
                        <li>Real-time Order Tracking</li>
                        <li>Advanced Sales Analytics</li>
                        <li>Customizable Business Reports</li>
                    </ul>
                </div>

                <div style={cardStyle}>
                    <h3 style={{ color: "#3cb2a8", marginBottom: "15px", marginTop: 0 }}>Core Technologies</h3>
                    <p style={{ color: "#666", lineHeight: "1.6", margin: 0 }}>
                        Built with modern technologies including <strong>React 19</strong>, <strong>Node.js</strong>,
                        <strong>MongoDB</strong>, and <strong>Chart.js</strong> to ensure high performance and scalability.
                    </p>
                </div>
            </div>

            <div style={{ ...cardStyle, background: "#f0fdfa", border: "1px solid #99f6e4", color: "#0f766e" }}>
                <h3 style={{ marginTop: 0, marginBottom: "10px" }}>Version Information</h3>
                <p style={{ margin: 0, opacity: 0.8 }}>
                    Current Release: v1.0.0 (January 2024)<br />
                    Status: Stable Production Build
                </p>
            </div>

            <div style={{ marginTop: "20px", borderRadius: "10px", padding: "5px", background: "#f0f0f0" }}>
                <Footer />
            </div>
        </div>
    );
}
export default About;
