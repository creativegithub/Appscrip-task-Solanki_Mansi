"use client";

import styles from "./Hero.module.css";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t("discoverOurProducts")}</h1>
        <p className={styles.subtitle}>
          {t("heroSubtitle")}
        </p>
      </div>
    </section>
  );
}
