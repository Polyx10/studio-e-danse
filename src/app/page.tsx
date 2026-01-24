import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

const courses = [
  {
    title: "Éveil",
    age: "4-6 ans",
    description: "Découverte ludique de la danse à travers le jeu et l'expression corporelle.",
  },
  {
    title: "Initiation",
    age: "6-7 ans",
    description: "Approfondissement des bases et développement du sens du rythme.",
  },
  {
    title: "Danse Classique",
    age: "8 ans et +",
    description: "La base de toutes les danses, rigueur et élégance au programme.",
  },
  {
    title: "Modern'Jazz",
    age: "8 ans et +",
    description: "Énergie, expression et technique dans une danse dynamique.",
  },
  {
    title: "Contemporain",
    age: "Ados/Adultes",
    description: "Liberté d'expression et créativité au cœur du mouvement.",
  },
  {
    title: "Barre au sol",
    age: "15 ans et +",
    description: "Renforcement musculaire et assouplissement en douceur.",
  },
];

const teachers = [
  {
    name: "Audrey",
    specialty: "Jazz",
    description: "Professeure chorégraphe titulaire du DE option Jazz depuis 2011",
  },
  {
    name: "Jeanette Moreno Silva",
    specialty: "Classique & Contemporain",
    description: "Diplômée de l'École Nationale de Ballet de Cuba",
  },
  {
    name: "Aymeric",
    specialty: "Classique",
    description: "Ancien danseur du Conservatoire National Supérieur de Lyon",
  },
  {
    name: "Romane",
    specialty: "Jazz",
    description: "Formée à l'école Sandie Trévien puis Studio e",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-[#2D3436] overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img 
            src="/images/hero-danse.png" 
            alt="Spectacle de danse Studio e"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              Label Qualité FFDanse 2023-2026
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="block">STUDIO<span className="text-[#F9CA24]"> e</span></span>
              <span className="block text-2xl md:text-3xl font-normal mt-2 text-gray-300">
                École de danse à Brest
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Découvrez la passion de la danse avec nos professeurs diplômés. 
              Modern&apos;Jazz, Classique, Contemporain pour tous les âges et niveaux.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-[#F9CA24] text-[#2D3436] hover:bg-amber-400 text-lg px-8">
                <Link href="/inscription">
                  S&apos;inscrire maintenant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-white text-[#2D3436] hover:bg-gray-100 text-lg px-8">
                <Link href="/cours">
                  Découvrir nos cours
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>54 rue Sébastopol, 29200 Brest</div>
            <div>Cours du lundi au samedi</div>
            <div>Enfants, Ados & Adultes</div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Cours de Danse</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une variété de styles pour tous les âges et tous les niveaux, 
              encadrés par des professeurs passionnés et diplômés.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.title} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                  <Badge variant="secondary" className="mb-3">{course.age}</Badge>
                  <p className="text-gray-600">{course.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-[#2D3436] hover:bg-[#3d4446]">
              <Link href="/cours">
                Voir tous les cours
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Teachers Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Notre Équipe</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des professeurs diplômés et passionnés, avec une expérience 
              nationale et internationale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teachers.map((teacher) => (
              <div key={teacher.name} className="text-center group">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center text-4xl font-bold text-[#2D3436] group-hover:scale-105 transition-transform">
                  {teacher.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{teacher.name}</h3>
                <Badge className="my-2 bg-amber-100 text-[#2D3436] hover:bg-amber-200">
                  {teacher.specialty}
                </Badge>
                <p className="text-gray-600 text-sm">{teacher.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/equipe">
                Découvrir l&apos;équipe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#2D3436] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Prêt à danser ?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Inscrivez-vous en ligne et venez finaliser votre inscription à l&apos;école. 
            Cours d&apos;essai possible !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-[#F9CA24] text-[#2D3436] hover:bg-amber-400">
              <Link href="/inscription">
                S&apos;inscrire en ligne
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/planning">
                Voir le planning
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Nos Parrains</h3>
            <p className="text-gray-600">Des artistes reconnus qui soutiennent notre école</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {["Thierry Verger", "Luciano Dinatale", "Arthur Cadre"].map((name) => (
              <div key={name} className="text-center">
                <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
                  {name.split(' ').map(n => n[0]).join('')}
                </div>
                <p className="font-semibold text-gray-700">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
