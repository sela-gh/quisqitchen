// This file is a stand-in "database" of products.
// Each entry mirrors the shape a real backend/database record would have:
// id, name, description, price, unit, rating, reviews, category, and an image.
//
// `image` should point to a real product photo (imported from ./assets, or a
// URL once this is backed by a real database/CMS). Where you haven't supplied
// a photo yet, leave `image: null` — the product grid will show a friendly
// "photo needed" placeholder instead of a broken image, so nothing looks off
// while you're still gathering assets.
//
// To add a photo for an existing product, drop the file in ./assets and:
//   1. import it at the top of this file, e.g.  import avocado from "./assets/avocado.png";
//   2. set that product's `image` field to the imported variable, e.g. image: avocado

import peppers from "./assets/peppers.png";
import spinach from "./assets/spinach.png";
import cabbage from "./assets/cabbage.png";
import onions from "./assets/onions.png";
import strawberryJuice from "./assets/strawberry.png";
import pineappleJuice from "./assets/juices/pineapple.png";
import pineappleMintJuice from "./assets/juices/pineapple_mint.png";
import passionJuice from "./assets/juices/passion.png";
import mangoJuice from "./assets/juices/mango.png";
import cocktailJuice from "./assets/juices/cocktail.png";
import ukwajuJuice from "./assets/juices/ukwaju.png";
import avocado from "./assets/avocado.png"
import tomato from  "./assets/tomato.png"
import brocolli from "./assets/brocolli.png"
import apples from "./assets/apples.png"
import blueberry from "./assets/blueberry.png"
import strawberry from "./assets/strawberry.png"
import carrots from "./assets/carrots.png"
import cauliflower from "./assets/cauliflower.png"
import corriander from "./assets/corriander.png"
import garlic from "./assets/garlic.png"
import ginger from "./assets/ginger.png"
import grapes from "./assets/grapes.png"
import kiwi from "./assets/kiwi.png"
import sweetpotato from "./assets/sweetpotato.png"
import tumeric from "./assets/tumeric.png"
import watermelon from "./assets/watermelon.png"
import whiteonion from "./assets/whiteonion.png"
import banana from "./assets/banana.png";
import oranges from "./assets/oranges.png"

export const categoryFilters = [
  "All Categories",
  "Fruits",
  "Vegetables",
  "Juices",
];

