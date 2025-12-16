"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "hi";

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    shop: "SHOP",
    skills: "SKILLS",
    stories: "STORIES",
    about: "ABOUT",
    contact: "CONTACT US",
    search: "Search",
    wishlist: "Wishlist",
    bag: "Bag",
    account: "Account",
    signIn: "Sign In",
    signOut: "Sign Out",
    language: "Language",
    recommended: "RECOMMENDED",
    newest: "NEWEST",
    popular: "POPULAR",
    priceLowHigh: "PRICE : LOW TO HIGH",
    priceHighLow: "PRICE : HIGH TO LOW",
    hideFilter: "HIDE FILTER",
    showFilter: "SHOW FILTER",
    items: "ITEMS",
    loading: "LOADING...",
    addToCart: "ADD TO CART",
    addToWishlist: "Add to Wishlist",
    removeFromWishlist: "Remove from Wishlist",
    quantity: "Quantity",
    price: "Price",
    rating: "Rating",
    description: "Description",
    yourCartIsEmpty: "Your cart is empty",
    yourWishlistIsEmpty: "Your wishlist is empty",
    proceedToCheckout: "PROCEED TO CHECKOUT",
    signInToViewCart: "Sign in to view your cart",
    signInToViewWishlist: "Sign in to view your wishlist",
    customizable: "CUSTOMIZABLE",
    idealFor: "IDEAL FOR",
    occasion: "OCCASION",
    work: "WORK",
    fabric: "FABRIC",
    priceRange: "PRICE",
    reviews: "reviews",
    noDescriptionAvailable: "No description available",
    signInOrCreateAccount: "or Create an account to see pricing",
    remove: "Remove",
    total: "Total",
    underPrice50: "Under $50",
    price50To100: "$50 - $100",
    price100To200: "$100 - $200",
    overPrice200: "Over $200",
    addedToCart: "Added to cart",
    addedToWishlist: "Added to wishlist",
    removedFromWishlist: "Removed from wishlist",
    removedFromCart: "Removed from cart",
    signedOutSuccessfully: "Signed out successfully",
    signedInSuccessfully: "Signed in successfully!",
    signInFailed: "Sign in failed",
    signUpFailed: "Sign up failed",
    emailPasswordRequired: "Email and password are required",
    allFieldsRequired: "All fields are required",
    passwordsDoNotMatch: "Passwords do not match",
    passwordTooShort: "Password must be at least 6 characters",
    accountCreated: "Account created successfully!",
    close: "Close",
    fullName: "Full Name",
    fullNamePlaceholder: "Enter your full name",
    email: "Email",
    emailPlaceholder: "Enter your email",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    confirmPassword: "Confirm Password",
    confirmPasswordPlaceholder: "Confirm your password",
    creatingAccount: "Creating account...",
    signingIn: "Signing in...",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    createOne: "Create one",
    beTheFirstToKnow: "BE THE FIRST TO KNOW",
    signUpForUpdates: "Sign up for updates from mettā muse.",
    subscribe: "SUBSCRIBE",
    subscribing: "SUBSCRIBING",
    contactUs: "CONTACT US",
    currency: "CURRENCY",
    currencyNote: "Transactions will be completed in Euros and a currency reference is available on hover.",
    aboutUs: "About Us",
    footerStories: "Stories",
    artisans: "Artisans",
    boutiques: "Boutiques",
    quickLinks: "QUICK LINKS",
    ordersShipping: "Orders & Shipping",
    joinSeller: "Join/Login as a Seller",
    paymentPricing: "Payment & Pricing",
    returnRefunds: "Return & Refunds",
    faqs: "FAQs",
    privacyPolicy: "Privacy Policy",
    termsConditions: "Terms & Conditions",
    followUs: "FOLLOW US",
    accepts: "ACCEPTS",
    discoverOurProducts: "DISCOVER OUR PRODUCTS",
    heroSubtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageNotAvailable: "Image not available",
    copyright: "Copyright © 2023 mettamuse. All rights reserved.",
    promoBanner: "Free shipping on curated picks",
    unselectAll: "Unselect all",
    aboutTitle: "About our curated product collection",
    aboutBody: "We bring together a carefully selected range of fashion, accessories, and lifestyle products. Every item is chosen for quality, usability, and timeless design so that you can discover pieces that match your everyday life.",
    contactTitle: "Contact our team",
    contactBody: "Have a question about products, orders, or partnerships? Reach our support team at customercare@mettamuse.com or call +44 221 133 5360. We are here to help on business days and aim to respond within one working day.",
  },
  hi: {
    shop: "दुकान",
    skills: "कौशल",
    stories: "कहानियां",
    about: "हमारे बारे में",
    contact: "संपर्क करें",
    search: "खोज",
    wishlist: "विशलिस्ट",
    bag: "बैग",
    account: "खाता",
    signIn: "साइन इन करें",
    signOut: "साइन आउट करें",
    language: "भाषा",
    recommended: "अनुशंसित",
    newest: "नवीनतम",
    popular: "लोकप्रिय",
    priceLowHigh: "कीमत : कम से अधिक",
    priceHighLow: "कीमत : अधिक से कम",
    hideFilter: "फ़िल्टर छुपाएं",
    showFilter: "फ़िल्टर दिखाएं",
    items: "आइटम",
    loading: "लोड हो रहा है...",
    addToCart: "कार्ट में जोड़ें",
    addToWishlist: "विशलिस्ट में जोड़ें",
    removeFromWishlist: "विशलिस्ट से हटाएं",
    quantity: "मात्रा",
    price: "कीमत",
    rating: "रेटिंग",
    description: "विवरण",
    yourCartIsEmpty: "आपकी कार्ट खाली है",
    yourWishlistIsEmpty: "आपकी विशलिस्ट खाली है",
    proceedToCheckout: "चेकआउट के लिए आगे बढ़ें",
    signInToViewCart: "अपनी कार्ट देखने के लिए साइन इन करें",
    signInToViewWishlist: "अपनी विशलिस्ट देखने के लिए साइन इन करें",
    customizable: "अनुकूलन योग्य",
    idealFor: "के लिए आदर्श",
    occasion: "अवसर",
    work: "काम",
    fabric: "कपड़ा",
    priceRange: "कीमत",
    reviews: "समीक्षाएं",
    noDescriptionAvailable: "कोई विवरण उपलब्ध नहीं है",
    signInOrCreateAccount: "कीमत देखने के लिए साइन इन करें या खाता बनाएं",
    remove: "हटाएं",
    total: "कुल",
    underPrice50: "$50 से कम",
    price50To100: "$50 - $100",
    price100To200: "$100 - $200",
    overPrice200: "$200 से अधिक",
    addedToCart: "कार्ट में जोड़ा गया",
    addedToWishlist: "विशलिस्ट में जोड़ा गया",
    removedFromWishlist: "विशलिस्ट से हटाया गया",
    removedFromCart: "कार्ट से हटाया गया",
    signedOutSuccessfully: "सफलतापूर्वक साइन आउट हो गए",
    signedInSuccessfully: "सफलतापूर्वक साइन इन हो गया!",
    signInFailed: "साइन इन विफल रहा",
    signUpFailed: "साइन अप विफल रहा",
    emailPasswordRequired: "ईमेल और पासवर्ड आवश्यक हैं",
    allFieldsRequired: "सभी फ़ील्ड अनिवार्य हैं",
    passwordsDoNotMatch: "पासवर्ड मेल नहीं खाते",
    passwordTooShort: "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए",
    accountCreated: "खाता सफलतापूर्वक बनाया गया!",
    close: "बंद करें",
    fullName: "पूरा नाम",
    fullNamePlaceholder: "अपना पूरा नाम दर्ज करें",
    email: "ईमेल",
    emailPlaceholder: "अपना ईमेल दर्ज करें",
    password: "पासवर्ड",
    passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    confirmPasswordPlaceholder: "अपने पासवर्ड की पुष्टि करें",
    creatingAccount: "खाता बनाया जा रहा है...",
    signingIn: "साइन इन किया जा रहा है...",
    alreadyHaveAccount: "पहले से खाता है?",
    dontHaveAccount: "खाता नहीं है?",
    createOne: "एक बनाएं",
    beTheFirstToKnow: "पहले जानने वाले बनें",
    signUpForUpdates: "mettā muse से अपडेट के लिए साइन अप करें।",
    subscribe: "सदस्यता लें",
    subscribing: "सदस्यता ली जा रही है...",
    contactUs: "हमसे संपर्क करें",
    currency: "मुद्रा",
    currencyNote: "लेनदेन यूरो में पूरा किया जाएगा और मुद्रा संदर्भ होवर पर उपलब्ध है।",
    aboutUs: "हमारे बारे में",
    footerStories: "कहानियां",
    artisans: "कारीगर",
    boutiques: "बुटीक",
    quickLinks: "त्वरित लिंक",
    ordersShipping: "ऑर्डर और शिपिंग",
    joinSeller: "विक्रेता के रूप में शामिल हों/लॉगिन करें",
    paymentPricing: "भुगतान और मूल्य निर्धारण",
    returnRefunds: "रिटर्न और रिफंड",
    faqs: "अक्सर पूछे जाने वाले प्रश्न",
    privacyPolicy: "गोपनीयता नीति",
    termsConditions: "शर्तें और शर्तें",
    followUs: "हमें फॉलो करें",
    accepts: "स्वीकार करता है",
    discoverOurProducts: "हमारे उत्पादों की खोज करें",
    heroSubtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageNotAvailable: "छवि उपलब्ध नहीं है",
    copyright: "कॉपीराइट © 2023 mettamuse। सर्वाधिकार सुरक्षित।",
    promoBanner: "चुने हुए उत्पादों पर निःशुल्क डिलीवरी",
    unselectAll: "सभी को निरस्त करें",
    aboutTitle: "हमारे चयनित उत्पाद संग्रह के बारे में",
    aboutBody: "हम फैशन, एक्सेसरीज़ और लाइफस्टाइल उत्पादों की सावधानी से चुनी गई श्रृंखला लाते हैं। हर वस्तु गुणवत्ता, उपयोगिता और सदाबहार डिजाइन के लिए चुनी जाती है ताकि आप अपने दैनिक जीवन से मेल खाने वाले विकल्प पा सकें।",
    contactTitle: "हमारी टीम से संपर्क करें",
    contactBody: "उत्पाद, ऑर्डर या साझेदारी से संबंधित प्रश्न हैं? customercare@mettamuse.com पर लिखें या +44 221 133 5360 पर कॉल करें। हम कार्यदिवसों में मदद के लिए उपलब्ध हैं और एक कार्यदिवस में उत्तर देने का लक्ष्य रखते हैं।",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "hi")) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    window.dispatchEvent(new CustomEvent("languageChanged", { detail: { language: lang } }));
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations["en"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
