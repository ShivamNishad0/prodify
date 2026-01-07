import Navbar from "@shared/components/Navbar";
import Footer from "@shared/components/Footer";
import Offers from "./components/Offers";
function App() {
  return (
    <>
      <Navbar />
      <Offers className="app-content" />  
      <Footer />
    </>
  );
}

export default App;
