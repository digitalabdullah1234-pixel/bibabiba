import { type FormEvent, type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, type Variants } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Clock3, Instagram, MapPin, Menu, Phone, Star, X, Facebook, Send, Heart } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

const listingUrl = 'https://maps.app.goo.gl/X1aurWpXUuXSdWzP8';
const mapsEmbed = 'https://www.google.com/maps?q=Abo+Bakr+Al+Siddiq,+Al+Qiblatayn,+Madinah+42351,+Saudi+Arabia&output=embed';
const mapsPhoto = 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWm83Up9qihXIoG9ZDosn8hLq66NWL-kPgGwdvkhmeY-sVYhuOrIQsgIcjzy2SthVYGTLZhRPQvYsAgEoTvVYM3MlMgOl5lptxb7toRNIQFDKDr22Whd_142fiUJQU9n4n4oCyKQ6OpHFrw=w1200-h800-k-no';
const mapsPhotoPortrait = 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmP0e7c4hB3BZ9VRFsuiAG71wFetpD92S1nxkBJ6XJfp9aZ8UIXKt8S3c8u0MFGFubnoV9q7C4YZXWjlNAw8R_P6flmlQPQnYWVKjV0BVbUBwqEPNDIu9-uhVC0H4DAu6dDfsmQ67yATLHF=w900-h1200-k-no';
const gallery = [
  { src: mapsPhoto, alt: 'Bianco from the Google Maps listing', className: 'md:col-span-2 md:row-span-2' },
  { src: mapsPhotoPortrait, alt: 'A closer look from the Bianco listing', className: '' },
  { src: mapsPhoto, alt: 'Italian evenings at Bianco', className: '' },
  { src: mapsPhotoPortrait, alt: 'A warm view of the Bianco room', className: 'md:col-span-2' },
];
const menuItems = [
  { name: 'Pizza Ajwa', note: 'Our Madinah signature — a sweet, savoury meeting of place and craft.', mark: '01' },
  { name: 'Rose Pasta', note: 'Silky, rosy, and made for the middle of the table.', mark: '02' },
  { name: 'Italian favourites', note: 'The comforting classics you came for, made for staying late.', mark: '03' },
];

