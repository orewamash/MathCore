"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search } from "lucide-react";
import { lessons } from "@/lib/content/lessons";
import { getTopicContent } from "@/lib/content/topics";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  // Build searchable index from all topics
  const searchIndex = useMemo(() => {
    const items: { lessonSlug: string; topicSlug: string; title: string; lesson: string; accentHex: string; keywords: string }[] = [];
    for (const lesson of lessons) {
      for (const topic of lesson.topics) {
        const content = getTopicContent(topic.slug);
        const keywords = content
          ? `${content.title} ${content.plainEnglish} ${content.conditions.join(" ")} ${content.commonMistakes.join(" ")}`
          : topic.title;
        items.push({
          lessonSlug: lesson.slug,
          topicSlug: topic.slug,
          title: topic.title,
          lesson: lesson.title,
          accentHex: lesson.accentHex,
          keywords: keywords.toLowerCase(),
        });
      }
    }
    return items;
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return searchIndex;
    const q = query.toLowerCase();
    return searchIndex.filter((item) =>
      item.keywords.includes(q) || item.title.toLowerCase().includes(q) || item.lesson.toLowerCase().includes(q)
    );
  }, [query, searchIndex]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 font-display text-4xl text-text-primary"
      >
        Search
      </motion.h1>

      {/* Search input */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-10 flex items-center gap-3 rounded-xl border border-border bg-bg-surface px-4 py-3 focus-within:border-accent-blue/40 transition-colors"
      >
        <Search className="h-5 w-5 text-text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics, theorems, formulas..."
          className="w-full bg-transparent text-sm text-text-primary placeholder-text-muted outline-none"
          autoFocus
        />
      </motion.div>

      {/* Results */}
      <div className="space-y-3">
        {results.length === 0 ? (
          <p className="text-center text-text-muted py-12">No results found for &quot;{query}&quot;</p>
        ) : (
          results.map((item, i) => (
            <motion.div
              key={`${item.lessonSlug}-${item.topicSlug}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                href={`/lessons/${item.lessonSlug}/${item.topicSlug}`}
                className="group flex items-center justify-between rounded-xl border border-border bg-bg-surface px-5 py-4 transition-all hover:bg-bg-elevated hover:-translate-y-0.5"
              >
                <div>
                  <p className="text-sm font-medium text-text-primary group-hover:text-white transition-colors">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs" style={{ color: item.accentHex }}>
                    {item.lesson}
                  </p>
                </div>
                <span className="text-xs text-text-muted">→</span>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
