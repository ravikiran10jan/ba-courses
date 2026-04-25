"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lessonSchema } from "@/lib/utils/validators";
import type { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { getAdminForms } from "@/lib/content";

const lf = getAdminForms().lessonForm;

type LessonFormValues = z.infer<typeof lessonSchema>;

interface LessonFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LessonFormValues & { videoPath?: string; duration?: number }) => Promise<void>;
  initialData?: Partial<LessonFormValues> & { videoPath?: string; duration?: number };
  loading?: boolean;
}

export default function LessonForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}: LessonFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: initialData?.title || "",
      weekNumber: initialData?.weekNumber || 1,
      order: initialData?.order || 1,
      isPreview: initialData?.isPreview || false,
    },
  });

  const handleFormSubmit = async (data: LessonFormValues) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData?.title ? lf.editTitle : lf.addTitle}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        <Input
          label={lf.titleLabel}
          id="lessonTitle"
          placeholder={lf.titlePlaceholder}
          error={errors.title?.message}
          {...register("title")}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label={lf.weekNumberLabel}
            id="weekNumber"
            type="number"
            min={1}
            error={errors.weekNumber?.message}
            {...register("weekNumber", { valueAsNumber: true })}
          />
          <Input
            label={lf.orderLabel}
            id="order"
            type="number"
            min={1}
            error={errors.order?.message}
            {...register("order", { valueAsNumber: true })}
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isPreview"
            {...register("isPreview")}
            className="w-4 h-4 rounded border-[#444444] bg-[#0f172a] text-[#FF1493] focus:ring-[#FF1493]/50 focus:ring-offset-0 cursor-pointer"
          />
          <label
            htmlFor="isPreview"
            className="text-sm font-medium text-[#999999] cursor-pointer"
          >
            {lf.previewLabel}
          </label>
        </div>

        {/* Video upload area */}
        <div className="w-full">
          <label className="block text-sm font-medium text-[#999999] mb-1.5">
            {lf.videoLabel}
          </label>
          <div className="border-2 border-dashed border-[#444444] rounded-lg p-6 text-center hover:border-[#FF1493]/40 transition-colors">
            <input
              type="file"
              accept="video/*"
              className="w-full text-sm text-[#999999] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#FF1493]/10 file:text-[#FF1493] hover:file:bg-[#FF1493]/20 cursor-pointer"
            />
            <p className="text-xs text-[#666666] mt-2">
              {lf.videoFormats}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" loading={loading} size="sm">
            {initialData?.title ? lf.updateButton : lf.addButton}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              reset();
              onClose();
            }}
          >
            {lf.cancelButton}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
