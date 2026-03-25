"use client";

import Image from "next/image";
import { useSyncExternalStore, useRef } from "react";
import ReviewList from "./reviews/ReviewList";

/**
 * ScrollStorySection component
 * Uses a pure JS scroll listener (no Framer Motion useScroll) to
 * calculate progress and drive phase opacity/position. This is the
 * most reliable approach across all browsers and frameworks.
 */

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function mapRange(v: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  const t = clamp((v - inMin) / (inMax - inMin), 0, 1);
  return lerp(outMin, outMax, t);
}

function phaseOpacity(
  p: number,
  fadeIn: number,
  holdStart: number,
  holdEnd: number,
  fadeOut: number
) {
  if (p < fadeIn || p > fadeOut) return 0;
  if (p < holdStart) return mapRange(p, fadeIn, holdStart, 0, 1);
  if (p > holdEnd) return mapRange(p, holdEnd, fadeOut, 1, 0);
  return 1;
}

function phaseY(p: number, fadeIn: number, holdStart: number, holdEnd: number, fadeOut: number) {
  if (p < fadeIn) return 50;
  if (p < holdStart) return mapRange(p, fadeIn, holdStart, 50, 0);
  if (p <= holdEnd) return 0;
  if (p <= fadeOut) return mapRange(p, holdEnd, fadeOut, 0, -50);
  return -50;
}

// Background color stops
const BG_STOPS = [
  { at: 0, c: [250, 250, 250] },
  { at: 0.25, c: [254, 252, 232] },
  { at: 0.5, c: [253, 242, 248] },
  { at: 0.75, c: [239, 246, 255] },
  { at: 1.0, c: [255, 255, 255] },
];

function getBg(p: number): string {
  let i = 0;
  for (; i < BG_STOPS.length - 1; i++) {
    if (p <= BG_STOPS[i + 1].at) break;
  }
  const from = BG_STOPS[i];
  const to = BG_STOPS[Math.min(i + 1, BG_STOPS.length - 1)];
  const t = clamp((p - from.at) / (to.at - from.at), 0, 1);
  return `rgb(${Math.round(lerp(from.c[0], to.c[0], t))},${Math.round(
    lerp(from.c[1], to.c[1], t)
  )},${Math.round(lerp(from.c[2], to.c[2], t))})`;
}

// Phase timing: [fadeInStart, holdStart, holdEnd, fadeOutEnd]
const P = {
  hero: [0, 0, 0.1, 0.18] as const,
  phil: [0.15, 0.22, 0.32, 0.4] as const,
  prog: [0.35, 0.42, 0.52, 0.6] as const,
  trust: [0.55, 0.62, 0.72, 0.8] as const,
  cta: [0.72, 0.8, 1.0, 1.0] as const,
};

function getScrollProgress(containerRef: React.RefObject<HTMLDivElement | null>) {
  if (typeof window === "undefined" || !containerRef.current) return 0;
  const rect = containerRef.current.getBoundingClientRect();
  const scrollTop = -rect.top;
  const scrollHeight = rect.height - window.innerHeight;
  if (scrollHeight <= 0) return 0;
  return clamp(scrollTop / scrollHeight, 0, 1);
}

