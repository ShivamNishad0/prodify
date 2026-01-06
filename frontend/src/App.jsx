import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";


import Homepage from "./components/Homepage";
import Products from "./components/Products";
import Inventory from "./components/Inventory";
import Profile from "./components/Profile";
import Orders from "./components/Orders";
import Tenders from "./components/Tenders";
import Customers from "./components/Customers";
import Reports from "./components/Reports";
import Analytics from "./components/Analytics";
import Support from "./components/Support";
import Settings from "./components/Settings";
import Notifications from "./components/Notifications";
import Messages from "./components/Messages";
import Notes from "./components/Notes";
import AdminPanel from "./components/AdminPanel";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        
          {/* PROTECTED ROUTES */}
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Homepage />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="profile" element={<Profile />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="tenders" element={<Tenders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="reports" element={<Reports />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="support" element={<Support />} />
            <Route path="settings" element={<Settings />} />
            <Route path="notification" element={<Notifications />} />
            <Route path="messages" element={<Messages />} />
            <Route path="notes" element={<Notes />} />
            <Route path="about" element={<About />} />
            <Route path="admin" element={<AdminPanel />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

