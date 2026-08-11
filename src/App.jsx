import React, { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code2,
  Globe2,
  ImageOff,
  Leaf,
  LockKeyhole,
  MessageCircle,
  Minus,
  Pencil,
  Plus,
  RefreshCw,
  Sparkles,
  ShoppingBag,
  Sprout,
  Trash2,
  X,
} from "lucide-react";

import groceryBag from "./assets/grocery-bag.png";
import { categoryFilters, productCatalog } from "./products-data";
import { supabase } from "../supabaseClient";

const WHATSAPP_PHONE = "254748818484";
// TODO: swap this out for the exact Instagram page/profile URL once it's shared.
const INSTAGRAM_URL = "https://www.instagram.com/";
const ESTABLISHED_YEAR = 2026;

const developerProfile = {
  name: "Kiama Kareithi",
  nickname: "Jeff",
  title: "Software Developer",
  bio:
    "Kiama, known to friends as Jeff, is a soft-spoken, born-again Christian and a graduate of KCA University with a degree in Applied Computing, majoring in Cyber Security. He built this site and is open to work and collaborate with other people in future.",
  skills: [
    "React",
    "JavaScript (JSX)",
    "Tailwind CSS",
    "Responsive Web Design",
    "Cyber Security",
    "Git & GitHub",
    "WhatsApp API Integration",
    "UI/UX Design",
  ],
  // TODO: add real links (email, GitHub, LinkedIn, WhatsApp, etc.) once shared.
  links: [],
  // TODO: add a headshot/photo once shared.
  photo: null,
};

const navLinks = [
  { label: "Products", href: "#products", target: { page: "products" } },
  { label: "About Us", href: "#about", target: { page: "home", anchor: "about" } },
  { label: "Gallery", href: "#gallery", target: { page: "home", anchor: "gallery" } },
  { label: "Contact Us", href: "#contact", target: { page: "contact" } },
];

const featuredProductIds = ["yellow-bell-pepper", "spinach", "cabbage", "mango-juice"];
const quickAddProductIds = ["pineapple-juice", "passion-juice", "red-onions"];

const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low"];

const initialReviews = [
  {
    id: "review-1",
    name: "Amina K.",
    location: "Nairobi",
    message: "The juices tasted fresh and the vegetables arrived clean and crisp.",
  },
  {
    id: "review-2",
    name: "Brian M.",
    location: "Kiambu",
    message: "Ordering was simple, and the produce felt like it came straight from the farm.",
  },
  {
    id: "review-3",
    name: "Mercy W.",
    location: "Ruiru",
    message: "I love that I can get groceries and fresh juice in one delivery.",
  },
];

