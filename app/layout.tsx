import type { Metadata, Viewport } from "next";
import { Cinzel, Cinzel_Decorative } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({ subsets: ["latin"], variable: '--font-cinzel' });
const cinzelDeco = Cinzel_Decorative({
  weight: ['400', '700', '900'],
  subsets: ["latin"],
  variable: '--font-cinzel-deco'
});

export const metadata: Metadata = {
  title: "Demon Slayer: Breathing Technique",
  description: "An interactive 3D breathing technique experience featuring hand gesture detection and synthesized audio.",
  openGraph: {
    title: "Demon Slayer: Breathing Technique",
    description: "An interactive 3D breathing technique experience featuring hand gesture detection and synthesized audio.",
    type: "website",
    url: "https://demonslayer-breathing.vercel.app",
    siteName: "Demon Slayer Art",
  },
  twitter: {
    card: "summary_large_image",
    title: "Demon Slayer: Breathing Technique",
    description: "Experience the breathing styles of Demon Slayer in 3D using your webcam and hand gestures.",
  },
  alternates: {
    canonical: "https://demonslayer-breathing.vercel.app",
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#040410",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Demon Slayer Breathing Technique",
            "applicationCategory": "BrowserApplication",
            "operatingSystem": "Any",
            "description": "An interactive 3D web application utilizing MediaPipe hands and Three.js to simulate Demon Slayer breathing styles.",
            "offers": {
              "@type": "Offer",
              "price": "0"
            }
          })
        }} />
        <script src="https://unpkg.com/@mediapipe/hands@0.4.1646424915/hands.js" crossOrigin="anonymous" async></script>
      </head>
      <body className={`${cinzel.variable} ${cinzelDeco.variable} font-sans antialiased bg-[#040410]`}>
        {children}
      </body>
    </html>
  );
}
