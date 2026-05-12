import { motion } from "framer-motion";
import { FiUsers, FiAlertTriangle, FiActivity, FiShield } from "react-icons/fi";

const stats = [
  {
    title: "Total Patients",
    value: "128",
    icon: FiUsers,
    color: "#73C7E3",
    change: "+12",
    period: "this month",
  },
  {
    title: "High Risk Cases",
    value: "24",
    icon: FiAlertTriangle,
    color: "#e63946",
    change: "+3",
    period: "this week",
  },
  {
    title: "Moderate Risk",
    value: "56",
    icon: FiActivity,
    color: "#CF8A40",
    change: "+8",
    period: "this month",
  },
  {
    title: "Low Risk",
    value: "48",
    icon: FiShield,
    color: "#73C7E3",
    change: "+1",
    period: "this week",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const Analytics = () => {
  return (
    <div style={{ marginTop: "40px" }}>
      <h2 className="font-heading section-title gradient-text">AI Analytics</h2>
      <p className="section-subtitle">Real-time cognitive health metrics and detection statistics</p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              variants={cardVariants}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{
                scale: 1.04,
                y: -4,
                borderColor: item.color,
              }}
              className="glass-card stat-card"
              style={{ padding: "28px" }}
            >
              {/* Icon */}
              <div className="stat-icon">
                <Icon color={item.color} />
              </div>

              {/* Value */}
              <div
                className="stat-value"
                style={{ color: item.color }}
              >
                {item.value}
              </div>

              {/* Label */}
              <div className="stat-label">{item.title}</div>

              {/* Progress bar */}
              <div className="progress-track" style={{ marginTop: "16px" }}>
                <motion.div
                  className="progress-fill"
                  style={{
                    background: `linear-gradient(90deg, ${item.color}, var(--secondary))`,
                  }}
                  initial={{ width: "0%" }}
                  whileInView={{
                    width: `${(parseInt(item.value) / 128) * 100}%`,
                  }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>

              {/* Change indicator */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginTop: "12px",
                }}
              >
                <span
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: "700",
                    color: item.color,
                    background: `${item.color}18`,
                    padding: "2px 8px",
                    borderRadius: "var(--radius-pill)",
                  }}
                >
                  {item.change}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {item.period}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default Analytics;
