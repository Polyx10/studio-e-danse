"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Info, AlertCircle, Calculator, Users } from "lucide-react";
import { planningCours, professeursColors, tarifsSpeciaux, fraisFixes, getTarifForDuree, calculateAge, CoursPlanning, getCoursRecommandes } from "@/lib/planning-data";
import { useQuotas, incrementerQuota } from "@/hooks/useQuotas";
import { ListeAttenteModal } from "@/components/ListeAttenteModal";
import { calculerEcheancierSansCentimes } from "@/lib/echeancier";
import { genererPDFRecapitulatif, genererPDFEcheancier } from "@/lib/pdf-recapitulatif";
import { useConfig } from "@/hooks/useConfig";
import { getPeriodeFromDate, calculerTarifProrata, periodesLabels, vacancesDefaut2526 } from "@/lib/prorata-data";
import type { PeriodeProrata, VacancesScolaires } from "@/lib/prorata-data";

// Formater un montant avec 2 décimales (ex: 21.5 → "21,50")
function fmt(n: number): string {
  return n.toFixed(2).replace('.', ',');
}

function StepIndicator({ currentStep, isMajeur }: { currentStep: number; isMajeur: boolean }) {
  const steps = isMajeur
    ? [
        { num: 1, label: "Élève" },
        { num: 2, label: "Cours" },
        { num: 3, label: "Options" },
        { num: 4, label: "Validation" }
      ]
    : [
        { num: 1, label: "Élève" },
        { num: 2, label: "Responsables" },
        { num: 3, label: "Cours" },
        { num: 4, label: "Options" },
        { num: 5, label: "Validation" }
      ];
  
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((s, i) => (
        <div key={s.num} className="flex items-center">
          <div className={
            currentStep >= s.num 
              ? "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold bg-[#2D3436] text-white"
              : "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold bg-gray-300 text-gray-600"
          }>{s.num}</div>
          <span className={
            currentStep >= s.num
              ? "ml-2 text-sm font-medium hidden sm:block text-[#2D3436]"
              : "ml-2 text-sm font-medium hidden sm:block text-gray-400"
          }>{s.label}</span>
          {i < steps.length - 1 && (
            <div className={
              currentStep > s.num
                ? "w-6 sm:w-12 h-0.5 mx-2 bg-[#2D3436]"
                : "w-6 sm:w-12 h-0.5 mx-2 bg-gray-300"
            } />
          )}
        </div>
      ))}
    </div>
  );
}

