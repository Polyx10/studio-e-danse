import { useState, useEffect } from 'react';

export interface QuotaInfo {
  disponible: boolean;
  places_restantes: number;
  quota_total: number;
  inscriptions: number;
}

export interface QuotasMap {
  [coursId: string]: QuotaInfo;
}

export function useQuotas(coursIds: string[]) {
  const [quotas, setQuotas] = useState<QuotasMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!coursIds || coursIds.length === 0) {
      setLoading(false);
      return;
    }

    async function fetchQuotas() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/quotas/verifier', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ coursIds })
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des quotas');
        }

        const data = await response.json();
        setQuotas(data.quotas || {});
      } catch (err) {
        console.error('Erreur useQuotas:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    }

    fetchQuotas();
  }, [coursIds.join(',')]);

  return { quotas, loading, error };
}

export async function incrementerQuota(coursId: string, type: 'en_ligne' | 'sur_place'): Promise<QuotaInfo> {
  const response = await fetch('/api/quotas/incrementer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ coursId, type })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur lors de l\'incrémentation du quota');
  }

  const data = await response.json();
  return data.quota;
}

export async function ajouterListeAttente(
  coursId: string,
  nom: string,
  prenom: string,
  email: string,
  telephone?: string
): Promise<void> {
  const response = await fetch('/api/liste-attente/ajouter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ coursId, nom, prenom, email, telephone })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur lors de l\'ajout à la liste d\'attente');
  }
}
