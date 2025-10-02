// src/app/components/ResponsiveRing.jsx
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useHelper } from '@react-three/drei';
import { Model } from './Alliance_White_Gold_Ring';
import ScrollTriggeredDissolveMaterial from './ScrollTriggeredDissolveMaterial';
import RingDustParticles from './RingDustParticles';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Scene = () => {
  const spotLightRef = useRef();
  const ringRef = useRef();
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Uncomment the following line during development to see light helpers
  // useHelper(spotLightRef, THREE.SpotLightHelper, 'red');

  // Listen for scroll events to update the scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const maxScroll = windowHeight * 1.5; // Full effect after 1.5 screen heights of scrolling
      
      const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Animation effect based on scroll
  useEffect(() => {
    if (!ringRef.current) return;
    
    // Create GSAP animation for ring rotation on scroll
    const rotateAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#ring-section",
        start: "top top",
        end: "bottom bottom",
        scrub: true
      }
    });
    
    rotateAnimation.to(ringRef.current.rotation, {
      y: Math.PI * 2,
      ease: "none"
    }, 0);
    
    return () => {
      rotateAnimation.kill();
    };
  }, []);
  
  // Frame-by-frame animation for smooth rotation
  useFrame((state, delta) => {
    if (!ringRef.current) return;
    
    // Adjust rotation based on scroll
    ringRef.current.rotation.x = scrollProgress * Math.PI * 0.25;
    
    // Optional slight continuous rotation for better visual effect
    ringRef.current.rotation.y += delta * 0.2;
  });

  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.3} color="#ffffff" />
      
      {/* Main key light */}
      <spotLight
        ref={spotLightRef}
        position={[5, 5, 5]}
        angle={0.5}
        penumbra={0.5}
        intensity={1.5}
        castShadow
        color="#ffffff"
      />
      
      {/* Fill light from opposite side */}
      <pointLight position={[-5, 3, 0]} intensity={0.7} color="#e0e0ff" />
      
      {/* Rim light for edge highlights */}
      <pointLight position={[0, -5, -5]} intensity={0.5} color="#fffae0" />
      
      {/* Adding environment lighting for realistic reflections */}
      <Environment preset="sunset" />
      
      {/* Ring dust particles */}
      <RingDustParticles 
        count={3000}
        color="#f0f0f8"
        size={0.02}
      />
      
      {/* Ring model with scroll-triggered dissolve material */}
      <group ref={ringRef}>
        <Model>
          <ScrollTriggeredDissolveMaterial 
            color="#ffffff"
            emissiveColor="#9fa4c4"
            noiseScale={15.0}
            metalness={0.8}
            roughness={0.2}
            glowWidth={0.12}
            glowIntensity={2.5}
            dustScale={0.3}
            dustAmount={0.6}
          />
        </Model>
      </group>
      
      {/* Camera controls */}
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        minPolarAngle={Math.PI / 4} // Limit vertical rotation
        maxPolarAngle={Math.PI / 1.5}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  );
};

export default function ResponsiveRing() {
  return (
    <div 
      id="ring-section"
      style={{ 
        width: '100vw', 
        height: '100vh', 
        background: 'linear-gradient(to bottom, #000 0%, #0a0a0a 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45 }} 
        shadows 
        dpr={[1, 2]} // Better pixel ratio for devices
      >
        <Scene />
      </Canvas>
    </div>
  );
}