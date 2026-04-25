"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema } from "@/lib/utils/validators";
import type { z } from "zod";
import { generateSlug } from "@/lib/utils/slug";
import { useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { getAdminForms } from "@/lib/content";

const cf = getAdminForms().courseForm;

type CourseFormValues = z.infer<typeof courseSchema>;

const CATEGORIES = [
  { value: "BlockchainDevelopment", label: "Blockchain Development" },
  { value: "AI/ML", label: "AI / ML" },
  { value: "Web3", label: "Web3" },
  { value: "FullStack", label: "Full Stack" },
];

interface CourseFormProps {
  initialData?: Partial<CourseFormValues> & {
    language?: string;
    tooling?: string;
    thumbnailUrl?: string;
  };
  onSubmit: (data: CourseFormValues & { language?: string; tooling?: string; thumbnailUrl?: string }) => Promise<void>;
  loading?: boolean;
}

export default function CourseForm({
  initialData,
  onSubmit,
  loading = false,
}: CourseFormProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnailUrl || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      shortDescription: initialData?.shortDescription || "",
      category: initialData?.category || "",
      price: initialData?.price || 0,
      originalPrice: initialData?.originalPrice || 0,
      duration: initialData?.duration || "",
      isPublished: initialData?.isPublished || false,
    },
  });

  const title = watch("title");

  useEffect(() => {
    if (title && !initialData?.slug) {
      setValue("slug", generateSlug(title));
    }
  }, [title, setValue, initialData?.slug]);

  async function handleThumbnailUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("path", `courses/thumbnails/${Date.now()}`);

      const res = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setThumbnailUrl(data.url);
      }
    } catch {
      // Upload failed silently
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        const formEl = document.querySelector("form") as HTMLFormElement;
        const language = (formEl?.querySelector('[name="language"]') as HTMLInputElement)?.value || "";
        const tooling = (formEl?.querySelector('[name="tooling"]') as HTMLInputElement)?.value || "";
        await onSubmit({ ...data, language, tooling, thumbnailUrl });
      })}
      className="space-y-6 max-w-2xl"
    >
      <Input
        label={cf.titleLabel}
        id="title"
        placeholder={cf.titlePlaceholder}
        error={errors.title?.message}
        {...register("title")}
      />

      <Input
        label={cf.slugLabel}
        id="slug"
        placeholder={cf.slugPlaceholder}
        error={errors.slug?.message}
        {...register("slug")}
      />

      <Textarea
        label={cf.descriptionLabel}
        id="description"
        placeholder={cf.descriptionPlaceholder}
        rows={5}
        error={errors.description?.message}
        {...register("description")}
      />

      <Input
        label={cf.shortDescriptionLabel}
        id="shortDescription"
        placeholder={cf.shortDescriptionPlaceholder}
        error={errors.shortDescription?.message}
        {...register("shortDescription")}
      />

      {/* Thumbnail Upload */}
      <div className="w-full">
        <label className="block text-sm font-medium text-[#999999] mb-1.5">
          {cf.thumbnailLabel}
        </label>
        <div className="flex items-center gap-4">
          {thumbnailUrl ? (
            <div className="w-32 h-20 rounded-lg border border-card-border overflow-hidden bg-card">
              <img src={thumbnailUrl} alt={cf.thumbnailAlt} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-32 h-20 rounded-lg border border-dashed border-card-border flex items-center justify-center bg-card">
              <Upload size={20} className="text-muted" />
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleThumbnailUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            loading={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {thumbnailUrl ? cf.changeButton : cf.uploadButton}
          </Button>
        </div>
      </div>

      <div className="w-full">
        <label
          htmlFor="category"
          className="block text-sm font-medium text-[#999999] mb-1.5"
        >
          {cf.categoryLabel}
        </label>
        <select
          id="category"
          {...register("category")}
          className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FF1493]/50 focus:border-[#FF1493] transition-colors"
        >
          <option value="">{cf.categoryPlaceholder}</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        {errors.category?.message && (
          <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={cf.priceLabel}
          id="price"
          type="number"
          placeholder="0"
          error={errors.price?.message}
          {...register("price", { valueAsNumber: true })}
        />
        <Input
          label={cf.originalPriceLabel}
          id="originalPrice"
          type="number"
          placeholder="0"
          error={errors.originalPrice?.message}
          {...register("originalPrice", { valueAsNumber: true })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={cf.durationLabel}
          id="duration"
          placeholder={cf.durationPlaceholder}
          error={errors.duration?.message}
          {...register("duration")}
        />
        <Input
          label={cf.languageLabel}
          id="language"
          name="language"
          placeholder={cf.languagePlaceholder}
          defaultValue={initialData?.language || ""}
        />
      </div>

      <Input
        label={cf.toolingLabel}
        id="tooling"
        name="tooling"
        placeholder={cf.toolingPlaceholder}
        defaultValue={initialData?.tooling || ""}
      />

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isPublished"
          {...register("isPublished")}
          className="w-4 h-4 rounded border-[#444444] bg-[#0f172a] text-[#FF1493] focus:ring-[#FF1493]/50 focus:ring-offset-0 cursor-pointer"
        />
        <label
          htmlFor="isPublished"
          className="text-sm font-medium text-[#999999] cursor-pointer"
        >
          {cf.publishedLabel}
        </label>
      </div>

      <div className="pt-4">
        <Button type="submit" loading={loading}>
          {cf.saveButton}
        </Button>
      </div>
    </form>
  );
}
