import { useState, useEffect } from 'react';
import { fraisFixes as fraisFixesStatic, tarifsSpeciaux as tarifsSpeciauxStatic } from '@/lib/planning-data';

export interface TarifGrilleRow {
  duree_minutes: number;
  tarif_plein: number;
  tarif_reduit: number;
}

export interface TarifsConfig {
  grille: TarifGrilleRow[];
  fraisFixes: { adhesion: number; licenceFFD: number; licenceFFDMoins4ans: number };
  tarifsSpeciaux: { danseEtudes1: number; danseEtudes2: number; onStage: number; classesConcours: number };
}

export function useTarifs() {
  const [grille, setGrille] = useState<TarifGrilleRow[]>([]);
  const [fraisFixes, setFraisFixes] = useState(fraisFixesStatic);
  const [tarifsSpeciaux, setTarifsSpeciaux] = useState(tarifsSpeciauxStatic);

  useEffect(() => {
    fetch('/api/tarifs', { cache: 'no-store' })
      .then(r => r.json())
      .then((data: TarifsConfig) => {
        if (data.grille?.length > 0) setGrille(data.grille);
        if (data.fraisFixes) setFraisFixes(data.fraisFixes);
        if (data.tarifsSpeciaux) setTarifsSpeciaux(data.tarifsSpeciaux);
      })
      .catch(() => {});
  }, []);

  return { grille, fraisFixes, tarifsSpeciaux };
}
