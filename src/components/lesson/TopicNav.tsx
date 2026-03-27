"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface Topic {
  slug: string;
  title: string;
}

interface TopicNavProps {
  lessonSlug: string;
  topics: Topic[];
  accentHex: string;
}

export function TopicNav({ lessonSlug, topics, accentHex }: TopicNavProps) {
  const pathname = usePathname();

  return (
    // ── Sticky left sidebar, hidden on mobile ──
    <nav className="sticky top-20 hidden w-56 shrink-0 md:block">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">Topics</p>
      <ul className="space-y-1">
        {topics.map((topic) => {
          const href = `/lessons/${lessonSlug}/${topic.slug}`;
          const active = pathname === href;
          return (
            <li key={topic.slug}>
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all",
                  active
                    ? "bg-bg-elevated text-text-primary"
                    : "text-text-secondary hover:bg-bg-surface hover:text-text-primary"
                )}
              >
                {/* Accent dot on active item */}
                {active && (
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: accentHex }}
                  />
                )}
                {topic.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
