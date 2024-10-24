import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { NotificationProvider } from "@/context/NotificationContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tripago",
  description: "Your all-in-one traveling app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="Logo.svg" />
      </head>
      <AuthProvider>
        <NotificationProvider>
          <CartProvider>
            <body
              className={`${inter.className} flex flex-col min-h-screen bg-white text-black overflow-hidden`}
            >
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </body>
          </CartProvider>
        </NotificationProvider>
      </AuthProvider>
    </html>
  );
}