function formatCurrency(amount) {
  return `KSh ${amount.toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function buildWhatsAppOrder(cartItems, subtotal) {
  const lines = cartItems.map(
    ({ product, quantity }) =>
      `- ${quantity} x ${product.name} @ ${formatCurrency(product.price)}/${product.unit} = ${formatCurrency(
        product.price * quantity
      )}`
  );

  return [
    "Hello Quis Qitchen, I would like to place this order:",
    "",
    ...lines,
    "",
    `Subtotal: ${formatCurrency(subtotal)}`,
  ].join("\n");
}

function ProductImage({ product, imageClassName = "mx-auto h-full w-auto object-contain" }) {
  if (product.image) {
    return (
      <img
        src={product.image}
        alt={product.name}
        width={512}
        height={512}
        className={imageClassName}
      />
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-1 text-muted-foreground">
      <ImageOff className="h-8 w-8" strokeWidth={1.5} />
      <span className="text-[10px]">Photo coming soon</span>
    </div>
  );
}

function CartPanel({
  cartItems,
  subtotal,
  onCheckout,
  onClose,
  onContinueShopping,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onRemoveItem,
}) {
  return (
    <aside className="absolute right-8 top-16 z-50 w-[min(24rem,calc(100vw-4rem))] rounded-lg border border-border bg-background p-5 shadow-xl">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-foreground">Your Cart</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close cart"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-mint-soft hover:text-leaf"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {cartItems.length === 0 ? (
        <div className="py-8 text-center">
          <ShoppingBag className="mx-auto h-10 w-10 text-mint" strokeWidth={1.5} />
          <p className="mt-4 text-sm font-semibold text-foreground">Your cart is empty.</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Add fresh groceries or juice to start your order.
          </p>
          <button
            type="button"
            onClick={onContinueShopping}
            className="mt-5 cursor-pointer bg-leaf px-5 py-3 text-xs font-semibold tracking-[0.12em] text-background"
          >
            SHOP ITEMS
          </button>
        </div>
      ) : (
        <>
          <div className="mt-4 max-h-88 space-y-4 overflow-y-auto pr-1">
            {cartItems.map(({ product, quantity }) => (
              <article key={product.id} className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-3">
                <div className={`aspect-square rounded-lg ${product.tile} p-2`}>
                  <ProductImage product={product} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="truncate text-sm font-semibold text-foreground">
                        {product.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatCurrency(product.price)}/{product.unit}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(product.id)}
                      aria-label={`Remove ${product.name}`}
                      className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-mint-soft hover:text-leaf"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onDecreaseQuantity(product.id)}
                        aria-label={`Decrease ${product.name} quantity`}
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-border text-muted-foreground hover:text-leaf"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-5 text-center text-sm font-semibold text-foreground">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onIncreaseQuantity(product.id)}
                        aria-label={`Increase ${product.name} quantity`}
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-border text-muted-foreground hover:text-leaf"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      {formatCurrency(product.price * quantity)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-muted-foreground">Subtotal</span>
              <span className="text-base font-bold text-foreground">{formatCurrency(subtotal)}</span>
            </div>
            <button
              type="button"
              onClick={onCheckout}
              className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 bg-leaf px-5 py-3 text-xs font-semibold tracking-[0.12em] text-background"
            >
              <MessageCircle className="h-4 w-4" />
              CHECKOUT
            </button>
          </div>
        </>
      )}
    </aside>
  );
}

function SiteHeader({
  cartCount,
  cartItems,
  isCartOpen,
  onCheckout,
  onCloseCart,
  onContinueShopping,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onNavigate,
  onRemoveItem,
  onToggleCart,
  subtotal,
}) {
  return (
    <>
      <header className="relative flex items-center justify-between px-8 py-5">
        <button
          type="button"
          onClick={() => onNavigate({ page: "admin" })}
          aria-label="Store admin"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-mint-soft hover:text-leaf"
        >
          <LockKeyhole className="h-4 w-4" strokeWidth={2} />
        </button>

        <button
          type="button"
          onClick={() => onNavigate({ page: "home" })}
          className="absolute left-1/2 flex -translate-x-1/2 cursor-pointer items-center gap-2"
        >
          <ShoppingBag className="h-7 w-7 text-leaf" strokeWidth={1.5} />
          <span className="font-script text-3xl leading-none text-leaf">Quis Qitchen</span>
        </button>

        <nav className="flex items-center gap-7 text-sm text-foreground">
          <button
            type="button"
            onClick={onToggleCart}
            className="flex cursor-pointer items-center gap-2 rounded-full bg-mint px-4 py-2 text-xs font-semibold text-leaf"
          >
            <ShoppingBag className="h-3.5 w-3.5" strokeWidth={2.5} />
            {cartCount} {cartCount === 1 ? "Item" : "Items"}
          </button>
        </nav>

        {isCartOpen && (
          <CartPanel
            cartItems={cartItems}
            subtotal={subtotal}
            onCheckout={onCheckout}
            onClose={onCloseCart}
            onContinueShopping={onContinueShopping}
            onDecreaseQuantity={onDecreaseQuantity}
            onIncreaseQuantity={onIncreaseQuantity}
            onRemoveItem={onRemoveItem}
          />
        )}
      </header>

      <div className="flex justify-start px-8">
        <nav className="rounded-full bg-mint-soft">
          <ul className="flex items-center gap-8 px-7 py-3 text-[13px] text-foreground">
            {navLinks.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(c.target);
                  }}
                  className="cursor-pointer hover:text-leaf"
                >
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}

function InstagramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

function SiteFooter({ onNavigate }) {
  return (
    <footer className="border-t border-border bg-mint-soft px-8 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div>
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <ShoppingBag className="h-5 w-5 text-leaf" strokeWidth={1.5} />
            <span className="font-script text-2xl leading-none text-leaf">Quis Qitchen</span>
          </div>
          <p className="mt-2 text-xs font-semibold tracking-[0.14em] text-muted-foreground">
            ESTABLISHED {ESTABLISHED_YEAR}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow Quis Qitchen on Instagram"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border text-leaf hover:bg-mint"
          >
            <InstagramIcon className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={() => onNavigate({ page: "developer" })}
            className="flex cursor-pointer items-center gap-2 rounded-full bg-leaf px-5 py-2.5 text-xs font-semibold tracking-widest text-background"
          >
            <Code2 className="h-3.5 w-3.5" />
            MEET THE DEVELOPER
          </button>
        </div>
      </div>

      <p className="mt-8 text-center text-[11px] text-muted-foreground">
        © {ESTABLISHED_YEAR} Quis Qitchen. All rights reserved.
      </p>
    </footer>
  );
}

function DeveloperPage({ onGoHome }) {
  return (
    <main className="px-8 py-20">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-lg border border-border bg-mint-soft p-8 sm:p-10">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-background shadow-sm">
              {developerProfile.photo ? (
                <img
                  src={developerProfile.photo}
                  alt={developerProfile.name}
                  width={224}
                  height={224}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <ImageOff className="h-7 w-7" strokeWidth={1.5} />
                  <span className="text-[10px]">Photo coming soon</span>
                </div>
              )}
            </div>

            <div className="text-center sm:text-left">
              <p className="text-xs font-semibold tracking-[0.3em] text-mint">MEET THE DEVELOPER</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                {developerProfile.name}
              </h1>
              <p className="text-sm font-semibold text-leaf">
                {developerProfile.title} · goes by {developerProfile.nickname}
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {developerProfile.bio}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs font-semibold tracking-[0.3em] text-mint">SKILLS</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
              {developerProfile.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs font-semibold tracking-[0.3em] text-mint">GET IN TOUCH</p>
            {developerProfile.links.length > 0 ? (
              <div className="mt-3 flex flex-wrap justify-center gap-3 sm:justify-start">
                {developerProfile.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-leaf px-5 py-2.5 text-xs font-semibold tracking-widest text-background"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">Contact links coming soon.</p>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={onGoHome}
            className="cursor-pointer bg-leaf px-6 py-3 text-xs font-semibold tracking-[0.12em] text-background"
          >
            BACK TO HOME
          </button>
        </div>
      </div>
    </main>
  );
}

function ReviewList({ reviews, limit }) {
  const visibleReviews = typeof limit === "number" ? reviews.slice(0, limit) : reviews;

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {visibleReviews.map((review) => (
        <article key={review.id} className="rounded-lg bg-background p-5 shadow-sm">
          <p className="text-sm leading-relaxed text-muted-foreground">"{review.message}"</p>
          <p className="mt-4 text-sm font-bold text-foreground">{review.name}</p>
          <p className="text-xs text-muted-foreground">{review.location}</p>
        </article>
      ))}
    </div>
  );
}

function ReviewSlideshow({ reviews }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reviewCount = reviews.length;
  const activeReview = reviews[activeIndex] || reviews[0];

  useEffect(() => {
    if (reviewCount <= 1) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % reviewCount);
    }, 25000);

    return () => window.clearInterval(timer);
  }, [reviewCount]);

  useEffect(() => {
    if (activeIndex >= reviewCount) setActiveIndex(0);
  }, [activeIndex, reviewCount]);

  function goToPrevious() {
    if (reviewCount <= 1) return;
    setActiveIndex((current) => (current - 1 + reviewCount) % reviewCount);
  }

  function goToNext() {
    if (reviewCount <= 1) return;
    setActiveIndex((current) => (current + 1) % reviewCount);
  }

  return (
    <div className="review-slideshow">
      <div className="review-slideshow-card">
        <p className="text-xs font-semibold tracking-[0.3em] text-mint">FRESH WORDS</p>
        <h3 className="mt-2 text-2xl font-bold leading-tight text-foreground">
          Loved by everyday kitchens
        </h3>
        {activeReview && (
          <article className="mt-6">
            <p className="text-xl leading-relaxed text-foreground">"{activeReview.message}"</p>
            <p className="mt-6 text-sm font-bold text-foreground">{activeReview.name}</p>
            <p className="text-xs text-muted-foreground">{activeReview.location}</p>
          </article>
        )}

        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={goToPrevious}
            aria-label="Previous review"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-leaf hover:bg-mint-soft"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            {reviews.map((review, index) => (
              <button
                type="button"
                key={review.id}
                onClick={() => setActiveIndex(index)}
                aria-label={`Show review ${index + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  index === activeIndex ? "w-8 bg-leaf" : "w-2.5 bg-mint"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={goToNext}
            aria-label="Next review"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-leaf hover:bg-mint-soft"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function HomePage({ catalog, onAddToCart, onShopClick, reviews }) {
  const featuredProducts = featuredProductIds
    .map((id) => catalog.find((product) => product.id === id))
    .filter(Boolean);
  const quickAddProducts = quickAddProductIds
    .map((id) => catalog.find((product) => product.id === id))
    .filter(Boolean);

  return (
    <>
      <section className="organic-hero relative overflow-hidden px-8 py-12 lg:py-16">
        <div className="organic-hero-grid relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.45fr)]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-background/85 px-4 py-2 text-xs font-semibold text-leaf shadow-sm">
              <Leaf className="h-4 w-4" />
              Organic groceries and cold-pressed juices
            </div>
            <h1 className="mt-5 max-w-xl text-[46px] font-bold leading-[1.08] tracking-tight text-foreground">
              Fresh food that makes your kitchen feel alive.
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Build your weekly basket from crisp vegetables, fruit, and fresh juices prepared
              for busy homes across Nairobi.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onShopClick}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-leaf px-8 py-4 text-xs font-semibold tracking-[0.12em] text-background"
              >
                START SHOPPING
              </button>
            </div>

            <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
              {[
                [`${catalog.length}+`, "Fresh items"],
                ["3", "Juice blends"],
                ["KSh", "Local prices"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg bg-background/85 p-4 shadow-sm">
                  <p className="text-xl font-bold text-foreground">{value}</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-124">
            <div className="absolute left-8 top-0 flex items-center gap-2 rounded-full bg-background px-4 py-2 text-xs font-bold text-leaf shadow-md">
              <Sparkles className="h-4 w-4 text-mint" />
              Picked fresh
            </div>
            <div className="absolute bottom-6 left-0 z-20 max-w-52 rounded-lg bg-background p-4 shadow-lg">
              <p className="text-xs font-semibold tracking-[0.2em] text-mint">TODAY'S BASKET</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Add items, open the bag, and send your order straight to WhatsApp.
              </p>
            </div>

            <div className="hero-produce-cluster">
              {featuredProducts.map((p, index) => (
                <article
                  key={p.id}
                  className={`hero-produce-card hero-produce-card-${index + 1} ${p.tile}`}
                >
                  <ProductImage product={p} imageClassName="mx-auto h-28 w-auto object-contain" />
                  <p className="mt-3 text-[11px] text-muted-foreground">{p.name}</p>
                  <p className="text-sm font-bold text-foreground">
                    {formatCurrency(p.price)}/{p.unit}
                  </p>
                  <button
                    type="button"
                    onClick={() => onAddToCart(p)}
                    aria-label={`Add ${p.name} to cart`}
                    className="absolute bottom-3 right-3 flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm bg-leaf text-background"
                  >
                    <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 items-center gap-12 px-8 pb-20 lg:grid-cols-2">
        <div className="relative flex justify-center">
          <div className="absolute left-0 top-6 h-[85%] w-[85%] rounded-full bg-mint-soft" />
          <img
            src={groceryBag}
            alt="Paper grocery bag with fresh vegetables flying out"
            width={1000}
            height={900}
            loading="lazy"
            className="relative w-full max-w-lg object-contain"
          />
        </div>

        <div>
          <h2 className="max-w-[7ch] text-[54px] font-bold leading-tight tracking-tight text-foreground">
            Prepare For The Week
          </h2>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            Shop For Groceries Online And Get Everything Delivered Around Your Schedule. We
            Make It Easy To Scratch One More Thing Off Your To-Do List.
          </p>
          <div className="mt-8 grid max-w-lg gap-3 sm:grid-cols-2">
            {[
              "Fresh juice bottles",
              "Weekly vegetable baskets",
              "Simple WhatsApp checkout",
              "Clean everyday ingredients",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-mint" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mint-soft px-8 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <span className="text-xs font-semibold tracking-[0.3em] text-mint">REVIEWS</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
              What Customers Say
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              A fresh review appears every few moments, and you can move through them with the
              arrows.
            </p>
          </div>
          <ReviewSlideshow reviews={reviews} />
        </div>
      </section>

      <section className="px-8 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-semibold tracking-[0.3em] text-mint">POPULAR</span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                Quick Adds For This Week
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {quickAddProducts.map((p) => (
              <article key={p.id} className={`relative rounded-lg ${p.tile} p-4`}>
                <ProductImage product={p} imageClassName="mx-auto h-32 w-auto object-contain" />
                <p className="mt-3 text-sm font-semibold text-foreground">{p.name}</p>
                <p className="mt-1 text-sm font-bold text-foreground">
                  {formatCurrency(p.price)}/{p.unit}
                </p>
                <button
                  type="button"
                  onClick={() => onAddToCart(p)}
                  aria-label={`Add ${p.name} to cart`}
                  className="absolute bottom-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm bg-leaf text-background"
                >
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="bg-background px-8 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold tracking-[0.3em] text-mint">01</span>
          <p className="mt-4 text-lg leading-relaxed text-foreground">
            There was a time when food was not questioned.
          </p>
          <ul className="mt-3 space-y-1 text-lg leading-relaxed text-foreground">
            <li>It was pure.</li>
            <li>It was whole.</li>
            <li>It was life.</li>
          </ul>
          <p className="mt-6 text-sm italic leading-relaxed text-leaf">
            Genesis 1:29 - God gives humanity all seed-bearing plants, fruits, and vegetables
            as food from the earth.
          </p>
        </div>

        <div className="mx-auto mt-20 max-w-5xl space-y-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="order-2 flex justify-center lg:order-1">
              <div className="flex h-56 w-56 items-center justify-center rounded-full bg-olive text-background">
                <Sprout className="h-20 w-20" strokeWidth={1.25} />
              </div>
            </div>
            <div className="order-1 text-center lg:order-2 lg:text-left">
              <span className="text-xs font-semibold tracking-[0.3em] text-mint">02</span>
              <h3 className="mt-3 font-serif text-3xl font-bold text-leaf">Our Mission</h3>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground lg:mx-0">
                To restore food to its original intention - uncompromised, life-giving, and
                true. To cultivate what nourishes, not just what fills.
              </p>
            </div>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <span className="text-xs font-semibold tracking-[0.3em] text-mint">03</span>
              <h3 className="mt-3 font-serif text-3xl font-bold text-leaf">Our Vision</h3>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground lg:mx-0">
                A world where health is lived through daily choices. Where food no longer harms
                the very bodies it was meant to sustain. Where communities rise because what
                sustains them is right.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="flex h-56 w-56 items-center justify-center rounded-full bg-olive text-background">
                <Globe2 className="h-20 w-20" strokeWidth={1.25} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ProductsPage({ catalog, onAddToCart, onGoHome }) {
  const [category, setCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Featured");
  const [currentPage, setCurrentPage] = useState(1);

  const products = useMemo(() => {
    let list = catalog.filter(
      (p) => category === "All Categories" || p.category === category
    );
    if (sortBy === "Price: Low to High") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "Price: High to Low") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [catalog, category, sortBy]);

  return (
    <section className="px-8 pb-24 pt-6">
      <p className="text-xs text-muted-foreground">
        <button type="button" onClick={onGoHome} className="cursor-pointer hover:text-leaf">
          Home
        </button>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">Products</span>
      </p>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">All Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Fresh groceries delivered to your door
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-foreground">
          <label className="flex items-center gap-2">
            Sort by:
            <span className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="cursor-pointer appearance-none rounded-full border border-border bg-background py-2 pl-3 pr-7 font-semibold focus:outline-none"
              >
                {sortOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
            </span>
          </label>

          <span className="rounded-full border border-border px-3 py-2 font-semibold">
            Show: {products.length}
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
        <span className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="cursor-pointer appearance-none rounded-full border border-border bg-background py-2 pl-4 pr-8 font-semibold text-foreground focus:outline-none"
          >
            {categoryFilters.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
        </span>

        <span className="flex items-center gap-1 rounded-full border border-border px-4 py-2 font-semibold text-foreground">
          Price: All <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </span>

        <button
          type="button"
          onClick={() => {
            setCategory("All Categories");
            setSortBy("Featured");
          }}
          className="cursor-pointer font-semibold text-leaf hover:underline"
        >
          Clear Filters
        </button>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
        {products.map((p) => (
          <article key={p.id} className="text-left">
            <div className={`relative aspect-square rounded-lg ${p.tile} p-4`}>
              <div className="h-full">
                <ProductImage product={p} />
              </div>
              <button
                type="button"
                onClick={() => onAddToCart(p)}
                aria-label={`Add ${p.name} to cart`}
                className="absolute bottom-3 right-3 flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm bg-mint text-leaf"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              </button>
            </div>
            <p className="mt-3 text-[13px] font-semibold text-foreground">{p.name}</p>
            <p className="mt-1 text-sm font-bold text-foreground">
              {formatCurrency(p.price)}/{p.unit}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-14 flex items-center justify-center gap-2 text-xs font-semibold text-foreground">
        <button
          type="button"
          aria-label="Previous page"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border text-muted-foreground hover:text-leaf"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        {[1, 2, 3, 4].map((n) => (
          <button
            type="button"
            key={n}
            onClick={() => setCurrentPage(n)}
            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full ${
              currentPage === n ? "bg-leaf text-background" : "text-foreground hover:text-leaf"
            }`}
          >
            {n}
          </button>
        ))}

        <span className="px-1 text-muted-foreground">...</span>

        <button
          type="button"
          onClick={() => setCurrentPage(12)}
          className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full ${
            currentPage === 12 ? "bg-leaf text-background" : "text-foreground hover:text-leaf"
          }`}
        >
          12
        </button>

        <button
          type="button"
          aria-label="Next page"
          onClick={() => setCurrentPage((p) => Math.min(12, p + 1))}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border text-muted-foreground hover:text-leaf"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </section>
  );
}

function ContactPage({ onAddReview, reviews }) {
  const [contactStatus, setContactStatus] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");

  function handleContactSubmit(e) {
    e.preventDefault();
    e.currentTarget.reset();
    setContactStatus("Thank you. Your message has been received.");
  }

  function handleReviewSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const location = String(form.get("location") || "").trim();
    const message = String(form.get("message") || "").trim();

    if (!name || !message) {
      setReviewStatus("Please add your name and review.");
      return;
    }

    onAddReview({
      id: `review-${Date.now()}`,
      name,
      location: location || "Kenya",
      message,
    });
    e.currentTarget.reset();
    setReviewStatus("Thank you. Your review is now visible on the site.");
  }

  return (
    <main className="px-8 pb-24 pt-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold tracking-[0.3em] text-mint">CONTACT US</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">
          Talk To Quis Qitchen
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Send a question, delivery request, or feedback and we will get back to you.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <form
            onSubmit={handleContactSubmit}
            className="rounded-lg border border-border bg-background p-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-semibold text-foreground">
                Name
                <input
                  name="name"
                  required
                  className="mt-2 w-full rounded-lg border border-border px-4 py-3 text-sm font-normal outline-none focus:border-leaf"
                />
              </label>
              <label className="text-xs font-semibold text-foreground">
                Email or phone
                <input
                  name="contact"
                  required
                  className="mt-2 w-full rounded-lg border border-border px-4 py-3 text-sm font-normal outline-none focus:border-leaf"
                />
              </label>
            </div>
            <label className="mt-4 block text-xs font-semibold text-foreground">
              Subject
              <input
                name="subject"
                required
                className="mt-2 w-full rounded-lg border border-border px-4 py-3 text-sm font-normal outline-none focus:border-leaf"
              />
            </label>
            <label className="mt-4 block text-xs font-semibold text-foreground">
              Message
              <textarea
                name="message"
                required
                rows={5}
                className="mt-2 w-full resize-none rounded-lg border border-border px-4 py-3 text-sm font-normal outline-none focus:border-leaf"
              />
            </label>
            {contactStatus && (
              <p className="mt-4 rounded-lg bg-mint-soft px-4 py-3 text-sm font-semibold text-leaf">
                {contactStatus}
              </p>
            )}
            <button
              type="submit"
              className="mt-5 cursor-pointer bg-leaf px-7 py-3 text-xs font-semibold tracking-[0.12em] text-background"
            >
              SEND MESSAGE
            </button>
          </form>

          <aside className="rounded-lg bg-mint-soft p-6">
            <h2 className="text-xl font-bold text-foreground">Visit Or Message Us</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="font-semibold text-foreground">WhatsApp</dt>
                <dd className="mt-1 text-muted-foreground">0748 818 484</dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">Delivery</dt>
                <dd className="mt-1 text-muted-foreground">Nairobi and nearby towns</dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">Fresh orders</dt>
                <dd className="mt-1 text-muted-foreground">Groceries and cold-pressed juices</dd>
              </div>
            </dl>
          </aside>
        </div>

        <section className="mt-16">
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-[0.3em] text-mint">REVIEWS</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
              Customer Reviews
            </h2>
          </div>
          <ReviewList reviews={reviews} />

          <form
            onSubmit={handleReviewSubmit}
            className="mt-8 rounded-lg border border-border bg-background p-6"
          >
            <h3 className="text-lg font-bold text-foreground">Leave A Review</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-semibold text-foreground">
                Name
                <input
                  name="name"
                  required
                  className="mt-2 w-full rounded-lg border border-border px-4 py-3 text-sm font-normal outline-none focus:border-leaf"
                />
              </label>
              <label className="text-xs font-semibold text-foreground">
                Location
                <input
                  name="location"
                  className="mt-2 w-full rounded-lg border border-border px-4 py-3 text-sm font-normal outline-none focus:border-leaf"
                />
              </label>
            </div>
            <label className="mt-4 block text-xs font-semibold text-foreground">
              Review
              <textarea
                name="message"
                required
                rows={4}
                className="mt-2 w-full resize-none rounded-lg border border-border px-4 py-3 text-sm font-normal outline-none focus:border-leaf"
              />
            </label>
            {reviewStatus && (
              <p className="mt-4 rounded-lg bg-mint-soft px-4 py-3 text-sm font-semibold text-leaf">
                {reviewStatus}
              </p>
            )}
            <button
              type="submit"
              className="mt-5 cursor-pointer border border-leaf px-7 py-3 text-xs font-semibold tracking-[0.12em] text-leaf"
            >
              POST REVIEW
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

// ------------------------------------------------------------------
// ADMIN — Supabase-authenticated product management
// ------------------------------------------------------------------
function AdminLogin({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    onSuccess();
  }

  return (
    <div className="mx-auto mt-24 max-w-sm px-8 text-center">
      <LockKeyhole className="mx-auto h-8 w-8 text-leaf" strokeWidth={1.5} />
      <h1 className="mt-4 text-xl font-bold text-foreground">Store Admin</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Log in with the admin account to manage products.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-mint"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-mint"
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer rounded-full bg-leaf py-2.5 text-xs font-semibold tracking-[0.12em] text-background disabled:opacity-60"
        >
          {loading ? "LOGGING IN..." : "LOG IN"}
        </button>
      </form>
      <p className="mt-4 text-[11px] text-muted-foreground">
        Create this login from Supabase Dashboard → Authentication → Users.
      </p>
    </div>
  );
}

function AdminProductRow({ product, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [unit, setUnit] = useState(product.unit);
  const [category, setCategory] = useState(product.category);

  async function save() {
    setSaving(true);
    await onSave({ ...product, name, price: Number(price) || 0, unit, category });
    setSaving(false);
    setEditing(false);
  }

  function cancel() {
    setName(product.name);
    setPrice(product.price);
    setUnit(product.unit);
    setCategory(product.category);
    setEditing(false);
  }

  return (
    <tr className="border-b border-border last:border-0">
      <td className="py-3 pr-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-mint-soft">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-10 w-10 object-contain" />
          ) : (
            <ImageOff className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
          )}
        </div>
      </td>
      <td className="py-3 pr-4">
        {editing ? (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-40 rounded border border-border px-2 py-1 text-sm focus:outline-none"
          />
        ) : (
          <span className="text-sm font-semibold text-foreground">{product.name}</span>
        )}
      </td>
      <td className="py-3 pr-4">
        {editing ? (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="cursor-pointer rounded border border-border px-2 py-1 text-sm focus:outline-none"
          >
            {categoryFilters
              .filter((c) => c !== "All Categories")
              .map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
          </select>
        ) : (
          <span className="text-xs text-muted-foreground">{product.category}</span>
        )}
      </td>
      <td className="py-3 pr-4">
        {editing ? (
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">KSh</span>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-20 rounded border border-border px-2 py-1 text-sm focus:outline-none"
            />
            <span className="text-sm text-muted-foreground">/</span>
            <input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-14 rounded border border-border px-2 py-1 text-sm focus:outline-none"
            />
          </div>
        ) : (
          <span className="text-sm font-bold text-foreground">
            {formatCurrency(product.price)}/{product.unit}
          </span>
        )}
      </td>
      <td className="py-3 text-right">
        {editing ? (
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              aria-label="Save"
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-leaf text-background disabled:opacity-60"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={cancel}
              aria-label="Cancel"
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-border text-muted-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditing(true)}
              aria-label={`Edit ${product.name}`}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-border text-muted-foreground hover:text-leaf"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(product.id)}
              aria-label={`Delete ${product.name}`}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-border text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

function AddProductForm({ onAdd }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("ea");
  const [category, setCategory] = useState("Vegetables");
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!name.trim() || !price) return;
    setSubmitting(true);
    setError("");

    const id = `${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
    let imageUrl = null;

    try {
      if (imageFile) {
        const path = `${id}-${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(path, imageFile);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(path);
        imageUrl = publicUrlData.publicUrl;
      }

      await onAdd({
        id,
        name: name.trim(),
        description: "",
        price: Number(price) || 0,
        unit,
        category,
        rating: 5,
        review_count: 0,
        image: imageUrl,
        tile: "bg-tile-1",
      });

      setName("");
      setPrice("");
      setUnit("ea");
      setCategory("Vegetables");
      setImageFile(null);
      e.target.reset();
    } catch (err) {
      setError(err.message || "Something went wrong adding this product.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mt-4 grid gap-3 rounded-2xl border border-border p-5 sm:grid-cols-2 lg:grid-cols-6"
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product name"
        required
        className="rounded-full border border-border px-4 py-2 text-sm focus:outline-none lg:col-span-2"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="cursor-pointer rounded-full border border-border px-4 py-2 text-sm focus:outline-none"
      >
        {categoryFilters
          .filter((c) => c !== "All Categories")
          .map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
      </select>
      <input
        type="number"
        step="0.01"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price (KSh)"
        required
        className="rounded-full border border-border px-4 py-2 text-sm focus:outline-none"
      />
      <input
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        placeholder="Unit (ea, lb, bottle...)"
        className="rounded-full border border-border px-4 py-2 text-sm focus:outline-none"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        className="cursor-pointer text-xs file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-mint file:px-3 file:py-2 file:text-xs file:font-semibold file:text-leaf"
      />
      {error && <p className="text-xs text-destructive lg:col-span-6">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-leaf px-4 py-2 text-xs font-semibold tracking-[0.08em] text-background disabled:opacity-60 lg:col-span-6"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
        {submitting ? "ADDING..." : "ADD PRODUCT"}
      </button>
    </form>
  );
}

function AdminPage({ catalog, onAdd, onDelete, onRefresh, onSave }) {
  const [authed, setAuthed] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setAuthed(Boolean(data?.user));
      setCheckingSession(false);
    });
  }, []);

  if (checkingSession) return null;
  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;

  return (
    <section className="px-8 pb-24 pt-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Store Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add products, edit prices, and remove items. Changes save straight to the database.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onRefresh}
            className="flex cursor-pointer items-center gap-1.5 self-start rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-leaf"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
            className="flex cursor-pointer items-center gap-1.5 self-start rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-destructive"
          >
            Log out
          </button>
        </div>
      </div>

      <AddProductForm onAdd={onAdd} />

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th className="pb-2 pr-4 font-semibold">Photo</th>
              <th className="pb-2 pr-4 font-semibold">Name</th>
              <th className="pb-2 pr-4 font-semibold">Category</th>
              <th className="pb-2 pr-4 font-semibold">Price</th>
              <th className="pb-2 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {catalog.map((p) => (
              <AdminProductRow key={p.id} product={p} onSave={onSave} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [scrollTarget, setScrollTarget] = useState(null);
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [reviews, setReviews] = useState(initialReviews);
  const [catalog, setCatalog] = useState(productCatalog);

  // Merge in live Supabase data, but keep local bundled photos as a fallback
  // for any product the database doesn't have an image for yet.
  async function loadCatalog() {
    const { data, error } = await supabase.from("products").select("*").order("category");
    if (error || !data || data.length === 0) return;
    const merged = data.map((row) => {
      const fallback = productCatalog.find((p) => p.id === row.id);
      return {
        ...row,
        image: row.image || fallback?.image || null,
        tile: row.tile || fallback?.tile || "bg-tile-1",
      };
    });
    setCatalog(merged);
  }

  async function loadReviews() {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data && data.length > 0) setReviews(data);
  }

  useEffect(() => {
    loadCatalog();
    loadReviews();
  }, []);

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .map(([productId, quantity]) => {
          const product = catalog.find((p) => p.id === productId);
          return product ? { product, quantity } : null;
        })
        .filter(Boolean),
    [cart, catalog]
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  function handleNavigate(target) {
    setPage(target.page);
    setScrollTarget(target.anchor || null);
    setIsCartOpen(false);
  }

  function handleAddToCart(product) {
    setCart((current) => ({
      ...current,
      [product.id]: (current[product.id] || 0) + 1,
    }));
    setIsCartOpen(true);
  }

  function handleIncreaseQuantity(productId) {
    setCart((current) => ({
      ...current,
      [productId]: (current[productId] || 0) + 1,
    }));
  }

  function handleDecreaseQuantity(productId) {
    setCart((current) => {
      const nextQuantity = (current[productId] || 0) - 1;
      if (nextQuantity <= 0) {
        const { [productId]: removed, ...rest } = current;
        return rest;
      }
      return { ...current, [productId]: nextQuantity };
    });
  }

  function handleRemoveItem(productId) {
    setCart((current) => {
      const { [productId]: removed, ...rest } = current;
      return rest;
    });
  }

  function handleContinueShopping() {
    setIsCartOpen(false);
    handleNavigate({ page: "products" });
  }

  function handleCheckout() {
    if (cartItems.length === 0) return;
    const message = buildWhatsAppOrder(cartItems, subtotal);
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function handleAddReview(review) {
    setReviews((current) => [review, ...current]);
    const { error } = await supabase.from("reviews").insert({
      name: review.name,
      location: review.location,
      message: review.message,
    });
    if (error) console.error("Could not save review to Supabase:", error.message);
  }

  async function handleAdminSaveProduct(updated) {
    setCatalog((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    const { error } = await supabase
      .from("products")
      .update({
        name: updated.name,
        price: updated.price,
        unit: updated.unit,
        category: updated.category,
      })
      .eq("id", updated.id);
    if (error) console.error("Could not save product to Supabase:", error.message);
  }

  async function handleAdminDeleteProduct(id) {
    setCatalog((prev) => prev.filter((p) => p.id !== id));
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) console.error("Could not delete product from Supabase:", error.message);
  }

  async function handleAdminAddProduct(product) {
    setCatalog((prev) => [...prev, product]);
    const { error } = await supabase.from("products").insert(product);
    if (error) console.error("Could not add product to Supabase:", error.message);
  }

  useEffect(() => {
    if (page === "home" && scrollTarget) {
      const el = document.getElementById(scrollTarget);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      setScrollTarget(null);
    }
  }, [page, scrollTarget]);

  return (
    <div className="min-h-screen bg-background font-sans">
      <SiteHeader
        cartCount={cartCount}
        cartItems={cartItems}
        isCartOpen={isCartOpen}
        subtotal={subtotal}
        onCheckout={handleCheckout}
        onCloseCart={() => setIsCartOpen(false)}
        onContinueShopping={handleContinueShopping}
        onDecreaseQuantity={handleDecreaseQuantity}
        onIncreaseQuantity={handleIncreaseQuantity}
        onNavigate={handleNavigate}
        onRemoveItem={handleRemoveItem}
        onToggleCart={() => setIsCartOpen((open) => !open)}
      />
      {page === "products" ? (
        <ProductsPage
          catalog={catalog}
          onAddToCart={handleAddToCart}
          onGoHome={() => handleNavigate({ page: "home" })}
        />
      ) : page === "contact" ? (
        <ContactPage reviews={reviews} onAddReview={handleAddReview} />
      ) : page === "developer" ? (
        <DeveloperPage onGoHome={() => handleNavigate({ page: "home" })} />
      ) : page === "admin" ? (
        <AdminPage
          catalog={catalog}
          onAdd={handleAdminAddProduct}
          onDelete={handleAdminDeleteProduct}
          onRefresh={loadCatalog}
          onSave={handleAdminSaveProduct}
        />
      ) : (
        <HomePage
          catalog={catalog}
          reviews={reviews}
          onAddToCart={handleAddToCart}
          onShopClick={() => handleNavigate({ page: "products" })}
        />
      )}
      <SiteFooter onNavigate={handleNavigate} />
    </div>
  );
}