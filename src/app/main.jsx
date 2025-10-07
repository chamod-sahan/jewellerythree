"use client";

import { useEffect } from "react";
import WelcomeOverlay from "./components/overlay/Overlay";
import ResponsiveRing from "./components/ResponsiveRing";
import Welcome from "./components/Welcome";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Services from "./components/utils/services";
import CollectionsPage from "./components/utils/collectio";

// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Main() {
    // Initialize scroll-triggered animations
    useEffect(() => {
        // Ensure smooth scrolling
        document.body.style.overflow = 'auto';
        document.body.style.scrollBehavior = 'smooth';
        
        // Create a scroll trigger for the ring section
        ScrollTrigger.create({
            trigger: "#ring-section",
            start: "top bottom",
            end: "bottom top",
            markers: false, // Set to true for debugging
            onEnter: () => {
                console.log("Ring section entered");
                // You can add additional animations here if needed
            }
        });
        
        // Clean up
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div className="scroll-container">
            {/* Initial overlay */}
            <WelcomeOverlay />
            
            {/* Welcome section */}
            <Welcome />
            
            {/* Ring section with dissolve effect */}
            <div className="h-[200vh] relative">
                <div className="sticky top-0 h-screen">
                    <ResponsiveRing />
                </div>
            </div>
            
            {/* Additional content section after ring */}
            <section className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-20 px-8">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold mb-8 text-center">Our Collection</h2>
                    <p className="text-xl mb-12 text-center text-gray-300">
                        Discover our handcrafted pieces made with the finest materials
                    </p>
                    
                    <CollectionsPage/>
                </div>
            </section>
            <Services/>
        </div>
    );
}