import { getPlans, getServices, getStructure, getTeam, getTestimonials } from "@/lib/content";
import { homeSections } from "@/config/site";
import { StackSection } from "@/components/layout/StackSection";
import { Hero } from "@/components/sections/Hero";
import { Ticker } from "@/components/sections/Ticker";
import { Manifesto } from "@/components/sections/Manifesto";
import { Services } from "@/components/sections/Services";
import { Club } from "@/components/sections/Club";
import { Structure } from "@/components/sections/Structure";
import { Team } from "@/components/sections/Team";
import { Testimonials } from "@/components/sections/Testimonials";
import { BookingBand } from "@/components/sections/BookingBand";
import { Location } from "@/components/sections/Location";

export default async function Home() {
  const [services, plans, structure, team, testimonials] = await Promise.all([
    getServices(),
    getPlans(),
    getStructure(),
    getTeam(),
    getTestimonials(),
  ]);

  // Cada bloco desliza por cima do anterior, como na referência
  const sections = [
    <Hero key="hero" />,
    <div key="manifesto">
      <Ticker />
      <Manifesto />
    </div>,
    <Services key="servicos" services={services} />,
    homeSections.club && <Club key="clube" plans={plans} />,
    homeSections.structure && <Structure key="estrutura" items={structure} />,
    homeSections.team && <Team key="time" team={team} />,
    homeSections.testimonials && <Testimonials key="depoimentos" items={testimonials} />,
    <BookingBand key="agendamento" />,
    <Location key="contato" />,
  ].filter(Boolean);

  return (
    <>
      {sections.map((s, i) => (
        <StackSection key={i} z={i + 1}>
          {s}
        </StackSection>
      ))}
    </>
  );
}
