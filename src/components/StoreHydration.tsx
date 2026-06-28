"use client";

import { useEffect } from "react";
import { useCartStore, useWishlistStore, useUserStore, useOrdersStore } from "@/lib/store";
import { useSettingsStore } from "@/lib/siteSettings";

export default function StoreHydration() {
  const hydrateCart = useCartStore((s) => s.hydrate);
  const hydrateWishlist = useWishlistStore((s) => s.hydrate);
  const hydrateSettings = useSettingsStore((s) => s.hydrate);
  const hydrateUser = useUserStore((s) => s.hydrate);
  const hydrateOrders = useOrdersStore((s) => s.hydrate);

  useEffect(() => {
    hydrateCart();
    hydrateWishlist();
    hydrateSettings();
    hydrateUser();
    hydrateOrders();
  }, [hydrateCart, hydrateWishlist, hydrateSettings, hydrateUser, hydrateOrders]);

  return null;
}
