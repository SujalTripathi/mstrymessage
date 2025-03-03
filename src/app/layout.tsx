import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css"
import AuthProvider from "@/context/AuthProvider"; // Go up one directory and then to context/AuthProvider
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/Navbar";

// Define the Geist font
const geist = Geist({ subsets: ["latin"] });

// Define the Inter font
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={geist.className}>
          <Navbar/>
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
