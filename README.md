# Okoumia

Plateforme e-commerce d'import (mode, accessoires, petit électronique, cosmétique) avec retrait en points relais à Libreville. Mobile-first, pensée pour évoluer en PWA.

## Stack

- **Frontend** : Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **Backend** : Route Handlers + Server Actions Next.js (pas de service séparé pour le MVP)
- **Base de données** : PostgreSQL via Prisma 7 (driver adapter `@prisma/adapter-pg`)
- **Auth** : téléphone + mot de passe, session JWT en cookie httpOnly (`jose`)
- **État panier** : Zustand (persisté en localStorage)
- **PWA** : manifest + service worker basique (cache du catalogue déjà consulté pour une lecture hors-ligne dégradée)

## Démarrage local

```bash
npm install
cp .env.example .env   # puis renseigner DATABASE_URL et AUTH_SECRET
npm run db:migrate     # applique le schéma Prisma
npm run db:seed        # jeu de données de démo (catégories, produits, points relais)
npm run dev
```

Comptes de démonstration créés par le seed :

- Client : `077 00 00 00` / `demo1234`
- Admin : `077 00 00 01` / `admin1234` → accès à `/admin`

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` / `npm run start` | Build et exécution en production |
| `npm run db:migrate` | Applique les migrations Prisma |
| `npm run db:seed` | Recharge les données de démonstration |
| `npm run db:studio` | Prisma Studio (interface DB) |

## Choix d'architecture (MVP)

- **Paiement** : simulé (validé immédiatement à la commande) pour permettre de tester tout le tunnel sans compte marchand. À remplacer par un vrai prestataire (ex. CinetPay, qui couvre Airtel Money / Moov Money / carte au Gabon) dans `src/app/api/orders/route.ts` et `src/components/checkout/PaymentStep.tsx`.
- **Hébergement DB** : Postgres standard via Prisma — compatible Supabase (recommandé : regroupe aussi le stockage d'images produits) ou tout Postgres managé (Neon, Railway...).
- **Images produits** : les visuels du seed sont des placeholders générés (`scripts/generate-placeholders.mjs`, `public/images/`). À remplacer par de vraies photos, servies idéalement depuis un stockage objet (Supabase Storage, S3...) avant mise en production.
- **Commissions points relais** : `RelayCommission` distingue colis déposé (`depositedAt`, renseigné au passage du statut « Arrivée au point relais ») et colis retiré (`pickedUpAt`, au passage « Retirée », qui marque aussi la commission comme payable).

## Structure

```
src/app/                 pages (App Router)
  (client)                catalogue, produit, panier, commande, compte...
  admin/                  back-office (auth admin requise)
  api/                    routes API (auth, commandes)
src/components/           composants UI, produit, checkout, navigation
src/lib/                  prisma, session, catalogue, utilitaires
src/store/                état panier (Zustand)
prisma/schema.prisma      schéma de données
prisma/seed.ts            données de démonstration
```

Un ancien portfolio statique sans rapport avec ce projet a été conservé dans `legacy-portfolio/` (contenu d'origine du dépôt).
