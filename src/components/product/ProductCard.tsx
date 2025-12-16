"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./ProductCard.module.css";
import { showToast } from "../feedback/Toast";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency } from "@/context/CurrencyContext";
import SignIn from "../auth/SignIn";
import ProductModal from "./ProductModal";
import { Product, WishlistItem } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onAddToWishlist?: (product: WishlistItem) => void;
}

export default function ProductCard({ product, onAddToWishlist }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const [signInOpen, setSignInOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Initialize isWishlisted to false to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const checkWishlistStatus = () => {
      try {
        const savedWishlist = localStorage.getItem("wishlist");
        if (savedWishlist) {
          const wishlist: WishlistItem[] = JSON.parse(savedWishlist);
          setIsWishlisted(wishlist.some((item) => item.id === product.id));
        } else {
          setIsWishlisted(false);
        }
      } catch (error) {
        setIsWishlisted(false);
      }
    };

    checkWishlistStatus();

    const handleWishlistUpdate = () => {
      checkWishlistStatus();
    };

    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    window.addEventListener("storage", handleWishlistUpdate);

    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
      window.removeEventListener("storage", handleWishlistUpdate);
    };
  }, [product.id, isClient]);

  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      showToast("Sign in to add items to wishlist", "info");
      setSignInOpen(true);
      return;
    }

    const wishlistProduct: WishlistItem = {
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      rating: product.rating,
    };

    const savedWishlist = localStorage.getItem("wishlist");
    let wishlist: WishlistItem[] = savedWishlist ? JSON.parse(savedWishlist) : [];

    const exists = wishlist.some((item) => item.id === product.id);
    if (exists) {
      wishlist = wishlist.filter((item) => item.id !== product.id);
    } else {
      wishlist.push(wishlistProduct);
      showToast("Added to wishlist", "success");
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    setIsWishlisted(!isWishlisted);

    if (onAddToWishlist) {
      onAddToWishlist(wishlistProduct);
    }

    window.dispatchEvent(new CustomEvent("wishlistUpdated", { detail: { wishlist } }));
  };

  return (
    <>
      <article className={styles.card}>
        <div className={styles.imageContainer}>
          <div className={styles.imagePlaceholder}>
            {!imageLoaded && !imageError && (
              <div className={styles.skeleton} />
            )}
            {imageError && (
              <div className={styles.errorPlaceholder}>
                <p>{t("imageNotAvailable")}</p>
              </div>
            )}
            <Image
              src={product.image}
              alt={product.altText}
              fill
              className={`${styles.image} ${imageLoaded ? styles.loaded : ""}`}
              loading="eager"
              priority
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {product.inStock === false && (
              <div className={styles.outOfStockOverlay}>
                <span className={styles.outOfStockText}>OUT OF STOCK</span>
              </div>
            )}
          </div>
          <button
            className={styles.viewIcon}
            onClick={(e) => {
              e.stopPropagation();
              if (!isAuthenticated) {
                showToast("Sign in to view product details", "info");
                setSignInOpen(true);
              } else {
                setModalOpen(true);
              }
            }}
            aria-label="View product details"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className={styles.content}>
          <h2 className={styles.name}>{product.name}</h2>
          {isAuthenticated ? (
            <>
              <div className={styles.priceRatingRow}>
                {product.price && (
                  <div className={styles.price}>{formatPrice(product.price)}</div>
                )}
                {product.rating && (
                  <div className={styles.rating}>
                    <span className={styles.rateValue}>{product.rating.rate}</span>
                    <span className={styles.rateCount}>({product.rating.count} {t("reviews")})</span>
                  </div>
                )}
              </div>
              <p className={styles.description}>
                {product.description ? product.description.substring(0, 100) + "..." : t("noDescriptionAvailable")}
              </p>
            </>
          ) : (
            <div className={styles.signInPrompt}>
              <p className={styles.signInText}>
                <button
                  className={styles.signInLink}
                  onClick={() => setSignInOpen(true)}
                >
                  {t("signIn")}
                </button>
                {" "}{t("signInOrCreateAccount")}
              </p>
            </div>
          )}
          <div className={styles.footer}>
            {isClient && (
              <button
                className={`${styles.wishlist} ${isWishlisted ? styles.wishlisted : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleWishlistClick();
                }}
                aria-label="Add to wishlist"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill={isWishlisted ? "currentColor" : "none"}>
                  <path d="M10 17L3 11C1 9 1 6 3 4C5 2 8 2 10 4C12 2 15 2 17 4C19 6 19 9 17 11L10 17Z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            )}
          </div>
        </div>
        {signInOpen && <SignIn isOpen={signInOpen} onClose={() => setSignInOpen(false)} />}
      </article>
      <ProductModal
        product={product}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
