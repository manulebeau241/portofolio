"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: form.get("phone"),
        password: form.get("password"),
      }),
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Une erreur est survenue");
      return;
    }

    router.push(searchParams.get("next") ?? "/compte");
    router.refresh();
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-5 px-4 py-10">
      <div>
        <h1 className="text-xl font-bold text-forest-950">Connexion</h1>
        <p className="mt-1 text-sm text-forest-500">
          Connectez-vous avec votre numéro de téléphone.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className="text-sm font-medium text-forest-800">
            Numéro de téléphone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="077 00 00 00"
            className="h-11 rounded-xl border border-forest-200 px-3 text-sm focus:border-forest-500 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium text-forest-800">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="h-11 rounded-xl border border-forest-200 px-3 text-sm focus:border-forest-500 focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={loading} className="mt-2">
          {loading ? "Connexion…" : "Se connecter"}
        </Button>
      </form>

      <p className="text-center text-sm text-forest-500">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="font-semibold text-forest-800 underline underline-offset-2">
          S&apos;inscrire
        </Link>
      </p>
    </div>
  );
}
