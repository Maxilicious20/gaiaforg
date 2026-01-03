"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function GlobalBackground() {
  const [bg, setBg] = useState("hero-bg.jpg");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/user/settings");
        if (!res.ok) return;
        const data = await res.json();
        if (mounted && data.backgroundImage) setBg(data.backgroundImage);
      } catch (e) {
        // ignore, keep default
        console.error("GlobalBackground load error:", e);
      }
    };
    load();
    return () => { mounted = false };
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      <Image src={`/${bg}`} alt="Background" fill className="object-cover opacity-40" priority />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/80 to-transparent" />
    </div>
  );
}
