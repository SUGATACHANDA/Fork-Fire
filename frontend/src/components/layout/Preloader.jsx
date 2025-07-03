import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import AnimatedPotIcon from '../common/AnimatedPotIcon';

const WITTY_PHRASES = [
    "Prepping the pixels...",
    "Simmering the styles...",
    "Chopping the components...",
    "Garnishing the layout...",
    "Plating your experience...",
];

const Preloader = ({ onComplete }) => {
    const preloaderRef = useRef(null);
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const [phraseIndex, setPhraseIndex] = useState(0);

    useEffect(() => {
        // This is a reference to the timer so we can clear it on cleanup
        let intervalId;

        // This timeline controls the initial fade-in and the final fade-out
        const masterTl = gsap.timeline({
            // When this master timeline completes, it calls the function from App.jsx
            onComplete: onComplete
        });

        masterTl.from(containerRef.current, {
            autoAlpha: 0,
            y: 30,
            duration: 0.8,
            ease: 'power2.out',
        });

        // Set up a repeating timer to cycle through the witty phrases
        intervalId = setInterval(() => {
            // Animate the current text out
            gsap.to(textRef.current, {
                autoAlpha: 0,
                y: -10,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    // Update the phrase index
                    setPhraseIndex(prevIndex => (prevIndex + 1) % WITTY_PHRASES.length);
                    // Animate the new text in
                    gsap.fromTo(textRef.current,
                        { y: 10, autoAlpha: 0 },
                        { y: 0, autoAlpha: 1, duration: 0.3, ease: 'power2.out' }
                    );
                }
            });
        }, 1500); // Cycle phrases every 1.5 seconds

        // Schedule the final fade-out animation on the master timeline
        // This ensures there's a minimum display time for the preloader.
        masterTl.to(preloaderRef.current, {
            autoAlpha: 0,
            duration: 0.8,
            ease: 'power2.inOut',
        }, ">4.5"); // Wait at least 4.5 seconds before starting the fade-out

        // Cleanup function to stop the timer when the component unmounts
        return () => {
            clearInterval(intervalId);
        };

    }, [onComplete]);

    return (
        <div ref={preloaderRef} className="fixed inset-0 z-[200] flex items-center justify-center bg-background">
            <div ref={containerRef} className="flex flex-col items-center justify-center">
                <AnimatedPotIcon />
                <p ref={textRef} className="text-lg font-semibold text-secondary-text font-sans">
                    {WITTY_PHRASES[phraseIndex]}
                </p>
            </div>
        </div>
    );
};

export default Preloader;