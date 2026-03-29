import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { supabase } from "./services/supabase";

// Pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/login";
import Signup from "./pages/Singup";
import Income from "./pages/Income";
import Udhar from "./pages/Udhar";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // 🔥 Page track karne ke liye

  useEffect(() => {
    // Initial user fetch
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    // Realtime auth listener
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return null; // Blank screen avoid karne ke liye

  return (
    // mode="wait" se transitions smooth honge
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        {/* 🔐 Protected Routes */}
        <Route
          path="/"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/income"
          element={user ? <Income /> : <Navigate to="/login" />}
        />
        <Route
          path="/udhar"
          element={user ? <Udhar /> : <Navigate to="/login" />}
        />

        {/* 🔓 Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

      </Routes>
    </AnimatePresence>
  );
}

export default App;