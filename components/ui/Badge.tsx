import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  children: string;
  variant?: "category" | "status" | "price";
  color?: "default" | "success" | "warning" | "error";
  className?: string;
}

export default function Badge({
  children,
  variant = "category",
  color = "default",
  className,
}: BadgeProps) {
  if (variant === "category") {
    return (
      <span
        className={cn(
          "text-xs font-semibold text-accent tracking-wider",
          className
        )}
      >
        {"< "}
        {children}
        {" />"}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
        {
          "bg-white/10 text-white": color === "default",
          "bg-success/20 text-success": color === "success",
          "bg-warning/20 text-warning": color === "warning",
          "bg-error/20 text-error": color === "error",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
