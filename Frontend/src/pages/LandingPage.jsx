import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

const HeroSection = () => {
  const starwayRef = useRef(null);
  const webDigitalRef = useRef(null);

  useEffect(() => {
    const starwayText = "Starway";
    const webDigitalText = "Web Digital";

    gsap.to(starwayRef.current, {
      duration: 2,
      text: starwayText,
      ease: "power2.inOut",
    });

    gsap.to(webDigitalRef.current, {
      duration: 2,
      delay: 0.5,
      text: webDigitalText,
      ease: "power2.inOut",
    });
  }, []);

  return (
    <section className="bg-[#121212] text-amber-100 min-h-screen py-24 relative">
      <div className="container mx-auto px-6">
        <h1 className="text-[250px] font-bold overflow-hidden" ref={starwayRef}>
          Starway
        </h1>
        <h1
          className="text-[200px] pl-60 -mt-10 font-bold mb-8 overflow-hidden"
          ref={webDigitalRef}
        >
          Web Digital
        </h1>
        <div className="absolute bottom-12 left-12">
          <p className="text-xl">
            {`{ GSAP - A wildly robust JavaScript animation library built for professionals }`}
          </p>
        </div>
        <div className="absolute bottom-20 right-20">
          <svg
            width="100"
            height="150"
            viewBox="0 0 50 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M25.0147 0C11.1977 0 0 11.1977 0 25.0147C0 38.8316 11.1977 50.0293 25.0147 50.0293C38.8316 50.0293 50.0293 38.8316 50.0293 25.0147C50.0293 11.1977 38.8316 0 25.0147 0ZM25.0147 41.6939C15.7941 41.6939 8.33594 34.2358 8.33594 25.0147C8.33594 15.7941 15.7941 8.33594 25.0147 8.33594C34.2358 8.33594 41.6939 15.7941 41.6939 25.0147C41.6939 34.2358 34.2358 41.6939 25.0147 41.6939Z"
              fill="#E0AED8"
            />
            <path
              d="M25.0147 50.0293C11.1977 50.0293 0 61.227 0 75.0442C0 88.8611 11.1977 100.059 25.0147 100.059C38.8316 100.059 50.0293 88.8611 50.0293 75.0442C50.0293 61.227 38.8316 50.0293 25.0147 50.0293ZM25.0147 91.7235C15.7941 91.7235 8.33594 84.2654 8.33594 75.0442C8.33594 65.8236 15.7941 58.3654 25.0147 58.3654C34.2358 58.3654 41.6939 65.8236 41.6939 75.0442C41.6939 84.2654 34.2358 91.7235 25.0147 91.7235Z"
              fill="#E0AED8"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
