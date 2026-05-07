import { useEffect, useState } from "react";

interface CountUpProps {
  to: number;
  duration?: number;
  decimals?: number;
}

export default function CountUp({ to, duration = 1200, decimals = 0 }: CountUpProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(to * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);

  return <>{value.toFixed(decimals)}</>;
}