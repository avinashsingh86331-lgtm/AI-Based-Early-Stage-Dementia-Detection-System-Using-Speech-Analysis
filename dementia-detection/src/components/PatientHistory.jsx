import { motion } from "framer-motion";
import { FiClock, FiChevronRight, FiDownload } from "react-icons/fi";

const history = [
  { patient: "Rahul Sharma", date: "10 May 2026", time: "10:32 AM", risk: "Low Risk", score: 85, confidence: 89, patientId: "NS-4821" },
  { patient: "Priya Singh", date: "09 May 2026", time: "02:15 PM", risk: "Moderate Risk", score: 62, confidence: 92, patientId: "NS-3915" },
  { patient: "Aman Verma", date: "08 May 2026", time: "11:47 AM", risk: "High Risk", score: 34, confidence: 96, patientId: "NS-7204" },
  { patient: "Sunita Devi", date: "07 May 2026", time: "09:20 AM", risk: "Low Risk", score: 91, confidence: 94, patientId: "NS-1587" },
  { patient: "Vikram Mehta", date: "06 May 2026", time: "03:05 PM", risk: "Moderate Risk", score: 55, confidence: 88, patientId: "NS-6392" },
];

const riskConfig = {
  "Low Risk": { class: "badge-low", color: "#73C7E3" },
  "Moderate Risk": { class: "badge-moderate", color: "var(--warning)" },
  "High Risk": { class: "badge-high", color: "var(--danger)" },
};

const PatientHistory = () => {

  const exportCSV = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/generate/csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(history)
      });
      
      const result = await response.json();
      
      if (result.status === 'success' && result.download_url) {
        window.location.href = result.download_url;
      } else {
        throw new Error("Failed to generate CSV on server.");
      }
    } catch (err) {
      console.error("CSV Export Error:", err);
      alert("Failed to export CSV. Make sure the Python backend is running on port 5000!");
    }
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "28px" }}>
        <div>
          <h2 className="font-heading section-title" style={{ color: "#73C7E3" }}>Patient History</h2>
          <p className="section-subtitle" style={{ marginBottom: 0, color: "#5BB8D9" }}>
            Complete log of recent AI-powered speech assessments
          </p>
        </div>
        <motion.button
          className="btn-success"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={exportCSV}
          style={{ fontSize: "0.85rem", padding: "9px 22px", display: "flex", alignItems: "center", gap: "8px" }}
        >
          <FiDownload />
          Export CSV
        </motion.button>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ color: "#73C7E3" }}>Patient</th>
              <th style={{ color: "#73C7E3" }}>Date & Time</th>
              <th style={{ color: "#73C7E3" }}>Risk Level</th>
              <th style={{ color: "#73C7E3" }}>Speech Score</th>
              <th style={{ color: "#73C7E3" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => {
              const risk = riskConfig[item.risk];
              return (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                  whileHover={{ backgroundColor: "rgba(115, 199, 227, 0.04)" }}
                >
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "50%",
                        background: "linear-gradient(135deg, #73C7E3, #2E4A70)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.9rem", fontWeight: "700", color: "#fff", flexShrink: 0,
                      }}>
                        {item.patient[0]}
                      </div>
                      <div>
                        <span style={{ fontWeight: "600", color: "#73C7E3", fontSize: "0.9rem" }}>{item.patient}</span>
                        <span style={{ display: "block", fontSize: "0.72rem", color: "var(--text-muted)" }}>{item.patientId}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                      <FiClock size={13} />
                      <span>{item.date} • {item.time}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${risk.class}`}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: risk.color }} />
                      {item.risk}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div className="progress-track" style={{ width: "80px" }}>
                        <motion.div
                          style={{
                            height: "100%", borderRadius: "var(--radius-pill)",
                            background: item.score > 70
                              ? "linear-gradient(90deg, #73C7E3, #00c07f)"
                              : item.score > 45
                              ? "linear-gradient(90deg, var(--warning), #cc9900)"
                              : "linear-gradient(90deg, var(--danger), #c9184a)",
                          }}
                          initial={{ width: "0%" }}
                          whileInView={{ width: `${item.score}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                      <span style={{ fontSize: "0.82rem", fontWeight: "700", color: risk.color }}>{item.score}</span>
                    </div>
                  </td>
                  <td>
                    <motion.button
                      whileHover={{ scale: 1.1, color: "#73C7E3" }}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: "var(--text-muted)", display: "flex", alignItems: "center",
                        gap: "4px", fontSize: "0.82rem", fontFamily: "var(--font-body)",
                        transition: "color 0.2s",
                      }}
                    >
                      View <FiChevronRight />
                    </motion.button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientHistory;
