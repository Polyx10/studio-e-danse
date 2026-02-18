import { z } from 'zod';

// Fonction pour calculer l'âge
function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// Schéma de validation pour les inscriptions
export const inscriptionSchema = z.object({
  // Informations élève
  student_last_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100, 'Le nom est trop long'),
  student_first_name: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères').max(100, 'Le prénom est trop long'),
  student_gender: z.enum(['M', 'F']),
  student_birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide'),
  student_address: z.string().max(200, 'L\'adresse est trop longue').nullable().optional(),
  student_postal_code: z.string().regex(/^\d{5}$/, 'Code postal invalide (5 chiffres)').nullable().optional(),
  student_city: z.string().max(100, 'Le nom de la ville est trop long').nullable().optional(),
  student_phone: z.string()
    .transform(val => val ? val.replace(/[\s\-\.]/g, '') : '')
    .refine(val => val === '' || /^(\+33|0033|0)[1-9](\d{8})$/.test(val), {
      message: 'Numéro de téléphone invalide'
    })
    .transform(val => val === '' ? null : val)
    .nullable()
    .optional(),
  student_email: z.union([z.string().email('Email invalide').max(100, 'Email trop long'), z.literal('')]).transform(val => val === '' ? null : val).nullable().optional(),
  
  // Responsables légaux (obligatoires uniquement pour les mineurs)
  responsable1_name: z.union([z.string().max(100, 'Le nom est trop long'), z.literal('')]).transform(val => val === '' ? null : val).nullable().optional(),
  responsable1_phone: z.string()
    .transform(val => val ? val.replace(/[\s\-\.]/g, '') : '')
    .refine(val => val === '' || /^(\+33|0033|0)[1-9](\d{8})$/.test(val), {
      message: 'Numéro de téléphone invalide'
    })
    .transform(val => val === '' ? null : val)
    .nullable()
    .optional(),
  responsable1_email: z.union([z.string().email('Email invalide').max(100, 'Email trop long'), z.literal('')]).transform(val => val === '' ? null : val).nullable().optional(),
  responsable2_name: z.union([z.string().max(100, 'Le nom est trop long'), z.literal('')]).transform(val => val === '' ? null : val).nullable().optional(),
  responsable2_address: z.union([z.string().max(200, 'L\'adresse est trop longue'), z.literal('')]).transform(val => val === '' ? null : val).nullable().optional(),
  responsable2_postal_code: z.union([z.string().regex(/^\d{5}$/, 'Code postal invalide (5 chiffres)'), z.literal('')]).transform(val => val === '' ? null : val).nullable().optional(),
  responsable2_city: z.union([z.string().max(100, 'Le nom de la ville est trop long'), z.literal('')]).transform(val => val === '' ? null : val).nullable().optional(),
  responsable2_phone: z.string()
    .transform(val => val ? val.replace(/[\s\-\.]/g, '') : '')
    .refine(val => val === '' || /^(\+33|0033|0)[1-9](\d{8})$/.test(val), {
      message: 'Numéro de téléphone invalide'
    })
    .transform(val => val === '' ? null : val)
    .nullable()
    .optional(),
  responsable2_email: z.union([z.string().email('Email invalide').max(100, 'Email trop long'), z.literal('')]).transform(val => val === '' ? null : val).nullable().optional(),
  
  // Cours sélectionnés
  selected_courses: z.array(z.string().min(1, 'ID de cours invalide')).min(1, 'Au moins un cours doit être sélectionné').max(10, 'Trop de cours sélectionnés'),
  
  // Tarification
  tarif_reduit: z.boolean(),
  rattachement_famille: z.union([z.string().max(200, 'Le nom est trop long'), z.literal('')]).transform(val => val === '' ? null : val).nullable().optional(),
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
  engagement_paiement_echelonne: z.boolean().optional(),
  preinscription_payee: z.boolean().optional(),
  
  // Règlement et droits
  accept_rules: z.boolean().refine(val => val === true, 'Le règlement intérieur doit être accepté'),
  signature_name: z.string().min(2, 'La signature doit contenir au moins 2 caractères').max(100, 'La signature est trop longue'),
  
  // Statut
  adherent_precedent: z.boolean(),
}).superRefine((data, ctx) => {
  // Validation conditionnelle basée sur l'âge
  const age = calculateAge(data.student_birth_date);
  
  if (age >= 18) {
    // Adhérent majeur : coordonnées personnelles obligatoires
    if (!data.student_address || data.student_address.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'L\'adresse est obligatoire pour les adhérents majeurs',
        path: ['student_address'],
      });
    }
    
    if (!data.student_postal_code || data.student_postal_code.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Le code postal est obligatoire pour les adhérents majeurs',
        path: ['student_postal_code'],
      });
    }
    
    if (!data.student_city || data.student_city.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La ville est obligatoire pour les adhérents majeurs',
        path: ['student_city'],
      });
    }
    
    if (!data.student_phone || data.student_phone.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Le téléphone est obligatoire pour les adhérents majeurs',
        path: ['student_phone'],
      });
    }
    
    if (!data.student_email || data.student_email.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'L\'email est obligatoire pour les adhérents majeurs',
        path: ['student_email'],
      });
    }
  } else {
    // Adhérent mineur : responsable légal 1 et adresse obligatoires
    if (!data.responsable1_name || data.responsable1_name.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Le nom du responsable légal est obligatoire pour les adhérents mineurs',
        path: ['responsable1_name'],
      });
    }
    
    if (!data.responsable1_phone || data.responsable1_phone.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Le téléphone du responsable légal est obligatoire pour les adhérents mineurs',
        path: ['responsable1_phone'],
      });
    }
    
    if (!data.responsable1_email || data.responsable1_email.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'L\'email du responsable légal est obligatoire pour les adhérents mineurs',
        path: ['responsable1_email'],
      });
    }
    
    // Adresse obligatoire pour les mineurs (remplie par le responsable légal)
    if (!data.student_address || data.student_address.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'L\'adresse est obligatoire',
        path: ['student_address'],
      });
    }
    
    if (!data.student_postal_code || data.student_postal_code.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Le code postal est obligatoire',
        path: ['student_postal_code'],
      });
    }
    
    if (!data.student_city || data.student_city.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La ville est obligatoire',
        path: ['student_city'],
      });
    }
  }
  
  // Validation de l'engagement pour paiement échelonné
  if (data.nombre_versements === '3' || data.nombre_versements === '10') {
    if (!data.engagement_paiement_echelonne) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Vous devez accepter l\'engagement sur l\'honneur pour un paiement échelonné',
        path: ['engagement_paiement_echelonne'],
      });
    }
  }
});

export type InscriptionData = z.infer<typeof inscriptionSchema>;
