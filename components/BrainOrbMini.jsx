"use client";

import { Canvas } from "@react-three/fiber";
import { Center, Float, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useMemo } from "react";

function BrainMesh({ scale = 1 }) {
  const { scene } = useGLTF("/models/human-brain/scene.gltf");

  const cloned = useMemo(() => {
    const copy = scene.clone(true);
    copy.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = false;
        node.receiveShadow = false;
      }
    });
    return copy;
  }, [scene]);

  return (
    <Center>
      <primitive object={cloned} scale={scale} />
    </Center>
  );
}

useGLTF.preload("/models/human-brain/scene.gltf");

export default function BrainOrbMini({ size = 64, glow = true }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        overflow: "hidden",
        border: "1px solid rgba(148, 163, 184, 0.45)",
        background: glow
          ? "radial-gradient(circle at 40% 20%, rgba(34,211,238,0.35), rgba(15,23,42,0.9) 72%)"
          : "rgba(15,23,42,0.95)",
        boxShadow: glow
          ? "0 10px 26px -16px rgba(6,182,212,0.7), 0 0 0 1px rgba(255,255,255,0.08) inset"
          : "none",
      }}
    >
      <Canvas camera={{ position: [0, 0.08, 2.3], fov: 35 }} dpr={[1, 1.6]} gl={{ antialias: true }}>
        <ambientLight intensity={0.85} />
        <directionalLight position={[2.2, 3.1, 2.8]} intensity={0.95} color="#a78bfa" />
        <directionalLight position={[-2.8, -1.2, 1.3]} intensity={0.45} color="#22d3ee" />
        <Suspense fallback={null}>
          <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.35}>
            <BrainMesh scale={1.04} />
          </Float>
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={false}
          autoRotate
          autoRotateSpeed={1.45}
        />
      </Canvas>
    </div>
  );
}
