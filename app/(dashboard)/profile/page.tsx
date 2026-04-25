"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileFormData } from "@/lib/utils/validators";
import { useAuth } from "@/hooks/useAuth";
import { updateDocument } from "@/lib/firebase/firestore";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import Toast from "@/components/ui/Toast";
import { getProfile } from "@/lib/content";

const p = getProfile();

export default function ProfilePage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || "",
        phone: profile.phone || "",
        country: profile.country || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    setSaving(true);
    try {
      await updateDocument("users", user.uid, {
        name: data.name,
        phone: data.phone || "",
        country: data.country || "",
      });
      setToast({ message: p.successMessage, type: "success" });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : p.errorFallback;
      setToast({ message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      setToast({ message: p.avatarFileError, type: "error" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setToast({ message: p.avatarSizeError, type: "error" });
      return;
    }

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("path", `avatars/${user.uid}`);

      const res = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      await updateDocument("users", user.uid, { avatarUrl: data.url });
      setToast({ message: p.avatarSuccess, type: "success" });
    } catch {
      setToast({
        message: p.avatarError,
        type: "error",
      });
    } finally {
      setUploadingAvatar(false);
      // Reset the file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  const avatarLetter =
    (profile?.name || user?.displayName || "U").charAt(0).toUpperCase();

  return (
    <div>
      <h1 className="text-3xl font-black mb-8">{p.heading}</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-lg bg-card border border-card-border flex items-center justify-center overflow-hidden">
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={p.avatarAlt}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-accent">
                {avatarLetter}
              </span>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
          <Button
            variant="secondary"
            size="sm"
            className="rounded-lg"
            loading={uploadingAvatar}
            onClick={() => fileInputRef.current?.click()}
          >
            {p.changeImage}
          </Button>
        </div>

        {/* Profile Form */}
        <div className="flex-1 max-w-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              id="name"
              type="text"
              label={p.nameLabel}
              placeholder={p.namePlaceholder}
              error={errors.name?.message}
              {...register("name")}
            />

            <Input
              id="email"
              type="email"
              label={p.emailLabel}
              value={user?.email || ""}
              disabled
              readOnly
              className="opacity-60"
            />

            <Input
              id="phone"
              type="tel"
              label={p.phoneLabel}
              placeholder={p.phonePlaceholder}
              error={errors.phone?.message}
              {...register("phone")}
            />

            <Input
              id="country"
              type="text"
              label={p.countryLabel}
              placeholder={p.countryPlaceholder}
              error={errors.country?.message}
              {...register("country")}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={saving}
              className="rounded-lg"
            >
              {p.saveButton}
            </Button>
          </form>
        </div>
      </div>

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
