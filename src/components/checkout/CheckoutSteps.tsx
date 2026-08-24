import { cn } from "@/lib/utils";

const steps = [
  { key: "point-relais", label: "Point relais" },
  { key: "paiement", label: "Paiement" },
  { key: "confirmation", label: "Confirmation" },
] as const;

export function CheckoutSteps({ current }: { current: (typeof steps)[number]["key"] }) {
  const currentIndex = steps.findIndex((s) => s.key === current);

  return (
    <ol className="mb-6 flex items-center gap-2">
      {steps.map((step, i) => (
        <li key={step.key} className="flex flex-1 items-center gap-2">
          <span
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
              i <= currentIndex
                ? "bg-forest-700 text-sand-50"
                : "bg-forest-100 text-forest-400"
            )}
          >
            {i + 1}
          </span>
          <span
            className={cn(
              "hidden text-xs font-medium sm:inline",
              i <= currentIndex ? "text-forest-800" : "text-forest-400"
            )}
          >
            {step.label}
          </span>
          {i < steps.length - 1 && (
            <span
              className={cn(
                "h-px flex-1",
                i < currentIndex ? "bg-forest-700" : "bg-forest-100"
              )}
            />
          )}
        </li>
      ))}
    </ol>
  );
}
