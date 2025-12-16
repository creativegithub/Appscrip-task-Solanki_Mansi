"use client";

import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api";
import Header from "@/components/header/Header";
import Hero from "@/components/hero/Hero";
import ProductGrid from "@/components/product/ProductGrid";
import Footer from "@/components/footer/Footer";
import { Product } from "@/types/product";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProductGrid products={products} />
      </main>
      <Footer />
    </>
  );
}
