import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { CursorFollower } from "@/components/motion/cursor-follower";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sheldon Pierce — Software Engineer",
  description:
    "Software engineer building identity systems, platforms, and product UI. Seattle, WA.",
  metadataBase: new URL("https://sheldonpierce.com"),
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
        {children}
      </body>
    </html>
  );
}
