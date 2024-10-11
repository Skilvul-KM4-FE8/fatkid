"use client"
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Inter } from 'next/font/google';
import { ClerkProvider } from "@clerk/nextjs";

import SheetProvider from "@/providers/sheet-providres";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/sonner";
import DialogProviders from "@/providers/dialog-providers";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const queryClient = new QueryClient()

  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.className} antialiased`}
        >
          <QueryClientProvider client={queryClient}>
            <SheetProvider />
            <DialogProviders />
            <Toaster />
            {children}
          </QueryClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
