import { randomBytes } from "node:crypto";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomCode(length: number) {
  const bytes = randomBytes(length);
  return Array.from(bytes, (b) => CODE_CHARS[b % CODE_CHARS.length]).join("");
}

export function generateOrderNumber() {
  return `OKM-${Date.now().toString(36).toUpperCase()}${randomCode(2)}`;
}

export function generatePickupCode() {
  return `OKM-${randomCode(4)}`;
}

export const RELAY_COMMISSION_XAF = 1500;
