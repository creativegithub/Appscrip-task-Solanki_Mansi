"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./ProductModal.module.css";
import { showToast } from "../feedback/Toast";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useScrollLock } from "@/hooks/useScrollLock";
import { Product, WishlistItem, CartItem } from "@/types/product";

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [cartQuantity, setCartQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  useScrollLock(isOpen);

  useEffect(() => {
    if (isOpen) {
      const checkWishlistStatus = () => {
        const savedWishlist = localStorage.getItem("wishlist");
        if (savedWishlist) {
          const wishlist: WishlistItem[] = JSON.parse(savedWishlist);
          setIsWishlisted(wishlist.some((item) => item.id === product.id));
        } else {
          setIsWishlisted(false);
        }
      };
      checkWishlistStatus();

      const handleWishlistUpdate = () => {
        checkWishlistStatus();
      };

      window.addEventListener("wishlistUpdated", handleWishlistUpdate);
      return () => window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
    }
  }, [isOpen, product.id]);

  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      showToast(t("signInToViewCart"), "info");
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
      showToast(t("addedToWishlist") || "Added to wishlist", "success");
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    setIsWishlisted(!isWishlisted);
    window.dispatchEvent(new CustomEvent("wishlistUpdated", { detail: { wishlist } }));
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      showToast(t("signInToViewCart"), "info");
      return;
    }

    const cartProduct = {
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      rating: product.rating,
      description: product.description,
      quantity: cartQuantity,
    };

    const savedCart = localStorage.getItem("cart");
    const cart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      exists.quantity += cartQuantity;
    } else {
      cart.push(cartProduct);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    showToast(t("addedToCart"), "success");
    setCartQuantity(1);
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { cart } }));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className={styles.container}>
          <div className={styles.imageSection}>
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
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className={styles.detailsSection}>
            <h1 className={styles.productName}>{product.name}</h1>

            {product.price && (
              <div className={styles.price}>{formatPrice(product.price)}</div>
            )}

            {product.rating && (
              <div className={styles.rating}>
                <span className={styles.rateValue}>{product.rating.rate}</span>
                <span className={styles.rateCount}>({product.rating.count} {t("reviews")})</span>
              </div>
            )}

            <div className={styles.descriptionSection}>
              <h2 className={styles.descriptionTitle}>{t("description") || "Description"}</h2>
              <p className={styles.description}>
                {product.description || t("noDescriptionAvailable")}
              </p>
            </div>

            <div className={styles.cartSection}>
              <div className={styles.quantityControl}>
                <button
                  onClick={() => setCartQuantity(Math.max(1, cartQuantity - 1))}
                  className={styles.quantityBtn}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className={styles.quantity}>{cartQuantity}</span>
                <button
                  onClick={() => setCartQuantity(cartQuantity + 1)}
                  className={styles.quantityBtn}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                className={styles.addToCartBtn}
                onClick={handleAddToCart}
                aria-label="Add to cart"
              >
                {t("addToCart")}
              </button>
              <button
                className={`${styles.wishlistBtn} ${isWishlisted ? styles.wishlisted : ""}`}
                onClick={handleWishlistClick}
                aria-label="Add to wishlist"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill={isWishlisted ? "currentColor" : "none"}>
                  <path d="M10 17L3 11C1 9 1 6 3 4C5 2 8 2 10 4C12 2 15 2 17 4C19 6 19 9 17 11L10 17Z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
