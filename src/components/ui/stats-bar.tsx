import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { value: 500, suffix: "+", label: "Farmers Onboarded" },
  { value: 12000, suffix: "+", label: "Batches Tracked" },
  { value: 5, suffix: "", label: "Supply Chain Stages" },
  { value: 100, suffix: "%", label: "Tamper-Proof Records" },
  { value: 3, suffix: "s", label: "Avg. Verification Time" },
];

function useCounter(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let current = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, active]);
  return count;
}

function StatItem({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const count = useCounter(stat.value, 1800, isInView);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1 px-6 py-6">
      <span className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
        {count.toLocaleString()}
        <span className="text-primary">{stat.suffix}</span>
      </span>
      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground md:text-sm">
        {stat.label}
      </span>
    </div>
  );
}

export function StatsBar() {
  return (
    <section className="border-y border-border/50 bg-muted/20">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center divide-y divide-border/30 md:divide-x md:divide-y-0">
        {stats.map((stat) => (
          <StatItem key={stat.label} stat={stat} />
        ))}
      </div>
    </section>
  );
}
