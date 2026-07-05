"use client"
import { motion, useMotionTemplate, useMotionValue, useSpring, Variants, AnimatePresence } from "framer-motion"
import { useId, useRef, useState, useEffect } from "react"
import { ShaderBackground } from "../components/ShaderBackground"
import { GlowCard } from "../components/GlowCard"
import { personalInfo, experiences, projects, skills } from "../data/portfolio"

// Centralized Color Palette
const PALETTE = {
  navBg: "#652A22bf",           // Deep Olive Green (75% opacity for dense glass)
  sectionBg: "#652A2280",       // Deep Olive Green (75% opacity)
  cardFloating: "#652A2270",    // Deep Olive Green (50% opacity for inner frosted card)
  cardBaseOpen: "rgba(243, 230, 224, 0.10)", // Cream (10% opacity for active/hover outer card)
  cardBaseClosed: "rgba(243, 230, 224, 0.05)",// Cream (5% opacity for idle outer card)
  gold: "#898C31",
  glowLight: "#47591d",
  triangleFill: "rgba(243, 230, 224, 0.82)",
  triangleStroke: "rgba(166, 206, 226, 0.8)",
};

/**
 * const PALETTE = {
  navBg: "#652A22D9", //D9 for 85% opacity
  sectionBg: "#652A22D9", //47591D8a
  gold: "#898C31",
  glowLight: "#47591D", 
  triangleFill: "#F3E6E0",
  triangleStroke: "#A6CEE2",
};
 */

/**  
 * navBg: "#32000C",
  sectionBg: "#32000c8a",
  gold: "#8E5404",
  glowLight: "#F72916",
  triangleFill: "#f5ebd7d1",
  triangleStroke: "#d2bea580",
 */

