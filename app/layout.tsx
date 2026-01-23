import ServiceWorker from "@/components/ServiceWorker";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins-mono",
  subsets: ["latin"],
  weight: "100",
});

export const metadata: Metadata = {
  title: "The Couples Sanctuary",
  description: "A private experience for two",
  themeColor: "#8B0000",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "The Couples Sanctuary",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#0A0A0A] text-zinc-50">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta
          name="apple-mobile-web-app-title"
          content="The Couples Sanctuary"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body
        className={`${poppins.variable} antialiased bg-[#0A0A0A] text-zinc-50`}
      >
        <ServiceWorker />
        <div className="min-h-dvh safe-area">{children}</div>
      </body>
    </html>
  );
}