export const productCatalog = [
  {
    id: "avocado",
    name: "Avocado",
    description: "Creamy, ripe avocados picked at peak freshness.",
    price: 2.99,
    unit: "ea",
    category: "Fruits",
    rating: 4.8,
    reviews: 132,
    image: avocado, // suggested filename: avocado.png
    tile: "bg-tile-1",
    liked: false,
  },
  {
    id: "tomato",
    name: "Tomato",
    description: "Sweet, bite-sized tomatoes perfect for salads.",
    price: 3.2,
    unit: "lb",
    category: "Vegetables",
    rating: 4.6,
    reviews: 88,
    image: tomato, // suggested filename: cherry-tomato.png
    tile: "bg-tile-4",
    liked: false,
  },
  {
    id: "broccoli",
    name: "Broccoli",
    description: "Fresh, crisp broccoli crowns, hand-selected.",
    price: 2.49,
    unit: "lb",
    category: "Vegetables",
    rating: 4.5,
    reviews: 64,
    image: brocolli, // suggested filename: broccoli.png
    tile: "bg-tile-2",
    liked: false,
  },
  {
    id: "apples",
    name: "Red Apples",
    description: "Crisp, juicy red apples straight from the orchard.",
    price: 3.99,
    unit: "lb",
    category: "Fruits",
    rating: 4.7,
    reviews: 201,
    image: apples, // suggested filename: red-apples.png
    tile: "bg-tile-4",
    liked: true,
  },
  {
    id: "blueberry",
    name: "Blueberry",
    description: "Golden, sweet corn on the cob.",
    price: 0.79,
    unit: "ea",
    category: "Fruits",
    rating: 4.4,
    reviews: 57,
    image: blueberry, // suggested filename: sweet-corn.png
    tile: "bg-tile-1",
    liked: false,
  },
  {
    id: "strawberry",
    name: "Strawberry",
    description: "Plump, juicy strawberries bursting with flavor.",
    price: 4.5,
    unit: "lb",
    category: "Fruits",
    rating: 4.9,
    reviews: 176,
    image: strawberry, // suggested filename: strawberry.png
    tile: "bg-tile-4",
    liked: false,
  },
  {
    id: "yellow-bell-pepper",
    name: "Yellow Bell Pepper",
    description: "Crunchy, mildly sweet yellow bell peppers.",
    price: 250,
    unit: "kg",
    category: "Vegetables",
    rating: 4.3,
    reviews: 41,
    image: peppers,
    tile: "bg-tile-1",
    liked: false,
  },
  {
    id: "spinach",
    name: "Spinach",
    description: "Tender, leafy spinach, washed and ready.",
    price: 90,
    unit: "kg",
    category: "Vegetables",
    rating: 4.6,
    reviews: 95,
    image: spinach,
    tile: "bg-tile-2",
    liked: true,
  },
  {
    id: "cabbage",
    name: "Cabbage",
    description: "Crisp, full-head cabbage.",
    price: 90,
    unit: "kg",
    category: "Vegetables",
    rating: 4.2,
    reviews: 33,
    image: cabbage,
    tile: "bg-tile-3",
    liked: false,
  },
  {
    id: "red-onions",
    name: "Red Onions",
    description: "Sharp, flavorful red onions.",
    price: 150,
    unit: "kg",
    category: "Vegetables",
    rating: 4.4,
    reviews: 47,
    image: onions,
    tile: "bg-tile-4",
    liked: false,
  },
  {
    id: "carrots",
    name: "Carrots",
    description: "Sweet, crunchy carrots.",
    price: 100,
    unit: "kg",
    category: "Vegetables",
    rating: 4.5,
    reviews: 72,
    image: carrots, // suggested filename: carrots.png
    tile: "bg-tile-1",
    liked: false,
  },
  {
    id: "cauliflower",
    name: "Cauliflower",
    description: "Fresh, tightly-packed cauliflower heads.",
    price: 100,
    unit: "kg",
    category: "Vegetables",
    rating: 4.3,
    reviews: 29,
    image: cauliflower, // suggested filename: cauliflower.png
    tile: "bg-tile-3",
    liked: false,
  },
  {
    id: "sweetpotato",
    name: "Sweetpotato",
    description: "Fresh, tightly-packed cauliflower heads.",
    price: 100,
    unit: "kg",
    category: "Vegetables",
    rating: 4.3,
    reviews: 29,
    image: sweetpotato, // suggested filename: cauliflower.png
    tile: "bg-tile-3",
    liked: false,
  },
  {
    id: "giner",
    name: "Ginger",
    description: "Fresh, tightly-packed cauliflower heads.",
    price: 100,
    unit: "kg",
    category: "Vegetables",
    rating: 4.3,
    reviews: 29,
    image: ginger, // suggested filename: cauliflower.png
    tile: "bg-tile-3",
    liked: false,
  },
  {
    id: "tumeric",
    name: "Tumeric",
    description: "Fresh, tightly-packed cauliflower heads.",
    price: 100,
    unit: "kg",
    category: "Vegetables",
    rating: 4.3,
    reviews: 29,
    image: tumeric, // suggested filename: cauliflower.png
    tile: "bg-tile-3",
    liked: false,
  },
  {
    id: "watermelon",
    name: "Watermelon",
    description: "Fresh, tightly-packed cauliflower heads.",
    price: 100,
    unit: "kg",
    category: "Vegetables",
    rating: 4.3,
    reviews: 29,
    image: watermelon, // suggested filename: cauliflower.png
    tile: "bg-tile-3",
    liked: false,
  },
  {
    id: "garlic",
    name: "garlic",
    description: "Fresh, tightly-packed cauliflower heads.",
    price: 100,
    unit: "kg",
    category: "Vegetables",
    rating: 4.3,
    reviews: 29,
    image: garlic, // suggested filename: cauliflower.png
    tile: "bg-tile-3",
    liked: false,
  },
  {
    id: "banana",
    name: "Banana",
    description: "Fresh, tightly-packed cauliflower heads.",
    price: 100,
    unit: "kg",
    category: "Vegetables",
    rating: 4.3,
    reviews: 29,
    image: banana, // suggested filename: cauliflower.png
    tile: "bg-tile-3",
    liked: false,
  },
  {
    id: "corriander",
    name: "Corriander",
    description: "Fresh, tightly-packed cauliflower heads.",
    price: 100,
    unit: "kg",
    category: "Vegetables",
    rating: 4.3,
    reviews: 29,
    image: corriander, // suggested filename: cauliflower.png
    tile: "bg-tile-3",
    liked: false,
  },
  {
    id: "whiteonion",
    name: "White Onion",
    description: "Fresh, tightly-packed cauliflower heads.",
    price: 100,
    unit: "kg",
    category: "Vegetables",
    rating: 4.3,
    reviews: 29,
    image: whiteonion, // suggested filename: cauliflower.png
    tile: "bg-tile-3",
    liked: false,
  },
  {
    id: "kiwi",
    name: "Kiwi",
    description: "Fresh, tightly-packed cauliflower heads.",
    price: 100,
    unit: "kg",
    category: "fruits",
    rating: 4.3,
    reviews: 29,
    image: kiwi, // suggested filename: cauliflower.png
    tile: "bg-tile-3",
    liked: false,
  },
  {
    id: "brocolli",
    name: "Brocolli",
    description: "Fresh, tightly-packed cauliflower heads.",
    price: 100,
    unit: "kg",
    category: "Vegetables",
    rating: 4.3,
    reviews: 29,
    image: brocolli, // suggested filename: cauliflower.png
    tile: "bg-tile-3",
    liked: false,
  },
  {
    id: "grapes",
    name: "Grapes",
    description: "Fresh, tightly-packed cauliflower heads.",
    price: 100,
    unit: "kg",
    category: "Fruits",
    rating: 4.3,
    reviews: 29,
    image: grapes, // suggested filename: cauliflower.png
    tile: "bg-tile-3",
    liked: false,
  },
  {
    id: "oranges",
    name: "Oranges",
    description: "Fresh, tightly-packed cauliflower heads.",
    price: 100,
    unit: "kg",
    category: "Fruits",
    rating: 4.3,
    reviews: 29,
    image: oranges, // suggested filename: cauliflower.png
    tile: "bg-tile-3",
    liked: false,
  },
  {
    id: "strawberry-juice",
    name: "Strawberry Juice",
    description: "Cold-pressed strawberry juice. Strawberries (100%), nothing else.",
    price: 450,
    unit: "glass",
    category: "Juices",
    rating: 4.8,
    reviews: 64,
    image: strawberryJuice,
    tile: "bg-tile-4",
    liked: false,
  },
  {
    id: "pineapple-juice",
    name: "Pineapple Juice",
    description: "Cold-pressed pineapple juice. Pineapple (100%), nothing else.",
    price: 450,
    unit: "glass",
    category: "Juices",
    rating: 4.7,
    reviews: 51,
    image: pineappleJuice,
    tile: "bg-tile-1",
    liked: false,
  },
  {
    id: "pineapple-mint-juice",
    name: "Pineapple Mint Juice",
    description: "Cold-pressed pineapple juice with a hint of mint. Pineapple (95%), mint (5%).",
    price: 450,
    unit: "glass",
    category: "Juices",
    rating: 4.7,
    reviews: 38,
    image: pineappleMintJuice,
    tile: "bg-tile-2",
    liked: false,
  },
  {
    id: "passion-juice",
    name: "Passion Juice",
    description: "Cold-pressed passion fruit juice. Passion fruit (100%), nothing else.",
    price: 450,
    unit: "glass",
    category: "Juices",
    rating: 4.8,
    reviews: 47,
    image: passionJuice,
    tile: "bg-tile-1",
    liked: false,
  },
  {
    id: "mango-juice",
    name: "Mango Juice",
    description: "Cold-pressed mango juice. Mango (100%), nothing else.",
    price: 450,
    unit: "glass",
    category: "Juices",
    rating: 4.9,
    reviews: 73,
    image: mangoJuice,
    tile: "bg-tile-1",
    liked: true,
  },
  {
    id: "cocktail-juice",
    name: "Cocktail Juice",
    description: "Cold-pressed blend of pineapple, mango, passion fruit, orange, papaya, and lime.",
    price: 450,
    unit: "glass",
    category: "Juices",
    rating: 4.7,
    reviews: 42,
    image: cocktailJuice,
    tile: "bg-tile-4",
    liked: false,
  },
  {
    id: "ukwaju-juice",
    name: "Ukwaju (Tamarind) Juice",
    description: "Cold-pressed tamarind juice. Tamarind (100%), nothing else.",
    price: 450,
    unit: "glass",
    category: "Juices",
    rating: 4.6,
    reviews: 29,
    image: ukwajuJuice,
    tile: "bg-tile-3",
    liked: false,
  },
];