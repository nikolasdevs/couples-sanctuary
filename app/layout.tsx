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
  description: "A private experience for couples",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${poppins.variable} antialiased`}>{children}</body>
    </html>
  );
}
