import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SBMI",
  description: "Sumido Blockchain Mining Inc.",
  // provide a full URL to your /frames endpoint
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": `https://${process.env.NEXT_PUBLIC_SITE_URL}/images/logo-transparent.png`,
    "fc:frame:image:aspect_ratio": "1:1",
    "fc:frame:button:1": `Learn More`,
    "fc:frame:button:1:link": `https://${process.env.NEXT_PUBLIC_SITE_URL}/`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
