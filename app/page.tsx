"use client"
import { motion, useMotionTemplate, useMotionValue, useSpring, Variants, AnimatePresence } from "framer-motion"
import { useId, useRef, useState, useEffect } from "react"
import { ShaderBackground } from "../components/ShaderBackground"
import { GlowCard } from "../components/GlowCard"
import { personalInfo, experiences, projects, skills } from "../data/portfolio"

function SectionHeader({ title }: { title: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const card = canvas.parentElement!
    const dpr = window.devicePixelRatio || 1

    const rect = card.getBoundingClientRect()
    canvas.width  = rect.width  * dpr
    canvas.height = rect.height * dpr
    canvas.style.width  = rect.width  + "px"
    canvas.style.height = rect.height + "px"

    const ctx = canvas.getContext("2d")!
    ctx.scale(dpr, dpr)

    const S        = 36   // square side length (px)
    const HOLD_MS  = 160  // how long each pose is held
    const TRANS_MS = 90   // transition duration

    const STEP_MS = HOLD_MS + TRANS_MS

    // Returns the 3 vertices of one quadrant-triangle of a square
    // centered at (cx, cy) with side S, for the given pose.
    // pose: 0=LEFT, 1=BOTTOM, 2=RIGHT, 3=TOP
    function getVerts(cx: number, cy: number, pose: number): [number, number][] {
      const h = S / 2
      const tl: [number,number] = [cx - h, cy - h]
      const tr: [number,number] = [cx + h, cy - h]
      const bl: [number,number] = [cx - h, cy + h]
      const br: [number,number] = [cx + h, cy + h]
      const c:  [number,number] = [cx, cy]
      if (pose === 0) return [c, tl, bl]  // LEFT
      if (pose === 1) return [c, bl, br]  // BOTTOM
      if (pose === 2) return [c, br, tr]  // RIGHT
      return [c, tr, tl]                  // TOP (pose === 3)
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
      if (!startTime) startTime = ts
      const elapsed = ts - startTime

      const W = canvas.width  / dpr
      const H = canvas.height / dpr
      const cy = H / 2

      ctx.clearRect(0, 0, W, H)

      // Each pass = 3 steps: LEFT, MID (bottom or top), RIGHT
      // After RIGHT the square advances by S and resets to LEFT
      const msPerPass    = 3 * STEP_MS
      const totalPasses  = Math.ceil((W + S * 2) / S) + 1
      const loopMs       = totalPasses * msPerPass

      const t_loop    = elapsed % loopMs
      const passIndex = Math.floor(t_loop / msPerPass)
      const t_inPass  = t_loop - passIndex * msPerPass

      const stepIndex = Math.floor(t_inPass / STEP_MS)
      const t_inStep  = t_inPass - stepIndex * STEP_MS

      const sqCx  = S * 0.5 + passIndex * S
      const midPose = passIndex % 2 === 0 ? 1 : 3   // alternate BOTTOM / TOP
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
        ctx.fillStyle   = "rgba(245, 235, 215, 0.82)"
        ctx.strokeStyle = "rgba(210, 190, 165, 0.5)"
        ctx.lineWidth   = 1
        ctx.fill()
        ctx.stroke()
      }

      rafId = requestAnimationFrame(draw)
    }

    rafId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <div
      className="relative overflow-hidden rounded-2xl mb-8"
      style={{
        background: "#32000c8a",
        border: "1px solid #8E5404",
        backdropFilter: "blur(12px)",
        padding: "18px 28px",
        minHeight: "70px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      />
      <h2 className="text-4xl font-bold font-display text-white relative z-10">{title}</h2>
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
      className={`group relative px-4 py-2 font-bold text-lg md:text-xl text-white transition-colors duration-[340ms] hover:text-[#8E5404] ${className || ""}`}
    >
      <span>{text}</span>
      <span className="absolute left-0 top-0 h-[2px] w-0 bg-[#8E5404] transition-all duration-85 group-hover:w-full" />
      <span className="absolute right-0 top-0 h-0 w-[2px] bg-[#8E5404] transition-all delay-85 duration-85 group-hover:h-full" />
      <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-[#8E5404] transition-all delay-170 duration-85 group-hover:w-full" />
      <span className="absolute bottom-0 left-0 h-0 w-[2px] bg-[#8E5404] transition-all delay-255 duration-85 group-hover:h-full" />
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
    <motion.div layout className="w-full relative z-10">
      <TiltWrapper disabled={isOpen}>
        <motion.div
          layoutId={`exp-base-${uniqueId}`}
          className={`w-full rounded-3xl transition-colors ${
            isOpen
              ? "bg-white/10 border border-white/20 shadow-2xl p-4 md:p-6"
              : "bg-white/5 border border-white/10 p-6 md:p-8 cursor-pointer hover:bg-white/10"
          }`}
          onClick={() => !isOpen && setIsOpen(true)}
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div
            layoutId={`exp-floating-${uniqueId}`}
            animate={{ z: isOpen ? 0 : 60 }}
            style={{ transformStyle: "preserve-3d" }}
            className={`w-full h-full flex flex-col rounded-2xl transition-colors duration-300 ${
              isOpen ? "bg-transparent p-6" : "bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl p-6"
            }`}
          >
            <motion.div layoutId={`exp-header-${uniqueId}`} className="flex justify-between items-start mb-2">
              <h3 className="text-3xl font-bold text-white">{exp.role}</h3>
              <span className="text-lg text-white/80">{exp.duration}</span>
            </motion.div>
            <motion.h4 layoutId={`exp-subheader-${uniqueId}`} className="text-xl text-white/90">{exp.company}</motion.h4>

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
                    {Array.isArray(exp.description) ? (
                      <ul className="space-y-3 mb-6">
                        {exp.description.map((point: string, i: number) => (
                          <li key={i} className="flex gap-3 text-lg text-white/95 leading-relaxed">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-white/50 shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-lg text-white/95 leading-relaxed mb-6">{exp.description}</p>
                    )}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setIsOpen(false) }}
                        className="px-6 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-95 transition-all text-sm font-medium uppercase tracking-wider"
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
    <motion.div layout className="w-full relative z-10">
      <TiltWrapper disabled={isOpen}>
        <motion.div
          layoutId={`proj-base-${uniqueId}`}
          className={`w-full rounded-3xl transition-colors ${
            isOpen
              ? "bg-white/10 border border-white/20 shadow-2xl p-4 md:p-6"
              : "bg-white/5 border border-white/10 p-6 md:p-8 cursor-pointer hover:bg-white/10"
          }`}
          onClick={() => !isOpen && setIsOpen(true)}
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div
            layoutId={`proj-floating-${uniqueId}`}
            animate={{ z: isOpen ? 0 : 60 }}
            style={{ transformStyle: "preserve-3d" }}
            className={`w-full h-full flex flex-col rounded-2xl transition-colors duration-300 ${
              isOpen ? "bg-transparent p-6" : "bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl p-6"
            }`}
          >
            <motion.div layoutId={`proj-summary-${uniqueId}`} className="flex flex-col gap-4">
              {/* Thumbnail — full width on top */}
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
                        fallback.className = "w-full h-full flex items-center justify-center text-white/30 text-xs uppercase tracking-widest"
                        fallback.textContent = "Thumbnail"
                        parent.appendChild(fallback)
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30 text-xs uppercase tracking-widest">
                    Thumbnail
                  </div>
                )}
              </div>

              {/* Title + description + skills below */}
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">{proj.title}</h3>
                <p className="text-base text-white/70 leading-snug line-clamp-2">{proj.description}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {proj.skills?.map((s: string) => (
                    <span key={s} className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-white/80 font-mono tracking-wide">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Expanded: full description + link */}
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
                          <li key={i} className="flex gap-3 text-lg text-white/95 leading-relaxed">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-white/50 shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-lg text-white/95 leading-relaxed mb-6">{proj.description}</p>
                    )}
                    <div className="flex justify-between items-center">
                      {proj.link && proj.link !== "#" && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all text-sm font-medium"
                        >
                          View Project
                          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setIsOpen(false) }}
                        className="ml-auto px-6 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-95 transition-all text-sm font-medium uppercase tracking-wider"
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

      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-5 bg-[#32000C] border-b border-white/20 shadow-lg"
      >
        <DrawOutlineButton
          text={personalInfo.name}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="!text-4xl md:!text-5xl"
        />
        <div className="hidden md:flex gap-6">
          {['Experience', 'Projects', 'Skills'].map((item) => (
            <DrawOutlineButton
              key={item}
              text={item}
              onClick={() => scrollToSection(item.toLowerCase())}
              className="!text-3xl"
            />
          ))}
        </div>
      </motion.nav>

      <div className="w-full min-h-screen py-12 pt-32 px-4 md:px-8 lg:py-32">
        <GlowCard
          className="max-w-5xl mx-auto rounded-[3rem]"
          lights={[
            { width: 550, height: 13, color: "#F72916", duration: 5, startOffset: 0 },
            { width: 550, height: 13, color: "#F72916", duration: 5, startOffset: 33 },
            { width: 550, height: 13, color: "#F72916", duration: 5, startOffset: 66 },
            { width: 550, height: 13, color: "#F72916", duration: 5, startOffset: 99 },
            { width: 550, height: 13, color: "#F72916", duration: 5, startOffset: 132 },
            { width: 550, height: 13, color: "#F72916", duration: 5, startOffset: 165 }
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
                  <h1 className="text-5xl md:text-6xl font-display tracking-tight mb-4">
                    Hi, I'm <span className="font-bold">{personalInfo.name}</span>!
                  </h1>
                  <p className="text-2xl text-white/90 mb-8">{personalInfo.role}</p>
                  <p className="text-xl text-white leading-relaxed mb-8">{personalInfo.bio}</p>
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
                          fallback.className = "w-full h-full flex items-center justify-center text-white/50 text-sm"
                          fallback.textContent = "Headshot"
                          parent.appendChild(fallback)
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/50 text-sm">Headshot</div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between mt-8 w-full gap-4">
                <div className="flex items-center gap-3 px-7 py-5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>
                  <span className="text-xl font-medium leading-tight whitespace-nowrap">
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
              <div className="space-y-12 flex flex-col">
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
                  <span key={index} className="px-6 py-3 rounded-full bg-white/5 border border-white/20 text-lg text-white hover:bg-white/20 transition-colors cursor-default backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95 duration-200">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.section>

            {/* FOOTER */}
            <footer className="relative z-20 pt-12 mt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-white/50 text-sm font-medium tracking-wide">
                © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
              </p>
              <div className="flex gap-8">
                <a href={personalInfo.github} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors text-sm uppercase tracking-widest font-bold">GitHub</a>
                <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors text-sm uppercase tracking-widest font-bold">LinkedIn</a>
              </div>
            </footer>

          </main>
        </GlowCard>
      </div>
    </ShaderBackground>
  )
}