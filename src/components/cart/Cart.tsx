"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./Cart.module.css";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency } from "@/context/CurrencyContext";
import SignIn from "../auth/SignIn";
import { showToast } from "../feedback/Toast";

interface CartProduct {
  id: string;
  name: string;
  image: string;
  price?: number;
  quantity: number;
  rating?: {
    rate: number;
    count: number;
  };
  description?: string;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartProduct[];
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export default function Cart({
  isOpen,
  onClose,
  cartItems,
  onRemove,
  onUpdateQuantity,
}: CartProps) {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const [signInOpen, setSignInOpen] = useState(false);

  if (!isOpen) return null;

  const totalPrice = cartItems.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.cartPanel}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t("bag")}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close cart">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          {!isAuthenticated ? (
            <div className={styles.signInPrompt}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M8.39612 6.5H15.5961C18.9961 6.5 19.3361 8.09 19.5661 10.03L20.4661 17.53C20.7561 19.99 19.9961 22 16.4961 22H7.50612C3.99612 22 3.23612 19.99 3.53612 17.53L4.43613 10.03C4.65613 8.09 4.99612 6.5 8.39612 6.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 8V4.5C8 3 9 2 10.5 2H13.5C15 2 16 3 16 4.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20.41 17.0312H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3 className={styles.signInTitle}>{t("signInToViewCart")}</h3>
              <p className={styles.signInText}>{t("signInOrCreateAccount")}</p>
              <button
                className={styles.signInLink}
                onClick={() => setSignInOpen(true)}
              >
                {t("signIn")}
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className={styles.empty}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M8.39612 6.5H15.5961C18.9961 6.5 19.3361 8.09 19.5661 10.03L20.4661 17.53C20.7561 19.99 19.9961 22 16.4961 22H7.50612C3.99612 22 3.23612 19.99 3.53612 17.53L4.43613 10.03C4.65613 8.09 4.99612 6.5 8.39612 6.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 8V4.5C8 3 9 2 10.5 2H13.5C15 2 16 3 16 4.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20.41 17.0312H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p>{t("yourCartIsEmpty")}</p>
            </div>
          ) : (
            <div className={styles.items}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className={styles.image}
                    unoptimized={true}
                    loading="eager"
                    priority
                  />
                  <div className={styles.itemContent}>
                    <div className={styles.itemDetails}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      {item.price && (
                        <p className={styles.itemPrice}>{formatPrice(item.price)}</p>
                      )}
                      {item.description && (
                        <p className={styles.itemDescription}>
                          {item.description.substring(0, 60)}...
                        </p>
                      )}
                    </div>
                    <div className={styles.itemActions}>
                      <div className={styles.itemSummary}>
                        <div className={styles.quantityControl}>
                          <button
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className={styles.quantityBtn}
                          >
                            −
                          </button>
                          <span className={styles.quantity}>{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className={styles.quantityBtn}
                          >
                            +
                          </button>
                        </div>
                        <p className={styles.subtotal}>
                          {formatPrice((item.price || 0) * item.quantity)}
                        </p>
                      </div>
                      <button
                        className={styles.removeBtn}
                        onClick={() => {
                          onRemove(item.id);
                          showToast(t("removedFromCart"), "info");
                        }}
                        aria-label="Remove from cart"
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M2 6H3.33333H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M5.33333 6V4.66667C5.33333 4.29848 5.47559 3.94545 5.72703 3.6954C5.97847 3.44536 6.33333 3.30381 6.7037 3.30381H13.2963C13.6667 3.30381 14.0215 3.44536 14.273 3.6954C14.5244 3.94545 14.6667 4.29848 14.6667 4.66667V6M16.6667 6V15.3333C16.6667 15.7015 16.5244 16.0545 16.273 16.3046C16.0215 16.5546 15.6667 16.6962 15.2963 16.6962H4.7037C4.33333 16.6962 3.97847 16.5546 3.72703 16.3046C3.47559 16.0545 3.33333 15.7015 3.33333 15.3333V6H16.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M8 9.33331V13.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M12 9.33331V13.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {isAuthenticated && cartItems.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalSection}>
              <span className={styles.totalLabel}>{t("total")}:</span>
              <span className={styles.totalPrice}>{formatPrice(totalPrice)}</span>
            </div>
            <button className={styles.checkoutBtn}>
              {t("proceedToCheckout")}
            </button>
          </div>
        )}
      </div>
      {signInOpen && <SignIn isOpen={signInOpen} onClose={() => setSignInOpen(false)} />}
    </>
  );
}
