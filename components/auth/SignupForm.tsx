"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { signupSchema, type SignupFormData } from "@/lib/utils/validators";
import { signUpWithEmail } from "@/lib/firebase/auth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import GoogleAuthButton from "./GoogleAuthButton";
import { getAuthForms } from "@/lib/content";

const af = getAuthForms();
const t = af.signup;

export default function SignupForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    try {
      await signUpWithEmail(data.email, data.password, data.name);
      router.push("/dashboard");
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
          {af.tagline}
        </span>
        <h1 className="text-3xl font-black mt-3">{t.heading}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          id="name"
          type="text"
          label={t.nameLabel}
          placeholder={t.namePlaceholder}
          error={errors.name?.message}
          {...register("name")}
        />

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

        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            label={t.confirmPasswordLabel}
            placeholder={t.confirmPasswordPlaceholder}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-[38px] text-muted-foreground hover:text-white transition-colors"
            aria-label={showConfirmPassword ? af.hidePassword : af.showPassword}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
        {t.hasAccount}{" "}
        <Link
          href="/login"
          className="text-accent hover:text-accent-hover font-semibold transition-colors"
        >
          {t.logInLink}
        </Link>
      </p>

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
