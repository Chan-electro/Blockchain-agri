import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

const footerLinks: Record<string, { label: string; href: string }[]> = {
  Platform: [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Stakeholders", href: "#stakeholders" },
    { label: "Global Impact", href: "#impact" },
    { label: "FAQ", href: "#faq" },
  ],
  "Get Access": [
    { label: "Sign In", href: "/login" },
    { label: "Register", href: "/register" },
    { label: "Start Demo", href: "/select-role" },
  ],
  Roles: [
    { label: "Farmer Dashboard", href: "/register" },
    { label: "Processor Dashboard", href: "/register" },
    { label: "Logistics Dashboard", href: "/register" },
    { label: "Retailer Dashboard", href: "/register" },
  ],
};

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-[#F8F9FA] rounded-t-[2rem] md:rounded-t-[2.5rem] px-4 md:px-5 pt-10 md:pt-16 pb-6 md:pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 md:mb-12 grid grid-cols-2 gap-6 md:gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Leaf className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-black tracking-tight">AgriChain</span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Blockchain-based supply chain transparency for agricultural produce.
              A student capstone project built with Ethereum, React, and a passion
              for food integrity.
            </p>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="mb-4 text-xs font-black uppercase tracking-[0.15em] text-foreground/60">
                {group}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("#") ? (
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-border/50 pt-6 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AgriChain — Student project. Blockchain-Based Supply Chain Transparency for Agricultural Produce.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-indigo-400" />
            Sepolia Testnet
          </div>
        </div>
      </div>
    </footer>
  );
}
