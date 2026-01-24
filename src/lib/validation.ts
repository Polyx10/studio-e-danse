import { z } from 'zod';

// Schéma de validation pour les inscriptions
export const inscriptionSchema = z.object({
  // Informations élève
  student_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100, 'Le nom est trop long'),
  student_gender: z.enum(['M', 'F', 'Autre']).optional(),
  student_birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide'),
  student_address: z.string().max(200, 'L\'adresse est trop longue').optional(),
  student_postal_code: z.string().regex(/^\d{5}$/, 'Code postal invalide (5 chiffres)').optional(),
  student_city: z.string().max(100, 'Le nom de la ville est trop long').optional(),
  student_phone: z.string().regex(/^(\+33|0)[1-9](\d{2}){4}$/, 'Numéro de téléphone invalide').optional(),
  student_email: z.string().email('Email invalide').max(100, 'Email trop long').optional(),
  
  // Responsables légaux
  responsable1_name: z.string().min(2, 'Le nom du responsable doit contenir au moins 2 caractères').max(100, 'Le nom est trop long'),
  responsable1_phone: z.string().regex(/^(\+33|0)[1-9](\d{2}){4}$/, 'Numéro de téléphone invalide'),
  responsable1_email: z.string().email('Email invalide').max(100, 'Email trop long'),
  responsable2_name: z.string().max(100, 'Le nom est trop long').optional(),
  responsable2_phone: z.string().regex(/^(\+33|0)[1-9](\d{2}){4}$/, 'Numéro de téléphone invalide').optional(),
  responsable2_email: z.string().email('Email invalide').max(100, 'Email trop long').optional(),
  
  // Cours sélectionnés
  selected_courses: z.array(z.string().uuid('ID de cours invalide')).min(1, 'Au moins un cours doit être sélectionné').max(10, 'Trop de cours sélectionnés'),
  
  // Tarification
  tarif_reduit: z.boolean(),
  tarif_cours: z.number().min(0, 'Le tarif ne peut pas être négatif').max(10000, 'Tarif invalide'),
  adhesion: z.number().min(0, 'L\'adhésion ne peut pas être négative').max(1000, 'Adhésion invalide'),
  licence_ffd: z.number().min(0, 'La licence FFD ne peut pas être négative').max(1000, 'Licence FFD invalide'),
  tarif_total: z.number().min(0, 'Le tarif total ne peut pas être négatif').max(20000, 'Tarif total invalide'),
  
  // Options
  danse_etudes_option: z.enum(['oui', 'non', 'peut-etre']).optional(),
  concours_on_stage: z.boolean(),
  concours_classes: z.boolean(),
  
  // Paiement
  mode_paiement: z.enum(['comptant', 'echelonne', 'cheque', 'virement', 'especes']),
  nombre_versements: z.number().int().min(1).max(10).optional(),
  
  // Règlement et droits
  reglement_accepte: z.boolean().refine(val => val === true, 'Le règlement intérieur doit être accepté'),
  droit_image: z.enum(['total', 'partiel', 'refuse']),
  
  // Statut
  adherent_precedent: z.boolean(),
});

export type InscriptionData = z.infer<typeof inscriptionSchema>;
