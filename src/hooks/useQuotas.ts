import { useState, useEffect } from 'react';

export interface QuotaInfo {
  disponible: boolean;
  places_restantes: number;
  effectif_max: number;
  quota_en_ligne: number;
  inscriptions_en_ligne: number;
  inscriptions_papier: number;
  ouverture_temporaire: boolean;
  pourcentage_rempli: number;
  raison?: string;
}

export function useQuotas(coursIds: string[]) {
  const [quotas, setQuotas] = useState<Record<string, QuotaInfo>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuotas = async () => {
      if (coursIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const quotasData: Record<string, QuotaInfo> = {};

        // Vérifier les quotas pour chaque cours
        await Promise.all(
          coursIds.map(async (coursId) => {
            try {
              const response = await fetch('/api/quotas/verifier', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ coursId }),
              });

              if (response.ok) {
                const data = await response.json();
                quotasData[coursId] = data;
              }
            } catch (err) {
              console.error(`Erreur vérification quota ${coursId}:`, err);
            }
          })
        );

        setQuotas(quotasData);
        setError(null);
      } catch (err) {
        console.error('Erreur chargement quotas:', err);
        setError('Erreur lors du chargement des quotas');
      } finally {
        setLoading(false);
      }
    };

    fetchQuotas();
  }, [coursIds.join(',')]);

  return { quotas, loading, error };
}

export async function incrementerQuota(coursId: string, type: 'en_ligne' | 'papier' = 'en_ligne') {
  try {
    const response = await fetch('/api/quotas/incrementer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coursId, type }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'incrémentation du quota');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur incrémentation quota:', error);
    throw error;
  }
}

export async function ajouterListeAttente(
  coursId: string,
  coursNom: string,
  nomComplet: string,
  email: string,
  telephone: string
) {
  try {
    const response = await fetch('/api/liste-attente/ajouter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coursId, coursNom, nomComplet, email, telephone }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'ajout à la liste d\'attente');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur liste d\'attente:', error);
    throw error;
  }
}
