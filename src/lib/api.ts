import { Product } from "@/types/product";

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("https://fakestoreapi.com/products", {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch products");

  const products = await res.json();

  // Transform API data to match our Product interface
  return products.map((product: any) => ({
    id: product.id.toString(),
    name: product.title,
    title: product.title,
    image: product.image,
    altText: `Buy ${product.title} online`,
    price: product.price,
    rating: product.rating,
    description: product.description,
    category: product.category,
    customizable: Math.random() > 0.5,
    inStock: Math.random() > 0.3, // 70% of products in stock for demo
  }));
}
