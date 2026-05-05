"use client";

import Link from "next/link";
import { useLanguageStore } from "@/stores/language.store";
import { cn } from "@/lib/utils";

type NavLink = {
  href: string;
  zh: string;
  en: string;
  children?: ReadonlyArray<{ href: string; zh: string; en: string }>;
};

const NAV_ITEMS: ReadonlyArray<NavLink> = [
  { href: "/", zh: "首页", en: "Home" },
  { href: "/work", zh: "项目", en: "Projects" },
  { href: "/products", zh: "产品", en: "Products" },
  {
    href: "/writing",
    zh: "文章",
    en: "Writing",
    children: [
      { href: "/writing", zh: "技术文章", en: "Tech articles" },
      { href: "/novels", zh: "小说", en: "Novels" },
    ],
  },
  { href: "/about", zh: "关于", en: "About" },
  { href: "/feedback", zh: "留言", en: "Feedback" },
] as const;

export function Nav() {
  const lang = useLanguageStore((s) => s.lang);
  const setLang = useLanguageStore((s) => s.setLang);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur">
      <div className="container-page flex items-center justify-between py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-gradient font-serif text-lg font-bold text-paper shadow-md shadow-brand/25">
            添
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-semibold tracking-tight">Tianda Studio</span>
            <span className="mt-0.5 block text-[10px] tracking-[0.15em] text-muted2">添达工作室</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <div key={item.href} className="group relative">
                <Link href={item.href} className="flex items-center gap-1 hover:text-brand">
                  {lang === "zh" ? item.zh : item.en}
                  <span className="text-[10px] text-muted2 transition group-hover:text-brand">▾</span>
                </Link>
                <div className="invisible absolute left-1/2 top-full z-20 w-40 -translate-x-1/2 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100">
                  <div className="rounded-md border border-line bg-paper p-1 shadow-card">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded px-3 py-2 text-sm text-muted hover:bg-brand/5 hover:text-brand"
                      >
                        {lang === "zh" ? child.zh : child.en}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href} className="hover:text-brand">
                {lang === "zh" ? item.zh : item.en}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLang("zh")}
            className={cn(
              "rounded px-2 py-1 text-xs",
              lang === "zh" ? "bg-brand/10 font-semibold text-brand" : "text-muted2 hover:text-brand",
            )}
          >
            中
          </button>
          <button
            type="button"
            onClick={() => setLang("en")}
            className={cn(
              "rounded px-2 py-1 text-xs",
              lang === "en" ? "bg-brand/10 font-semibold text-brand" : "text-muted2 hover:text-brand",
            )}
          >
            EN
          </button>
          <a
            href="https://www.upwork.com/freelancers/~012a1e9c108e49cd19?viewMode=1"
            target="_blank"
            rel="noopener"
            className="rounded-pill bg-ink px-4 py-2 text-[13px] font-medium text-paper hover:bg-ink2"
          >
            {lang === "zh" ? "雇用我 ↗" : "Hire me ↗"}
          </a>
        </div>
      </div>
    </header>
  );
}
