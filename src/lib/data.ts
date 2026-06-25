import { Product, TestimonialItem } from "@/types/types";

// ─── Real catalog from Elyara Price List PDF ───────────────────────────────
export const PRODUCTS: Product[] = [
  {
    id: "ELY-001",
    name: "Mira",
    price: 5999,
    category: "coord-sets",
    collection: "Signature Edit",
    description:
      "A brocade peplum top in iridescent blue-gold fabric paired with fluid navy trousers. The structured flare and sweetheart neckline create a silhouette that commands attention. Fully customisable to your measurements.",
    images: ["/assets/cat1.jpg", "/assets/cat2.jpg"],
    isCustomizable: true,
    isBestseller: true,
    status: "available",
    sizes: ["XS", "S", "M", "L", "XL", "Custom"],
    colors: ["Blue-Gold Brocade"],
    styleNo: "001",
  },
  {
    id: "ELY-002",
    name: "Paro",
    price: 4999,
    category: "coord-sets",
    collection: "Signature Edit",
    description:
      "A metallic gold corset top with dramatic draped black skirt. Lace-up back detailing adds an edge to this evening-ready ensemble. Each piece tailored to your exact measurements.",
    images: ["/assets/cat3.jpg", "/assets/cat4.jpg"],
    isCustomizable: true,
    isBestseller: true,
    status: "available",
    sizes: ["XS", "S", "M", "L", "XL", "Custom"],
    colors: ["Gold & Black"],
    styleNo: "002",
  },
  {
    id: "ELY-003",
    name: "Inaya",
    price: 6999,
    category: "coord-sets",
    collection: "Signature Edit",
    description:
      "A delicate 3D floral net cape over a structured silver-grey crop top and wide-leg trousers. Intricate hand-crafted floral appliqués make this a true statement piece.",
    images: ["/assets/cat5.jpg", "/assets/cat6.jpg"],
    isCustomizable: true,
    isNew: false,
    status: "available",
    sizes: ["XS", "S", "M", "L", "XL", "Custom"],
    colors: ["Silver Grey"],
    styleNo: "003",
  },
  {
    id: "ELY-004",
    name: "Alaya",
    price: 4999,
    category: "dresses",
    collection: "Signature Edit",
    description:
      "A floor-sweeping floral maxi dress in rich pink georgette. Features a sweetheart neckline and flowing A-line silhouette — effortlessly romantic and fully customisable in length and fit.",
    images: ["/assets/cat7.jpg", "/assets/cat8.jpg"],
    isCustomizable: true,
    isBestseller: false,
    status: "available",
    sizes: ["XS", "S", "M", "L", "XL", "Custom"],
    colors: ["Blush Pink Floral"],
    styleNo: "004",
  },
  {
    id: "ELY-005",
    name: "Chaand Corset",
    price: 2599,
    category: "tops",
    collection: "Signature Edit",
    description:
      "A structured metallic bronze corset with lace-up back detailing. Versatile enough to style with trousers, skirts, or draped sarees. A wardrobe-defining staple.",
    images: ["/assets/hero_files/main1.jpg", "/assets/hero_files/Hero1.jpg"],
    isCustomizable: true,
    isBestseller: false,
    status: "available",
    sizes: ["XS", "S", "M", "L", "XL", "Custom"],
    colors: ["Metallic Bronze"],
    styleNo: "005",
  },
  {
    id: "ELY-006",
    name: "Noor",
    price: 4599,
    category: "coord-sets",
    collection: "Signature Edit",
    description:
      "A geometric-print halter top with draped black trousers. A modern Indian fusion silhouette that effortlessly blends heritage textile craft with contemporary structure.",
    images: ["/assets/hero_files/Hero2.jpg", "/assets/hero_files/main2.jpg"],
    isCustomizable: true,
    isBestseller: true,
    status: "available",
    sizes: ["XS", "S", "M", "L", "XL", "Custom"],
    colors: ["Black & Gold Print"],
    styleNo: "006",
  },
  {
    id: "ELY-007",
    name: "Aira",
    price: 3999,
    category: "coord-sets",
    collection: "Signature Edit",
    description:
      "An ikat-print fitted bodice paired with a fluid black maxi skirt. The V-neckline and sleeveless cut create a clean, modern silhouette rooted in Indian craft traditions.",
    images: ["/assets/hero_files/elyara.jpg", "/assets/cat1.jpg"],
    isCustomizable: true,
    isBestseller: false,
    status: "available",
    sizes: ["XS", "S", "M", "L", "XL", "Custom"],
    colors: ["Ikat Print & Black"],
    styleNo: "007",
  },
  {
    id: "ELY-008",
    name: "Roselle",
    price: 4499,
    category: "coord-sets",
    collection: "Signature Edit",
    description:
      "A three-piece ajrakh-print coord set — cold-shoulder top, wide-leg pants, and a matching dupatta. A celebration of block-print heritage reimagined for the modern woman.",
    images: ["/assets/cat2.jpg", "/assets/cat3.jpg"],
    isCustomizable: true,
    isBestseller: false,
    status: "available",
    sizes: ["XS", "S", "M", "L", "XL", "Custom"],
    colors: ["Ajrakh Brown & Black"],
    styleNo: "008",
  },
  {
    id: "ELY-009",
    name: "Elora",
    price: 4899,
    category: "coord-sets",
    collection: "Signature Edit",
    description:
      "A structured black satin blazer paired with an ikat-print draped skirt. Clean tailoring meets artisan textile in this versatile fusion ensemble. New arrival.",
    images: ["/assets/cat4.jpg", "/assets/cat5.jpg"],
    isCustomizable: true,
    isNew: true,
    status: "available",
    sizes: ["XS", "S", "M", "L", "XL", "Custom"],
    colors: ["Black & Gold Ikat"],
    styleNo: "009",
  },
  {
    id: "ELY-010",
    name: "Piya",
    price: 4899,
    category: "coord-sets",
    collection: "Signature Edit",
    description:
      "Our signature best-seller. An ajrakh-print corset top with ruffled sleeves and a dramatic draped black skirt. Worn by customers at weddings, parties, and editorial shoots across India.",
    images: ["/assets/cat6.jpg", "/assets/cat7.jpg"],
    isCustomizable: true,
    isBestseller: true,
    status: "available",
    sizes: ["XS", "S", "M", "L", "XL", "Custom"],
    colors: ["Ajrakh Print & Black"],
    styleNo: "010",
  },
  {
    id: "ELY-011",
    name: "Ziva",
    price: 4499,
    category: "coord-sets",
    collection: "Signature Edit",
    description:
      "A sleek black tank top with an ikat-print maxi skirt and matching neck scarf. A sophisticated monochrome-meets-print combination for effortless elegance.",
    images: ["/assets/cat8.jpg", "/assets/cat1.jpg"],
    isCustomizable: true,
    isBestseller: false,
    status: "available",
    sizes: ["XS", "S", "M", "L", "XL", "Custom"],
    colors: ["Black & White Ikat"],
    styleNo: "011",
  },
];

