"use client"

import { useEffect, useRef } from "react"

export default function FashionPage() {

  // Scroll reveal
  useEffect(() => {
    const reveals = document.querySelectorAll(".fh-reveal")
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("fh-reveal--visible")
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.12 }
      )
      reveals.forEach((el) => observer.observe(el))
    } else {
      reveals.forEach((el) => el.classList.add("fh-reveal--visible"))
    }

    // Sticky nav shadow
    const nav = document.getElementById("fh-nav")
    const onScroll = () => {
      if (nav) nav.classList.toggle("fh-nav--scrolled", window.scrollY > 10)
      highlightTab()
    }
    window.addEventListener("scroll", onScroll, { passive: true })

    // Active tab highlight
    const tabs = document.querySelectorAll(".fh-nav__tab")
    const sectionIds = ["women", "men", "kids", "accessories"]
    const sections = sectionIds.map((id) => document.getElementById(id))

    function highlightTab() {
      const windowH = window.innerHeight
      let activeId: string | null = null
      sections.forEach((section) => {
        if (!section) return
        const rect = section.getBoundingClientRect()
        if (rect.top <= windowH * 0.4 && rect.bottom >= windowH * 0.4) {
          activeId = section.id
        }
      })
      if (!activeId && window.scrollY < 200) activeId = "women"
      tabs.forEach((tab) =>
        tab.classList.toggle(
          "fh-nav__tab--active",
          (tab as HTMLElement).dataset.section === activeId
        )
      )
    }

    // Smooth scroll on tab click
    tabs.forEach((tab) => {
      tab.addEventListener("click", function (e) {
        e.preventDefault()
        const el = tab as HTMLElement
        const target = document.getElementById(el.dataset.section || "")
        if (target && nav) {
          const top =
            target.getBoundingClientRect().top +
            window.scrollY -
            nav.getBoundingClientRect().height -
            12
          window.scrollTo({ top, behavior: "smooth" })
        }
      })
    })

    // Filter chips
    function initChipGroup(selector: string, isAge = false) {
      const container = document.querySelector(selector)
      if (!container) return
      const chips = container.querySelectorAll(
        isAge ? ".fh-age-chip" : ".fh-chip"
      )
      chips.forEach((chip) => {
        chip.addEventListener("click", function () {
          chips.forEach((c) =>
            c.classList.remove(
              isAge ? "fh-age-chip--active" : "fh-chip--active"
            )
          )
          chip.classList.add(isAge ? "fh-age-chip--active" : "fh-chip--active")
        })
      })
    }

    initChipGroup("#fh-women-filters")
    initChipGroup("#fh-men-filters")
    initChipGroup("#fh-kids-filters")
    initChipGroup("#fh-age-chips", true)

    // Wishlist toggle
    document.querySelectorAll(".fh-card__wish").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation()
        const el = btn as HTMLElement
        const isFilled = el.textContent?.trim() === "♥"
        el.textContent = isFilled ? "♡" : "♥"
        el.style.color = isFilled ? "" : "#E85D75"
      })
    })

    // Add to bag flash
    document.querySelectorAll(".fh-card__add").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation()
        const el = btn as HTMLElement
        const orig = el.textContent || "+"
        el.textContent = "✓"
        el.style.background = "#22c55e"
        setTimeout(() => {
          el.textContent = orig
          el.style.background = ""
        }, 900)
      })
    })

    // Card click ring
    document.querySelectorAll(".fh-card").forEach((card) => {
      card.addEventListener("click", function (e) {
        const target = e.target as HTMLElement
        if (
          target.closest(".fh-card__add") ||
          target.closest(".fh-card__wish")
        )
          return
        const el = card as HTMLElement
        el.style.transition = "box-shadow 0.1s ease"
        el.style.boxShadow = "0 0 0 3px rgba(107,78,230,0.3)"
        setTimeout(() => {
          el.style.boxShadow = ""
          el.style.transition = ""
        }, 300)
      })
    })

    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <>
      <style>{`
        :root {
          --fh-cream: #F4F2FA;
          --fh-ink:   #18162B;
          --fh-accent:#6B4EE6;
          --fh-gray:  #8A82A8;
          --fh-line:  #E2DCF5;
          --fh-card:  #FAFAFE;
          --fh-deep:  #160E2B;
        }

        /* ANIMATIONS */
        @keyframes fh-fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fh-fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* CONTAINER */
        .fh-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }
        @media (min-width: 768px)  { .fh-container { padding: 0 48px; } }
        @media (min-width: 1024px) { .fh-container { padding: 0 64px; } }

        /* HERO */
        .fh-hero {
          position: relative;
          width: 100%;
          min-height: 100svh;
          background: var(--fh-deep);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          padding-top: 48px;
          padding-bottom: 80px;
        }
        .fh-hero__bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #160E2B 0%, #2A1A5E 40%, #1A0E3A 70%, #0D0820 100%);
          z-index: 0;
        }
        .fh-hero__bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 70% 40%, rgba(107,78,230,0.25) 0%, transparent 70%),
            radial-gradient(ellipse 40% 80% at 20% 80%, rgba(107,78,230,0.12) 0%, transparent 60%);
        }
        .fh-hero__content {
          position: relative;
          z-index: 2;
          padding: 0 24px;
        }
        @media (min-width: 768px)  { .fh-hero__content { padding: 0 48px; } }
        @media (min-width: 1024px) { .fh-hero__content { padding: 0 64px; } }
        .fh-hero__eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--fh-accent);
          margin-bottom: 20px;
          opacity: 0;
          animation: fh-fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.2s forwards;
        }
        .fh-hero__title {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: clamp(52px, 9vw, 128px);
          line-height: 0.92;
          color: #fff;
          letter-spacing: -0.02em;
          opacity: 0;
          animation: fh-fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.35s forwards;
        }
        .fh-hero__title em {
          font-style: normal;
          background: linear-gradient(135deg, #9B7EFF 0%, #6B4EE6 50%, #C4B5FD 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .fh-hero__sub {
          margin-top: 28px;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 300;
          font-size: clamp(14px, 1.5vw, 17px);
          color: rgba(255,255,255,0.5);
          max-width: 480px;
          opacity: 0;
          animation: fh-fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.55s forwards;
        }
        .fh-hero__cta-row {
          margin-top: 44px;
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          opacity: 0;
          animation: fh-fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.7s forwards;
        }
        .fh-hero__scroll {
          position: absolute;
          bottom: 32px;
          right: 48px;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0;
          animation: fh-fadeIn 1s ease 1.2s forwards;
        }
        .fh-hero__scroll span {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          writing-mode: vertical-lr;
        }
        .fh-hero__scroll-line {
          width: 1px;
          height: 48px;
          background: linear-gradient(to bottom, rgba(107,78,230,0.8), transparent);
        }

        /* BUTTONS */
        .fh-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 999px;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 500;
          font-size: 13px;
          letter-spacing: 0.04em;
          cursor: pointer;
          border: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          text-decoration: none;
        }
        .fh-btn:hover  { transform: translateY(-2px); }
        .fh-btn:active { transform: translateY(0); }
        .fh-btn--primary {
          background: var(--fh-accent);
          color: #fff;
          padding: 14px 32px;
          box-shadow: 0 4px 24px rgba(107,78,230,0.35);
        }
        .fh-btn--primary:hover {
          background: #7C63EF;
          box-shadow: 0 8px 32px rgba(107,78,230,0.45);
        }
        .fh-btn--ghost {
          background: transparent;
          color: rgba(255,255,255,0.7);
          padding: 14px 24px;
          border: 1px solid rgba(255,255,255,0.18);
        }
        .fh-btn--ghost:hover {
          background: rgba(255,255,255,0.06);
          color: #fff;
          border-color: rgba(255,255,255,0.3);
        }

        /* STICKY NAV */
.fh-nav {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(244,242,250,0.92);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-bottom: 1px solid var(--fh-line);
  transition: box-shadow 0.3s ease;
}
.fh-nav--scrolled { box-shadow: 0 4px 24px rgba(22,14,43,0.08); }
.fh-nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  gap: 8px;
}

/* Hide logo on mobile to give tabs full width */
.fh-nav__logo {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-size: 20px;
  letter-spacing: 0.12em;
  color: var(--fh-ink);
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  display: none;
}
@media (min-width: 768px) {
  .fh-nav__logo { display: block; }
}

/* Tabs take full width on mobile */
.fh-nav__tabs {
  display: flex;
  align-items: center;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  flex: 1;
  justify-content: flex-start;
}
.fh-nav__tabs::-webkit-scrollbar { display: none; }

.fh-nav__tab {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--fh-gray);
  text-decoration: none;
  padding: 8px 14px;
  border-radius: 999px;
  white-space: nowrap;
  transition: color 0.2s ease, background 0.2s ease;
  cursor: pointer;
  background: none;
  border: none;
  flex-shrink: 0;
}
.fh-nav__tab:hover   { color: var(--fh-ink); background: var(--fh-line); }
.fh-nav__tab--active { color: #fff; background: var(--fh-accent); }

/* Mobile: smaller tabs, full scroll row */
@media (max-width: 640px) {
  .fh-nav__tab {
    font-size: 9px;
    padding: 7px 12px;
    letter-spacing: 0.06em;
  }
}

        /* SECTION */
        .fh-section { padding: 80px 0; }
        @media (min-width: 1024px) { .fh-section { padding: 120px 0; } }
        .fh-section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 48px;
          gap: 20px;
          flex-wrap: wrap;
        }
        .fh-section-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--fh-accent);
          margin-bottom: 10px;
        }
        .fh-section-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 500;
          font-size: clamp(36px, 5vw, 60px);
          line-height: 1;
          color: var(--fh-ink);
          letter-spacing: -0.02em;
        }
        .fh-section-title em {
          font-style: italic;
          font-weight: 300;
          color: var(--fh-gray);
        }
        .fh-view-all {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--fh-accent);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          border-radius: 999px;
          border: 1px solid var(--fh-accent);
          transition: background 0.2s ease, color 0.2s ease;
          white-space: nowrap;
        }
        .fh-view-all:hover { background: var(--fh-accent); color: #fff; }

        /* FILTER CHIPS */
        .fh-filter-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 36px;
          flex-wrap: wrap;
        }
        .fh-chips { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .fh-chip {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 8px 18px;
          border-radius: 999px;
          border: 1px solid var(--fh-line);
          background: var(--fh-card);
          color: var(--fh-gray);
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }
        .fh-chip:hover   { border-color: var(--fh-accent); color: var(--fh-accent); }
        .fh-chip--active { background: var(--fh-accent); border-color: var(--fh-accent); color: #fff; }
        .fh-sort { display: flex; align-items: center; gap: 8px; }
        .fh-sort label {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--fh-gray);
          white-space: nowrap;
        }
        .fh-sort select {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px;
          color: var(--fh-ink);
          background: var(--fh-card);
          border: 1px solid var(--fh-line);
          border-radius: 999px;
          padding: 8px 36px 8px 16px;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238A82A8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          outline: none;
        }
        .fh-sort select:focus { border-color: var(--fh-accent); }

        /* PRODUCT GRID */
        .fh-product-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        @media (min-width: 768px)  { .fh-product-grid { gap: 28px; } }
        @media (min-width: 1024px) { .fh-product-grid { grid-template-columns: repeat(4, 1fr); gap: 24px; } }

        /* PRODUCT CARD */
        .fh-card {
          background: var(--fh-card);
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--fh-line);
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease;
          cursor: pointer;
          opacity: 0;
          animation: fh-fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .fh-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(22,14,43,0.12); }
        .fh-card:nth-child(1) { animation-delay: 0.05s; }
        .fh-card:nth-child(2) { animation-delay: 0.12s; }
        .fh-card:nth-child(3) { animation-delay: 0.19s; }
        .fh-card:nth-child(4) { animation-delay: 0.26s; }
        .fh-card__img {
          aspect-ratio: 3 / 4;
          background: var(--fh-line);
          position: relative;
          overflow: hidden;
        }
        .fh-card__img-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(160deg, #EDE8FC 0%, #D8D0F5 100%);
        }
        .fh-card__img-placeholder svg  { width: 40px; height: 40px; opacity: 0.35; color: var(--fh-accent); }
        .fh-card__img-placeholder span {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--fh-gray);
        }
        .fh-card__badge {
          position: absolute;
          top: 12px; left: 12px;
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 999px;
          z-index: 2;
        }
        .fh-card__badge--new  { background: var(--fh-accent); color: #fff; }
        .fh-card__badge--sale { background: #E85D75; color: #fff; }
        .fh-card__wish {
          position: absolute;
          top: 12px; right: 12px;
          width: 32px; height: 32px;
          border-radius: 999px;
          background: rgba(255,255,255,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 14px;
          z-index: 2;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .fh-card__wish:hover { background: #fff; transform: scale(1.1); }
        .fh-card__body { padding: 16px; }
        .fh-card__cat {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--fh-gray);
          margin-bottom: 6px;
        }
        .fh-card__name {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 500;
          font-size: 18px;
          line-height: 1.2;
          color: var(--fh-ink);
          margin-bottom: 10px;
        }
        .fh-card__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .fh-card__price {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: 15px;
          color: var(--fh-ink);
        }
        .fh-card__price s { font-weight: 400; color: var(--fh-gray); margin-right: 6px; font-size: 13px; }
        .fh-card__add {
          width: 34px; height: 34px;
          border-radius: 999px;
          background: var(--fh-accent);
          border: none;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 18px;
          transition: background 0.2s ease, transform 0.2s ease;
          flex-shrink: 0;
        }
        .fh-card__add:hover { background: #7C63EF; transform: scale(1.08); }

        /* SPLIT BANNER */
        .fh-women { background: var(--fh-cream); }
        .fh-split-banner {
          display: grid;
          grid-template-columns: 1fr;
          border-radius: 24px;
          overflow: hidden;
          margin-bottom: 48px;
          border: 1px solid var(--fh-line);
          min-height: 380px;
        }
        @media (min-width: 768px) {
          .fh-split-banner { grid-template-columns: 1fr 1fr; min-height: 440px; }
        }
        .fh-split-banner__img {
          background: linear-gradient(135deg, #2A1A5E 0%, #6B4EE6 60%, #9B7EFF 100%);
          position: relative;
          min-height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .fh-split-banner__img-label {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          z-index: 2;
        }
        .fh-split-banner__img-label svg  { width: 48px; height: 48px; opacity: 0.4; color: #fff; }
        .fh-split-banner__img-label span {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }
        .fh-split-banner__content {
          background: var(--fh-deep);
          padding: 48px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 20px;
        }
        .fh-split-banner__eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--fh-accent);
        }
        .fh-split-banner__title {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: clamp(32px, 4vw, 52px);
          line-height: 1.05;
          color: #fff;
        }
        .fh-split-banner__desc {
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          line-height: 1.7;
          max-width: 300px;
        }
        .fh-split-banner__tags { display: flex; gap: 8px; flex-wrap: wrap; }
        .fh-split-banner__tag {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 999px;
          border: 1px solid rgba(107,78,230,0.4);
          color: rgba(255,255,255,0.6);
        }

        /* MEN'S */
        .fh-men {
          background: #fff;
          border-top: 1px solid var(--fh-line);
          border-bottom: 1px solid var(--fh-line);
        }
        .fh-men__accent-bar {
          width: 60px; height: 3px;
          background: var(--fh-accent);
          border-radius: 999px;
          margin-top: 12px;
        }

        /* KIDS */
        .fh-kids { background: var(--fh-cream); }
        .fh-kids-hero {
          border-radius: 24px;
          background: linear-gradient(135deg, var(--fh-deep) 0%, #2A1A5E 50%, #1E1147 100%);
          padding: 56px 48px;
          margin-bottom: 48px;
          position: relative;
          overflow: hidden;
        }
        .fh-kids-hero::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(107,78,230,0.2) 0%, transparent 70%);
        }
        .fh-kids-hero::after {
          content: '';
          position: absolute;
          bottom: -40px; left: 30%;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(155,126,255,0.12) 0%, transparent 70%);
        }
        .fh-kids-hero__inner    { position: relative; z-index: 2; }
        .fh-kids-hero__eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--fh-accent);
          margin-bottom: 16px;
        }
        .fh-kids-hero__title {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: clamp(36px, 5vw, 64px);
          color: #fff;
          line-height: 1;
          margin-bottom: 24px;
        }
        .fh-kids-hero__desc {
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          max-width: 400px;
          margin-bottom: 32px;
          line-height: 1.7;
        }
        .fh-age-chips { display: flex; gap: 10px; flex-wrap: wrap; }
        .fh-age-chip {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 10px 20px;
          border-radius: 999px;
          border: 1px solid rgba(107,78,230,0.5);
          color: rgba(255,255,255,0.75);
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
          background: rgba(107,78,230,0.1);
        }
        .fh-age-chip:hover   { background: rgba(107,78,230,0.25); color: #fff; border-color: var(--fh-accent); }
        .fh-age-chip--active { background: var(--fh-accent); border-color: var(--fh-accent); color: #fff; }

        /* KIDS CAT GRID */
        .fh-kids-cat-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 48px;
        }
        @media (min-width: 768px) { .fh-kids-cat-grid { gap: 24px; } }
        .fh-kids-cat-card {
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          aspect-ratio: 1 / 1;
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .fh-kids-cat-card:hover { transform: scale(1.02); }
        .fh-kids-cat-card__bg {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .fh-kids-cat-card__bg svg  { width: 36px; height: 36px; opacity: 0.3; }
        .fh-kids-cat-card__bg span {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          opacity: 0.5;
        }
        .fh-kids-cat-card--a { background: linear-gradient(135deg, #D8D0F5 0%, #B8A9F0 100%); color: var(--fh-deep); }
        .fh-kids-cat-card--b { background: linear-gradient(135deg, #C4B5FD 0%, #A78BFA 100%); color: var(--fh-deep); }
        .fh-kids-cat-card--c { background: linear-gradient(135deg, #EDE8FC 0%, #D4C8F8 100%); color: var(--fh-deep); }
        .fh-kids-cat-card--d { background: linear-gradient(135deg, #2A1A5E 0%, #4C35A0 100%); color: #fff; }
        .fh-kids-cat-card__label {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 16px 20px;
          background: linear-gradient(to top, rgba(22,14,43,0.6) 0%, transparent 100%);
        }
        .fh-kids-cat-card--a .fh-kids-cat-card__label,
        .fh-kids-cat-card--b .fh-kids-cat-card__label,
        .fh-kids-cat-card--c .fh-kids-cat-card__label {
          background: linear-gradient(to top, rgba(22,14,43,0.35) 0%, transparent 100%);
        }
        .fh-kids-cat-card__label-age {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          margin-bottom: 4px;
        }
        .fh-kids-cat-card__label-name {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 500;
          font-size: 20px;
          color: #fff;
        }

        /* ACCESSORIES */
        .fh-accessories { background: var(--fh-deep); padding: 80px 0; }
        @media (min-width: 1024px) { .fh-accessories { padding: 120px 0; } }
        .fh-accessories .fh-section-title   { color: #fff; }
        .fh-accessories .fh-section-eyebrow { color: #9B7EFF; }
        .fh-accessories .fh-view-all        { color: rgba(255,255,255,0.6); border-color: rgba(255,255,255,0.2); }
        .fh-accessories .fh-view-all:hover  { background: rgba(255,255,255,0.08); color: #fff; }
        .fh-acc-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 768px) {
          .fh-acc-grid { grid-template-columns: 1.6fr 1fr; grid-template-rows: auto auto auto; gap: 20px; }
        }
        .fh-acc-card {
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .fh-acc-card:hover { transform: scale(1.015); }
        .fh-acc-card--featured { grid-row: 1 / 4; min-height: 560px; }
        @media (max-width: 767px) { .fh-acc-card--featured { min-height: 340px; } }
        .fh-acc-card--sm { min-height: 180px; }
        .fh-acc-card__img-bg {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .fh-acc-card__img-bg svg  { width: 40px; height: 40px; opacity: 0.25; }
        .fh-acc-card__img-bg span {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          opacity: 0.35;
        }
        .fh-acc-card--featured .fh-acc-card__img-bg           { background: linear-gradient(160deg, #1E1147 0%, #2D1B69 50%, #1A0E3A 100%); color: rgba(255,255,255,0.9); }
        .fh-acc-card--sm:nth-of-type(2) .fh-acc-card__img-bg { background: linear-gradient(135deg, #231545 0%, #3D2870 100%); color: rgba(255,255,255,0.9); }
        .fh-acc-card--sm:nth-of-type(3) .fh-acc-card__img-bg { background: linear-gradient(135deg, #1A1040 0%, #4C35A0 100%); color: rgba(255,255,255,0.9); }
        .fh-acc-card--sm:nth-of-type(4) .fh-acc-card__img-bg { background: linear-gradient(135deg, #2A1A5E 0%, #6B4EE6 100%); color: rgba(255,255,255,0.9); }
        .fh-acc-card__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(22,14,43,0.85) 0%, rgba(22,14,43,0.1) 50%, transparent 100%);
          z-index: 2;
        }
        .fh-acc-card__info { position: absolute; bottom: 0; left: 0; right: 0; padding: 24px; z-index: 3; }
        .fh-acc-card__cat {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          margin-bottom: 6px;
        }
        .fh-acc-card__name {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 500;
          font-size: 22px;
          color: #fff;
          margin-bottom: 12px;
          line-height: 1.1;
        }
        .fh-acc-card--featured .fh-acc-card__name { font-size: 32px; }
        .fh-acc-card__footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .fh-acc-card__price  { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; color: #fff; }
        .fh-acc-card__cta {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 8px 18px;
          border-radius: 999px;
          background: rgba(107,78,230,0.7);
          border: 1px solid rgba(107,78,230,0.5);
          color: #fff;
          cursor: pointer;
          transition: background 0.2s ease;
          text-decoration: none;
          white-space: nowrap;
        }
        .fh-acc-card__cta:hover { background: var(--fh-accent); }

        /* SCROLL REVEAL */
        .fh-reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1);
        }
        .fh-reveal--visible  { opacity: 1; transform: translateY(0); }
        .fh-reveal--delay-1  { transition-delay: 0.1s; }
        .fh-reveal--delay-2  { transition-delay: 0.2s; }
        .fh-reveal--delay-3  { transition-delay: 0.3s; }
        .fh-reveal--delay-4  { transition-delay: 0.4s; }
      `}</style>

      {/* ── HERO ── */}
      <section className="fh-hero" aria-label="Fashion hero banner">
        <div className="fh-hero__bg" />
        <div className="fh-hero__content">
          <p className="fh-hero__eyebrow">DJONOVA · SS2025 Collection</p>
          <h1 className="fh-hero__title">
            FASHION /<br />
            for <em>everyone.</em>
          </h1>
          <p className="fh-hero__sub">
            Timeless silhouettes crafted for every body, every story, every season.
          </p>
          <div className="fh-hero__cta-row">
            <a href="#women" className="fh-btn fh-btn--primary">Explore Collection →</a>
            <a href="#accessories" className="fh-btn fh-btn--ghost">View Lookbook</a>
          </div>
        </div>
        <div className="fh-hero__scroll">
          <div className="fh-hero__scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ── STICKY CATEGORY NAV ── */}
      <nav className="fh-nav" id="fh-nav" aria-label="Category navigation">
        <div className="fh-container">
          <div className="fh-nav__inner">
            <a href="/categories/fashion" className="fh-nav__logo">DJONOVA</a>
            <div className="fh-nav__tabs" role="tablist">
              <button className="fh-nav__tab fh-nav__tab--active" data-section="women" role="tab">Women&apos;s</button>
              <button className="fh-nav__tab" data-section="men" role="tab">Men&apos;s</button>
              <button className="fh-nav__tab" data-section="kids" role="tab">Kids</button>
              <button className="fh-nav__tab" data-section="accessories" role="tab">Accessories</button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── WOMEN'S ── */}
      <section className="fh-section fh-women" id="women" aria-label="Women's Wear">
        <div className="fh-container">
          <div className="fh-section-header fh-reveal">
            <div>
              <p className="fh-section-eyebrow">01 — Women&apos;s Wear</p>
              <h2 className="fh-section-title">Made to <em>move you.</em></h2>
            </div>
            <a href="/categories/fashion/womenwear" className="fh-view-all">View All →</a>
          </div>

          <div className="fh-split-banner fh-reveal fh-reveal--delay-1">
            <div className="fh-split-banner__img">
              <div className="fh-split-banner__img-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
                </svg>
                <span>800 × 600 px</span>
              </div>
            </div>
            <div className="fh-split-banner__content">
              <p className="fh-split-banner__eyebrow">Featured Drop</p>
              <h3 className="fh-split-banner__title">Spring Edit<br />2025</h3>
              <p className="fh-split-banner__desc">Lightweight layers and fluid silhouettes for the new season — wear morning to midnight.</p>
              <div className="fh-split-banner__tags">
                <span className="fh-split-banner__tag">New Arrivals</span>
                <span className="fh-split-banner__tag">Trending</span>
                <span className="fh-split-banner__tag">Editor&apos;s Pick</span>
              </div>
              <div>
                <a href="/categories/fashion/womenwear" className="fh-btn fh-btn--primary">Shop the Edit</a>
              </div>
            </div>
          </div>

          <div className="fh-filter-bar fh-reveal fh-reveal--delay-2" id="fh-women-filters">
            <div className="fh-chips" role="group" aria-label="Women's filters">
              <button className="fh-chip fh-chip--active" data-group="women">All</button>
              <button className="fh-chip" data-group="women">Dresses</button>
              <button className="fh-chip" data-group="women">Tops</button>
              <button className="fh-chip" data-group="women">Trousers</button>
              <button className="fh-chip" data-group="women">Outerwear</button>
              <button className="fh-chip" data-group="women">Activewear</button>
            </div>
            <div className="fh-sort">
              <label htmlFor="fh-sort-women">Sort</label>
              <select id="fh-sort-women">
                <option>Newest</option>
                <option>Price: Low–High</option>
                <option>Price: High–Low</option>
                <option>Best Sellers</option>
              </select>
            </div>
          </div>

          <div className="fh-product-grid" id="fh-women-grid">
            {[
              { cat: "Dresses", name: "Lavender Drape Midi", price: "£118.00", badge: "new" },
              { cat: "Tops", name: "Silk Bias Cami", price: "£57.60", oldPrice: "£72.00", badge: "sale", saleLabel: "−20%" },
              { cat: "Trousers", name: "Wide Leg Linen Pant", price: "£94.00" },
              { cat: "Outerwear", name: "Cocoon Coat Violet", price: "£229.00", badge: "new" },
            ].map((item, i) => (
              <article className="fh-card" key={i}>
                <div className="fh-card__img">
                  <div className="fh-card__img-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
                    </svg>
                    <span>600 × 800 px</span>
                  </div>
                  {item.badge === "new" && <span className="fh-card__badge fh-card__badge--new">New</span>}
                  {item.badge === "sale" && <span className="fh-card__badge fh-card__badge--sale">{item.saleLabel}</span>}
                  <div className="fh-card__wish" aria-label="Add to wishlist">♡</div>
                </div>
                <div className="fh-card__body">
                  <p className="fh-card__cat">{item.cat}</p>
                  <h3 className="fh-card__name">{item.name}</h3>
                  <div className="fh-card__footer">
                    <span className="fh-card__price">
                      {item.oldPrice && <s>{item.oldPrice}</s>}
                      {item.price}
                    </span>
                    <button className="fh-card__add" aria-label="Add to bag">+</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEN'S ── */}
      <section className="fh-section fh-men" id="men" aria-label="Men's Wear">
        <div className="fh-container">
          <div className="fh-section-header fh-reveal">
            <div>
              <p className="fh-section-eyebrow">02 — Men&apos;s Wear</p>
              <h2 className="fh-section-title">Sharp. <em>Considered.</em></h2>
              <div className="fh-men__accent-bar" />
            </div>
            <a href="/categories/fashion/menswear" className="fh-view-all">View All →</a>
          </div>

          <div className="fh-filter-bar fh-reveal fh-reveal--delay-1" id="fh-men-filters">
            <div className="fh-chips" role="group" aria-label="Men's filters">
              <button className="fh-chip fh-chip--active" data-group="men">All</button>
              <button className="fh-chip" data-group="men">T-Shirts</button>
              <button className="fh-chip" data-group="men">Shirts</button>
              <button className="fh-chip" data-group="men">Trousers</button>
              <button className="fh-chip" data-group="men">Jackets</button>
              <button className="fh-chip" data-group="men">Hoodies</button>
            </div>
            <div className="fh-sort">
              <label htmlFor="fh-sort-men">Sort</label>
              <select id="fh-sort-men">
                <option>Newest</option>
                <option>Price: Low–High</option>
                <option>Price: High–Low</option>
                <option>Best Sellers</option>
              </select>
            </div>
          </div>

          <div className="fh-product-grid fh-reveal fh-reveal--delay-2" id="fh-men-grid">
            {[
              { cat: "Jackets", name: "Structured Blazer Ink", price: "£195.00", badge: "new" },
              { cat: "Shirts", name: "Linen Oversize Shirt", price: "£88.00" },
              { cat: "Trousers", name: "Tapered Wool Trouser", price: "£95.20", oldPrice: "£112.00", badge: "sale", saleLabel: "−15%" },
              { cat: "Hoodies", name: "French Terry Hoodie", price: "£135.00", badge: "new" },
            ].map((item, i) => (
              <article className="fh-card" key={i}>
                <div className="fh-card__img">
                  <div className="fh-card__img-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
                    </svg>
                    <span>600 × 800 px</span>
                  </div>
                  {item.badge === "new" && <span className="fh-card__badge fh-card__badge--new">New</span>}
                  {item.badge === "sale" && <span className="fh-card__badge fh-card__badge--sale">{item.saleLabel}</span>}
                  <div className="fh-card__wish" aria-label="Add to wishlist">♡</div>
                </div>
                <div className="fh-card__body">
                  <p className="fh-card__cat">{item.cat}</p>
                  <h3 className="fh-card__name">{item.name}</h3>
                  <div className="fh-card__footer">
                    <span className="fh-card__price">
                      {item.oldPrice && <s>{item.oldPrice}</s>}
                      {item.price}
                    </span>
                    <button className="fh-card__add" aria-label="Add to bag">+</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── KIDS ── */}
      <section className="fh-section fh-kids" id="kids" aria-label="Kids and Toddlers">
        <div className="fh-container">
          <div className="fh-section-header fh-reveal">
            <div>
              <p className="fh-section-eyebrow">03 — Kids &amp; Toddlers</p>
              <h2 className="fh-section-title">Little ones, <em>big style.</em></h2>
            </div>
            <a href="/categories/fashion/kidswear" className="fh-view-all">View All →</a>
          </div>

          <div className="fh-kids-hero fh-reveal fh-reveal--delay-1">
            <div className="fh-kids-hero__inner">
              <p className="fh-kids-hero__eyebrow">Shop by Age Group</p>
              <h3 className="fh-kids-hero__title">Every age,<br />every adventure.</h3>
              <p className="fh-kids-hero__desc">From first steps to teenage style — beautifully made clothes that grow with them.</p>
              <div className="fh-age-chips" role="group" id="fh-age-chips">
                <button className="fh-age-chip fh-age-chip--active">Toddler 1–3</button>
                <button className="fh-age-chip">Kids 4–7</button>
                <button className="fh-age-chip">Kids 8–12</button>
                <button className="fh-age-chip">Teen 13–16</button>
              </div>
            </div>
          </div>

          <div className="fh-kids-cat-grid fh-reveal fh-reveal--delay-2">
            {[
              { cls: "a", age: "Ages 1–3", name: "Toddlers" },
              { cls: "b", age: "Ages 4–7", name: "Little Kids" },
              { cls: "c", age: "Ages 8–12", name: "Big Kids" },
              { cls: "d", age: "Ages 13–16", name: "Teens" },
            ].map((item) => (
              <div className={`fh-kids-cat-card fh-kids-cat-card--${item.cls}`} key={item.cls}>
                <div className="fh-kids-cat-card__bg">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
                  </svg>
                  <span>480 × 480 px</span>
                </div>
                <div className="fh-kids-cat-card__label">
                  <p className="fh-kids-cat-card__label-age">{item.age}</p>
                  <p className="fh-kids-cat-card__label-name">{item.name}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="fh-filter-bar fh-reveal fh-reveal--delay-3" id="fh-kids-filters">
            <div className="fh-chips" role="group" aria-label="Kids filters">
              <button className="fh-chip fh-chip--active" data-group="kids">All</button>
              <button className="fh-chip" data-group="kids">Tops</button>
              <button className="fh-chip" data-group="kids">Bottoms</button>
              <button className="fh-chip" data-group="kids">Sets</button>
              <button className="fh-chip" data-group="kids">Outerwear</button>
            </div>
            <div className="fh-sort">
              <label htmlFor="fh-sort-kids">Sort</label>
              <select id="fh-sort-kids">
                <option>Newest</option>
                <option>Price: Low–High</option>
                <option>Age: Youngest</option>
                <option>Best Sellers</option>
              </select>
            </div>
          </div>

          <div className="fh-product-grid fh-reveal fh-reveal--delay-4" id="fh-kids-grid">
            {[
              { cat: "Sets · Ages 1–3", name: "Cloud Soft Playsuit", price: "£38.00", badge: "new" },
              { cat: "Tops · Ages 4–7", name: "Mini Stripe Tee", price: "£24.00" },
              { cat: "Outerwear · Ages 8–12", name: "Puffer Jacket Lilac", price: "£61.20", oldPrice: "£68.00", badge: "sale", saleLabel: "−10%" },
              { cat: "Bottoms · Ages 13–16", name: "Teen Wide Leg Denim", price: "£55.00", badge: "new" },
            ].map((item, i) => (
              <article className="fh-card" key={i}>
                <div className="fh-card__img">
                  <div className="fh-card__img-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
                    </svg>
                    <span>600 × 800 px</span>
                  </div>
                  {item.badge === "new" && <span className="fh-card__badge fh-card__badge--new">New</span>}
                  {item.badge === "sale" && <span className="fh-card__badge fh-card__badge--sale">{item.saleLabel}</span>}
                  <div className="fh-card__wish" aria-label="Add to wishlist">♡</div>
                </div>
                <div className="fh-card__body">
                  <p className="fh-card__cat">{item.cat}</p>
                  <h3 className="fh-card__name">{item.name}</h3>
                  <div className="fh-card__footer">
                    <span className="fh-card__price">
                      {item.oldPrice && <s>{item.oldPrice}</s>}
                      {item.price}
                    </span>
                    <button className="fh-card__add" aria-label="Add to bag">+</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
