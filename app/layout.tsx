import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import LightRays from "@/components/LightRays";
import Navbar from "@/components/Navbar";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dev Event",
  description: "The Hub for Developers to Find and Share Events",
};

/**
 * Application root layout that applies global fonts and structure, renders the navigation, and wraps page content.
 *
 * Renders an <html> element with lang="en", a <body> that includes the configured font CSS variables and layout classes, the Navbar, and a <main> element containing the provided children.
 *
 * @param children - The page content to render inside the layout's main area
 * @returns The root HTML structure containing the body, navigation, and main content
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${schibstedGrotesk.variable} ${martianMono.variable} min-h-screen antialiased`}
      >
      <Navbar />
      {/*<div className={"absolute inset-0 top-0 z-[1] min-h-screen"}>*/}
      {/*  <LightRays*/}
      {/*    raysOrigin="top-center-offset"*/}
      {/*    raysColor="#ffffff"*/}
      {/*    raysSpeed={1}*/}
      {/*    lightSpread={0.5}*/}
      {/*    rayLength={3}*/}
      {/*    followMouse={true}*/}
      {/*    mouseInfluence={0.1}*/}
      {/*    noiseAmount={0}*/}
      {/*    distortion={0}*/}
      {/*    className="custom-rays"*/}
      {/*    pulsating={false}*/}
      {/*    fadeDistance={1}*/}
      {/*    saturation={1}*/}
      {/*  />*/}
      {/*</div>*/}
      <main>
        {children}
      </main>

      </body>
    </html>
  );
}
