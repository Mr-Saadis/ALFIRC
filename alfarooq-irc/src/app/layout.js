import { Geist, Geist_Mono ,IBM_Plex_Sans,Poppins, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

import Sidebar from "@/components/Sidebar";


const geistSans = Geist({
  variable: "--font-Poppins",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-Geist-Mono",
  subsets: ["latin"],
});
const notonastaliqurdurdu = Noto_Nastaliq_Urdu({
  variable: "--font-Noto-Nastaliq-Urdu",
  subsets: ["arabic"],
  weight: [ "400", "500", "600", "700"],
});
const poppins = Poppins({
  variable: "--font-Poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata = {
  title: "Al-Farooq IRC",
  description: "Al-Farooq Islamic Research Center",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  
  return (
    <html lang="ur">
      <body
        className={` ${poppins.variable} ${poppins.variable} antialiased`}
      >
        <Header/>
         <Sidebar />
        {/* <ThemeProvider attribute="class" defaultTheme="light">  */}
        <main className="bg-gray-50 min-h-screen">

        {children}
        <Toaster position="bottom-right" />
        </main>
         {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
