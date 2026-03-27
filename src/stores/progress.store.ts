import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProgressStore {
  readTopics:  Set<string>;
  triedTopics: Set<string>;
  markRead:    (slug: string) => void;
  markTried:   (slug: string) => void;
  isRead:      (slug: string) => boolean;
  isTried:     (slug: string) => boolean;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      readTopics:  new Set(),
      triedTopics: new Set(),
      markRead:  (slug) => set((s) => ({ readTopics: new Set([...s.readTopics, slug]) })),
      markTried: (slug) => set((s) => ({ triedTopics: new Set([...s.triedTopics, slug]) })),
      isRead:    (slug) => get().readTopics.has(slug),
      isTried:   (slug) => get().triedTopics.has(slug),
    }),
    { 
      name: "mathcore-progress",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state } = JSON.parse(str);
          return {
            state: {
              ...state,
              readTopics: new Set(state.readTopics),
              triedTopics: new Set(state.triedTopics),
            },
          };
        },
        setItem: (name, newValue: any) => {
          const str = JSON.stringify({
            state: {
              ...newValue.state,
              readTopics: Array.from(newValue.state.readTopics),
              triedTopics: Array.from(newValue.state.triedTopics),
            },
          });
          localStorage.setItem(name, str);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
