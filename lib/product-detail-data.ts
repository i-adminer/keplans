import type { PlanItem } from "@/lib/plans-data";

export interface GalleryImage {
  id: string;
  label: string;
  caption: string;
  image: string;
}

export interface PlanOption {
  label: string;
  price: number;
  description: string;
}

export interface SpecGroup {
  title: string;
  items: string[];
}

export interface ProductDetailData {
  id: string;
  title: string;
  meta: string;
  price: number;
  planNumber: string;
  summary: string;
  gallery: GalleryImage[];
  keySpecs: Array<{ label: string; value: string }>;
  dimensions: Array<{ label: string; value: string }>;
  planOptions: PlanOption[];
  foundationOptions: PlanOption[];
  framingOptions: PlanOption[];
  addOns: PlanOption[];
  specGroups: SpecGroup[];
  includedItems: string[];
  faqs: Array<{ question: string; answer: string }>;
  relatedPlans: PlanItem[];
}

export const productDetailData: ProductDetailData = {
  id: "1064-280",
  title: "Modern House Plan 1064-280",
  meta: "1,679 Sq Ft, 2 Bed, 2 Bath, 1 Floor, 0 Garage",
  price: 1250,
  planNumber: "1064-280",
  summary:
    "This modern design floor plan is 1,679 sq ft and has 2 bedrooms and 2 bathrooms. It is organized for efficient movement, outdoor living, and a compact footprint that still feels generous.",
  gallery: [
    {
      id: "front",
      label: "Exterior",
      caption: "Front elevation for Modern House Plan #1064-280",
      image: "/herobg/hbg-2.jpg",
    },
    {
      id: "rear",
      label: "Exterior",
      caption: "Rear elevation for Modern House Plan #1064-280",
      image: "/herobg/hbg-2.jpg",
    },
    {
      id: "interior",
      label: "Interior",
      caption: "Interior view for Modern House Plan #1064-280",
      image: "/herobg/hbg-2.jpg",
    },
    {
      id: "floor",
      label: "Floor Plan",
      caption: "Main floor plan for Modern House Plan #1064-280",
      image: "/herobg/hbg-2.jpg",
    },
    {
      id: "side",
      label: "Exterior",
      caption: "Side elevation for Modern House Plan #1064-280",
      image: "/herobg/hbg-2.jpg",
    },
    {
      id: "tour",
      label: "3D Tour",
      caption: "3D tour preview for Modern House Plan #1064-280",
      image: "/herobg/hbg-2.jpg",
    },
  ],
  keySpecs: [
    { label: "Beds", value: "2" },
    { label: "Baths", value: "2" },
    { label: "Floors", value: "1" },
    { label: "Garages", value: "0" },
    { label: "Square Feet", value: "1,679" },
  ],
  dimensions: [
    { label: "Width", value: "52'" },
    { label: "Depth", value: "65'" },
    { label: "Height", value: "18' 10\"" },
    { label: "Main Floor", value: "1,679 sq ft" },
    { label: "Basement", value: "1,720 sq ft" },
    { label: "Porch", value: "300 sq ft" },
  ],
  planOptions: [
    {
      label: "PDF Set",
      price: 1250,
      description: "Instant digital download after checkout.",
    },
    {
      label: "5 Copy and PDF Set",
      price: 1600,
      description: "Printed sets plus digital access.",
    },
    {
      label: "PDF Unlimited Build",
      price: 1850,
      description: "Best for multiple builds from the same plan.",
    },
    {
      label: "CAD and PDF Set Unlimited Build",
      price: 2850,
      description: "Maximum editing flexibility for design pros.",
    },
  ],
  foundationOptions: [
    { label: "Walk Out Basement", price: 0, description: "Ideal for a sloping lot with exterior lower-level access." },
    { label: "Crawlspace", price: 295, description: "Useful for semi-sloped or level lots." },
    { label: "Slab", price: 295, description: "Direct-on-grade option for simpler sites." },
    { label: "Basement", price: 395, description: "Lower level for additional utility or storage." },
  ],
  framingOptions: [
    { label: "Wood 2x6", price: 0, description: "Standard exterior wall framing." },
    { label: "Wood 2x4", price: 295, description: "Alternate exterior wall framing." },
  ],
  addOns: [
    { label: "Right-Reading Reverse", price: 275, description: "Reverse the plan with readable text and dimensions." },
    { label: "2 Car Front-Loading Garage", price: 0, description: "Changes the garage to a front-load configuration." },
    { label: "Additional Construction Sets", price: 70, description: "Extra hard copies for use within 90 days of purchase." },
    { label: "Audio Video Design", price: 165, description: "Suggested placement for audio and video components." },
    { label: "Comprehensive Material List", price: 295, description: "Detailed materials list for estimating and ordering." },
    { label: "Construction Guide", price: 39, description: "A helpful guide for basic construction topics." },
    { label: "Lighting Design", price: 165, description: "Suggested fixture placement for the home." },
  ],
  specGroups: [
    {
      title: "Basic Features",
      items: ["Bedrooms: 2", "Baths: 2", "Stories: 1", "Garages: 0"],
    },
    {
      title: "Dimension",
      items: ["Depth: 65'", "Height: 18' 10\"", "Width: 52'"],
    },
    {
      title: "Area",
      items: [
        "Total: 1,679 sq/ft",
        "Basement: 1,720 sq/ft",
        "Decks: 657 sq/ft",
        "Main Floor: 1,679 sq/ft",
        "Porch: 300 sq/ft",
      ],
    },
    {
      title: "Ceiling",
      items: ["Lower Ceiling: 9'", "Main Ceiling: 9'"],
    },
    {
      title: "Roof",
      items: ["Primary Pitch: 2/12", "Roof Load: 30 psf", "Roof Type: Stick", "Secondary Pitch: 6/12"],
    },
    {
      title: "Exterior Wall Framing",
      items: ["Exterior Wall Finish: Vertical Metal Siding", "Framing: 2x6", "Insulation: R-19"],
    },
    {
      title: "Bedroom Features",
      items: ["Lower Level Bedrooms", "Main Floor Bedrooms", "Main Floor Master Bedroom", "Split Bedrooms", "Walk In Closet"],
    },
    {
      title: "Kitchen Features",
      items: ["Kitchen Island", "Kitchenette Wet Bar", "Walk In Pantry", "Cabinet Pantry"],
    },
    {
      title: "Additional Room Features",
      items: ["Great Room", "Living Room", "Main Floor Laundry"],
    },
    {
      title: "Lot Characteristics",
      items: ["Suited For Sloping Lot", "Suited For View Lot"],
    },
    {
      title: "Outdoor Spaces",
      items: ["Covered Front Porch", "Covered Rear Porch"],
    },
  ],
  includedItems: [
    "Cover sheet with front elevation and sheet index",
    "Foundation plans with dimensions and support notes",
    "Floor plans with room dimensions and schedules",
    "Exterior elevations for all sides",
    "Roof plan with pitch, peaks, and valleys",
    "Cross sections from roof to foundation",
    "Electrical and mechanical plans",
    "Construction notes, details, and wall sections",
  ],
  faqs: [
    {
      question: "Are these plans ready for permitting?",
      answer:
        "The drawings are detailed enough for construction, but your local building department may require extra information depending on your location.",
    },
    {
      question: "Can I customize the plan?",
      answer:
        "Yes. You can request changes for garage size, roof pitch, square footage, or other layout adjustments.",
    },
    {
      question: "What if I need a cost estimate?",
      answer:
        "A cost-to-build report is useful when you need a regional estimate before placing your order.",
    },
    {
      question: "What if my state requires an engineer stamp?",
      answer:
        "Some regions require review from a local professional. In those cases, the plan may need additional engineering or stamping.",
    },
  ],
  relatedPlans: [],
};
