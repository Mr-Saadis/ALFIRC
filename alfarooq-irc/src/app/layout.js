import { Geist, Geist_Mono ,IBM_Plex_Sans,Poppins} from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

const geistSans = Geist({
  variable: "--font-Poppins",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-Geist-Mono",
  subsets: ["latin"],
});
const poppins = Poppins({
  variable: "--font-Poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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
    <html lang="urdu">
      <body
        className={`${poppins.variable} ${poppins.variable} antialiased`}
      >
        <Header/>
        {children}
      </body>
    </html>
  );
}
