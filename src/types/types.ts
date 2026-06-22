export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  collection: string;
  description: string;
  images: string[];
  isCustomizable: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
  sizes?: string[];
  colors?: string[];
  status: "available" | "made-to-order" | "sold-out" | "limited";
}

export interface LookbookItem {
  id: string;
  collection: string;
  title: string;
  description: string;
  valuation: string;
  image: string;
}

export interface DropData {
  designer: string;
  collection: string;
  piecesRemaining: number;
  totalEditions: number;
  item: string;
  details: string;
  price: string;
}

export interface LuxuryHeroProps {
  onRequestAcquisition: () => void;
  currentDrop: DropData;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  location: string;
  review: string;
  rating: number;
  product: string;
}
