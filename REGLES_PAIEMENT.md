# Règles de Paiement Échelonné

## Montants Minimums

### Paiement en 3 fois
- **Montant minimum requis** : 270€ de tarif cours (hors frais d'inscription)
- **Disponibilité** : Uniquement si le tarif cours brut ≥ 270€

### Paiement en 10 fois
- **Montant minimum requis** : 500€ de tarif cours (hors frais d'inscription)
- **Disponibilité** : Uniquement si le tarif cours brut ≥ 500€

## Calcul du Premier Versement

Le premier versement est **toujours plus élevé** car il inclut les frais d'inscription :

### Composition du 1er versement
```
1er versement = Adhésion + Licence FFD + (Tarif cours / nombre de versements)
```

Où :
- **Adhésion** : 12€
- **Licence FFD** : 24€ (pour les élèves de 4 ans et plus)
- **Tarif cours** : Montant total des cours sélectionnés

### Exemples

#### Exemple 1 : Paiement en 3 fois (tarif cours 300€)
- Tarif cours : 300€
- **1er versement** : 12€ + 24€ + (300€ / 3) = 136€
- **2ème versement** : 300€ / 3 = 100€
- **3ème versement** : 300€ / 3 = 100€
- **Total** : 336€

#### Exemple 2 : Paiement en 10 fois (tarif cours 564€)
- Tarif cours : 564€
- **1er versement** : 12€ + 24€ + (564€ / 10) = 92,40€
- **Versements 2 à 10** : 564€ / 10 = 56,40€ chacun
- **Total** : 600€

## Implémentation

### Formulaire d'inscription en ligne
✅ Les options de paiement échelonné sont conditionnelles :
- Le menu déroulant affiche uniquement les options disponibles selon le montant
- Un encadré informatif explique les règles
- Le détail de la répartition s'affiche dynamiquement

### Interface administrateur
✅ L'historique des paiements permet de gérer tous les cas de figure :
- Ajout de paiements individuels avec dates et modes
- Pas de limite sur le nombre de versements
- Calcul automatique du restant dû

## Notes Importantes

1. La licence FFD n'est obligatoire qu'à partir de **4 ans**
2. Les frais d'inscription (adhésion + licence) sont **toujours inclus dans le 1er versement**
3. Les versements suivants concernent **uniquement le tarif des cours**
4. Le paiement échelonné n'est disponible que pour les **chèques**
