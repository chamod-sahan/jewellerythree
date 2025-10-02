'use client';

import * as THREE from 'three';
import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

export default function RingDustParticles({ count = 2000, color = '#ffffff', size = 0.01 }) {
  const mesh = useRef();
  const [scrollProgress, setScrollProgress] = useState(0);
  
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
  
  // Generate random particles in a ring shape
  const particles = useMemo(() => {
    const temp = [];
    
    // Parameters for ring shape
    const ringRadius = 1.0;
    const ringWidth = 0.3;
    const ringHeight = 0.2;
    
    for (let i = 0; i < count; i++) {
      // Generate points in a ring/torus shape
      const angle = Math.random() * Math.PI * 2;
      const radius = ringRadius + (Math.random() * 2 - 1) * ringWidth;
      
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() * 2 - 1) * ringHeight;
      
      // Add random offsets for more natural look
      const offsetX = (Math.random() * 2 - 1) * 0.2;
      const offsetY = (Math.random() * 2 - 1) * 0.2;
      const offsetZ = (Math.random() * 2 - 1) * 0.2;
      
      // Add some variation to each particle's speed and direction
      const speedFactor = Math.random() * 0.5 + 0.5;
      const directionX = (Math.random() * 2 - 1);
      const directionY = Math.random() * 0.5 + 0.5; // Mostly upward
      const directionZ = (Math.random() * 2 - 1);
      
      temp.push({
        position: [x + offsetX, y + offsetY, z + offsetZ],
        speed: speedFactor,
        direction: [directionX, directionY, directionZ],
        startOpacity: Math.random() * 0.3 + 0.7, // Varied starting opacity
        size: Math.random() * size * 2  // Varied sizes
      });
    }
    return temp;
  }, [count, size]);
  
  // Create the actual geometry and material
  const [positions, sizes, opacities] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const opacities = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = particles[i].position[0];
      positions[i * 3 + 1] = particles[i].position[1];
      positions[i * 3 + 2] = particles[i].position[2];
      
      sizes[i] = particles[i].size;
      opacities[i] = 0; // Start invisible
    }
    
    return [positions, sizes, opacities];
  }, [particles, count]);
  
  // Animation loop
  useFrame((state, delta) => {
    if (!mesh.current) return;

    // Use the scroll progress from state
    
    // Update particle positions and opacities based on scroll
    const positions = mesh.current.geometry.attributes.position.array;
    const opacities = mesh.current.geometry.attributes.opacity.array;
    const particleActivationThreshold = 0.1; // When particles start appearing
    
    for (let i = 0; i < count; i++) {
      // Only animate particles when scroll is past threshold
      if (scrollProgress > particleActivationThreshold) {
        const i3 = i * 3;
        
        // Normalize the scroll progress for particle animation (0-1)
        const normalizedProgress = (scrollProgress - particleActivationThreshold) / (1 - particleActivationThreshold);
        
        // Scale particle movement based on scroll progress
        const movementFactor = normalizedProgress * 2;
        
        // Apply movement based on particle's direction and speed
        positions[i3] += particles[i].direction[0] * particles[i].speed * delta * movementFactor;
        positions[i3 + 1] += particles[i].direction[1] * particles[i].speed * delta * movementFactor;
        positions[i3 + 2] += particles[i].direction[2] * particles[i].speed * delta * movementFactor;
        
        // Calculate opacity based on scroll progress
        opacities[i] = particles[i].startOpacity * normalizedProgress;
        
        // Apply gravity effect
        positions[i3 + 1] -= 0.01 * delta * movementFactor; // Slight downward pull
      } else {
        opacities[i] = 0; // Keep invisible until threshold
      }
    }
    
    // Mark attributes for update
    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.geometry.attributes.opacity.needsUpdate = true;
  });
  
  // Create a custom point material with shaders
  const particleMaterial = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(color) },
      },
      vertexShader: `
        attribute float size;
        attribute float opacity;
        varying float vOpacity;
        
        void main() {
          vOpacity = opacity;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying float vOpacity;
        
        void main() {
          float distanceFromCenter = length(gl_PointCoord - 0.5);
          if (distanceFromCenter > 0.5) discard; // Create circular points
          gl_FragColor = vec4(color, vOpacity * (0.5 - distanceFromCenter));
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    
    return material;
  }, [color]);

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-opacity"
          count={count}
          array={opacities}
          itemSize={1}
        />
      </bufferGeometry>
      <primitive object={particleMaterial} />
    </points>
  );
}