const Header_Category_Data = [
    {
        id: 1,
        label: "Clothings",
        img: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=500&auto=format&fit=crop"
    },
    {
        id: 2,
        label: "Electronics",
        img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=500&auto=format&fit=crop"
    },
    {
        id: 3,
        label: "Accessories",
        img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500&auto=format&fit=crop"
    },
    {
        id: 4,
        label: "Home & Kitchen",
        img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=500&auto=format&fit=crop"
    },
];

function Headerforcategory() {
    return (
        <div style={{ padding: "20px", textAlign: "center", marginBottom: "20px" }}>
            <div style={{ backgroundColor: "#fff", padding: "20px" }}>
                {Header_Category_Data.map((category) => (
                    <div
                        key={category.id}
                        style={{ display: "inline-block", margin: "0 15px", cursor: "pointer" }}
                    >
                        <img
                            src={category.img}
                            alt={category.label}
                            style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                transition: "transform 0.3s ease"
                            }}
                            onMouseEnter={(e) =>
                                (e.target.style.transform = "scale(1.1)")
                            }
                            onMouseLeave={(e) =>
                                (e.target.style.transform = "scale(1)")
                            }
                        />
                        <h3 style={{ margin: "10px 0 0", fontSize: "18px", color: "#3cb2a8" }}>
                            {category.label}
                        </h3>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Headerforcategory;
