"use client";

import { useEffect } from "react";
import { useCartStore, useWishlistStore, useUserStore, useOrdersStore, useArtworkStore } from "@/lib/store";
import { useSettingsStore } from "@/lib/siteSettings";

export default function StoreHydration() {
  const hydrateCart = useCartStore((s) => s.hydrate);
  const hydrateWishlist = useWishlistStore((s) => s.hydrate);
  const hydrateSettings = useSettingsStore((s) => s.hydrate);
  const hydrateUser = useUserStore((s) => s.hydrate);
  const hydrateOrders = useOrdersStore((s) => s.hydrate);
  const hydrateArtworks = useArtworkStore((s) => s.hydrate);

  useEffect(() => {
    hydrateCart();
    hydrateWishlist();
    hydrateSettings();
    hydrateUser();
    hydrateOrders();
    hydrateArtworks();
  }, [hydrateCart, hydrateWishlist, hydrateSettings, hydrateUser, hydrateOrders, hydrateArtworks]);

  return null;
}
