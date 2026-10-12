import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const host = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const metadata: Metadata = {
  metadataBase: new URL(host ? `https://${host}` : "http://localhost:3000"),
  title: "MirrorMe: a camera for iOS Simulators and Android emulators",
  description:
    "MirrorMe gives iOS Simulators and Android emulators a working camera that sees the part of your Mac desktop under the device window.",
  authors: [{ name: "HEXHAD", url: "https://hexhad.github.io" }],
  creator: "HEXHAD",
  publisher: "HEXHAD",
  openGraph: {
    title: "MirrorMe",
    description: "A camera for your simulators, aimed at your desktop.",
    images: ["/app-icon.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0c0f",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
