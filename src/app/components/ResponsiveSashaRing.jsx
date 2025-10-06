"use client";

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import { Sasha } from './Sasha';
import RingShadowEffect from './RingShadowEffect';
import * as THREE from 'three';

export default function ResponsiveSashaRing() {
  const [scale, setScale] = useState(0.9);
  const [position, setPosition] = useState([0, -1, 0]);
  const [fov, setFov] = useState(45);
  const [isMounted, setIsMounted] = useState(false);

  // Function to update model parameters based on screen size
  const updateModelParameters = () => {
    if (typeof window === 'undefined') return;
    
    if (window.innerWidth < 480) {
      // Mobile phones
      setScale(0.7);
      setPosition([0, -0.5, 0]);
      setFov(55);
    } else if (window.innerWidth < 768) {
      // Tablets
      setScale(0.9);
      setPosition([0, -0.6, 0]);
      setFov(50);
    } else if (window.innerWidth < 1024) {
      // Small laptops
      setScale(1.0);
      setPosition([0, -0.7, 0]);
      setFov(45);
    } else {
      // Large screens
      setScale(1.1);
      setPosition([0, -0.7, 0]);
      setFov(45);
    }
  };

  // Set up responsive behavior
  useEffect(() => {
    setIsMounted(true);
    
    // Initial sizing
    updateModelParameters();

    // Add resize event listener
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateModelParameters);
      
      // Clean up
      return () => window.removeEventListener('resize', updateModelParameters);
    }
  }, []);

  // Don't render on server side
  if (!isMounted) {
    return null;
  }
  
  return (
    <Canvas
      shadows
      dpr={[1, 2]} // Responsive rendering based on device pixel ratio
      camera={{ 
        position: [0, 0, 4], // Move camera closer to the ring
        fov: fov,
        near: 0.1,
        far: 1000
      }}
      style={{ 
        width: '100%', 
        height: '100%'
      }}
      gl={{ 
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
        alpha: true // Enable transparency
      }}
    >
      {/* Custom lighting setup */}
      <RingShadowEffect />
      
      {/* Environment for realistic reflections */}
      <Environment preset="city" />
      
      {/* Dynamic positioning based on screen size */}
      <group 
        position={position} 
        rotation={[0.1, Math.PI / 3, 0]}
        scale={scale}
      >
        <Sasha />
      </group>
      
      {/* Enhanced shadows */}
      <ContactShadows 
        position={[0, -1.8, 0]} 
        opacity={0.7} 
        scale={12} 
        blur={2.5}
        far={5}
        resolution={512}
        color="#000000"
      />
      
      {/* Controlled camera movement */}
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.8}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  );
}