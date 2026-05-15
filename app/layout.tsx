import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { CursorFollower } from "@/components/motion/cursor-follower";
import { GradientOrb } from "@/components/hero/gradient-orb";
import { Nav } from "@/components/nav/nav";
import { PageTransition } from "@/components/motion/page-transition";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Sheldon Pierce — Software Engineer",
    template: "%s — Sheldon Pierce",
  },
  description:
    "Software engineer building identity systems, platforms, and product UI. Available for select freelance work. Seattle, WA.",
  metadataBase: new URL("https://sheldonpierce.com"),
  openGraph: {
    title: "Sheldon Pierce — Software Engineer",
    description:
      "Software engineer building identity systems, platforms, and product UI.",
    url: "https://sheldonpierce.com",
    siteName: "Sheldon Pierce",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sheldon Pierce — Software Engineer",
    description:
      "Software engineer building identity systems, platforms, and product UI.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-bg text-fg font-sans antialiased">
        <CursorFollower />
        <GradientOrb />
        <Nav />
        <PageTransition />
        {children}
      </body>
    </html>
  );
}
