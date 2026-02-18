import jsPDF from 'jspdf';
import { Echeance } from './echeancier';

interface DonneesEcheancier {
  nomEleve: string;
  echeances: Echeance[];
  totalGeneral: number;
  avecPreinscription: boolean;
  montantPreinscription?: number;
  montantApresPreinscription?: number;
  nombreVersements: string;
}

export function genererPDFEcheancier(donnees: DonneesEcheancier) {
  const doc = new jsPDF();
  
  // Configuration
  const margeGauche = 20;
  const margeDroite = 190;
  let y = 20;
  
  // En-tête
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('STUDIO E - Échéancier de paiement', margeGauche, y);
  y += 15;
  
  // Ligne de séparation
  doc.setLineWidth(0.5);
  doc.line(margeGauche, y, margeDroite, y);
  y += 10;
  
  // Informations élève
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Élève : ${donnees.nomEleve}`, margeGauche, y);
  y += 8;
  doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, margeGauche, y);
  y += 15;
  
  // Titre échéancier
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Détail des versements', margeGauche, y);
  y += 10;
  
  // Tableau des échéances
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  // Échéances
  donnees.echeances.forEach((echeance, index) => {
    // Si c'est la préinscription, affichage spécial en vert avec détail sur 2 lignes
    if (echeance.mois.includes('Préinscription')) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 128, 0); // Vert
      doc.text(`• ${echeance.mois}`, margeGauche + 5, y);
      doc.text(`${echeance.montant}€`, margeDroite - 20, y, { align: 'right' });
      y += 6;
      
      // Détail sur la ligne suivante
      if (echeance.details) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.text(`  ${echeance.details}`, margeGauche + 5, y);
        y += 7;
        doc.setFontSize(11);
      }
      
      doc.setTextColor(0, 0, 0); // Noir
      doc.setFont('helvetica', 'normal');
    } else {
      // Échéances normales - affichage simple sans détail
      doc.text(`• ${echeance.mois}`, margeGauche + 5, y);
      doc.text(`${echeance.montant}€`, margeDroite - 20, y, { align: 'right' });
      y += 7;
    }
  });
  
  y += 5;
  
  // Ligne de séparation
  doc.setLineWidth(0.3);
  doc.line(margeGauche, y, margeDroite, y);
  y += 8;
  
  // Total
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL À PAYER', margeGauche + 5, y);
  doc.text(`${donnees.totalGeneral}€`, margeDroite - 20, y, { align: 'right' });
  y += 15;
  
  // Informations complémentaires
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Informations importantes :', margeGauche, y);
  y += 7;
  
  doc.setFontSize(9);
  if (donnees.avecPreinscription) {
    doc.text('• La préinscription doit être réglée dans les 5 jours suivant l\'inscription', margeGauche + 5, y);
    y += 6;
    doc.text('• Elle comprend : Adhésion (12€) + Licence FFD (24€) + 54€ de cours', margeGauche + 5, y);
    y += 6;
  }
  doc.text('• Les versements mensuels sont à régler au début de chaque mois', margeGauche + 5, y);
  y += 6;
  doc.text('• Modes de paiement acceptés : Chèque, CB, ANCV, Virement, Espèces', margeGauche + 5, y);
  y += 15;
  
  // Pied de page
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('STUDIO E - École de danse', margeGauche, 280);
  doc.text(`Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, margeGauche, 285);
  
  // Télécharger le PDF
  const nomFichier = `Echeancier_${donnees.nomEleve.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(nomFichier);
}
