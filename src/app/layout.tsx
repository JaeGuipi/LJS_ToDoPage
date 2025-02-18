import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "칸반보드 | 간편한 작업 관리",
  description: "드래그 앤 드롭으로 쉽게 관리하는 칸반보드 애플리케이션",
  keywords: ["칸반보드", "작업관리", "태스크관리", "프로젝트관리", "todo"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "칸반보드 | 간편한 작업 관리",
    description: "드래그 앤 드롭으로 쉽게 관리하는 칸반보드 애플리케이션",
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "칸반보드 미리보기",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "칸반보드 | 간편한 작업 관리",
    description: "드래그 앤 드롭으로 쉽게 관리하는 칸반보드 애플리케이션",
    images: ["/og-image.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
