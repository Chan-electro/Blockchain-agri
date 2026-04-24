import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Sprout, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { DEFAULT_ROLE_HOME } from "@/components/auth/RoleRoute";
import type { ApiError } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, status, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  if (status === "authenticated" && user) {
    return <Navigate to={DEFAULT_ROLE_HOME[user.role]} replace />;
  }

  async function onSubmit(values: LoginForm) {
    setSubmitting(true);
    try {
      const loggedIn = await login(values.email, values.password);
      toast.success(`Welcome back, ${loggedIn.email}`);
      const state = location.state as { from?: string } | null;
      const dest = state?.from && state.from !== "/login" ? state.from : DEFAULT_ROLE_HOME[loggedIn.role];
      navigate(dest, { replace: true });
    } catch (err) {
      const e = err as ApiError;
      toast.error(e.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-muted/40 via-background to-primary/5 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center gap-2 text-center">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sprout className="size-5" />
          </div>
          <CardTitle>Sign in to AgriChain</CardTitle>
          <CardDescription>Every handoff goes on-chain. Track your batches end-to-end.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete="current-password" {...register("password")} />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? <><Loader2 className="mr-2 size-4 animate-spin" /> Signing in…</> : "Sign in"}
            </Button>
          </form>

          <div className="mt-5 rounded-lg border bg-muted/40 p-3 text-xs">
            <p className="mb-1 font-medium">Demo accounts (password <span className="font-mono">demo12345</span>):</p>
            <ul className="space-y-0.5 font-mono text-[11px] text-muted-foreground">
              <li>farmer@demo.agri</li>
              <li>processor@demo.agri</li>
              <li>logistics@demo.agri</li>
              <li>retailer@demo.agri</li>
              <li>admin@demo.agri</li>
            </ul>
          </div>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            New here?{" "}
            <Link to="/register" className="font-medium text-primary underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
