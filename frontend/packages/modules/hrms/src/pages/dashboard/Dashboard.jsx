"use client";
import { Link } from "@nextui-org/react";
import Image from "next/image";
import React, { useRef } from "react";

export default function Dashboard() {
  const cards = [
    {
      href: "/prodify/hrms/head-office",
      title: "HO",
      image: "/spslogo.jpeg",
      color: "bg-gradient-to-r from-[#FF920B] to-[#F35C17]",
      textColor: "white",
      description:
        "SPS IT Enabled Service Provider delivers efficient IT solutions, including software development, network management, and cybersecurity, to streamline business operations and enhance productivity. We focus on providing reliable and innovative services tailored to our clients' needs.",
    },
    {
      href: "/prodify/hrms/bijli",
      title: "BIJLI",
      color: "bg-gradient-to-r from-[#556fa8ac] to-[#c94ddd]",
      textColor: "white",
      image: "/jbvnl.jpeg",
      description:
        "The Bijli Vibhag of Ranchi is committed to delivering reliable electricity services and ensuring uninterrupted power supply for the community. We focus on enhancing infrastructure and customer service to meet the growing energy demands of the region.",
    },
    {
      href: "/prodify/hrms/suda",
      title: "SUDA",
      color: "bg-gradient-to-r from-[#65c8d9] to-[#0077A3]",
      image: "/suda.jpeg",
      textColor: "white",
      description:
        "Suda is dedicated to urban development in Ranchi, focusing on infrastructure improvement and sustainable growth. Our mission is to create a better living environment through efficient planning and community services.",
    },
    {
      href: "/prodify/hrms/rmc",
      title: "RMC",
      image: "/RMC.jpeg",
      color: "bg-gradient-to-r from-[#F8CDCD] to-[#95AAD3]",
      textColor: "black",
      description:
        "Ranchi Municipal Corporation (RMC) strives to enhance urban living through efficient civic services and sustainable infrastructure development. Our goal is to create a clean, green, and well-managed city for all residents.",
    },
    {
      href: "/prodify/hrms/bhilai",
      title: "Bhilai",
      image: "/bhilai.jpeg",
      color: "bg-gradient-to-r from-[#9C0E5C] to-[#0077A3]",
      textColor: "white",
      description:
        "Municipal Corporation Bhilai strives to enhance urban living through efficient civic services and sustainable infrastructure development. Our goal is to create a clean, green, and well-managed city for all residents.",
    },
    {
      href: "/prodify/hrms/dmc",
      title: "DMC",
      image: "/dmclogo.png",
      color: "bg-gradient-to-r from-[#AB91C5] to-[#DC5356]",
      textColor: "white",
      description:
        "Dhanbad Municipal Corporation (DMC) is committed to urban development through efficient civic services and sustainable infrastructure. Our goal is to create a vibrant, green, and well-organized city, enhancing the quality of life for all residents.",
    },
    {
      href: "/prodify/hrms/purchases",
      title: "Purchases",
      image: "/purchases.png",
      color: "bg-[#2a2040]",
      textColor: "white",
      description:
        "Our Purchases division manages procurement across all subsidiaries, ensuring efficient, cost-effective sourcing and strong supplier partnerships to support business growth.",
    },
  ];

  // Ref for the horizontal scroll container
  const scrollRef = useRef(null);

  const handleWheel = (e) => {
    if (scrollRef.current) {
      if (scrollRef.current.scrollWidth > scrollRef.current.clientWidth) {
        e.preventDefault();
        scrollRef.current.scrollLeft += e.deltaY * 3;
      }
    }
  };

  // Arrow scroll handlers
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft -= 350; // adjust as needed
    }
  };
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += 350; // adjust as needed
    }
  };

  return (
    <div className="relative flex justify-center items-center w-full h-full min-h-screen overflow-hidden scrollbar-hide">
      {/* Falling Leaves */}
      <div className="z-50 absolute flex justify-center items-center w-full h-full pointer-events-none">
        <div className="top-0 left-0 absolute w-full h-full pointer-events-none">
          <div className="left-[20%] z-50 absolute animate-leaf1">
            <Image
              src="/leaf_01.png"
              alt="leaf"
              width={40}
              height={40}
              className="sm:w-[50px] sm:h-[50px]"
            />
          </div>
          <div className="left-[50%] z-50 absolute animate-leaf2">
            <Image
              src="/leaf_02.png"
              alt="leaf"
              width={40}
              height={40}
              className="sm:w-[50px] sm:h-[50px]"
            />
          </div>
          <div className="left-[70%] z-50 absolute animate-leaf3">
            <Image
              src="/leaf_03.png"
              alt="leaf"
              width={40}
              height={40}
              className="sm:w-[50px] sm:h-[50px]"
            />
          </div>
          <div className="left-[5%] z-50 absolute animate-leaf4">
            <Image
              src="/leaf_04.png"
              alt="leaf"
              width={40}
              height={40}
              className="sm:w-[50px] sm:h-[50px]"
            />
          </div>
        </div>
      </div>

      {/* Background Image */}
      <Image
        src="/bg.jpg"
        alt="Background"
        fill
        style={{ objectFit: "cover" }}
        className="top-0 left-0 z-0 absolute w-full h-full pointer-events-none"
        priority
      />

      {/* Trees Layer */}
      <Image
        src="/trees.png"
        alt="Trees"
        fill
        style={{ objectFit: "cover" }}
        className="top-0 left-0 z-30 absolute w-full h-full pointer-events-none"
        priority
      />

      {/* Moving Girl */}
      <div className="bottom-0 left-1/2 z-20 absolute scale-[0.5] sm:scale-[0.65] -translate-x-1/2 animate-girl pointer-events-none">
        <Image
          src="/girl.png"
          alt="Girl"
          width={180}
          height={360}
          className="sm:w-[300px] sm:h-[600px]"
        />
      </div>

      {/* Visually Appealing Carousel Section */}
      <section className="z-40 relative flex flex-col justify-center items-center w-full h-full scrollbar-hide">
        <div className="relative flex justify-center items-center w-full max-w-[calc(100%-100px)] lg:max-w-5xl">
          {/* Left Arrow */}
          <button
            type="button"
            onClick={scrollLeft}
            className="hidden left-[-24px] sm:left-[-36px] z-50 absolute xs:flex justify-center items-center bg-white/70 hover:bg-[#8f2c24] shadow-lg rounded-full w-10 sm:w-12 h-10 sm:h-12 text-[#8f2c24] hover:text-white transition-all duration-200"
            style={{ top: "50%", transform: "translateY(-50%)" }}
            aria-label="Scroll Left"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                d="M15 19l-7-7 7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="relative flex justify-center items-center w-full">
            {/* Cards Scrollable Row */}
            <div
              className="flex gap-4 sm:gap-8 md:gap-10 px-2 sm:px-4 md:px-6 py-6 sm:py-10 md:py-12 overflow-x-auto snap-mandatory snap-x scrollbar-hide"
              ref={scrollRef}
              onWheel={handleWheel}
              style={{ scrollBehavior: "smooth" }}
            >
              {cards.map((card, idx) => (
                <Link
                  href={card.href}
                  key={card.title}
                  className="snap-center shrink-0"
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className={`
                      relative flex flex-col items-center justify-between
                      rounded-2xl sm:rounded-3xl shadow-2xl border-0
                      ${card.color ? card.color : "bg-[#ddf1ffed]"}
                      transition-transform duration-300 hover:scale-105
                      w-64 h-[340px] sm:w-72 sm:h-[380px] md:w-80 md:h-[420px] group cursor-pointer
                      opacity-80 group-hover:opacity-100
                    `}
                  >
                    {/* Decorative Glow */}
                    <div className="-bottom-8 left-1/2 z-0 absolute bg-gradient-to-r from-[#fbbf24]/60 via-[#8f2c24]/40 to-[#fbbf24]/60 opacity-60 blur-2xl w-32 sm:w-40 h-12 sm:h-16 -translate-x-1/2 pointer-events-none" />

                    {/* Floating Badge */}
                    <span className="top-3 sm:top-5 right-3 sm:right-5 z-10 absolute bg-white/80 group-hover:bg-[#8f2c24] shadow px-2 sm:px-4 py-1 rounded-full font-bold text-[#8f2c24] group-hover:text-white text-xs transition">
                      {card.title}
                    </span>

                    {/* Card Image */}
                    <div className="relative shadow-lg mt-6 mb-2 border-4 border-white group-hover:border-[#fbbf24] rounded-full w-20 sm:w-28 md:w-32 h-20 sm:h-28 md:h-32 overflow-hidden transition-all duration-300">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        style={{ objectFit: "cover" }}
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="z-10 relative flex flex-col items-center px-3 sm:px-6 pt-2 pb-6 sm:pb-8 h-full">
                      <h4 className="drop-shadow mb-2 font-bold group-hover:text-yellow-200 text-base sm:text-xl text-center transition">
                        {card.title}
                      </h4>
                      <p
                        className="opacity-90 group-hover:opacity-100 pr-1 sm:pr-2 max-h-16 sm:max-h-24 overflow-hidden group-hover:overflow-y-auto text-white text-xs sm:text-sm text-center transition scrollbar-hide"
                        onWheel={(e) => {
                          e.stopPropagation();
                          e.stopImmediatePropagation &&
                            e.stopImmediatePropagation();
                        }}
                      >
                        {card.description}
                      </p>
                      <span className="inline-block bg-white/20 group-hover:bg-[#8f2c24] mt-3 sm:mt-4 px-3 sm:px-5 py-1 border border-white/30 rounded-full font-semibold text-white group-hover:text-white text-xs transition">
                        Explore
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          {/* Right Arrow */}
          <button
            type="button"
            onClick={scrollRight}
            className="hidden right-[-24px] sm:right-[-36px] z-50 absolute xs:flex justify-center items-center bg-white/70 hover:bg-[#8f2c24] shadow-lg rounded-full w-10 sm:w-12 h-10 sm:h-12 text-[#8f2c24] hover:text-white transition-all duration-200"
            style={{ top: "50%", transform: "translateY(-50%)" }}
            aria-label="Scroll Right"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                d="M9 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="mt-4 text-white/80 text-xs text-center">
          <span className="bg-black/30 shadow px-4 py-2 rounded-full">
            Scroll horizontally to explore all departments
          </span>
        </div>
      </section>
    </div>
  );
}
