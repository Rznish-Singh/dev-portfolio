
import type { Metadata } from "next";
import "./globals.css";
import { Inter, Geist } from "next/font/google";
import { fonts } from "@/config/fonts";
import { AutoTheme } from "@/components/auto-theme";
import NextTopLoader from "nextjs-toploader";
import { DiwaliProvider, DiwaliMount } from "@/components/diwali";
import React from 'react'
import ReactDOM from 'react-dom'
import Snowfall from 'react-snowfall'

import Navigation from "@/components/navigation";
import { USER } from "@/config/user";
import { Announcement } from "@/components/site/Announcement";
import { LinearBlur } from "@/components/ui/LinearBlur";
import { MobileNotice } from "./MobileNotice";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import SnowfallBackground from "@/components/wintertheme/SnowfallBackground";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: `${USER.name} — ${USER.tagline}`,
  description: USER.description,
};


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(fonts, "font-sans", geist.variable)} suppressHydrationWarning>
     
  <body className="font-sans antialiased">
   <SnowfallBackground/>
    <DiwaliProvider darkClass="dark">
    <NextTopLoader
  color="#3b82f6"
  height={2}
  showSpinner={false}
  shadow={false}
  crawlSpeed={150}
/>
   
       {/* attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange    */}
     <Providers  >   
       {/* <AutoTheme /> */}
          {/* the class your Tailwind dark mode uses; null = keep current theme */}
    {children}
    
    <Announcement /> 
    {/* <MobileNotice /> */}
  
    <LinearBlur
        side="bottom"
        strength={127}
        steps={12.4}
        falloffPercentage={100}
        tint="#45454500"
        className="fixed inset-x-0 bottom-0 z-40 h-24"
      />
       
          {/* <LinearBlur
        side="top"
        strength={127}
        steps={12.4}
        falloffPercentage={100}
        tint="#45454500"
        className="fixed inset-x-0 bottom-0 z-40 h-24"
      /> */}
        
      </Providers>   
      </DiwaliProvider>
  </body>
</html>
  );
}
