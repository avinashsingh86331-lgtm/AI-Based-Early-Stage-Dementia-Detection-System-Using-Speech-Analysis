import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import DNALogo from "../components/DNALogo";

const LoginPage = ({ setUser }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Google Login Failed: " + error.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = activeTab === "register" ? "/api/auth/register" : "/api/auth/login";
      const payload = activeTab === "register" 
        ? { name: name || "Medical Practitioner", email, password }
        : { email, password };

      try {
        // Attempt to connect to Java Backend
        const response = await fetch(`http://localhost:8080${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        if (response.ok && data.success) {
          const userData = { email: data.user.email, displayName: data.user.name, id: data.user.id };
          localStorage.setItem("neuroscan_session", JSON.stringify(userData));
          setUser(userData);
          navigate("/");
          return;
        }
        throw new Error(data.message || "Authentication failed");
        
      } catch (backendErr) {
        // FALLBACK: Local Browser Database (If Java server is offline)
        console.warn("Java Backend offline. Switching to Local Secure Database...");
        
        const localDB = JSON.parse(localStorage.getItem("neuroscan_users") || "[]");
        
        if (activeTab === "register") {
          if (localDB.find(u => u.email === email)) {
            throw new Error("This email is already registered in the local database.");
          }
          const newUser = { id: Date.now(), name: name || "Medical Practitioner", email, password };
          localDB.push(newUser);
          localStorage.setItem("neuroscan_users", JSON.stringify(localDB));
          
          const userData = { email: newUser.email, displayName: newUser.name, id: newUser.id };
          localStorage.setItem("neuroscan_session", JSON.stringify(userData));
          setUser(userData);
          navigate("/");
        } else {
          const user = localDB.find(u => u.email === email && u.password === password);
          if (user) {
            const userData = { email: user.email, displayName: user.name, id: user.id };
            localStorage.setItem("neuroscan_session", JSON.stringify(userData));
            setUser(userData);
            navigate("/");
          } else {
            throw new Error("Invalid email or password (Local Database). Please Register first.");
          }
        }
      }
    } catch (err) {
      alert("Authentication Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "var(--bg-base)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ═══════════════════════════════════
          LEFT PANEL — Authentication Form
      ═══════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          width: "45%",
          minWidth: "420px",
          maxWidth: "580px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 64px",
          position: "relative",
          zIndex: 10,
          background: "rgba(18, 26, 47, 0.4)", /* Transparent blurred glass */
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRight: "1px solid var(--border-subtle)",
          boxShadow: "0 0 40px rgba(0,0,0,0.5)",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px" }}>
          <div style={{ width: "40px", height: "40px" }}>
            <DNALogo style={{ width: "100%", height: "100%" }} />
          </div>
          <span style={{ fontFamily: "var(--font-logo)", fontWeight: 800, fontSize: "1.5rem", color: "var(--text-primary)", letterSpacing: "0.05em" }}>
            NeuroScan
          </span>
        </div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1
            className="font-heading"
            style={{ fontSize: "2.2rem", letterSpacing: "0.05em", marginBottom: "8px", color: "var(--text-primary)" }}
          >
            {activeTab === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", marginBottom: "32px" }}>
            {activeTab === "login"
              ? "Sign in to access the medical portal"
              : "Register for your medical portal access"}
          </p>
        </motion.div>

        {/* Tab Switcher */}
        <div
          style={{
            display: "flex",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-pill)",
            padding: "4px",
            marginBottom: "28px",
          }}
        >
          {["login", "register"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "var(--radius-pill)",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontSize: "0.88rem",
                fontWeight: "600",
                transition: "all var(--transition-fast)",
                background: activeTab === tab ? "var(--primary)" : "transparent",
                color: activeTab === tab ? "#000" : "var(--text-muted)",
              }}
            >
              {tab === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Form */}
        <motion.form
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "18px" }}
        >
          {/* Name — only for register */}
          <AnimatePresence>
            {activeTab === "register" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="input-label">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Jane Smith" 
                  className="input-field" 
                  required 
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email */}
          <div>
            <label className="input-label">Email Address</label>
            <div style={{ position: "relative" }}>
              <FiMail style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", zIndex: 1 }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@hospital.com"
                className="input-field"
                style={{ paddingLeft: "44px" }}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="input-label">Password</label>
            <div style={{ position: "relative" }}>
              <FiLock style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", zIndex: 1 }} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                style={{ paddingLeft: "44px", paddingRight: "44px" }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {activeTab === "login" && (
              <div style={{ textAlign: "right", marginTop: "8px" }}>
                <a href="#" style={{ fontSize: "0.8rem", color: "var(--primary)", textDecoration: "none", cursor: "pointer" }}>
                  Forgot password?
                </a>
              </div>
            )}
          </div>

          {/* Submit */}
          <motion.button
            className="btn-primary"
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{ width: "100%", padding: "14px", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", opacity: loading ? 0.8 : 1 }}
          >
            {loading ? (
              <div className="spinner" style={{ width: "22px", height: "22px", borderWidth: "2px" }} />
            ) : (
              <>
                {activeTab === "login" ? "Sign In" : "Create Account"}
                <FiArrowRight />
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "24px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border-subtle)" }} />
          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>or continue with</span>
          <div style={{ flex: 1, height: "1px", background: "var(--border-subtle)" }} />
        </div>

        {/* Google Sign In */}
        <motion.button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          whileHover={{ scale: 1.02, borderColor: "var(--primary)" }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: "100%",
            padding: "13px",
            background: "var(--bg-surface)",
            border: "1.5px solid var(--border-subtle)",
            borderRadius: "var(--radius-pill)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            fontSize: "0.95rem",
            fontWeight: "600",
            fontFamily: "var(--font-body)",
            color: "var(--text-primary)",
            transition: "all var(--transition-fast)",
          }}
        >
          {googleLoading ? (
            <div className="spinner" style={{ width: "22px", height: "22px", borderWidth: "2px" }} />
          ) : (
            <>
              <FcGoogle size={22} />
              Continue with Google
            </>
          )}
        </motion.button>
      </motion.div>

      {/* ═══════════════════════════════════
          RIGHT PANEL — Spline
      ═══════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          minHeight: "100vh",
          background: "var(--bg-base)"
        }}
      >
        <iframe
          src="https://my.spline.design/aibrain-jTRM2cCCqisAnRkJvq6WEJXq/"
          frameBorder="0"
          allow="autoplay; fullscreen"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: "none",
            zIndex: 1,
            pointerEvents: "none",
          }}
          title="AI Brain 3D Animation"
        />

        {/* Cover to hide "Built with Spline" watermark */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "200px",
            height: "50px",
            background: "var(--bg-base)",
            zIndex: 2,
          }}
        />
      </motion.div>
    </div>
  );
};

export default LoginPage;
