"use client"
import { motion, useMotionTemplate, useMotionValue, useSpring, Variants, AnimatePresence } from "framer-motion"
import { useId, useRef, useState, useEffect } from "react"
import { ShaderBackground } from "../components/ShaderBackground"
import { personalInfo, experiences, projects, skills } from "../data/portfolio"

// Centralized Color Palette for Formal Theme
const PALETTE = {
  primary: "#817755",
  secondary: "#7D7767",
  tertiary: "#BCAD9D",
  neutral: "#7A7773",
  paperBg: "#FDFCF8",
  cardIdleBg: "#F6F5ED",
  cardBorderIdle: "#E5E1D8", 
  navHover: "#9e9906",
  vine: "#E0DAC8", 
};

// --- NEW COMPONENT: Decorative Header Vines ---
function HeaderVine({ isRight }: { isRight?: boolean }) {
  return (
    <div className={`hidden md:block opacity-90 ${isRight ? "transform scale-x-[-1]" : ""}`}>
      <svg width="80" height="24" viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 0 12 Q 20 0, 40 12 T 80 12" stroke={PALETTE.vine} strokeWidth="1.5" fill="none" />
        <path d="M 20 6 Q 25 0, 30 6 Q 25 12, 20 6" fill={PALETTE.vine} />
        <path d="M 60 18 Q 65 12, 70 18 Q 65 24, 60 18" fill={PALETTE.vine} />
      </svg>
    </div>
  )
}

// --- UPDATED COMPONENT: Section Header ---
// Canvas animation removed; replaced with centered text, wider tracking, and decorative vines.
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center gap-4 md:gap-8 mb-10 w-full">
      <HeaderVine />
      <h2 
        className="text-3xl md:text-4xl font-light font-display tracking-[0.15em] text-[var(--theme-primary)] text-center"
        style={{ "--theme-primary": PALETTE.primary } as React.CSSProperties}
      >
        {title}
      </h2>
      <HeaderVine isRight />
    </div>
  )
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const DrawOutlineButton = ({ text, onClick, className, isActive }: { text: string; onClick?: () => void; className?: string; isActive?: boolean }) => {
  return (
    <button
      onClick={onClick}
      style={{ 
        "--theme-primary": PALETTE.primary,
        "--theme-nav-hover": PALETTE.navHover 
      } as React.CSSProperties}
      className={`group relative px-3 py-1.5 font-medium text-base md:text-lg transition-colors duration-[340ms] hover:text-[var(--theme-nav-hover)] ${isActive ? "text-[var(--theme-nav-hover)]" : "text-[var(--theme-primary)]"} ${className || ""}`}
    >
      <span>{text}</span>
      <span style={{ backgroundColor: PALETTE.primary }} className="absolute left-0 top-0 h-[2px] w-0 transition-all duration-85 group-hover:w-full" />
      <span style={{ backgroundColor: PALETTE.primary }} className="absolute right-0 top-0 h-0 w-[2px] transition-all delay-85 duration-85 group-hover:h-full" />
      <span style={{ backgroundColor: PALETTE.primary }} className="absolute bottom-0 right-0 h-[2px] w-0 transition-all delay-170 duration-85 group-hover:w-full" />
      <span style={{ backgroundColor: PALETTE.primary }} className="absolute bottom-0 left-0 h-0 w-[2px] transition-all delay-255 duration-85 group-hover:h-full" />
    </button>
  );
};

