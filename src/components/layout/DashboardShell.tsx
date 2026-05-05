import { type ReactNode, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard, Package, Settings, LogOut, Sprout, Factory, Truck, Store,
  ShieldCheck, Menu, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { CHAIN_NAME, CONTRACT_ADDRESS, type Role } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
}

const ROLE_MAIN_PATH: Record<Role, string> = {
  FARMER: "/farmer",
  PROCESSOR: "/processor",
  LOGISTICS: "/logistics",
  RETAILER: "/retailer",
  ADMIN: "/admin",
  CONSUMER: "/scan",
};

const ROLE_ICON: Record<Role, typeof LayoutDashboard> = {
  FARMER: Sprout,
  PROCESSOR: Factory,
  LOGISTICS: Truck,
  RETAILER: Store,
  ADMIN: ShieldCheck,
  CONSUMER: Package,
};

function navItemsForRole(role: Role): NavItem[] {
  const base = ROLE_MAIN_PATH[role];
  return [
    { label: "Overview", to: base, icon: LayoutDashboard },
    { label: "Batches", to: `${base}/batches`, icon: Package },
    { label: "Settings", to: `${base}/settings`, icon: Settings },
  ];
}

interface DashboardShellProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function DashboardShell({ title, subtitle, actions, children }: DashboardShellProps) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  if (!user) return null;
  const nav = navItemsForRole(user.role);
  const RoleIcon = ROLE_ICON[user.role];
  const initials = user.email.slice(0, 2).toUpperCase();

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 shrink-0 border-r bg-background md:flex md:flex-col">
        <SidebarInner role={user.role} nav={nav} />
      </aside>

      {/* Sidebar mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex w-72 flex-col bg-background">
            <div className="flex items-center justify-between p-4">
              <span className="text-sm font-semibold">Menu</span>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="size-4" />
              </Button>
            </div>
            <SidebarInner role={user.role} nav={nav} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </Button>

          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold sm:text-lg">{title}</h1>
              {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
            </div>
          </div>

          <Badge variant="outline" className="hidden gap-1.5 border-success/40 text-success sm:inline-flex">
            <span className="size-1.5 animate-pulse rounded-full bg-success" />
            {CHAIN_NAME}
          </Badge>

          {actions}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full border bg-background px-1.5 py-1 transition hover:bg-muted">
                <Avatar className="size-7">
                  <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
                </Avatar>
                <span className="hidden text-xs text-muted-foreground sm:inline">{user.email}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span className="text-xs font-normal text-muted-foreground">Signed in as</span>
                <span className="text-sm">{user.email}</span>
                <span className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                  <RoleIcon className="size-3" /> {user.role}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`${ROLE_MAIN_PATH[user.role]}/settings`}>
                  <Settings className="mr-2 size-4" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 size-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>

        <footer className="border-t bg-background px-4 py-3 text-[11px] text-muted-foreground sm:px-6">
          Contract <span className="font-mono">{CONTRACT_ADDRESS || "—"}</span> · {CHAIN_NAME}
        </footer>
      </div>
    </div>
  );
}

interface SidebarInnerProps {
  role: Role;
  nav: NavItem[];
}

function SidebarInner({ role, nav }: SidebarInnerProps) {
  const RoleIcon = ROLE_ICON[role];
  return (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center gap-2 px-5 py-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sprout className="size-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">AgriChain</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">on-chain supply trust</span>
        </div>
      </Link>
      <Separator />
      <div className="px-3 py-3">
        <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-xs">
          <RoleIcon className="size-4 text-primary" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Workspace</span>
            <span className="font-medium">{role.charAt(0) + role.slice(1).toLowerCase()}</span>
          </div>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === nav[0].to}
              className={({ isActive: navActive }) =>
                cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition",
                  navActive
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )
              }
            >
              <Icon className="size-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-3 text-[10px] text-muted-foreground">
        <div>Network</div>
        <div className="font-mono text-foreground">{CHAIN_NAME}</div>
      </div>
    </div>
  );
}
