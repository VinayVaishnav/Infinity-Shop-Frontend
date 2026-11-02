import { useCallback, useEffect, useState } from 'react'
import {
  MARVEL_CAROUSEL_SLIDES,
  type MarvelCarouselSlide,
} from '../constants/marvelCarouselSlides'

const AUTO_MS = 5500

const accentOverlay: Record<MarvelCarouselSlide['accent'], string> = {
  red: 'from-red-950/90 via-red-950/40 to-transparent',
  blue: 'from-blue-950/90 via-blue-950/40 to-transparent',
  gold: 'from-amber-950/90 via-amber-950/30 to-transparent',
  purple: 'from-purple-950/90 via-purple-950/40 to-transparent',
}

const accentText: Record<MarvelCarouselSlide['accent'], string> = {
  red: 'text-red-400',
  blue: 'text-blue-400',
  gold: 'text-amber-400',
  purple: 'text-purple-400',
}

export function MarvelCarousel() {
  const slides = MARVEL_CAROUSEL_SLIDES
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const goTo = useCallback(
    (next: number) => {
      const len = slides.length
      setIndex(((next % len) + len) % len)
    },
    [slides.length],
  )

  const next = useCallback(() => goTo(index + 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1), [goTo, index])

  useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, AUTO_MS)
    return () => window.clearInterval(id)
  }, [paused, slides.length])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  const slide = slides[index]

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-red-800/50 bg-black shadow-2xl shadow-red-950/30"
      aria-roledescription="carousel"
      aria-label="Featured Marvel collections"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="relative flex transition-transform duration-700 ease-out will-change-transform"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((s) => (
          <article
            key={s.id}
            className="relative min-w-full shrink-0"
            aria-hidden={s.id !== slide.id}
          >
            <div className="relative aspect-[16/9] max-h-[420px] w-full sm:aspect-[21/9]">
              <img
                src={s.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-r ${accentOverlay[s.accent]}`}
              />
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-12">
                <p
                  className={`text-xs font-bold uppercase tracking-[0.35em] ${accentText[s.accent]}`}
                >
                  {s.eyebrow}
                </p>
                <h2 className="mt-2 font-display text-4xl uppercase leading-[0.95] text-white sm:text-5xl md:text-6xl lg:text-7xl">
                  {s.title}
                  <span className={`block ${accentText[s.accent]}`}>{s.highlight}</span>
                </h2>
                <p className="mt-3 max-w-md text-sm text-zinc-200 sm:text-base">
                  {s.description}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div
        className="pointer-events-none absolute left-0 top-0 z-10 h-1 w-full bg-zinc-900/80"
        aria-hidden
      >
        <div
          key={index}
          className="h-full bg-red-600"
          style={{
            animation: paused
              ? 'none'
              : `marvel-carousel-progress ${AUTO_MS}ms linear forwards`,
          }}
        />
      </div>

      <button
        type="button"
        onClick={prev}
        className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur transition hover:border-red-500 hover:bg-red-950/80"
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur transition hover:border-red-500 hover:bg-red-950/80"
        aria-label="Next slide"
      >
        ›
      </button>

      <div
        className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2"
        role="tablist"
        aria-label="Choose slide"
      >
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Slide ${i + 1}: ${s.title}`}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all ${
              i === index
                ? 'w-8 bg-red-500'
                : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute right-4 top-4 hidden font-display text-5xl uppercase text-white/10 sm:block">
        Pow!
      </div>
    </section>
  )
}