// --- UPDATED COMPONENT: Complex Side Vine Animation ---
function SideVine({ className }: { className?: string }) {
  return (
    <div className={`absolute top-0 ${className} opacity-80 hidden lg:block`}>
      <svg width="120" height="400" viewBox="0 0 120 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path 
          initial={{ pathLength: 0 }} 
          animate={{ pathLength: 1 }} 
          transition={{ duration: 2.5, ease: "easeInOut" }}
          d="M 10 0 C 80 20, 120 80, 60 140 C 0 200, 80 260, 40 330 C 20 360, 30 380, 30 400" 
          stroke={PALETTE.vine} strokeWidth="2" fill="none" 
        />
        <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5 }} d="M 60 140 C 90 150, 110 120, 90 90" stroke={PALETTE.vine} strokeWidth="1.5" fill="none" />
        <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 1 }} d="M 40 330 C 70 340, 80 300, 60 280" stroke={PALETTE.vine} strokeWidth="1.5" fill="none" />
        
        {/* Leaves */}
        <motion.path initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.0 }} d="M 50 30 Q 75 10, 80 30 Q 75 50, 50 30" fill={PALETTE.vine} />
        <motion.path initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 }} d="M 100 110 Q 120 95, 115 120 Q 95 125, 100 110" fill={PALETTE.vine} />
        <motion.path initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.4 }} d="M 20 180 Q 0 190, 10 210 Q 30 200, 20 180" fill={PALETTE.vine} />
        <motion.path initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.6 }} d="M 70 240 Q 90 230, 95 250 Q 75 260, 70 240" fill={PALETTE.vine} />
        <motion.path initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.8 }} d="M 30 360 Q 10 370, 15 390 Q 35 380, 30 360" fill={PALETTE.vine} />
      </svg>
    </div>
  )
}

function VineDivider() {
  return (
    <div className="w-full flex justify-center my-12 opacity-80">
      <svg width="300" height="40" viewBox="0 0 300 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 0 20 Q 75 0, 150 20 T 300 20" stroke={PALETTE.vine} strokeWidth="2" fill="none" />
        <path d="M 75 10 Q 80 0, 85 10 Q 80 20, 75 10" fill={PALETTE.vine} />
        <path d="M 225 30 Q 230 20, 235 30 Q 230 40, 225 30" fill={PALETTE.vine} />
      </svg>
    </div>
  )
}

