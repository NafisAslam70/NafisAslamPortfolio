"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Html, useGLTF, Center } from "@react-three/drei";
import { Suspense, useMemo, useState } from "react";
import map from "@/content/nbs-map.json";

const HOTSPOTS = {
  cs:          { pos: [-0.65,  0.35,  0.45], label: "Computer Science Block",  color: "#8b5cf6" },
  ds:          { pos: [ 0.70,  0.35,  0.40], label: "Data Science Block",      color: "#06b6d4" },
  versatility: { pos: [ 0.00, -0.40,  0.95], label: "Versatility Block",       color: "#f97316" },
  world:       { pos: [ 0.02,  0.95,  0.05], label: "World Building",          color: "#111827" },
};

function BrainModel() {
  const { scene } = useGLTF("/models/human-brain/scene.gltf");
  useMemo(() => {
    scene.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        const m = o.material;
        if (m) {
          if (m.roughness === undefined) m.roughness = 0.5;
          if (m.metalness === undefined) m.metalness = 0.0;
        }
      }
    });
    return scene;
  }, [scene]);

  return (
    <Center fit>
      <primitive object={scene} />
    </Center>
  );
}
useGLTF.preload("/models/human-brain/scene.gltf");

function Hotspot({ id, selected, onSelect }) {
  const { pos, label, color } = HOTSPOTS[id];
  const active = selected === id;

  return (
    <Float speed={active ? 1.8 : 1.2} floatIntensity={active ? 1.0 : 0.6} rotationIntensity={0.35}>
      <group
        position={pos}
        onClick={(e) => { e.stopPropagation(); onSelect(id); }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => (document.body.style.cursor = "default")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelect(id); }}
      >
        <mesh scale={active ? 1.15 : 1}>
          <sphereGeometry args={[0.09, 24, 24]} />
          <meshStandardMaterial
            color={active ? color : "#ffffff"}
            emissive={active ? color : "#000000"}
            emissiveIntensity={active ? 0.7 : 0}
            metalness={0.2}
            roughness={0.3}
          />
        </mesh>

        {active && (
          <Html distanceFactor={11} position={[0, 0.22, 0]} transform occlude pointerEvents="none">
            <div className="px-2 py-1 rounded-full text-xs shadow-sm border backdrop-blur bg-white text-black">
              {label}
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
}

export default function Brain3D({ selected, onSelect }) {
  const blocks = useMemo(() => map?.blocks || [], []);
  const [ready, setReady] = useState(false);

  return (
    <div className="rounded-2xl overflow-hidden border bg-[color:var(--glass)]">
      <Canvas
        shadows
        camera={{ position: [0, 0.2, 4.8], fov: 45 }}
        onCreated={() => setReady(true)}
        style={{ width: "100%", height: "520px" }}
        dpr={[1, 1.6]}
        gl={{ powerPreference: "high-performance", antialias: true }}
      >
        {/* neon-ish accent lights */}
        <hemisphereLight intensity={0.6} groundColor={"#0b1020"} color={"#ffffff"} />
        <directionalLight position={[4, 5, 6]} intensity={0.9} color={"#a78bfa"} castShadow />
        <directionalLight position={[-5, 3, -2]} intensity={0.5} color={"#22d3ee"} />
        <pointLight position={[0, 1.4, 0.5]} intensity={0.35} distance={6} color={"#ffffff"} />

        <Suspense fallback={null}>
          <BrainModel />
          {blocks.map((b) => b.id in HOTSPOTS && (
            <Hotspot key={b.id} id={b.id} selected={selected} onSelect={onSelect} />
          ))}
          <Hotspot id="world" selected={selected} onSelect={onSelect} />
        </Suspense>

        <OrbitControls enablePan={false} minDistance={3.2} maxDistance={7.5} />
      </Canvas>

      {!ready && (
        <div className="p-3 text-center text-sm muted">Loading 3D…</div>
      )}
    </div>
  );
}
