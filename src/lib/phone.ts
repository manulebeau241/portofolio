export function normalizeGabonPhone(input: string): string | null {
  const digits = input.replace(/[^\d]/g, "");
  // Accepte "241XXXXXXXX", "0XXXXXXXX" (9 chiffres) ou "XXXXXXXX" (8 chiffres)
  let local: string;
  if (digits.startsWith("241")) {
    local = digits.slice(3);
  } else if (digits.startsWith("0") && digits.length === 9) {
    local = digits.slice(1);
  } else {
    local = digits;
  }
  if (local.length !== 8) return null;
  return `+241${local}`;
}
