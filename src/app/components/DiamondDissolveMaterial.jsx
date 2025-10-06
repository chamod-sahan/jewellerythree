'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Custom transparent diamond material with red and blue sparkle effects
export default function DiamondDissolveMaterial({
  blueSparkle = true,
  redSparkle = true,
  transparency = 0.7,
  blueColor = '#2040ff',
  redColor = '#ff2040'
}) {
  const [time, setTime] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const materialRef = useRef();

  // Listen for scroll events to update the scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      // Match the same dissolve rate as the main ring material
      const maxScroll = windowHeight * 1.2; 
      
      // Apply the same easing function as the main ring
      let progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      // Apply cubic easing for more dramatic dissolve
      progress = progress * progress * (3 - 2 * progress);
      
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Create a custom shader material for the diamonds
  const diamondMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uDissolveProgress: { value: 0 },
        uTransparency: { value: transparency }, // Configurable transparency
        uRedColor: { value: new THREE.Color(redColor) }, // Red sparkle color
        uBlueColor: { value: new THREE.Color(blueColor) }, // Blue sparkle color
        uWhiteColor: { value: new THREE.Color('#ffffff') }, // White base
        uNoiseScale: { value: 30.0 },
        uGlowIntensity: { value: 5.0 },
        uRefractionStrength: { value: 0.15 },
        uEnableRedSparkle: { value: redSparkle ? 1.0 : 0.0 },
        uEnableBlueSparkle: { value: blueSparkle ? 1.0 : 0.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uDissolveProgress;
        uniform float uTransparency;
        uniform vec3 uRedColor;
        uniform vec3 uBlueColor;
        uniform vec3 uWhiteColor;
        uniform float uNoiseScale;
        uniform float uGlowIntensity;
        uniform float uRefractionStrength;
        uniform float uEnableRedSparkle;
        uniform float uEnableBlueSparkle;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        
        // Noise functions
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
        
        // FBM for more detailed noise
        float fbm(vec3 p) {
          float sum = 0.0;
          float amp = 1.0;
          float freq = 1.0;
          
          for(int i = 0; i < 5; i++) {
            sum += amp * noise(freq * p);
            freq *= 2.0;
            amp *= 0.5;
          }
          
          return sum;
        }
        
        // Fresnel effect for edge glow
        float fresnel(vec3 viewDirection, vec3 normal, float power) {
          return pow(1.0 - clamp(dot(viewDirection, normal), 0.0, 1.0), power);
        }
        
        void main() {
          // Calculate view direction for reflections
          vec3 viewDirection = normalize(vViewPosition);
          
          // Generate noise patterns at different scales
          float noiseBase = fbm(vPosition * uNoiseScale + vec3(uTime * 0.2));
          float noiseFast = fbm(vPosition * uNoiseScale * 2.0 + vec3(uTime * 0.5));
          float noiseRefraction = fbm(vPosition * uNoiseScale * 0.5 - vec3(uTime * 0.1));
          
          // Calculate dissolution threshold with more aggressive dissolve
          float threshold = smoothstep(0.0, 0.8, uDissolveProgress * 1.2);
          
          // Calculate edge glow with fresnel, making the edge wider as dissolve progresses
          float edgeFresnel = fresnel(viewDirection, vNormal, 2.0);
          float edgeWidth = mix(0.1, 0.2, uDissolveProgress); // Wider edge as it dissolves
          float edge = smoothstep(threshold - edgeWidth, threshold + edgeWidth, noiseBase);
          
          // Calculate sparkle effect
          float sparkleRed = pow(noise(vPosition * 50.0 + vec3(uTime * 0.3)), 10.0) * uEnableRedSparkle;
          float sparkleBlue = pow(noise(vPosition * 60.0 - vec3(uTime * 0.25)), 10.0) * uEnableBlueSparkle;
          
          // Refraction effect
          float refraction = noiseRefraction * uRefractionStrength;
          
          // Mix red and blue sparkles
          vec3 baseColor = uWhiteColor;
          vec3 sparkleColor = baseColor;
          
          // Apply red sparkles if enabled
          if (uEnableRedSparkle > 0.5) {
            sparkleColor = mix(sparkleColor, uRedColor, sparkleRed * 0.8);
          }
          
          // Apply blue sparkles if enabled
          if (uEnableBlueSparkle > 0.5) {
            sparkleColor = mix(sparkleColor, uBlueColor, sparkleBlue * 0.8);
          }
          
          // Final color calculation with transparency
          vec3 finalColor = sparkleColor;
          
          // Determine edge colors based on enabled sparkle types
          vec3 edgeColor1 = uWhiteColor;
          vec3 edgeColor2 = uWhiteColor;
          
          if (uEnableRedSparkle > 0.5) {
            edgeColor1 = uRedColor;
          }
          if (uEnableBlueSparkle > 0.5) {
            edgeColor2 = uBlueColor;
          }
          
          // If both sparkle types are enabled, use both colors for edges
          if (uEnableRedSparkle > 0.5 && uEnableBlueSparkle > 0.5) {
            // Increase edge brightness with shifting colors
            finalColor += edge * uGlowIntensity * mix(edgeColor1, edgeColor2, sin(uTime) * 0.5 + 0.5);
            
            // Add fresnel-based edge highlighting with shifting colors
            finalColor += edgeFresnel * mix(edgeColor1, edgeColor2, cos(uTime * 0.5) * 0.5 + 0.5) * 0.5;
          } else {
            // If only one color is enabled or none, use single color for edges
            vec3 singleEdgeColor = mix(edgeColor1, edgeColor2, 0.5);
            finalColor += edge * uGlowIntensity * singleEdgeColor;
            finalColor += edgeFresnel * singleEdgeColor * 0.5;
          }
          
          // Calculate alpha based on noise and dissolution
          float alpha = mix(uTransparency, 1.0, edge * 0.7);
          
          // Discard fully transparent pixels
          if (noiseBase < threshold - 0.05) {
            discard;
          }
          
          // Output final color with transparency
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }, [blueSparkle, redSparkle, transparency, blueColor, redColor]);
  
  // Store reference to the material
  useEffect(() => {
    if (diamondMaterial) {
      materialRef.current = diamondMaterial;
    }
  }, [diamondMaterial]);
  
  // Update material based on animation frame
  useFrame((state, delta) => {
    if (!materialRef.current) return;
    
    // Update time for animations
    setTime(prev => prev + delta);
    
    try {
      // Update shader uniforms
      materialRef.current.uniforms.uTime.value = time;
      materialRef.current.uniforms.uDissolveProgress.value = scrollProgress;
    } catch (error) {
      console.error("Error updating diamond shader uniforms:", error);
    }
  });

  return <primitive object={diamondMaterial} attach="material" />;
}