"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Home",    href: "/",        icon: Home },
  { label: "Lessons", href: "/lessons", icon: BookOpen },
  { label: "Search",  href: "/search",  icon: Search },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    // ── Fixed bottom bar, visible only on mobile ──
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-bg-base/95 backdrop-blur-md md:hidden">
      {tabs.map(({ label, href, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors",
              active ? "text-accent-blue" : "text-text-muted"
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