function SectionHeader({ title }: { title: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const card = canvas.parentElement!
    const ctx = canvas.getContext("2d")!
    const dpr = window.devicePixelRatio || 1

    const S        = 30   
    const HOLD_MS  = 160  
    const TRANS_MS = 90   
    const STEP_MS = HOLD_MS + TRANS_MS

    function getVerts(cx: number, cy: number, pose: number): [number, number][] {
      const h = S / 2
      const tl: [number,number] = [cx - h, cy - h]
      const tr: [number,number] = [cx + h, cy - h]
      const bl: [number,number] = [cx - h, cy + h]
      const br: [number,number] = [cx + h, cy + h]
      const c:  [number,number] = [cx, cy]
      if (pose === 0) return [c, tl, bl]  
      if (pose === 1) return [c, bl, br]  
      if (pose === 2) return [c, br, tr]  
      return [c, tr, tl]                  
    }

    function lerpVerts(
      a: [number,number][],
      b: [number,number][],
      t: number
    ): [number,number][] {
      return a.map((v, i) => [
        v[0] + (b[i][0] - v[0]) * t,
        v[1] + (b[i][1] - v[1]) * t,
      ])
    }

    function easeInOut(t: number) {
      return t < 0.5 ? 2*t*t : 1 - 2*(1-t)*(1-t)
    }

    let startTime: number | null = null
    let rafId: number

    const draw = (ts: number) => {
      rafId = requestAnimationFrame(draw)
      
      const rect = card.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      const targetW = Math.floor(rect.width * dpr)
      const targetH = Math.floor(rect.height * dpr)

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW
        canvas.height = targetH
        canvas.style.width = rect.width + "px"
        canvas.style.height = rect.height + "px"
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.scale(dpr, dpr)
      }

      const W = rect.width
      const H = rect.height
      const cy = H / 2

      if (!startTime) startTime = ts
      const elapsed = ts - startTime

      ctx.clearRect(0, 0, W, H)

      const msPerPass    = 3 * STEP_MS
      const totalPasses  = Math.ceil((W + S * 2) / S) + 1
      const loopMs       = totalPasses * msPerPass

      const t_loop    = elapsed % loopMs
      const passIndex = Math.floor(t_loop / msPerPass)
      const t_inPass  = t_loop - passIndex * msPerPass

      const stepIndex = Math.floor(t_inPass / STEP_MS)
      const t_inStep  = t_inPass - stepIndex * STEP_MS

      const sqCx  = S * 0.5 + passIndex * S
      const midPose = passIndex % 2 === 0 ? 1 : 3   
      const poseSeq = [0, midPose, 2]

      const currentPose = poseSeq[Math.min(stepIndex, 2)]
      const nextPose    = stepIndex < 2 ? poseSeq[stepIndex + 1] : 0

      const nextSqCx = sqCx + S

      let verts: [number,number][]

      if (t_inStep < HOLD_MS) {
        verts = getVerts(sqCx, cy, currentPose)
      } else {
        const rawT  = (t_inStep - HOLD_MS) / TRANS_MS
        const lerpT = easeInOut(Math.min(rawT, 1))
        const vertsA = getVerts(sqCx, cy, currentPose)
        const nextCx = currentPose === 2 ? nextSqCx : sqCx
        const vertsB = getVerts(nextCx, cy, nextPose)
        verts = lerpVerts(vertsA, vertsB, lerpT)
      }

      const minX = Math.min(...verts.map(v => v[0]))
      const maxX = Math.max(...verts.map(v => v[0]))
      if (maxX >= 0 && minX <= W) {
        ctx.beginPath()
        ctx.moveTo(verts[0][0], verts[0][1])
        ctx.lineTo(verts[1][0], verts[1][1])
        ctx.lineTo(verts[2][0], verts[2][1])
        ctx.closePath()
        ctx.fillStyle   = PALETTE.triangleFill
        ctx.strokeStyle = PALETTE.triangleStroke
        ctx.lineWidth   = 1
        ctx.fill()
        ctx.stroke()
      }
    }

    rafId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <div className="flex items-stretch gap-4 mb-6">
      <div
        className="rounded-2xl shrink-0 flex items-center justify-center"
        style={{
          background: PALETTE.sectionBg,
          border: `1px solid ${PALETTE.gold}`,
          backdropFilter: "blur(12px)",
          padding: "14px 22px", 
        }}
      >
        {/* Increased text size and reduced font-weight to font-light */}
        <h2 className="text-2xl md:text-3xl font-light font-display text-white">{title}</h2>
      </div>

      <div
        className="relative overflow-hidden rounded-2xl flex-grow w-full"
        style={{
          background: PALETTE.sectionBg,
          border: `1px solid ${PALETTE.gold}`,
          backdropFilter: "blur(12px)",
          minHeight: "60px", 
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        />
      </div>
    </div>
  )
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const DrawOutlineButton = ({ text, onClick, className }: { text: string; onClick?: () => void; className?: string}) => {
  return (
    <button
      onClick={onClick}
      style={{ "--theme-gold": PALETTE.gold } as React.CSSProperties}
      className={`group relative px-3 py-1.5 font-medium text-base md:text-lg text-white transition-colors duration-[340ms] hover:text-[var(--theme-gold)] ${className || ""}`}
    >
      <span>{text}</span>
      <span style={{ backgroundColor: PALETTE.gold }} className="absolute left-0 top-0 h-[2px] w-0 transition-all duration-85 group-hover:w-full" />
      <span style={{ backgroundColor: PALETTE.gold }} className="absolute right-0 top-0 h-0 w-[2px] transition-all delay-85 duration-85 group-hover:h-full" />
      <span style={{ backgroundColor: PALETTE.gold }} className="absolute bottom-0 right-0 h-[2px] w-0 transition-all delay-170 duration-85 group-hover:w-full" />
      <span style={{ backgroundColor: PALETTE.gold }} className="absolute bottom-0 left-0 h-0 w-[2px] transition-all delay-255 duration-85 group-hover:h-full" />
    </button>
  );
};

function TiltWrapper({ children, disabled = false }: { children: React.ReactNode, disabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const xSpring = useSpring(x)
  const ySpring = useSpring(y)
  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`
  const ROTATION_RANGE = 32.5
  const HALF_ROTATION_RANGE = ROTATION_RANGE / 2

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || disabled) return
    const rect = ref.current.getBoundingClientRect()
    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE
    const rX = (mouseY / rect.height - HALF_ROTATION_RANGE) * -1
    const rY = mouseX / rect.width - HALF_ROTATION_RANGE
    x.set(rX)
    y.set(rY)
  }

  const handleMouseLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d", transform: disabled ? "none" : transform, perspective: "1000px" }}
      className="relative h-full w-full"
    >
      {children}
    </motion.div>
  )
}

function ExpandableExperience({ exp }: { exp: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const uniqueId = useId()

  return (
    <motion.div 
      layout 
      className="w-full relative z-10"
      // 1. Inject the PALETTE colors as CSS variables
      style={{
        "--card-open": PALETTE.cardBaseOpen,
        "--card-closed": PALETTE.cardBaseClosed,
        "--card-float": PALETTE.cardFloating,
      } as React.CSSProperties}
    >
      <TiltWrapper disabled={isOpen}>
        <motion.div
          layoutId={`exp-base-${uniqueId}`}
          className={`w-full rounded-3xl transition-colors ${
            isOpen
              // 2. Map Tailwind bg classes to the CSS variables
              ? "bg-[var(--card-open)] border border-white/20 shadow-xl p-3 md:p-5"
              : "bg-[var(--card-closed)] border border-white/10 p-5 md:p-6 cursor-pointer hover:bg-[var(--card-open)]"
          }`}
          onClick={() => !isOpen && setIsOpen(true)}
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div
            layoutId={`exp-floating-${uniqueId}`}
            animate={{ z: isOpen ? 0 : 60 }}
            style={{ transformStyle: "preserve-3d" }}
            className={`w-full h-full flex flex-col rounded-2xl transition-colors duration-300 ${
              // 3. Map the floating inner card to the CSS variable
              isOpen ? "bg-transparent p-5" : "bg-[var(--card-float)] backdrop-blur-xl border border-white/10 shadow-2xl p-5"
            }`}
          >
            <motion.div layoutId={`exp-header-${uniqueId}`} className="flex justify-between items-start mb-2">
              <h3 className="text-lg md:text-xl font-medium text-white">{exp.role}</h3>
              <span className="text-xs md:text-sm text-white/80">{exp.duration}</span>
            </motion.div>
            <motion.h4 layoutId={`exp-subheader-${uniqueId}`} className="text-sm md:text-base font-normal text-white/90">{exp.company}</motion.h4>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, type: "spring", bounce: 0.05 }}
                  className="overflow-hidden"
                >
                  <div className="pt-5 mt-5 border-t border-white/10">
                    {Array.isArray(exp.description) ? (
                      <ul className="space-y-2.5 mb-5">
                        {exp.description.map((point: string, i: number) => (
                          <li key={i} className="flex gap-3 text-xs md:text-sm font-light text-white/95 leading-relaxed">
                            <span className="mt-2 w-1 h-1 rounded-full bg-white/50 shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs md:text-sm font-light text-white/95 leading-relaxed mb-5">{exp.description}</p>
                    )}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setIsOpen(false) }}
                        className="px-5 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-95 transition-all text-[10px] font-normal uppercase tracking-wider"
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
      </TiltWrapper>
    </motion.div>
  )
}

function ExpandableProject({ proj, index }: { proj: any; index: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const uniqueId = useId()

  return (
    <motion.div 
      layout 
      className="w-full relative z-10"
      // 1. Inject the PALETTE colors as CSS variables
      style={{
        "--card-open": PALETTE.cardBaseOpen,
        "--card-closed": PALETTE.cardBaseClosed,
        "--card-float": PALETTE.cardFloating,
      } as React.CSSProperties}
    >
      <TiltWrapper disabled={isOpen}>
        <motion.div
          layoutId={`proj-base-${uniqueId}`}
          className={`w-full rounded-3xl transition-colors ${
            isOpen
              // 2. Map Tailwind bg classes to the CSS variables
              ? "bg-[var(--card-open)] border border-white/20 shadow-2xl p-4 md:p-6"
              : "bg-[var(--card-closed)] border border-white/10 p-6 md:p-8 cursor-pointer hover:bg-[var(--card-open)]"
          }`}
          onClick={() => !isOpen && setIsOpen(true)}
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div
            layoutId={`proj-floating-${uniqueId}`}
            animate={{ z: isOpen ? 0 : 60 }}
            style={{ transformStyle: "preserve-3d" }}
            className={`w-full h-full flex flex-col rounded-2xl transition-colors duration-300 ${
              // 3. Map the floating inner card to the CSS variable
              isOpen ? "bg-transparent p-6" : "bg-[var(--card-float)] backdrop-blur-xl border border-white/10 shadow-2xl p-6"
            }`}
          >
            <motion.div layoutId={`proj-summary-${uniqueId}`} className="flex flex-col gap-4">
              <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-white/5">
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
                        fallback.className = "w-full h-full flex items-center justify-center text-white/30 text-[10px] uppercase tracking-widest"
                        fallback.textContent = "Thumbnail"
                        parent.appendChild(fallback)
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30 text-[10px] uppercase tracking-widest">
                    Thumbnail
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-lg md:text-xl font-medium text-white leading-tight">{proj.title}</h3>
                <p className="text-xs md:text-sm font-light text-white/70 leading-snug line-clamp-2">{proj.description}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {proj.skills?.map((s: string) => (
                    <span key={s} className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] text-white/80 font-mono tracking-wide">
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
                  <div className="pt-6 mt-6 border-t border-white/10">
                    {Array.isArray(proj.description) ? (
                      <ul className="space-y-3 mb-6">
                        {proj.description.map((point: string, i: number) => (
                          <li key={i} className="flex gap-3 text-xs md:text-sm font-light text-white/95 leading-relaxed">
                            <span className="mt-2 w-1 h-1 rounded-full bg-white/50 shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs md:text-sm font-light text-white/95 leading-relaxed mb-6">{proj.description}</p>
                    )}
                    <div className="flex justify-between items-center">
                      {proj.link && proj.link !== "#" && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all text-xs font-normal"
                        >
                          View Project
                          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setIsOpen(false) }}
                        className="ml-auto px-6 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-95 transition-all text-xs font-normal uppercase tracking-wider"
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
      </TiltWrapper>
    </motion.div>
  )
}

export default function Home() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ShaderBackground>

      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ backgroundColor: PALETTE.navBg }}
        className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] md:w-[60%] z-50 flex justify-between items-center px-6 md:px-8 py-2 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl"
      >
        <DrawOutlineButton
          text={personalInfo.name}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="!text-2xl md:!text-3xl"
        />
        <div className="hidden md:flex gap-4">
          {['Experience', 'Projects', 'Skills'].map((item) => (
            <DrawOutlineButton
              key={item}
              text={item}
              onClick={() => scrollToSection(item.toLowerCase())}
              className="!text-base md:!text-lg" 
            />
          ))}
        </div>
      </motion.nav>

      <div className="w-full min-h-screen py-12 pt-32 px-4 md:px-8 lg:py-32">
        <GlowCard
          className="max-w-5xl mx-auto rounded-[3rem]"
          lights={[
            { width: 550, height: 13, color: PALETTE.glowLight, duration: 5, startOffset: 0 },
            { width: 550, height: 13, color: PALETTE.glowLight, duration: 5, startOffset: 33 },
            { width: 550, height: 13, color: PALETTE.glowLight, duration: 5, startOffset: 66 },
            { width: 550, height: 13, color: PALETTE.glowLight, duration: 5, startOffset: 99 },
            { width: 550, height: 13, color: PALETTE.glowLight, duration: 5, startOffset: 132 },
            { width: 550, height: 13, color: PALETTE.glowLight, duration: 5, startOffset: 165 }
          ]}
        >
          <main className="max-w-5xl mx-auto p-8 md:p-16 lg:p-24 rounded-[3rem] bg-black/20 backdrop-blur-md border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] space-y-32 relative z-20">

            {/* HERO SECTION */}
            <motion.section
              initial="hidden" animate="visible" variants={fadeUp}
              className="flex flex-col relative z-20"
            >
              <div className="flex flex-col-reverse md:flex-row items-start justify-between gap-8">
                <div className="max-w-2xl">
                  {/* Increased Text Sizes */}
                  <h1 className="text-4xl md:text-5xl font-display font-medium tracking-tight mb-4">
                    Hi, I'm <span className="font-medium">{personalInfo.name}</span>!
                  </h1>
                  <p className="text-xl md:text-2xl font-light text-white/90 mb-8">{personalInfo.role}</p>
                  
                  {/* Bio formatting added: supports string arrays or pre-wrap \n strings */}
                  <div className="text-lg font-light text-white leading-relaxed mb-8">
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
                </div>

                {/* HEADSHOT */}
                <div className="w-48 h-51 md:w-72 md:h-77 rounded-full overflow-hidden border border-white/20 bg-white/5 backdrop-blur-xl shrink-0 relative z-20 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
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
                          fallback.className = "w-full h-full flex items-center justify-center text-white/50 text-xs"
                          fallback.textContent = "Headshot"
                          parent.appendChild(fallback)
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/50 text-xs">Headshot</div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between mt-8 w-full gap-4">
                <div className="flex items-center gap-3 px-7 py-5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>
                  <span className="text-base font-normal leading-tight whitespace-nowrap">
                    {personalInfo.university}
                    <span className="text-white/60"> · {personalInfo.major}</span>
                  </span>
                </div>
                <a href={`mailto:${personalInfo.email}`} className="w-16 h-16 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all cursor-pointer text-white hover:scale-105 active:scale-95 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </a>
                <a href={personalInfo.github} target="_blank" rel="noreferrer" className="w-16 h-16 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all cursor-pointer text-white hover:scale-105 active:scale-95 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                </a>
                <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="w-16 h-16 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all cursor-pointer text-white hover:scale-105 active:scale-95 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
              </div>
            </motion.section>

            {/* EXPERIENCE SECTION */}
            <motion.section id="experience" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="relative z-20 scroll-mt-32">
              <SectionHeader title="Experience" />
              <div className="space-y-8 flex flex-col">
                {experiences.map((exp) => (
                  <ExpandableExperience key={exp.id} exp={exp} />
                ))}
              </div>
            </motion.section>

            {/* PROJECTS SECTION */}
            <motion.section id="projects" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="relative z-20 scroll-mt-32">
              <SectionHeader title="Selected Projects" />
              <div className="space-y-12 flex flex-col">
                {projects.map((proj, i) => (
                  <ExpandableProject key={proj.id} proj={proj} index={i} />
                ))}
              </div>
            </motion.section>

            {/* SKILLS SECTION */}
            <motion.section id="skills" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="relative z-20 scroll-mt-32">
              <SectionHeader title="Skills" />
              <div className="flex flex-wrap gap-4">
                {skills.map((skill, index) => (
                  <span key={index} className="px-6 py-3 rounded-full bg-white/5 border border-white/20 text-sm font-light text-white hover:bg-white/20 transition-colors cursor-default backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95 duration-200">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.section>

            {/* FOOTER */}
            <footer className="relative z-20 pt-12 mt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-white/50 text-xs font-normal tracking-wide">
                © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
              </p>
              <div className="flex gap-8">
                <a href={personalInfo.github} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors text-xs uppercase tracking-widest font-medium">GitHub</a>
                <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors text-xs uppercase tracking-widest font-medium">LinkedIn</a>
              </div>
            </footer>

          </main>
        </GlowCard>
      </div>
    </ShaderBackground>
  )
}