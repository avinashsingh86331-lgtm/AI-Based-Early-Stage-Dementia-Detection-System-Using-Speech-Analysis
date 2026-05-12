import { useEffect, useState, useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticleBackground = ({ theme = "dark" }) => {
  const [init, setInit] = useState(false);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
    setInit(true);
  }, []);

  const isDark = theme === "dark";

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: false,
        background: { color: "transparent" },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: ["grab", "repulse"],
            },
            onClick: {
              enable: true,
              mode: "push",
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 180,
              links: { opacity: 0.6, color: isDark ? "#73C7E3" : "#2E4A70" },
            },
            repulse: {
              distance: 100,
              duration: 0.4,
              speed: 0.5,
            },
            push: {
              quantity: 3,
            },
          },
        },
        particles: {
          color: {
            value: isDark
              ? ["#73C7E3", "#CF8A40", "#2E4A70", "#FFF9F0"]
              : ["#2E4A70", "#CF8A40", "#73C7E3"],
          },
          links: {
            enable: true,
            color: isDark ? "#73C7E3" : "#2E4A70",
            distance: 130,
            opacity: isDark ? 0.25 : 0.15,
            width: 1,
            triangles: {
              enable: true,
              opacity: isDark ? 0.03 : 0.02,
              color: isDark ? "#2E4A70" : "#73C7E3",
            },
          },
          move: {
            enable: true,
            speed: 0.6,
            direction: "none",
            random: false,
            straight: false,
            outModes: "bounce",
            attract: {
              enable: true,
              rotateX: 600,
              rotateY: 1200,
            },
          },
          number: {
            value: 100,
            density: { enable: true, area: 800 },
          },
          opacity: {
            value: { min: 0.15, max: 0.55 },
            animation: {
              enable: true,
              speed: 0.6,
              minimumValue: 0.1,
              sync: false,
            },
          },
          shape: {
            type: ["circle", "triangle"],
          },
          size: {
            value: { min: 1, max: 3.5 },
            animation: {
              enable: true,
              speed: 1.5,
              minimumValue: 0.5,
              sync: false,
            },
          },
        },
        detectRetina: true,
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
};

export default ParticleBackground;
