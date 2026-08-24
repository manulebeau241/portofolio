export const metadata = { title: "Conditions générales de vente — Okoumia" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">
      <h1 className="text-xl font-bold text-forest-950">Conditions générales de vente</h1>
      <div className="mt-4 flex flex-col gap-4 text-sm leading-relaxed text-forest-700">
        <p>
          Ces conditions régissent l&apos;utilisation de la plateforme
          Okoumia et les commandes passées auprès d&apos;Okoumia par les
          utilisateurs situés au Gabon.
        </p>
        <p>
          <strong>1. Produits et prix.</strong> Les produits proposés sont
          importés sur commande. Le prix affiché sur chaque fiche produit
          est un prix tout compris (produit, fret, douane) exprimé en francs
          CFA (XAF).
        </p>
        <p>
          <strong>2. Commande et paiement.</strong> Toute commande est
          payable intégralement au moment de la validation, via Mobile Money
          (Airtel Money, Moov Money) ou carte bancaire. La commande n&apos;est
          traitée qu&apos;une fois le paiement confirmé.
        </p>
        <p>
          <strong>3. Délais.</strong> Les délais de disponibilité affichés
          sont estimatifs et peuvent varier selon les conditions
          d&apos;acheminement et de dédouanement.
        </p>
        <p>
          <strong>4. Retrait.</strong> Chaque commande est à retirer dans le
          point relais choisi par le client, sur présentation du code de
          retrait unique communiqué après paiement.
        </p>
      </div>
    </div>
  );
}
