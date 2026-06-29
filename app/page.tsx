"use client"
import { motion, useMotionTemplate, useMotionValue, useSpring, Variants, AnimatePresence } from "framer-motion"
import { useId, useRef, useState } from "react"
import { ShaderBackground } from "../components/ShaderBackground"
import { personalInfo, experiences, projects, skills } from "../data/portfolio"

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

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
    const width = rect.width
    const height = rect.height

    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE
    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1
    const rY = mouseX / width - HALF_ROTATION_RANGE

    x.set(rX)
    y.set(rY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        transformStyle: "preserve-3d", 
        transform: disabled ? "none" : transform,
        perspective: "1000px"
      }}
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
        {/* UPDATED: Increased padding to p-6 md:p-8 and rounded-3xl to make the base card a larger frame */}
        <motion.div
          layoutId={`popover-base-${uniqueId}`}
          className={`w-full rounded-3xl transition-colors ${
            isOpen 
              ? "bg-white/10 border border-white/20 shadow-2xl p-4 md:p-6" 
              : "bg-white/5 border border-white/10 p-6 md:p-8 cursor-pointer hover:bg-white/10"
          }`}
          onClick={() => !isOpen && setIsOpen(true)}
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div
            layoutId={`popover-floating-${uniqueId}`}
            animate={{ z: isOpen ? 0 : 60 }}
            style={{ transformStyle: "preserve-3d" }}
            className={`w-full h-full flex flex-col rounded-2xl transition-colors duration-300 ${
              isOpen 
                ? "bg-transparent p-6" 
                : "bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl p-6"
            }`}
          >
            <motion.div layoutId={`popover-header-${uniqueId}`} className="flex justify-between items-start mb-2">
              <h3 className="text-3xl font-bold text-white group-hover:text-white/90 transition-colors">{exp.role}</h3>
              <span className="text-lg text-white/80">{exp.duration}</span>
            </motion.div>
            
            <motion.h4 layoutId={`popover-subheader-${uniqueId}`} className="text-xl text-white/90">
              {exp.company}
            </motion.h4>

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
                    <p className="text-lg text-white/95 leading-relaxed mb-6">{exp.description}</p>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation() 
                          setIsOpen(false)
                        }}
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

export default function Home() {
  return (
    <ShaderBackground>
      <div className="w-full min-h-screen py-12 px-4 md:px-8 lg:py-24">
        
        <main className="max-w-5xl mx-auto p-8 md:p-16 lg:p-24 rounded-[3rem] bg-black/20 backdrop-blur-md border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] space-y-32 relative z-20">
          
          {/* HERO SECTION */}
          <motion.section 
            initial="hidden" animate="visible" variants={fadeUp}
            className="flex flex-col-reverse md:flex-row items-start justify-between gap-8 relative z-20"
          >
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-display tracking-tight mb-4">
                Hi, I'm <span className="font-bold">{personalInfo.name}</span>
              </h1>
              <p className="text-2xl text-white/90 mb-8">{personalInfo.role}</p>
              <p className="text-xl text-white leading-relaxed mb-8">{personalInfo.bio}</p>
              
              <div className="flex gap-4">
                <a href={`mailto:${personalInfo.email}`} className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all cursor-pointer text-white hover:scale-105 active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </a>
                <a href={personalInfo.github} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all cursor-pointer text-white hover:scale-105 active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                </a>
                <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all cursor-pointer text-white hover:scale-105 active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
              </div>
            </div>
            
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border border-white/20 bg-white/5 backdrop-blur-xl shrink-0 relative z-20 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              <div className="w-full h-full flex items-center justify-center text-white/50 text-sm">Headshot</div>
            </div>
          </motion.section>

          {/* EXPERIENCE SECTION */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="relative z-20">
            <h2 className="text-4xl font-bold font-display text-white mb-8 border-b border-white/20 pb-4">Experience</h2>
            <div className="space-y-12 flex flex-col">
              {experiences.map((exp) => (
                <ExpandableExperience key={exp.id} exp={exp} />
              ))}
            </div>
          </motion.section>

          {/* PROJECTS SECTION */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="relative z-20">
            <h2 className="text-4xl font-bold font-display text-white mb-8 border-b border-white/20 pb-4">Selected Projects</h2>
            {/* UPDATED: Increased grid gap to gap-12 so the larger foundation cards don't touch */}
            <div className="grid md:grid-cols-2 gap-12">
              {projects.map((proj) => (
                <TiltWrapper key={proj.id}>
                  {/* UPDATED: Added p-6 md:p-8 and rounded-3xl to increase foundation card size */}
                  <a 
                    href={proj.link} 
                    style={{ transformStyle: "preserve-3d" }}
                    className="block group relative h-full w-full rounded-3xl bg-white/5 border border-white/10 p-6 md:p-8 hover:border-white/30 transition-colors"
                  >
                    
                    <div 
                      style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }} 
                      className="h-full w-full flex flex-col rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-6 shadow-2xl transition-colors group-hover:border-white/30"
                    >
                      <div className="w-full aspect-video mb-6 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-white/20 transition-colors">
                        <span className="text-white/40 text-sm font-sans tracking-widest uppercase">Thumbnail</span>
                      </div>

                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-bold text-white group-hover:text-white/90 transition-colors">{proj.title}</h3>
                        <svg className="w-6 h-6 text-white/50 group-hover:text-white transition-colors shrink-0 ml-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                      </div>
                      <p className="text-lg text-white/95 mb-6 flex-grow">{proj.description}</p>
                      <div className="text-base text-white/80 font-mono tracking-wider uppercase">{proj.tech}</div>
                    </div>
                  </a>
                </TiltWrapper>
              ))}
            </div>
          </motion.section>

          {/* SKILLS SECTION */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="relative z-20">
            <h2 className="text-4xl font-bold font-display text-white mb-8 border-b border-white/20 pb-4">Skills</h2>
            <div className="flex flex-wrap gap-4">
              {skills.map((skill, index) => (
                <span key={index} className="px-6 py-3 rounded-full bg-white/5 border border-white/20 text-lg text-white hover:bg-white/20 transition-colors cursor-default backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95 duration-200">
                  {skill}
                </span>
              ))}
            </div>
          </motion.section>

        </main>
      </div>
    </ShaderBackground>
  )
}