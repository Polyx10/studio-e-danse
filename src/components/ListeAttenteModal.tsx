"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CoursPlanning } from "@/lib/planning-data";
import { ajouterListeAttente } from "@/hooks/useQuotas";
import { CheckCircle2 } from "lucide-react";

interface ListeAttenteModalProps {
  cours: CoursPlanning | null;
  open: boolean;
  onClose: () => void;
}

export function ListeAttenteModal({ cours, open, onClose }: ListeAttenteModalProps) {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [position, setPosition] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cours) return;

    setIsSubmitting(true);
    try {
      const result = await ajouterListeAttente(
        cours.id,
        cours.nom,
        formData.nom,
        formData.email,
        formData.telephone
      );

      if (result.success) {
        setIsSuccess(true);
        setPosition(result.position);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout à la liste d'attente:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ nom: "", email: "", telephone: "" });
    setIsSuccess(false);
    setPosition(null);
    onClose();
  };

  if (!cours) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {!isSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle>Liste d&apos;attente - {cours.nom}</DialogTitle>
              <DialogDescription>
                Ce cours est actuellement complet en ligne. Inscrivez-vous sur la liste d&apos;attente
                et nous vous contacterons dès qu&apos;une place se libère.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom complet *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  required
                  placeholder="Prénom Nom"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="email@exemple.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone *</Label>
                <Input
                  id="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  required
                  placeholder="06 12 34 56 78"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>ℹ️ Information :</strong> Vous pouvez également contacter directement
                  le secrétariat pour vérifier la disponibilité en temps réel.
                </p>
                <p className="text-sm text-gray-600">
                  📞 06 98 27 30 98<br />
                  📧 studioedanse@gmail.com
                </p>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#F9CA24] text-[#2D3436] hover:bg-amber-400"
                >
                  {isSubmitting ? "Inscription..." : "M'inscrire sur la liste d'attente"}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <DialogTitle className="text-center">Inscription confirmée !</DialogTitle>
              <DialogDescription className="text-center">
                Vous êtes inscrit(e) sur la liste d&apos;attente pour le cours <strong>{cours.nom}</strong>.
              </DialogDescription>
            </DialogHeader>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-lg font-semibold text-gray-900 mb-2">
                Votre position : {position}
              </p>
              <p className="text-sm text-gray-600">
                Nous vous contacterons dès qu&apos;une place se libère.
              </p>
            </div>

            <DialogFooter>
              <Button onClick={handleClose} className="w-full bg-[#2D3436] hover:bg-[#3d4446]">
                Fermer
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
