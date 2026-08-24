import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STEPS,
} from "@/components/ui/OrderStatusBadge";
import type { OrderStatus } from "@/generated/prisma/enums";

export function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === "CANCELLED") return null;

  const currentStepIndex = ORDER_STATUS_STEPS.indexOf(status);

  return (
    <ol className="flex flex-col gap-0">
      {ORDER_STATUS_STEPS.map((step, i) => {
        const done = i <= currentStepIndex;
        return (
          <li key={step} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                  done ? "bg-forest-700 text-sand-50" : "bg-forest-100 text-forest-400"
                )}
              >
                {done && <Check size={13} />}
              </span>
              {i < ORDER_STATUS_STEPS.length - 1 && (
                <span className={cn("h-8 w-px", done ? "bg-forest-700" : "bg-forest-100")} />
              )}
            </div>
            <span className={cn("pb-6 text-sm", done ? "font-semibold text-forest-950" : "text-forest-400")}>
              {ORDER_STATUS_LABELS[step]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
