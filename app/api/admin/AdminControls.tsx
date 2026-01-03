"use client";
import { useRouter } from "next/navigation";

export default function AdminControls({ modId }: { modId: string }) {
  const router = useRouter();

  const handleAction = async (action: "approve" | "reject") => {
    await fetch("/api/admin/approve", {
        method: "POST",
        body: JSON.stringify({ modId, action })
    });
    router.refresh(); // Seite neu laden
  };

  return (
    <div className="flex flex-col gap-2">
        <button onClick={() => handleAction("approve")} className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded font-bold">
            ✅ Approve
        </button>
        <button onClick={() => handleAction("reject")} className="px-6 py-2 bg-red-900/50 hover:bg-red-900 text-red-200 border border-red-800 rounded text-sm">
            ❌ Reject
        </button>
    </div>
  );
}