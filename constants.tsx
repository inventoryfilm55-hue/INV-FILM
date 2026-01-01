
import { Project, SiteContent } from './types';

export const DEFAULT_SITE_CONTENT: SiteContent = {
  directors: {
    name: "JUNG",
    subName: "JUNE",
    manifesto: "WE DON'T JUST RECORD MOMENTS. WE INVENTORY THE ESSENCE OF HUMAN EMOTION THROUGH LIGHT AND SHADOW.",
    processTitle: "Process",
    processDesc: "Jung June operates at the intersection of cinematic tradition and digital evolution. His process involves a rigorous deconstruction of brand DNA.",
    techTitle: "Technology",
    techDesc: "Utilizing state-of-the-art optical tools and proprietary AI-driven pre-visualization, he bridges the gap between imagination and reality.",
    disciplines: ['Cinematic Storytelling', 'Automotive Art', 'Luxury Branding', 'Abstract Narratives', 'AI-Enhanced Vision', 'Futuristic Minimalism'],
    stats: [
      { label: "Years of Excellence", value: "12+" },
      { label: "Campaign Deliveries", value: "500" },
      { label: "Innovation", value: "∞" },
      { label: "Vision", value: "ONE" }
    ]
  },
  about: {
    headline: "WE CRAFT VISUAL NARRATIVES FOR THE BOLD.",
    description1: "Founded with the vision to bridge the gap between commercial efficiency and cinematic art, INV-FILM has become the primary destination for global brands.",
    description2: "We believe every frame is an inventory of human emotion, technical precision, and cultural zeitgeist. From Samsung to Genesis, our portfolio reflects a commitment to the 'Bold' aesthetic.",
    img1: "https://images.unsplash.com/photo-1492691523567-6170c81efad1?q=80&w=1470&auto=format&fit=crop",
    img2: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1470&auto=format&fit=crop",
    philosophy: "PRECISION IN CHAOS",
    hub: "SEOUL & BEYOND",
    innovation: "NEURAL CINEMA LABS"
  }
};

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'SAMSUNG - THE ALLIANCE',
    category: 'BRANDED CONTENT',
    thumbnail: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=1471&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    client: 'SAMSUNG',
    director: 'INV-FILM',
    year: '2024',
    aspectRatio: '16:9',
    description: 'A global campaign for Samsung Galaxy, focusing on the seamless connection between devices.',
    gallery: ['https://picsum.photos/seed/s1/1200/675', 'https://picsum.photos/seed/s2/1200/675']
  },
  {
    id: '2',
    title: 'GENESIS - THE EVOLUTION',
    category: 'BRANDED CONTENT',
    thumbnail: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1470&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    client: 'GENESIS MOTORS',
    director: 'INV-FILM',
    year: '2024',
    aspectRatio: '16:9',
    description: 'Redefining luxury through architectural lines and silent motion.',
    gallery: ['https://picsum.photos/seed/g1/1200/675']
  },
  {
    id: '3',
    title: 'AESTURA - DERMA EDIT',
    category: 'BRANDED CONTENT',
    thumbnail: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1374&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    client: 'AESTURA',
    director: 'KIM SEONG-MIN',
    year: '2024',
    aspectRatio: '9:16',
    description: 'A vertical series exploring the science of skincare.',
    gallery: ['https://picsum.photos/seed/ae1/600/1067']
  }
];