import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailInscriptionData {
  nomEleve: string;
  emailResponsable: string;
  cours: Array<{ nom: string; jour: string; horaire: string }>;
  tarifTotal: number;
  tarifCours: number;
  adhesion: number;
  licenceFFD: number;
  modePaiement?: string;
  nombreVersements?: number;
}

export async function envoyerEmailConfirmationInscription(data: EmailInscriptionData) {
  const coursListe = data.cours.map(c => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${c.nom}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${c.jour}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${c.horaire}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmation de pré-inscription - Studio E Danse</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background-color: #2D3436; padding: 30px 40px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Studio E Danse</h1>
                    <p style="color: #F9CA24; margin: 10px 0 0 0; font-size: 16px;">Confirmation de pré-inscription</p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    
                    <p style="color: #2D3436; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Bonjour,
                    </p>

                    <p style="color: #2D3436; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Nous avons bien reçu la <strong>pré-inscription en ligne</strong> pour <strong>${data.nomEleve}</strong>.
                    </p>

                    <div style="background-color: #FEF3C7; border-left: 4px solid #F9CA24; padding: 15px; margin: 20px 0; border-radius: 4px;">
                      <p style="color: #92400E; margin: 0; font-size: 14px; line-height: 1.6;">
                        ⚠️ <strong>Important :</strong> Cette pré-inscription n'est pas définitive. 
                        Pour valider votre dossier, vous devez <strong>passer à l'école</strong> pour :
                      </p>
                      <ul style="color: #92400E; margin: 10px 0 0 0; padding-left: 20px; font-size: 14px;">
                        <li>Régler le montant dû</li>
                        <li>Compléter les documents administratifs</li>
                        <li>Finaliser votre inscription</li>
                      </ul>
                    </div>

                    <h2 style="color: #2D3436; font-size: 20px; margin: 30px 0 15px 0; border-bottom: 2px solid #F9CA24; padding-bottom: 10px;">
                      📋 Récapitulatif de votre pré-inscription
                    </h2>

                    <h3 style="color: #2D3436; font-size: 16px; margin: 20px 0 10px 0;">
                      Cours sélectionnés :
                    </h3>

                    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 20px;">
                      <thead>
                        <tr style="background-color: #f9fafb;">
                          <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb; color: #2D3436; font-size: 14px;">Cours</th>
                          <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb; color: #2D3436; font-size: 14px;">Jour</th>
                          <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb; color: #2D3436; font-size: 14px;">Horaire</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${coursListe}
                      </tbody>
                    </table>

                    <h3 style="color: #2D3436; font-size: 16px; margin: 20px 0 10px 0;">
                      💰 Tarification :
                    </h3>

                    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 20px;">
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Cours</td>
                        <td style="padding: 8px 0; text-align: right; color: #2D3436; font-size: 14px;">${data.tarifCours} €</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Adhésion</td>
                        <td style="padding: 8px 0; text-align: right; color: #2D3436; font-size: 14px;">${data.adhesion} €</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Licence FFD</td>
                        <td style="padding: 8px 0; text-align: right; color: #2D3436; font-size: 14px;">${data.licenceFFD} €</td>
                      </tr>
                      <tr style="border-top: 2px solid #e5e7eb;">
                        <td style="padding: 12px 0; color: #2D3436; font-size: 18px; font-weight: bold;">TOTAL</td>
                        <td style="padding: 12px 0; text-align: right; color: #F9CA24; font-size: 20px; font-weight: bold;">${data.tarifTotal} €</td>
                      </tr>
                    </table>

                    ${data.modePaiement ? `
                      <p style="color: #6b7280; font-size: 14px; margin: 10px 0;">
                        Mode de paiement souhaité : <strong>${data.modePaiement}</strong>
                        ${data.nombreVersements ? ` en ${data.nombreVersements} versement(s)` : ''}
                      </p>
                    ` : ''}

                    <h2 style="color: #2D3436; font-size: 20px; margin: 30px 0 15px 0; border-bottom: 2px solid #F9CA24; padding-bottom: 10px;">
                      📍 Prochaines étapes
                    </h2>

                    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                      <ol style="color: #2D3436; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                        <li><strong>Passez au secrétariat</strong> du Studio E Danse pour finaliser votre inscription</li>
                        <li><strong>Apportez les documents nécessaires</strong> (certificat médical, photo d'identité, etc.)</li>
                        <li><strong>Réglez le montant</strong> selon le mode de paiement choisi</li>
                        <li><strong>Récupérez votre carte d'adhérent</strong> et les informations pratiques</li>
                      </ol>
                    </div>

                    <h2 style="color: #2D3436; font-size: 20px; margin: 30px 0 15px 0; border-bottom: 2px solid #F9CA24; padding-bottom: 10px;">
                      📞 Nous contacter
                    </h2>

                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                      <tr>
                        <td style="padding: 10px 0;">
                          <p style="margin: 0; color: #2D3436; font-size: 14px;">
                            <strong>📧 Email :</strong> <a href="mailto:studioedanse@gmail.com" style="color: #F9CA24; text-decoration: none;">studioedanse@gmail.com</a>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0;">
                          <p style="margin: 0; color: #2D3436; font-size: 14px;">
                            <strong>📱 Téléphone :</strong> <a href="tel:0698273098" style="color: #F9CA24; text-decoration: none;">06 98 27 30 98</a>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0;">
                          <p style="margin: 0; color: #2D3436; font-size: 14px;">
                            <strong>🌐 Site web :</strong> <a href="https://www.studioedanse.fr" style="color: #F9CA24; text-decoration: none;">www.studioedanse.fr</a>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0;">
                          <p style="margin: 0; color: #2D3436; font-size: 14px;">
                            <strong>📍 Adresse :</strong> 3 Rue de la Danse, 75000 Paris
                          </p>
                        </td>
                      </tr>
                    </table>

                    <p style="color: #2D3436; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">
                      À très bientôt au Studio E Danse ! 💃🕺
                    </p>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 20px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; margin: 0;">
                      Cet email a été envoyé automatiquement suite à votre pré-inscription en ligne.
                    </p>
                    <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0;">
                      © ${new Date().getFullYear()} Studio E Danse - Tous droits réservés
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: 'Studio E Danse <noreply@studioedanse.fr>',
      to: [data.emailResponsable],
      subject: `✅ Confirmation de pré-inscription - ${data.nomEleve}`,
      html: htmlContent,
    });

    if (error) {
      console.error('Erreur envoi email:', error);
      return { success: false, error };
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return { success: false, error };
  }
}

