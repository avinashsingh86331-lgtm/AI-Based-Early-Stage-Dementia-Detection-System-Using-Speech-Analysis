import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "@tsparticles/slim";

const BackgroundParticles = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="dashboard-tsparticles"
      init={particlesInit}
      options={{
        fullScreen: false,
        background: { color: { value: "transparent" } },
        fpsLimit: 120,
        interactivity: {
          detectsOn: "window",
          events: {
            onHover: {
              enable: true,
              mode: "grab",
            },
            onClick: {
              enable: true,
              mode: "push",
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 200,
              links: {
                opacity: 0.6,
                color: "#73C7E3",
              },
            },
            push: {
              quantity: 2,
            },
          },
        },
        particles: {
          color: {
            value: ["#73C7E3", "#5BB8D9", "#A0D8EF", "#FFD700", "#FFFFFF"],
          },
          links: {
            color: "#73C7E3",
            distance: 140,
            enable: true,
            opacity: 0.25,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: { default: "out" },
            random: false,
            speed: 0.6,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 500,
            },
            value: 120,
          },
          opacity: {
            value: { min: 0.5, max: 0.9 },
            animation: {
              enable: true,
              speed: 0.5,
              minimumValue: 0.3,
              sync: false,
            },
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1.5, max: 4 },
          },
        },
        detectRetina: true,
      }}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    />
  );
};

export default BackgroundParticles;
