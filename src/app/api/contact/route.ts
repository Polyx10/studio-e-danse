import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder_key');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nouveau message de contact - Studio E Danse</title>
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
                      <p style="color: #F9CA24; margin: 10px 0 0 0; font-size: 16px;">Nouveau message de contact</p>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="color: #2D3436; margin: 0 0 20px 0; font-size: 22px;">Message reçu depuis le formulaire de contact</h2>
                      
                      <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;"><strong>Nom :</strong></td>
                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${name}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>Email :</strong></td>
                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px;"><a href="mailto:${email}" style="color: #F9CA24; text-decoration: none;">${email}</a></td>
                          </tr>
                          ${phone ? `
                          <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>Téléphone :</strong></td>
                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${phone}</td>
                          </tr>
                          ` : ''}
                          <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>Sujet :</strong></td>
                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${subject}</td>
                          </tr>
                        </table>
                      </div>

                      <div style="background-color: #ffffff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 6px;">
                        <h3 style="color: #2D3436; margin: 0 0 12px 0; font-size: 16px;">Message :</h3>
                        <p style="color: #1f2937; margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                      </div>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 20px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="color: #6b7280; margin: 0; font-size: 12px;">
                        Ce message a été envoyé depuis le formulaire de contact du site Studio E Danse<br>
                        <a href="mailto:${email}" style="color: #F9CA24; text-decoration: none;">Répondre à ${name}</a>
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

    const { data, error } = await resend.emails.send({
      from: 'Studio E Danse <contact@studioedanse.fr>',
      to: ['studioedansesecretariat@gmail.com'],
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html: htmlContent,
    });

    if (error) {
      console.error('Erreur Resend:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Message envoyé avec succès',
      emailId: data?.id 
    });

  } catch (error: any) {
    console.error('Erreur API contact:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'envoi du message' },
      { status: 500 }
    );
  }
}
