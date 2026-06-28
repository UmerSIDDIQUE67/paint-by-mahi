export type Artwork = {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  dimensions: string;
  medium: string;
  stock: number;
  images: string[];
  featured: boolean;
  tags: string[];
  createdAt: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  count: number;
};

export type Review = {
  id: string;
  artworkId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
};

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "In Progress"
  | "Completed"
  | "Shipped"
  | "Delivered";

// Demo artwork data with placeholder images
export const ARTWORKS: Artwork[] = [
  {
    id: "1",
    title: "Sunset Over the Indus",
    category: "Oil Painting",
    description:
      "A breathtaking depiction of the sun setting over the mighty Indus River, painted with rich warm tones and expressive brushwork. This masterpiece captures the golden hour light reflecting on the water, creating a serene and timeless scene.",
    price: 15000,
    dimensions: '24" × 36"',
    medium: "Oil on Canvas",
    stock: 1,
    images: [
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80",
      "https://images.unsplash.com/photo-1577083300998-c33a23309eff?w=800&q=80",
    ],
    featured: true,
    tags: ["landscape", "sunset", "oil painting", "river"],
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Mughal Garden",
    category: "Watercolor",
    description:
      "Inspired by the magnificent Mughal gardens of Lahore, this watercolor painting captures the symmetry and beauty of Persian-style architecture. Delicate washes of color bring the fountains and cypress trees to life.",
    price: 8500,
    dimensions: '18" × 24"',
    medium: "Watercolor on Paper",
    stock: 2,
    images: [
      "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
    ],
    featured: true,
    tags: ["architecture", "garden", "watercolor", "mughal"],
    createdAt: "2024-02-10",
  },
  {
    id: "3",
    title: "Portrait of Dignity",
    category: "Portrait",
    description:
      "A powerful portrait study in pencil and charcoal, capturing the wisdom and grace of an elder. The fine details of expression and the play of light and shadow demonstrate exceptional technical skill.",
    price: 12000,
    dimensions: '16" × 20"',
    medium: "Charcoal on Paper",
    stock: 1,
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
      "https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=800&q=80",
    ],
    featured: true,
    tags: ["portrait", "charcoal", "sketch", "figure"],
    createdAt: "2024-02-20",
  },
  {
    id: "4",
    title: "Bismillah – Golden Script",
    category: "Calligraphy",
    description:
      "An exquisite piece of Islamic calligraphy featuring Bismillah in the Thuluth script, embellished with 24k gold leaf accents. Each stroke reflects the deep spiritual significance of the opening verse.",
    price: 18000,
    dimensions: '20" × 16"',
    medium: "Ink & Gold Leaf on Canvas",
    stock: 3,
    images: [
      "https://images.unsplash.com/photo-1545987796-200677ee1011?w=800&q=80",
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80",
    ],
    featured: true,
    tags: ["calligraphy", "islamic art", "gold", "arabic"],
    createdAt: "2024-03-05",
  },
  {
    id: "5",
    title: "Morning in the Mountains",
    category: "Oil Painting",
    description:
      "The mist-covered peaks of the Karakoram range at sunrise, painted in thick impasto style. Bold strokes of purple, blue, and white create an atmosphere of majestic solitude.",
    price: 22000,
    dimensions: '30" × 40"',
    medium: "Oil on Canvas",
    stock: 1,
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    ],
    featured: false,
    tags: ["mountains", "landscape", "oil painting", "karakoram"],
    createdAt: "2024-03-18",
  },
  {
    id: "6",
    title: "Floral Abundance",
    category: "Acrylic",
    description:
      "A vibrant explosion of flowers rendered in vivid acrylic paints. Roses, jasmine, and lotus blooms cascade across the canvas in a celebration of nature's generosity and color.",
    price: 9500,
    dimensions: '20" × 24"',
    medium: "Acrylic on Canvas",
    stock: 2,
    images: [
      "https://images.unsplash.com/photo-1490750967868-88df5691cc52?w=800&q=80",
      "https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=800&q=80",
    ],
    featured: false,
    tags: ["flowers", "nature", "acrylic", "colorful"],
    createdAt: "2024-04-02",
  },
  {
    id: "7",
    title: "Old Lahore Bazaar",
    category: "Sketch",
    description:
      "A detailed pencil sketch capturing the vibrant chaos of the old Anarkali Bazaar in Lahore. Every stall, every face, and every architectural detail tells a story of centuries of commerce and culture.",
    price: 6500,
    dimensions: '14" × 18"',
    medium: "Graphite on Paper",
    stock: 1,
    images: [
      "https://images.unsplash.com/photo-1589578527966-fdac0f44566c?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    ],
    featured: false,
    tags: ["sketch", "lahore", "bazaar", "architectural"],
    createdAt: "2024-04-15",
  },
  {
    id: "8",
    title: "Abstract Soul",
    category: "Abstract",
    description:
      "An abstract expressionist work exploring the duality of human emotion. Bold splashes of crimson and midnight blue collide and blend, creating a deeply personal and evocative visual experience.",
    price: 13500,
    dimensions: '24" × 24"',
    medium: "Mixed Media on Canvas",
    stock: 1,
    images: [
      "https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=800&q=80",
      "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&q=80",
    ],
    featured: false,
    tags: ["abstract", "expressionism", "mixed media", "modern"],
    createdAt: "2024-05-01",
  },
  {
    id: "9",
    title: "Koi Fish Serenity",
    category: "Watercolor",
    description:
      "Graceful koi fish drift through crystalline water in this luminous watercolor. The play of light through water creates an effect of shimmering tranquility, making this piece perfect for spaces of contemplation.",
    price: 7500,
    dimensions: '16" × 20"',
    medium: "Watercolor on Paper",
    stock: 2,
    images: [
      "https://images.unsplash.com/photo-1534183966416-b7b7c56c81de?w=800&q=80",
      "https://images.unsplash.com/photo-1516214104703-d870798883c5?w=800&q=80",
    ],
    featured: false,
    tags: ["fish", "water", "watercolor", "zen"],
    createdAt: "2024-05-10",
  },
  {
    id: "10",
    title: "Allah – Naskh Script",
    category: "Calligraphy",
    description:
      "The divine name rendered in classical Naskh calligraphy with intricate geometric border patterns. The deep navy and gold color palette gives this piece an air of timeless reverence.",
    price: 16000,
    dimensions: '18" × 18"',
    medium: "Ink on Parchment",
    stock: 2,
    images: [
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80",
      "https://images.unsplash.com/photo-1599005973293-55c6c0b1bfac?w=800&q=80",
    ],
    featured: true,
    tags: ["calligraphy", "arabic", "islamic", "naskh"],
    createdAt: "2024-05-20",
  },
  {
    id: "11",
    title: "Mother's Love",
    category: "Portrait",
    description:
      "A tender portrait of a mother cradling her newborn, rendered in soft pastels. The warm light and gentle expression capture the most profound bond in human experience.",
    price: 14000,
    dimensions: '20" × 24"',
    medium: "Pastel on Paper",
    stock: 1,
    images: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
    ],
    featured: false,
    tags: ["portrait", "mother", "pastel", "family"],
    createdAt: "2024-06-01",
  },
  {
    id: "12",
    title: "Desert Caravan",
    category: "Oil Painting",
    description:
      "Camels and their handlers traverse the golden Thar Desert at dusk in this cinematic oil painting. The vast sky and shifting dunes create a sense of epic scale and timeless journey.",
    price: 19500,
    dimensions: '28" × 40"',
    medium: "Oil on Canvas",
    stock: 1,
    images: [
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80",
      "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=800&q=80",
    ],
    featured: false,
    tags: ["desert", "camel", "landscape", "oil painting"],
    createdAt: "2024-06-15",
  },
];

