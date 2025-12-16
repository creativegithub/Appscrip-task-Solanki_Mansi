import { fetchProducts } from "@/lib/api";
import Header from "@/components/header/Header";
import Hero from "@/components/hero/Hero";
import ProductGrid from "@/components/product/ProductGrid";
import Footer from "@/components/footer/Footer";

export const metadata = {
  title: "Appscrip Task | Product Listing",
  description: "SSR-enabled product listing page built with Next.js App Router",
};

export default async function HomePage() {
  const products = await fetchProducts();

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
