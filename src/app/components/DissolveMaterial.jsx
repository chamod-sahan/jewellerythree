// src/app/components/DissolveMaterial.jsx
'use client';

import * as THREE from 'three';
import { useRef } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

const DissolveShader = shaderMaterial(
  {
    uProgress: 0,
    uColor: new THREE.Color('#eb5a13'),
    uThickness: 0.1,
    uIntensity: 50,
  },
  // Vertex Shader
  `
    varying vec3 vWorldPosition;
    void main() {
      vWorldPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader (with built-in noise)
  `
    uniform float uProgress;
    uniform vec3 uColor;
    uniform float uThickness;
    uniform float uIntensity;
    varying vec3 vWorldPosition;

    // Hash-based noise
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
      // Use world position for noise (scaled)
      vec2 noiseCoord = vWorldPosition.xz * 3.0;
      float n = noise(noiseCoord);

      // Normalize noise to [0,1]
      n = (n + 1.0) * 0.5;

      float progress = uProgress;
      float alpha = step(1.0 - progress, n);
      float border = step((1.0 - progress) - uThickness, n) - alpha;

      vec3 finalColor = mix(vec3(1.0), uColor * uIntensity, border);
      gl_FragColor = vec4(finalColor, alpha + border);
    }
  `
);

extend({ DissolveShaderImpl: DissolveShader });

export default function DissolveMaterial({
  color = '#eb5a13',
  thickness = 0.1,
  intensity = 50,
  duration = 1.2,
  visible = true,
  onFadeOut,
}) {
  const matRef = useRef();

  useFrame((state, delta) => {
    if (!matRef.current) return;

    const target = visible ? 1 : 0;
    // Simple linear interpolation (replace maath.damp)
    matRef.current.uProgress += (target - matRef.current.uProgress) * (delta / duration);

    if (matRef.current.uProgress < 0.1 && onFadeOut) {
      onFadeOut();
    }
  });

  return (
    <dissolveShaderImpl
      ref={matRef}
      uColor={new THREE.Color(color)}
      uThickness={thickness}
      uIntensity={intensity}
      transparent
      side={THREE.DoubleSide}
    />
  );
}