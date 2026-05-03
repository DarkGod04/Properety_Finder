// src/app/layout.tsx

import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });


export const metadata = {
  title: "Property Finder Global",
  description: "Choose your country to explore properties",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) 

{
  return (
    <html lang="en" suppressHydrationWarning>
        <body className={inter.className} suppressHydrationWarning>
            {children}
        </body>
    </html>
  );
}
