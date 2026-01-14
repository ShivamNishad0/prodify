const Top_deals =[
    {
        id: 1,
        label: "Deal 1: 50% off on all electronics",
    },
    {
        id: 2,
        label: "Deal 2: Buy one get one free on select items",
    },
    {
        id: 3,
        label: "Deal 3: Free shipping on orders over $50",
    },  
]

function Topdeals() {
  return (
    <div>
      <h2>Top Deals</h2>
        <ul style={{ listStyleType: "none", padding: 0, margin: 0,  display: "flex", gap: "20px" , overflowX: "auto" , overflowY: "hidden"}}>
            {Top_deals.map((deals) => (
                <div key={deals.id}>{deals.label}</div  >
            ))}
        </ul>
    </div>
  );
}

export default Topdeals;