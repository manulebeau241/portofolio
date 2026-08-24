"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function LogoutButton({
  className,
  size,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      size={size}
      className={className}
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
        router.refresh();
      }}
    >
      Se déconnecter
    </Button>
  );
}
