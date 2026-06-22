import { Product, TestimonialItem } from "@/types/types";

export const PRODUCTS: Product[] = [
  {
    id: "ELY-001",
    name: "Asymmetric Cape Coat",
    price: 48000,
    originalPrice: 56000,
    category: "outerwear",
    collection: "Artifacts 01",
    description:
      "Sculpted with premium heavy twill and an ultra-fluid raw silk lining. Designed to react beautifully to movement while maintaining an imposing, sharp posture. Each piece is hand-tailored to your measurements.",
    images: ["/assets/hero_files/main1.jpg", "/assets/hero_files/Hero1.jpg"],
    isCustomizable: true,
    isBestseller: true,
    status: "limited",
    sizes: ["XS", "S", "M", "L", "XL", "Custom"],
    colors: ["Obsidian", "Deep Navy", "Champagne"],
  },
  {
    id: "ELY-002",
    name: "Sharp Geometric Coat",
    price: 65000,
    category: "outerwear",
    collection: "Artifacts 01",
    description:
      "Crafted from highly rigid sculpted wool with signature asymmetric clean lines, hand-tailored seams, and raw edge finishing that subverts traditional tailoring standards.",
    images: ["/assets/hero_files/Hero2.jpg", "/assets/hero_files/elyara.jpg"],
    isCustomizable: true,
    isNew: true,
    status: "made-to-order",
    sizes: ["XS", "S", "M", "L", "XL", "Custom"],
    colors: ["Slate Grey", "Midnight Black"],
  },
  {
    id: "ELY-003",
    name: "Obsidian Drape Layer",
    price: 42000,
    category: "tops",
    collection: "Artifacts 01",
    description:
      "Constructed with lightweight matte obsidian fabric. It cascades fluidly across physical geometry, casting deep architectural shadows with every stride.",
    images: ["/assets/hero_files/main2.jpg", "/assets/hero_files/main1.jpg"],
    isCustomizable: true,
    status: "available",
    sizes: ["XS", "S", "M", "L", "XL", "Custom"],
    colors: ["Obsidian", "Ivory"],
  },
  {
    id: "ELY-004",
    name: "Sculpted Tapered Trouser",
    price: 28000,
    category: "bottoms",
    collection: "Artifacts 01",
    description:
      "A modern interpretation of structured tailoring, featuring high-waist sculpted geometry with a precise tapered silhouette. Made to order with custom waist, length, and rise measurements.",
    images: ["/assets/cat1.jpg", "/assets/cat2.jpg"],
    isCustomizable: true,
    isBestseller: true,
    status: "made-to-order",
    sizes: ["Custom"],
    colors: ["Charcoal", "Navy", "Sand"],
  },
  {
    id: "ELY-005",
    name: "Fluid Silk Drape Dress",
    price: 38000,
    category: "dresses",
    collection: "Luminary Edit",
    description:
      "Pure silk charmeuse engineered to move with intention. Features a structural bodice with a softly draped skirt. Bespoke tailoring ensures a flawless fit unique to your form.",
    images: ["/assets/cat3.jpg", "/assets/cat4.jpg"],
    isCustomizable: true,
    isNew: true,
    status: "available",
    sizes: ["XS", "S", "M", "L", "XL", "Custom"],
    colors: ["Ivory", "Champagne", "Midnight"],
  },
  {
    id: "ELY-006",
    name: "Structured Blazer Set",
    price: 52000,
    category: "coord-sets",
    collection: "Luminary Edit",
    description:
      "Power and grace converge in this double-breasted blazer paired with wide-leg trousers. Cut from premium Italian wool blend, hand-finished at our Noida atelier.",
    images: ["/assets/cat5.jpg", "/assets/cat6.jpg"],
    isCustomizable: true,
    status: "limited",
    sizes: ["XS", "S", "M", "L", "XL", "Custom"],
    colors: ["Ivory", "Caramel", "Black"],
  },
  {
    id: "ELY-007",
    name: "Pleated Wide Leg Trousers",
    price: 24000,
    category: "bottoms",
    collection: "Luminary Edit",
    description:
      "Deeply pleated wide-leg silhouette in a premium linen-viscose blend. Naturally breathable and elegant. Custom measurements for waist, length, and rise available.",
    images: ["/assets/cat7.jpg", "/assets/cat8.jpg"],
    isCustomizable: true,
    isBestseller: true,
    status: "available",
    sizes: ["Custom"],
    colors: ["Stone", "White", "Navy", "Black"],
  },
  {
    id: "ELY-008",
    name: "Draped Kaftan",
    price: 32000,
    originalPrice: 38000,
    category: "resort",
    collection: "Luminary Edit",
    description:
      "An architectural kaftan rendered in featherweight silk crepe. Flowing panels create a sculptural halo effect. Embroidered accents along the neckline reflect Elyara's craft heritage.",
    images: ["/assets/hero_files/elyara.jpg", "/assets/hero_files/main2.jpg"],
    isCustomizable: false,
    status: "available",
    sizes: ["One Size", "S/M", "L/XL"],
    colors: ["Gold", "Champagne", "Dusty Rose"],
  },
];

