import { useState, useEffect } from 'react';

interface AppConfig {
  preinscription_active?: string; // Ancien système (rétrocompatibilité)
  preinscription_anciens_active?: string;
  preinscription_tous_active?: string;
  montant_preinscription: string;
}

export function useConfig() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const response = await fetch('/api/config');
        if (response.ok) {
          const data = await response.json();
          setConfig(data);
        }
      } catch (error) {
        console.error('Erreur chargement config:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchConfig();
  }, []);

  const preinscriptionAnciensActive = config?.preinscription_anciens_active === 'true';
  const preinscriptionTousActive = config?.preinscription_tous_active === 'true';
  
  // Rétrocompatibilité : si l'ancien système est actif, on considère que c'est pour les anciens
  const preinscriptionActive = preinscriptionAnciensActive || preinscriptionTousActive || config?.preinscription_active === 'true';

  return {
    config,
    loading,
    preinscriptionActive, // Au moins une préinscription est active
    preinscriptionAnciensActive, // Préinscription réservée aux anciens
    preinscriptionTousActive, // Préinscription ouverte à tous
    montantPreinscription: parseInt(config?.montant_preinscription || '90', 10)
  };
}
