import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const xafFormatter = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 0,
});

export function formatXaf(amount: number) {
  return `${xafFormatter.format(amount)} FCFA`;
}

export function formatAvailability(min: number, max: number) {
  if (min === max) return `Disponible sous ${min} jours`;
  return `Disponible sous ${min}-${max} jours`;
}
