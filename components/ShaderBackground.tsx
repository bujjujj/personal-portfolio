// components/ShaderBackground.tsx
"use client"
import { MeshGradient } from "@paper-design/shaders-react"
import type React from "react"
import { useEffect, useRef, useState } from "react"

export function ShaderBackground({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  return (
    <div ref={containerRef} className="min-h-screen w-full relative bg-black selection:bg-white/30 text-white">
      {/* SVG Filters */}
      <svg className="absolute inset-0 w-0 h-0">
        <defs>
          <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
            <feColorMatrix type="matrix" values="1 0 0 0 0.02 0 1 0 0 0.02 0 0 1 0 0.05 0 0 0 0.9 0" result="tint" />
          </filter>
        </defs>
      </svg>

      {/* Background Shaders */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <MeshGradient
          className="absolute inset-0 w-full h-full"
          colors={["#ecef99","#bcd8b0","#c1e4a4","#9fc99b","#b6e5a3"]} 
          //["#000000", "#1a1a2e", "#ffffff", "#0f3460", "#16213e"] 7/10
          //["#ff7e5f", "#feb47b", "#ff9966", "#ff5e62", "#e65c00"] 8/10
          //["#f7b267","#f79d65","#f4845f","#f27059","#f25c54"] 8.1/10
          //["#0f172a", "#020617", "#334155", "#1e293b", "#000000"] 7/10
          //["#00b4db", "#0083b0", "#005c97", "#363795", "#0052d4"] 7/10
          //["#5d2a42","#fb6376","#fcb1a6","#ffdccc","#fff9ec"] 7.7/10
          //["#333745","#e63462","#fe5f55","#c7efcf","#eef5db"] 7.6/10
          //["#dbc2cf","#9fa2b2","#3c7a89","#2e4756","#16262e"] 7.3/10
          //["#dde392","#afbe8f","#7d8570","#646f58","#504b3a"] 7.9/10

          //["#6f1d1b","#bb9457","#432818","#99582a","#ffe6a7"] 8.1/10 (gold theme)

          //["#e7ef99","#bcd8b0","#c1e4a4","#9fc99b","#b6e5a3"]
          //["#5d2a42","#fb6376","#fcb1a6","#ffdccc","#fff9ec"] 7.5/10
          //["#ceaa7b","#ce9064","#ba5f3b","#9f4c3e","#833920"] 8/10
          
          speed={0.15}
          //backgroundColor="#000000"
        />
        <MeshGradient
          className="absolute inset-0 w-full h-full opacity-30"
          colors={["#000000", "#ffffff", "#1a1a2e", "#000000"]}
          speed={0.1}
          //wireframe="true"
          //backgroundColor="transparent"
        />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  )
}