export const COLLECTIONS = [
  {
    id: "artifacts-01",
    name: "Artifacts 01",
    tagline: "Where raw lines meet sculptural intention",
    description:
      "Our debut collection is a study in contrasts — rigidity and fluidity, darkness and light. Each piece is a wearable artifact of modern Indian craft fused with avant-garde structure.",
    image: "/assets/hero_files/main1.jpg",
    pieceCount: 12,
    year: "2024",
  },
  {
    id: "luminary-edit",
    name: "Luminary Edit",
    tagline: "Luminous forms for the conscious woman",
    description:
      "The second chapter explores softness as power. Fluid silhouettes, natural textiles, and hand-embroidered details come together in a celebration of feminine architecture.",
    image: "/assets/hero_files/Hero2.jpg",
    pieceCount: 18,
    year: "2025",
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "t1",
    name: "Priya Sharma",
    location: "Delhi",
    review:
      "The Asymmetric Cape Coat is unlike anything I own. The craftsmanship is extraordinary — you can feel the intention in every seam. Worth every rupee and more.",
    rating: 5,
    product: "Asymmetric Cape Coat",
  },
  {
    id: "t2",
    name: "Meera Nair",
    location: "Mumbai",
    review:
      "I ordered the Fluid Silk Dress with custom measurements. The fit was absolutely perfect. Sweety even sent me a note with the package explaining the fabric choices. Truly personal.",
    rating: 5,
    product: "Fluid Silk Drape Dress",
  },
  {
    id: "t3",
    name: "Ananya Roy",
    location: "Bangalore",
    review:
      "Elyara understands what Indian women want — clothes that honour our heritage while feeling entirely modern. The Structured Blazer Set is my new power uniform.",
    rating: 5,
    product: "Structured Blazer Set",
  },
  {
    id: "t4",
    name: "Kavya Reddy",
    location: "Hyderabad",
    review:
      "The custom order process was seamless. I gave all my measurements and the trousers fit like they were made for me — because they were. This is what fashion should feel like.",
    rating: 5,
    product: "Sculpted Tapered Trouser",
  },
];

export const CATEGORIES = [
  { id: "all", label: "All Pieces" },
  { id: "outerwear", label: "Outerwear" },
  { id: "dresses", label: "Dresses" },
  { id: "tops", label: "Tops" },
  { id: "bottoms", label: "Bottoms" },
  { id: "coord-sets", label: "Coord Sets" },
  { id: "resort", label: "Resort Wear" },
];

export const PROCESS_STEPS = [
  {
    num: "01",
    title: "Select & Customise",
    description:
      "Browse our collection and choose your piece. Add your measurements — waist, chest, height, and any unique requirements.",
  },
  {
    num: "02",
    title: "Atelier Review",
    description:
      "Our team at the Noida atelier reviews your order. We may contact you for additional details to ensure perfect fit.",
  },
  {
    num: "03",
    title: "Handcrafted for You",
    description:
      "Every piece is cut, stitched, and finished by hand. Bespoke orders take 7–14 working days.",
  },
  {
    num: "04",
    title: "Delivered with Care",
    description:
      "Your piece arrives in Elyara's signature packaging with a personal note from our designer Sweety.",
  },
];
