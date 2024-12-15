import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});
const fredoka = localFont({
    src: "./fonts/Fredoka-VariableFont_wdth,wght.ttf",
    variable: "--font-fredoka",
    weight: "100 900",
});

const quicksand = localFont({
    src: "./fonts/Quicksand-VariableFont_wght.ttf",
    variable: "--font-quicksand",
    weight: "300 700",
});

export const metadata: Metadata = {
    title: "Mystery Box",
    description: "Easily create Mystery Box games and keep them online!",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${fredoka.variable} ${quicksand.variable} antialiased`}
            >
                <Header />
                <div className="pt-24">
                    {children}
                    <Toaster />
                    <Footer />
                </div>
            </body>
        </html>
    );
}
