/**
 * Next.js instrumentation hook — runs once before the server starts.
 *
 * Node.js 25 introduces an experimental Web Storage API that injects a
 * `localStorage` global, but without a valid --localstorage-file path it
 * creates a stub object where all methods are undefined.  The Next.js dev
 * overlay (and any other code that checks `typeof localStorage !== 'undefined'`
 * then calls `.getItem()`) crashes with "localStorage.getItem is not a function".
 *
 * We replace the broken stub with a safe no-op shim so SSR never throws.
 */
export async function register() {
  if (typeof localStorage !== "undefined" && typeof localStorage.getItem !== "function") {
    // Broken Node 25 localStorage stub — replace with a safe in-memory shim
    const store = new Map<string, string>();
    const shim: Storage = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => { store.set(key, value); },
      removeItem: (key: string) => { store.delete(key); },
      clear: () => { store.clear(); },
      key: (index: number) => [...store.keys()][index] ?? null,
      get length() { return store.size; },
    };
    Object.defineProperty(globalThis, "localStorage", {
      value: shim,
      writable: true,
      configurable: true,
    });
  }
}
