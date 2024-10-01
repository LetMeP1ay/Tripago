import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import NotificationBell from "./NotificationBell";

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
      <body className={inter.className}>
        <header>
          <nav className="p-4 text-[#727272] flex justify-between items-center">
            <div>
              <Image
                src="Tripago.svg"
                alt="Tripago Logo"
                width={0}
                height={0}
                className="w-20 md:w-40"
              />
            </div>
            <div>
              <NotificationBell />
            </div>
          </nav>
        </header>
        <main className="p-6">{children}</main>
        <footer className="p-4 bg-gray-800 text-white text-center">
          <p>&copy; 2024 My Website</p>
        </footer>
      </body>
    </html>
  );
}
