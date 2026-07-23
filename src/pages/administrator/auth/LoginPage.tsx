import axios from "axios";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

type LocationState = {
  from?: string;
};

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const destination =
    (location.state as LocationState | null)?.from ?? "/administrator/dashboard";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await login({ email, password });
      toast.success("Login berhasil.");
      navigate(destination, { replace: true });
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.status === 422
          ? "Email atau password salah."
          : "Gagal login admin.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-black px-4 py-10 text-white">
      <style>
        {`
          @keyframes adminLoginGlow {
            0%, 100% { transform: scale(1) translate3d(-2%, -1%, 0); opacity: 0.72; }
            50% { transform: scale(1.14) translate3d(2%, 2%, 0); opacity: 0.95; }
          }
        `}
      </style>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,126,84,0.45),transparent_35%),radial-gradient(circle_at_80%_65%,rgba(5,88,63,0.5),transparent_38%),linear-gradient(135deg,#000,#031d16_52%,#000)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.35),transparent_40%)] bg-[length:160%_160%] opacity-80 blur-2xl animate-[adminLoginGlow_10s_ease-in-out_infinite]" />
      <Card className="relative w-full max-w-md border-white/10 bg-white text-black shadow-2xl">
        <CardHeader className="space-y-3">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-normal">Admin Login</CardTitle>
            <CardDescription>
              Masuk untuk mengelola konten website PXDL.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@pxdlpro.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                  onClick={() => setIsPasswordVisible((current) => !current)}
                >
                  {isPasswordVisible ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                  <span className="sr-only">
                    {isPasswordVisible ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="h-10 w-full cursor-pointer gap-2 bg-[#005941] text-white hover:bg-[#047355]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <LogIn className="size-4" />
              )}
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
