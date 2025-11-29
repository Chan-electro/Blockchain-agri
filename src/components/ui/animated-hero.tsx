import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    MoveRight,
    PhoneCall,
    ShieldCheck,
    Sparkles,
    Timer,
    GitBranch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function Hero() {
    const [titleNumber, setTitleNumber] = useState(0);
    const titles = useMemo(
        () => ["transparent", "secure", "efficient", "traceable", "smart"],
        []
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (titleNumber === titles.length - 1) {
                setTitleNumber(0);
            } else {
                setTitleNumber(titleNumber + 1);
            }
        }, 2000);
        return () => clearTimeout(timeoutId);
    }, [titleNumber, titles]);

    return (
        <div className="relative w-full overflow-hidden bg-background text-foreground">
            <div className="absolute inset-0 -z-10">
                <div className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -left-10 bottom-16 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.12),transparent_30%)]" />
            </div>

            <div className="container relative mx-auto px-6 py-24 lg:py-36">
                <div className="mb-10 flex items-center justify-center">
                    <motion.div
                        className="inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-sm font-medium text-primary backdrop-blur"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Sparkles className="h-4 w-4" />
                        Read our launch article
                        <MoveRight className="h-4 w-4" />
                    </motion.div>
                </div>

                <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="relative space-y-10 text-center lg:text-left">
                        <div className="flex flex-col gap-4">
                            <p className="inline-flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                                Blockchain for food integrity
                            </p>
                            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tighter sm:text-5xl md:text-6xl">
                                Supply chains made
                                <span className="relative block pt-4 text-primary">
                                    {titles.map((title, index) => (
                                        <motion.span
                                            key={index}
                                            className="absolute left-1/2 -translate-x-1/2 text-center drop-shadow-md lg:left-0 lg:translate-x-0"
                                            initial={{ opacity: 0, y: "-100%" }}
                                            animate={
                                                titleNumber === index
                                                    ? { y: 0, opacity: 1 }
                                                    : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                                            }
                                            transition={{ type: "spring", stiffness: 70, damping: 12 }}
                                        >
                                            {title}
                                        </motion.span>
                                    ))}
                                    <span className="opacity-0">transparent</span>
                                </span>
                            </h1>
                            <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl lg:max-w-2xl">
                                Trace every grain from farm to plate with a carbon-neutral digital thread. Ensure transparency,
                                fair pricing, and quality with our blockchain-based solution.
                            </p>
                        </div>

                        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                            <Link to="/select-role" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full gap-3 text-base shadow-lg shadow-primary/20">
                                    Start Demo
                                    <MoveRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            <a href="#how-it-works" className="w-full sm:w-auto">
                                <Button size="lg" variant="outline" className="w-full gap-3 text-base">
                                    How It Works
                                    <PhoneCall className="h-4 w-4" />
                                </Button>
                            </a>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:items-center sm:gap-6 lg:gap-10">
                            {["Immutable logs", "Real-time telemetry", "GS1-ready", "AI quality checks"].map((pill) => (
                                <span
                                    key={pill}
                                    className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/60 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground backdrop-blur"
                                >
                                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                    {pill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-primary/15 blur-2xl" />
                        <div className="absolute -right-4 bottom-10 h-28 w-28 rounded-full bg-emerald-400/20 blur-3xl" />

                        <motion.div
                            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-background/80 via-background/70 to-primary/5 p-6 shadow-2xl backdrop-blur-xl"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Security</p>
                                        <p className="text-sm font-semibold">Zero tamper tolerance</p>
                                    </div>
                                </div>
                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                    Live
                                </span>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-4">
                                {[{ label: "Avg. verification", value: "1.2s", icon: <Timer className="h-4 w-4" /> }, { label: "Supply routes", value: "142", icon: <GitBranch className="h-4 w-4" /> }].map((stat, index) => (
                                    <div key={index} className="rounded-2xl border border-border/70 bg-background/70 p-4">
                                        <div className="flex items-center justify-between text-muted-foreground">
                                            <p className="text-xs font-semibold uppercase tracking-wide">{stat.label}</p>
                                            {stat.icon}
                                        </div>
                                        <p className="mt-3 text-2xl font-semibold">{stat.value}</p>
                                        <div className="mt-4 h-2 rounded-full bg-primary/10">
                                            <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-primary to-emerald-400" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 grid gap-3">
                                {["Farmer provenance", "Cold chain integrity", "Retail authenticity"].map((tag, index) => (
                                    <motion.div
                                        key={tag}
                                        className="flex items-center justify-between rounded-xl border border-border/60 bg-background/70 px-4 py-3 text-sm"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                    >
                                        <span className="flex items-center gap-2">
                                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                                            {tag}
                                        </span>
                                        <MoveRight className="h-4 w-4 text-muted-foreground" />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { Hero };
