export interface MarvelCarouselSlide {
  id: string
  eyebrow: string
  title: string
  highlight: string
  description: string
  image: string
  /** Tailwind gradient accent for overlay */
  accent: 'red' | 'blue' | 'gold' | 'purple'
}

export const MARVEL_CAROUSEL_SLIDES: MarvelCarouselSlide[] = [
  {
    id: 'avengers',
    eyebrow: 'Earth\'s mightiest drop',
    title: 'Assemble',
    highlight: 'Your look',
    description: 'Limited-run tees and hoodies inspired by the heroes who save the world.',
    image:
      'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1600&q=80',
    accent: 'red',
  },
  {
    id: 'spider',
    eyebrow: 'Friendly neighborhood style',
    title: 'Web-sling',
    highlight: 'In comfort',
    description: 'Lightweight kicks and streetwear built for city swings and daily patrols.',
    image:
      'https://images.unsplash.com/photo-1612036781322-67a1096e8d2e?w=1600&q=80',
    accent: 'blue',
  },
  {
    id: 'wakanda',
    eyebrow: 'Wakanda forever',
    title: 'Royal',
    highlight: 'Tech wear',
    description: 'Premium shirts and accessories with vibranium-grade detail.',
    image:
      'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=1600&q=80',
    accent: 'purple',
  },
  {
    id: 'cosmic',
    eyebrow: 'Guardians approved',
    title: 'Cosmic',
    highlight: 'Collection',
    description: 'Caps, bags, and gear for missions across the galaxy.',
    image:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80',
    accent: 'gold',
  },
]
