import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";

// Define the Geist font
const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    
        <body className={geist.className}>
          <Navbar/>
          {children}
         
        </body>
     
    </html>
  );
}