export default function InscriptionPage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [pdfTelecharge, setPdfTelecharge] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [coursListeAttente, setCoursListeAttente] = useState<CoursPlanning | null>(null);
  
  // Réinitialiser le formulaire à l'étape 1 quand on clique sur "S'inscrire" dans le header
  useEffect(() => {
    if (searchParams.get('reset') === '1') {
      setStep(1);
      window.history.replaceState({}, '', '/inscription');
    }
  }, [searchParams]);
  
  // Charger les quotas pour tous les cours
  const coursIds = planningCours.map(c => c.id);
  const { quotas, loading: quotasLoading } = useQuotas(coursIds);

  // Charger la config (préinscription, prorata)
  const { preinscriptionActive, preinscriptionAnciensActive, preinscriptionTousActive, montantPreinscription, loading: configLoading } = useConfig();
  const [prorataConfig, setProrataConfig] = useState<{ vacances: VacancesScolaires; prorata_mode: string; prorata_periode_forcee: string | null }>({ vacances: vacancesDefaut2526, prorata_mode: 'auto', prorata_periode_forcee: null });

  useEffect(() => {
    fetch('/api/prorata-config').then(r => r.json()).then(data => setProrataConfig(data)).catch(() => {});
  }, []);
  
  const [formData, setFormData] = useState({
    adherentPrecedent: false,
    studentLastName: "",
    studentFirstName: "",
    studentGender: "F",
    studentBirthDate: "",
    studentAddress: "",
    studentPostalCode: "",
    studentCity: "",
    studentPhone: "",
    studentEmail: "",
    responsable1Name: "",
    responsable1Phone: "",
    responsable1Email: "",
    responsable2Name: "",
    responsable2Address: "",
    responsable2PostalCode: "",
    responsable2City: "",
    responsable2Phone: "",
    responsable2Email: "",
    tarifReduit: false,
    danseEtudesOption: "0",
    concoursOnStage: false,
    concoursClasses: false,
    participationSpectacle: "oui",
    nombreCostumes: "1",
    droitImage: "autorise",
    typeCours: "loisirs",
    modePaiement: [] as string[],
    nombreVersements: "1",
    acceptRules: false,
    signatureName: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Auto-forcer le certificat médical si concours ou Danse Études sélectionné
  const requiresCertificat = formData.concoursOnStage || formData.concoursClasses || formData.danseEtudesOption !== "0";
  useEffect(() => {
    if (requiresCertificat && formData.typeCours !== "danse-etudes") {
      setFormData(prev => ({ ...prev, typeCours: "danse-etudes" }));
    }
  }, [requiresCertificat]);

  const toggleCourse = (courseId: string) => {
    setSelectedCourses(prev => prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]);
  };

  // Déterminer si le prorata s'applique
  const prorataActif = useMemo(() => {
    if (prorataConfig.prorata_mode === 'force_off') return false;
    if (prorataConfig.prorata_mode === 'force_on') return true;
    // Mode auto : prorata si on n'est pas en période 1A (rentrée)
    const periode = getPeriodeFromDate(new Date(), prorataConfig.vacances);
    return periode !== '1A';
  }, [prorataConfig]);

  const periodeActuelle = useMemo((): PeriodeProrata => {
    if (prorataConfig.prorata_mode === 'force_on' && prorataConfig.prorata_periode_forcee) {
      return prorataConfig.prorata_periode_forcee as PeriodeProrata;
    }
    return getPeriodeFromDate(new Date(), prorataConfig.vacances);
  }, [prorataConfig]);

  const tarifCalcule = useMemo(() => {
    const selectedCoursesData = planningCours.filter((c: CoursPlanning) => selectedCourses.includes(c.id));
    const totalMinutes = selectedCoursesData.filter((c: CoursPlanning) => !c.isDanseEtudes && !c.isConcours).reduce((sum: number, c: CoursPlanning) => sum + c.duree, 0);
    const age = calculateAge(formData.studentBirthDate);
    const isReduit = formData.tarifReduit;

    // Tarif cours : prorata ou plein tarif
    let tarifCours = 0;
    if (totalMinutes > 0) {
      if (prorataActif) {
        tarifCours = calculerTarifProrata(totalMinutes, isReduit, periodeActuelle);
      } else {
        tarifCours = getTarifForDuree(totalMinutes, isReduit);
      }
    }
    const tarifCoursAnnuel = totalMinutes > 0 ? getTarifForDuree(totalMinutes, isReduit) : 0;

    const tarifDanseEtudes = formData.danseEtudesOption === "1" ? tarifsSpeciaux.danseEtudes1 : formData.danseEtudesOption === "2" ? tarifsSpeciaux.danseEtudes2 : 0;
    const adhesion = fraisFixes.adhesion;
    const licenceFFD = age < 4 ? fraisFixes.licenceFFDMoins4ans : fraisFixes.licenceFFD;
    const totalCours = tarifCours + tarifDanseEtudes;
    const totalFrais = adhesion + licenceFFD;
    const total = totalCours + totalFrais;
    return { totalMinutes, tarifCours, tarifCoursAnnuel, tarifDanseEtudes, adhesion, licenceFFD, totalCours, totalFrais, total, age };
  }, [selectedCourses, formData.tarifReduit, formData.danseEtudesOption, formData.studentBirthDate, prorataActif, periodeActuelle]);

  // Options de versements disponibles selon le montant des cours
  const versementsDisponibles = useMemo(() => {
    const options = ["1"];
    if (tarifCalcule.tarifCours >= 270) options.push("3");
    if (tarifCalcule.tarifCours >= 500) options.push("10");
    return options;
  }, [tarifCalcule.tarifCours]);

  // Réinitialiser le nombre de versements si l'option n'est plus disponible
  useEffect(() => {
    if (!versementsDisponibles.includes(formData.nombreVersements)) {
      setFormData(prev => ({ ...prev, nombreVersements: "1" }));
    }
  }, [versementsDisponibles]);

  // Pas de préinscription quand le prorata est actif (prorata = en cours d'année, pas de période de préinscription)
  const preinscriptionEffective = preinscriptionActive && !prorataActif;

  const echeances = useMemo(() => {
    if (tarifCalcule.total <= 0) return [];
    const nbVersements = parseInt(formData.nombreVersements) || 1;
    return calculerEcheancierSansCentimes(
      tarifCalcule.total,
      nbVersements,
      preinscriptionEffective,
      tarifCalcule.adhesion,
      tarifCalcule.licenceFFD
    );
  }, [tarifCalcule.total, tarifCalcule.adhesion, tarifCalcule.licenceFFD, formData.nombreVersements, preinscriptionEffective]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const inscriptionData = {
        adherent_precedent: formData.adherentPrecedent,
        student_last_name: formData.studentLastName,
        student_first_name: formData.studentFirstName,
        student_name: `${formData.studentLastName} ${formData.studentFirstName}`,
        student_gender: formData.studentGender,
        student_birth_date: formData.studentBirthDate,
        student_address: formData.studentAddress || null,
        student_postal_code: formData.studentPostalCode || null,
        student_city: formData.studentCity || null,
        student_phone: formData.studentPhone || null,
        student_email: formData.studentEmail || null,
        responsable1_name: formData.responsable1Name,
        responsable1_phone: formData.responsable1Phone,
        responsable1_email: formData.responsable1Email,
        responsable2_name: formData.responsable2Name || null,
        responsable2_address: formData.responsable2Address || null,
        responsable2_postal_code: formData.responsable2PostalCode || null,
        responsable2_city: formData.responsable2City || null,
        responsable2_phone: formData.responsable2Phone || null,
        responsable2_email: formData.responsable2Email || null,
        selected_courses: selectedCourses,
        tarif_reduit: formData.tarifReduit,
        danse_etudes_option: formData.danseEtudesOption,
        concours_on_stage: formData.concoursOnStage,
        concours_classes: formData.concoursClasses,
        participation_spectacle: formData.participationSpectacle,
        nombre_costumes: formData.nombreCostumes,
        droit_image: formData.droitImage,
        type_cours: formData.typeCours,
        mode_paiement: formData.modePaiement || null,
        nombre_versements: formData.nombreVersements,
        accept_rules: formData.acceptRules,
        signature_name: formData.signatureName,
        tarif_total: tarifCalcule.total,
        tarif_cours: tarifCalcule.totalCours,
        adhesion: tarifCalcule.adhesion,
        licence_ffd: tarifCalcule.licenceFFD,
      };

      const response = await fetch('/api/submit-inscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inscriptionData),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Erreur API:', result);
        throw new Error(result.error || 'Erreur lors de l\'enregistrement');
      }
      
      console.log('Inscription réussie!', result);
      
      // Incrémenter les quotas pour les cours sélectionnés
      try {
        await Promise.all(
          selectedCourses.map(coursId => incrementerQuota(coursId, 'en_ligne'))
        );
      } catch (quotaError) {
        console.error('Erreur incrémentation quotas:', quotaError);
      }
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Erreur complète:', error);
      alert('Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");

  useEffect(() => {
    const v = formData.studentBirthDate;
    if (!v || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return;
    const [year, month, day] = v.split("-");
    if (year !== birthYear) setBirthYear(year);
    if (month !== birthMonth) setBirthMonth(month);
    if (day !== birthDay) setBirthDay(day);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.studentBirthDate]);

  useEffect(() => {
    if (!birthYear || !birthMonth || !birthDay) {
      if (formData.studentBirthDate !== "") {
        setFormData((p) => ({ ...p, studentBirthDate: "" }));
      }
      return;
    }

    const yyyy = birthYear;
    const mm = birthMonth.padStart(2, "0");
    const dd = birthDay.padStart(2, "0");
    const next = `${yyyy}-${mm}-${dd}`;
    if (formData.studentBirthDate !== next) {
      setFormData((p) => ({ ...p, studentBirthDate: next }));
    }
  }, [birthDay, birthMonth, birthYear, formData.studentBirthDate]);

  const years = useMemo(() => {
    const current = new Date().getFullYear();
    const arr: string[] = [];
    for (let y = current; y >= 1900; y -= 1) arr.push(String(y));
    return arr;
  }, []);

  const days = useMemo(() => {
    const arr: string[] = [];
    for (let d = 1; d <= 31; d += 1) arr.push(String(d).padStart(2, "0"));
    return arr;
  }, []);

  const isMajeur = tarifCalcule.age >= 18;
  const canProceedStep1 = Boolean(
    formData.studentLastName && 
    formData.studentFirstName && 
    formData.studentBirthDate &&
    (!isMajeur || (formData.studentAddress && formData.studentPostalCode && formData.studentCity && formData.studentPhone && formData.studentEmail))
  );
  const canProceedStep2 = Boolean(
    formData.responsable1Name && 
    formData.responsable1Phone && 
    formData.responsable1Email &&
    formData.studentAddress &&
    formData.studentPostalCode &&
    formData.studentCity
  );
  const canProceedStep3 = selectedCourses.length > 0 || formData.danseEtudesOption !== "0";
  const canSubmit = Boolean(formData.acceptRules && formData.signatureName);

  const coursByJour = useMemo(() => {
    const grouped: Record<string, CoursPlanning[]> = {};
    ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"].forEach(jour => {
      grouped[jour] = planningCours.filter((c: CoursPlanning) => c.jour === jour);
    });
    return grouped;
  }, []);

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto border-0 shadow-lg">
            <CardContent className="pt-12 pb-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Pré-inscription enregistrée !</h1>
              <Card className="bg-amber-50 border-amber-200 mb-8">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-left">
                      <h4 className="font-semibold text-[#2D3436] mb-2">Montant à régler</h4>
                      <p className="text-2xl font-bold text-[#2D3436] mb-2">{tarifCalcule.total} €</p>
                      <p className="text-[#2D3436] text-sm">Rendez-vous au secrétariat pour finaliser.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Button onClick={() => window.location.href = "/"} className="bg-[#2D3436] hover:bg-[#3d4446]">Retour</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-[#2D3436] to-[#3d4446] text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Inscription 2025-2026</h1>
          <p className="text-xl text-gray-300">Le tarif sera calculé automatiquement selon vos choix.</p>
        </div>
      </section>

      <section className="bg-amber-50 border-b border-amber-200 py-4">
        <div className="container mx-auto px-4 flex items-center gap-3 text-[#2D3436]">
          <Info className="h-5 w-5" />
          <p className="text-sm"><strong>Important :</strong> Pré-inscription validée après paiement au secrétariat.</p>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <StepIndicator currentStep={step} isMajeur={isMajeur} />

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit}>
                  {step === 1 && (
                    <Card className="border-0 shadow-lg">
                      <CardHeader><CardTitle>Informations de l&apos;élève</CardTitle></CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center gap-4">
                          <Checkbox id="adherentPrecedent" checked={formData.adherentPrecedent} onCheckedChange={(c) => handleCheckboxChange("adherentPrecedent", c as boolean)} />
                          <Label htmlFor="adherentPrecedent">Adhérent STUDIO e saison 2024/2025</Label>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="studentLastName">Nom *</Label>
                            <Input id="studentLastName" name="studentLastName" value={formData.studentLastName} onChange={handleInputChange} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="studentFirstName">Prénom *</Label>
                            <Input id="studentFirstName" name="studentFirstName" value={formData.studentFirstName} onChange={handleInputChange} required />
                          </div>
                          <div className="space-y-2">
                            <Label>Sexe</Label>
                            <RadioGroup value={formData.studentGender} onValueChange={(v: string) => setFormData(p => ({ ...p, studentGender: v }))} className="flex gap-4">
                              <div className="flex items-center space-x-2"><RadioGroupItem value="F" id="f" /><Label htmlFor="f">F</Label></div>
                              <div className="flex items-center space-x-2"><RadioGroupItem value="M" id="m" /><Label htmlFor="m">M</Label></div>
                            </RadioGroup>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="studentBirthDate">Date de naissance *</Label>
                          <div className="grid grid-cols-3 gap-3">
                            <Select value={birthDay} onValueChange={(v: string) => setBirthDay(v)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Jour" />
                              </SelectTrigger>
                              <SelectContent>
                                {days.map((d) => (
                                  <SelectItem key={d} value={d}>{d}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select value={birthMonth} onValueChange={(v: string) => setBirthMonth(v)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Mois" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="01">Janvier</SelectItem>
                                <SelectItem value="02">Février</SelectItem>
                                <SelectItem value="03">Mars</SelectItem>
                                <SelectItem value="04">Avril</SelectItem>
                                <SelectItem value="05">Mai</SelectItem>
                                <SelectItem value="06">Juin</SelectItem>
                                <SelectItem value="07">Juillet</SelectItem>
                                <SelectItem value="08">Août</SelectItem>
                                <SelectItem value="09">Septembre</SelectItem>
                                <SelectItem value="10">Octobre</SelectItem>
                                <SelectItem value="11">Novembre</SelectItem>
                                <SelectItem value="12">Décembre</SelectItem>
                              </SelectContent>
                            </Select>

                            <Select value={birthYear} onValueChange={(v: string) => setBirthYear(v)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Année" />
                              </SelectTrigger>
                              <SelectContent>
                                {years.map((y) => (
                                  <SelectItem key={y} value={y}>{y}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {formData.studentBirthDate && <p className="text-sm text-gray-500">Âge : {tarifCalcule.age} ans</p>}
                        </div>
                        {isMajeur && (
                          <>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-1">
                              <p className="text-sm font-medium text-blue-900">ℹ️ Adhérent majeur détecté</p>
                              <p className="text-sm text-blue-700">Les champs suivants sont obligatoires pour les adhérents de 18 ans et plus.</p>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="studentAddress">
                                Adresse <span className="text-red-500">*</span>
                              </Label>
                              <Input 
                                id="studentAddress" 
                                name="studentAddress" 
                                value={formData.studentAddress} 
                                onChange={handleInputChange} 
                                placeholder="Adresse complète"
                                required
                              />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="studentPostalCode">
                                  Code Postal <span className="text-red-500">*</span>
                                </Label>
                                <Input 
                                  id="studentPostalCode" 
                                  name="studentPostalCode" 
                                  value={formData.studentPostalCode} 
                                  onChange={handleInputChange}
                                  placeholder="29200"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="studentCity">
                                  Ville <span className="text-red-500">*</span>
                                </Label>
                                <Input 
                                  id="studentCity" 
                                  name="studentCity" 
                                  value={formData.studentCity} 
                                  onChange={handleInputChange}
                                  placeholder="Brest"
                                  required
                                />
                              </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="studentPhone">
                                  Téléphone <span className="text-red-500">*</span>
                                </Label>
                                <Input 
                                  id="studentPhone" 
                                  name="studentPhone" 
                                  type="tel" 
                                  value={formData.studentPhone} 
                                  onChange={handleInputChange} 
                                  placeholder="06 12 34 56 78"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="studentEmail">
                                  Courriel <span className="text-red-500">*</span>
                                </Label>
                                <Input 
                                  id="studentEmail" 
                                  name="studentEmail" 
                                  type="email" 
                                  value={formData.studentEmail} 
                                  onChange={handleInputChange} 
                                  placeholder="email@exemple.fr"
                                  required
                                />
                              </div>
                            </div>
                          </>
                        )}
                        <div className="flex justify-end pt-4">
                          <Button 
                            type="button" 
                            onClick={() => {
                              if (canProceedStep1) {
                                // Si majeur, sauter l'étape 2 (responsables) et aller directement à l'étape 3 (cours)
                                setStep(isMajeur ? 3 : 2);
                              }
                            }} 
                            disabled={!canProceedStep1} 
                            className="bg-[#2D3436] hover:bg-[#3d4446] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Continuer
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {step === 2 && !isMajeur && (
                    <Card className="border-0 shadow-lg">
                      <CardHeader><CardTitle>Responsables légaux (pour les adhérents mineurs uniquement)</CardTitle></CardHeader>
                      <CardContent className="space-y-8">
                        <div className="space-y-4">
                          <h3 className="font-semibold border-b pb-2">Responsable légal 1 *</h3>
                          <div className="space-y-2"><Label>Nom & Prénom *</Label><Input name="responsable1Name" value={formData.responsable1Name} onChange={handleInputChange} required /></div>
                          <div className="space-y-2"><Label>Adresse *</Label><Input name="studentAddress" value={formData.studentAddress} onChange={handleInputChange} placeholder="Adresse complète" required /></div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Code Postal *</Label><Input name="studentPostalCode" value={formData.studentPostalCode} onChange={handleInputChange} placeholder="29200" required /></div>
                            <div className="space-y-2"><Label>Ville *</Label><Input name="studentCity" value={formData.studentCity} onChange={handleInputChange} placeholder="Brest" required /></div>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Téléphone *</Label><Input name="responsable1Phone" type="tel" value={formData.responsable1Phone} onChange={handleInputChange} required /></div>
                            <div className="space-y-2"><Label>Courriel *</Label><Input name="responsable1Email" type="email" value={formData.responsable1Email} onChange={handleInputChange} required /></div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h3 className="font-semibold border-b pb-2">Responsable légal 2 (optionnel)</h3>
                          <div className="space-y-2"><Label>Nom & Prénom</Label><Input name="responsable2Name" value={formData.responsable2Name} onChange={handleInputChange} /></div>
                          <div className="space-y-2"><Label>Adresse</Label><Input name="responsable2Address" value={formData.responsable2Address} onChange={handleInputChange} placeholder="Adresse complète" /></div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Code Postal</Label><Input name="responsable2PostalCode" value={formData.responsable2PostalCode} onChange={handleInputChange} placeholder="29200" /></div>
                            <div className="space-y-2"><Label>Ville</Label><Input name="responsable2City" value={formData.responsable2City} onChange={handleInputChange} placeholder="Brest" /></div>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Téléphone</Label><Input name="responsable2Phone" type="tel" value={formData.responsable2Phone} onChange={handleInputChange} /></div>
                            <div className="space-y-2"><Label>Courriel</Label><Input name="responsable2Email" type="email" value={formData.responsable2Email} onChange={handleInputChange} /></div>
                          </div>
                        </div>
                        <div className="flex justify-between pt-4">
                          <Button type="button" variant="outline" onClick={() => setStep(1)}>Retour</Button>
                          <Button type="button" onClick={() => setStep(3)} disabled={!canProceedStep2} className="bg-[#2D3436] hover:bg-[#3d4446]">Continuer</Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {step === 3 && (
                    <Card className="border-0 shadow-lg">
                      <CardHeader><CardTitle>Choix des cours</CardTitle></CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                          <Checkbox id="tarifReduit" checked={formData.tarifReduit} onCheckedChange={(c) => handleCheckboxChange("tarifReduit", c as boolean)} />
                          <div>
                            <Label htmlFor="tarifReduit" className="font-semibold">Tarif réduit</Label>
                            <p className="text-sm text-gray-600">Si un autre membre de la famille est déjà inscrit au tarif plein</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 p-3 bg-gray-100 rounded-lg">
                          <span className="text-sm font-medium mr-2">Professeurs :</span>
                          {Object.entries(professeursColors).map(([prof, color]) => (
                            <span key={prof} className={"px-2 py-1 rounded text-xs border " + color}>{prof}</span>
                          ))}
                        </div>

                        <div className="space-y-4">
                          {Object.entries(coursByJour).map(([jour, cours]) => (
                            <div key={jour} className="border rounded-lg overflow-hidden">
                              <div className="bg-[#2D3436] text-white px-4 py-2 font-semibold">{jour}</div>
                              <div className="p-2 grid gap-2">
                                {(() => {
                                  // La date de naissance est obligatoire pour accéder à cette étape
                                  const recommandes = getCoursRecommandes(formData.studentBirthDate);
                                  
                                  return cours.map((c: CoursPlanning) => {
                                    const isSelected = selectedCourses.includes(c.id);
                                    const colorClass = professeursColors[c.professeur] || "bg-gray-100";
                                    const isSpecial = c.isDanseEtudes || c.isConcours;
                                    const quota = quotas[c.id];
                                    const isComplet = quota && !quota.disponible && !isSpecial;
                                    const placesRestantes = quota?.places_restantes || 0;
                                    const isRecommande = recommandes.includes(c.id);
                                    const isHorsNiveau = !isRecommande && !isSpecial;
                                    const isSelectable = !isSpecial && !isComplet && !isHorsNiveau;
                                    
                                    let className = "p-3 rounded-lg border-2 transition-all ";
                                    if (isSpecial) {
                                      className += "opacity-50 cursor-not-allowed bg-gray-100";
                                    } else if (isComplet && isHorsNiveau) {
                                      className += "bg-gray-100 border-gray-300 opacity-40";
                                    } else if (isHorsNiveau) {
                                      className += "opacity-40 cursor-not-allowed bg-gray-100 border-gray-200";
                                    } else if (isComplet) {
                                      className += "bg-gray-100 border-gray-300 " + colorClass;
                                    } else if (isSelected) {
                                      className += "cursor-pointer border-[#F9CA24] ring-2 ring-[#F9CA24] " + colorClass;
                                    } else {
                                      className += "cursor-pointer hover:border-gray-400 " + colorClass;
                                    }
                                    
                                    return (
                                      <div key={c.id} className={className}>
                                        <div 
                                          onClick={() => isSelectable && toggleCourse(c.id)} 
                                          className={isSelectable ? "cursor-pointer" : ""}
                                        >
                                          <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                              <p className="font-semibold">{c.nom}</p>
                                              <p className="text-sm">{c.horaire} ({c.duree} min)</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              {isSelectable && quota && placesRestantes <= 5 && placesRestantes > 0 && (
                                                <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800 border-amber-300">
                                                  <Users className="h-3 w-3 mr-1" />
                                                  {placesRestantes} places
                                                </Badge>
                                              )}
                                              {isComplet && (
                                                <Badge variant="destructive" className="text-xs">Complet en ligne</Badge>
                                              )}
                                              {isSelectable && (
                                                <div onClick={(e) => e.stopPropagation()}>
                                                  <Checkbox checked={isSelected} onCheckedChange={() => toggleCourse(c.id)} className="mt-1" />
                                                </div>
                                              )}
                                              {isSpecial && <span className="text-xs bg-gray-200 px-2 py-1 rounded">Voir options</span>}
                                            </div>
                                          </div>
                                        </div>
                                        
                                        {isComplet && !isHorsNiveau && (
                                          <div className="mt-3 pt-3 border-t border-gray-200">
                                            <p className="text-sm text-gray-600 mb-2">
                                              Des places peuvent être disponibles sur place.
                                            </p>
                                            <Button
                                              type="button"
                                              size="sm"
                                              variant="outline"
                                              onClick={() => setCoursListeAttente(c)}
                                              className="w-full text-xs"
                                            >
                                              S&apos;inscrire sur la liste d&apos;attente
                                            </Button>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  });
                                })()}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-4 border-t pt-6">
                          <h3 className="font-semibold text-lg">Options spéciales</h3>
                          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <Label className="font-semibold mb-3 block">Danse Études Jazz</Label>
                            <RadioGroup value={formData.danseEtudesOption} onValueChange={(v: string) => setFormData(p => ({ ...p, danseEtudesOption: v }))} className="space-y-2">
                              <div className="flex items-center space-x-2"><RadioGroupItem value="0" id="de0" /><Label htmlFor="de0">Non concerné</Label></div>
                              <div className="flex items-center space-x-2"><RadioGroupItem value="1" id="de1" /><Label htmlFor="de1">1 cours - 350 €</Label></div>
                              <div className="flex items-center space-x-2"><RadioGroupItem value="2" id="de2" /><Label htmlFor="de2">2 cours - 700 €</Label></div>
                            </RadioGroup>
                          </div>
                          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                            <Label className="font-semibold mb-3 block">Concours</Label>
                            <p className="text-xs text-orange-700 mb-3">Sélection à titre informatif uniquement. Les frais de concours seront traités séparément par le secrétariat.</p>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3"><Checkbox id="onStage" checked={formData.concoursOnStage} onCheckedChange={(c) => handleCheckboxChange("concoursOnStage", c as boolean)} /><Label htmlFor="onStage">On Stage</Label></div>
                              <div className="flex items-center gap-3"><Checkbox id="classes" checked={formData.concoursClasses} onCheckedChange={(c) => handleCheckboxChange("concoursClasses", c as boolean)} /><Label htmlFor="classes">Classes Concours</Label></div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between pt-4">
                          <Button type="button" variant="outline" onClick={() => setStep(isMajeur ? 1 : 2)}>Retour</Button>
                          <Button type="button" onClick={() => setStep(4)} disabled={!canProceedStep3} className="bg-[#2D3436] hover:bg-[#3d4446]">Continuer</Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {step === 4 && (
                    <Card className="border-0 shadow-lg">
                      <CardHeader><CardTitle>Options et autorisations</CardTitle></CardHeader>
                      <CardContent className="space-y-8">
                        <div className="space-y-4">
                          <h3 className="font-semibold border-b pb-2">Participation au spectacle</h3>
                          <RadioGroup value={formData.participationSpectacle} onValueChange={(v: string) => setFormData(p => ({ ...p, participationSpectacle: v }))} className="flex gap-6">
                            <div className="flex items-center space-x-2"><RadioGroupItem value="oui" id="sp-oui" /><Label htmlFor="sp-oui">OUI</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="non" id="sp-non" /><Label htmlFor="sp-non">NON</Label></div>
                          </RadioGroup>
                          {formData.participationSpectacle === "oui" && (
                            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                              <p className="text-sm text-gray-600">Tarifs costumes : 1=20€/15€, 2=35€/25€, 3=50€/35€, 4=65€/45€ (Adulte/Enfant)</p>
                              <div className="space-y-2">
                                <Label>Nombre de costumes</Label>
                                <Select value={formData.nombreCostumes} onValueChange={(v: string) => setFormData(p => ({ ...p, nombreCostumes: v }))}>
                                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">1</SelectItem>
                                    <SelectItem value="2">2</SelectItem>
                                    <SelectItem value="3">3</SelectItem>
                                    <SelectItem value="4">4</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-semibold border-b pb-2">Droit à l&apos;image</h3>
                          <RadioGroup value={formData.droitImage} onValueChange={(v: string) => setFormData(p => ({ ...p, droitImage: v }))} className="space-y-3">
                            <div className="flex items-start space-x-2"><RadioGroupItem value="autorise" id="img-a" className="mt-1" /><Label htmlFor="img-a" className="text-sm"><strong>Autorise</strong> la diffusion sur tous supports officiels.</Label></div>
                            <div className="flex items-start space-x-2"><RadioGroupItem value="refus-partiel" id="img-p" className="mt-1" /><Label htmlFor="img-p" className="text-sm"><strong>Refus partiel</strong> : usage interne uniquement.</Label></div>
                            <div className="flex items-start space-x-2"><RadioGroupItem value="refus-total" id="img-t" className="mt-1" /><Label htmlFor="img-t" className="text-sm"><strong>Refus total</strong> : aucune photo/vidéo.</Label></div>
                          </RadioGroup>
                          <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded mt-3">
                            <p className="text-sm text-gray-700">
                              <strong>⚠️ Important :</strong> Les personnes n&apos;accordant aucun droit à l&apos;image (refus total) ne pourront pas participer au spectacle de fin d&apos;année en raison de la captation vidéo.
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-semibold border-b pb-2">Certificat médical</h3>
                          {requiresCertificat && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
                              <p className="text-sm text-red-800">
                                <strong>Obligatoire :</strong> Vous avez sélectionné {formData.concoursOnStage || formData.concoursClasses ? 'un concours' : 'Danse Études'}. Un certificat médical de moins de 6 mois est requis.
                              </p>
                            </div>
                          )}
                          <RadioGroup value={formData.typeCours} onValueChange={(v: string) => { if (!requiresCertificat) setFormData(p => ({ ...p, typeCours: v })); }} className="space-y-3">
                            <div className={`flex items-start space-x-2 ${requiresCertificat ? 'opacity-40 cursor-not-allowed' : ''}`}><RadioGroupItem value="loisirs" id="cm-l" className="mt-1" disabled={requiresCertificat} /><Label htmlFor="cm-l" className="text-sm"><strong>Loisirs</strong> : aucun certificat nécessaire.</Label></div>
                            <div className="flex items-start space-x-2"><RadioGroupItem value="danse-etudes" id="cm-de" className="mt-1" /><Label htmlFor="cm-de" className="text-sm"><strong>Danse Études / Concours</strong> : certificat de moins de 6 mois requis.</Label></div>
                          </RadioGroup>
                        </div>

                        {preinscriptionEffective && (
                          <div className="space-y-4">
                            <h3 className="font-semibold border-b pb-2">Préinscription</h3>
                            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                              <p className="text-sm text-green-800 font-medium mb-1">
                                📋 Période de préinscription en cours
                                {preinscriptionAnciensActive && !preinscriptionTousActive && " (réservée aux anciens adhérents)"}
                                {preinscriptionTousActive && " (ouverte à tous)"}
                              </p>
                              <p className="text-sm text-green-700">
                                Un acompte de <strong>{montantPreinscription} €</strong> est demandé sous 5 jours pour valider votre inscription.
                              </p>
                              <p className="text-xs text-green-600 mt-1">
                                Composition : Adhésion {tarifCalcule.adhesion}€ + Licence FFD {tarifCalcule.licenceFFD}€ + Acompte cours {montantPreinscription - tarifCalcule.adhesion - tarifCalcule.licenceFFD}€
                              </p>
                              <p className="text-xs text-green-600 mt-1">
                                Ce montant sera déduit de votre total lors du calcul de l&apos;échéancier.
                              </p>
                            </div>
                          </div>
                        )}

                        {prorataActif && (
                          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                            <p className="text-sm text-blue-800">
                              <strong>📊 Tarif prorata appliqué</strong> — Période : {periodesLabels[periodeActuelle]}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                              Le tarif cours est calculé au prorata de la période d&apos;entrée dans la saison.
                              {tarifCalcule.tarifCoursAnnuel > 0 && (
                                <> Tarif annuel : {fmt(tarifCalcule.tarifCoursAnnuel)} € → Tarif prorata : {fmt(tarifCalcule.tarifCours)} €</>
                              )}
                            </p>
                          </div>
                        )}

                        <div className="space-y-4">
                          <h3 className="font-semibold border-b pb-2">Mode de paiement (plusieurs choix possibles)</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {["Chèque", "CB", "ANCV", "Virement", "Espèces"].map((m) => (
                              <div 
                                key={m} 
                                onClick={() => {
                                  setFormData(p => ({
                                    ...p,
                                    modePaiement: p.modePaiement.includes(m)
                                      ? p.modePaiement.filter(mode => mode !== m)
                                      : [...p.modePaiement, m]
                                  }));
                                }}
                                className={formData.modePaiement.includes(m) ? "p-3 border-2 rounded-lg text-center cursor-pointer border-[#F9CA24] bg-amber-50" : "p-3 border-2 rounded-lg text-center cursor-pointer border-gray-200 hover:border-gray-300"}
                              >{m}</div>
                            ))}
                          </div>

                          <div className="space-y-3">
                            <Label>Nombre de versements</Label>
                            <div className="grid grid-cols-3 gap-3">
                              {versementsDisponibles.map(n => (
                                <div
                                  key={n}
                                  onClick={() => setFormData(p => ({ ...p, nombreVersements: n }))}
                                  className={formData.nombreVersements === n
                                    ? "p-3 border-2 rounded-lg text-center cursor-pointer border-[#F9CA24] bg-amber-50 font-semibold"
                                    : "p-3 border-2 rounded-lg text-center cursor-pointer border-gray-200 hover:border-gray-300"
                                  }
                                >
                                  {n === "1" ? "1 fois" : `${n} fois`}
                                </div>
                              ))}
                            </div>
                            {versementsDisponibles.length === 1 && (
                              <p className="text-xs text-gray-500">Le paiement échelonné en 3 fois est disponible à partir de 270,00 € de cours, en 10 fois à partir de 500,00 €.</p>
                            )}
                            {versementsDisponibles.length === 2 && (
                              <p className="text-xs text-gray-500">Le paiement en 10 fois est disponible à partir de 500,00 € de tarif cours.</p>
                            )}
                            {!formData.modePaiement.includes("Chèque") && parseInt(formData.nombreVersements) > 1 && (
                              <p className="text-xs text-amber-700 font-medium">Le paiement échelonné n&apos;est disponible que par chèque.</p>
                            )}
                          </div>
                        </div>

                        {echeances.length > 0 && tarifCalcule.total > 0 && (
                          <div className="space-y-4">
                            <h3 className="font-semibold border-b pb-2">Échéancier de paiement</h3>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                              {echeances.map((e, i) => (
                                <div key={i} className={`flex justify-between items-center py-2 border-b border-gray-200 last:border-0 ${e.mois.includes('Préinscription') ? 'bg-green-50 -mx-2 px-2 rounded' : ''}`}>
                                  <div className="flex-1">
                                    <span className={`text-sm font-medium ${e.mois.includes('Préinscription') ? 'text-green-800' : ''}`}>{e.mois}</span>
                                    {e.details && <p className="text-xs text-gray-500">{e.details}</p>}
                                  </div>
                                  <span className={`font-semibold text-sm ml-4 ${e.mois.includes('Préinscription') ? 'text-green-800' : ''}`}>{fmt(e.montant)} €</span>
                                </div>
                              ))}
                              <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300">
                                <span className="font-bold">Total</span>
                                <span className="font-bold text-lg">{fmt(tarifCalcule.total)} €</span>
                              </div>
                            </div>
                            {parseInt(formData.nombreVersements) > 1 && (
                              <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
                                <p className="text-xs text-red-800 font-medium">
                                  En choisissant un paiement échelonné, vous vous engagez à honorer l&apos;intégralité de l&apos;échéancier pour l&apos;année scolaire. Aucun remboursement ne sera effectué en cas d&apos;abandon en cours d&apos;année, sauf en cas de mutation ou pour raisons de santé sur présentation d&apos;un certificat médical, conformément au règlement intérieur de l&apos;école.
                                </p>
                              </div>
                            )}
                            <div className="pt-2">
                              <p className="text-xs text-gray-500 mb-2">Conservez ce document pour votre suivi personnel.</p>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => {
                                  genererPDFEcheancier({
                                    nomEleve: `${formData.studentLastName} ${formData.studentFirstName}`,
                                    modePaiement: formData.modePaiement,
                                    nombreVersements: formData.nombreVersements,
                                    echeances: echeances,
                                    totalGeneral: tarifCalcule.total,
                                  });
                                }}
                              >
                                Télécharger l&apos;échéancier PDF
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between pt-4">
                          <Button type="button" variant="outline" onClick={() => setStep(3)}>Retour</Button>
                          <Button type="button" onClick={() => setStep(5)} className="bg-[#2D3436] hover:bg-[#3d4446]">Continuer</Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {step === 5 && (
                    <Card className="border-0 shadow-lg">
                      <CardHeader><CardTitle>Validation et signature</CardTitle></CardHeader>
                      <CardContent className="space-y-6">
                        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                          <h4 className="font-semibold">Récapitulatif</h4>
                          <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            <div><p className="text-gray-500">Élève</p><p className="font-medium">{formData.studentLastName} {formData.studentFirstName}</p></div>
                            <div><p className="text-gray-500">Âge</p><p className="font-medium">{tarifCalcule.age} ans</p></div>
                            <div><p className="text-gray-500">Responsable</p><p className="font-medium">{formData.responsable1Name}</p></div>
                            <div><p className="text-gray-500">Contact</p><p className="font-medium">{formData.responsable1Email}</p></div>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-2">Cours ({tarifCalcule.totalMinutes} min/sem)</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedCourses.map((id) => {
                                const c = planningCours.find((x: CoursPlanning) => x.id === id);
                                return c ? <span key={id} className="bg-[#2D3436] text-white px-3 py-1 rounded-full text-sm">{c.nom} ({c.jour})</span> : null;
                              })}
                            </div>
                          </div>
                          {echeances.length > 0 && (
                            <div>
                              <p className="text-gray-500 mb-2">Échéancier ({formData.nombreVersements} versement{parseInt(formData.nombreVersements) > 1 ? 's' : ''})</p>
                              <div className="space-y-1">
                                {echeances.map((e, i) => (
                                  <div key={i} className="flex justify-between text-sm">
                                    <span>{e.mois}</span>
                                    <span className="font-medium">{fmt(e.montant)} €</span>
                                  </div>
                                ))}
                                <div className="flex justify-between text-sm font-bold border-t pt-1 mt-1">
                                  <span>Total</span>
                                  <span>{fmt(tarifCalcule.total)} €</span>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-4 mt-2">
                            <p className="text-sm text-amber-900 font-semibold mb-1">Téléchargement obligatoire</p>
                            <p className="text-xs text-amber-800 mb-3">
                              Ce récapitulatif PDF est à présenter au secrétariat de STUDIO e lors du règlement. Veuillez le télécharger et l&apos;imprimer ou le conserver sur votre téléphone.
                            </p>
                            <Button
                              type="button"
                              size="sm"
                              className="w-full bg-[#F9CA24] text-[#2D3436] hover:bg-amber-400 font-semibold"
                              onClick={() => {
                                const coursSelectionnesNoms = selectedCourses.map(id => {
                                  const c = planningCours.find((x: CoursPlanning) => x.id === id);
                                  return c ? `${c.nom} (${c.jour} ${c.horaire})` : id;
                                });
                                genererPDFRecapitulatif({
                                  nomEleve: `${formData.studentLastName} ${formData.studentFirstName}`,
                                  sexe: formData.studentGender,
                                  dateNaissance: formData.studentBirthDate,
                                  age: tarifCalcule.age,
                                  adresse: formData.studentAddress,
                                  codePostal: formData.studentPostalCode,
                                  ville: formData.studentCity,
                                  telephone: formData.studentPhone,
                                  email: formData.studentEmail,
                                  adherentPrecedent: formData.adherentPrecedent,
                                  responsable1Nom: formData.responsable1Name,
                                  responsable1Tel: formData.responsable1Phone,
                                  responsable1Email: formData.responsable1Email,
                                  responsable2Nom: formData.responsable2Name || undefined,
                                  responsable2Tel: formData.responsable2Phone || undefined,
                                  responsable2Email: formData.responsable2Email || undefined,
                                  coursSelectionnes: coursSelectionnesNoms,
                                  tarifCours: tarifCalcule.tarifCours,
                                  tarifDanseEtudes: tarifCalcule.tarifDanseEtudes,
                                  adhesion: tarifCalcule.adhesion,
                                  licenceFFD: tarifCalcule.licenceFFD,
                                  totalGeneral: tarifCalcule.total,
                                  tarifReduit: formData.tarifReduit,
                                  danseEtudes: formData.danseEtudesOption,
                                  participationSpectacle: formData.participationSpectacle,
                                  nombreCostumes: formData.nombreCostumes,
                                  droitImage: formData.droitImage,
                                  modePaiement: formData.modePaiement,
                                  nombreVersements: formData.nombreVersements,
                                  echeances: echeances,
                                  avecPreinscription: preinscriptionEffective,
                                  montantPreinscription: montantPreinscription,
                                  nomSignature: formData.signatureName,
                                  dateInscription: new Date().toLocaleDateString('fr-FR'),
                                });
                                setPdfTelecharge(true);
                              }}
                            >
                              {pdfTelecharge ? '✓ Récapitulatif PDF téléchargé' : 'Télécharger le récapitulatif PDF'}
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Checkbox id="acceptRules" checked={formData.acceptRules} onCheckedChange={(c) => handleCheckboxChange("acceptRules", c as boolean)} />
                          <Label htmlFor="acceptRules" className="text-sm cursor-pointer"><strong>Règlement Intérieur</strong> – J&apos;atteste avoir pris connaissance du règlement intérieur et m&apos;engage à le respecter. *</Label>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2"><Label>Je soussigné(e) *</Label><Input name="signatureName" value={formData.signatureName} onChange={handleInputChange} required /></div>
                          <div className="space-y-2"><Label>Date</Label><Input value={new Date().toLocaleDateString("fr-FR")} disabled className="bg-gray-100" /></div>
                        </div>

                        <div className="flex justify-between pt-4">
                          <Button type="button" variant="outline" onClick={() => setStep(4)}>Retour</Button>
                          <div className="text-right">
                            {!pdfTelecharge && (
                              <p className="text-xs text-red-600 mb-1">Veuillez d&apos;abord télécharger le récapitulatif PDF ci-dessus.</p>
                            )}
                            <Button type="submit" disabled={!canSubmit || isSubmitting || !pdfTelecharge} className="bg-[#F9CA24] text-[#2D3436] hover:bg-amber-400">
                              {isSubmitting ? "Envoi..." : "Valider mon inscription"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </form>
              </div>

              <div className="lg:col-span-1">
                <Card className="border-0 shadow-lg sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
                  <CardHeader className="bg-[#2D3436] text-white rounded-t-lg py-4">
                    <CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5" />Estimation tarif</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex justify-between text-sm"><span>Durée/semaine</span><span className="font-medium">{tarifCalcule.totalMinutes} min</span></div>
                    {tarifCalcule.tarifCours > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Cours {formData.tarifReduit ? "(réduit)" : "(plein)"}{prorataActif ? " prorata" : ""}</span>
                        <span className="font-medium">{fmt(tarifCalcule.tarifCours)} €</span>
                      </div>
                    )}
                    {prorataActif && tarifCalcule.tarifCoursAnnuel > 0 && tarifCalcule.tarifCoursAnnuel !== tarifCalcule.tarifCours && (
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Tarif annuel</span>
                        <span className="line-through">{fmt(tarifCalcule.tarifCoursAnnuel)} €</span>
                      </div>
                    )}
                    {tarifCalcule.tarifDanseEtudes > 0 && <div className="flex justify-between text-sm"><span>Danse Études</span><span className="font-medium">{fmt(tarifCalcule.tarifDanseEtudes)} €</span></div>}
                    {(formData.concoursOnStage || formData.concoursClasses) && <div className="flex justify-between text-xs text-orange-600"><span>Concours (informatif)</span><span className="font-medium">traité séparément</span></div>}
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-sm"><span>Sous-total cours</span><span className="font-medium">{fmt(tarifCalcule.totalCours)} €</span></div>
                    </div>
                    <div className="flex justify-between text-sm"><span>Adhésion</span><span className="font-medium">{fmt(tarifCalcule.adhesion)} €</span></div>
                    <div className="flex justify-between text-sm"><span>Licence FFD</span><span className="font-medium">{fmt(tarifCalcule.licenceFFD)} €</span></div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold"><span>TOTAL</span><span className="text-[#F9CA24]">{fmt(tarifCalcule.total)} €</span></div>
                    </div>
                    {preinscriptionEffective && tarifCalcule.total > 0 && (
                      <div className="bg-green-50 rounded p-2 mt-2">
                        <p className="text-xs font-semibold text-green-700">Préinscription : {fmt(montantPreinscription)} €</p>
                      </div>
                    )}
                    {echeances.length > 1 && (
                      <div className="border-t pt-3 mt-3">
                        <p className="text-xs font-semibold text-gray-600 mb-2">Échéancier ({formData.nombreVersements === "1" ? "1 versement" : `${formData.nombreVersements} versements`})</p>
                        {echeances.map((e, i) => (
                          <div key={i} className={`flex justify-between text-xs ${e.mois.includes('Préinscription') ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                            <span>{e.mois}</span>
                            <span className="font-medium">{fmt(e.montant)} €</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-4">* Estimation indicative. Le montant définitif sera confirmé au secrétariat.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Modal de liste d'attente */}
      <ListeAttenteModal 
        cours={coursListeAttente}
        open={!!coursListeAttente}
        onClose={() => setCoursListeAttente(null)}
      />
    </div>
  );
}
