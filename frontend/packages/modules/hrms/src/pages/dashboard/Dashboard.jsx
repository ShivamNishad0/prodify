"use client";
import { Link } from "@nextui-org/react";
import Image from "next/image";
import React, { useRef } from "react";

export default function Dashboard() {
  const cards = [
    {
      href: "/prodify/hrms/head-office",
      title: "Full HRMS Control",
      image: "/spslogo.jpeg",
      color: "bg-gradient-to-r from-[#2a2040] to-[#0077A3]",
      textColor: "white",
      description:
        "Centralized HRMS dashboard providing full administrative control over all organizations, employees, attendance, and payroll from a single unified interface.",
    },
  ];

  return (
    <div className="relative flex flex-col justify-center items-center w-full min-h-screen bg-gray-50 overflow-hidden">
      <div className="relative flex justify-center items-center w-full max-w-5xl">
        {cards.map((card, idx) => (
          <Link
            href={card.href}
            key={card.title}
            style={{ textDecoration: "none" }}
          >
            <div
              className={`
                relative flex flex-col items-center justify-between
                rounded-2xl sm:rounded-3xl shadow-2xl border-0
                ${card.color ? card.color : "bg-[#ddf1ffed]"}
                transition-transform duration-300 hover:scale-105
                w-72 h-[380px] md:w-80 md:h-[420px] group cursor-pointer
                opacity-100
              `}
            >
              {/* Decorative Glow */}
              <div className="-bottom-8 left-1/2 z-0 absolute bg-gradient-to-r from-[#fbbf24]/60 via-[#8f2c24]/40 to-[#fbbf24]/60 opacity-60 blur-2xl w-32 sm:w-40 h-12 sm:h-16 -translate-x-1/2 pointer-events-none" />

              {/* Floating Badge */}
              <span className="top-5 right-5 z-10 absolute bg-white/80 group-hover:bg-[#8f2c24] shadow px-4 py-1 rounded-full font-bold text-[#8f2c24] group-hover:text-white text-xs transition">
                {card.title}
              </span>

              {/* Card Image */}
              <div className="relative shadow-lg mt-8 mb-2 border-4 border-white group-hover:border-[#fbbf24] rounded-full w-28 md:w-32 h-28 md:h-32 overflow-hidden transition-all duration-300">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  style={{ objectFit: "cover" }}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Card Content */}
              <div className="z-10 relative flex flex-col items-center px-6 pt-2 pb-8 h-full">
                <h4 className="drop-shadow mb-3 font-bold group-hover:text-yellow-200 text-xl text-center transition">
                  {card.title}
                </h4>
                <p className="opacity-90 group-hover:opacity-100 pr-2 max-h-24 overflow-hidden group-hover:overflow-y-auto text-white text-sm text-center transition scrollbar-hide">
                  {card.description}
                </p>
                <span className="inline-block bg-white/20 group-hover:bg-[#8f2c24] mt-5 px-5 py-1 border border-white/30 rounded-full font-semibold text-white group-hover:text-white text-xs transition">
                  Open HRMS
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
