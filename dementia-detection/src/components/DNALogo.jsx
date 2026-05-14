import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════
   DNA DOUBLE HELIX — Premium Gold 3D Logo
   ═══════════════════════════════════════════ */

const DNAStrand = () => {
  const groupRef = useRef();
  const glowRef = useRef();
  const time = useRef(0);

  const { spheres, cylinders } = useMemo(() => {
    const s = [];
    const c = [];
    const numPairs = 28;
    const radius = 1.4;
    const heightSpacing = 0.38;
    const angleIncrement = Math.PI / 5.5;

    for (let i = 0; i < numPairs; i++) {
      const angle1 = i * angleIncrement;
      const angle2 = angle1 + Math.PI;
      const y = (i - numPairs / 2) * heightSpacing;

      const p1 = new THREE.Vector3(
        Math.cos(angle1) * radius,
        y,
        Math.sin(angle1) * radius
      );
      const p2 = new THREE.Vector3(
        Math.cos(angle2) * radius,
        y,
        Math.sin(angle2) * radius
      );

      s.push({ pos: p1, strand: 0 });
      s.push({ pos: p2, strand: 1 });

      // Rung between the two strands
      const center = new THREE.Vector3()
        .addVectors(p1, p2)
        .multiplyScalar(0.5);
      const distance = p1.distanceTo(p2);
      const direction = new THREE.Vector3().subVectors(p2, p1).normalize();
      const quaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction
      );
      const euler = new THREE.Euler().setFromQuaternion(quaternion);

      c.push({
        position: center,
        rotation: euler,
        length: distance,
        index: i,
      });
    }
    return { spheres: s, cylinders: c };
  }, []);

  // Smooth continuous rotation + glow pulse
  useFrame((state, delta) => {
    time.current += delta;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
    if (glowRef.current) {
      glowRef.current.material.opacity =
        0.06 + Math.sin(time.current * 1.5) * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Backbone spheres */}
      {spheres.map((s, i) => (
        <mesh key={`s-${i}`} position={s.pos}>
          <sphereGeometry args={[0.2, 24, 24]} />
          <meshStandardMaterial
            color={s.strand === 0 ? "#FFD700" : "#FFA500"}
            metalness={0.95}
            roughness={0.05}
            emissive={s.strand === 0 ? "#FFD700" : "#FFA500"}
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}

      {/* Connecting rungs */}
      {cylinders.map((cyl, i) => (
        <mesh
          key={`c-${i}`}
          position={cyl.position}
          rotation={cyl.rotation}
          scale={[0.06, cyl.length, 0.06]}
        >
          <cylinderGeometry args={[1, 1, 1, 12]} />
          <meshStandardMaterial
            color="#FFD700"
            metalness={0.85}
            roughness={0.15}
            emissive="#CF8A40"
            emissiveIntensity={0.35}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}

      {/* Central glow cylinder */}
      <mesh ref={glowRef}>
        <cylinderGeometry args={[0.6, 0.6, 28 * 0.38, 16]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

/* ═══════════════════════════════════════════
   DNA LOGO COMPONENT — Reusable across app
   ═══════════════════════════════════════════ */

const DNALogo = ({ style, className }) => {
  return (
    <div style={{ ...style }} className={className}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        {/* Cinematic Premium Lighting */}
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[8, 8, 5]}
          intensity={2.5}
          color="#FFD700"
        />
        <directionalLight
          position={[-8, -5, -3]}
          intensity={1.2}
          color="#FFA500"
        />
        <pointLight
          position={[0, 0, 6]}
          intensity={3}
          color="#ffffff"
          distance={25}
        />
        <pointLight
          position={[3, 3, 3]}
          intensity={1.5}
          color="#FFD700"
          distance={15}
        />

        <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.4}>
          <DNAStrand />
        </Float>

        {/* Golden sparkles around the logo */}
        <Sparkles
          count={100}
          scale={9}
          size={4}
          speed={0.5}
          opacity={0.9}
          color="#FFD700"
        />
        <Sparkles
          count={40}
          scale={7}
          size={2.5}
          speed={0.3}
          opacity={0.7}
          color="#FFFFFF"
        />
      </Canvas>
    </div>
  );
};

export default DNALogo;
