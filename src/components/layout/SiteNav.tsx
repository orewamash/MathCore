"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { label: "Lessons", href: "/lessons" },
  { label: "Search", href: "/search" },
];

import { useRouter } from "next/navigation";
import GooeyNav from "@/components/shared/GooeyNav";

const navItems = [
  { label: "Lessons", href: "/lessons" },
  { label: "Search", href: "/search" },
];

export function SiteNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Find initial active index based on pathname
  const initialIndex = navItems.findIndex(item => pathname.startsWith(item.href));

  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-white/5 bg-bg-base/60 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-8">

        {/* Logo */}
        <Link href="/" className="font-display text-3xl font-black italic tracking-tighter text-white group flex items-center gap-2">
          Math<span className="text-accent-blue group-hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all">Core</span>
        </Link>

        <div className="hidden items-center group md:flex">
          <GooeyNav 
             items={navItems}
             initialActiveIndex={initialIndex === -1 ? 0 : initialIndex}
             onItemClick={(href) => router.push(href)}
             className="scale-90"
             colors={[1, 2, 3, 4]} // Thematic colors
          />
        </div>

        {/* Premium Auth buttons */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.push("/search")}
            className="text-sm font-black uppercase tracking-[0.2em] text-white/40 transition-all hover:text-white"
          >
            Terminal
          </button>
          <Link
            href="/lessons"
            className="group relative px-6 py-2 overflow-hidden rounded-full transition-all"
          >
             <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors" />
             <span className="relative z-10 text-xs font-black uppercase tracking-widest text-white">Access Core</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

