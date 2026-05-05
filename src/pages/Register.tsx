import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Sprout, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { DEFAULT_ROLE_HOME } from "@/components/auth/RoleRoute";
import type { ApiError, Role } from "@/lib/api";

const registerSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters").max(128),
  role: z.enum(["FARMER", "PROCESSOR", "LOGISTICS", "RETAILER", "CONSUMER", "ADMIN"]),
});

type RegisterForm = z.infer<typeof registerSchema>;

const ROLE_COPY: Record<Role, string> = {
  FARMER: "Create batches and log base prices",
  PROCESSOR: "Add processing fees to created batches",
  LOGISTICS: "Record transport fees on processed batches",
  RETAILER: "Apply retail markup and generate QR codes",
  CONSUMER: "Scan QR codes to see on-chain provenance",
  ADMIN: "Platform-wide read-only analytics",
};

export default function Register() {
  const { register: doRegister, status, user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", role: "FARMER" },
  });

  const selectedRole = watch("role");

  if (status === "authenticated" && user) {
    return <Navigate to={DEFAULT_ROLE_HOME[user.role]} replace />;
  }

  async function onSubmit(values: RegisterForm) {
    setSubmitting(true);
    try {
      const created = await doRegister(values.email, values.password, values.role);
      toast.success(`Account created — welcome, ${created.email}`);
      navigate(DEFAULT_ROLE_HOME[created.role], { replace: true });
    } catch (err) {
      const e = err as ApiError;
      toast.error(e.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-muted/40 via-background to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center gap-2 text-center">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sprout className="size-5" />
          </div>
          <CardTitle>Join AgriChain</CardTitle>
          <CardDescription>Pick the role you play in the supply chain.</CardDescription>
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
              <Input id="password" type="password" autoComplete="new-password" {...register("password")} />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="role">Role</Label>
              <Select
                value={selectedRole}
                onValueChange={(v) => setValue("role", v as Role, { shouldValidate: true })}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FARMER">Farmer</SelectItem>
                  <SelectItem value="PROCESSOR">Processor</SelectItem>
                  <SelectItem value="LOGISTICS">Logistics</SelectItem>
                  <SelectItem value="RETAILER">Retailer</SelectItem>
                  <SelectItem value="CONSUMER">Consumer</SelectItem>
                  <SelectItem value="ADMIN">Admin (demo only)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{ROLE_COPY[selectedRole]}</p>
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? <><Loader2 className="mr-2 size-4 animate-spin" /> Creating…</> : "Create account"}
            </Button>
          </form>
          <p className="mt-5 text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
