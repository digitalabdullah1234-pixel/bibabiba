import './_group.css';
import { ArrowDownRight, ArrowUpRight, Clock3, Phone } from 'lucide-react';

export function EditorialSplit() {
  return (
    <main className="min-h-[100dvh] overflow-hidden bg-[#f2e8d8] text-[#3d211b]">
      <section aria-labelledby="bianco-title" className="relative mx-auto flex min-h-[780px] max-w-[1600px] flex-col px-5 py-5 sm:px-8 md:px-12 md:py-7">
        <header className="relative z-10 flex items-center justify-between border-b border-[#55291f]/20 pb-4">
          <a href="#top" aria-label="Bianco home" className="font-['Bodoni_Moda'] text-[1.65rem] font-semibold italic tracking-[-.08em] text-[#53231d]">
            bianco<span className="ml-1 not-italic text-[#b86c45]">.</span>
          </a>
          <span className="hidden font-['Cormorant_Garamond'] text-sm italic tracking-wide text-[#75564a] sm:block">Cucina italiana · Madinah</span>
          <a href="#order" className="inline-flex min-h-10 items-center gap-2 border-b border-[#9e5638] px-1 text-[10px] font-semibold uppercase tracking-[.18em] text-[#642d23] transition-colors hover:text-[#ad6544] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ad6544]">
            The menu <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </header>

        <div id="top" className="grid flex-1 grid-cols-1 items-stretch md:grid-cols-[.88fr_1.12fr]">
          <div className="relative z-10 flex flex-col justify-center pb-8 pt-12 md:py-16 md:pr-8 lg:pr-16">
            <p className="mb-7 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.24em] text-[#a45c3d]">
              <span className="h-px w-9 bg-[#bd7651]" />
              An Italian table in Madinah
            </p>
            <h1 id="bianco-title" className="max-w-[700px] font-['Bodoni_Moda'] text-[clamp(4.15rem,9vw,8.75rem)] font-semibold leading-[.79] tracking-[-.075em] text-[#48231d]">
              Buonasera,
              <span className="mt-3 block font-normal italic text-[#a95738]">Madinah.</span>
            </h1>
            <p className="mt-8 max-w-[27rem] font-['Cormorant_Garamond'] text-[1.45rem] leading-[1.3] text-[#654b40] sm:text-[1.65rem]">
              Italian food and long dinners, on the terrace or in the dining room.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="tel:+966559949069" className="group inline-flex min-h-14 items-center justify-center gap-3 bg-[#54261f] px-6 text-[10px] font-semibold uppercase tracking-[.18em] text-[#fff8ec] transition-colors hover:bg-[#713a2d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#a95738]">
                <Phone size={15} aria-hidden="true" />
                Reserve by phone
                <span className="sr-only">, +966 55 994 9069</span>
              </a>
              <a href="#order" className="inline-flex min-h-14 items-center justify-center gap-2 border border-[#7a5444]/35 px-6 text-[10px] font-semibold uppercase tracking-[.18em] text-[#54261f] transition-colors hover:border-[#a95738] hover:text-[#a95738] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#a95738]">
                Explore the menu <ArrowDownRight size={15} aria-hidden="true" />
              </a>
            </div>
            <p className="mt-4 text-[11px] tracking-[.04em] text-[#80675a]">+966 55 994 9069</p>

            <div className="mt-12 flex items-center gap-3 border-t border-[#55291f]/20 pt-4 text-[10px] uppercase tracking-[.16em] text-[#76574b]">
              <Clock3 size={14} strokeWidth={1.5} aria-hidden="true" />
              <span>Open daily</span>
              <span className="mx-1 h-px w-6 bg-[#bb876a]" />
              <span>12 PM – 2 AM</span>
            </div>
          </div>

          <figure className="relative isolate min-h-[390px] overflow-hidden bg-[#7c4738] md:-mr-12 md:my-7 md:min-h-[620px] lg:-mr-16">
            <img
              src="/__mockup/images/bianco-hero-redesign/bianco-listing-1.jpg"
              alt="Bianco's glass-fronted restaurant and outdoor terrace in Madinah"
              className="absolute inset-0 h-full w-full object-cover object-[55%_center]"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#27100e]/55 via-transparent to-[#27100e]/5" />
            <figcaption className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 border-t border-white/45 pt-3 text-[9px] font-medium uppercase tracking-[.18em] text-white sm:bottom-7 sm:left-7 sm:right-7">
              <span>Bianco terrace</span>
              <span className="text-right">Madinah</span>
            </figcaption>
            <span aria-hidden="true" className="absolute right-5 top-5 hidden border border-white/70 px-3 py-2 font-['Cormorant_Garamond'] text-sm italic text-white sm:block">
              Italian food · long dinners
            </span>
          </figure>
        </div>
      </section>
    </main>
  );
}
