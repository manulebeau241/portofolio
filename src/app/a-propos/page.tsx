export const metadata = { title: "À propos — Okoumia" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">
      <h1 className="text-xl font-bold text-forest-950">À propos d&apos;Okoumia</h1>
      <div className="mt-4 flex flex-col gap-4 text-sm leading-relaxed text-forest-700">
        <p>
          Okoumia est né d&apos;un constat simple : beaucoup de produits —
          mode, accessoires, petit électronique, cosmétique — restent
          difficiles à trouver à Libreville, ou se vendent avec des marges et
          des frais peu transparents.
        </p>
        <p>
          Nous importons ces produits pour vous, avec un prix affiché
          <strong> tout compris</strong> dès la fiche produit : le produit,
          son transport et les frais de douane. Pas de surprise au retrait.
        </p>
        <p>
          Plutôt qu&apos;une livraison à domicile classique, nous nous
          appuyons sur un réseau de <strong>boutiques partenaires de
          quartier</strong> : vous choisissez celle qui vous arrange, vous
          êtes prévenu dès l&apos;arrivée de votre colis, et vous le
          récupérez avec un code de retrait unique.
        </p>
      </div>
    </div>
  );
}
