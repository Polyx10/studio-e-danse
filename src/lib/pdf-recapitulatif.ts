import jsPDF from 'jspdf';
import { Echeance } from './echeancier';

// Formater un montant avec 2 décimales (ex: 21.5 → "21,50")
function fmtPdf(n: number): string {
  return n.toFixed(2).replace('.', ',');
}

interface DonneesInscription {
  // Élève
  nomEleve: string;
  sexe: string;
  dateNaissance: string;
  age: number;
  adresse?: string;
  codePostal?: string;
  ville?: string;
  telephone?: string;
  email?: string;
  adherentPrecedent: boolean;
  
  // Responsables légaux
  responsable1Nom: string;
  responsable1Tel: string;
  responsable1Email: string;
  responsable2Nom?: string;
  responsable2Tel?: string;
  responsable2Email?: string;
  
  // Cours
  coursSelectionnes: string[];
  
  // Tarification
  tarifCours: number;
  tarifDanseEtudes?: number;
  adhesion: number;
  licenceFFD: number;
  totalGeneral: number;
  tarifReduit: boolean;
  
  // Options
  danseEtudes?: string;
  participationSpectacle: string;
  nombreCostumes?: string;
  droitImage: string;
  
  // Paiement
  modePaiement: string[];
  nombreVersements: string;
  echeances: Echeance[];
  avecPreinscription: boolean;
  montantPreinscription?: number;
  
  // Signature
  nomSignature: string;
  dateInscription: string;
}

/**
 * Dessine un titre de section avec un filet doré
 */
function drawSectionTitle(doc: jsPDF, title: string, x: number, y: number): number {
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(45, 52, 54);
  doc.text(title, x, y);
  y += 1.5;
  doc.setDrawColor(230, 184, 0);
  doc.setLineWidth(0.8);
  doc.line(x, y, x + doc.getTextWidth(title), y);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  y += 7;
  return y;
}

/**
 * Dessine une ligne label + valeur avec position fixe pour la valeur
 * @param valueX position absolue X de la valeur
 */
function drawField(doc: jsPDF, label: string, value: string, x: number, y: number, valueX: number) {
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(label, x, y);
  doc.setFont('helvetica', 'normal');
  doc.text(value, valueX, y);
}

