'use client';

import * as THREE from 'three';
import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

// Custom dissolve material implementation
export default function ScrollTriggeredDissolveMaterial({
  color = '#ffffff',
  emissiveColor = '#9fa4c4',
  noiseScale = 20.0,
  metalness = 0.8,
  roughness = 0.2,
  glowWidth = 0.1,
  glowIntensity = 2.0,
  noiseDetail = 2.0,
  dustScale = 0.2,
  dustAmount = 0.5,
  dustSpeed = 0.1
}) {
  const matRef = useRef();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [time, setTime] = useState(0);
  
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
  
  // Create a custom shader material
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uDissolveProgress: { value: 0 },
        uNoiseScale: { value: noiseScale },
        uColor: { value: new THREE.Color(color) },
        uEmissive: { value: new THREE.Color(emissiveColor) },
        uMetalness: { value: metalness },
        uRoughness: { value: roughness },
        uGlowWidth: { value: glowWidth },
        uGlowIntensity: { value: glowIntensity },
        uTime: { value: 0 },
        uDustScale: { value: dustScale },
        uDustAmount: { value: dustAmount },
        uDustSpeed: { value: dustSpeed },
        uNoiseDetail: { value: noiseDetail },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vUv = uv;
          vPosition = position;
          vNormal = normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uDissolveProgress;
        uniform float uNoiseScale;
        uniform vec3 uColor;
        uniform vec3 uEmissive;
        uniform float uMetalness;
        uniform float uRoughness;
        uniform float uGlowWidth;
        uniform float uGlowIntensity;
        uniform float uTime;
        uniform float uDustScale;
        uniform float uDustAmount;
        uniform float uDustSpeed;
        uniform float uNoiseDetail;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        // 3D Noise function
        float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
        vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
        vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}
        
        float noise(vec3 p){
          vec3 a = floor(p);
          vec3 d = p - a;
          d = d * d * (3.0 - 2.0 * d);
          
          vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
          vec4 k1 = perm(b.xyxy);
          vec4 k2 = perm(k1.xyxy + b.zzww);
          
          vec4 c = k2 + a.zzzz;
          vec4 k3 = perm(c);
          vec4 k4 = perm(c + 1.0);
          
          vec4 o1 = fract(k3 * (1.0 / 41.0));
          vec4 o2 = fract(k4 * (1.0 / 41.0));
          
          vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
          vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);
          
          return o4.y * d.y + o4.x * (1.0 - d.y);
        }
        
        // FBM (Fractal Brownian Motion) for more detailed noise
        float fbm(vec3 p) {
          float sum = 0.0;
          float amp = 1.0;
          float freq = 1.0;
          
          // Add noise octaves
          for(int i = 0; i < 4; i++) {
            sum += amp * noise(freq * p);
            freq *= 2.0;
            amp *= 0.5;
          }
          
          return sum;
        }
        
        // Dust particle function
        float dust(vec3 p, float threshold) {
          float n = fbm(p * uDustScale + vec3(0.0, uTime * uDustSpeed, 0.0));
          return smoothstep(threshold - 0.1, threshold + 0.1, n) * uDustAmount;
        }
        
        void main() {
          // Create complex noise patterns
          float noiseBase = fbm(vPosition * uNoiseScale + vec3(uTime * 0.2));
          float detailNoise = fbm(vPosition * uNoiseScale * uNoiseDetail + vec3(uTime * -0.1));
          
          // Combine noise patterns
          float finalNoise = mix(noiseBase, detailNoise, 0.3);
          
          // Calculate dissolution threshold based on progress
          float threshold = smoothstep(0.0, 1.0, uDissolveProgress);
          
          // Calculate edge glow
          float edge = smoothstep(threshold, threshold + uGlowWidth, finalNoise);
          
          // Calculate dust effect (more visible as dissolution progresses)
          float dustEffect = dust(vPosition, mix(1.0, 0.4, uDissolveProgress));
          
          // Basic lighting calculation
          vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
          float diff = max(dot(vNormal, lightDir), 0.0);
          vec3 diffuse = diff * uColor;
          
          // Metalness effect (reflections)
          vec3 viewDir = normalize(cameraPosition - vPosition);
          vec3 halfDir = normalize(lightDir + viewDir);
          float spec = pow(max(dot(vNormal, halfDir), 0.0), 32.0) * uMetalness;
          
          // Combine all lighting effects
          vec3 finalColor = diffuse + (spec * uColor) + (edge * uEmissive * uGlowIntensity);
          
          // Apply dust effect to color
          finalColor = mix(finalColor, uEmissive * 0.8, dustEffect * uDissolveProgress);
          
          // Discard fragments based on noise and progress
          if (finalNoise < threshold) {
            discard;
          }
          
          // Output final color with metalness and roughness effects
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
  }, [
    color, 
    emissiveColor, 
    noiseScale, 
    metalness, 
    roughness, 
    glowWidth, 
    glowIntensity, 
    dustScale, 
    dustAmount, 
    dustSpeed, 
    noiseDetail
  ]);

  // Store reference to the material
  useEffect(() => {
    if (shaderMaterial) {
      matRef.current = shaderMaterial;
    }
  }, [shaderMaterial]);
  
  // Update material based on animation frame
  useFrame((state, delta) => {
    if (!matRef.current) return;
    
    // Update time for animations
    setTime(prev => prev + delta);
    
    try {
      // Update shader uniforms
      matRef.current.uniforms.uDissolveProgress.value = scrollProgress;
      matRef.current.uniforms.uTime.value = time;
    } catch (error) {
      console.error("Error updating shader uniforms:", error);
    }
  });

  return <primitive object={shaderMaterial} attach="material" />;
}