// ─── Collections ────────────────────────────────────────────────────────────
export const COLLECTIONS = [
  {
    id: "signature-edit",
    name: "Signature Edit",
    tagline: "Heritage craft. Contemporary silhouette.",
    description:
      "Our flagship collection — 11 named pieces spanning corsets, coord sets, and draped dresses. Every piece is rooted in Indian textile traditions (ajrakh, ikat, brocade) and reimagined through modern architectural tailoring.",
    image: "/assets/hero_files/main1.jpg",
    pieceCount: 11,
    year: "2025",
  },
  {
    id: "custom-order",
    name: "Custom Order",
    tagline: "Your vision. Our craft.",
    description:
      "No catalogue number. No standard size. You describe it, we build it — from bridal ensembles to party wear. Send us your reference images, measurements, and occasion details.",
    image: "/assets/hero_files/Hero2.jpg",
    pieceCount: 0,
    year: "Always Open",
  },
];

// ─── Testimonials ────────────────────────────────────────────────────────────
export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "t1",
    name: "Priya Sharma",
    location: "Delhi",
    review:
      "Wore the Piya corset set to my cousin's sangeet and got complimented all night. The fit was perfect — I gave my measurements over WhatsApp and Sweety nailed it.",
    rating: 5,
    product: "Piya",
  },
  {
    id: "t2",
    name: "Meera Nair",
    location: "Mumbai",
    review:
      "The Inaya set is absolutely stunning in person. The 3D flowers on the net cape are handmade — you can tell the difference immediately. Worth every rupee.",
    rating: 5,
    product: "Inaya",
  },
  {
    id: "t3",
    name: "Ananya Roy",
    location: "Bangalore",
    review:
      "I ordered a fully custom bridal lehenga through Elyara. Sweety understood my reference images perfectly. The embroidery detail was beyond what I imagined.",
    rating: 5,
    product: "Custom Order",
  },
  {
    id: "t4",
    name: "Kavya Reddy",
    location: "Hyderabad",
    review:
      "The Noor coord set fits like it was made for me — because it was. The quality of the block print fabric is exceptional. I've already ordered the Roselle.",
    rating: 5,
    product: "Noor",
  },
];

// ─── Categories ─────────────────────────────────────────────────────────────
export const CATEGORIES = [
  { id: "all", label: "All Pieces" },
  { id: "coord-sets", label: "Coord Sets" },
  { id: "dresses", label: "Dresses" },
  { id: "tops", label: "Tops" },
  { id: "outerwear", label: "Outerwear" },
];

// ─── Process steps ───────────────────────────────────────────────────────────
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
