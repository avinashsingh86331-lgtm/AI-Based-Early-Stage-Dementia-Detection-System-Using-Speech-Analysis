import BackgroundParticles from "./BackgroundParticles";

const DashboardLayout = ({ children }) => {
  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh" }}>
      {/* Background Particles Layer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <BackgroundParticles />
      </div>

      {/* Content Layer */}
      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
