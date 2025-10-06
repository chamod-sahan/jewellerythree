"use client";

import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial } from '@react-three/drei';

export default function GlassyFloor(props) {
  const ref = useRef();
  
  return (
    <mesh 
      {...props} 
      ref={ref} 
      rotation={[-Math.PI / 2, 0, 0]} 
      receiveShadow
    >
      <planeGeometry args={[50, 50]} />
      <MeshReflectorMaterial
        blur={[400, 100]}
        resolution={1024}
        mixBlur={0.8}
        mixStrength={1.5}
        depthScale={1}
        minDepthThreshold={0.8}
        maxDepthThreshold={1.2}
        color="#050505"
        metalness={0.6}
        roughness={0.2}
        mirror={0.75}
      />
    </mesh>
  );
}