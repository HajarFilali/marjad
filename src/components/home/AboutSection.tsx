"use client";

import React from "react";
import AboutPuzzleShowcase from "@/components/home/AboutPuzzleShowcase";

export function AboutSection() {
  return (
    <section id="a-propos" className="pt-5 sm:pt-6 lg:pt-8 pb-10 sm:pb-14 bg-[#ffffff] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* ================= LEFT PART: Description ================= */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c4622d]/10 border border-[#c4622d]/25 text-[#9a4316] text-xs font-bold uppercase tracking-widest">
              <span>À Propos de Marjad</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-serif font-black text-[#1c1917] leading-[1.18]">
              L&apos;Histoire <span className="whitespace-nowrap">d&apos;une Passion</span>{" "}
              <br className="hidden sm:inline" />
              pour <span className="text-[#c4622d]">l&apos;Authenticité</span>
            </h2>

            <p className="text-base sm:text-lg text-[#292524] leading-relaxed font-medium">
              Née d&apos;une passion sincère pour le patrimoine et les métiers d&apos;art marocains, <strong className="text-[#1c1917] font-bold">MARJAD</strong> fait entrer la chaleur, l&apos;âme et l&apos;élégance de l&apos;artisanat traditionnel dans les intérieurs modernes.
            </p>

            <p className="text-sm sm:text-base text-[#44403c] leading-relaxed">
              Chaque création est chinée ou façonnée avec patience auprès de nos maîtres artisans partenaires dans les médinas séculaires de Fès, Marrakech, Meknès et du Moyen Atlas. Nous croyons au respect des matières nobles et de la transmission humaine.
            </p>
          </div>

          {/* ================= RIGHT PART: Jigsaw Puzzle Moroccan Salon ================= */}
          <div className="lg:col-span-6 relative flex justify-center items-center -mt-2 sm:-mt-3 lg:-mt-5">
            <AboutPuzzleShowcase />
          </div>

        </div>
      </div>
    </section>
  );
}
