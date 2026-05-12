import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiActivity, FiEye, FiX, FiFileText, FiDownload } from "react-icons/fi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const patients = [
  {
    name: "Rahul Sharma", age: 72, lastScan: "10 May 2026",
    risk: "Low Risk", confidence: 89, speechScore: 85,
    biomarkers: { pauseFreq: 2.8, avgPause: 0.35, speechRate: 145, vocabRich: 78.2, sentComp: 85.1, pitchVar: 32.4, wordRecall: 82.3, fluency: 79.5 },
  },
  {
    name: "Priya Singh", age: 68, lastScan: "09 May 2026",
    risk: "Moderate Risk", confidence: 92, speechScore: 62,
    biomarkers: { pauseFreq: 5.1, avgPause: 0.72, speechRate: 118, vocabRich: 55.4, sentComp: 61.8, pitchVar: 22.1, wordRecall: 58.7, fluency: 52.3 },
  },
  {
    name: "Aman Verma", age: 75, lastScan: "08 May 2026",
    risk: "High Risk", confidence: 96, speechScore: 34,
    biomarkers: { pauseFreq: 7.3, avgPause: 1.15, speechRate: 95, vocabRich: 38.1, sentComp: 42.5, pitchVar: 15.2, wordRecall: 31.4, fluency: 28.9 },
  },
];

