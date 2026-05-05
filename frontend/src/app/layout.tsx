import type { Metadata, Viewport } from "next";
import { LangProvider } from "@/lib/i18n/client";
import { Nav } from "@/components/layout/Nav";
import { SiteContact } from "@/components/layout/SiteContact";
import { Footer } from "@/components/layout/Footer";
import { Lightbox } from "@/components/blocks/Lightbox";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tianda Studio · 添达工作室 — 添达 Kevin",
    template: "%s · Tianda Studio",
  },
  description:
    "添达 Kevin — 10+ 年经验的全栈 / AI / Web3 NFT 工程师。一人工作室独立交付生产级应用。Available on Upwork.",
  keywords: [
    "添达",
    "Tianda",
    "Kevin",
    "Tianda Studio",
    "添达工作室",
    "Full-Stack",
    "Next.js",
    "FastAPI",
    "AI",
    "LangChain",
    "Web3",
    "NFT",
    "Upwork",
    "freelance engineer",
    "Shanghai",
    "Vibe Coding",
  ],
  authors: [{ name: "添达 Kevin", url: SITE_URL }],
  creator: "添达 Kevin",
  publisher: "Tianda Studio",
  alternates: { canonical: SITE_URL },
  openGraph: {
    siteName: "Tianda Studio",
    title: "Tianda Studio · 添达 Kevin",
    description: "10+ 年的全栈 · AI · Web3 NFT 工程师，一人工作室。",
    type: "website",
    locale: "zh_CN",
    alternateLocale: ["en_US"],
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    creator: "@kuiwangdev",
    title: "Tianda Studio · 添达 Kevin",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export const viewport: Viewport = {
  themeColor: "#faf8f4",
  width: "device-width",
  initialScale: 1,
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "添达 Kevin",
  alternateName: "Tianda Kevin",
  url: SITE_URL,
  jobTitle: "Full-Stack Engineer · AI · Web3",
  worksFor: { "@type": "Organization", name: "Tianda Studio · 添达工作室" },
  email: "mailto:kui.wang.upwork@gmail.com",
  sameAs: ["https://www.upwork.com/freelancers/~012a1e9c108e49cd19?viewMode=1", "https://github.com/kui-wang-dada"],
  knowsAbout: ["Next.js", "React Native", "FastAPI", "LangChain", "Web3", "NFT", "Solidity"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
        <LangProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <SiteContact />
          <Footer />
          <Lightbox />
        </LangProvider>
      </body>
    </html>
  );
}
