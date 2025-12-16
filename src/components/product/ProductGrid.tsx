"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./ProductGrid.module.css";
import ProductCard from "./ProductCard";
import { useLanguage } from "@/context/LanguageContext";
import { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const { t } = useLanguage();
  const [allProducts, setAllProducts] = useState<Product[]>(products);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [loading, setLoading] = useState(products.length === 0);
  const [showFilter, setShowFilter] = useState(true);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortValue, setSortValue] = useState("recommended");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const [isClient, setIsClient] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({
    customizable: false,
    idealFor: false,
    occasion: false,
    work: false,
    fabric: false,
    price: false,
  });
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: Set<string> }>({
    customizable: new Set(),
    idealFor: new Set(),
    occasion: new Set(),
    work: new Set(),
    fabric: new Set(),
    price: new Set(),
  });

  const priceRangeOptions = useMemo(
    () => [
      { value: "under-50", label: t("underPrice50"), match: (price: number) => price < 50 },
      { value: "50-100", label: t("price50To100"), match: (price: number) => price >= 50 && price <= 100 },
      { value: "100-200", label: t("price100To200"), match: (price: number) => price > 100 && price <= 200 },
      { value: "over-200", label: t("overPrice200"), match: (price: number) => price > 200 },
    ],
    [t]
  );

  useEffect(() => {
    setAllProducts(products);
    setFilteredProducts(products);
    setLoading(false);
  }, [products]);

  useEffect(() => {
    const handleSearch = (event: Event) => {
      const customEvent = event as CustomEvent;
      setSearchQuery(customEvent.detail.query);
    };

    window.addEventListener("productSearch", handleSearch);
    return () => window.removeEventListener("productSearch", handleSearch);
  }, []);

  useEffect(() => {
    setIsClient(true);
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth <= 480);
    };

    checkMobileView();
    window.addEventListener("resize", checkMobileView);
    return () => window.removeEventListener("resize", checkMobileView);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }
    };

    if (sortOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [sortOpen]);

  useEffect(() => {
    const handleClickOutsideFilter = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        const hideFilterBtn = document.querySelector(`.${styles.hideFilterBtn}`);
        if (hideFilterBtn && !hideFilterBtn.contains(event.target as Node)) {
          setMobileFilterOpen(false);
        }
      }
    };

    if (mobileFilterOpen) {
      document.addEventListener("mousedown", handleClickOutsideFilter);
      return () => document.removeEventListener("mousedown", handleClickOutsideFilter);
    }
  }, [mobileFilterOpen]);

  useEffect(() => {
    let filtered = allProducts;

    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (checkedItems.customizable.size > 0) {
      filtered = filtered.filter((product) =>
        product.customizable === true
      );
    }

    if (checkedItems.fabric.size > 0) {
      filtered = filtered.filter((product) =>
        Array.from(checkedItems.fabric).some((fabric) =>
          product.category?.toLowerCase().includes(fabric.toLowerCase())
        )
      );
    }

    if (checkedItems.price.size > 0) {
      filtered = filtered.filter((product) => {
        if (!product.price) return false;
        return Array.from(checkedItems.price).some((selectedRange) => {
          const option = priceRangeOptions.find((range) => range.value === selectedRange);
          return option ? option.match(product.price!) : false;
        });
      });
    }

    // Apply sorting
    const sorted = [...filtered];
    switch (sortValue) {
      case "newest":
        sorted.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case "popular":
        sorted.sort((a, b) => (b.rating?.count || 0) - (a.rating?.count || 0));
        break;
      case "price-low-high":
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high-low":
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "recommended":
      default:
        sorted.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
        break;
    }

    setFilteredProducts(sorted);

    // Auto-scroll to ProductGrid when filters, search, or sorting change
    if (gridRef.current && (searchQuery || Object.values(checkedItems).some(set => set.size > 0) || sortValue !== "recommended")) {
      setTimeout(() => {
        gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [checkedItems, allProducts, sortValue, searchQuery, priceRangeOptions]);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const handleCheckboxChange = (groupName: string, itemName: string, isChecked: boolean) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev[groupName]);
      if (isChecked) {
        newSet.add(itemName);
      } else {
        newSet.delete(itemName);
      }
      return {
        ...prev,
        [groupName]: newSet,
      };
    });
  };

  const unselectAll = (groupName: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [groupName]: new Set(),
    }));
  };

  const sortOptions = [
    { value: "recommended", label: t("recommended") },
    { value: "newest", label: t("newest") },
    { value: "popular", label: t("popular") },
    { value: "price-high-low", label: t("priceHighLow") },
    { value: "price-low-high", label: t("priceLowHigh") },
  ];

  const handleSortChange = (value: string) => {
    setSortValue(value);
    setSortOpen(false);
  };

  return (
    <section className={styles.section} ref={gridRef}>
      <div className={styles.container}>
        <div className={styles.topControls}>
          <div className={styles.leftControls}>
            <span className={styles.itemCount}>{loading ? t("loading") : `${filteredProducts.length} ${t("items")}`}</span>
            {isClient && isMobileView ? (
              <button
                type="button"
                className={styles.hideFilterBtn}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMobileFilterOpen(!mobileFilterOpen);
                }}
                aria-label="Toggle filter"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={showFilter ? styles.chevronLeft : styles.chevronRight}>
                  <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className={styles.filterText}>{showFilter ? t("hideFilter") : t("showFilter")}</span>
                <span className={styles.filterTextMobile}>FILTER</span>
              </button>
            ) : isClient ? (
              <button
                type="button"
                className={styles.hideFilterBtn}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFilter();
                }}
                aria-label="Toggle filter"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={showFilter ? styles.chevronLeft : styles.chevronRight}>
                  <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className={styles.filterText}>{showFilter ? t("hideFilter") : t("showFilter")}</span>
                <span className={styles.filterTextMobile}>FILTER</span>
              </button>
            ) : null}
          </div>
          <div className={styles.rightControls}>
            <div className={styles.sortWrapper} ref={sortDropdownRef}>
              <button
                className={styles.sortButton}
                aria-label="Sort products"
                onClick={() => setSortOpen(!sortOpen)}
              >
                {sortOptions.find(opt => opt.value === sortValue)?.label || "RECOMMENDED"}

                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className={sortOpen ? styles.chevronOpen : ""}>
                  <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
              {sortOpen && (
                <div className={styles.sortDropdown} onClick={() => setSortOpen(false)}>
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      className={styles.sortOption}
                      onClick={() => handleSortChange(option.value)}
                    >
                      {sortValue === option.value && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                          <path d="M10.1301 15.3967L18.5965 6.93041C18.8596 6.66734 19.1944 6.5358 19.601 6.5358C20.0075 6.5358 20.3424 6.66734 20.6054 6.93041C20.8685 7.19349 21.0001 7.52832 21.0001 7.93489C21.0001 8.34147 20.8685 8.6763 20.6054 8.93937L11.1346 18.4102C10.8476 18.6972 10.5128 18.8407 10.1301 18.8407C9.74749 18.8407 9.41266 18.6972 9.12567 18.4102L5.39474 14.6793C5.13166 14.4162 5.00012 14.0814 5.00012 13.6748C5.00012 13.2682 5.13166 12.9334 5.39474 12.6703C5.65782 12.4072 5.99264 12.2757 6.39922 12.2757C6.80579 12.2757 7.14062 12.4072 7.4037 12.6703L10.1301 15.3967Z" fill="#292D32" />
                        </svg>
                      )}
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {isClient && mobileFilterOpen && (
          <div className={styles.mobileFilterDropdown} ref={filterDropdownRef}>
            <div className={styles.mobileFilterContent}>
              <button
                className={styles.mobileFilterClose}
                onClick={() => setMobileFilterOpen(false)}
                aria-label="Close filter"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <label className={`${styles.filterLabel} ${styles.filterGroupHeader}`} style={{ color: "black", fontSize: "16px", padding: "12px 16px" }}>
                <input
                  type="checkbox"
                  checked={checkedItems.customizable.has("Yes")}
                  onChange={(e) => handleCheckboxChange("customizable", "Yes", e.target.checked)}
                />
                <span>{t("customizable")}</span>
              </label>

              <div className={styles.filterGroup} style={{ padding: "0 16px" }}>
                <button
                  className={`${styles.filterGroupHeader} ${expandedGroups.idealFor ? styles.expanded : ""}`}
                  onClick={() => toggleGroup("idealFor")}
                  aria-expanded={expandedGroups.idealFor}
                >
                  <span>{t("idealFor")}</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 4L6 9L11 4" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
                {expandedGroups.idealFor && (
                  <div className={styles.filterOptions}>
                    {checkedItems.idealFor.size > 0 && (
                      <button
                        className={styles.unselectAllBtn}
                        onClick={() => unselectAll("idealFor")}
                      >
                        {t("unselectAll")}
                      </button>
                    )}
                    <label className={styles.filterLabel}>
                      <input
                        type="checkbox"
                        checked={checkedItems.idealFor.has("Men")}
                        onChange={(e) => handleCheckboxChange("idealFor", "Men", e.target.checked)}
                      />
                      <span>Men</span>
                    </label>
                    <label className={styles.filterLabel}>
                      <input
                        type="checkbox"
                        checked={checkedItems.idealFor.has("Women")}
                        onChange={(e) => handleCheckboxChange("idealFor", "Women", e.target.checked)}
                      />
                      <span>Women</span>
                    </label>
                    <label className={styles.filterLabel}>
                      <input
                        type="checkbox"
                        checked={checkedItems.idealFor.has("Unisex")}
                        onChange={(e) => handleCheckboxChange("idealFor", "Unisex", e.target.checked)}
                      />
                      <span>Unisex</span>
                    </label>
                  </div>
                )}
              </div>

              <div className={styles.filterGroup} style={{ padding: "0 16px" }}>
                <button
                  className={`${styles.filterGroupHeader} ${expandedGroups.occasion ? styles.expanded : ""}`}
                  onClick={() => toggleGroup("occasion")}
                  aria-expanded={expandedGroups.occasion}
                >
                  <span>{t("occasion")}</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 4L6 9L11 4" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
                {expandedGroups.occasion && (
                  <div className={styles.filterOptions}>
                    {checkedItems.occasion.size > 0 && (
                      <button
                        className={styles.unselectAllBtn}
                        onClick={() => unselectAll("occasion")}
                      >
                        {t("unselectAll")}
                      </button>
                    )}
                    <label className={styles.filterLabel}>
                      <input
                        type="checkbox"
                        checked={checkedItems.occasion.has("Casual")}
                        onChange={(e) => handleCheckboxChange("occasion", "Casual", e.target.checked)}
                      />
                      <span>Casual</span>
                    </label>
                    <label className={styles.filterLabel}>
                      <input
                        type="checkbox"
                        checked={checkedItems.occasion.has("Formal")}
                        onChange={(e) => handleCheckboxChange("occasion", "Formal", e.target.checked)}
                      />
                      <span>Formal</span>
                    </label>
                    <label className={styles.filterLabel}>
                      <input
                        type="checkbox"
                        checked={checkedItems.occasion.has("Party")}
                        onChange={(e) => handleCheckboxChange("occasion", "Party", e.target.checked)}
                      />
                      <span>Party</span>
                    </label>
                  </div>
                )}
              </div>

              <div className={styles.filterGroup} style={{ padding: "0 16px" }}>
                <button
                  className={`${styles.filterGroupHeader} ${expandedGroups.work ? styles.expanded : ""}`}
                  onClick={() => toggleGroup("work")}
                  aria-expanded={expandedGroups.work}
                >
                  <span>{t("work")}</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 4L6 9L11 4" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
                {expandedGroups.work && (
                  <div className={styles.filterOptions}>
                    {checkedItems.work.size > 0 && (
                      <button
                        className={styles.unselectAllBtn}
                        onClick={() => unselectAll("work")}
                      >
                        {t("unselectAll")}
                      </button>
                    )}
                    <label className={styles.filterLabel}>
                      <input
                        type="checkbox"
                        checked={checkedItems.work.has("Office")}
                        onChange={(e) => handleCheckboxChange("work", "Office", e.target.checked)}
                      />
                      <span>Office</span>
                    </label>
                    <label className={styles.filterLabel}>
                      <input
                        type="checkbox"
                        checked={checkedItems.work.has("Travel")}
                        onChange={(e) => handleCheckboxChange("work", "Travel", e.target.checked)}
                      />
                      <span>Travel</span>
                    </label>
                    <label className={styles.filterLabel}>
                      <input
                        type="checkbox"
                        checked={checkedItems.work.has("Gym")}
                        onChange={(e) => handleCheckboxChange("work", "Gym", e.target.checked)}
                      />
                      <span>Gym</span>
                    </label>
                  </div>
                )}
              </div>

              <div className={styles.filterGroup} style={{ padding: "0 16px" }}>
                <button
                  className={`${styles.filterGroupHeader} ${expandedGroups.fabric ? styles.expanded : ""}`}
                  onClick={() => toggleGroup("fabric")}
                  aria-expanded={expandedGroups.fabric}
                >
                  <span>{t("fabric")}</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 4L6 9L11 4" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
                {expandedGroups.fabric && (
                  <div className={styles.filterOptions}>
                    {checkedItems.fabric.size > 0 && (
                      <button
                        className={styles.unselectAllBtn}
                        onClick={() => unselectAll("fabric")}
                      >
                        {t("unselectAll")}
                      </button>
                    )}
                    <label className={styles.filterLabel}>
                      <input
                        type="checkbox"
                        checked={checkedItems.fabric.has("Cotton")}
                        onChange={(e) => handleCheckboxChange("fabric", "Cotton", e.target.checked)}
                      />
                      <span>Cotton</span>
                    </label>
                    <label className={styles.filterLabel}>
                      <input
                        type="checkbox"
                        checked={checkedItems.fabric.has("Silk")}
                        onChange={(e) => handleCheckboxChange("fabric", "Silk", e.target.checked)}
                      />
                      <span>Silk</span>
                    </label>
                    <label className={styles.filterLabel}>
                      <input
                        type="checkbox"
                        checked={checkedItems.fabric.has("Wool")}
                        onChange={(e) => handleCheckboxChange("fabric", "Wool", e.target.checked)}
                      />
                      <span>Wool</span>
                    </label>
                  </div>
                )}
              </div>

              <div className={styles.filterGroup} style={{ padding: "0 16px" }}>
                <button
                  className={`${styles.filterGroupHeader} ${expandedGroups.price ? styles.expanded : ""}`}
                  onClick={() => toggleGroup("price")}
                  aria-expanded={expandedGroups.price}
                >
                  <span>{t("price")}</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 4L6 9L11 4" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
                {expandedGroups.price && (
                  <div className={styles.filterOptions}>
                    {checkedItems.price.size > 0 && (
                      <button
                        className={styles.unselectAllBtn}
                        onClick={() => unselectAll("price")}
                      >
                        {t("unselectAll")}
                      </button>
                    )}
                    {priceRangeOptions.map((option) => (
                      <label key={option.value} className={styles.filterLabel}>
                        <input
                          type="checkbox"
                          checked={checkedItems.price.has(option.value)}
                          onChange={(e) => handleCheckboxChange("price", option.value, e.target.checked)}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className={`${styles.wrapper} ${!showFilter ? styles.sidebarHidden : ""}`}>
          <aside className={`${styles.sidebar} ${!showFilter ? styles.hidden : ""}`}>
            <div className={styles.filterSection}>
              <button className={styles.filterToggle} aria-label="Toggle filters">
                <span>FILTERS</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13 2H3L7 8V13L9 15V8L13 2Z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            </div>

            <label className={`${styles.filterLabel}`} style={{ color: "black", fontSize: "16px", fontWeight: '700' }}>
              <input
                type="checkbox"
                checked={checkedItems.customizable.has("Yes")}
                onChange={(e) => handleCheckboxChange("customizable", "Yes", e.target.checked)}
              />
              <span>{t("customizable")}</span>
            </label>

            <div className={styles.filterGroup}>
              <button
                className={`${styles.filterGroupHeader} ${expandedGroups.idealFor ? styles.expanded : ""}`}
                onClick={() => toggleGroup("idealFor")}
                aria-expanded={expandedGroups.idealFor}
              >
                <span>{t("idealFor")}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 4L6 9L11 4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
              {expandedGroups.idealFor && (
                <div className={styles.filterOptions}>
                  {checkedItems.idealFor.size > 0 && (
                    <button
                      className={styles.unselectAllBtn}
                      onClick={() => unselectAll("idealFor")}
                    >
                      Unselect all
                    </button>
                  )}
                  <label className={styles.filterLabel}>
                    <input
                      type="checkbox"
                      checked={checkedItems.idealFor.has("Men")}
                      onChange={(e) => handleCheckboxChange("idealFor", "Men", e.target.checked)}
                    />
                    <span>Men</span>
                  </label>
                  <label className={styles.filterLabel}>
                    <input
                      type="checkbox"
                      checked={checkedItems.idealFor.has("Women")}
                      onChange={(e) => handleCheckboxChange("idealFor", "Women", e.target.checked)}
                    />
                    <span>Women</span>
                  </label>
                  <label className={styles.filterLabel}>
                    <input
                      type="checkbox"
                      checked={checkedItems.idealFor.has("Unisex")}
                      onChange={(e) => handleCheckboxChange("idealFor", "Unisex", e.target.checked)}
                    />
                    <span>Unisex</span>
                  </label>
                </div>
              )}
            </div>

            <div className={styles.filterGroup}>
              <button
                className={`${styles.filterGroupHeader} ${expandedGroups.occasion ? styles.expanded : ""}`}
                onClick={() => toggleGroup("occasion")}
                aria-expanded={expandedGroups.occasion}
              >
                <span>{t("occasion")}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 4L6 9L11 4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
              {expandedGroups.occasion && (
                <div className={styles.filterOptions}>
                  {checkedItems.occasion.size > 0 && (
                    <button
                      className={styles.unselectAllBtn}
                      onClick={() => unselectAll("occasion")}
                    >
                      Unselect all
                    </button>
                  )}
                  <label className={styles.filterLabel}>
                    <input
                      type="checkbox"
                      checked={checkedItems.occasion.has("Casual")}
                      onChange={(e) => handleCheckboxChange("occasion", "Casual", e.target.checked)}
                    />
                    <span>Casual</span>
                  </label>
                  <label className={styles.filterLabel}>
                    <input
                      type="checkbox"
                      checked={checkedItems.occasion.has("Formal")}
                      onChange={(e) => handleCheckboxChange("occasion", "Formal", e.target.checked)}
                    />
                    <span>Formal</span>
                  </label>
                  <label className={styles.filterLabel}>
                    <input
                      type="checkbox"
                      checked={checkedItems.occasion.has("Party")}
                      onChange={(e) => handleCheckboxChange("occasion", "Party", e.target.checked)}
                    />
                    <span>Party</span>
                  </label>
                  <label className={styles.filterLabel}>
                    <input
                      type="checkbox"
                      checked={checkedItems.occasion.has("Travel")}
                      onChange={(e) => handleCheckboxChange("occasion", "Travel", e.target.checked)}
                    />
                    <span>Travel</span>
                  </label>
                </div>
              )}
            </div>

            <div className={styles.filterGroup}>
              <button
                className={`${styles.filterGroupHeader} ${expandedGroups.work ? styles.expanded : ""}`}
                onClick={() => toggleGroup("work")}
                aria-expanded={expandedGroups.work}
              >
                <span>{t("work")}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 4L6 9L11 4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
              {expandedGroups.work && (
                <div className={styles.filterOptions}>
                  {checkedItems.work.size > 0 && (
                    <button
                      className={styles.unselectAllBtn}
                      onClick={() => unselectAll("work")}
                    >
                      Unselect all
                    </button>
                  )}
                  <label className={styles.filterLabel}>
                    <input
                      type="checkbox"
                      checked={checkedItems.work.has("Office")}
                      onChange={(e) => handleCheckboxChange("work", "Office", e.target.checked)}
                    />
                    <span>Office</span>
                  </label>
                  <label className={styles.filterLabel}>
                    <input
                      type="checkbox"
                      checked={checkedItems.work.has("Outdoor")}
                      onChange={(e) => handleCheckboxChange("work", "Outdoor", e.target.checked)}
                    />
                    <span>Outdoor</span>
                  </label>
                </div>
              )}
            </div>

            <div className={styles.filterGroup}>
              <button
                className={`${styles.filterGroupHeader} ${expandedGroups.fabric ? styles.expanded : ""}`}
                onClick={() => toggleGroup("fabric")}
                aria-expanded={expandedGroups.fabric}
              >
                <span>{t("fabric")}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 4L6 9L11 4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
              {expandedGroups.fabric && (
                <div className={styles.filterOptions}>
                  {checkedItems.fabric.size > 0 && (
                    <button
                      className={styles.unselectAllBtn}
                      onClick={() => unselectAll("fabric")}
                    >
                      Unselect all
                    </button>
                  )}
                  <label className={styles.filterLabel}>
                    <input
                      type="checkbox"
                      checked={checkedItems.fabric.has("Cotton")}
                      onChange={(e) => handleCheckboxChange("fabric", "Cotton", e.target.checked)}
                    />
                    <span>Cotton</span>
                  </label>
                  <label className={styles.filterLabel}>
                    <input
                      type="checkbox"
                      checked={checkedItems.fabric.has("Leather")}
                      onChange={(e) => handleCheckboxChange("fabric", "Leather", e.target.checked)}
                    />
                    <span>Leather</span>
                  </label>
                  <label className={styles.filterLabel}>
                    <input
                      type="checkbox"
                      checked={checkedItems.fabric.has("Synthetic")}
                      onChange={(e) => handleCheckboxChange("fabric", "Synthetic", e.target.checked)}
                    />
                    <span>Synthetic</span>
                  </label>
                </div>
              )}
            </div>

            <div className={styles.filterGroup}>
              <button
                className={`${styles.filterGroupHeader} ${expandedGroups.price ? styles.expanded : ""}`}
                onClick={() => toggleGroup("price")}
                aria-expanded={expandedGroups.price}
              >
                <span>{t("priceRange")}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 4L6 9L11 4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
              {expandedGroups.price && (
                <div className={styles.filterOptions}>
                  {checkedItems.price.size > 0 && (
                    <button
                      className={styles.unselectAllBtn}
                      onClick={() => unselectAll("price")}
                    >
                      Unselect all
                    </button>
                  )}
                  {priceRangeOptions.map((option) => (
                    <label key={option.value} className={styles.filterLabel}>
                      <input
                        type="checkbox"
                        checked={checkedItems.price.has(option.value)}
                        onChange={(e) => handleCheckboxChange("price", option.value, e.target.checked)}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </aside>

          <main className={styles.mainContent}>
            <div className={styles.grid}>
              {loading ? (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px" }}>
                  <p>Loading products...</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToWishlist={(wishlistProduct) => {
                      const event = new CustomEvent("wishlistUpdated", { detail: { product: wishlistProduct } });
                      window.dispatchEvent(event);
                    }}
                  />
                ))
              ) : (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px" }}>
                  <p>{searchQuery ? "No products found matching your search" : "No products available"}</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
