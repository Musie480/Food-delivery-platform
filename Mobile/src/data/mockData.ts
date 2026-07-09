export interface Category {
  id: string;
  name: string;
  emoji: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  reviews: number;
  deliveryTime: string;
  deliveryFee: number;
  image: string;
  category: string;
  isOpen: boolean;
  distance: string;
}

export interface CustomizeOption {
  id: string;
  name: string;
  price?: number;
}

export interface CustomizeGroup {
  name: string;
  type: "radio" | "checkbox";
  options: CustomizeOption[];
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  isBestseller?: boolean;
  customizeGroups?: CustomizeGroup[];
}

export interface BannerItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
}

export const CATEGORIES: Category[] = [
  { id: "all", name: "All", emoji: "🍽️" },
  { id: "burger", name: "Burger", emoji: "🍔" },
  { id: "pizza", name: "Pizza", emoji: "🍕" },
  { id: "sushi", name: "Sushi", emoji: "🍣" },
  { id: "drinks", name: "Drinks", emoji: "🍹" },
  { id: "dessert", name: "Dessert", emoji: "🍰" },
  { id: "chicken", name: "Chicken", emoji: "🍗" },
];

export const RESTAURANTS: Restaurant[] = [
  {
    id: "r1",
    name: "Burger Palace",
    cuisine: "American · Fast Food",
    rating: 4.5,
    reviews: 233,
    deliveryTime: "20-30",
    deliveryFee: 1.99,
    image:
      "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=800&q=80",
    category: "burger",
    isOpen: true,
    distance: "1.2 km",
  },
  {
    id: "r2",
    name: "Pizza Heaven",
    cuisine: "Italian · Pizza",
    rating: 4.3,
    reviews: 189,
    deliveryTime: "25-40",
    deliveryFee: 1.49,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    category: "pizza",
    isOpen: true,
    distance: "0.8 km",
  },
  {
    id: "r3",
    name: "Sushi Garden",
    cuisine: "Japanese · Sushi",
    rating: 4.7,
    reviews: 312,
    deliveryTime: "30-45",
    deliveryFee: 2.49,
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
    category: "sushi",
    isOpen: true,
    distance: "2.1 km",
  },
  {
    id: "r4",
    name: "Sweet Dreams",
    cuisine: "Desserts · Bakery",
    rating: 4.6,
    reviews: 127,
    deliveryTime: "15-25",
    deliveryFee: 0.99,
    image:
      "https://images.unsplash.com/photo-1517244683847-7456b63c5969?auto=format&fit=crop&w=800&q=80",
    category: "dessert",
    isOpen: true,
    distance: "0.5 km",
  },
];

export const FOOD_ITEMS: FoodItem[] = [
  {
    id: "f1",
    restaurantId: "r1",
    restaurantName: "Burger Palace",
    name: "Cheese Burger",
    description:
      "A delicious beef burger with cheese, fresh veggies and special sauce. Made with 100% pure beef patty, served hot on a toasted brioche bun.",
    price: 8.99,
    rating: 4.5,
    reviews: 233,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80",
    category: "burger",
    isBestseller: true,
    customizeGroups: [
      {
        name: "Cheese",
        type: "radio",
        options: [
          { id: "c1", name: "Cheddar" },
          { id: "c2", name: "Mozzarella" },
          { id: "c3", name: "Swiss" },
        ],
      },
      {
        name: "Add Ons",
        type: "checkbox",
        options: [
          { id: "a1", name: "Bacon", price: 1.5 },
          { id: "a2", name: "Extra Patty", price: 2.0 },
          { id: "a3", name: "Avocado", price: 1.25 },
          { id: "a4", name: "Jalapeños", price: 0.75 },
        ],
      },
    ],
  },
  {
    id: "f2",
    restaurantId: "r1",
    restaurantName: "Burger Palace",
    name: "Double Smash Burger",
    description:
      "Two smashed beef patties with American cheese, pickles, caramelised onions, and our signature secret sauce.",
    price: 12.99,
    rating: 4.8,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1000&q=80",
    category: "burger",
    isBestseller: false,
  },
  {
    id: "f3",
    restaurantId: "r2",
    restaurantName: "Pizza Heaven",
    name: "Pepperoni Pizza",
    description:
      "Classic pepperoni pizza with hand-stretched dough, rich tomato sauce, aged mozzarella, and generous pepperoni slices.",
    price: 14.99,
    rating: 4.4,
    reviews: 201,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80",
    category: "pizza",
    isBestseller: true,
    customizeGroups: [
      {
        name: "Size",
        type: "radio",
        options: [
          { id: "s1", name: "10 inch" },
          { id: "s2", name: "12 inch" },
          { id: "s3", name: "14 inch" },
        ],
      },
      {
        name: "Extra Toppings",
        type: "checkbox",
        options: [
          { id: "t1", name: "Extra Cheese", price: 1.5 },
          { id: "t2", name: "Mushrooms", price: 0.99 },
          { id: "t3", name: "Bell Peppers", price: 0.99 },
        ],
      },
    ],
  },
  {
    id: "f4",
    restaurantId: "r3",
    restaurantName: "Sushi Garden",
    name: "Salmon Maki Roll",
    description:
      "Fresh Atlantic salmon wrapped in seasoned sushi rice and nori. Served with soy sauce, pickled ginger, and wasabi.",
    price: 11.99,
    rating: 4.7,
    reviews: 178,
    image:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1000&q=80",
    category: "sushi",
    isBestseller: true,
  },
  {
    id: "f5",
    restaurantId: "r4",
    restaurantName: "Sweet Dreams",
    name: "Chocolate Lava Cake",
    description:
      "Warm chocolate cake with a gooey molten centre, served with a scoop of vanilla bean ice cream and fresh berries.",
    price: 7.99,
    rating: 4.9,
    reviews: 89,
    image:
      "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=1000&q=80",
    category: "dessert",
    isBestseller: true,
  },
  {
    id: "f6",
    restaurantId: "r1",
    restaurantName: "Burger Palace",
    name: "Crispy Chicken Burger",
    description:
      "Juicy fried chicken breast with crunchy coleslaw, pickles, and smoky honey mustard sauce on a toasted sesame bun.",
    price: 9.99,
    rating: 4.6,
    reviews: 142,
    image:
      "https://images.unsplash.com/photo-1606755962773-d324e9a13086?auto=format&fit=crop&w=1000&q=80",
    category: "chicken",
  },
];

export const BANNERS: BannerItem[] = [
  {
    id: "b1",
    badge: "80% OFF",
    title: "Delicious\nBurger",
    subtitle: "On your first order",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    cta: "Order Now",
  },
  {
    id: "b2",
    badge: "NEW",
    title: "Premium\nSushi",
    subtitle: "Fresh catch, daily",
    image:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=600&q=80",
    cta: "Explore",
  },
];
