"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { loginSchema, type LoginFormData } from "@/lib/utils/validators";
import { signInWithEmail } from "@/lib/firebase/auth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import GoogleAuthButton from "./GoogleAuthButton";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { getAuthForms } from "@/lib/content";

const af = getAuthForms();
const t = af.login;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await signInWithEmail(data.email, data.password);
      router.push(redirectTo);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : t.errorFallback;
      setToast({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <span className="text-xs font-semibold text-accent tracking-wider">
          {"< HOME FOR LEARNING />"}
        </span>
        <h1 className="text-3xl font-black mt-3">Login</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          id="email"
          type="email"
          label={t.emailLabel}
          placeholder={t.emailPlaceholder}
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            label={t.passwordLabel}
            placeholder={t.passwordPlaceholder}
            error={errors.password?.message}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-muted-foreground hover:text-white transition-colors"
            aria-label={showPassword ? af.hidePassword : af.showPassword}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-card-border bg-input accent-accent"
            />
            <span className="text-muted">Remember me</span>
          </label>
          <button
            type="button"
            onClick={() => setShowForgotModal(true)}
            className="text-accent hover:text-accent-hover transition-colors font-medium"
          >
            {t.forgotPassword}
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full rounded-lg"
        >
          {t.submitButton}
        </Button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-card-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-4 text-muted-foreground">{t.or}</span>
        </div>
      </div>

      <GoogleAuthButton />

      <p className="text-center text-sm text-muted mt-8">
        {t.noAccount}{" "}
        <Link
          href="/signup"
          className="text-accent hover:text-accent-hover font-semibold transition-colors"
        >
          {t.signUpLink}
        </Link>
      </p>

      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
