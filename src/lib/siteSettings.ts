"use client";

/**
 * Site-wide settings stored in localStorage.
 * Admin edits these; all public components read from them.
 */

import { create } from "zustand";

const SETTINGS_KEY = "pbm_site_settings";

export interface SiteSettings {
  // Announcement bar
  announcementText: string;
  announcementPhone: string;

  // Social links
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;

  // Contact info
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;

  // About section (home page)
  artistName: string;
  artistBio1: string;
  artistBio2: string;
  artistYears: string;
  artistWorksCount: string;
  artistCustomersCount: string;
  artistCountries: string;

  // Payment account details (admin-editable, shown at checkout)
  easypaisaNumber: string;
  easypaisaName: string;
  jazzcashNumber: string;
  jazzcashName: string;
  bankName: string;
  bankAccount: string;
  bankTitle: string;
  bankIban: string;
  codFee: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  announcementText: "Free Shipping on Orders Over PKR 5,000  |  Custom Artworks Available",
  announcementPhone: "+92 300 123 4567",

  instagramUrl: "https://instagram.com",
  facebookUrl: "https://facebook.com",
  youtubeUrl: "https://youtube.com",

  contactPhone: "+92 300 123 4567",
  contactEmail: "mahi@paintbymahi.com",
  contactAddress: "Lahore, Punjab, Pakistan",

  artistName: "Mahi",
  artistBio1: "My name is Mahi, and I've been painting since I was a child in Lahore, captivated by the rich colors of Pakistani culture, the geometric beauty of Islamic art, and the raw landscapes of my homeland.",
  artistBio2: "Over five years ago, I turned my lifelong passion into a professional practice, creating original handmade works that bridge tradition and contemporary expression.",
  artistYears: "5+",
  artistWorksCount: "200+",
  artistCustomersCount: "500+",
  artistCountries: "4",

  // Payment accounts
  easypaisaNumber: "0300-1234567",
  easypaisaName: "Paint by Mahi",
  jazzcashNumber: "0300-1234567",
  jazzcashName: "Paint by Mahi",
  bankName: "Meezan Bank",
  bankAccount: "01234567890",
  bankTitle: "Paint by Mahi",
  bankIban: "PK00MEZN0001234567890000",
  codFee: "200",
};

function loadSettings(): SiteSettings {
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

function saveSettings(s: SiteSettings) {
  if (typeof window === "undefined") return;
  if (typeof localStorage.setItem !== "function") return;
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch { /* ignore */ }
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
    const settings = loadSettings();
    set({ settings, hydrated: true });
  },
  update: (patch) => {
    const next = { ...get().settings, ...patch };
    set({ settings: next });
    saveSettings(next);
  },
}));
