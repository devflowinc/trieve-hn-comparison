import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HackerNews Search Comparison Poll",
  description:
    "Comparison Poll for HackerNews Search so we can learn and improve",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="https://cdn.trieve.ai/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="https://cdn.trieve.ai/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="https://cdn.trieve.ai/favicon-16x16.png"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          property="og:title"
          content="Comparison Poll for HackerNews Search"
        />
        <meta
          property="og:site_name"
          content="Comparison Poll for HackerNews Search"
        />
        <meta property="og:url" content="https://hn-compare.trieve.ai" />
        <meta
          property="og:description"
          content="Blind poll comparing relevance strategies for HackerNews Search"
        />
        <meta property="og:type" content="" />
        <meta
          property="og:image"
          content="https://cdn.trieve.ai/trieve-og.png"
        />
        <script
          defer
          data-domain="hn-compare.trieve.ai"
          src="https://plausible.trieve.ai/js/script.js"
        ></script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
