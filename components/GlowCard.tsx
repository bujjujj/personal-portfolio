"use client"

import React, { CSSProperties, ReactNode, useEffect, useRef } from "react"

function svgPathD(r: number, w: number, h: number) {
  return r > 0
    ? `M ${r} 0 H ${w - r} A ${r} ${r} 0 0 1 ${w} ${r} V ${h - r} A ${r} ${r} 0 0 1 ${w - r} ${h} H ${r} A ${r} ${r} 0 0 1 0 ${h - r} V ${r} A ${r} ${r} 0 0 1 ${r} 0`
    : `M 0 0 H ${w} V ${h} H 0 V 0`
}

interface GlowLightConfig {
  /** How far the glow spreads ALONG the border edge (left-right reach along the path). */
  width?: number
  /** How far the glow bleeds INWARD from the border (keep this small for a thin edge-light look). */
  height?: number
  duration?: number
  color?: string
  /** Starting offset around the perimeter, 0-100. Use this to space multiple lights apart. */
  startOffset?: number
}

interface GlowCardProps {
  children: ReactNode
  /** Single-glow shorthand props (ignored if `lights` is provided). */
  lightWidth?: number
  lightHeight?: number
  duration?: number
  lightColor?: string
  /** Provide 2+ entries to run multiple independent glows around the border at once. */
  lights?: GlowLightConfig[]
  borderWidth?: number
  className?: string
}

/**
 * Same technique as StarButton: radial-gradient blob(s) animated along
 * an offset-path that traces the element's own border rectangle, sitting
 * *behind* the inner content layer so only a thin glow "leaks" out along
 * the edge as it travels around the perimeter.
 *
 * Unlike a button, width (spread along the edge) and height (how far it
 * bleeds inward) are independent here — keep height small so it reads as
 * a thin traveling light rather than a flood into the glass.
 */
export function GlowCard({
  children,
  lightWidth = 110,
  lightHeight = 24,
  duration = 8,
  lightColor = "#450011",
  lights,
  borderWidth = 1,
  className,
}: GlowCardProps) {
  const glows: Required<GlowLightConfig>[] = (
    lights && lights.length > 0
      ? lights
      : [{ width: lightWidth, height: lightHeight, duration, color: lightColor, startOffset: 0 }]
  ).map((l) => ({
    width: l.width ?? lightWidth,
    height: l.height ?? lightHeight,
    duration: l.duration ?? duration,
    color: l.color ?? lightColor,
    startOffset: l.startOffset ?? 0,
  }))
  const wrapperRef = useRef<HTMLDivElement>(null)
  const debugPathRef = useRef<SVGPathElement>(null) // TEMP DEBUG, remove with the overlay below

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return

    const setPath = () => {
      const w = el.offsetWidth
      const h = el.offsetHeight

      // Read the element's own border-radius so the glow's travel path
      // matches whatever rounding is applied via className (e.g. rounded-[3rem]),
      // instead of assuming a fixed value.
      const radiusRaw = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0
      // Clamp so the radius can't exceed half the shorter side (same
      // constraint the browser applies when rendering the rounded box).
      const r = Math.min(radiusRaw, w / 2, h / 2)

      const path = `path('${svgPathD(r, w, h)}')`

      el.style.setProperty("--path", path)

      // TEMP DEBUG: also render the path as a visible red SVG stroke so
      // you can see exactly what shape offset-path is using. Remove the
      // debugPathRef block (and this assignment) once geometry is confirmed.
      if (debugPathRef.current) {
        debugPathRef.current.setAttribute("d", svgPathD(r, w, h))
      }
    }

    setPath()

    // Card size (and therefore radius-vs-size clamping) can change unlike
    // a button, so keep the path in sync instead of measuring once.
    const ro = new ResizeObserver(setPath)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={wrapperRef}
      style={
        {
          "--border-width": `${borderWidth}px`,
          isolation: "isolate",
        } as CSSProperties
      }
      className={`group/glow-card relative overflow-hidden${className ? ` ${className}` : ""}`}
    >
      {/* Was supposed to be temp for debug, but I actually like the outline color*/}
      <svg className="pointer-events-none absolute inset-0 z-50 h-full w-full overflow-visible">
        <path
          ref={debugPathRef}
          fill="none"
          stroke="#7b0305"
          strokeWidth={2}
        />
      </svg>

      {/* Traveling glow(s), each masked to the perimeter via offset-path.
          Width = spread along the edge, height = how far it bleeds inward
          (kept small so it reads as a thin line of light, not a flood). */}
      {glows.map((glow, i) => (
        <div
          key={i}
          className="animate-glow-card absolute rounded-full bg-[radial-gradient(ellipse_at_center,var(--glow-color),transparent_70%)]"
          style={
            {
              offsetPath: "var(--path)",
              offsetRotate: "auto",
              offsetAnchor: "center center",
              top: 0,
              left: 0,
              width: `${glow.width}px`,
              height: `${glow.height}px`,
              animationDuration: `${glow.duration}s`,
              // Negative delay shifts where in the 0%→100% offset-distance
              // cycle this glow starts, without ever setting offsetDistance
              // directly (which fights the keyframe that also animates it).
              animationDelay: `-${(glow.startOffset / 100) * glow.duration}s`,
              "--glow-color": glow.color,
            } as CSSProperties
          }
        />
      ))}

      {/* Inner content layer sits on top, inset by border-width so the
          glow only shows through that thin gap — same layering as the
          button's StarBackground layer, just without the dotted texture
          since your glass card already has its own background/border. */}
      <div
        className="relative z-10 h-full w-full rounded-[inherit]"
        style={{
          margin: "var(--border-width)",
          width: "calc(100% - 2 * var(--border-width))",
          height: "calc(100% - 2 * var(--border-width))",
        }}
      >
        {children}
      </div>
    </div>
  )
}