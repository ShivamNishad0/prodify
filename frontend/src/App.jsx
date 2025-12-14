import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import Homepage from "./components/Homepage";
import Products from "./components/Products";
import Inventory from "./components/Inventory";
import Profile from "./components/Profile";
import Orders from "./components/Orders";
import Customers from "./components/Customers";
import Reports from "./components/Reports";
import Analytics from "./components/Analytics";
import Support from "./components/Support";
import Settings from "./components/Settings";
import Notifications from "./components/Notifications";
import Messages from "./components/Messages";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Rightsidebar from "./components/Rightsidebar";
import About from "./components/About";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        
          {/* PROTECTED ROUTES */}
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Homepage />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="profile" element={<Profile />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="reports" element={<Reports />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="support" element={<Support />} />
            <Route path="settings" element={<Settings />} />
            <Route path="notification" element={<Notifications />} />
            <Route path="messages" element={<Messages />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
