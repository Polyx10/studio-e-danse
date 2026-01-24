import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Award, GraduationCap, Globe } from "lucide-react";

export const metadata = {
  title: "Notre Équipe | Studio e - École de danse à Brest",
  description: "Découvrez nos professeurs diplômés et passionnés : Audrey, Jeanette, Aymeric, Romane. Une équipe expérimentée pour vous accompagner.",
};

const teachers = [
  {
    name: "Audrey",
    role: "Professeure & Chorégraphe",
    specialty: "Jazz",
    image: "/images/teachers/audrey.jpg",
    diploma: "Diplôme d'État option Jazz (2011)",
    description: "Professeure chorégraphe titulaire du DE option Jazz depuis 2011, Audrey a dansé pour de nombreuses compagnies telles que Cie Thierry Verger, Cie Jean-Claude Marignale, Elwira Piorun, Kama Giergon \"Modal Pl\".",
    experience: [
      "Danseuse pour la Cie Thierry Verger",
      "Danseuse pour la Cie Jean-Claude Marignale",
      "Collaboration avec Elwira Piorun",
      "Collaboration avec Kama Giergon \"Modal Pl\"",
      "Enseignement en France et à l'international",
    ],
    color: "from-amber-400 to-orange-500",
  },
  {
    name: "Jeanette Moreno Silva",
    role: "Professeure",
    specialty: "Classique & Contemporain",
    image: "/images/teachers/jeanette.jpg",
    diploma: "École Nationale de Ballet \"Alicia Alonso\" de Cuba",
    description: "Diplômée de l'École Nationale de Ballet \"Alicia Alonso\" de Cuba, Jeanette possède plus de 30 ans d'expérience dans l'enseignement de la danse classique et contemporaine, principalement en Espagne.",
    experience: [
      "Plus de 30 ans d'expérience d'enseignement",
      "Formation à l'École Nationale de Ballet de Cuba",
      "Carrière de danseuse professionnelle",
      "Enseignement principalement en Espagne",
      "Spécialiste du répertoire classique",
    ],
    color: "from-rose-400 to-pink-500",
  },
  {
    name: "Aymeric",
    role: "Professeur",
    specialty: "Classique",
    image: "/images/teachers/aymeric.jpg",
    diploma: "Conservatoire National Supérieur de Lyon / S.A.B. (NYC Ballet)",
    description: "Après des études au Conservatoire National Supérieur de Lyon puis à S.A.B. (école du New York City Ballet), Aymeric a mené une carrière de danseur professionnel pendant vingt années.",
    experience: [
      "Formation au Conservatoire National Supérieur de Lyon",
      "Formation à la School of American Ballet (NYC)",
      "20 ans de carrière de danseur professionnel",
      "Expérience internationale",
      "Transmission du répertoire classique",
    ],
    color: "from-indigo-400 to-purple-500",
  },
  {
    name: "Romane",
    role: "Professeure",
    specialty: "Jazz",
    image: "/images/teachers/romane.jpg",
    diploma: "Formation continue",
    description: "À l'âge de 4 ans, Romane commence la danse au sein de l'École Sandie Trévien jusqu'à ses 19 ans avant de rejoindre l'association Dansemble puis l'École Studio E à Brest.",
    experience: [
      "15 ans de formation à l'École Sandie Trévien",
      "Membre de l'association Dansemble",
      "Danseuse et professeure à Studio e",
      "Participation à de nombreux concours",
      "Passion pour la transmission",
    ],
    color: "from-teal-400 to-cyan-500",
  },
];

const sponsors = [
  {
    name: "Thierry Verger",
    role: "Chorégraphe",
    description: "Chorégraphe reconnu, fondateur de sa compagnie",
  },
  {
    name: "Luciano Dinatale",
    role: "Danseur & Chorégraphe",
    description: "Artiste international de renom",
  },
  {
    name: "Arthur Cadre",
    role: "Danseur",
    description: "Danseur professionnel et artiste",
  },
];

export default function EquipePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2D3436] to-[#3d4446] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Notre Équipe</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Des professeurs diplômés et passionnés, avec une expérience nationale et internationale, 
              qui partagent leur amour de la danse avec bienveillance et exigence.
            </p>
          </div>
        </div>
      </section>

      {/* Teachers Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            {teachers.map((teacher, index) => (
              <Card key={teacher.name} className="overflow-hidden border-0 shadow-lg">
                <div className={`h-2 bg-gradient-to-r ${teacher.color}`} />
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-3 gap-0">
                    {/* Photo placeholder */}
                    <div className={`bg-gradient-to-br ${teacher.color} p-8 flex items-center justify-center min-h-[300px]`}>
                      <div className="w-40 h-40 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                        <span className="text-6xl font-bold text-white">
                          {teacher.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div className="md:col-span-2 p-8">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                            {teacher.name}
                          </h2>
                          <p className="text-gray-600">{teacher.role}</p>
                        </div>
                        <Badge className="bg-amber-100 text-[#2D3436] hover:bg-amber-200 text-sm">
                          {teacher.specialty}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <GraduationCap className="h-4 w-4 text-[#F9CA24]" />
                        <span>{teacher.diploma}</span>
                      </div>

                      <p className="text-gray-700 leading-relaxed mb-6">
                        {teacher.description}
                      </p>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Globe className="h-4 w-4 text-[#F9CA24]" />
                          Parcours
                        </h4>
                        <ul className="grid sm:grid-cols-2 gap-2">
                          {teacher.experience.map((exp, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                              <span className="text-[#F9CA24] mt-0.5">•</span>
                              {exp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-amber-100 text-[#2D3436]">
              
              Parrains de l&apos;école
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Parrains</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des artistes reconnus qui soutiennent et accompagnent notre école dans sa mission.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {sponsors.map((sponsor) => (
              <Card key={sponsor.name} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center">
                    <span className="text-3xl font-bold text-[#2D3436]">
                      {sponsor.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{sponsor.name}</h3>
                  <p className="text-[#F9CA24] font-medium text-sm mb-2">{sponsor.role}</p>
                  <p className="text-gray-600 text-sm">{sponsor.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Label Section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-[#2D3436] text-white">
              
              Certification
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Label Qualité FFDanse 2023-2026
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Studio e - école de danse, structure affiliée à la Fédération Française de Danse, 
              s&apos;est vu décerner le 5 mai 2024 le Label Qualité FFDanse.
            </p>
            <p className="text-gray-600">
              Studio e s&apos;attache à accueillir tous les publics, partage ses valeurs, 
              ses pratiques sportives et culturelles avec l&apos;ensemble de ses membres.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Rejoignez-nous !
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Venez découvrir nos cours et rencontrer notre équipe passionnée.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-[#2D3436] hover:bg-[#3d4446]">
              <Link href="/inscription">
                S&apos;inscrire
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">
                Nous contacter
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
