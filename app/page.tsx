"use client"
import { motion, Variants } from "framer-motion"
import { ShaderBackground } from "../components/ShaderBackground"
import { personalInfo, experiences, projects, skills } from "../data/portfolio"

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

export default function Home() {
  return (
    <ShaderBackground>
      <main className="max-w-4xl mx-auto px-6 py-24 md:py-32 space-y-32">
        
        {/* HERO SECTION - Untouched */}
        <motion.section 
          initial="hidden" animate="visible" variants={fadeUp}
          className="flex flex-col-reverse md:flex-row items-start justify-between gap-8"
        >
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-display tracking-tight mb-4">
              Hi, I'm <span className="font-bold">{personalInfo.name}</span>
            </h1>
            <p className="text-2xl text-white/90 mb-8">{personalInfo.role}</p>
            <p className="text-xl text-white leading-relaxed mb-8">{personalInfo.bio}</p>
            
            <div className="flex gap-4">
              <a href={`mailto:${personalInfo.email}`} className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all cursor-pointer text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </a>
              <a href={personalInfo.github} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all cursor-pointer text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </a>
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all cursor-pointer text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>
          
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border border-white/20 bg-white/5 backdrop-blur-xl shrink-0">
            <div className="w-full h-full flex items-center justify-center text-white/50 text-sm">Headshot</div>
          </div>
        </motion.section>

        {/* EXPERIENCE SECTION */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          <h2 className="text-4xl font-bold font-display text-white mb-8 border-b border-white/20 pb-4">Experience</h2>
          <div className="space-y-8">
            {experiences.map((exp) => (
              <div key={exp.id} className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 backdrop-blur-sm transition-all">
                <div className="flex justify-between items-start mb-2">
                  {/* Bumped to text-3xl */}
                  <h3 className="text-3xl font-bold text-white">{exp.role}</h3>
                  {/* Bumped to text-lg */}
                  <span className="text-lg text-white/80">{exp.duration}</span>
                </div>
                {/* Bumped to text-xl */}
                <h4 className="text-xl text-white/90 mb-4">{exp.company}</h4>
                {/* Bumped to text-lg */}
                <p className="text-lg text-white/95 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* PROJECTS SECTION */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          <h2 className="text-4xl font-bold font-display text-white mb-8 border-b border-white/20 pb-4">Selected Projects</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((proj) => (
              <a href={proj.link} key={proj.id} className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 backdrop-blur-sm transition-all cursor-pointer flex flex-col h-full">
                
                {/* THUMBNAIL BOX */}
                <div className="w-full aspect-video mb-6 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-white/20 transition-colors">
                  <span className="text-white/40 text-sm font-sans tracking-widest uppercase">Thumbnail</span>
                  {/* To use a real image later, replace the span above with this: */}
                  {/* <img src="/project-1-thumb.jpg" alt={proj.title} className="w-full h-full object-cover" /> */}
                </div>

                <div className="flex justify-between items-start mb-4">
                  {/* Bumped to text-2xl */}
                  <h3 className="text-2xl font-bold text-white">{proj.title}</h3>
                  <svg className="w-6 h-6 text-white/70 group-hover:text-white transition-colors shrink-0 ml-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                </div>
                {/* Bumped to text-lg */}
                <p className="text-lg text-white/95 mb-6 flex-grow">{proj.description}</p>
                {/* Bumped to text-base */}
                <div className="text-base text-white/80 font-mono tracking-wider uppercase">{proj.tech}</div>
              </a>
            ))}
          </div>
        </motion.section>

        {/* SKILLS SECTION */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          <h2 className="text-4xl font-bold font-display text-white mb-8 border-b border-white/20 pb-4">Skills</h2>
          <div className="flex flex-wrap gap-4">
            {skills.map((skill, index) => (
              <span key={index} className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-lg text-white hover:bg-white/20 transition-colors cursor-default">
                {skill}
              </span>
            ))}
          </div>
        </motion.section>

      </main>
    </ShaderBackground>
  )
}