const riskConfig = {
  "Low Risk": { class: "badge-low", dot: "#73C7E3", color: "#73C7E3" },
  "Moderate Risk": { class: "badge-moderate", dot: "var(--warning)", color: "#CF8A40" },
  "High Risk": { class: "badge-high", dot: "var(--danger)", color: "#e63946" },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

const DoctorDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);

  const downloadPatientReport = async (patient) => {
    try {
      const payload = {
        patientId: patient.name.replace(/\s/g, "_"),
        timestamp: patient.lastScan,
        result: patient.risk,
        speechScore: patient.speechScore,
        confidence: patient.confidence,
        biomarkers: {
          pauseFrequency: patient.biomarkers.pauseFreq,
          avgPauseDuration: patient.biomarkers.avgPause,
          speechRate: patient.biomarkers.speechRate,
          vocabularyRichness: patient.biomarkers.vocabRich,
          sentenceCompleteness: patient.biomarkers.sentComp,
          pitchVariability: patient.biomarkers.pitchVar,
          wordRecall: patient.biomarkers.wordRecall,
          fluencyScore: patient.biomarkers.fluency
        }
      };

      const response = await fetch("http://localhost:5000/api/generate/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      
      if (result.status === 'success' && result.download_url) {
        window.location.href = result.download_url;
      } else {
        throw new Error("Failed to generate PDF on server.");
      }
    } catch (err) {
      console.error(err);
      alert("PDF download failed: " + err.message + "\nMake sure the Python backend is running on port 5000!");
    }
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "28px" }}>
        <div>
          <h2 className="font-heading section-title" style={{ color: "#73C7E3" }}>Patient Dashboard</h2>
          <p className="section-subtitle" style={{ marginBottom: 0, color: "#5BB8D9" }}>
            AI-analyzed patient cognitive assessments
          </p>
        </div>
        <motion.button className="btn-outline" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          style={{ fontSize: "0.85rem", padding: "9px 22px" }}>
          + Add Patient
        </motion.button>
      </div>

      {/* Patient Cards */}
      <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }}
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        {patients.map((patient, index) => {
          const risk = riskConfig[patient.risk];
          return (
            <motion.div key={index} variants={rowVariants} transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.03, y: -4 }} className="glass-card" style={{ padding: "28px", cursor: "default" }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{
                    width: "46px", height: "46px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #73C7E3, #2E4A70)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.1rem", fontWeight: "700", color: "#fff", flexShrink: 0,
                  }}>
                    {patient.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "1rem", color: "#73C7E3", fontFamily: "var(--font-body)" }}>
                      {patient.name}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      Age {patient.age} • {patient.lastScan}
                    </div>
                  </div>
                </div>
                <span className={`badge ${risk.class}`}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: risk.dot }} />
                  {patient.risk}
                </span>
              </div>

              {/* Metrics */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>AI Confidence</span>
                    <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#73C7E3" }}>{patient.confidence}%</span>
                  </div>
                  <div className="progress-track">
                    <motion.div className="progress-fill" initial={{ width: "0%" }}
                      whileInView={{ width: `${patient.confidence}%` }} viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: index * 0.1 }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Speech Score</span>
                    <span style={{ fontSize: "0.8rem", fontWeight: "700", color: risk.color }}>{patient.speechScore}/100</span>
                  </div>
                  <div className="progress-track">
                    <motion.div style={{
                      height: "100%", borderRadius: "var(--radius-pill)",
                      background: patient.speechScore > 70
                        ? "linear-gradient(90deg, #73C7E3, #00c07f)"
                        : patient.speechScore > 45
                        ? "linear-gradient(90deg, var(--warning), #cc9900)"
                        : "linear-gradient(90deg, var(--danger), #c9184a)",
                    }}
                      initial={{ width: "0%" }} whileInView={{ width: `${patient.speechScore}%` }}
                      viewport={{ once: true }} transition={{ duration: 1.2, delay: index * 0.15 }} />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "10px", marginTop: "22px" }}>
                <motion.button className="btn-outline" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  style={{ flex: 1, padding: "9px", fontSize: "0.82rem" }}
                  onClick={() => downloadPatientReport(patient)}>
                  <FiFileText style={{ display: "inline", marginRight: "6px" }} /> PDF
                </motion.button>
                <motion.button className="btn-primary" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  style={{ flex: 1, padding: "9px", fontSize: "0.82rem" }}
                  onClick={() => setSelectedPatient(patient)}>
                  <FiEye style={{ display: "inline", marginRight: "6px" }} /> Report
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ═══ Report Modal ═══ */}
      <AnimatePresence>
        {selectedPatient && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 9999,
              background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
            }}
            onClick={() => setSelectedPatient(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              className="glass-card"
              style={{ maxWidth: "700px", width: "100%", maxHeight: "80vh", overflow: "auto", padding: "40px", position: "relative" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setSelectedPatient(null)}
                style={{
                  position: "absolute", top: "16px", right: "16px", background: "none",
                  border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.2rem",
                }}>
                <FiX />
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
                <div style={{
                  width: "52px", height: "52px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #73C7E3, #2E4A70)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.3rem", fontWeight: "700", color: "#fff",
                }}>
                  {selectedPatient.name[0]}
                </div>
                <div>
                  <h3 className="font-heading" style={{ color: "#73C7E3", fontSize: "1.3rem" }}>{selectedPatient.name}</h3>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Age {selectedPatient.age} • {selectedPatient.lastScan}</p>
                </div>
              </div>

              {/* Metrics Summary */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                {[
                  { label: "Risk Level", value: selectedPatient.risk, color: riskConfig[selectedPatient.risk].color },
                  { label: "AI Confidence", value: selectedPatient.confidence + "%", color: "#73C7E3" },
                  { label: "Speech Score", value: selectedPatient.speechScore + "/100", color: riskConfig[selectedPatient.risk].color },
                ].map((m) => (
                  <div key={m.label} style={{ padding: "16px", background: "var(--bg-surface)", borderRadius: "var(--radius-sm)", textAlign: "center" }}>
                    <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>{m.label}</p>
                    <p style={{ fontSize: "1.15rem", fontWeight: "700", color: m.color }}>{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Biomarkers Table */}
              <h4 style={{ color: "#73C7E3", fontSize: "0.95rem", marginBottom: "12px" }}>Speech Biomarker Analysis</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "24px" }}>
                {[
                  { label: "Pause Frequency", value: selectedPatient.biomarkers.pauseFreq + "/min", normal: "2-4/min" },
                  { label: "Avg Pause", value: selectedPatient.biomarkers.avgPause + "s", normal: "< 0.5s" },
                  { label: "Speech Rate", value: selectedPatient.biomarkers.speechRate + " wpm", normal: "130-170" },
                  { label: "Vocabulary", value: selectedPatient.biomarkers.vocabRich + "%", normal: "> 70%" },
                  { label: "Completeness", value: selectedPatient.biomarkers.sentComp + "%", normal: "> 80%" },
                  { label: "Pitch Var.", value: selectedPatient.biomarkers.pitchVar + " Hz", normal: "25-50 Hz" },
                  { label: "Word Recall", value: selectedPatient.biomarkers.wordRecall + "%", normal: "> 75%" },
                  { label: "Fluency", value: selectedPatient.biomarkers.fluency + "%", normal: "> 70%" },
                ].map((b) => (
                  <div key={b.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "var(--bg-card)", borderRadius: "var(--radius-sm)", borderLeft: "3px solid #73C7E3" }}>
                    <div>
                      <p style={{ fontSize: "0.78rem", fontWeight: "600", color: "var(--text-primary)" }}>{b.label}</p>
                      <p style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>Normal: {b.normal}</p>
                    </div>
                    <span style={{ fontSize: "0.9rem", fontWeight: "700", color: "#73C7E3", alignSelf: "center" }}>{b.value}</span>
                  </div>
                ))}
              </div>

              <motion.button className="btn-primary" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => downloadPatientReport(selectedPatient)}
                style={{ width: "100%", padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <FiDownload /> Download Full PDF Report
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorDashboard;
