import Navbar from "@shared/components/Navbar";
import Footer from "@shared/components/Footer";
import Offers from "./components/Offers";
import Headerforcategory from "./components/Headerforcategory";
import Topdeals from "./components/Topdeals";
function App() {
  return (
    <>
      <Navbar />
      <Headerforcategory />
      <Offers className="app-content" /> 
      <Topdeals />
      <Footer />
    </>
  );
}

export default App;
