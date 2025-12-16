"use client";
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect } from "react";
import styles from "./Footer.module.css";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency, type CurrencyCode } from "@/context/CurrencyContext";
import { showToast } from "../feedback/Toast";

interface Currency {
  code: string;
  flag: string;
  country: string;
}

const currencies: Currency[] = [
  { code: "USD", flag: "https://flagcdn.com/w40/us.png", country: "United States" },
  { code: "EUR", flag: "https://flagcdn.com/w40/de.png", country: "Europe" },
  { code: "GBP", flag: "https://flagcdn.com/w40/gb.png", country: "United Kingdom" },
  { code: "INR", flag: "https://flagcdn.com/w40/in.png", country: "India" },
];

export default function Footer() {
  const { t } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const [email, setEmail] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    mettaMuse: false,
    quickLinks: false,
    followUs: false,
  });
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Load saved email from localStorage if it exists
    const savedEmail = localStorage.getItem("newsletterEmail");
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Avoid hydration mismatch by setting state after mount
    setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isClient]);

  useEffect(() => {
    if (!isMobile) {
      setExpandedSections({
        mettaMuse: true,
        quickLinks: true,
        followUs: true,
      });
    }
  }, [isMobile]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    const currencyCode = currency.code as CurrencyCode;
    const found = currencies.find(c => c.code === currencyCode);
    if (found) {
      setSelectedCurrency(found);
    }
  }, [currency]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast("Please enter your email", "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("Please enter a valid email", "error");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      localStorage.setItem("newsletterEmail", email);
      showToast("Successfully subscribed to newsletter!", "success");
      setEmail("");
      setLoading(false);
    }, 500);
  };

  const handleCurrencyChange = (currency: Currency) => {
    setSelectedCurrency(currency);
    setCurrency(currency.code as CurrencyCode);
    showToast(`Currency changed to ${currency.code}`, "success");
    setCurrencyOpen(false);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.column}>
            <h2 className={styles.heading}>{t("beTheFirstToKnow")}</h2>
            <p className={`${styles.text} ${styles.desktopOnly}`}>{t("signUpForUpdates")}</p>
            <p className={`${styles.text} ${styles.mobileOnly}`}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. this is simply dummy text.</p>
            <form onSubmit={handleNewsletterSubmit} className={styles.newsletter}>
              <input
                type="email"
                placeholder="Enter your e-mail ..."
                className={styles.input}
                aria-label="Email for newsletter"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className={styles.submitBtn}
                aria-label="Subscribe"
                disabled={loading}
              >
                {loading ? t("subscribing") : t("subscribe")}
              </button>
            </form>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.column}>
            {isMobile ? (
              <h3 className={styles.heading}>Call us</h3>
            ) : (<h2 className={styles.heading}>{t("contactUs")}</h2>)}
            <div className={styles.contactInfo}>
              <p className={styles.contactText}>+44 221 133 5360</p>
              {isMobile && (
                <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
                  <path d="M3 0L4.48492 1.51508L6 3L4.48492 4.48492L3 6L1.51508 4.48492L0 3L1.51508 1.51508L3 0Z" fill="white" />
                </svg>
              )}
              <p className={styles.contactText}>customercare@mettamuse.com</p>
            </div>

            <div className={styles.divider}></div>

            <h2 className={styles.heading} style={{ marginTop: '24px' }}>{t("currency")}</h2>
            <div className={styles.currencyDropdown}>
              <button
                className={styles.currencySelect}
                onClick={() => setCurrencyOpen(!currencyOpen)}
                aria-label="Select currency"
              >
                <img src={selectedCurrency.flag} alt={selectedCurrency.country} className={styles.flagImage} />
                <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
                  <path d="M3 0L4.48492 1.51508L6 3L4.48492 4.48492L3 6L1.51508 4.48492L0 3L1.51508 1.51508L3 0Z" fill="white" />
                </svg>
                <span className={styles.currencyCode}>{selectedCurrency.code}</span>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className={currencyOpen ? styles.chevronUp : styles.chevronDown}>
                  <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {currencyOpen && (
                <div className={styles.currencyOptions}>
                  {currencies.map((currency) => (
                    <button
                      key={currency.code}
                      className={`${styles.currencyOption} ${selectedCurrency.code === currency.code ? styles.active : ""}`}
                      onClick={() => handleCurrencyChange(currency)}
                    >
                      <img src={currency.flag} alt={currency.country} className={styles.flagImage} />
                      <span>{currency.code}</span>
                      <span className={styles.countryName}>{currency.country}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className={styles.currencyNote}>{t("currencyNote")}</p>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.middleSection}>
          <div className={styles.column}>
            {isMobile ? (
              <button
                className={`${styles.columnHeader} ${expandedSections.mettaMuse ? styles.expanded : ""}`}
                onClick={() => toggleSection("mettaMuse")}
                aria-expanded={expandedSections.mettaMuse}
              >
                <h3 className={styles.brandName}>mettā muse</h3>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 4L6 9L11 4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            ) : (
              <h3 className={styles.brandName}>mettā muse</h3>
            )}
            <ul className={`${styles.list} ${expandedSections.mettaMuse ? styles.visible : styles.hidden}`}>
              <li><a href="#about">{t("aboutUs")}</a></li>
              <li><a href="#stories">{t("footerStories")}</a></li>
              <li><a href="#artisans">{t("artisans")}</a></li>
              <li><a href="#boutiques">{t("boutiques")}</a></li>
              <li><a href="#contact">{t("contactUs")}</a></li>
              <li><a href="#eu-compliance">EU Compliances Docs</a></li>
            </ul>
          </div>

          <div className={styles.column}>
            {isMobile ? (
              <button
                className={`${styles.columnHeader} ${expandedSections.quickLinks ? styles.expanded : ""}`}
                onClick={() => toggleSection("quickLinks")}
                aria-expanded={expandedSections.quickLinks}
              >
                <h3 className={styles.heading}>{t("quickLinks")}</h3>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 4L6 9L11 4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            ) : (
              <h3 className={styles.heading}>{t("quickLinks")}</h3>
            )}
            <ul className={`${styles.list} ${expandedSections.quickLinks ? styles.visible : styles.hidden}`}>
              <li><a href="#orders">{t("ordersShipping")}</a></li>
              <li><a href="#join">{t("joinSeller")}</a></li>
              <li><a href="#payment">{t("paymentPricing")}</a></li>
              <li><a href="#returns">{t("returnRefunds")}</a></li>
              <li><a href="#faq">{t("faqs")}</a></li>
              <li><a href="#privacy">{t("privacyPolicy")}</a></li>
              <li><a href="#terms">{t("termsConditions")}</a></li>
            </ul>
          </div>

          <div className={styles.column}>
            {isMobile ? (
              <button
                className={`${styles.columnHeader} ${expandedSections.followUs ? styles.expanded : ""}`}
                onClick={() => toggleSection("followUs")}
                aria-expanded={expandedSections.followUs}
              >
                <h3 className={styles.heading}>{t("followUs")}</h3>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 4L6 9L11 4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            ) : (
              <h3 className={styles.heading}>{t("followUs")}</h3>
            )}
            <div className={`${styles.followUsContent} ${expandedSections.followUs ? styles.visible : styles.hidden}`}>
              <div className={styles.social}>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Follow us on Instagram" className={styles.socialIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.70171 0.0479998C3.85029 0.0868569 3.26857 0.221714 2.75886 0.420571C2.23314 0.624 1.78743 0.898286 1.34171 1.34286C0.898286 1.78743 0.624 2.23429 0.420571 2.76C0.221714 3.26857 0.0868569 3.85029 0.0479998 4.70171C0.00914265 5.55429 0 5.82743 0 8C0 10.1726 0.00914265 10.4457 0.0479998 11.2983C0.0868569 12.1497 0.221714 12.7314 0.420571 13.2411C0.624 13.7669 0.898286 14.2126 1.34286 14.6583C1.78743 15.1017 2.23429 15.376 2.76 15.5806C3.26857 15.7783 3.85029 15.912 4.70171 15.952C5.55543 15.9909 5.82743 16 8 16C10.1726 16 10.4457 15.9909 11.2983 15.952C12.1497 15.9131 12.7314 15.7783 13.2411 15.5806C13.7669 15.3749 14.2126 15.1017 14.6583 14.6571C15.1017 14.2126 15.376 13.7657 15.5806 13.24C15.7783 12.7314 15.912 12.1497 15.952 11.2983C15.9909 10.4446 16 10.1726 16 8C16 5.82743 15.9909 5.55429 15.952 4.70171C15.9131 3.85029 15.7783 3.26857 15.5806 2.75886C15.3795 2.22494 15.0644 1.74131 14.6571 1.34171C14.2126 0.898286 13.7657 0.624 13.24 0.420571C12.7314 0.221714 12.1497 0.0868569 11.2983 0.0479998C10.4457 0.00914265 10.1726 0 8 0C5.82743 0 5.55429 0.00914265 4.70171 0.0479998ZM3.89143 8C3.89143 9.08966 4.3243 10.1347 5.0948 10.9052C5.86531 11.6757 6.91034 12.1086 8 12.1086C9.08966 12.1086 10.1347 11.6757 10.9052 10.9052C11.6757 10.1347 12.1086 9.08966 12.1086 8C12.1086 6.91034 11.6757 5.86531 10.9052 5.0948C10.1347 4.3243 9.08966 3.89143 8 3.89143C6.91034 3.89143 5.86531 4.3243 5.0948 5.0948C4.3243 5.86531 3.89143 6.91034 3.89143 8ZM8 10.6663C7.29286 10.6663 6.61468 10.3854 6.11465 9.88535C5.61463 9.38532 5.33371 8.70714 5.33371 8C5.33371 7.29286 5.61463 6.61468 6.11465 6.11465C6.61468 5.61463 7.29286 5.33371 8 5.33371C8.70714 5.33371 9.38532 5.61463 9.88535 6.11465C10.3854 6.61468 10.6663 7.29286 10.6663 8C10.6663 8.70714 10.3854 9.38532 9.88535 9.88535C9.38532 10.3854 8.70714 10.6663 8 10.6663ZM13.6 3.44C13.6 3.56607 13.5752 3.6909 13.5269 3.80738C13.4787 3.92385 13.408 4.02968 13.3188 4.11882C13.2297 4.20797 13.1238 4.27868 13.0074 4.32692C12.8909 4.37517 12.7661 4.4 12.64 4.4C12.5139 4.4 12.3891 4.37517 12.2726 4.32692C12.1562 4.27868 12.0503 4.20797 11.9612 4.11882C11.872 4.02968 11.8013 3.92385 11.7531 3.80738C11.7048 3.6909 11.68 3.56607 11.68 3.44C11.68 3.18539 11.7811 2.94121 11.9612 2.76118C12.1412 2.58114 12.3854 2.48 12.64 2.48C12.8946 2.48 13.1388 2.58114 13.3188 2.76118C13.4989 2.94121 13.6 3.18539 13.6 3.44Z" fill="white"/>
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="Connect with us on LinkedIn" className={styles.socialIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M19 3C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19ZM18.5 18.5V13.2C18.5 12.3354 18.1565 11.5062 17.5452 10.8948C16.9338 10.2835 16.1046 9.94 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17C14.6813 12.17 15.0374 12.3175 15.2999 12.5801C15.5625 12.8426 15.71 13.1987 15.71 13.57V18.5H18.5ZM6.88 8.56C7.32556 8.56 7.75288 8.383 8.06794 8.06794C8.383 7.75288 8.56 7.32556 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19C6.43178 5.19 6.00193 5.36805 5.68499 5.68499C5.36805 6.00193 5.19 6.43178 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56ZM8.27 18.5V10.13H5.5V18.5H8.27Z" fill="white" />
                  </svg>
                </a>
              </div>

              {!isMobile && (
                <>
                  <h3 className={styles.heading} style={{ marginTop: '24px' }}>mettā muse <span style={{ textTransform: 'uppercase' }}>accepts</span></h3>
                  <div className={styles.payments}>
                    <a href="https://pay.google.com" target="_blank" rel="noopener noreferrer" aria-label="Google Pay" title="Pay with Google Pay" className={styles.paymentIcon} style={{ backgroundColor: '#fff', padding: '5px' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="14" viewBox="0 0 36 14" fill="none">
                        <path d="M16.9607 6.54394V10.4725H15.6328V0.773868H19.143C19.5636 0.767167 19.9814 0.838773 20.3725 0.984569C20.7635 1.13037 21.1202 1.34748 21.4218 1.62342C21.7075 1.87435 21.9379 2.17581 22.0997 2.51058C22.2616 2.84535 22.3517 3.20686 22.3651 3.57444C22.3784 3.94203 22.3146 4.30848 22.1774 4.65285C22.0401 4.99723 21.8321 5.31277 21.5653 5.58144L21.4218 5.72385C20.8087 6.27262 19.9895 6.57095 19.143 6.55131L16.9607 6.54394ZM16.9607 1.96226V5.38502H19.1756C19.6673 5.39975 20.1422 5.21928 20.4865 4.88904C20.7328 4.64739 20.8982 4.34292 20.9621 4.0135C21.026 3.68408 20.9856 3.34424 20.8459 3.03626C20.7062 2.72829 20.4734 2.46577 20.1764 2.28136C19.8794 2.09695 19.5314 1.99879 19.1756 1.99909L16.9607 1.96226ZM25.4185 3.61716C26.2663 3.58033 27.096 3.84797 27.7377 4.36973C28.3182 4.89763 28.6273 5.63423 28.5856 6.39417V10.4872H27.3216V9.54684H27.2577C27.031 9.89955 26.7105 10.1905 26.3278 10.391C25.945 10.5914 25.5134 10.6944 25.0754 10.6898C24.3605 10.7116 23.6633 10.4778 23.124 10.0354C22.8685 9.8393 22.6638 9.59104 22.5252 9.30944C22.3867 9.02783 22.318 8.72027 22.3244 8.41001C22.3094 8.09645 22.3741 7.78405 22.5131 7.49877C22.6522 7.21349 22.8617 6.96358 23.124 6.76983C23.7676 6.3342 24.5466 6.11184 25.3389 6.13758C26.0133 6.11303 26.6825 6.25175 27.2825 6.54394V6.28858C27.2869 6.07746 27.2402 5.86815 27.146 5.67652C27.0517 5.48488 26.9124 5.31593 26.7385 5.18245C26.3894 4.8837 25.932 4.72205 25.4602 4.73066C25.1176 4.72762 24.7798 4.80686 24.4787 4.96088C24.1777 5.1149 23.9233 5.33863 23.7397 5.61091L22.5723 4.9185C22.8893 4.49102 23.3172 4.14702 23.8154 3.91923C24.3136 3.69145 24.8655 3.58746 25.4185 3.61716ZM23.7397 8.43947C23.7366 8.59848 23.775 8.75577 23.8517 8.89749C23.9283 9.03922 24.0408 9.16103 24.1793 9.25219C24.4702 9.46826 24.8315 9.58244 25.2033 9.57507C25.7628 9.57384 26.299 9.36637 26.6981 8.99561C27.096 8.64449 27.3216 8.15465 27.3216 7.64148C26.8195 7.30548 26.2093 7.14327 25.5946 7.18233C25.1173 7.16464 24.6465 7.29112 24.251 7.54327C24.0944 7.64189 23.9659 7.77517 23.8767 7.93142C23.7876 8.08767 23.7405 8.26212 23.7397 8.43947ZM35.8524 3.83569L31.4305 13.3993H30.0635L31.7344 10.0502L28.8334 3.83569H30.2722L32.3749 8.60521L34.4215 3.83569H35.8524Z" fill="#5F6368" />
                        <path d="M11.6032 5.69636C11.6032 5.31823 11.5719 4.94011 11.508 4.56689H5.91211V6.71164H9.10922C9.04412 7.0525 8.90659 7.37748 8.70487 7.66712C8.50314 7.95676 8.24138 8.20509 7.93525 8.39724V9.78942H9.8449C10.4255 9.26065 10.882 8.62323 11.1849 7.91824C11.4877 7.21326 11.6302 6.45636 11.6032 5.69636Z" fill="#4285F4" />
                        <path d="M5.92023 11.1418C7.36332 11.1791 8.7673 10.6975 9.8465 9.79509L7.93424 8.39554C7.47476 8.67281 6.95416 8.84781 6.41202 8.90724C5.86988 8.96668 5.32047 8.90898 4.80559 8.73853C4.2907 8.56808 3.8239 8.28937 3.44066 7.9236C3.05743 7.55783 2.76787 7.11462 2.59399 6.62769H0.634766V8.06407C1.12503 8.98855 1.87923 9.76621 2.81281 10.3098C3.74638 10.8535 4.82241 11.1416 5.92023 11.1418Z" fill="#34A853" />
                        <path d="M2.59458 6.63744C2.34647 5.94664 2.34647 5.19823 2.59458 4.50742V3.07104H0.635361C0.217672 3.84627 0 4.70323 0 5.57243C0 6.44163 0.217672 7.2986 0.635361 8.07382L2.59458 6.63744Z" fill="#FBBC04" />
                        <path d="M5.92023 2.20568C6.76419 2.19117 7.58003 2.49125 8.1899 3.0405L9.88563 1.45312C8.8044 0.498001 7.37027 -0.0229688 5.88762 0.000777545C4.79631 0.00592903 3.72783 0.295424 2.80065 0.837168C1.87347 1.37891 1.1238 2.15174 0.634766 3.06997L2.59399 4.50757C2.82307 3.84473 3.26718 3.26616 3.86384 2.85325C4.4605 2.44033 5.17969 2.21386 5.92023 2.20568Z" fill="#EA4335" />
                      </svg>
                    </a>
                    <a href="https://www.mastercard.com" target="_blank" rel="noopener noreferrer" aria-label="Mastercard" title="Pay with Mastercard" className={styles.paymentIcon} style={{ backgroundColor: '#fff' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="44" height="21" viewBox="0 0 32 21" fill="none">
                        <path d="M10.026 20.052C15.5633 20.052 20.0521 15.5632 20.0521 10.026C20.0521 4.4888 15.5633 0 10.026 0C4.48881 0 0 4.4888 0 10.026C0 15.5632 4.48881 20.052 10.026 20.052Z" fill="#EB001B" />
                        <path d="M21.4845 20.052C27.0218 20.052 31.5106 15.5632 31.5106 10.026C31.5106 4.4888 27.0218 0 21.4845 0C15.9473 0 11.4585 4.4888 11.4585 10.026C11.4585 15.5632 15.9473 20.052 21.4845 20.052Z" fill="#F79E1B" />
                        <path d="M20.0522 10.0244C20.0522 6.5869 18.3335 3.5791 15.7554 1.86035C13.1772 3.72233 11.4585 6.73013 11.4585 10.0244C11.4585 13.3187 13.1772 16.4697 15.7554 18.1884C18.3335 16.4697 20.0522 13.4619 20.0522 10.0244Z" fill="#FF5F00" />
                      </svg>
                    </a>
                    <a href="https://www.paypal.com" target="_blank" rel="noopener noreferrer" aria-label="PayPal" title="Pay with PayPal" className={styles.paymentIcon} style={{ backgroundColor: '#fff' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 16 20" fill="none">
                        <path d="M14.4048 4.85294C14.6958 3.38235 14.4048 2.35294 13.5317 1.47059C12.6587 0.441176 11.0582 0 9.02117 0H3.05556C2.61905 0 2.32804 0.294118 2.18254 0.735294L0 15.5882C0 15.8824 0.145503 16.1765 0.436508 16.1765H4.36508L4.94709 11.1765L7.56614 7.94118L14.4048 4.85294Z" fill="#003087" />
                        <path d="M14.4049 4.85156L14.1139 5.14568C13.3864 9.26333 10.9128 10.7339 7.42077 10.7339H5.82024C5.38373 10.7339 5.09273 11.028 4.94722 11.4692L4.07421 17.2045L3.7832 18.6751C3.7832 18.9692 3.9287 19.2633 4.21971 19.2633H7.27527C7.71177 19.2633 8.00278 18.9692 8.00278 18.6751V18.528L8.58479 14.9986V14.8516C8.58479 14.5574 9.0213 14.2633 9.3123 14.2633H9.74881C12.8044 14.2633 15.1324 13.0869 15.7144 9.55744C16.0054 8.08686 15.8599 6.91039 15.1324 6.02803C14.9869 5.29274 14.6959 4.99862 14.4049 4.85156Z" fill="#3086C8" />
                        <path d="M13.5314 4.55885C13.3859 4.41179 13.2404 4.41179 13.0949 4.41179C12.9494 4.41179 12.8039 4.41179 12.6584 4.26473C12.2219 4.11768 11.6399 4.11768 11.0579 4.11768H6.69281C6.54731 4.11768 6.4018 4.11768 6.4018 4.26473C6.1108 4.41179 5.9653 4.55885 5.9653 4.85297L4.94678 11.3236V11.4706C4.94678 11.0294 5.38329 10.7353 5.81979 10.7353H7.71133C11.3489 10.7353 13.6769 9.26473 14.4045 5.14709V4.85297C14.2589 4.70591 13.9679 4.55885 13.6769 4.55885H13.5314Z" fill="#012169" />
                      </svg>
                    </a>
                    <a href="https://www.stripe.com" target="_blank" rel="noopener noreferrer" aria-label="Stripe" title="Pay with Stripe" className={styles.paymentIcon} style={{ backgroundColor: '#fff' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="35" viewBox="0 0 56 35" fill="none">
                        <rect x="0.5" y="0.5" width="55" height="34" rx="4.5" fill="#006FCF" stroke="#FFF2F5" />
                        <path d="M14.1199 15.2484L15.2285 17.9354H13.0199L14.1199 15.2484ZM37.144 15.3601H32.8801V16.5447H37.0753V18.3193H32.8887V19.6398H37.1526V20.6983L40.1275 17.4828L37.1526 14.1312L37.144 15.3601ZM17.0017 12.0086H22.7237L23.9941 14.7801L25.1715 12H40.0243L41.5684 13.7044L43.1654 12H49.9874L44.9471 17.5172L49.9358 23H43.0121L41.4681 21.2955L39.8568 23H15.6367L14.9292 21.2955H13.3107L12.6017 23H7L11.7065 12H16.6193L17.0017 12.0086ZM29.4096 13.5526H26.2027L24.0543 18.6172L21.7268 13.5526H18.5443V20.4419L15.5938 13.5526H12.7392L9.32747 21.4474H11.5547L12.2622 19.7429H15.9805L16.688 21.4474H20.5839V15.8113L23.0918 21.456H24.7962L27.2884 15.8285V21.4574H29.3767L29.4111 13.5512L29.4096 13.5526ZM42.7872 17.5172L46.4124 13.5526H43.8027L41.5096 16.0247L39.2924 13.5526H30.8505V21.456H39.1721L41.4839 18.9666L43.701 21.456H46.3866L42.7872 17.5172Z" fill="white" />
                      </svg>
                    </a>
                    <a href="https://www.apple.com/apple-pay" target="_blank" rel="noopener noreferrer" aria-label="Apple Pay" title="Pay with Apple Pay" className={styles.paymentIcon} style={{ backgroundColor: '#fff' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="52" height="17" viewBox="0 0 40 17" fill="none">
                        <path d="M7.30699 2.11508C7.76245 1.54576 8.07128 0.781152 7.98985 0C7.32353 0.0330887 6.51059 0.43956 6.03956 1.00953C5.61687 1.49742 5.24284 2.29382 5.34016 3.04221C6.08822 3.10709 6.83564 2.6685 7.30699 2.11508Z" fill="black" />
                        <path d="M7.98152 3.18868C6.89478 3.1238 5.97154 3.80504 5.45282 3.80504C4.93378 3.80504 4.13933 3.22112 3.27999 3.23702C2.16179 3.25324 1.12436 3.88582 0.556658 4.89145C-0.610531 6.90272 0.248479 9.88719 1.38388 11.5254C1.93503 12.3364 2.5994 13.2285 3.47463 13.1964C4.30185 13.1639 4.62593 12.6611 5.63092 12.6611C6.63558 12.6611 6.92754 13.1964 7.8031 13.1802C8.71077 13.1639 9.27847 12.3692 9.82962 11.5582C10.4622 10.6336 10.7207 9.74154 10.737 9.69288C10.7207 9.67666 8.9865 9.01132 8.97029 7.01626C8.95407 5.34561 10.3321 4.55083 10.397 4.50185C9.61876 3.35088 8.40291 3.22112 7.98119 3.18868" fill="black" />
                        <path d="M18.8119 0.929932C21.1729 0.929932 22.8173 2.55744 22.8173 4.92685C22.8173 7.30469 21.1392 8.94063 18.7529 8.94063H16.1389V13.0981H14.2502V0.929932H18.8119ZM16.1389 7.3553H18.3059C19.9506 7.3553 20.8862 6.47001 20.8862 4.93528C20.8862 3.40088 19.9503 2.5237 18.3143 2.5237H16.1389V7.3553Z" fill="black" />
                        <path d="M23.2863 10.5761C23.2863 9.01608 24.4752 8.12236 26.6675 7.98741L29.02 7.84402V7.16928C29.02 6.1831 28.3709 5.6433 27.2157 5.6433C26.2626 5.6433 25.571 6.13217 25.4283 6.88251H23.7245C23.7754 5.30593 25.2593 4.15918 27.2663 4.15918C29.4249 4.15918 30.8331 5.28906 30.8331 7.04308V13.0973H29.0878V11.6385H29.0456C28.548 12.5913 27.4515 13.1898 26.2626 13.1898C24.5089 13.1898 23.2863 12.1446 23.2863 10.5761ZM29.02 9.79204V9.10886L26.9205 9.24381C25.7397 9.31971 25.1246 9.75798 25.1246 10.5252C25.1246 11.2674 25.7653 11.7482 26.7687 11.7482C28.0501 11.7482 29.02 10.93 29.02 9.79204Z" fill="black" />
                        <path d="M32.4376 16.352V14.8935C32.5557 14.91 32.8421 14.9269 32.9939 14.9269C33.8286 14.9269 34.301 14.5733 34.5877 13.6621L34.7564 13.1226L31.5604 4.2688H33.5334L35.7598 11.4529H35.8019L38.028 4.2688H39.9507L36.6366 13.5693C35.8775 15.7029 35.0091 16.4029 33.1711 16.4029C33.0277 16.4029 32.5638 16.3861 32.4376 16.352Z" fill="black" />
                      </svg>
                    </a>
                    <a href="https://www.klarna.com" target="_blank" rel="noopener noreferrer" aria-label="Klarna" title="Pay with Klarna" className={styles.paymentIcon} style={{ backgroundColor: '#fff' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="35" viewBox="0 0 56 35" fill="none">
                        <rect x="0.5" y="0.5" width="55" height="34" rx="4.5" fill="#5A31F4" stroke="#FFF2F5" />
                        <path d="M20 10H36V25H20Z" fill="white" />
                      </svg>
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>

          {isMobile && (
            <>
              <h3 className={styles.heading} style={{ marginTop: '24px' }}>mettā muse <span style={{ textTransform: 'uppercase' }}>accepts</span></h3>
              <div className={styles.payments}>
                <a href="https://pay.google.com" target="_blank" rel="noopener noreferrer" aria-label="Google Pay" title="Pay with Google Pay" className={styles.paymentIcon} style={{ backgroundColor: '#fff', padding: '5px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="14" viewBox="0 0 36 14" fill="none">
                    <path d="M16.9607 6.54394V10.4725H15.6328V0.773868H19.143C19.5636 0.767167 19.9814 0.838773 20.3725 0.984569C20.7635 1.13037 21.1202 1.34748 21.4218 1.62342C21.7075 1.87435 21.9379 2.17581 22.0997 2.51058C22.2616 2.84535 22.3517 3.20686 22.3651 3.57444C22.3784 3.94203 22.3146 4.30848 22.1774 4.65285C22.0401 4.99723 21.8321 5.31277 21.5653 5.58144L21.4218 5.72385C20.8087 6.27262 19.9895 6.57095 19.143 6.55131L16.9607 6.54394ZM16.9607 1.96226V5.38502H19.1756C19.6673 5.39975 20.1422 5.21928 20.4865 4.88904C20.7328 4.64739 20.8982 4.34292 20.9621 4.0135C21.026 3.68408 20.9856 3.34424 20.8459 3.03626C20.7062 2.72829 20.4734 2.46577 20.1764 2.28136C19.8794 2.09695 19.5314 1.99879 19.1756 1.99909L16.9607 1.96226ZM25.4185 3.61716C26.2663 3.58033 27.096 3.84797 27.7377 4.36973C28.3182 4.89763 28.6273 5.63423 28.5856 6.39417V10.4872H27.3216V9.54684H27.2577C27.031 9.89955 26.7105 10.1905 26.3278 10.391C25.945 10.5914 25.5134 10.6944 25.0754 10.6898C24.3605 10.7116 23.6633 10.4778 23.124 10.0354C22.8685 9.8393 22.6638 9.59104 22.5252 9.30944C22.3867 9.02783 22.318 8.72027 22.3244 8.41001C22.3094 8.09645 22.3741 7.78405 22.5131 7.49877C22.6522 7.21349 22.8617 6.96358 23.124 6.76983C23.7676 6.3342 24.5466 6.11184 25.3389 6.13758C26.0133 6.11303 26.6825 6.25175 27.2825 6.54394V6.28858C27.2869 6.07746 27.2402 5.86815 27.146 5.67652C27.0517 5.48488 26.9124 5.31593 26.7385 5.18245C26.3894 4.8837 25.932 4.72205 25.4602 4.73066C25.1176 4.72762 24.7798 4.80686 24.4787 4.96088C24.1777 5.1149 23.9233 5.33863 23.7397 5.61091L22.5723 4.9185C22.8893 4.49102 23.3172 4.14702 23.8154 3.91923C24.3136 3.69145 24.8655 3.58746 25.4185 3.61716ZM23.7397 8.43947C23.7366 8.59848 23.775 8.75577 23.8517 8.89749C23.9283 9.03922 24.0408 9.16103 24.1793 9.25219C24.4702 9.46826 24.8315 9.58244 25.2033 9.57507C25.7628 9.57384 26.299 9.36637 26.6981 8.99561C27.096 8.64449 27.3216 8.15465 27.3216 7.64148C26.8195 7.30548 26.2093 7.14327 25.5946 7.18233C25.1173 7.16464 24.6465 7.29112 24.251 7.54327C24.0944 7.64189 23.9659 7.77517 23.8767 7.93142C23.7876 8.08767 23.7405 8.26212 23.7397 8.43947ZM35.8524 3.83569L31.4305 13.3993H30.0635L31.7344 10.0502L28.8334 3.83569H30.2722L32.3749 8.60521L34.4215 3.83569H35.8524Z" fill="#5F6368" />
                    <path d="M11.6032 5.69636C11.6032 5.31823 11.5719 4.94011 11.508 4.56689H5.91211V6.71164H9.10922C9.04412 7.0525 8.90659 7.37748 8.70487 7.66712C8.50314 7.95676 8.24138 8.20509 7.93525 8.39724V9.78942H9.8449C10.4255 9.26065 10.882 8.62323 11.1849 7.91824C11.4877 7.21326 11.6302 6.45636 11.6032 5.69636Z" fill="#4285F4" />
                    <path d="M5.92023 11.1418C7.36332 11.1791 8.7673 10.6975 9.8465 9.79509L7.93424 8.39554C7.47476 8.67281 6.95416 8.84781 6.41202 8.90724C5.86988 8.96668 5.32047 8.90898 4.80559 8.73853C4.2907 8.56808 3.8239 8.28937 3.44066 7.9236C3.05743 7.55783 2.76787 7.11462 2.59399 6.62769H0.634766V8.06407C1.12503 8.98855 1.87923 9.76621 2.81281 10.3098C3.74638 10.8535 4.82241 11.1416 5.92023 11.1418Z" fill="#34A853" />
                    <path d="M2.59458 6.63744C2.34647 5.94664 2.34647 5.19823 2.59458 4.50742V3.07104H0.635361C0.217672 3.84627 0 4.70323 0 5.57243C0 6.44163 0.217672 7.2986 0.635361 8.07382L2.59458 6.63744Z" fill="#FBBC04" />
                    <path d="M5.92023 2.20568C6.76419 2.19117 7.58003 2.49125 8.1899 3.0405L9.88563 1.45312C8.8044 0.498001 7.37027 -0.0229688 5.88762 0.000777545C4.79631 0.00592903 3.72783 0.295424 2.80065 0.837168C1.87347 1.37891 1.1238 2.15174 0.634766 3.06997L2.59399 4.50757C2.82307 3.84473 3.26718 3.26616 3.86384 2.85325C4.4605 2.44033 5.17969 2.21386 5.92023 2.20568Z" fill="#EA4335" />
                  </svg>
                </a>
                <a href="https://www.mastercard.com" target="_blank" rel="noopener noreferrer" aria-label="Mastercard" title="Pay with Mastercard" className={styles.paymentIcon} style={{ backgroundColor: '#fff' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="44" height="21" viewBox="0 0 32 21" fill="none">
                    <path d="M10.026 20.052C15.5633 20.052 20.0521 15.5632 20.0521 10.026C20.0521 4.4888 15.5633 0 10.026 0C4.48881 0 0 4.4888 0 10.026C0 15.5632 4.48881 20.052 10.026 20.052Z" fill="#EB001B" />
                    <path d="M21.4845 20.052C27.0218 20.052 31.5106 15.5632 31.5106 10.026C31.5106 4.4888 27.0218 0 21.4845 0C15.9473 0 11.4585 4.4888 11.4585 10.026C11.4585 15.5632 15.9473 20.052 21.4845 20.052Z" fill="#F79E1B" />
                    <path d="M20.0522 10.0244C20.0522 6.5869 18.3335 3.5791 15.7554 1.86035C13.1772 3.72233 11.4585 6.73013 11.4585 10.0244C11.4585 13.3187 13.1772 16.4697 15.7554 18.1884C18.3335 16.4697 20.0522 13.4619 20.0522 10.0244Z" fill="#FF5F00" />
                  </svg>
                </a>
                <a href="https://www.paypal.com" target="_blank" rel="noopener noreferrer" aria-label="PayPal" title="Pay with PayPal" className={styles.paymentIcon} style={{ backgroundColor: '#fff' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 16 20" fill="none">
                    <path d="M14.4048 4.85294C14.6958 3.38235 14.4048 2.35294 13.5317 1.47059C12.6587 0.441176 11.0582 0 9.02117 0H3.05556C2.61905 0 2.32804 0.294118 2.18254 0.735294L0 15.5882C0 15.8824 0.145503 16.1765 0.436508 16.1765H4.36508L4.94709 11.1765L7.56614 7.94118L14.4048 4.85294Z" fill="#003087" />
                    <path d="M14.4049 4.85156L14.1139 5.14568C13.3864 9.26333 10.9128 10.7339 7.42077 10.7339H5.82024C5.38373 10.7339 5.09273 11.028 4.94722 11.4692L4.07421 17.2045L3.7832 18.6751C3.7832 18.9692 3.9287 19.2633 4.21971 19.2633H7.27527C7.71177 19.2633 8.00278 18.9692 8.00278 18.6751V18.528L8.58479 14.9986V14.8516C8.58479 14.5574 9.0213 14.2633 9.3123 14.2633H9.74881C12.8044 14.2633 15.1324 13.0869 15.7144 9.55744C16.0054 8.08686 15.8599 6.91039 15.1324 6.02803C14.9869 5.29274 14.6959 4.99862 14.4049 4.85156Z" fill="#3086C8" />
                    <path d="M13.5314 4.55885C13.3859 4.41179 13.2404 4.41179 13.0949 4.41179C12.9494 4.41179 12.8039 4.41179 12.6584 4.26473C12.2219 4.11768 11.6399 4.11768 11.0579 4.11768H6.69281C6.54731 4.11768 6.4018 4.11768 6.4018 4.26473C6.1108 4.41179 5.9653 4.55885 5.9653 4.85297L4.94678 11.3236V11.4706C4.94678 11.0294 5.38329 10.7353 5.81979 10.7353H7.71133C11.3489 10.7353 13.6769 9.26473 14.4045 5.14709V4.85297C14.2589 4.70591 13.9679 4.55885 13.6769 4.55885H13.5314Z" fill="#012169" />
                  </svg>
                </a>
                <a href="https://www.stripe.com" target="_blank" rel="noopener noreferrer" aria-label="Stripe" title="Pay with Stripe" className={styles.paymentIcon} style={{ backgroundColor: '#fff' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="35" viewBox="0 0 56 35" fill="none">
                    <rect x="0.5" y="0.5" width="55" height="34" rx="4.5" fill="#006FCF" stroke="#FFF2F5" />
                    <path d="M14.1199 15.2484L15.2285 17.9354H13.0199L14.1199 15.2484ZM37.144 15.3601H32.8801V16.5447H37.0753V18.3193H32.8887V19.6398H37.1526V20.6983L40.1275 17.4828L37.1526 14.1312L37.144 15.3601ZM17.0017 12.0086H22.7237L23.9941 14.7801L25.1715 12H40.0243L41.5684 13.7044L43.1654 12H49.9874L44.9471 17.5172L49.9358 23H43.0121L41.4681 21.2955L39.8568 23H15.6367L14.9292 21.2955H13.3107L12.6017 23H7L11.7065 12H16.6193L17.0017 12.0086ZM29.4096 13.5526H26.2027L24.0543 18.6172L21.7268 13.5526H18.5443V20.4419L15.5938 13.5526H12.7392L9.32747 21.4474H11.5547L12.2622 19.7429H15.9805L16.688 21.4474H20.5839V15.8113L23.0918 21.456H24.7962L27.2884 15.8285V21.4574H29.3767L29.4111 13.5512L29.4096 13.5526ZM42.7872 17.5172L46.4124 13.5526H43.8027L41.5096 16.0247L39.2924 13.5526H30.8505V21.456H39.1721L41.4839 18.9666L43.701 21.456H46.3866L42.7872 17.5172Z" fill="white" />
                  </svg>
                </a>
                <a href="https://www.apple.com/apple-pay" target="_blank" rel="noopener noreferrer" aria-label="Apple Pay" title="Pay with Apple Pay" className={styles.paymentIcon} style={{ backgroundColor: '#fff' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="52" height="17" viewBox="0 0 40 17" fill="none">
                    <path d="M7.30699 2.11508C7.76245 1.54576 8.07128 0.781152 7.98985 0C7.32353 0.0330887 6.51059 0.43956 6.03956 1.00953C5.61687 1.49742 5.24284 2.29382 5.34016 3.04221C6.08822 3.10709 6.83564 2.6685 7.30699 2.11508Z" fill="black" />
                    <path d="M7.98152 3.18868C6.89478 3.1238 5.97154 3.80504 5.45282 3.80504C4.93378 3.80504 4.13933 3.22112 3.27999 3.23702C2.16179 3.25324 1.12436 3.88582 0.556658 4.89145C-0.610531 6.90272 0.248479 9.88719 1.38388 11.5254C1.93503 12.3364 2.5994 13.2285 3.47463 13.1964C4.30185 13.1639 4.62593 12.6611 5.63092 12.6611C6.63558 12.6611 6.92754 13.1964 7.8031 13.1802C8.71077 13.1639 9.27847 12.3692 9.82962 11.5582C10.4622 10.6336 10.7207 9.74154 10.737 9.69288C10.7207 9.67666 8.9865 9.01132 8.97029 7.01626C8.95407 5.34561 10.3321 4.55083 10.397 4.50185C9.61876 3.35088 8.40291 3.22112 7.98119 3.18868" fill="black" />
                    <path d="M18.8119 0.929932C21.1729 0.929932 22.8173 2.55744 22.8173 4.92685C22.8173 7.30469 21.1392 8.94063 18.7529 8.94063H16.1389V13.0981H14.2502V0.929932H18.8119ZM16.1389 7.3553H18.3059C19.9506 7.3553 20.8862 6.47001 20.8862 4.93528C20.8862 3.40088 19.9503 2.5237 18.3143 2.5237H16.1389V7.3553Z" fill="black" />
                    <path d="M23.2863 10.5761C23.2863 9.01608 24.4752 8.12236 26.6675 7.98741L29.02 7.84402V7.16928C29.02 6.1831 28.3709 5.6433 27.2157 5.6433C26.2626 5.6433 25.571 6.13217 25.4283 6.88251H23.7245C23.7754 5.30593 25.2593 4.15918 27.2663 4.15918C29.4249 4.15918 30.8331 5.28906 30.8331 7.04308V13.0973H29.0878V11.6385H29.0456C28.548 12.5913 27.4515 13.1898 26.2626 13.1898C24.5089 13.1898 23.2863 12.1446 23.2863 10.5761ZM29.02 9.79204V9.10886L26.9205 9.24381C25.7397 9.31971 25.1246 9.75798 25.1246 10.5252C25.1246 11.2674 25.7653 11.7482 26.7687 11.7482C28.0501 11.7482 29.02 10.93 29.02 9.79204Z" fill="black" />
                    <path d="M32.4376 16.352V14.8935C32.5557 14.91 32.8421 14.9269 32.9939 14.9269C33.8286 14.9269 34.301 14.5733 34.5877 13.6621L34.7564 13.1226L31.5604 4.2688H33.5334L35.7598 11.4529H35.8019L38.028 4.2688H39.9507L36.6366 13.5693C35.8775 15.7029 35.0091 16.4029 33.1711 16.4029C33.0277 16.4029 32.5638 16.3861 32.4376 16.352Z" fill="black" />
                  </svg>
                </a>
                <a href="https://www.klarna.com" target="_blank" rel="noopener noreferrer" aria-label="Klarna" title="Pay with Klarna" className={styles.paymentIcon} style={{ backgroundColor: '#fff' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="56" height="35" viewBox="0 0 56 35" fill="none">
                    <rect x="0.5" y="0.5" width="55" height="34" rx="4.5" fill="#5A31F4" stroke="#FFF2F5" />
                    <path d="M31.7339 13.7454C31.7339 16.1344 30.0481 17.8389 27.6934 17.8389H25.4748C25.4382 17.8394 25.4025 17.8505 25.372 17.8708C25.3415 17.8912 25.3175 17.9198 25.3029 17.9534C25.2935 17.9757 25.2887 17.9995 25.2886 18.0236V21.1632C25.2886 21.1876 25.2838 21.2117 25.2744 21.2342C25.265 21.2568 25.2513 21.2772 25.234 21.2944C25.2167 21.3115 25.1961 21.3251 25.1735 21.3343C25.151 21.3435 25.1268 21.3482 25.1024 21.348H23.5498C23.5004 21.348 23.453 21.3284 23.4181 21.2934C23.3832 21.2585 23.3636 21.2112 23.3636 21.1618V9.83954C23.363 9.80265 23.3737 9.76645 23.3941 9.73575C23.4146 9.70506 23.4439 9.68131 23.4782 9.66766C23.5009 9.65817 23.5252 9.6533 23.5498 9.65334H27.7034C30.0481 9.65334 31.7339 11.3563 31.7339 13.7454ZM29.7974 13.7454C29.7974 12.3733 28.855 11.3707 27.5774 11.3707H25.4748C25.4503 11.3707 25.4261 11.3755 25.4035 11.3848C25.3809 11.3942 25.3604 11.4079 25.3431 11.4252C25.3258 11.4425 25.3121 11.463 25.3028 11.4856C25.2934 11.5082 25.2886 11.5324 25.2886 11.5568V15.9253C25.2883 15.9498 25.293 15.9741 25.3024 15.9968C25.3117 16.0194 25.3255 16.0399 25.343 16.0571C25.3603 16.0744 25.3808 16.0882 25.4034 16.0975C25.4261 16.1069 25.4503 16.1116 25.4748 16.1115H27.5774C28.855 16.1187 29.7974 15.1161 29.7974 13.7454ZM32.1951 19.1752C32.1787 18.8082 32.2551 18.4431 32.417 18.1134C32.579 17.7837 32.8214 17.5002 33.1218 17.2889C33.7277 16.8363 34.6744 16.6014 36.0652 16.5527L37.5447 16.5011V16.0671C37.5447 15.1977 36.9575 14.8311 36.015 14.8311C35.0726 14.8311 34.4753 15.1619 34.3392 15.7048C34.3276 15.7429 34.3038 15.7762 34.2715 15.7994C34.2391 15.8227 34.2 15.8348 34.1602 15.8337H32.6964C32.6561 15.8342 32.6167 15.8216 32.5842 15.7979C32.5517 15.7741 32.5277 15.7404 32.5159 15.7019C32.5082 15.6764 32.5062 15.6495 32.5102 15.6231C32.7279 14.3369 33.805 13.3601 36.0823 13.3601C38.5058 13.3601 39.3809 14.4816 39.3809 16.62V21.1632C39.3807 21.1878 39.3757 21.2121 39.3661 21.2347C39.3564 21.2573 39.3424 21.2778 39.3249 21.295C39.3073 21.3121 39.2865 21.3257 39.2636 21.3348C39.2408 21.3439 39.2164 21.3483 39.1918 21.348H37.7166C37.6672 21.348 37.6198 21.3284 37.5849 21.2934C37.55 21.2585 37.5304 21.2112 37.5304 21.1618V20.8238C37.5309 20.7957 37.5227 20.7682 37.5071 20.7449C37.4915 20.7216 37.4691 20.7036 37.443 20.6934C37.4172 20.6832 37.3889 20.6808 37.3617 20.6864C37.3345 20.692 37.3095 20.7054 37.2898 20.7249C36.8458 21.2033 36.1325 21.5485 34.9881 21.5485C33.3051 21.5485 32.1951 20.6791 32.1951 19.1752ZM37.5447 18.1912V17.8389L35.6269 17.9391C34.6171 17.9907 34.0299 18.406 34.0299 19.1079C34.0299 19.7438 34.5684 20.0961 35.5109 20.0961C36.7899 20.0961 37.5447 19.4087 37.5447 18.1912ZM40.8619 24.7797V23.4635C40.8623 23.4359 40.8687 23.4087 40.8809 23.3839C40.893 23.3592 40.9105 23.3374 40.9321 23.3202C40.9535 23.3029 40.9784 23.2905 41.0051 23.2838C41.0319 23.2771 41.0597 23.2763 41.0868 23.2816C41.3131 23.3231 41.5422 23.3446 41.7728 23.3446C42.1678 23.3662 42.5586 23.2542 42.8821 23.0266C43.2056 22.7989 43.443 22.469 43.556 22.0899L43.652 21.7877C43.6663 21.7469 43.6663 21.7024 43.652 21.6616L40.5797 13.8256C40.5619 13.7826 40.5609 13.7345 40.5768 13.6907C40.5927 13.647 40.6244 13.6108 40.6657 13.5893C40.693 13.5748 40.7235 13.5675 40.7545 13.5678H42.2441C42.2823 13.5679 42.3196 13.5796 42.351 13.6013C42.3825 13.623 42.4066 13.6538 42.4202 13.6895L44.5056 19.2167C44.5185 19.2538 44.5428 19.286 44.5749 19.3086C44.607 19.3312 44.6454 19.3431 44.6847 19.3428C44.7239 19.3427 44.7621 19.3306 44.7941 19.308C44.8262 19.2855 44.8505 19.2536 44.8637 19.2167L46.6756 13.7053C46.6878 13.6673 46.712 13.6342 46.7445 13.611C46.777 13.5878 46.8161 13.5757 46.856 13.5764H48.3972C48.4434 13.5766 48.488 13.5936 48.5228 13.6241C48.5575 13.6547 48.58 13.6967 48.5862 13.7425C48.5897 13.7731 48.5858 13.804 48.5748 13.8328L45.2877 22.5353C44.5314 24.5592 43.2352 25.0748 41.8072 25.0748C41.5362 25.0823 41.2656 25.0504 41.0037 24.9802C40.9598 24.9695 40.9212 24.9433 40.8949 24.9065C40.8686 24.8697 40.8579 24.8248 40.8619 24.7797ZM13.3834 9.00021C11.429 8.98561 9.54258 9.71652 8.10825 11.0441C8.04722 11.0996 8.00912 11.1759 8.00144 11.258C7.99375 11.3402 8.01704 11.4222 8.06672 11.4881L8.95187 12.6898C8.98055 12.7303 9.01781 12.764 9.06099 12.7885C9.10416 12.813 9.15221 12.8277 9.20171 12.8315C9.2512 12.8353 9.30093 12.8282 9.34736 12.8107C9.3938 12.7931 9.43579 12.7655 9.47036 12.7299C9.98588 12.218 10.5981 11.8138 11.2714 11.5408C11.9447 11.2679 12.6655 11.1316 13.392 11.1401C16.4284 11.1401 18.014 13.4088 18.014 15.6518C18.014 18.0866 16.3482 19.8025 13.9534 19.8355C12.1029 19.8355 10.7079 18.618 10.7079 17.0081C10.7094 16.601 10.802 16.1995 10.9786 15.8327C11.1553 15.466 11.4117 15.1433 11.7291 14.8883C11.7967 14.8329 11.8396 14.753 11.8484 14.6661C11.8573 14.5791 11.8314 14.4922 11.7764 14.4243L10.8454 13.257C10.8173 13.2211 10.7822 13.1913 10.7422 13.1693C10.7023 13.1473 10.6583 13.1336 10.613 13.1291C10.5676 13.1245 10.5218 13.1292 10.4783 13.1428C10.4348 13.1564 10.3945 13.1787 10.3598 13.2083C9.78962 13.6657 9.32868 14.2445 9.0106 14.9027C8.69365 15.5593 8.52867 16.279 8.52791 17.0081C8.52791 19.7796 10.8984 21.9524 13.9348 21.9696H13.9778C17.5829 21.9237 20.1896 19.2711 20.1896 15.646C20.1896 12.4277 17.802 9.00021 13.3834 9.00021Z" fill="white" />
                  </svg>
                </a>
              </div>
            </>
          )}
        </div>

        <div className={styles.copyright}>
          <p>{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}

