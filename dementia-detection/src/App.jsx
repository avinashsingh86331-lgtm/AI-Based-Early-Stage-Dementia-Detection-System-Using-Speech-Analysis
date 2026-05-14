import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import CustomCursor from "./components/CustomCursor";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

function App() {
  const [theme, setTheme] = useState("dark");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Sync theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Check for local session on load
  useEffect(() => {
    const localSession = localStorage.getItem("neuroscan_session");
    if (localSession) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(localSession));
    }
  }, []);

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-base)",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div className="spinner" />
        <p
          className="font-heading"
          style={{
            color: "var(--primary)",
            fontSize: "0.9rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Initializing NeuroScan...
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <CustomCursor />
      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage setUser={setUser} />
            )
          }
        />
        <Route
          path="/"
          element={
            user ? (
              <HomePage theme={theme} setTheme={setTheme} user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;