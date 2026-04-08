import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// SPED session thumbnail images (Unsplash)
const SESSION_IMAGES = [
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop',
];

const PARTICLE_COUNT = 1500;
const PARTICLE_SIZE_MIN = 0.005;
const PARTICLE_SIZE_MAX = 0.01;
const SPHERE_RADIUS = 9;
const POSITION_RANDOMNESS = 4;
const ROTATION_SPEED_Y = 0.0005;
const IMAGE_ORBIT_RADIUS = 4.5; // tighter orbit so 9 images are closely spaced
const IMAGE_SIZE = 2.5;         // wider cards to fill the arc

function ParticleSphere({ images }) {
  const groupRef = useRef();
  const textures = useTexture(images);

  const particles = useMemo(() => {
    const list = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT);
      const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi;
      const radiusVariation = SPHERE_RADIUS + (Math.random() - 0.5) * POSITION_RANDOMNESS;
      list.push({
        position: [
          radiusVariation * Math.cos(theta) * Math.sin(phi),
          radiusVariation * Math.cos(phi),
          radiusVariation * Math.sin(theta) * Math.sin(phi),
        ],
        scale: Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN) + PARTICLE_SIZE_MIN,
        color: new THREE.Color().setHSL(
          Math.random() * 0.1 + 0.05,
          0.8,
          0.6 + Math.random() * 0.3,
        ),
      });
    }
    return list;
  }, []);

  const orbitingImages = useMemo(() => {
    const list = [];
    for (let i = 0; i < images.length; i++) {
      const angle = (i / images.length) * Math.PI * 2;
      const x = IMAGE_ORBIT_RADIUS * Math.cos(angle);
      const z = IMAGE_ORBIT_RADIUS * Math.sin(angle);
      const position = new THREE.Vector3(x, 0, z);      const outwardDirection = position.clone().normalize();
      const euler = new THREE.Euler();
      const matrix = new THREE.Matrix4();
      matrix.lookAt(position, position.clone().add(outwardDirection), new THREE.Vector3(0, 1, 0));
      euler.setFromRotationMatrix(matrix);
      list.push({
        position: [x, 0, z],
        rotation: [euler.x, euler.y, euler.z],
        textureIndex: i % textures.length,
      });
    }
    return list;
  }, [images.length, textures.length]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += ROTATION_SPEED_Y;
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position} scale={p.scale}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshBasicMaterial color={p.color} transparent opacity={1} />
        </mesh>
      ))}
      {orbitingImages.map((img, i) => (
        <mesh key={`img-${i}`} position={img.position} rotation={img.rotation}>
          <planeGeometry args={[IMAGE_SIZE, IMAGE_SIZE * 0.65]} />
          <meshBasicMaterial map={textures[img.textureIndex]} opacity={1} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

export default function OrbitGallery({ style }) {
  return (
    <div style={{ width: '100%', height: '100%', ...style }}>
      <Canvas camera={{ position: [-10, 1.5, 10], fov: 50 }} gl={{ alpha: true }} style={{ background: 'transparent' }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={null}>
          <ParticleSphere images={SESSION_IMAGES} />
        </Suspense>
        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
    </div>
  );
}
