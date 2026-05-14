import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBell, FiLogOut, FiEdit2, FiX, FiCheck } from "react-icons/fi";
import { GiDna2 } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Navbar = ({ theme, setTheme, user, setUser, scrollToSection, notifications = [], setNotifications, addNotification, showToast }) => {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.displayName || "Medical Practitioner",
    age: "",
    specialty: "Neurologist",
    clinic: "NeuroScan Clinic",
  });
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
        setEditMode(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      // Ignored
    }
    localStorage.removeItem("neuroscan_session");
    setUser(null);
    setProfileOpen(false);
    navigate("/login");
  };

  const handleSaveProfile = () => {
    setEditMode(false);
    if (setUser && user) {
      setUser({ ...user, displayName: profileData.name });
    }
    if (addNotification) {
      addNotification({ type: "success", title: "Profile Updated", message: "Your practitioner profile details have been saved successfully." });
    }
    if (showToast) {
      showToast("Profile Updated Successfully", "success");
    }
  };

  const handleNavClick = (section) => {
    if (scrollToSection) {
      scrollToSection(section);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    if (setNotifications) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
        onClick={() => { navigate("/"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
      >
        {/* Premium DNA Icon Logo */}
        <div style={{
          width: "38px",
          height: "38px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, #73C7E3 0%, #2E4A70 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 12px rgba(115, 199, 227, 0.3)",
        }}>
          <GiDna2 size={22} color="#fff" />
        </div>
        <div>
          <span className="navbar-logo" style={{ color: "#73C7E3", fontSize: "1.4rem" }}>NeuroScan</span>
          <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", display: "block", marginTop: "-2px", letterSpacing: "0.15em", textTransform: "uppercase" }}>AI Medical</span>
        </div>
      </motion.div>

      {/* Nav Links — scroll to sections */}
      <motion.ul
        className="navbar-links"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <li><a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ color: "#73C7E3" }}>Home</a></li>
        <li><a href="#" onClick={e => { e.preventDefault(); handleNavClick("analytics"); }} style={{ color: "#73C7E3" }}>Analytics</a></li>
        <li><a href="#" onClick={e => { e.preventDefault(); handleNavClick("dashboard"); }} style={{ color: "#73C7E3" }}>Dashboard</a></li>
        <li><a href="#" onClick={e => { e.preventDefault(); handleNavClick("history"); }} style={{ color: "#73C7E3" }}>History</a></li>
      </motion.ul>

      {/* Right Controls */}
      <motion.div
        style={{ display: "flex", alignItems: "center", gap: "16px" }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Theme Toggle */}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          <motion.div
            className="theme-toggle-knob"
            style={{
              fontSize: "11px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </motion.div>
        </button>

        {/* Notification */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => { setNotificationsOpen((v) => !v); setProfileOpen(false); }}
            style={{
              background: "var(--bg-card)",
              border: `1px solid ${notificationsOpen ? "#73C7E3" : "var(--border-subtle)"}`,
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#73C7E3",
              cursor: "pointer",
              position: "relative",
              transition: "border-color 0.2s ease",
            }}
          >
            <FiBell size={16} />
            {unreadCount > 0 && (
              <span style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                width: "8px",
                height: "8px",
                background: "var(--danger)",
                borderRadius: "50%",
              }} />
            )}
          </motion.button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: "absolute",
                  top: "calc(100% + 12px)",
                  right: "-40px",
                  width: "320px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                  overflow: "hidden",
                  zIndex: 999,
                  backdropFilter: "blur(12px)",
                }}
              >
                <div style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid var(--border-subtle)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <h3 style={{ margin: 0, fontSize: "1rem", color: "#73C7E3", fontWeight: "600" }}>Notifications</h3>
                  {unreadCount > 0 && (
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", cursor: "pointer" }} onClick={markAllAsRead}>Mark all as read</span>
                  )}
                </div>
                
                <div style={{ padding: "8px", maxHeight: "300px", overflowY: "auto" }}>
                  {notifications.length === 0 ? (
                    <p style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--text-muted)", padding: "16px 0" }}>No new notifications</p>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif.id} style={{
                        padding: "12px",
                        borderRadius: "var(--radius-sm)",
                        background: notif.read ? "transparent" : "var(--bg-surface)",
                        marginBottom: "8px",
                        borderLeft: `3px solid ${notif.type === "success" ? "#00c07f" : notif.type === "warning" ? "#e63946" : "#73C7E3"}`,
                        border: notif.read ? "1px solid var(--border-subtle)" : undefined,
                        cursor: "pointer",
                      }}>
                        <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: "500" }}>{notif.title}</p>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>{notif.message}</p>
                        <span style={{ display: "block", marginTop: "6px", fontSize: "0.65rem", color: "var(--text-muted)" }}>{notif.time}</span>
                      </div>
                    ))
                  )}
                </div>
                
                {notifications.length > 0 && (
                  <div style={{
                    padding: "12px",
                    borderTop: "1px solid var(--border-subtle)",
                    textAlign: "center"
                  }}>
                    <button 
                      onClick={() => {
                        if (showToast) showToast("All notifications have been viewed.", "info");
                        markAllAsRead();
                        setNotificationsOpen(false);
                      }}
                      style={{
                      background: "transparent",
                      border: "none",
                      color: "#73C7E3",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      fontFamily: "var(--font-body)"
                    }}>
                      Clear All Notifications
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Avatar with Profile Dropdown */}
        {user ? (
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => { setProfileOpen((v) => !v); setEditMode(false); setNotificationsOpen(false); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "var(--bg-card)",
                border: `1px solid ${profileOpen ? "#73C7E3" : "var(--border-subtle)"}`,
                borderRadius: "var(--radius-pill)",
                padding: "6px 14px 6px 6px",
                cursor: "pointer",
                transition: "border-color 0.2s ease",
              }}
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }}
                />
              ) : (
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #73C7E3, #2E4A70)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", fontWeight: "700", color: "#fff",
                }}>
                  {(profileData.name || user.displayName)?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#73C7E3" }}>
                {(profileData.name || user.displayName)?.split(" ")[0] || "User"}
              </span>
            </motion.div>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: "absolute",
                    top: "calc(100% + 12px)",
                    right: 0,
                    width: "300px",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-lg)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                    overflow: "hidden",
                    zIndex: 999,
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {/* Profile Header */}
                  <div style={{
                    padding: "24px 20px 16px",
                    textAlign: "center",
                    borderBottom: "1px solid var(--border-subtle)",
                  }}>
                    <div style={{
                      width: "56px", height: "56px", borderRadius: "50%",
                      background: "linear-gradient(135deg, #73C7E3, #2E4A70)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "24px", fontWeight: "800", color: "#fff",
                      margin: "0 auto 12px",
                    }}>
                      {(profileData.name || user.displayName)?.[0]?.toUpperCase() || "U"}
                    </div>

                    {!editMode ? (
                      <>
                        <p style={{ fontSize: "1.05rem", fontWeight: "700", color: "#73C7E3", marginBottom: "4px" }}>
                          {profileData.name || user.displayName || "User"}
                        </p>
                        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                          {user.email || "doctor@neuroscan.ai"}
                        </p>
                        {profileData.age && (
                          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
                            Age: {profileData.age}
                          </p>
                        )}
                        {profileData.specialty && (
                          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                            Specialty: {profileData.specialty}
                          </p>
                        )}
                        {profileData.clinic && (
                          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                            Clinic: {profileData.clinic}
                          </p>
                        )}
                      </>
                    ) : (
                      <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.75rem", color: "#73C7E3", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Name</label>
                          <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            style={{
                              width: "100%", padding: "10px 12px",
                              background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
                              borderRadius: "var(--radius-sm)", color: "var(--text-primary)",
                              fontFamily: "var(--font-body)", fontSize: "0.9rem", outline: "none",
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.75rem", color: "#73C7E3", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Age</label>
                          <input
                            type="number"
                            value={profileData.age}
                            onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                            placeholder="e.g. 35"
                            style={{
                              width: "100%", padding: "10px 12px",
                              background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
                              borderRadius: "var(--radius-sm)", color: "var(--text-primary)",
                              fontFamily: "var(--font-body)", fontSize: "0.9rem", outline: "none",
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.75rem", color: "#73C7E3", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Specialty</label>
                          <input
                            type="text"
                            value={profileData.specialty}
                            onChange={(e) => setProfileData({ ...profileData, specialty: e.target.value })}
                            placeholder="e.g. Neurologist"
                            style={{
                              width: "100%", padding: "10px 12px",
                              background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
                              borderRadius: "var(--radius-sm)", color: "var(--text-primary)",
                              fontFamily: "var(--font-body)", fontSize: "0.9rem", outline: "none",
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.75rem", color: "#73C7E3", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Clinic/Hospital</label>
                          <input
                            type="text"
                            value={profileData.clinic}
                            onChange={(e) => setProfileData({ ...profileData, clinic: e.target.value })}
                            placeholder="e.g. NeuroScan Clinic"
                            style={{
                              width: "100%", padding: "10px 12px",
                              background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
                              borderRadius: "var(--radius-sm)", color: "var(--text-primary)",
                              fontFamily: "var(--font-body)", fontSize: "0.9rem", outline: "none",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ padding: "8px" }}>
                    {!editMode ? (
                      <button
                        onClick={() => setEditMode(true)}
                        style={{
                          width: "100%", padding: "12px 16px", display: "flex", alignItems: "center",
                          gap: "10px", background: "transparent", border: "none",
                          borderRadius: "var(--radius-sm)", color: "var(--text-primary)",
                          fontSize: "0.9rem", fontFamily: "var(--font-body)", cursor: "pointer",
                          transition: "background 0.15s ease",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-surface)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        <FiEdit2 size={16} />
                        Edit Profile
                      </button>
                    ) : (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={handleSaveProfile}
                          style={{
                            flex: 1, padding: "10px", display: "flex", alignItems: "center",
                            justifyContent: "center", gap: "6px", background: "#73C7E3",
                            border: "none", borderRadius: "var(--radius-sm)", color: "#000",
                            fontSize: "0.85rem", fontWeight: "600", fontFamily: "var(--font-body)", cursor: "pointer",
                          }}
                        >
                          <FiCheck size={14} /> Save
                        </button>
                        <button
                          onClick={() => setEditMode(false)}
                          style={{
                            padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "center",
                            background: "transparent", border: "1px solid var(--border-subtle)",
                            borderRadius: "var(--radius-sm)", color: "var(--text-muted)",
                            fontSize: "0.85rem", fontFamily: "var(--font-body)", cursor: "pointer",
                          }}
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    )}

                    <div style={{ height: "1px", background: "var(--border-subtle)", margin: "4px 0" }} />

                    <button
                      onClick={handleLogout}
                      style={{
                        width: "100%", padding: "12px 16px", display: "flex", alignItems: "center",
                        gap: "10px", background: "transparent", border: "none",
                        borderRadius: "var(--radius-sm)", color: "var(--danger)",
                        fontSize: "0.9rem", fontFamily: "var(--font-body)", cursor: "pointer",
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(230, 57, 70, 0.1)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <FiLogOut size={16} />
                      Log Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            style={{ padding: "9px 20px", fontSize: "0.85rem" }}
            onClick={() => navigate("/login")}
          >
            Sign In
          </motion.button>
        )}
      </motion.div>
    </nav>
  );
};

export default Navbar;
