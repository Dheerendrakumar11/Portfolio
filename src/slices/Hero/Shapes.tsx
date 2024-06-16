"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Float, Environment } from "@react-three/drei";
import { Suspense, useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

export function Shapes() {
  return (
    <div className="row-span-1 row-start-1 -mt-9 aspect-square md:col-span-1 md:col-start-2 md:mt-0 items-center ">
      <Canvas
        className="z-0"
        shadows
        gl={{ antialias: false }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 25], fov: 30, near: 1, far: 40 }}
      >
        <Suspense fallback={null}>
          <Geometries />
          <ContactShadows
            position={[0, -3.5, 0]}
            opacity={0.65}
            scale={40}
            blur={1}
            far={9}
          />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}

interface GeometryProps {
  r: number;
  position: [number, number, number];
  geometry: THREE.BufferGeometry;
  materials: THREE.Material[];
  soundEffects: HTMLAudioElement[];
}

const Geometries: React.FC = () => {
  const geometries = [
    {
      position: [0, 0, 0] as [number, number, number],
      r: 0.3,
      geometry: new THREE.IcosahedronGeometry(2),
    },
    {
      position: [0.8, -0.75, 4] as [number, number, number],
      r: 0.3,
      geometry: new THREE.CapsuleGeometry(0.5, 1.6, 2, 16),
    },
    {
      position: [-1.1, 2, -4] as [number, number, number],
      r: 0.6,
      geometry: new THREE.DodecahedronGeometry(1.5),
    },
    {
      position: [-0.6, -0.75, 5] as [number, number, number],
      r: 0.3,
      geometry: new THREE.TorusGeometry(0.6, 0.25, 16, 32),
    },
    {
      position: [1.6, 1.6, -4] as [number, number, number],
      r: 0.3,
      geometry: new THREE.OctahedronGeometry(1.5),
    },
  ];

  const materials = [
    new THREE.MeshNormalMaterial(),
    new THREE.MeshStandardMaterial({
      color: 0x2ecc71,
      metalness: 0.5,
      roughness: 0,
    }),
    new THREE.MeshStandardMaterial({
      color: 0x0097e6,
      metalness: 0.5,
      roughness: 0.4,
    }),
    new THREE.MeshStandardMaterial({
      color: 0xe1b12c,
      metalness: 0.5,
      roughness: 0.1,
    }),
    new THREE.MeshStandardMaterial({
      color: 0x0fbcf9,
      metalness: 0.5,
      roughness: 0.1,
    }),
    new THREE.MeshStandardMaterial({
      color: 0x05c46b,
      metalness: 0.5,
      roughness: 0.1,
    }),
  ];

  const soundEffects = [
    new Audio("/Sounds/Knock1.ogg"),
    new Audio("/Sounds/Knock2.ogg"),
    new Audio("/Sounds/Knock3.ogg"),
  ];

  return (
    <>
      {geometries.map((geom, index) => (
        <Geometry
          key={JSON.stringify(geom.position)}
          position={geom.position.map((p) => p * 2) as [number, number, number]}
          soundEffects={soundEffects}
          geometry={geom.geometry}
          materials={materials}
          r={geom.r}
        />
      ))}
    </>
  );
};

const Geometry: React.FC<GeometryProps> = ({
  r,
  position,
  geometry,
  materials,
  soundEffects,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [visible, setVisible] = useState(false);

  function getRandomMaterial(): THREE.Material {
    return gsap.utils.random(materials);
  }

  const startingMaterial = getRandomMaterial();

  function handleClick(e: THREE.Event) {
    const mesh = e.object as THREE.Mesh;
    gsap.utils.random(soundEffects).play();

    gsap.to(mesh.rotation, {
      x: `+=${gsap.utils.random([0.5])}`,
      y: `+=${gsap.utils.random([0.2])}`,
      z: `+=${gsap.utils.random([0.2])}`,
      duration: 1.3,
      ease: "elastic.out(1, 0.3)",
      yoyo: true,
    });

    mesh.material = getRandomMaterial();
  }

  const handlePointerOver = () => {
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    document.body.style.cursor = "default";
  };

  useEffect(() => {
    if (meshRef.current) {
      const ctx = gsap.context(() => {
        setVisible(true);
        gsap.from(meshRef.current!.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1,
          ease: "elastic.out(1, 0.3)",
          delay: 0.3,
        });
      }, meshRef.current);

      return () => ctx.revert();
    }
  }, []);

  return (
    <group position={position} ref={meshRef} className='p-4'>
      <Float speed={5 * r} rotationIntensity={6 * r} floatIntensity={5 * r}>
        <mesh
          geometry={geometry}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          visible={visible}
          material={startingMaterial}
        />
      </Float>
    </group>
  );
};

export default Geometries;
