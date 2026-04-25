import Card from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  className?: string;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("flex items-center gap-4", className)}>
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#FF1493]/10">
        <Icon size={24} className="text-[#FF1493]" />
      </div>
      <div>
        <p className="text-sm text-[#999999] font-medium">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </Card>
  );
}
