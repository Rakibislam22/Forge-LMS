import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forge · Courses",
  description: "Forge LMS · Simplified learning management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Neutralize browser extension DOM mutation (e.g. Bitdefender/Urban VPN bis_skin_checked) before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var o=Element.prototype.setAttribute;Element.prototype.setAttribute=function(n,v){if(n==='bis_skin_checked'||n==='bis_register'||(typeof n==='string'&&n.indexOf('__processed_')===0)){return}return o.apply(this,arguments)}}catch(e){}})()`,
          }}
        />
        {/* eslint-disable @next/next/no-page-custom-font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;700&display=swap"
          rel="stylesheet"
        />
        {/* eslint-enable @next/next/no-page-custom-font */}
      </head>
      <body
        className="min-h-screen flex flex-col bg-[#F6F4EF] text-[#15171C]"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