function subscribeToScroll(onStoreChange: () => void) {
  let rafId: number | null = null;
  const onChange = () => {
    if (rafId !== null) return;
    rafId = window.requestAnimationFrame(() => {
      rafId = null;
      onStoreChange();
    });
  };

  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);

  return () => {
    if (rafId !== null) window.cancelAnimationFrame(rafId);
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

export default function ScrollStorySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useSyncExternalStore(
    subscribeToScroll,
    () => getScrollProgress(containerRef),
    () => 0
  );

  const hO = phaseOpacity(progress, ...P.hero);
  const hY = phaseY(progress, ...P.hero);
  const pO = phaseOpacity(progress, ...P.phil);
  const pY = phaseY(progress, ...P.phil);
  const prO = phaseOpacity(progress, ...P.prog);
  const prY = phaseY(progress, ...P.prog);
  const tO = phaseOpacity(progress, ...P.trust);
  const tY = phaseY(progress, ...P.trust);
  const cBaseO = phaseOpacity(progress, ...P.cta);
  const cFadeOut = mapRange(progress, 0.985, 1, 1, 0);
  const cO = cBaseO * cFadeOut;
  const cY = phaseY(progress, ...P.cta);
  const reviewReveal = mapRange(progress, 0.985, 1, 0, 1);

  return (
    <>
      <div
        ref={containerRef}
        style={{ height: "430vh", backgroundColor: getBg(progress) }}
        className="relative w-full transition-colors duration-100"
      >
        {/* Sticky viewport pinned while user scrolls */}
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Ambient Shapes */}
          <div
            className="absolute top-10 left-[-10%] w-[30vw] h-[30vw] min-w-[200px] min-h-[200px] bg-white rounded-full opacity-40 blur-3xl pointer-events-none"
            style={{ transform: `translateY(${progress * 30}vh)` }}
          />
          <div
            className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] min-w-[300px] min-h-[300px] bg-white rounded-full opacity-30 blur-3xl pointer-events-none"
            style={{ transform: `translateY(${progress * -40}vh)` }}
          />

          {/* Phase 1: Hero */}
          {hO > 0 && (
            <div
              className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 md:px-10 transition-none"
              style={{
                opacity: hO,
                transform: `translateY(${hY}px) scale(${1 - (1 - hO) * 0.03})`,
              }}
            >
              <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 items-center gap-8 md:gap-10">
                <div className="text-center lg:text-left">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-tight mb-4 md:mb-6">
                    Where Little Minds <br className="hidden md:block" /> Blossom
                  </h1>
                  <div className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto lg:mx-0">
                    A safe, nurturing space for early learning.
                  </div>
                </div>
                <div className="w-full max-w-xl lg:max-w-2xl mx-auto rounded-3xl overflow-hidden border border-white/80 bg-white shadow-xl aspect-[16/9]">
                  <Image
                    src="/images/newhero.png"
                    alt="Children and teacher in front of a playful school building"
                    width={1600}
                    height={900}
                    priority
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Phase 2: Philosophy */}
          {pO > 0 && (
            <div
              className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 md:px-10 transition-none"
              style={{
                opacity: pO,
                transform: `translateY(${pY}px)`,
              }}
            >
              <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 items-center gap-8 md:gap-10">
                <div className="order-2 lg:order-1 text-center lg:text-left">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-6">
                    We nurture <span className="text-pink-400">curiosity</span>, <br />
                    <span className="text-amber-400">creativity</span>, and <br />
                    <span className="text-blue-400">confidence</span>.
                  </h2>
                  <div className="w-24 h-1 bg-gray-200 rounded-full mb-6 mx-auto lg:mx-0" />
                  <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-xl leading-relaxed mx-auto lg:mx-0">
                    Our approach is built around your child&apos;s natural sense of wonder, giving
                    them the emotional and cognitive foundation they need to thrive.
                  </p>
                </div>
                <div className="order-1 lg:order-2 w-full max-w-xl lg:max-w-2xl mx-auto rounded-3xl overflow-hidden border border-white/80 bg-white shadow-xl aspect-[16/9]">
                  <Image
                    src="/images/newlearning.png"
                    alt="Teacher guiding children through reading and art"
                    width={1600}
                    height={900}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Phase 3: Programs */}
          {prO > 0 && (
            <div
              className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 md:px-10 transition-none"
              style={{
                opacity: prO,
                transform: `translateY(${prY}px) scale(${0.95 + prO * 0.05})`,
              }}
            >
              <div className="w-full max-w-6xl text-center">
                <p className="text-xs sm:text-sm font-bold tracking-widest text-gray-400 uppercase mb-4">
                  Our Programs
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-800">
                  <span className="relative group cursor-default">
                    Playgroup
                    <span className="absolute -bottom-2 left-0 w-0 h-1 bg-pink-300 transition-all group-hover:w-full" />
                  </span>
                  <span className="hidden md:block text-gray-300">&bull;</span>
                  <span className="relative group cursor-default">
                    Nursery
                    <span className="absolute -bottom-2 left-0 w-0 h-1 bg-amber-300 transition-all group-hover:w-full" />
                  </span>
                  <span className="hidden md:block text-gray-300">&bull;</span>
                  <span className="relative group cursor-default">
                    Kindergarten
                    <span className="absolute -bottom-2 left-0 w-0 h-1 bg-blue-300 transition-all group-hover:w-full" />
                  </span>
                </div>
                <div className="mt-8 sm:mt-10 w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border border-white/70 bg-white shadow-xl aspect-[21/9]">
                  <Image
                    src="/images/newrationhall.png"
                    alt="Children in different classroom learning zones"
                    width={1600}
                    height={900}
                    loading="lazy"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Phase 4: Trust */}
          {tO > 0 && (
            <div
              className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 md:px-10 transition-none"
              style={{
                opacity: tO,
                transform: `translateY(${tY}px)`,
              }}
            >
              <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 items-center gap-8 md:gap-10">
                <div className="w-full max-w-xl lg:max-w-2xl mx-auto rounded-3xl overflow-hidden border border-white/70 bg-white shadow-xl aspect-[16/9]">
                  <Image
                    src="/images/newteach.png"
                    alt="School teacher welcoming children in a safe campus"
                    width={1600}
                    height={900}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center lg:text-left">
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                    Safe. <br /> Caring. <br /> Experienced.
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-md bg-white/60 backdrop-blur-sm p-5 sm:p-6 rounded-3xl shadow-sm border border-white mx-auto lg:mx-0">
                    Qualified teachers and a joyful environment designed specifically to give
                    parents complete peace of mind.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Phase 5: Contact CTA */}
          {cO > 0 && (
            <div
              className="absolute inset-0 flex items-center justify-center text-center px-4 sm:px-6 md:px-10 transition-none"
              style={{
                opacity: cO,
                transform: `translateY(${cY}px)`,
              }}
            >
              <div className="bg-white/90 backdrop-blur-xl p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-white/80 w-full max-w-5xl flex flex-col items-center max-h-[90vh] overflow-y-auto">
                <div className="relative w-full max-w-sm lg:max-w-md mx-auto mb-6 rounded-3xl overflow-hidden border border-white/80 bg-white shadow-xl aspect-[16/9]">
                  <Image
                    src="/images/contact-visit.png"
                    alt="Parents and children meeting teachers at school reception"
                    width={1600}
                    height={900}
                    priority
                    className="w-full h-full object-cover"
                  />
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 text-center">
                  Give your child the perfect start
                </h2>
                <p className="text-gray-500 text-base sm:text-lg mb-8 text-center max-w-2xl">
                  Join the Little Flowers family today. We&apos;d love to meet you and your little
                  one!
                </p>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-stretch">
                  {/* Left Column: Contact Cards */}
                  <div className="flex flex-col justify-center gap-4 w-full h-full">
                    {/* Email */}
                    <a
                      href="mailto:littleflowerskinder@gmail.com"
                      className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50/60 hover:bg-blue-100/60 border border-blue-100 transition-colors group"
                    >
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 group-hover:scale-110 transition-transform shrink-0">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div className="text-left overflow-hidden">
                        <p className="text-xs font-bold tracking-widest text-blue-400 uppercase">
                          Email Us
                        </p>
                        <p className="text-gray-700 font-medium truncate">
                          littleflowerskinder@gmail.com
                        </p>
                      </div>
                    </a>

                    {/* Phone */}
                    <a
                      href="tel:+919011272618"
                      className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50/60 hover:bg-amber-100/60 border border-amber-100 transition-colors group"
                    >
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-amber-100 text-amber-500 group-hover:scale-110 transition-transform shrink-0">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold tracking-widest text-amber-400 uppercase">
                          Call Us
                        </p>
                        <p className="text-gray-700 font-medium">(+91) 9011272618</p>
                      </div>
                    </a>

                    {/* Location Info Card */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-pink-50/60 border border-pink-100">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-100 text-pink-500 shrink-0">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold tracking-widest text-pink-400 uppercase">
                          Visit Us
                        </p>
                        <p className="text-gray-700 font-medium text-sm leading-snug">
                          172 Church Street
                          <br />
                          Cortalim, Goa 403710
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Interactive Map */}
                  <div className="w-full h-full min-h-[220px] flex flex-col relative rounded-2xl overflow-hidden shadow-sm border-2 border-white bg-gray-50 group">
                    <iframe
                      src="https://maps.google.com/maps?q=Little+flowers+playschool+Church+Street+Cortalim,+Goa+403710&t=&z=15&ie=UTF8&iwloc=&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0, position: "absolute", top: 0, left: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="filter contrast-[0.95] saturate-[1.1] transition-opacity duration-300"
                    ></iframe>

                    {/* Get Directions Floating Button */}
                    <div className="absolute bottom-4 left-0 w-full flex justify-center pointer-events-none">
                      <a
                        href="https://www.google.com/maps/dir/?api=1&destination=172+Church+Street+Cortalim,+Goa+403710"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pointer-events-auto bg-gray-900 text-white px-5 py-3 rounded-full font-medium text-sm shadow-xl hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 whitespace-nowrap"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                          />
                        </svg>
                        Get Directions
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {process.env.NODE_ENV !== "production" && (
          <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs px-3 py-1.5 rounded-full z-50 font-mono">
            scroll: {(progress * 100).toFixed(0)}%
          </div>
        )}
      </div>

      <section
        className="relative w-full min-h-screen bg-white px-4 sm:px-6 md:px-10 pb-16 sm:pb-24"
        style={{
          opacity: reviewReveal,
        }}
      >
        <div className="w-full max-w-5xl mx-auto">
          <ReviewList />
        </div>
      </section>
    </>
  );
}
