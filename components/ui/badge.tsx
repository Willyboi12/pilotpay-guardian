import { cn } from "@/lib/utils";

export function Badge({ label, tone }: { label: string; tone: "success" | "danger" | "warning" }) {
  const color = {
    success: "bg-emerald-100 text-emerald-800",
    danger: "bg-red-100 text-red-800",
    warning: "bg-amber-100 text-amber-800",
  }[tone];

  return <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", color)}>{label}</span>;
}
