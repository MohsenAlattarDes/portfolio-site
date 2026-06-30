"use client";

import { useEffect, useState } from "react";

const timeStyle: React.CSSProperties = {
  fontFamily: "var(--font-secondary)",
  letterSpacing: "0.06em",
  color: "var(--red)",
  fontVariantNumeric: "tabular-nums",
  textTransform: "uppercase",
};

const timeClass =
  "text-[9px] sm:text-[10px] md:text-[11px] lg:text-[11px] xl:text-[12px]";

function formatTime(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

export default function FooterTimes() {
  const [times, setTimes] = useState<{ kw: string; la: string } | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTimes({
        kw: formatTime(now, "Asia/Kuwait"),
        la: formatTime(now, "America/Los_Angeles"),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
      <span className={timeClass} style={timeStyle}>
        KUWAIT {times?.kw ?? "--:--:--"}
      </span>
      <span className={timeClass} style={timeStyle}>
        LOS ANGELES {times?.la ?? "--:--:--"}
      </span>
    </div>
  );
}
