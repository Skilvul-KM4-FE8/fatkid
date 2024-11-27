"use client";
// import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import SheetProvider from "@/providers/sheet-providres";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import DialogProviders from "@/providers/dialog-providers";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} antialiased`}>
          <QueryClientProvider client={queryClient}>
            <SheetProvider />
            <DialogProviders />
            <Toaster />
            {children}
            <Analytics />
          </QueryClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
