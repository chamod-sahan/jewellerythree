"use client";
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

const SilverDissolveShader = shaderMaterial(
    // Uniforms
    {
        uProgress: 0,
        uNoiseScale: 5.0,
        uColor: new THREE.Color('white'), // Base color for silver
        metalness: 1.0,
        roughness: 0.2,
    },
    // Vertex Shader
    `
    varying vec3 vPosition;
    void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    // Fragment Shader
    `
    uniform float uProgress;
    uniform float uNoiseScale;
    uniform vec3 uColor;
    uniform float metalness;
    uniform float roughness;
    varying vec3 vPosition;

    // Simple noise function
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    void main() {
        float noise = rand(vPosition.xy * uNoiseScale);
        
        if (noise > uProgress) {
            discard;
        }

        // Basic lighting
        vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
        float diff = max(dot(normal, lightDir), 0.0);
        vec3 diffuse = diff * uColor;

        gl_FragColor = vec4(diffuse * metalness, 1.0);
    }
    `
);

extend({ SilverDissolveShader });

export default function SilverDissolveMaterial({ duration = 2, visible = true }) {
    const matRef = useRef();

    useFrame((_state, delta) => {
        if (!matRef.current) return;
        const target = visible ? 1 : 0;
        matRef.current.uniforms.uProgress.value += (target - matRef.current.uniforms.uProgress.value) * (delta / duration);
    });

    return <silverDissolveShader ref={matRef} attach="material" />;
}
