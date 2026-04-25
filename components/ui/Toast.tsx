"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { X, CheckCircle, AlertCircle } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

export default function Toast({
  message,
  type = "info",
  duration = 4000,
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg transition-all duration-300",
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        {
          "bg-card border-card-border text-white": type === "info",
          "bg-success/10 border-success/30 text-success": type === "success",
          "bg-error/10 border-error/30 text-error": type === "error",
        }
      )}
    >
      {type === "success" && <CheckCircle size={18} />}
      {type === "error" && <AlertCircle size={18} />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <X size={16} />
      </button>
    </div>
  );
}
