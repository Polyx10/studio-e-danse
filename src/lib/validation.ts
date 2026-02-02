import { z } from 'zod';

// Schéma de validation pour les inscriptions
export const inscriptionSchema = z.object({
  // Informations élève
  student_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100, 'Le nom est trop long'),
  student_gender: z.enum(['M', 'F']).optional(),
  student_birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide'),
  student_address: z.string().max(200, 'L\'adresse est trop longue').nullable().optional(),
  student_postal_code: z.string().regex(/^\d{5}$/, 'Code postal invalide (5 chiffres)').nullable().optional(),
  student_city: z.string().max(100, 'Le nom de la ville est trop long').nullable().optional(),
  student_phone: z.string().regex(/^(\+33|0)[1-9](\d{2}){4}$/, 'Numéro de téléphone invalide').nullable().optional(),
  student_email: z.string().email('Email invalide').max(100, 'Email trop long').nullable().optional(),
  
  // Responsables légaux
  responsable1_name: z.string().min(2, 'Le nom du responsable doit contenir au moins 2 caractères').max(100, 'Le nom est trop long'),
  responsable1_phone: z.string().regex(/^(\+33|0)[1-9](\d{2}){4}$/, 'Numéro de téléphone invalide'),
  responsable1_email: z.string().email('Email invalide').max(100, 'Email trop long'),
  responsable2_name: z.string().max(100, 'Le nom est trop long').nullable().optional(),
  responsable2_phone: z.string().regex(/^(\+33|0)[1-9](\d{2}){4}$/, 'Numéro de téléphone invalide').nullable().optional(),
  responsable2_email: z.string().email('Email invalide').max(100, 'Email trop long').nullable().optional(),
  
  // Cours sélectionnés
  selected_courses: z.array(z.string().min(1, 'ID de cours invalide')).min(1, 'Au moins un cours doit être sélectionné').max(10, 'Trop de cours sélectionnés'),
  
  // Tarification
  tarif_reduit: z.boolean(),
  tarif_cours: z.number().min(0, 'Le tarif ne peut pas être négatif').max(10000, 'Tarif invalide'),
  adhesion: z.number().min(0, 'L\'adhésion ne peut pas être négative').max(1000, 'Adhésion invalide'),
  licence_ffd: z.number().min(0, 'La licence FFD ne peut pas être négative').max(1000, 'Licence FFD invalide'),
  tarif_total: z.number().min(0, 'Le tarif total ne peut pas être négatif').max(20000, 'Tarif total invalide'),
  
  // Options
  danse_etudes_option: z.enum(['0', '1', '2']).optional(),
  concours_on_stage: z.boolean(),
  concours_classes: z.boolean(),

  // Options / autorisations
  participation_spectacle: z.enum(['oui', 'non']).optional(),
  nombre_costumes: z.enum(['1', '2', '3', '4']).optional(),
  droit_image: z.enum(['autorise', 'refus-partiel', 'refus-total']),
  type_cours: z.enum(['loisirs', 'danse-etudes']).optional(),
  
  // Paiement
  mode_paiement: z.array(z.string()).nullable().optional(),
  nombre_versements: z.string().nullable().optional(),
  
  // Règlement et droits
  accept_rules: z.boolean().refine(val => val === true, 'Le règlement intérieur doit être accepté'),
  signature_name: z.string().min(2, 'La signature doit contenir au moins 2 caractères').max(100, 'La signature est trop longue'),
  
  // Statut
  adherent_precedent: z.boolean(),
});

export type InscriptionData = z.infer<typeof inscriptionSchema>;
