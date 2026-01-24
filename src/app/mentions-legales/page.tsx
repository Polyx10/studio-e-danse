import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MentionsLegales() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Mentions Légales</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>1. Éditeur du site</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2"><strong>Studio E - École de danse</strong></p>
          <p className="mb-2">Association loi 1901</p>
          <p className="mb-2">Siège social : [Adresse complète]</p>
          <p className="mb-2">Email : contact@studio-e-danse.fr</p>
          <p className="mb-2">Téléphone : [Numéro de téléphone]</p>
          <p className="mb-2">Numéro SIRET : [Numéro SIRET]</p>
          <p className="mb-2">Directrice de publication : [Nom de la directrice]</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>2. Hébergement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2"><strong>Vercel Inc.</strong></p>
          <p className="mb-2">340 S Lemon Ave #4133</p>
          <p className="mb-2">Walnut, CA 91789, USA</p>
          <p className="mb-2">Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">vercel.com</a></p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>3. Base de données</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2"><strong>Neon (Neon Inc.)</strong></p>
          <p className="mb-2">Site web : <a href="https://neon.tech" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">neon.tech</a></p>
          <p className="mb-4 mt-4"><strong>Supabase Inc.</strong></p>
          <p className="mb-2">Site web : <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">supabase.com</a></p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>4. Propriété intellectuelle</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">L&apos;ensemble de ce site relève de la législation française et internationale sur le droit d&apos;auteur et la propriété intellectuelle.</p>
          <p className="mb-4">Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.</p>
          <p>La reproduction de tout ou partie de ce site sur un support électronique ou autre quel qu&apos;il soit est formellement interdite sauf autorisation expresse du directeur de la publication.</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>5. Protection des données personnelles</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Conformément à la loi « Informatique et Libertés » du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD), vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression et d&apos;opposition aux données personnelles vous concernant.</p>
          <p>Pour plus d&apos;informations, consultez notre <a href="/politique-confidentialite" className="text-blue-600 underline">Politique de Confidentialité</a>.</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>6. Cookies</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Ce site utilise uniquement des cookies techniques nécessaires à son fonctionnement. Aucun cookie de tracking ou publicitaire n&apos;est utilisé.</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>7. Liens hypertextes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Le site peut contenir des liens hypertextes vers d&apos;autres sites. Studio E n&apos;exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>8. Limitation de responsabilité</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Studio E s&apos;efforce d&apos;assurer au mieux de ses possibilités l&apos;exactitude et la mise à jour des informations diffusées sur ce site.</p>
          <p>Toutefois, Studio E ne peut garantir l&apos;exactitude, la précision ou l&apos;exhaustivité des informations mises à disposition sur ce site et décline toute responsabilité pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur ce site.</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>9. Droit applicable</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
        </CardContent>
      </Card>

      <div className="text-center mt-8">
        <a href="/" className="text-blue-600 underline">Retour à l&apos;accueil</a>
      </div>
    </div>
  );
}
