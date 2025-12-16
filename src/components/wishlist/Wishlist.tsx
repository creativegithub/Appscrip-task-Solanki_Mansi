"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./Wishlist.module.css";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency } from "@/context/CurrencyContext";
import SignIn from "../auth/SignIn";

interface WishlistProduct {
  id: string;
  name: string;
  image: string;
  price?: number;
  rating?: {
    rate: number;
    count: number;
  };
}

interface WishlistProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: WishlistProduct[];
  onRemove: (productId: string) => void;
}

export default function Wishlist({ isOpen, onClose, wishlistItems, onRemove }: WishlistProps) {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const [signInOpen, setSignInOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.wishlistPanel}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t("wishlist")}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close wishlist">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          {!isAuthenticated ? (
            <div className={styles.signInPrompt}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M12.62 20.8116C12.28 20.9316 11.72 20.9316 11.38 20.8116C8.48 19.8216 2 15.6916 2 8.69156C2 5.60156 4.49 3.10156 7.56 3.10156C9.38 3.10156 10.99 3.98156 12 5.34156C13.01 3.98156 14.63 3.10156 16.44 3.10156C19.51 3.10156 22 5.60156 22 8.69156C22 15.6916 15.52 19.8216 12.62 20.8116Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3 className={styles.signInTitle}>{t("signInToViewWishlist")}</h3>
              <p className={styles.signInText}>{t("signInOrCreateAccount")}</p>
              <button
                className={styles.signInLink}
                onClick={() => setSignInOpen(true)}
              >
                {t("signIn")}
              </button>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className={styles.empty}>
              <svg width="48" height="48" viewBox="0 0 20 20" fill="none">
                <path d="M10 17L3 11C1 9 1 6 3 4C5 2 8 2 10 4C12 2 15 2 17 4C19 6 19 9 17 11L10 17Z" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <p>{t("yourWishlistIsEmpty")}</p>
            </div>
          ) : (
            <div className={styles.items}>
              {wishlistItems.map((item) => (
                <div key={item.id} className={styles.item}>
                  <Image src={item.image} alt={item.name} width={80} height={80} className={styles.image} unoptimized={true} loading="eager" priority />
                  <div className={styles.info}>
                    <h3 className={styles.name}>{item.name}</h3>
                    {item.price && <p className={styles.price}>{formatPrice(item.price)}</p>}
                    {item.rating && (
                      <p className={styles.rating}>
                        {item.rating.rate} ⭐ ({item.rating.count} {t("reviews")})
                      </p>
                    )}
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={() => {
                      onRemove(item.id);
                    }}
                    aria-label="Remove from wishlist"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M2 6H3.33333H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M5.33333 6V4.66667C5.33333 4.29848 5.47559 3.94545 5.72703 3.6954C5.97847 3.44536 6.33333 3.30381 6.7037 3.30381H13.2963C13.6667 3.30381 14.0215 3.44536 14.273 3.6954C14.5244 3.94545 14.6667 4.29848 14.6667 4.66667V6M16.6667 6V15.3333C16.6667 15.7015 16.5244 16.0545 16.273 16.3046C16.0215 16.5546 15.6667 16.6962 15.2963 16.6962H4.7037C4.33333 16.6962 3.97847 16.5546 3.72703 16.3046C3.47559 16.0545 3.33333 15.7015 3.33333 15.3333V6H16.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M8 9.33331V13.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 9.33331V13.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <SignIn isOpen={signInOpen} onClose={() => setSignInOpen(false)} />
    </>
  );
}
