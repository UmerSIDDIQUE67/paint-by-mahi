"use client";

/**
 * Site-wide settings stored in localStorage.
 * Admin edits these; all public components read from them.
 */

import { create } from "zustand";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/defaultSettings";
export type { SiteSettings } from "@/lib/defaultSettings";

const SETTINGS_KEY = "pbm_site_settings";

function loadLocalSettings(): SiteSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  if (typeof localStorage === "undefined") return DEFAULT_SETTINGS;
  if (typeof localStorage.getItem !== "function") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveLocalSettings(s: SiteSettings) {
  if (typeof window === "undefined") return;
  if (typeof localStorage.setItem !== "function") return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}

function fetchServerSettings(): Promise<SiteSettings | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  return fetch("/api/settings", { cache: "no-store" })
    .then((res) => {
      if (!res.ok) return null;
      return res.json();
    })
    .then((data) => (data?.settings ? ({ ...DEFAULT_SETTINGS, ...data.settings } as SiteSettings) : null))
    .catch(() => null);
}

interface SettingsStore {
  settings: SiteSettings;
  hydrated: boolean;
  hydrate: () => void;
  update: (patch: Partial<SiteSettings>) => void;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  hydrated: false,
  hydrate: () => {
    if (get().hydrated) return;
    const settings = loadLocalSettings();
    set({ settings, hydrated: true });

    fetchServerSettings().then((serverSettings) => {
      if (!serverSettings) return;
      set({ settings: serverSettings });
      saveLocalSettings(serverSettings);
    });
  },
  update: (patch) => {
    const next = { ...get().settings, ...patch };
    set({ settings: next });
    saveLocalSettings(next);

    fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    }).catch(() => {
      // ignore network failures
    });
  },
}));
