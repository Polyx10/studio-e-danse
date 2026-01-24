"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  CheckCircle2
} from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2D3436] to-[#3d4446] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contactez-nous</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Une question, une demande d&apos;information ? N&apos;hésitez pas à nous contacter, 
              nous vous répondrons dans les meilleurs délais.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Adresse</h3>
                      <p className="text-gray-600">
                        54 rue Sébastopol<br />
                        29200 Brest
                      </p>
                      <a 
                        href="https://maps.google.com/?q=54+rue+Sebastopol+29200+Brest"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#F9CA24] hover:text-rose-700 text-sm mt-2 inline-block"
                      >
                        Voir sur Google Maps →
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-[#2D3436]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Téléphone</h3>
                      <p className="text-gray-600">
                        <a href="tel:0698273098" className="hover:text-[#F9CA24]">
                          06 98 27 30 98
                        </a>
                      </p>
                      <p className="text-gray-600">
                        <a href="tel:0298416279" className="hover:text-[#F9CA24]">
                          02 98 41 62 79
                        </a>
                        <span className="text-sm text-gray-500"> (secrétariat)</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-[#2D3436]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <a 
                        href="mailto:studioedanse@gmail.com"
                        className="text-[#F9CA24] hover:text-rose-700"
                      >
                        studioedanse@gmail.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Horaires du secrétariat</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex justify-between gap-4">
                          <span>Mardi</span>
                          <span>15h00 - 19h30</span>
                        </li>
                        <li className="flex justify-between gap-4">
                          <span>Mercredi</span>
                          <span>10h15 - 19h00</span>
                        </li>
                        <li className="flex justify-between gap-4">
                          <span>Jeudi</span>
                          <span>15h00 - 19h30</span>
                        </li>
                        <li className="flex justify-between gap-4">
                          <span>Vendredi</span>
                          <span>15h30 - 19h45</span>
                        </li>
                        <li className="flex justify-between gap-4">
                          <span>Samedi</span>
                          <span>09h45 - 16h00</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Envoyez-nous un message</CardTitle>
                  <CardDescription>
                    Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Message envoyé !
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Merci pour votre message. Nous vous répondrons dans les meilleurs délais.
                      </p>
                      <Button 
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
                        }}
                        variant="outline"
                      >
                        Envoyer un autre message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nom complet *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Votre nom"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="votre@email.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Téléphone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="06 XX XX XX XX"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">Sujet *</Label>
                          <Input
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            placeholder="Objet de votre message"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Votre message..."
                          rows={6}
                          required
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-[#2D3436] hover:bg-[#3d4446]"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "Envoi en cours..."
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Envoyer le message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-96 bg-gray-200 relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2659.5!2d-4.486!3d48.39!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4816bbe1d6e3e3e3%3A0x0!2s54%20Rue%20S%C3%A9bastopol%2C%2029200%20Brest!5e0!3m2!1sfr!2sfr!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Localisation Studio e"
        />
      </section>

      {/* Association Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              L&apos;Association Studio e - école de danse
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed mb-4">
                Studio e - école de danse est une association loi 1901 créée le 9 mai 2018. 
                Le siège social est situé au 54 rue Sébastopol 29200 Brest.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Studio e - école de danse a pour objet l&apos;enseignement de la danse et disciplines 
                associées, de développer des projets de création à l&apos;interne ou en intégrant 
                des artistes extérieurs.
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Nos activités</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Cours de danse, stretching, barre au sol, renforcement musculaire</li>
                <li>Stages pour élèves de l&apos;école et élèves extérieurs</li>
                <li>Préparation aux concours nationaux et internationaux</li>
                <li>Création de spectacles</li>
                <li>Location de salle pour résidences d&apos;artistes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