function ExpandableExperience({ exp }: { exp: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const uniqueId = useId()

  return (
    <motion.div 
      layout 
      className="w-full relative z-10"
      style={{ 
        "--theme-primary": PALETTE.primary,
        "--theme-idle-border": PALETTE.cardBorderIdle,
        "--theme-idle-bg": PALETTE.cardIdleBg 
      } as React.CSSProperties}
    >
      <motion.div
        layoutId={`exp-base-${uniqueId}`}
        className={`w-full transition-colors ${
          isOpen
            ? "bg-[#FDFCF8] border border-[var(--theme-primary)] shadow-xl p-3 md:p-5"
            : "group relative bg-[var(--theme-idle-bg)] border border-[var(--theme-idle-border)] p-5 md:p-6 cursor-pointer"
        }`}
        onClick={() => !isOpen && setIsOpen(true)}
      >
        {!isOpen && (
          <>
            <span style={{ backgroundColor: PALETTE.primary }} className="absolute left-0 top-0 h-[2px] w-0 transition-all duration-85 group-hover:w-full" />
            <span style={{ backgroundColor: PALETTE.primary }} className="absolute right-0 top-0 h-0 w-[2px] transition-all delay-85 duration-85 group-hover:h-full" />
            <span style={{ backgroundColor: PALETTE.primary }} className="absolute bottom-0 right-0 h-[2px] w-0 transition-all delay-170 duration-85 group-hover:w-full" />
            <span style={{ backgroundColor: PALETTE.primary }} className="absolute bottom-0 left-0 h-0 w-[2px] transition-all delay-255 duration-85 group-hover:h-full" />
          </>
        )}

        <motion.div
          layoutId={`exp-floating-${uniqueId}`}
          className={`w-full h-full flex flex-col transition-colors duration-300 bg-transparent p-5`}
        >
          <motion.div layoutId={`exp-header-${uniqueId}`} className="flex justify-between items-start mb-2">
            <h3 className="text-lg md:text-xl font-medium text-[var(--theme-primary)]">{exp.role}</h3>
            <span className="text-xs md:text-sm text-[#7D7767]">{exp.duration}</span>
          </motion.div>
          <motion.h4 layoutId={`exp-subheader-${uniqueId}`} className="text-sm md:text-base font-normal text-[#7A7773]">{exp.company}</motion.h4>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, type: "spring", bounce: 0.05 }}
                className="overflow-hidden"
              >
                <div className="pt-5 mt-5 border-t border-[#BCAD9D]">
                  {Array.isArray(exp.description) ? (
                    <ul className="space-y-2.5 mb-5">
                      {exp.description.map((point: string, i: number) => (
                        <li key={i} className="flex gap-3 text-xs md:text-sm font-light text-[#7D7767] leading-relaxed">
                          <span className="mt-2 w-1 h-1 rounded-full bg-[#817755] shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs md:text-sm font-light text-[#7D7767] leading-relaxed mb-5">{exp.description}</p>
                  )}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setIsOpen(false) }}
                      className="px-5 py-1.5 border border-[#817755] text-[#817755] hover:bg-[#817755] hover:text-[#FDFCF8] transition-all text-[10px] font-normal uppercase tracking-wider"
                    >
                      Shrink
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

function ExpandableProject({ proj, index, isOpen, onToggle, containerClass }: { proj: any; index: number; isOpen: boolean; onToggle: () => void; containerClass?: string }) {
  const uniqueId = useId()

  return (
    <motion.div 
      layout 
      className={`w-full relative z-10 ${containerClass || ""}`}
      style={{ 
        "--theme-primary": PALETTE.primary,
        "--theme-idle-border": PALETTE.cardBorderIdle,
        "--theme-idle-bg": PALETTE.cardIdleBg
      } as React.CSSProperties}
    >
      <motion.div
        layoutId={`proj-base-${uniqueId}`}
        className={`w-full transition-colors ${
          isOpen
            ? "bg-[#FDFCF8] border border-[var(--theme-primary)] shadow-2xl p-4 md:p-6"
            : "group relative bg-[var(--theme-idle-bg)] border border-[var(--theme-idle-border)] p-6 md:p-8 cursor-pointer"
        }`}
        onClick={() => !isOpen && onToggle()}
      >
        {!isOpen && (
          <>
            <span style={{ backgroundColor: PALETTE.primary }} className="absolute left-0 top-0 h-[2px] w-0 transition-all duration-85 group-hover:w-full" />
            <span style={{ backgroundColor: PALETTE.primary }} className="absolute right-0 top-0 h-0 w-[2px] transition-all delay-85 duration-85 group-hover:h-full" />
            <span style={{ backgroundColor: PALETTE.primary }} className="absolute bottom-0 right-0 h-[2px] w-0 transition-all delay-170 duration-85 group-hover:w-full" />
            <span style={{ backgroundColor: PALETTE.primary }} className="absolute bottom-0 left-0 h-0 w-[2px] transition-all delay-255 duration-85 group-hover:h-full" />
          </>
        )}

        <motion.div
          layoutId={`proj-floating-${uniqueId}`}
          className={`w-full h-full flex flex-col transition-colors duration-300 bg-transparent p-6`}
        >
          <motion.div layoutId={`proj-summary-${uniqueId}`} className="flex flex-col gap-4">
            <div className="w-full aspect-video overflow-hidden border border-[#BCAD9D] bg-[#FDFCF8]">
              {proj.thumbnail ? (
                <img
                  src={proj.thumbnail}
                  alt={`${proj.title} thumbnail`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none"
                    const parent = (e.currentTarget as HTMLImageElement).parentElement
                    if (parent) {
                      const fallback = document.createElement("div")
                      fallback.className = "w-full h-full flex items-center justify-center text-[#7A7773] text-[10px] uppercase tracking-widest"
                      fallback.textContent = "Thumbnail"
                      parent.appendChild(fallback)
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#7A7773] text-[10px] uppercase tracking-widest">
                  Thumbnail
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-lg md:text-xl font-medium text-[var(--theme-primary)] leading-tight">{proj.title}</h3>
              <p className="text-xs md:text-sm font-light text-[#7D7767] leading-snug line-clamp-2">{proj.description}</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {proj.skills?.map((s: string) => (
                  <span key={s} className="px-3 py-1 border border-[#BCAD9D] text-[10px] text-[#7A7773] font-mono tracking-wide">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, type: "spring", bounce: 0.05 }}
                className="overflow-hidden"
              >
                <div className="pt-6 mt-6 border-t border-[#BCAD9D]">
                  {Array.isArray(proj.description) ? (
                    <ul className="space-y-3 mb-6">
                      {proj.description.map((point: string, i: number) => (
                        <li key={i} className="flex gap-3 text-xs md:text-sm font-light text-[#7D7767] leading-relaxed">
                          <span className="mt-2 w-1 h-1 rounded-full bg-[#817755] shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs md:text-sm font-light text-[#7D7767] leading-relaxed mb-6">{proj.description}</p>
                  )}
                  <div className="flex justify-between items-center">
                    {proj.link && proj.link !== "#" && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 px-5 py-2 border border-[#817755] text-[#817755] hover:bg-[#817755] hover:text-[#FDFCF8] transition-all text-xs font-normal"
                      >
                        View Project
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onToggle() }}
                      className="ml-auto px-6 py-2 border border-[#817755] text-[#817755] hover:bg-[#817755] hover:text-[#FDFCF8] transition-all text-xs font-normal uppercase tracking-wider"
                    >
                      Shrink
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default function Home() {
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState("about");

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["about", "experience", "projects", "skills"];
      let current = "about";
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ShaderBackground>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ backgroundColor: "rgba(253, 252, 248, 0.95)" }}
        className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] md:w-[84%] z-50 flex justify-between items-center px-6 md:px-8 py-2 border border-[#BCAD9D] shadow-sm rounded-2xl"
      >
        <DrawOutlineButton
          text={personalInfo.name}
          onClick={() => scrollToSection("about")}
          className="!text-2xl md:!text-3xl font-display"
        />
        <div className="hidden md:flex gap-4">
          {['About', 'Experience', 'Projects', 'Skills'].map((item) => (
            <DrawOutlineButton
              key={item}
              text={item}
              isActive={activeSection === item.toLowerCase()}
              onClick={() => scrollToSection(item.toLowerCase())}
              className="!text-base md:!text-lg" 
            />
          ))}
        </div>
      </motion.nav>

      {/* Reduced top padding to move Hero section up */}
      <div className="w-full min-h-screen pb-12 pt-24 lg:pt-28 px-4 md:px-8 flex justify-center">
        <main 
          style={{ backgroundColor: PALETTE.paperBg, color: PALETTE.primary }}
          // Shrunk max-width by 10% (from 76rem to 68rem) and slightly reduced vertical padding
          className="w-full max-w-[68rem] p-4 md:p-8 lg:p-10 shadow-2xl border border-[#BCAD9D] relative z-20"
        >
          {/* HERO SECTION - REARRANGED & CENTERED */}
          <motion.section
            id="about"
            initial="hidden" animate="visible" variants={fadeUp}
            className="flex flex-col items-center justify-center relative z-20 text-center py-4"
          >
            {/* New Side Vine Animations */}
            <SideVine className="left-0" />
            <SideVine className="right-0 transform scale-x-[-1]" />

            <h1 className="text-4xl md:text-5xl font-display font-medium tracking-tight mb-6 text-[#817755]">
              Hi, I'm <span className="font-medium">{personalInfo.name}</span>!
            </h1>

            {/* HEADSHOT */}
            <div className="w-43 h-40 md:w-60 md:h-56 rounded-full overflow-hidden border border-[#BCAD9D] bg-[#FDFCF8] shrink-0 relative z-20 shadow-md mb-6">
              {personalInfo.headshot ? (
                <img
                  src={personalInfo.headshot}
                  alt={`${personalInfo.name} headshot`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none"
                    const parent = (e.currentTarget as HTMLImageElement).parentElement
                    if (parent) {
                      const fallback = document.createElement("div")
                      fallback.className = "w-full h-full flex items-center justify-center text-[#7A7773] text-xs"
                      fallback.textContent = "Headshot"
                      parent.appendChild(fallback)
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#7A7773] text-xs">Headshot</div>
              )}
            </div>

            <p className="text-xl md:text-2xl font-light text-[#7D7767] mb-4">{personalInfo.role}</p>
            
            <div className="text-lg font-light text-[#7D7767] leading-relaxed mb-6 max-w-2xl">
              {Array.isArray(personalInfo.bio) ? (
                <div className="space-y-4">
                  {personalInfo.bio.map((paragraph: string, i: number) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{personalInfo.bio}</p>
              )}
            </div>

            <div className="flex items-center gap-3 px-7 py-4 border border-[#BCAD9D] bg-[#FDFCF8] text-[#817755] mb-6 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>
              <span className="text-base font-normal leading-tight whitespace-nowrap">
                {personalInfo.university}
                <span className="text-[#7D7767]"> · {personalInfo.major}</span>
              </span>
            </div>

            <div className="flex justify-center gap-4 mt-2">
              <a href={`mailto:${personalInfo.email}`} className="w-14 h-14 flex items-center justify-center border border-[#BCAD9D] bg-[#FDFCF8] hover:bg-[#817755] hover:text-[#FDFCF8] transition-all cursor-pointer text-[#817755] shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </a>
              <a href={personalInfo.github} target="_blank" rel="noreferrer" className="w-14 h-14 flex items-center justify-center border border-[#BCAD9D] bg-[#FDFCF8] hover:bg-[#817755] hover:text-[#FDFCF8] transition-all cursor-pointer text-[#817755] shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </a>
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="w-14 h-14 flex items-center justify-center border border-[#BCAD9D] bg-[#FDFCF8] hover:bg-[#817755] hover:text-[#FDFCF8] transition-all cursor-pointer text-[#817755] shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </motion.section>

          <VineDivider />

          {/* EXPERIENCE SECTION */}
          <motion.section id="experience" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="relative z-20 scroll-mt-32">
            <SectionHeader title="Experience" />
            <div className="space-y-8 flex flex-col">
              {experiences.map((exp) => (
                <ExpandableExperience key={exp.id} exp={exp} />
              ))}
            </div>
          </motion.section>

          <VineDivider />

          {/* PROJECTS SECTION */}
          <motion.section id="projects" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="relative z-20 scroll-mt-32">
            <SectionHeader title="Selected Projects" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {projects.map((proj, i) => {
                const isExpanded = expandedProject === i;
                
                const expandedRow = expandedProject !== null ? Math.floor(expandedProject / 2) : null;
                const myRow = Math.floor(i / 2);
                const isAffectedRow = expandedRow === myRow;

                const isLastOddItem = i === projects.length - 1 && projects.length % 2 !== 0;

                const colSpanClass = (isAffectedRow || isLastOddItem) ? "md:col-span-2" : "md:col-span-1";
                
                let widthClass = "";
                if (isExpanded) {
                  widthClass = "md:w-[85%] mx-auto";
                } else if (isAffectedRow || isLastOddItem) {
                  widthClass = "md:max-w-[calc(50%-1.5rem)] mx-auto";
                }

                return (
                  <motion.div layout key={proj.id} className={`w-full flex flex-col ${colSpanClass}`}>
                    <ExpandableProject 
                      proj={proj} 
                      index={i} 
                      isOpen={isExpanded}
                      onToggle={() => setExpandedProject(isExpanded ? null : i)}
                      containerClass={widthClass}
                    />
                  </motion.div>
                )
              })}
            </div>
          </motion.section>

          <VineDivider />

          {/* SKILLS SECTION */}
          <motion.section id="skills" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="relative z-20 scroll-mt-32">
            <SectionHeader title="Skills" />
            <div className="flex flex-wrap justify-center gap-4">
              {skills.map((skill, index) => (
                <span key={index} className="px-6 py-3 border border-[#BCAD9D] text-sm font-light text-[#7D7767] hover:bg-[#817755] hover:text-[#FDFCF8] transition-colors cursor-default shadow-sm duration-200">
                  {skill}
                </span>
              ))}
            </div>
          </motion.section>

          {/* FOOTER */}
          <footer className="relative z-20 pt-12 mt-12 border-t border-[#BCAD9D] flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[#7A7773] text-xs font-normal tracking-wide">
              © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
            </p>
            <div className="flex gap-8">
              <a href={personalInfo.github} target="_blank" rel="noreferrer" className="text-[#7D7767] hover:text-[#817755] transition-colors text-xs uppercase tracking-widest font-medium">GitHub</a>
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-[#7D7767] hover:text-[#817755] transition-colors text-xs uppercase tracking-widest font-medium">LinkedIn</a>
            </div>
          </footer>

        </main>
      </div>
    </ShaderBackground>
  )
}