'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function DiamondDustParticles({ 
  count = 1000, 
  color = '#ffffff',
  sparkleColor = '#c0e0ff',
  size = 0.015, 
  scale = 0.8 
}) {
  const particlesRef = useRef();
  const [time, setTime] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Listen for scroll events to update the scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const maxScroll = windowHeight * 1.5; // Match the dissolve effect
      
      const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Generate particles with initial positions
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // Position particles in a ring-like shape
      const radius = 0.8 + Math.random() * 0.3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta) + 0.6; // Position at ring height
      const z = radius * Math.cos(phi);
      
      // Random velocity direction for particle movement
      const vx = (Math.random() - 0.5) * 0.01;
      const vy = Math.random() * 0.02; // Upward bias for rising effect
      const vz = (Math.random() - 0.5) * 0.01;
      
      // Random size variation for each particle
      const particleSize = size * (0.5 + Math.random() * 1.0);
      
      // Random delay for staggered animation
      const delay = Math.random() * 0.5;
      
      // Random sparkle effect timing
      const sparkleFactor = Math.random();
      
      temp.push({ x, y, z, vx, vy, vz, particleSize, delay, sparkleFactor });
    }
    return temp;
  }, [count, size]);
  
  // Create diamond dust particle material
  const particleMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uSparkleColor: { value: new THREE.Color(sparkleColor) },
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uSize: { value: size },
        uScale: { value: scale },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uScroll;
        uniform float uSize;
        uniform float uScale;
        
        attribute float size;
        attribute float delay;
        attribute float sparkleFactor;
        
        varying float vSparkle;
        
        void main() {
          // Apply scroll progress to visibility and movement
          float scrollFactor = smoothstep(0.0, 0.7, uScroll);
          
          // Adjust particle visibility based on scroll
          float visibilityFactor = smoothstep(delay, 1.0, scrollFactor);
          
          // Calculate sparkle effect
          vSparkle = sin(uTime * 5.0 + sparkleFactor * 50.0) * 0.5 + 0.5;
          
          // Scale size by visibility
          float finalSize = size * visibilityFactor * uScale;
          
          // Position calculation
          vec3 pos = position;
          
          // Add movement based on scroll
          float moveFactor = scrollFactor * 1.0 - delay * 0.5;
          if (moveFactor > 0.0) {
            // Calculate rising and spreading movement
            pos.x += sin(uTime + position.x * 10.0) * 0.05 * moveFactor;
            pos.y += moveFactor * 0.8; // Rising effect
            pos.z += cos(uTime + position.z * 10.0) * 0.05 * moveFactor;
          }
          
          // Project to screen space
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Set point size
          gl_PointSize = finalSize * (1.0 / -mvPosition.z) * 500.0;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uSparkleColor;
        varying float vSparkle;
        
        void main() {
          // Calculate distance from center for circular particles
          float d = length(gl_PointCoord.xy - 0.5) * 2.0;
          
          // Discard pixels outside the circle
          if (d > 1.0) {
            discard;
          }
          
          // Create soft edge
          float intensity = smoothstep(1.0, 0.0, d);
          
          // Mix between base color and sparkle color based on vSparkle
          vec3 finalColor = mix(uColor, uSparkleColor, vSparkle * vSparkle);
          
          // Output with transparency
          gl_FragColor = vec4(finalColor, intensity * 0.8);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [color, sparkleColor, size, scale]);
  
  // Setup geometry with attributes
  const [geometry, setGeometry] = useState(null);
  
  useEffect(() => {
    const geo = new THREE.BufferGeometry();
    
    // Create position attribute
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const delays = new Float32Array(count);
    const sparkleFactors = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = particles[i].x;
      positions[i3 + 1] = particles[i].y;
      positions[i3 + 2] = particles[i].z;
      
      sizes[i] = particles[i].particleSize;
      delays[i] = particles[i].delay;
      sparkleFactors[i] = particles[i].sparkleFactor;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('delay', new THREE.BufferAttribute(delays, 1));
    geo.setAttribute('sparkleFactor', new THREE.BufferAttribute(sparkleFactors, 1));
    
    setGeometry(geo);
  }, [particles, count]);
  
  // Update particles animation
  useFrame((state, delta) => {
    setTime(prev => prev + delta);
    
    if (particleMaterial) {
      particleMaterial.uniforms.uTime.value = time;
      particleMaterial.uniforms.uScroll.value = scrollProgress;
    }
  });
  
  if (!geometry) return null;
  
  return (
    <points ref={particlesRef} geometry={geometry}>
      <primitive object={particleMaterial} attach="material" />
    </points>
  );
}