import './_group.css';
import { ArrowUpRight, ChevronRight } from 'lucide-react';

export function Current() {
  return (
    <section className="bianco-hero-preview relative isolate flex min-h-[780px] overflow-hidden bg-[#3c100d] text-[#fff7ed]">
      <img
        src="/__mockup/images/bianco-hero-redesign/bianco-listing-1.jpg"
        alt="Bianco restaurant exterior and terrace"
        className="bianco-current-photo absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="bianco-current-overlay absolute inset-0" />
      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col px-8 py-8 md:px-12">
        <div className="my-auto max-w-[760px] border border-white/35 p-8 shadow-[14px_14px_0_rgba(31,6,4,.2)] md:p-14">
          <p className="text-xs uppercase tracking-[.44em] text-white/85">Cucina Italiana</p>
          <h1 className="mt-7 font-['Cormorant_Garamond'] text-[clamp(4rem,10vw,9rem)] leading-[.82] tracking-[-.055em]">
            Buonasera,<br /><em className="text-[#FBF3E8]">Madinah.</em>
          </h1>
          <p className="mt-7 max-w-[30rem] text-xl leading-relaxed text-white/85">
            Pizza, pasta, and long Italian dinners, on the terrace or in the dining room.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-7">
            <span className="border border-white bg-[#530f0c]/45 px-8 py-4 text-xs uppercase tracking-[.24em]">Reserve a table</span>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[.24em]">View the menu <ChevronRight size={14} className="rotate-90" /></span>
          </div>
        </div>
        <div className="flex justify-between border-t border-white/20 px-2 py-4 text-[10px] uppercase tracking-[.28em] text-white/70">
          <span>Italian dining · Madinah</span><span>12 PM — 2 AM</span>
        </div>
      </div>
      <span className="absolute bottom-8 right-8 hidden items-center gap-2 text-xs uppercase tracking-[.2em] text-white/70 md:flex">Bianco <ArrowUpRight size={14} /></span>
    </section>
  );
}
