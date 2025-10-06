"use client";

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

export function RingShadowEffect() {
  const spotLightRef = useRef();
  const pointLightRef = useRef();
  
  // Animate lights for dynamic shadow and sparkle effect
  useFrame(({ clock }) => {
    if (spotLightRef.current) {
      const time = clock.getElapsedTime();
      spotLightRef.current.position.x = Math.sin(time * 0.7) * 3;
      spotLightRef.current.position.z = Math.cos(time * 0.5) * 3;
      spotLightRef.current.intensity = 1 + Math.sin(time * 1.5) * 0.2;
    }
    
    if (pointLightRef.current) {
      const time = clock.getElapsedTime() * 0.8;
      pointLightRef.current.position.y = Math.sin(time) * 2;
      pointLightRef.current.intensity = 1 + Math.sin(time * 2) * 0.5;
    }
  });

  return (
    <>
      {/* Enhanced lighting setup for jewelry */}
      <ambientLight intensity={0.6} color="#f0f0ff" />
      
      {/* Main spotlight that casts the primary shadow */}
      <spotLight
        ref={spotLightRef}
        position={[5, 8, 5]}
        angle={0.25}
        penumbra={1}
        intensity={2.0}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      
      {/* Subtle fill light from opposite direction */}
      <directionalLight 
        position={[-5, 3, -5]} 
        intensity={0.3} 
        color="#e1e6ff"
      />
      
      {/* Point light to create sparkle effects */}
      <pointLight
        ref={pointLightRef}
        position={[2, 0, 2]}
        intensity={1.8}
        distance={12}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      
      {/* Soft rim light */}
      <directionalLight
        position={[0, -5, 10]}
        intensity={0.2}
        color="#ffe1c0"
      />
    </>
  );
}

export default RingShadowEffect;