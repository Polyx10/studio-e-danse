"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "Cours", href: "/cours" },
  { name: "Équipe", href: "/equipe" },
  { name: "Tarifs", href: "/tarifs" },
  { name: "Stages", href: "/stages" },
  { name: "Actualités", href: "/actualites" },
  { name: "Archives", href: "/archives" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleInscriptionClick = (e: React.MouseEvent) => {
    if (pathname === '/inscription') {
      e.preventDefault();
      // Rediriger vers /inscription?reset=1 pour réinitialiser le formulaire
      router.push('/inscription?reset=1');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="bg-[#2D3436] text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <a href="tel:0698273098" className="flex items-center gap-1 hover:text-amber-300 transition">
              <Phone className="h-3 w-3" />
              <span>06 98 27 30 98</span>
            </a>
            <a href="mailto:studioedanse@gmail.com" className="flex items-center gap-1 hover:text-amber-300 transition">
              <Mail className="h-3 w-3" />
              <span>studioedanse@gmail.com</span>
            </a>
          </div>
          <div className="hidden md:block">
            54 rue Sébastopol, 29200 Brest
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="bg-white/95 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-[120px]">
            {/* Logo */}
            <Link href="/" className="flex items-center -ml-3">
              <Image
                src="/images/logo-hd.png"
                alt="Studio e - École de danse"
                width={600}
                height={400}
                className="h-[105px] w-[189px] object-fill"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-6 py-3 text-lg font-medium text-gray-700 hover:text-[#2D3436] hover:bg-amber-50 rounded-md transition"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <Button asChild className="bg-[#2D3436] hover:bg-[#3d4446]">
                <Link href="/inscription" onClick={handleInscriptionClick}>S&apos;inscrire</Link>
              </Button>
            </div>

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-3 text-lg font-medium text-gray-700 hover:text-[#2D3436] hover:bg-amber-50 rounded-md transition"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="pt-4 border-t">
                    <Button asChild className="w-full bg-[#2D3436] hover:bg-[#3d4446]">
                      <Link 
                        href="/inscription" 
                        onClick={(e) => {
                          setIsOpen(false);
                          handleInscriptionClick(e);
                        }}
                      >
                        S&apos;inscrire
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
