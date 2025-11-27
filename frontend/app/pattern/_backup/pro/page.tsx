"use client";

import dynamic from "next/dynamic";

// This loads the big UI with NO SSR
const ProClient = dynamic(() => import("./ProClient"), {
  ssr: false,
});

export default function ProPageClient() {
  return <ProClient />;
}
