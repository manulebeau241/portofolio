export const metadata = { title: "FAQ — Okoumia" };

const faqs = [
  {
    q: "Pourquoi mes produits ne sont-ils pas livrés immédiatement ?",
    a: "Les produits Okoumia sont importés sur commande : ils ne sont pas stockés à l'avance au Gabon. Le délai indiqué sur chaque fiche produit correspond au temps d'acheminement estimé jusqu'à votre point relais.",
  },
  {
    q: "Le prix affiché inclut-il vraiment tout ?",
    a: "Oui. Le prix affiché comprend le produit, le fret et les frais de douane. Vous ne payez rien de plus au retrait.",
  },
  {
    q: "Pourquoi dois-je payer avant la livraison ?",
    a: "Vos produits sont commandés à l'étranger spécifiquement pour vous. Le paiement à la commande nous permet de lancer l'achat et l'acheminement dès que vous validez.",
  },
  {
    q: "Comment je récupère ma commande ?",
    a: "Vous recevez un code de retrait unique par SMS et dans votre compte. Présentez-le à votre point relais une fois votre commande arrivée.",
  },
  {
    q: "Quels moyens de paiement acceptez-vous ?",
    a: "Airtel Money et Moov Money en priorité, ainsi que la carte bancaire.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">
      <h1 className="text-xl font-bold text-forest-950">Questions fréquentes</h1>
      <div className="mt-4 flex flex-col divide-y divide-forest-100 rounded-card bg-white ring-1 ring-forest-100">
        {faqs.map((item) => (
          <details key={item.q} className="group p-4">
            <summary className="cursor-pointer list-none text-sm font-semibold text-forest-950">
              {item.q}
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-forest-600">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
