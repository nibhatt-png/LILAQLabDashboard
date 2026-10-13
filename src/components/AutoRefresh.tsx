"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Re-renders the page's server components on an interval to pull fresh data. */
export default function AutoRefresh({ seconds }: { seconds: number }) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => router.refresh(), seconds * 1000);
    return () => clearInterval(id);
  }, [router, seconds]);

  return null;
}
