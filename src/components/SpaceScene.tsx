import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Environment, Lightformer } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { PLANETS, SPACING, planetPosition } from "./planets";
import { makePlanetTexture } from "./planetTexture";
import { scrollState } from "./scroll";

function Sun() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.06;
  });
  const tex = useMemo(() => makePlanetTexture("#ffb648", "#ff5e00", 9), []);
  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[PLANETS[0]!.radius, 64, 64]} />
        <meshStandardMaterial
          map={tex}
          emissiveMap={tex}
          emissive="#ff7a18"
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
      <mesh scale={1.25}>
        <sphereGeometry args={[PLANETS[0]!.radius, 32, 32]} />
        <meshBasicMaterial color="#ff8c2b" transparent opacity={0.09} side={THREE.BackSide} />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={900} distance={400} color="#ffc27a" />
    </group>
  );
}

function PlanetMesh({ index }: { index: number }) {
  const p = PLANETS[index]!;
  const group = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Mesh>(null);
  const pos = planetPosition(index);
  const tex = useMemo(() => makePlanetTexture(p.color, p.emissive, 6 + (index % 4)), [p, index]);
  const speed = 0.12 + index * 0.03;

  useFrame((state, d) => {
    if (spin.current) spin.current.rotation.y += d * speed;
    if (group.current) {
      group.current.position.y = pos[1] + Math.sin(state.clock.elapsedTime * 0.4 + index) * 0.35;
    }
  });

  return (
    <group ref={group} position={pos}>
      <mesh ref={spin} rotation={[0.3, 0, p.side * 0.18]} castShadow>
        <sphereGeometry args={[p.radius, 48, 48]} />
        <meshStandardMaterial
          map={tex}
          roughness={0.75}
          metalness={0.12}
          emissive={p.emissive}
          emissiveIntensity={0.35}
        />
      </mesh>
      {p.ring && (
        <mesh rotation={[Math.PI / 2.4, 0.2, 0.4]}>
          <ringGeometry args={[p.radius * 1.45, p.radius * 2.25, 96]} />
          <meshBasicMaterial color={p.color} side={THREE.DoubleSide} transparent opacity={0.32} />
        </mesh>
      )}
      <mesh scale={1.16}>
        <sphereGeometry args={[p.radius, 24, 24]} />
        <meshBasicMaterial color={p.color} transparent opacity={0.07} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function Dust() {
  const ref = useRef<THREE.Points>(null);
  const geom = useMemo(() => {
    const n = 900;
    const arr = new Float32Array(n * 3);
    const depth = (PLANETS.length - 1) * SPACING + 80;
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 90;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 60;
      arr[i * 3 + 2] = 30 - Math.random() * depth;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.z += d * 0.01;
  });
  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial size={0.22} color="#9fc4ff" transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

function Rig() {
  const target = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const total = PLANETS.length - 1;
    const t = scrollState.progress * total;
    const i = Math.min(Math.floor(t), total);
    const f = t - i;
    const a = planetPosition(i);
    const b = planetPosition(Math.min(i + 1, total));

    const px = a[0] + (b[0] - a[0]) * f;
    const py = a[1] + (b[1] - a[1]) * f;
    const pz = a[2] + (b[2] - a[2]) * f;

    target.current.set(px * 0.35, py * 0.4 + 1.6, pz + 15);
    look.current.set(px, py, pz);

    const k = 1 - Math.exp(-2.6 * dt);
    state.camera.position.lerp(target.current, k);
    const q = new THREE.Quaternion();
    const m = new THREE.Matrix4().lookAt(state.camera.position, look.current, state.camera.up);
    q.setFromRotationMatrix(m);
    state.camera.quaternion.slerp(q, k);
  });
  return null;
}

export default function SpaceScene() {
  return (
    <Canvas
      className="!fixed inset-0"
      dpr={[1, 2]}
      gl={{ antialias: true }}
      camera={{ position: [0, 2, 18], fov: 55 }}
    >
      <color attach="background" args={["#04060f"]} />
      <fog attach="fog" args={["#04060f", 45, 130]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[12, 18, 10]} intensity={0.8} color="#cfe2ff" />
      <Environment>
        <Lightformer intensity={1.2} position={[0, 6, 0]} scale={[14, 14, 1]} color="#7fb0ff" />
        <Lightformer
          intensity={0.6}
          color="#ffb066"
          position={[-8, 0, 4]}
          rotation-y={Math.PI / 2}
          scale={[24, 3, 1]}
        />
      </Environment>
      <Stars radius={160} depth={90} count={5200} factor={4} saturation={0} fade speed={0.6} />
      <Dust />
      <Sun />
      {PLANETS.map((p, i) => (i === 0 ? null : <PlanetMesh key={p.id} index={i} />))}
      <Rig />
    </Canvas>
  );
}
