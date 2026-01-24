import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PolitiqueConfidentialite() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Politique de Confidentialité</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>1. Responsable du traitement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2"><strong>Studio E - École de danse</strong></p>
          <p className="mb-2">Adresse : [Adresse complète]</p>
          <p className="mb-2">Email : contact@studio-e-danse.fr</p>
          <p className="mb-2">Téléphone : [Numéro de téléphone]</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>2. Données collectées</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Dans le cadre de votre inscription, nous collectons les données personnelles suivantes :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Données de l&apos;élève :</strong> nom, prénom, date de naissance, sexe, adresse postale, téléphone, email</li>
            <li><strong>Données des responsables légaux :</strong> nom, prénom, téléphone, email (pour les mineurs)</li>
            <li><strong>Données relatives à l&apos;inscription :</strong> cours sélectionnés, options, tarifs, mode de paiement</li>
            <li><strong>Consentements :</strong> acceptation du règlement intérieur, droit à l&apos;image</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>3. Finalités du traitement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Vos données personnelles sont collectées pour les finalités suivantes :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Gestion des inscriptions et des cours</li>
            <li>Communication avec les adhérents et leurs responsables légaux</li>
            <li>Gestion administrative et comptable</li>
            <li>Envoi d&apos;informations relatives aux activités de l&apos;école</li>
            <li>Respect des obligations légales (licence FFD, assurance)</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>4. Base légale du traitement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Le traitement de vos données repose sur :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>L&apos;exécution du contrat :</strong> votre inscription nécessite le traitement de vos données</li>
            <li><strong>Le consentement :</strong> pour l&apos;envoi de communications non essentielles</li>
            <li><strong>Les obligations légales :</strong> pour la déclaration à la FFD et les obligations comptables</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>5. Destinataires des données</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Vos données personnelles sont accessibles :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Au personnel administratif du Studio E</li>
            <li>Aux professeurs de danse (uniquement les données nécessaires)</li>
            <li>À la Fédération Française de Danse (FFD) pour la licence</li>
            <li>À notre prestataire d&apos;hébergement (Vercel, Neon Database)</li>
            <li>À notre prestataire d&apos;envoi d&apos;emails (Resend)</li>
          </ul>
          <p className="mt-4">Nous ne vendons ni ne louons vos données à des tiers.</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>6. Durée de conservation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Vos données sont conservées pendant :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Adhérents actifs :</strong> pendant toute la durée de votre adhésion + 3 ans</li>
            <li><strong>Données comptables :</strong> 10 ans (obligation légale)</li>
            <li><strong>Liste d&apos;attente :</strong> jusqu&apos;à la fin de la saison en cours</li>
          </ul>
          <p className="mt-4">Passé ces délais, vos données sont supprimées ou anonymisées.</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>7. Vos droits</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Droit d&apos;accès :</strong> obtenir une copie de vos données</li>
            <li><strong>Droit de rectification :</strong> corriger vos données inexactes</li>
            <li><strong>Droit à l&apos;effacement :</strong> demander la suppression de vos données</li>
            <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
            <li><strong>Droit à la portabilité :</strong> récupérer vos données dans un format structuré</li>
            <li><strong>Droit d&apos;opposition :</strong> vous opposer au traitement de vos données</li>
            <li><strong>Droit de retirer votre consentement :</strong> à tout moment</li>
          </ul>
          <p className="mt-4">Pour exercer ces droits, contactez-nous à : <strong>contact@studio-e-danse.fr</strong></p>
          <p className="mt-2">Vous disposez également du droit d&apos;introduire une réclamation auprès de la CNIL : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">www.cnil.fr</a></p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>8. Sécurité des données</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Nous mettons en œuvre les mesures techniques et organisationnelles appropriées pour protéger vos données :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Chiffrement des données en transit (HTTPS/TLS)</li>
            <li>Chiffrement des données au repos</li>
            <li>Accès restreint aux données (authentification)</li>
            <li>Sauvegardes régulières</li>
            <li>Hébergement sécurisé (Vercel, Neon Database)</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>9. Cookies</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Notre site utilise uniquement des cookies techniques nécessaires au fonctionnement du site (gestion de session). Aucun cookie de tracking ou publicitaire n&apos;est utilisé.</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>10. Modifications</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cette politique de confidentialité peut être modifiée à tout moment. La version en vigueur est celle publiée sur cette page.</p>
          <p className="mt-4"><strong>Dernière mise à jour :</strong> 24 janvier 2026</p>
        </CardContent>
      </Card>

      <div className="text-center mt-8">
        <a href="/inscription" className="text-blue-600 underline">Retour au formulaire d&apos;inscription</a>
      </div>
    </div>
  );
}
