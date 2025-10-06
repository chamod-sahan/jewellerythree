"use client";

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import GoldenRing from "./GoldenRing";

export default function Welcome() {
    const [isMounted, setIsMounted] = useState(false);
    
    // State to trigger re-renders on resize
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    
    useEffect(() => {
        setIsMounted(true);
        
        // Initialize window size
        if (typeof window !== 'undefined') {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
            
            // Handle resize events
            const handleResize = () => {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight
                });
            };
            
            window.addEventListener('resize', handleResize);
            
            // Clean up
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);
    // Function to determine responsive parameters based on screen size for perfect centering
    const getResponsiveValues = () => {
        // Default values for mobile
        let ringScale = 1.0;
        let ringPosition = [0, 0, 0];
        let ringRotation = [0, Math.PI / 2, 0]; // Default rotation
        
        // Use window.innerWidth to determine screen size if in browser
        if (typeof window !== 'undefined') {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const aspectRatio = width / height;
            
            if (width >= 1280) {
                // Large desktop screens
                ringScale = 2.5;
                // Center position adjusted for large screens
                ringPosition = [0, 0.5, 0];
            } else if (width >= 1024) {
                // Desktop screens
                ringScale = 2.2;
                ringPosition = [0, 0.5, 0];
            } else if (width >= 768) {
                // Tablet screens
                ringScale = 1.8;
                ringPosition = [0, 0.3, 0];
            } else if (width >= 640) {
                // Large mobile screens
                ringScale = 1.5;
                ringPosition = [0, 0.2, 0];
            } else {
                // Small mobile screens
                ringScale = 1.2;
                ringPosition = [0, 0.1, 0];
            }
            
            // Adjust position based on aspect ratio to maintain center
            if (aspectRatio > 1.5) {
                ringPosition[1] += 0.2; // Move up slightly on wider screens
            } else if (aspectRatio < 1) {
                ringPosition[1] -= 0.2; // Move down slightly on taller screens
            }
        }
        
        return { ringScale, ringPosition, ringRotation };
    };
    
    // Get responsive values with default fallbacks for SSR
    const { ringScale, ringPosition, ringRotation } = isMounted ? getResponsiveValues() : { ringScale: 2.2, ringPosition: [0, 0.5, 0], ringRotation: [0, Math.PI / 2, 0] };
    
    return (
        <section 
            className="h-screen flex flex-col items-center justify-center relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 40%, #111111 100%)',
                boxShadow: 'inset 0 0 300px rgba(255, 215, 0, 0.05)',
                position: 'relative',
                isolation: 'isolate' // Creates a new stacking context
            }}
        >
            <h1 
                className="text-6xl font-bold mb-6 text-center relative z-10"
                style={{
                    color: '#e2e8f0',
                    textShadow: '0 0 30px rgba(255, 215, 0, 0.00001), 0 4px 8px rgba(0,0,0,0.5)',
                    position: 'relative'
                }}
            >
                Welcome Jewelry Shop
            </h1>
            <div 
                className="text-2xl font-medium mb-8 text-center relative z-10"
                style={{
                    color: '#cbd5e1',
                    textShadow: '0 0 20px rgba(255, 215, 0, 0.00001), 0 2px 4px rgba(0,0,0,0.3)',
                    position: 'relative'
                }}
            >
                Where Dreams Meet Diamonds
            </div>
            <p 
                className="mt-4 text-lg max-w-2xl text-center leading-relaxed relative z-10"
                style={{
                    color: '#94a3b8',
                    textShadow: '0 0 15px rgba(255, 215, 0, 0.00001), 0 1px 2px rgba(0,0,0,0.3)',
                    position: 'relative'
                }}
            >
                Discover exquisite designs and timeless elegance with our curated collection of fine jewelry. 
                From sparkling diamonds to precious gemstones, each piece tells a unique story of craftsmanship and beauty.
            </p>
            <div className="mt-8 flex gap-4 relative z-10">
                <button 
                    className="px-8 py-3 font-semibold rounded-lg transition-all duration-300"
                    style={{
                        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                        color: '#e2e8f0',
                        border: '1px solid rgba(255, 215, 0, 0.00001)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3), inset 0 0 20px rgba(255, 215, 0, 0.00001)'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.4), inset 0 0 30px rgba(255, 215, 0, 0.00001)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0px)';
                        e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3), inset 0 0 20px rgba(255, 215, 0, 0.00001)';
                    }}
                >
                    Explore Collection
                </button>
                <button 
                    className="px-8 py-3 font-semibold rounded-lg transition-all duration-300"
                    style={{
                        background: 'transparent',
                        color: '#e2e8f0',
                        border: '2px solid #475569',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3), inset 0 0 20px rgba(255, 215, 0, 0.00001)'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.background = 'linear-gradient(135deg, #475569 0%, #64748b 100%)';
                        e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.4), inset 0 0 30px rgba(255, 215, 0, 0.00001)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0px)';
                        e.target.style.background = 'transparent';
                        e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3), inset 0 0 20px rgba(255, 215, 0, 0.00001)';
                    }}
                >
                    Learn More
                </button>
            </div>
            {/* Ring Model with Canvas - Direct implementation */}
            <div 
                className="absolute inset-0 w-full h-full"
                style={{ 
                    zIndex: -5,  /* Set to 0 for better visibility */
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    pointerEvents: 'none',
                }}
            >
                {isMounted && (
                    <Canvas
                        shadows
                        dpr={[1, 2]}
                        camera={{ 
                            position: [-2, 5, 8], // Increased distance for better full ring view
                            fov: isMounted && window.innerWidth < 768 ? 70 : 120, // Higher FOV for better visibility
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
                            alpha: true
                        }}
                    >
                        <Suspense fallback={null}>
                            {/* Premium studio lighting for centered dark silver ring */}
                            <ambientLight intensity={0.3} color="#ffffff" />
                            
                            {/* Main frontal key light - positioned for centered ring */}
                            <spotLight
                                position={[0, 0, 10]}
                                angle={0.3}
                                penumbra={0.9}
                                intensity={6.0}
                                castShadow
                                shadow-mapSize={[2048, 2048]}
                                color="#ffffff"
                            />
                            
                            {/* Edge highlighting light from top-right */}
                            <spotLight
                                position={[8, 5, 4]}
                                angle={0.4}
                                penumbra={0.7}
                                intensity={5.0}
                                castShadow
                                shadow-mapSize={[2048, 2048]}
                                color="#fafafa"
                            />
                            
                            {/* Edge highlighting light from top-left */}
                            <spotLight
                                position={[-8, 5, 4]}
                                angle={0.4}
                                penumbra={0.7}
                                intensity={5.0}
                                castShadow
                                shadow-mapSize={[2048, 2048]}
                                color="#fafafa"
                            />
                            
                            {/* Circular rim light from behind - creates halo effect */}
                            <spotLight
                                position={[0, 0, -8]}
                                angle={0.5}
                                penumbra={0.6}
                                intensity={4.0}
                                castShadow={false}
                                color="#ffffff"
                            />
                            
                            {/* Fill light from below for detail visibility */}
                            <pointLight position={[0, -5, 5]} intensity={2.0} color="#ffffff" distance={15} />
                            
                            {/* Detail highlighting lights positioned around the ring */}
                            <pointLight position={[5, 0, 3]} intensity={1.5} color="#ffffff" distance={10} />
                            <pointLight position={[-5, 0, 3]} intensity={1.5} color="#ffffff" distance={10} />
                            <pointLight position={[0, 5, 3]} intensity={1.5} color="#ffffff" distance={10} />
                            
                            {/* Enhanced environment for premium reflections */}
                            <Environment preset="studio" intensity={3.0} />
                            
                            {/* Perfectly centered ring with dark premium look */}
                            <group 
                                position={ringPosition}
                                rotation={ringRotation}
                                scale={ringScale}
                            >
                                <GoldenRing />
                            </group>
                            
                            {/* Premium Contact Shadows optimized for centered ring */}
                            <ContactShadows 
                                position={[0, -4, 0]} 
                                opacity={0.5} 
                                scale={25} 
                                blur={3.0}
                                far={8}
                                resolution={2048}
                                color="#000000"
                            />
                            
                            {/* Controls - Auto-rotation disabled */}
                            <OrbitControls 
                                enableZoom={false}
                                enablePan={false}
                                autoRotate={false}
                                enableRotate={false}
                            />
                        </Suspense>
                    </Canvas>
                )}
            </div>
        </section>
    );
}