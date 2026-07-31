"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCareshift } from "@/lib/store";

export default function BriefIndexPage() {
  const router = useRouter();
  const { patients } = useCareshift();
  const next = patients.find((p) => p.status !== "briefed") ?? patients[0];

  useEffect(() => {
    router.replace(next ? `/brief/${next.id}` : "/patients");
  }, [next, router]);

  return (
    <p className="px-4 py-6 text-base text-ink-muted" role="status">
      Opening your next brief…
    </p>
  );
}
