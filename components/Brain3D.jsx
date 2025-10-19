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

function Hotspot({ id, selected, onSelect, onUserInteract }) {
  const { pos, label, color } = HOTSPOTS[id];
  const active = selected === id;

  return (
    <Float speed={active ? 1.8 : 1.2} floatIntensity={active ? 1.0 : 0.6} rotationIntensity={0.35}>
      <group
        position={pos}
        onClick={(e) => {
          e.stopPropagation();
          onUserInteract?.();
          onSelect(id, { origin: "user" });
        }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => (document.body.style.cursor = "default")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onUserInteract?.();
            onSelect(id, { origin: "user" });
          }
        }}
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

export default function Brain3D({ selected, onSelect, onUserInteract, autoplaying = false }) {
  const blocks = useMemo(() => map?.blocks || [], []);
  const [ready, setReady] = useState(false);
  const legendItems = useMemo(
    () =>
      Object.entries(HOTSPOTS).map(([id, { label, color }]) => ({
        id,
        label,
        color,
      })),
    []
  );

  return (
    <div className="brain3d-container relative rounded-2xl overflow-hidden border bg-[color:var(--glass)]">
      <Canvas
        shadows
        camera={{ position: [0, 0.2, 3.6], fov: 45 }}
        onCreated={() => setReady(true)}
        style={{ width: "100%", height: "520px" }}
        dpr={[1, 1.6]}
        gl={{ powerPreference: "high-performance", antialias: true }}
        className="relative z-[2]"
      >
        {/* neon-ish accent lights */}
        <hemisphereLight intensity={0.6} groundColor={"#0b1020"} color={"#ffffff"} />
        <directionalLight position={[4, 5, 6]} intensity={0.9} color={"#a78bfa"} castShadow />
        <directionalLight position={[-5, 3, -2]} intensity={0.5} color={"#22d3ee"} />
        <pointLight position={[0, 1.4, 0.5]} intensity={0.35} distance={6} color={"#ffffff"} />

        <Suspense fallback={null}>
          <BrainModel />
          {blocks.map((b) => b.id in HOTSPOTS && (
            <Hotspot
              key={b.id}
              id={b.id}
              selected={selected}
              onSelect={onSelect}
              onUserInteract={onUserInteract}
            />
          ))}
          <Hotspot
            id="world"
            selected={selected}
            onSelect={onSelect}
            onUserInteract={onUserInteract}
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={2.8}
          maxDistance={6.5}
          enableDamping
          dampingFactor={0.05}
          autoRotate
          autoRotateSpeed={0.9}
          onStart={onUserInteract}
        />
      </Canvas>

      <div className="brain3d-grid pointer-events-none absolute inset-0 z-[3]" />
      <div className="brain3d-scan pointer-events-none absolute inset-0 z-[3]" />

      <div className="pointer-events-none absolute inset-x-4 top-4 z-[4]">
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80 drop-shadow-[0_0_8px_rgba(0,0,0,0.55)]">
          <span className="rounded-full bg-black/70 px-3 py-1 backdrop-blur-sm">NBS // Neural Bridge Systems</span>
          <span
            className={`rounded-full border px-3 py-1 text-[9px] tracking-[0.32em] ${
              autoplaying ? "border-emerald-400/60 bg-emerald-400/20 text-emerald-200" : "border-white/20 bg-black/55 text-white/60"
            }`}
          >
            {autoplaying ? "AUTOPILOT ENGAGED" : "MANUAL CONTROL"}
          </span>
          <span className="font-normal tracking-normal text-white/80">
            Orbit the cortex, tag the glowing nodes, unlock each discipline compartment.
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-white/85 drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]">
          {legendItems.map(({ id, label, color }) => (
            <span
              key={id}
              className={`flex items-center gap-2 rounded-full border px-3 py-1 backdrop-blur transition ${
                selected === id
                  ? "border-white/80 bg-white/90 text-black shadow-[0_0_12px_rgba(255,255,255,0.45)]"
                  : "border-white/20 bg-black/55 text-white/85"
              }`}
            >
              <span
                className="h-2.5 w-2.5 rounded-full shadow-[0_0_8px_currentColor]"
                style={{ color, backgroundColor: color }}
              />
              <span className="text-xs">{label}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-5 left-1/2 w-full max-w-md -translate-x-1/2 text-center text-[11px] uppercase tracking-[0.35em] text-white/80 drop-shadow-[0_0_12px_rgba(0,0,0,0.65)]">
        Drag to orbit • Scroll to zoom • Tap a luminal node to load its stack trace
      </div>

      {!ready && (
        <div className="relative z-[5] p-3 text-center text-sm text-white">Calibrating neural render…</div>
      )}
    </div>
  );
}
