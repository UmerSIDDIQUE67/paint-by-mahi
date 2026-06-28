"use client";

import dynamic from "next/dynamic";

/**
 * Client-only shell that loads components which must never run on the server.
 * `ssr: false` is only valid inside a Client Component in Next.js 15.
 */
const Navbar = dynamic(() => import("@/components/layout/Navbar"), { ssr: false });
const Toaster = dynamic(
  () => import("react-hot-toast").then((m) => ({ default: m.Toaster })),
  { ssr: false }
);

interface Props {
  children: React.ReactNode;
}

export default function ClientShell({ children }: Props) {
  return (
    <>
      <Navbar />
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "8px",
            fontFamily: "var(--font-geist-sans)",
          },
        }}
      />
    </>
  );
}
