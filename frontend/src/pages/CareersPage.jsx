import Seo from "../lib/seo";

export default function CareersPage() {
  return (
    <>
      <Seo title="Careers" description="Join Artham Aesthetique — dermatologists, technicians and hospitality-minded team members." />
      <section className="bg-summer-peach pt-40 pb-16 lg:pt-48 lg:pb-24">
        <div className="container-editorial max-w-3xl">
          <p className="overline text-coronation-gold mb-4">Careers</p>
          <h1 className="font-display text-5xl md:text-6xl text-armadillo leading-[1.05] mb-6">Come build a quieter clinic.</h1>
          <p className="fine text-lg text-armadillo/80">We hire slowly, and we hire for warmth. If our approach resonates, we would love to hear from you.</p>
        </div>
      </section>
      <section className="bg-arabian-white py-24">
        <div className="container-editorial max-w-3xl">
          <div className="space-y-6 fine text-armadillo/85 leading-[1.9]">
            <p>Current openings — Dermatology Consultant, Laser Technician (Female), Front-of-House Host.</p>
            <p>Send your CV and a short note about the work you would like to do to <a href="mailto:careers@arthamaesthetique.com" className="link-gold">careers@arthamaesthetique.com</a>.</p>
          </div>
        </div>
      </section>
    </>
  );
}
