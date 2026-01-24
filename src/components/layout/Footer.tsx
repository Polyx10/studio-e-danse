import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#2D3436] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Image
              src="/images/logo.png"
              alt="Studio e - École de danse"
              width={150}
              height={50}
              className="h-12 w-auto"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              École de danse située à Brest, nous proposons des cours de danse Modern&apos;Jazz, 
              Classique, Contemporain et bien plus pour tous les âges et niveaux.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs bg-[#F9CA24]/20 text-[#F9CA24] px-3 py-1 rounded-full">
                Label Qualité FFDanse 2023-2026
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              {[
                { name: "Accueil", href: "/" },
                { name: "Nos cours", href: "/cours" },
                { name: "L'équipe", href: "/equipe" },
                { name: "Planning & Tarifs", href: "/planning" },
                { name: "Inscription", href: "/inscription" },
                { name: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-[#F9CA24] transition text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://maps.google.com/?q=54+rue+Sebastopol+29200+Brest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-gray-400 hover:text-[#F9CA24] transition text-sm"
                >
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>54 rue Sébastopol<br />29200 Brest</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:0698273098"
                  className="flex items-center gap-3 text-gray-400 hover:text-[#F9CA24] transition text-sm"
                >
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>06 98 27 30 98</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:0298416279"
                  className="flex items-center gap-3 text-gray-400 hover:text-[#F9CA24] transition text-sm"
                >
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>02 98 41 62 79 (secrétariat)</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:studioedanse@gmail.com"
                  className="flex items-center gap-3 text-gray-400 hover:text-[#F9CA24] transition text-sm"
                >
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span>studioedanse@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Horaires */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Horaires du secrétariat</h3>
            <ul className="space-y-1 text-sm text-gray-400">
              <li className="flex justify-between">
                <span>Mardi</span>
                <span>15h00 - 19h30</span>
              </li>
              <li className="flex justify-between">
                <span>Mercredi</span>
                <span>10h15 - 19h00</span>
              </li>
              <li className="flex justify-between">
                <span>Jeudi</span>
                <span>15h00 - 19h30</span>
              </li>
              <li className="flex justify-between">
                <span>Vendredi</span>
                <span>15h30 - 19h45</span>
              </li>
              <li className="flex justify-between">
                <span>Samedi</span>
                <span>09h45 - 16h00</span>
              </li>
            </ul>
            
            {/* Social Media */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">Suivez-nous</h4>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-[#F9CA24] rounded-full flex items-center justify-center transition"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-[#F9CA24] rounded-full flex items-center justify-center transition"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-[#F9CA24] rounded-full flex items-center justify-center transition"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Studio e - École de danse. Tous droits réservés.</p>
            <div className="flex gap-6">
              <Link href="/mentions-legales" className="hover:text-[#F9CA24] transition">
                Mentions légales
              </Link>
              <Link href="/politique-confidentialite" className="hover:text-[#F9CA24] transition">
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
