// src/app/layout.tsx
"use client"

import './globals.css'; // ✅ THIS LINE IS IMPORTANT
import { Poetsen_One } from "next/font/google";

import { usePathname } from "next/navigation";
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/navbar/Navbar';

// src/app/layout.tsx
// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer } from "react-toastify";

// import LoginModal from "./components/modals/LoginModal";
// import SearchModal from "./components/modals/SearchModal";
// import SignupModal from "./components/modals/SignupModal";
// import AddPropertyModal from "./components/modals/AddPropertyModal";


// google font
const poetsenOne = Poetsen_One(
  {  weight: '400',
    subsets: ["latin"]
  }
);

export const Metadata = {
  title: {
    default: "Property Finder - Real Estate Marketplace",
    template: "%s | Property Finder",
  },
  description: "Find your dream property in Saudi Arabia. Browse residential and commercial properties for sale and rent. Professional real estate marketplace for buyers, sellers, and agents.",
  keywords: [
    "real estate",
    "property for sale",
    "property for rent",
    "residential properties",
    "commercial properties",
    "Saudi Arabia real estate",
    "buy property",
    "rent property",
    "real estate marketplace",
    "property finder"
  ],
  authors: [{ name: "Property Finder Team" }],
  creator: "Property Finder",
  publisher: "Property Finder",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://propertyfinder.com",
    siteName: "Property Finder",
    title: "Property Finder - Real Estate Marketplace",
    description: "Find residential and commercial properties for sale and rent in Saudi Arabia",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Property Finder - Real Estate Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Finder - Real Estate Marketplace",
    description: "Find your dream property in Saudi Arabia",
    images: ["/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://propertyfinder.com/sa",
  },
  verification: {
    google: "", // Add Google Search Console verification code here
  },
  other: {
    // Google Tag Manager noscript fallback
    "data-layer": "{ 'pageType': 'homepage' }",
  },
};


// src/app/layout.js
export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    
    
    const hideNavbar = 
      pathname === "/login" ||
      // pathname === "/register/buyer" || 
      pathname === "/forgotPassword" ||
      pathname === "/noteCheckEmail" ||
      pathname === "/notePasswordResetComplete" ||
      pathname === "/changePassword" ||
      pathname.startsWith("/setNewPassword/") ||      // for the dynamic path "/setNewPassword/[uid]/[token]"
      pathname.startsWith("/users/confirm-email/") ||  // for the dynamic path "/users/confirm-email/[uid]/[token]"
      pathname.startsWith("/register")              // for the dynamic path "/register/[role]"
      
      // console.log("/users/confirm-email/", pathname.startsWith("/users/confirm-email/"))
    
    
    
      return (

      <html lang="en">
        <body className={poetsenOne.className}>

          <AuthProvider>
              {!hideNavbar && <Navbar />}
              <div>
                <main>
                  {children}
                  {/* <ToastContainer position="top-center" autoClose={3000} /> */}
                </main>
              </div>
          </AuthProvider>
        
        </body>
      </html>
    );
}