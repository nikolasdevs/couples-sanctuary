"use client";

import { BottomNav } from "@/components/dashboard/BottomNav";
import { JoinPartner } from "@/components/sync/JoinPartner";
import { useSync, type SyncSession } from "@/lib/useSync";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

function JoinContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getSession, loading, error } = useSync();
  const [initialCode] = useState(() => searchParams.get("code") ?? "");

  const handleJoin = useCallback(
    async (code: string) => {
      const session = await getSession(code);
      if (!session) return;

      // Determine which partner slot is available
      const partner = session.partnerA ? "B" : "B"; // Joiner is always Partner B

      if (session.type === "checkin") {
        router.push(
          `/checkin/active?sync=${code}&partner=${partner}&weekKey=${session.weekKey ?? ""}`,
        );
      } else {
        router.push(
          `/compatibility/assess?sync=${code}&partner=${partner}`,
        );
      }
    },
    [getSession, router],
  );

  // Auto-join if code in URL
  useEffect(() => {
    if (initialCode.length === 6) {
      handleJoin(initialCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-dvh bg-[#0A0A0A] pb-24">
      <div className="mx-auto w-full max-w-xl px-5 pt-8">
        <JoinPartner
          accentBg="bg-purple-600"
          accentText="text-white"
          onJoin={handleJoin}
          onBack={() => router.push("/dashboard")}
          loading={loading}
          error={error}
        />
      </div>
      <BottomNav />
    </main>
  );
}

export default function JoinPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-dvh bg-[#0A0A0A] flex items-center justify-center">
          <div className="h-6 w-40 animate-pulse rounded-lg bg-white/5" />
        </main>
      }
    >
      <JoinContent />
    </Suspense>
  );
}
