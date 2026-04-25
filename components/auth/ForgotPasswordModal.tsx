"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendPasswordResetEmail } from "@/lib/firebase/auth";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { getAuthForms } from "@/lib/content";

const fp = getAuthForms().forgotPassword;

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
}: ForgotPasswordModalProps) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    setFeedback(null);
    try {
      await sendPasswordResetEmail(data.email);
      setFeedback({
        message: fp.successMessage,
        type: "success",
      });
      reset();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : fp.errorFallback;
      setFeedback({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFeedback(null);
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={fp.title}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <p className="text-sm text-muted">
          {fp.description}
        </p>

        <Input
          id="reset-email"
          type="email"
          label={fp.emailLabel}
          placeholder={fp.emailPlaceholder}
          error={errors.email?.message}
          {...register("email")}
        />

        {feedback && (
          <p
            className={`text-sm ${
              feedback.type === "success" ? "text-success" : "text-error"
            }`}
          >
            {feedback.message}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
          className="w-full rounded-lg"
        >
          {fp.submitButton}
        </Button>
      </form>
    </Modal>
  );
}
