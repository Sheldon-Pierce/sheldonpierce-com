import type { Metadata } from "next";
import { Bricolage_Grotesque, Archivo, IBM_Plex_Mono } from "next/font/google";
import { ClientOverlays } from "@/components/motion/client-overlays";
import { GradientOrb } from "@/components/hero/gradient-orb";
import { DepthRail } from "@/components/depth-rail/depth-rail";
import { Nav } from "@/components/nav/nav";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-archivo",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

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
      className={`${bricolage.variable} ${archivo.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ClientOverlays />
        <GradientOrb />
        <DepthRail />
        <Nav />
        {children}
      </body>
    </html>
  );
}
