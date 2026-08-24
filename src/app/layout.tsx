import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/nav/Header";
import { BottomNav } from "@/components/nav/BottomNav";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Okoumia — Import mode, accessoires & électronique au Gabon",
  description:
    "Okoumia importe pour vous des produits mode, accessoires, électronique et cosmétique, prix tout compris, à retirer dans un point relais près de chez vous à Libreville.",
};

export const viewport: Viewport = {
  themeColor: "#0c2c20",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${jakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-sand-50 text-forest-950">
        <Header />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <BottomNav />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