export function genererPDFRecapitulatif(donnees: DonneesInscription) {
  const doc = new jsPDF();
  
  const mg = 20; // marge gauche
  const md = 190; // marge droite
  const col2x = 115; // début colonne 2
  const val1 = 60;  // position valeur colonne 1
  const val2 = 148; // position valeur colonne 2
  const valResp = 55; // position valeur responsables
  const valOpt = 72; // position valeur options
  const valEch = 68; // position valeur échéancier
  let y = 20;

  // ============ EN-TÊTE ============
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(45, 52, 54);
  const studioText = 'STUDIO';
  const studioWidth = doc.getTextWidth(studioText);
  const studioX = 105 - (studioWidth + 3 + doc.getTextWidth('e')) / 2;
  doc.text(studioText, studioX, y);
  doc.setTextColor(230, 184, 0);
  doc.text('e', studioX + studioWidth + 3, y);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text('ÉCOLE DE DANSE', 105, y + 7, { align: 'center' });
  y += 18;

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(45, 52, 54);
  doc.text('Récapitulatif d\'inscription — Saison 2025-2026', 105, y, { align: 'center' });
  y += 4;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.4);
  doc.line(mg, y, md, y);
  y += 16;

  const dateNaissanceFR = (() => { const parts = donnees.dateNaissance.split('-'); return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : donnees.dateNaissance; })();

  // ============ INFORMATIONS ÉLÈVE ============
  y = drawSectionTitle(doc, 'INFORMATIONS ÉLÈVE', mg, y);

  drawField(doc, 'Nom et Prénom : ', donnees.nomEleve, mg + 2, y, val1);
  drawField(doc, 'Sexe : ', donnees.sexe === 'F' ? 'Féminin' : 'Masculin', col2x, y, val2);
  y += 6;

  drawField(doc, 'Date de naissance : ', `${dateNaissanceFR}  (${donnees.age} ans)`, mg + 2, y, val1);
  drawField(doc, 'Ancien adhérent : ', donnees.adherentPrecedent ? 'Oui' : 'Non', col2x, y, val2);
  y += 6;

  if (donnees.adresse) {
    drawField(doc, 'Adresse : ', `${donnees.adresse}, ${donnees.codePostal} ${donnees.ville}`, mg + 2, y, val1);
    y += 6;
  }

  if (donnees.telephone) {
    drawField(doc, 'Téléphone : ', donnees.telephone, mg + 2, y, val1);
  }
  if (donnees.email) {
    drawField(doc, 'Email : ', donnees.email, col2x, y, val2);
  }
  if (donnees.telephone || donnees.email) y += 6;

  y += 8;

  // ============ RESPONSABLES LÉGAUX ============
  y = drawSectionTitle(doc, 'RESPONSABLES LÉGAUX', mg, y);

  doc.setFontSize(9);
  if (donnees.responsable1Nom) {
    drawField(doc, 'Responsable 1 : ', donnees.responsable1Nom, mg + 2, y, valResp);
    y += 5;
    drawField(doc, 'Tél : ', donnees.responsable1Tel, mg + 8, y, mg + 20);
    drawField(doc, 'Email : ', donnees.responsable1Email, col2x, y, col2x + 16);
    y += 6;
  }

  if (donnees.responsable2Nom) {
    drawField(doc, 'Responsable 2 : ', donnees.responsable2Nom, mg + 2, y, valResp);
    y += 5;
    drawField(doc, 'Tél : ', donnees.responsable2Tel || 'N/A', mg + 8, y, mg + 20);
    drawField(doc, 'Email : ', donnees.responsable2Email || 'N/A', col2x, y, col2x + 16);
    y += 6;
  }

  y += 8;

  // ============ COURS SÉLECTIONNÉS ============
  y = drawSectionTitle(doc, 'COURS SÉLECTIONNÉS', mg, y);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  donnees.coursSelectionnes.forEach(cours => {
    doc.text(`•   ${cours}`, mg + 4, y);
    y += 5;
  });

  y += 8;

  // ============ OPTIONS ============
  y = drawSectionTitle(doc, 'OPTIONS', mg, y);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  if (donnees.danseEtudes && donnees.danseEtudes !== '0') {
    drawField(doc, 'Danse Études : ', `Option ${donnees.danseEtudes}`, mg + 2, y, valOpt);
    y += 5;
  }
  drawField(doc, 'Participation spectacle : ', donnees.participationSpectacle, mg + 2, y, valOpt);
  y += 5;
  drawField(doc, 'Droit à l\'image : ', donnees.droitImage, mg + 2, y, valOpt);

  y += 10;

  // ============ TARIFICATION ============
  y = drawSectionTitle(doc, 'TARIFICATION', mg, y);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  const tarifX = mg + 4;
  const montantX = mg + 55;

  const tarifItems: { label: string; montant: number }[] = [
    { label: 'Tarif cours', montant: donnees.tarifCours },
  ];
  if (donnees.tarifDanseEtudes && donnees.tarifDanseEtudes > 0) {
    tarifItems.push({ label: 'Danse Études', montant: donnees.tarifDanseEtudes });
  }
  tarifItems.push(
    { label: 'Adhésion', montant: donnees.adhesion },
    { label: 'Licence FFD', montant: donnees.licenceFFD },
  );

  tarifItems.forEach((item, idx) => {
    doc.text(item.label, tarifX, y);
    doc.text(`${fmtPdf(item.montant)} €`, montantX, y, { align: 'right' });
    if (idx === 0 && donnees.tarifReduit) {
      doc.setTextColor(0, 128, 0);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.text('(Tarif réduit appliqué)', montantX + 5, y);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
    }
    y += 5;
  });

  // Ligne séparatrice
  doc.setDrawColor(180, 180, 180);
  doc.line(tarifX, y, montantX + 2, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('TOTAL', tarifX, y);
  doc.text(`${fmtPdf(donnees.totalGeneral)} €`, montantX, y, { align: 'right' });

  // ============ PAGE 2 — ÉCHÉANCIER + SIGNATURE ============
  doc.addPage();
  y = 20;

  // Rappel discret en haut de page
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(150, 150, 150);
  doc.text(`Récapitulatif d'inscription — ${donnees.nomEleve}`, 105, y, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  y += 12;

  // ============ ÉCHÉANCIER ============
  y = drawSectionTitle(doc, 'ÉCHÉANCIER DE PAIEMENT', mg, y);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  drawField(doc, 'Mode(s) de paiement : ', donnees.modePaiement.join(', '), mg + 2, y, valEch);
  y += 5;
  drawField(doc, 'Nombre de versements : ', donnees.nombreVersements, mg + 2, y, valEch);
  y += 10;

  // Cadre échéancier
  const echeancierStartY = y;

  donnees.echeances.forEach(echeance => {
    if (echeance.mois.includes('Préinscription')) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 128, 0);
      doc.text(`•   ${echeance.mois}`, mg + 6, y);
      doc.text(`${fmtPdf(echeance.montant)} €`, mg + 100, y, { align: 'right' });
      y += 5;
      if (echeance.details) {
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'italic');
        doc.text(echeance.details, mg + 12, y);
        y += 6;
        doc.setFontSize(9);
      }
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
    } else {
      doc.text(`•   ${echeance.mois}`, mg + 6, y);
      doc.text(`${fmtPdf(echeance.montant)} €`, mg + 100, y, { align: 'right' });
      y += 5;
    }
  });

  // Cadre arrondi autour de l'échéancier
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.roundedRect(mg + 2, echeancierStartY - 5, 110, y - echeancierStartY + 7, 2, 2);

  y += 18;

  // ============ ENGAGEMENT ET SIGNATURE ============
  y = drawSectionTitle(doc, 'ENGAGEMENT ET SIGNATURE', mg, y);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  const estMineur = donnees.age < 18;

  if (estMineur) {
    doc.text('Je soussigné(e) (responsable légal) :', mg, y);
    y += 7;
    doc.setFont('helvetica', 'bold');
    doc.text(donnees.nomSignature, mg + 5, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.text('Agissant en qualité de responsable légal de :', mg, y);
    y += 7;
    doc.setFont('helvetica', 'bold');
    doc.text(donnees.nomEleve, mg + 5, y);
    y += 10;
  } else {
    doc.text('Je soussigné(e) :', mg, y);
    y += 7;
    doc.setFont('helvetica', 'bold');
    doc.text(donnees.nomSignature, mg + 5, y);
    y += 10;
  }

  doc.setFont('helvetica', 'normal');
  const engagements = [
    'Certifie l\'exactitude des informations fournies',
    'Déclare avoir pris connaissance et accepter le règlement intérieur',
    'M\'engage à respecter l\'échéancier de paiement ci-dessus',
  ];
  engagements.forEach(text => {
    doc.text(`•   ${text}`, mg, y);
    y += 6;
  });

  doc.setFontSize(7.5);
  doc.setTextColor(140, 140, 140);
  doc.text('(Règlement intérieur disponible en téléchargement sur le site, onglet Planning)', mg + 8, y);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  y += 14;

  doc.setFont('helvetica', 'bold');
  doc.text(`Fait le :  ${donnees.dateInscription}`, mg, y);
  doc.setFont('helvetica', 'normal');
  y += 18;

  // Cadre pour la signature
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.3);
  doc.roundedRect(mg, y, 90, 40, 2, 2);
  doc.setFontSize(8);
  doc.setTextColor(170, 170, 170);
  doc.text('Signature du responsable légal', mg + 4, y + 8);
  doc.text('(précédée de la mention "Lu et approuvé")', mg + 4, y + 14);

  // ============ PIED DE PAGE ============
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(170, 170, 170);
    doc.text(`STUDIO E — Document généré le ${new Date().toLocaleDateString('fr-FR')}`, mg, 288);
    doc.text(`Page ${i}/${totalPages}`, md - 12, 288);
  }

  // Télécharger le PDF
  const nomFichier = `Recapitulatif_Inscription_${donnees.nomEleve.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(nomFichier);
}