const reveal: Variants = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } };
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [formName, setFormName] = useState('');

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  const closeMenu = () => setMenuOpen(false);
  return (
    <main className="grain min-h-[100dvh] bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#421712]/90 text-[#fbf2e2] backdrop-blur-md">
        <div className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between px-5 md:px-10">
          <a href="#top" data-testid="link-logo" className="flex items-center gap-3" onClick={closeMenu}>
            <img src="/bianco-logo.png" alt="Bianco بيانكو" data-testid="img-logo-header" className="h-9 w-auto object-contain" />
            <span className="hidden border-l border-white/25 pl-3 font-mono-ui text-[10px] uppercase tracking-[.22em] text-[#d6c5ac] sm:block">Madinah</span>
          </a>
          <nav className={`${menuOpen ? 'absolute left-0 right-0 top-[76px] flex flex-col border-t border-white/10 bg-[#421712] p-6' : 'hidden'} gap-5 text-sm md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0`} aria-label="Main navigation">
            {[['about', 'Our table'], ['menu', 'Menu'], ['gallery', 'The room'], ['visit', 'Visit']].map(([href, label]) => (
              <a key={href} href={`#${href}`} onClick={closeMenu} data-testid={`link-nav-${href}`} className="line-link w-fit text-[#efe0cc] transition-colors hover:text-[#e2b960]">{label}</a>
            ))}
            <a href="#contact" onClick={closeMenu} data-testid="link-nav-contact" className="rounded-full border border-[#e2b960] px-5 py-2.5 text-[#e2b960] transition-colors hover:bg-[#e2b960] hover:text-[#421712]">Save a table</a>
          </nav>
          <button type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} data-testid="button-mobile-menu" className="rounded-full p-2 text-[#e2b960] md:hidden">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <section id="top" className="relative flex min-h-[720px] items-end overflow-hidden bg-[#421712] pb-16 pt-32 text-[#fbf2e2] md:min-h-[790px] md:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_28%,rgba(210,145,67,.28),transparent_28%),linear-gradient(110deg,rgba(66,23,18,.92),rgba(66,23,18,.5))]" />
          <div className="absolute right-[-12vw] top-20 h-[70vw] w-[70vw] max-h-[740px] max-w-[740px] rounded-full border border-[#d6ad67]/30 bg-cover bg-center opacity-85 md:right-[5vw]" style={{ backgroundImage: `url(${mapsPhoto})` }} />
        <div className="absolute right-[13vw] top-36 hidden h-[48vw] w-[48vw] max-h-[500px] max-w-[500px] rounded-full border border-[#d6ad67]/40 md:block" />
        <div className="relative z-10 mx-auto w-full max-w-[1320px] px-5 md:px-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-[720px]">
            <motion.p variants={reveal} className="mb-7 font-mono-ui text-[10px] uppercase tracking-[.28em] text-[#e2b960]">Italian kitchen · Al Qiblatayn</motion.p>
            <motion.h1 variants={reveal} data-testid="text-hero-heading" className="font-display text-[clamp(4.6rem,13vw,10.5rem)] leading-[.78] tracking-[-.065em] text-[#fbf2e2]">Come as<br /><em className="ml-[.5em] text-[#e2b960]">friends.</em></motion.h1>
            <motion.p variants={reveal} className="mt-10 max-w-[410px] text-lg leading-relaxed text-[#eadcca] md:text-xl">A cozy Italian room in Madinah for pizza, pasta, and the kind of evenings that run a little late.</motion.p>
            <motion.div variants={reveal} className="mt-9 flex flex-wrap items-center gap-4">
              <a href="#menu" data-testid="link-hero-menu" className="group inline-flex items-center gap-3 rounded-full bg-[#e2b960] px-6 py-3.5 text-sm font-semibold text-[#421712] transition-transform hover:-translate-y-1">See what&apos;s cooking <ArrowDown size={16} className="transition-transform group-hover:translate-y-1" /></a>
              <a href={listingUrl} target="_blank" rel="noreferrer" data-testid="link-hero-maps" className="inline-flex items-center gap-2 border-b border-[#d6c5ac] pb-1 text-sm text-[#fbf2e2] hover:text-[#e2b960]">Find us on Maps <ArrowUpRight size={15} /></a>
            </motion.div>
          </motion.div>
          <div className="absolute bottom-5 right-5 hidden items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[.2em] text-[#d6c5ac] md:flex"><ArrowDown size={14} className="animate-bounce text-[#e2b960]" /> Scroll to linger</div>
        </div>
      </section>

      <div className="overflow-hidden border-b border-[#7b5b46]/30 bg-[#e2b960] py-3 text-[#421712]">
        <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap font-mono-ui text-[11px] uppercase tracking-[.2em]">
          {Array.from({ length: 2 }).flatMap((_, i) => ['Pizza Ajwa', 'Rose pasta', 'Italian evenings', 'Madinah gatherings', 'Open until 2 AM'].map((item, j) => <span key={`${i}-${j}`} className="flex items-center gap-10">{item}<span className="text-lg">·</span></span>))}
        </div>
      </div>

      <section id="about" className="mx-auto max-w-[1320px] px-5 py-24 md:px-10 md:py-36">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger} className="grid gap-14 md:grid-cols-[.8fr_1.2fr] md:items-end">
          <motion.div variants={reveal}>
            <p className="font-mono-ui text-[10px] uppercase tracking-[.26em] text-[#7b5b46]">01 / Our table</p>
            <h2 className="mt-5 max-w-[390px] font-display text-5xl leading-[.98] tracking-[-.04em] text-[#421712] md:text-7xl">The best nights start with <em className="text-[#7d883e]">“stay a while.”</em></h2>
          </motion.div>
          <motion.div variants={reveal} className="max-w-[560px] md:pb-2">
            <p className="text-xl leading-relaxed text-[#5f493c] md:text-2xl">بيانكو means white. Our room is anything but quiet. We are an Italian-only restaurant in Al Qiblatayn, built around shared plates, easy conversation, and the warm feeling of being expected.</p>
            <p className="mt-6 leading-relaxed text-[#806b5a]">Come for a late dinner after sunset, bring the whole graduating class, or pull up a chair for one more story. The table is yours for as long as the evening asks.</p>
          </motion.div>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mt-16 grid gap-5 border-t border-[#7b5b46]/30 pt-5 sm:grid-cols-3">
          {[['4.4', 'Google rating', <Star key="star" size={14} fill="currentColor" />], ['12 PM — 2 AM', 'Every day', <Clock3 key="clock" size={14} />], ['Al Qiblatayn', 'Madinah, Saudi Arabia', <MapPin key="pin" size={14} />]].map(([value, label, icon], i) => <motion.div variants={reveal} key={label as string} data-testid={`stat-${i}`} className="flex items-start gap-3"><span className="mt-1 text-[#b07f32]">{icon}</span><div><p className="font-display text-2xl text-[#421712]">{value}</p><p className="mt-1 font-mono-ui text-[10px] uppercase tracking-[.16em] text-[#806b5a]">{label}</p></div></motion.div>)}
        </motion.div>
      </section>

      <section id="menu" className="bg-[#421712] px-5 py-24 text-[#fbf2e2] md:px-10 md:py-36">
        <div className="mx-auto max-w-[1320px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid gap-10 md:grid-cols-[.7fr_1.3fr]">
            <motion.div variants={reveal}><p className="font-mono-ui text-[10px] uppercase tracking-[.26em] text-[#e2b960]">02 / From the kitchen</p><h2 className="mt-5 font-display text-6xl leading-[.9] tracking-[-.05em] md:text-8xl">Made to<br /><em className="text-[#e2b960]">share.</em></h2></motion.div>
            <motion.div variants={reveal} className="flex items-end"><p className="max-w-[490px] text-xl leading-relaxed text-[#eadcca]">A short list of favourites, a table full of stories. Start with the signatures, then follow your appetite.</p></motion.div>
          </motion.div>
          <div className="mt-20">
            {menuItems.map((item, i) => <motion.article key={item.name} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={reveal} className="group grid gap-4 border-t border-[#d6c5ac]/25 py-7 md:grid-cols-[80px_1fr_1.1fr] md:items-center md:gap-8">
              <span className="font-mono-ui text-xs text-[#d6ad67]">{item.mark}</span><h3 className="font-display text-4xl tracking-[-.03em] transition-colors group-hover:text-[#e2b960] md:text-5xl">{item.name}</h3><p className="max-w-[390px] text-sm leading-relaxed text-[#d6c5ac]">{item.note}</p>
            </motion.article>)}
          </div>
          <div className="mt-14 flex flex-wrap items-center gap-5"><a href={listingUrl} target="_blank" rel="noreferrer" data-testid="link-menu-google" className="inline-flex items-center gap-3 rounded-full bg-[#e2b960] px-6 py-3.5 text-sm font-semibold text-[#421712] hover:bg-[#f0d48f]">View menu & reviews <ArrowUpRight size={16} /></a><span className="font-mono-ui text-[10px] uppercase tracking-[.15em] text-[#bfa993]">4.4 / 5 · 214 reviews</span></div>
        </div>
      </section>

      <section id="gallery" className="mx-auto max-w-[1320px] px-5 py-24 md:px-10 md:py-36">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-12 flex items-end justify-between gap-5">
          <motion.div variants={reveal}><p className="font-mono-ui text-[10px] uppercase tracking-[.26em] text-[#7b5b46]">03 / The room</p><h2 className="mt-4 font-display text-6xl leading-none tracking-[-.05em] text-[#421712] md:text-8xl">A seat<br /><em className="text-[#7d883e]">for you.</em></h2></motion.div>
          <motion.p variants={reveal} className="hidden max-w-[240px] text-right text-sm leading-relaxed text-[#806b5a] md:block">The glow, the clatter, the last forkful. A little look around before you arrive.</motion.p>
        </motion.div>
          <div className="grid auto-rows-[230px] gap-4 md:grid-cols-4 md:auto-rows-[210px]">
          {gallery.map((image, i) => <motion.figure key={`${image.src}-${i}`} data-testid={`figure-gallery-${i}`} initial={{ opacity: 0, scale: .97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * .08, duration: .7 }} className={`group relative overflow-hidden ${image.className}`}><img src={image.src} alt={image.alt} data-testid={`img-gallery-${i}`} loading="lazy" className="h-full w-full object-cover grayscale-[.15] transition duration-700 group-hover:scale-105 group-hover:grayscale-0" /><div className="absolute inset-0 bg-gradient-to-t from-[#421712]/50 to-transparent opacity-70" /><figcaption className="absolute bottom-4 left-4 font-mono-ui text-[9px] uppercase tracking-[.18em] text-[#fbf2e2]">{image.alt}</figcaption></motion.figure>)}
        </div>
      </section>

      <section id="visit" className="bg-[#7d883e] px-5 py-24 text-[#fbf2e2] md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1320px] gap-14 md:grid-cols-[.95fr_1.05fr] md:items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.p variants={reveal} className="font-mono-ui text-[10px] uppercase tracking-[.26em] text-[#ede1bd]">04 / Come find us</motion.p>
            <motion.h2 variants={reveal} className="mt-5 font-display text-6xl leading-[.9] tracking-[-.05em] md:text-8xl">The door is<br /><em>open late.</em></motion.h2>
            <motion.div variants={reveal} className="mt-9 space-y-5 text-[#f1e8ca]">
              <p className="flex gap-3"><MapPin className="mt-1 shrink-0" size={17} /><span>Abo Bakr Al Siddiq<br />Al Qiblatayn, Madinah 42351<br />Saudi Arabia</span></p>
              <p className="flex gap-3"><Clock3 className="mt-1 shrink-0" size={17} /><span>Every day<br />12 PM — 2 AM</span></p>
              <a href="tel:+966559949069" data-testid="link-phone" className="flex gap-3 hover:text-white"><Phone className="mt-1 shrink-0" size={17} /><span>+966 55 994 9069</span></a>
            </motion.div>
            <motion.a variants={reveal} href={listingUrl} target="_blank" rel="noreferrer" data-testid="link-google-maps" className="mt-10 inline-flex items-center gap-3 rounded-full border border-[#ede1bd] px-6 py-3.5 text-sm transition hover:bg-[#ede1bd] hover:text-[#53602a]">Open in Google Maps <ArrowUpRight size={16} /></motion.a>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .8 }} className="relative min-h-[380px] overflow-hidden border-8 border-[#e7dfbd]/30 shadow-xl md:min-h-[490px]"><iframe title="Bianco location map" data-testid="embed-google-map" src={mapsEmbed} loading="lazy" className="absolute inset-0 h-full w-full border-0 grayscale-[.3] contrast-110" /><div className="pointer-events-none absolute left-5 top-5 bg-[#421712] px-4 py-3 text-[#fbf2e2] shadow-lg"><p className="font-display text-xl">Bianco</p><p className="font-mono-ui text-[9px] uppercase tracking-[.12em] text-[#e2b960]">Al Qiblatayn</p></div></motion.div>
        </div>
      </section>

      <section id="contact" className="bg-[#f0e6d3] px-5 py-24 md:px-10 md:py-36">
        <div className="mx-auto grid max-w-[1320px] gap-16 md:grid-cols-[.75fr_1.25fr]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}><motion.p variants={reveal} className="font-mono-ui text-[10px] uppercase tracking-[.26em] text-[#7b5b46]">05 / Stay in touch</motion.p><motion.h2 variants={reveal} className="mt-5 font-display text-6xl leading-[.9] tracking-[-.05em] text-[#421712] md:text-8xl">Bring your<br /><em className="text-[#b07f32]">people.</em></motion.h2><motion.p variants={reveal} className="mt-8 max-w-[350px] leading-relaxed text-[#806b5a]">Planning a graduation, a gathering, or simply tonight? Leave us a note and our team will get back to you.</motion.p></motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="md:pt-8">
            {sent ? <div data-testid="status-contact-success" className="flex min-h-[300px] flex-col justify-center border-t border-[#7b5b46]/30"><Heart className="mb-5 text-[#b07f32]" size={25} /><h3 className="font-display text-4xl text-[#421712]">We&apos;ll keep a chair warm.</h3><p className="mt-3 max-w-md leading-relaxed text-[#806b5a]">Thanks{formName ? `, ${formName}` : ''}. Your note is in — call us at +966 55 994 9069 if your plans are for tonight.</p><button type="button" data-testid="button-contact-again" onClick={() => setSent(false)} className="mt-8 w-fit border-b border-[#421712] pb-1 text-sm text-[#421712]">Send another note</button></div> : <form onSubmit={submitForm} className="space-y-7 border-t border-[#7b5b46]/30 pt-7">
              <label className="block"><span className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[#7b5b46]">Your name</span><input required value={formName} onChange={(e) => setFormName(e.target.value)} data-testid="input-contact-name" name="name" className="mt-3 block w-full border-b border-[#7b5b46]/40 bg-transparent pb-3 text-lg text-[#421712] outline-none placeholder:text-[#ab927b] focus:border-[#421712]" placeholder="How should we call you?" /></label>
              <label className="block"><span className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[#7b5b46]">Your email</span><input required type="email" data-testid="input-contact-email" name="email" className="mt-3 block w-full border-b border-[#7b5b46]/40 bg-transparent pb-3 text-lg text-[#421712] outline-none placeholder:text-[#ab927b] focus:border-[#421712]" placeholder="you@example.com" /></label>
              <label className="block"><span className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[#7b5b46]">Your note</span><textarea required data-testid="textarea-contact-message" name="message" rows={3} className="mt-3 block w-full resize-none border-b border-[#7b5b46]/40 bg-transparent pb-3 text-lg text-[#421712] outline-none placeholder:text-[#ab927b] focus:border-[#421712]" placeholder="Tell us about your evening..." /></label>
              <button type="submit" data-testid="button-contact-submit" className="group inline-flex items-center gap-3 rounded-full bg-[#421712] px-7 py-4 text-sm font-semibold text-[#fbf2e2] transition hover:bg-[#7d883e]">Send a note <Send size={15} className="transition-transform group-hover:translate-x-1" /></button>
            </form>}
          </motion.div>
        </div>
      </section>

      <footer className="bg-[#421712] px-5 py-12 text-[#fbf2e2] md:px-10">
        <div className="mx-auto max-w-[1320px]">
          <div className="flex flex-col justify-between gap-10 border-b border-[#d6c5ac]/20 pb-12 md:flex-row md:items-end">
            <div><img src="/bianco-logo.png" alt="Bianco بيانكو" data-testid="img-logo-footer" className="h-12 w-auto" /><p className="mt-5 max-w-[270px] font-display text-2xl leading-tight text-[#e2b960]">Italian evenings, the Madinah way.</p></div>
            <div className="flex gap-4"><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Bianco on Instagram" data-testid="link-instagram" className="rounded-full border border-[#d6c5ac]/35 p-3 transition hover:border-[#e2b960] hover:text-[#e2b960]"><Instagram size={18} /></a><a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Bianco on Facebook" data-testid="link-facebook" className="rounded-full border border-[#d6c5ac]/35 p-3 transition hover:border-[#e2b960] hover:text-[#e2b960]"><Facebook size={18} /></a><a href="tel:+966559949069" aria-label="Call Bianco" data-testid="link-footer-phone" className="rounded-full border border-[#d6c5ac]/35 p-3 transition hover:border-[#e2b960] hover:text-[#e2b960]"><Phone size={18} /></a></div>
          </div>
          <div className="flex flex-col justify-between gap-3 pt-6 font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#bfa993] md:flex-row"><span>بيانكو · Bianco · Madinah</span><span>12 PM — 2 AM · Every day</span><span>© {new Date().getFullYear()} Bianco</span></div>
        </div>
      </footer>
      <a href="tel:+966559949069" data-testid="link-mobile-call" className="fixed bottom-4 right-4 z-30 flex items-center gap-2 rounded-full bg-[#e2b960] px-4 py-3 text-xs font-semibold text-[#421712] shadow-lg md:hidden"><Phone size={15} /> Call Bianco</a>
    </main>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
