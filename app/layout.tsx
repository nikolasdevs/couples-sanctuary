import { MidnightProvider } from "@/context/MidnightContext";
import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat-sans",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins-mono",
  subsets: ["latin"],
  weight: "100",
});

export const metadata: Metadata = {
  title: "The Couples Sanctuary",
  description: "A private experience for couples",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${poppins.variable} antialiased`}
      >
        <MidnightProvider>{children}</MidnightProvider>
      </body>
    </html>
  );
}