export const CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Oil Paintings",
    slug: "oil-painting",
    description: "Rich, textured oil paintings on canvas",
    count: 3,
  },
  {
    id: "2",
    name: "Watercolor",
    slug: "watercolor",
    description: "Delicate watercolor works on fine paper",
    count: 2,
  },
  {
    id: "3",
    name: "Calligraphy",
    slug: "calligraphy",
    description: "Traditional Islamic and Arabic calligraphy",
    count: 2,
  },
  {
    id: "4",
    name: "Portrait",
    slug: "portrait",
    description: "Detailed portrait commissions and studies",
    count: 2,
  },
  {
    id: "5",
    name: "Sketch",
    slug: "sketch",
    description: "Graphite and charcoal sketch works",
    count: 1,
  },
  {
    id: "6",
    name: "Acrylic",
    slug: "acrylic",
    description: "Vibrant acrylic paintings on canvas",
    count: 1,
  },
  {
    id: "7",
    name: "Abstract",
    slug: "abstract",
    description: "Contemporary abstract expressionist works",
    count: 1,
  },
];

export const REVIEWS: Review[] = [
  {
    id: "1",
    artworkId: "4",
    customerName: "Ahmed Hassan",
    rating: 5,
    comment:
      "The Bismillah calligraphy is absolutely magnificent. It now graces the entrance of our home. Mahi's attention to detail is extraordinary, and the gold leaf work is breathtaking.",
    date: "2024-05-10",
    avatar: "AH",
  },
  {
    id: "2",
    artworkId: "1",
    customerName: "Sarah Malik",
    rating: 5,
    comment:
      "Ordered the Indus Sunset for our living room and it has completely transformed the space. The colors are even more vibrant in person. Excellent packaging and fast delivery!",
    date: "2024-04-22",
    avatar: "SM",
  },
  {
    id: "3",
    artworkId: "3",
    customerName: "Bilal Chaudhry",
    rating: 5,
    comment:
      "I commissioned a portrait of my father as a birthday gift. The likeness is incredible – she truly captured his personality. My family was moved to tears. A true artist!",
    date: "2024-05-01",
    avatar: "BC",
  },
  {
    id: "4",
    artworkId: "2",
    customerName: "Fatima Zahra",
    rating: 4,
    comment:
      "The Mughal Garden watercolor is beautiful. The colors are soft and elegant. Mahi was responsive to all my queries and the shipping was well-handled.",
    date: "2024-03-15",
    avatar: "FZ",
  },
  {
    id: "5",
    artworkId: "5",
    customerName: "Usman Tariq",
    rating: 5,
    comment:
      "The Mountain painting has incredible depth and atmosphere. You can almost feel the cold mountain air. Professional quality that belongs in a gallery.",
    date: "2024-04-30",
    avatar: "UT",
  },
  {
    id: "6",
    artworkId: "10",
    customerName: "Nadia Sheikh",
    rating: 5,
    comment:
      "The Allah calligraphy piece is so serene and powerful. The craftsmanship is incredible. I've received so many compliments. Will definitely order again!",
    date: "2024-06-05",
    avatar: "NS",
  },
];

export const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "In Progress",
  "Completed",
  "Shipped",
  "Delivered",
];

export const PAYMENT_METHODS = [
  { id: "stripe",    name: "Credit / Debit Card (Stripe)" },
  { id: "easypaisa", name: "EasyPaisa" },
  { id: "jazzcash",  name: "JazzCash" },
  { id: "bank",      name: "Bank Transfer" },
  { id: "cod",       name: "Cash on Delivery" },
];
