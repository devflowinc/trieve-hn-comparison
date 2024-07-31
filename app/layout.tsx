import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trieve Search Comparison to Algolia",
  description: "A detailed comparison between Trieve Search and Algolia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="https://cdn.trieve.ai/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="https://cdn.trieve.ai/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="https://cdn.trieve.ai/favicon-16x16.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Trieve Search Comparison to Algolia"/>
        <meta property="og:site_name" content="Trieve Search Comparison to Algolia"/>
        <meta property="og:url" content="https://hn-compare.trieve.ai"/>
        <meta property="og:description" content="A detailed comparison between Trieve Search and Algolia"/>
        <meta property="og:type" content=""/>
        <meta property="og:image" content="https://cdn.trieve.ai/trieve-og.png"/>
        <script defer data-domain="search.trieve.ai" src="https://plausible.trieve.ai/js/script.js"></script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
