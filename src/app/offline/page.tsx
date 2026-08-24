import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-3 px-4 py-20 text-center">
      <WifiOff size={36} className="text-forest-400" />
      <h1 className="text-lg font-bold text-forest-950">Pas de connexion</h1>
      <p className="text-sm text-forest-500">
        Impossible de charger cette page. Les fiches produits et catégories
        déjà consultées restent disponibles hors-ligne ; le reste
        nécessite une connexion.
      </p>
    </div>
  );
}