export async function envoyerEmailListeAttente(
  nomComplet: string,
  email: string,
  coursNom: string,
  position: number
) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Inscription liste d'attente - Studio E Danse</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                
                <tr>
                  <td style="background-color: #2D3436; padding: 30px 40px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Studio E Danse</h1>
                    <p style="color: #F9CA24; margin: 10px 0 0 0; font-size: 16px;">Liste d'attente</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 40px;">
                    
                    <p style="color: #2D3436; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Bonjour ${nomComplet},
                    </p>

                    <p style="color: #2D3436; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Vous êtes bien inscrit(e) sur la liste d'attente pour le cours :
                    </p>

                    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #F9CA24; margin: 20px 0;">
                      <p style="color: #2D3436; font-size: 18px; font-weight: bold; margin: 0;">
                        ${coursNom}
                      </p>
                      <p style="color: #6b7280; font-size: 14px; margin: 10px 0 0 0;">
                        Votre position : <strong style="color: #F9CA24; font-size: 20px;">#${position}</strong>
                      </p>
                    </div>

                    <div style="background-color: #DBEAFE; border-left: 4px solid #3B82F6; padding: 15px; margin: 20px 0; border-radius: 4px;">
                      <p style="color: #1E40AF; margin: 0; font-size: 14px; line-height: 1.6;">
                        ℹ️ <strong>Information :</strong> Nous vous contacterons dès qu'une place se libère. 
                        En attendant, n'hésitez pas à nous contacter pour vérifier les disponibilités en temps réel.
                      </p>
                    </div>

                    <h2 style="color: #2D3436; font-size: 20px; margin: 30px 0 15px 0; border-bottom: 2px solid #F9CA24; padding-bottom: 10px;">
                      📞 Nous contacter
                    </h2>

                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                      <tr>
                        <td style="padding: 10px 0;">
                          <p style="margin: 0; color: #2D3436; font-size: 14px;">
                            <strong>📧 Email :</strong> <a href="mailto:studioedanse@gmail.com" style="color: #F9CA24; text-decoration: none;">studioedanse@gmail.com</a>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0;">
                          <p style="margin: 0; color: #2D3436; font-size: 14px;">
                            <strong>📱 Téléphone :</strong> <a href="tel:0698273098" style="color: #F9CA24; text-decoration: none;">06 98 27 30 98</a>
                          </p>
                        </td>
                      </tr>
                    </table>

                    <p style="color: #2D3436; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">
                      À très bientôt ! 💃🕺
                    </p>

                  </td>
                </tr>

                <tr>
                  <td style="background-color: #f9fafb; padding: 20px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; margin: 0;">
                      © ${new Date().getFullYear()} Studio E Danse - Tous droits réservés
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: 'Studio E Danse <noreply@studioedanse.fr>',
      to: [email],
      subject: `📋 Liste d'attente - ${coursNom}`,
      html: htmlContent,
    });

    if (error) {
      console.error('Erreur envoi email liste attente:', error);
      return { success: false, error };
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error('Erreur envoi email liste attente:', error);
    return { success: false, error };
  }
}
