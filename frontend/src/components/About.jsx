import Footer from "./Footer";

function About(){
    return (
        <>
        <div style={{ minHeight: "90vh", padding: "20px", marginLeft: "50px", maxWidth: "1400px", width: "120%" }}>
            <h1>About</h1>
            <div style={{ marginTop: "20px" }}>
                <p style={{ fontSize: "18px", lineHeight: "1.6", color: "#333" }}>
                    Welcome to our Customer Relationship Management (CRM) system. This comprehensive platform 
                    is designed to help businesses manage their customer interactions, track sales, and analyze 
                    business performance effectively.
                </p>
                
                <div style={{ marginTop: "30px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                    <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "10px", border: "1px solid #e9ecef" }}>
                        <h3 style={{ color: "#3cb2a8", marginBottom: "10px" }}>Our Mission</h3>
                        <p style={{ color: "#666", lineHeight: "1.5" }}>
                            To empower businesses with intelligent CRM solutions that enhance customer relationships 
                            and drive sustainable growth through data-driven insights.
                        </p>
                    </div>
                    
                    <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "10px", border: "1px solid #e9ecef" }}>
                        <h3 style={{ color: "#3cb2a8", marginBottom: "10px" }}>Key Features</h3>
                        <ul style={{ color: "#666", lineHeight: "1.5", paddingLeft: "20px" }}>
                            <li>Customer Management</li>
                            <li>Inventory Tracking</li>
                            <li>Order Processing</li>
                            <li>Sales Analytics</li>
                            <li>Real-time Reports</li>
                        </ul>
                    </div>
                    
                    <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "10px", border: "1px solid #e9ecef" }}>
                        <h3 style={{ color: "#3cb2a8", marginBottom: "10px" }}>Our Team</h3>
                        <p style={{ color: "#666", lineHeight: "1.5" }}>
                            Built by a dedicated team of developers and business analysts who understand the 
                            challenges of modern customer relationship management.
                        </p>
                    </div>
                    
                    <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "10px", border: "1px solid #e9ecef" }}>
                        <h3 style={{ color: "#3cb2a8", marginBottom: "10px" }}>Version</h3>
                        <p style={{ color: "#666", lineHeight: "1.5" }}>
                            CRM System v1.0.0<br/>
                            Built with React, Node.js, and MongoDB<br/>
                            Last Updated: December 2024
                        </p>
                    </div>
                </div>
                
                <div style={{ marginTop: "30px", padding: "20px", background: "#e3f2fd", borderRadius: "10px", borderLeft: "4px solid #2196f3" }}>
                    <h3 style={{ color: "#1976d2", marginBottom: "10px" }}>Need Help?</h3>
                    <p style={{ color: "#666", lineHeight: "1.5" }}>
                        If you have any questions or need support, please visit our Support page or contact 
                        our technical team for assistance.
                    </p>
                </div>
            </div>
            <div style={{marginTop:"20px", borderRadius:"10px", padding:"5px", background:"#f0f0f0"}}>
                <Footer />
            </div>
        </div>
        </>
    )
}
export default About;
