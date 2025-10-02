"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function WelcomeOverlay() {
    const overlayRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        if (!overlayRef.current || !textRef.current) return;
        const text = "Jewellery Shop";

        let index = 0;
        let typingInterval;
        let fadeTimeout;
        
        // Start typing animation
        typingInterval = setInterval(() => {
            // Check if textRef.current still exists before trying to access it
            if (!textRef.current) {
                clearInterval(typingInterval);
                return;
            }
            
            if (index <= text.length) {
                textRef.current.textContent = text.slice(0, index);
                index++;
            } else {
                clearInterval(typingInterval);
                // After typing completes, wait 1 second then fade out the overlay
                fadeTimeout = setTimeout(() => {
                    // Check if overlayRef.current still exists before animation
                    if (!overlayRef.current) return;
                    
                    gsap.to(overlayRef.current, {
                        opacity: 0,
                        y: -100,
                        duration: 1.5,
                        ease: "power2.out",
                        onComplete: () => {
                            // Remove overlay from DOM after animation
                            if (overlayRef.current) {
                                overlayRef.current.style.display = 'none';
                            }
                        }
                    });
                }, 1000);
            }
        }, 100);

        // Cleanup function to prevent memory leaks and errors when component unmounts
        return () => {
            clearInterval(typingInterval);
            clearTimeout(fadeTimeout);
        };
    }, []);

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
                boxShadow: 'inset 0 0 100px rgba(255, 215, 0, 0.00001)'
            }}
        >
            <div 
                ref={textRef} 
                className="text-4xl font-bold"
                style={{
                    color: '#e2e8f0',
                    textShadow: '0 0 20px rgba(255, 215, 0, 0.00001), 0 2px 4px rgba(0,0,0,0.5)'
                }}
            ></div>
        </div>
    );
}