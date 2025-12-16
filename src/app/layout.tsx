import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Appscrip Product Store | SSR Next.js Demo",
  description: "SEO optimized ecommerce demo using Next.js App Router with SSR",
  keywords: "fashion, products, backpack, accessories, shopping, appscrpt, nextjs, ssr",
  authors: [{ name: "Appscrip" }],
  openGraph: {
    title: "Appscrip Product Store | SSR Next.js Demo",
    description: "SEO optimized ecommerce demo using Next.js App Router with SSR",
    type: "website",
    url: "https://appscrip-products.netlify.app",
    siteName: "Appscrip Demo Store",
  },
  twitter: {
    card: "summary_large_image",
    title: "Appscrip Product Store",
    description: "SEO optimized ecommerce demo using Next.js App Router with SSR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/logo.png" type="image/svg+xml" />
        <link rel="canonical" href="https://appscrip-products.netlify.app" />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: "Appscrip Demo Store",
              url: "https://appscrip-products.netlify.app",
              description: "SEO optimized ecommerce demo using Next.js App Router with SSR",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://appscrip-products.netlify.app?q={search_term_string}",
                },
                query_input: "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
