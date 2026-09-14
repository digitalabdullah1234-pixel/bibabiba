import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import {
  ArrowDown,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Instagram,
  MapPin,
  Menu,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  Star,
  Trash2,
  X,
} from 'lucide-react';
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
const phoneNumber = '+966 55 994 9069';
const whatsappNumber = '966559949069';

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  imagePosition?: string;
  note: string;
};

type CartLine = {
  product: Product;
  quantity: number;
};

const products: Product[] = [
  {
    id: 'pizza-ajwa',
    name: 'Pizza Ajwa',
    price: 54,
    description: 'Charred tomato, fior di latte, Madinah ajwa, and a quiet hit of chili.',
    category: 'Signature',
    image: mapsPhoto,
    imagePosition: 'center 52%',
    note: 'The house signature',
  },
  {
    id: 'rose-pasta',
    name: 'Rose Pasta',
    price: 48,
    description: 'Silky rose sauce, basil oil, parmesan, and a little heat at the finish.',
    category: 'Pasta',
    image: mapsPhotoPortrait,
    imagePosition: 'center 35%',
    note: 'Best seller',
  },
  {
    id: 'margherita',
    name: 'Margherita',
    price: 42,
    description: 'San Marzano tomato, mozzarella, basil, and olive oil on a blistered base.',
    category: 'Pizza',
    image: mapsPhoto,
    imagePosition: 'center 70%',
    note: 'A classic, sharpened',
  },
  {
    id: 'truffle-mushroom',
    name: 'Truffle Mushroom',
    price: 58,
    description: 'Roasted mushrooms, fontina, black truffle, and thyme over crisp dough.',
    category: 'Pizza',
    image: mapsPhotoPortrait,
    imagePosition: 'center 64%',
    note: 'For late nights',
  },
  {
    id: 'burrata-tomato',
    name: 'Burrata & Tomato',
    price: 36,
    description: 'Creamy burrata, ripe tomato, basil, and aged balsamic.',
    category: 'Starters',
    image: mapsPhoto,
    imagePosition: 'center 30%',
    note: 'Start here',
  },
  {
    id: 'tiramisu',
    name: 'Tiramisu',
    price: 28,
    description: 'Mascarpone cream, espresso-soaked ladyfingers, cocoa, no unnecessary drama.',
    category: 'Dolci',
    image: mapsPhotoPortrait,
    imagePosition: 'center 78%',
    note: 'The last word',
  },
];

const gallery = [
  { src: mapsPhoto, alt: 'Bianco dining room from the Google Maps listing', className: 'md:col-span-2 md:row-span-2' },
  { src: mapsPhotoPortrait, alt: 'A closer look inside Bianco', className: '' },
  { src: mapsPhoto, alt: 'The Bianco room after dark', className: '' },
  { src: mapsPhotoPortrait, alt: 'Warm details from the restaurant', className: 'md:col-span-2' },
];

const categories = ['All', 'Signature', 'Pizza', 'Pasta', 'Starters', 'Dolci'];

const reveal: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function formatPrice(value: number) {
  return `${value} SAR`;
}

function ProductCard({
  product,
  onAdd,
  onDetails,
}: {
  product: Product;
  onAdd: (product: Product) => void;
  onDetails: (product: Product) => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      whileHover={{ y: -7 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      data-testid={`card-product-${product.id}`}
      className="product-card group relative flex flex-col overflow-hidden border border-white/[.12] bg-[#1a1210] shadow-[0_18px_55px_rgba(0,0,0,.18)]"
    >
      <button type="button" onClick={() => onDetails(product)} data-testid={`button-details-${product.id}`} className="focus-ring relative block aspect-[1.12] w-full overflow-hidden text-left">
        <img src={product.image} alt={`${product.name} at Bianco`} loading="lazy" style={{ objectPosition: product.imagePosition }} className="h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-95" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,14,13,.08),rgba(15,14,13,.72))]" />
        <span className="absolute left-4 top-4 border border-[#f2b46d]/45 bg-[#110d0c]/75 px-2.5 py-1 font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#f2b46d] backdrop-blur-sm">{product.category}</span>
        <span className="absolute bottom-4 left-4 font-mono-ui text-[9px] uppercase tracking-[.15em] text-[#efe8dc]/65">{product.note}</span>
        <span className="absolute bottom-3 right-4 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full border border-white/30 bg-[#f5eee2] text-[#210f0c] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"><ArrowUpRight size={15} /></span>
      </button>
      <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
        <div>
          <div className="flex items-start justify-between gap-4">
            <h3 data-testid={`text-product-name-${product.id}`} className="font-display text-[2rem] leading-none tracking-[-.025em] text-[#f5eee2]">{product.name}</h3>
            <motion.span key={product.price} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} data-testid={`text-product-price-${product.id}`} className="whitespace-nowrap font-mono-ui text-[11px] text-[#f2b46d]">{formatPrice(product.price)}</motion.span>
          </div>
          <p data-testid={`text-product-description-${product.id}`} className="mt-4 max-w-[28rem] text-sm leading-relaxed text-[#9c8f84]">{product.description}</p>
        </div>
        <button type="button" onClick={() => onAdd(product)} data-testid={`button-add-${product.id}`} className="focus-ring mt-7 flex w-full items-center justify-between border-t border-white/[.13] pt-4 text-left text-[11px] font-semibold uppercase tracking-[.16em] text-[#f5eee2] transition-colors hover:text-[#f2b46d]">
          <span>Add to order</span><Plus size={16} strokeWidth={1.5} />
        </button>
      </div>
    </motion.article>
  );
}

function CartDrawer({
  cart,
  subtotal,
  onClose,
  onUpdateQuantity,
  onRemove,
}: {
  cart: CartLine[];
  subtotal: number;
  onClose: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}) {
  const orderMessage = cart.length
    ? `Hello Bianco, I'd like to order:\n${cart.map(({ product, quantity }) => `${quantity} × ${product.name}`).join('\n')}\nEstimated total: ${formatPrice(subtotal)}`
    : 'Hello Bianco, I would like to place an order.';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderMessage)}`;

  return (
    <AnimatePresence>
      <motion.div key="cart-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-[#080706]/75 backdrop-blur-[3px]" onClick={onClose} data-testid="overlay-cart" />
      <motion.aside key="cart-panel" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 260 }} onClick={(event) => event.stopPropagation()} data-testid="panel-cart" className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-[475px] flex-col border-l border-white/[.13] bg-[#1a1210] text-[#f5eee2] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[.12] px-5 py-5 md:px-7">
          <div><p className="font-mono-ui text-[9px] uppercase tracking-[.22em] text-[#f2b46d]">Your table, to go</p><h2 data-testid="text-cart-heading" className="mt-1 font-display text-4xl leading-none">Your order</h2></div>
          <button type="button" onClick={onClose} aria-label="Close cart" data-testid="button-close-cart" className="focus-ring rounded-full border border-white/15 p-2.5 text-[#c4b7a9] transition hover:border-[#f2b46d] hover:text-[#f2b46d]"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5 md:px-7">
          {cart.length === 0 ? (
              <div data-testid="empty-cart" className="flex min-h-[52vh] flex-col items-center justify-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#f2b46d]/35 text-[#f2b46d]"><ShoppingBag size={24} strokeWidth={1.2} /></div>
              <p className="font-display text-3xl">Nothing on the table yet.</p>
              <p className="mt-3 max-w-[250px] text-sm leading-relaxed text-[#a9a097]">Add a signature, a little something to share, and we will get it moving.</p>
              <button type="button" onClick={onClose} data-testid="button-empty-cart-browse" className="mt-8 border-b border-[#e8c78e] pb-1 font-mono-ui text-[10px] uppercase tracking-[.18em] text-[#e8c78e]">Browse the menu</button>
            </div>
          ) : (
            <div className="space-y-1">
              <p data-testid="text-cart-count" className="mb-5 font-mono-ui text-[10px] uppercase tracking-[.16em] text-[#a9a097]">{cart.reduce((sum, line) => sum + line.quantity, 0)} items · for pickup or delivery</p>
              {cart.map(({ product, quantity }) => (
                <motion.div layout key={product.id} data-testid={`row-cart-${product.id}`} className="flex gap-4 border-t border-white/[.11] py-5">
                  <img src={product.image} alt="" className="h-20 w-20 shrink-0 object-cover opacity-80" style={{ objectPosition: product.imagePosition }} />
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-3"><p className="font-display text-2xl leading-none">{product.name}</p><button type="button" onClick={() => onRemove(product.id)} aria-label={`Remove ${product.name}`} data-testid={`button-remove-${product.id}`} className="text-[#8f867c] transition hover:text-[#e8c78e]"><Trash2 size={15} /></button></div>
                    <p className="mt-2 font-mono-ui text-[10px] text-[#e8c78e]">{formatPrice(product.price)}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center border border-white/[.16]">
                        <button type="button" onClick={() => onUpdateQuantity(product.id, -1)} aria-label={`Decrease ${product.name}`} data-testid={`button-decrease-${product.id}`} className="p-2 text-[#c6bdb2] transition hover:text-[#e8c78e]"><Minus size={13} /></button>
                        <motion.span key={quantity} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} data-testid={`text-quantity-${product.id}`} className="min-w-8 text-center font-mono-ui text-[11px]">{quantity}</motion.span>
                        <button type="button" onClick={() => onUpdateQuantity(product.id, 1)} aria-label={`Increase ${product.name}`} data-testid={`button-increase-${product.id}`} className="p-2 text-[#c6bdb2] transition hover:text-[#e8c78e]"><Plus size={13} /></button>
                      </div>
                      <span data-testid={`text-line-total-${product.id}`} className="font-mono-ui text-[11px] text-[#efe8dc]">{formatPrice(product.price * quantity)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-white/[.12] bg-[#1c1917] px-5 py-5 md:px-7">
          <div className="flex items-center justify-between"><span className="font-mono-ui text-[10px] uppercase tracking-[.16em] text-[#a9a097]">Estimated subtotal</span><motion.span key={subtotal} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} data-testid="text-cart-subtotal" className="font-display text-3xl">{formatPrice(subtotal)}</motion.span></div>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" data-testid="link-checkout-whatsapp" className={`mt-5 flex items-center justify-between bg-[#e8c78e] px-5 py-4 text-[11px] font-semibold uppercase tracking-[.14em] text-[#171513] transition hover:bg-[#f0d7a9] ${cart.length === 0 ? 'pointer-events-none opacity-40' : ''}`}><span>Order via WhatsApp</span><ArrowUpRight size={16} /></a>
          <a href={`tel:${phoneNumber.replace(/\s/g, '')}`} data-testid="link-checkout-call" className="mt-3 flex items-center justify-center gap-2 py-2 text-[10px] uppercase tracking-[.15em] text-[#a9a097] transition hover:text-[#e8c78e]"><Phone size={13} /> Prefer to call? {phoneNumber}</a>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}

function ProductDetailModal({ product, onClose, onAdd }: { product: Product; onClose: () => void; onAdd: (product: Product) => void }) {
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[80] flex items-center justify-center bg-[#080706]/80 p-4 backdrop-blur-sm" data-testid="modal-product-backdrop">
        <motion.div initial={{ opacity: 0, y: 22, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }} onClick={(event) => event.stopPropagation()} className="relative grid w-full max-w-[880px] overflow-hidden border border-white/[.14] bg-[#1a1816] md:grid-cols-[.9fr_1.1fr]" data-testid={`modal-product-${product.id}`}>
          <div className="relative min-h-[290px] md:min-h-[520px]"><img src={product.image} alt={`${product.name} at Bianco`} className="absolute inset-0 h-full w-full object-cover opacity-80" style={{ objectPosition: product.imagePosition }} /><div className="absolute inset-0 bg-gradient-to-t from-[#171513] via-transparent to-transparent" /><span className="absolute bottom-5 left-5 font-mono-ui text-[9px] uppercase tracking-[.18em] text-[#e8c78e]">{product.category} · {product.note}</span></div>
          <div className="flex flex-col justify-between p-6 md:p-10"><button type="button" onClick={onClose} aria-label="Close product details" data-testid="button-close-product-modal" className="absolute right-4 top-4 rounded-full border border-white/15 p-2 text-[#c6bdb2] transition hover:border-[#e8c78e] hover:text-[#e8c78e]"><X size={17} /></button><div><p className="font-mono-ui text-[10px] uppercase tracking-[.22em] text-[#e8c78e]">From the Bianco kitchen</p><h2 data-testid={`text-modal-name-${product.id}`} className="mt-5 max-w-[380px] font-display text-6xl leading-[.88] tracking-[-.03em] text-[#efe8dc]">{product.name}</h2><p data-testid={`text-modal-description-${product.id}`} className="mt-7 max-w-[390px] text-base leading-relaxed text-[#b8afa5]">{product.description}</p></div><div className="mt-12"><p data-testid={`text-modal-price-${product.id}`} className="font-mono-ui text-xs text-[#e8c78e]">{formatPrice(product.price)}</p><button type="button" onClick={() => { onAdd(product); onClose(); }} data-testid={`button-modal-add-${product.id}`} className="mt-5 flex w-full items-center justify-between bg-[#e8c78e] px-5 py-4 text-[11px] font-semibold uppercase tracking-[.16em] text-[#171513] transition hover:bg-[#f0d7a9]"><span>Add to order</span><Plus size={16} /></button></div></div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartLine[]>(() => {
    try {
      const saved = window.localStorage.getItem('bianco-cart');
      if (!saved) return [];
      return JSON.parse(saved) as CartLine[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem('bianco-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    document.body.style.overflow = cartOpen || Boolean(selectedProduct) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [cartOpen, selectedProduct]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setCartOpen(false);
        setSelectedProduct(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const filteredProducts = useMemo(() => selectedCategory === 'All' ? products : products.filter((product) => product.category === selectedCategory), [selectedCategory]);
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  const addToCart = (product: Product) => {
    setCart((current) => {
      const existing = current.find((line) => line.product.id === product.id);
      if (existing) return current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line);
      return [...current, { product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((current) => current.flatMap((line) => line.product.id === id ? (line.quantity + delta > 0 ? [{ ...line, quantity: line.quantity + delta }] : []) : [line]));
  };

  const removeFromCart = (id: string) => setCart((current) => current.filter((line) => line.product.id !== id));
  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="grain min-h-[100dvh] bg-[#110d0c] text-[#f5eee2]">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-[#f5eee2]/10 bg-[#110d0c]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-between px-5 md:px-10">
          <a href="#top" onClick={closeMenu} data-testid="link-logo" className="focus-ring flex items-center gap-3"><img src="/bianco-logo.jpg" alt="Bianco بيانكو" data-testid="img-logo-header" className="h-9 w-[106px] object-cover object-center mix-blend-screen" /><span className="hidden border-l border-[#f5eee2]/20 pl-3 font-mono-ui text-[9px] uppercase tracking-[.22em] text-[#9c8f84] sm:block">Madinah / KSA</span></a>
          <nav className={`${menuOpen ? 'absolute left-0 right-0 top-[74px] flex flex-col border-b border-[#f5eee2]/10 bg-[#110d0c] p-6' : 'hidden'} gap-6 text-[11px] uppercase tracking-[.17em] text-[#c4b7a9] md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0`} aria-label="Main navigation">
            <a href="#order" onClick={closeMenu} data-testid="link-nav-order" className="line-link transition hover:text-[#f2b46d]">Menu</a>
            <a href="#story" onClick={closeMenu} data-testid="link-nav-story" className="line-link transition hover:text-[#f2b46d]">The Bianco energy</a>
            <a href="#visit" onClick={closeMenu} data-testid="link-nav-visit" className="line-link transition hover:text-[#f2b46d]">Find us</a>
            <a href={listingUrl} target="_blank" rel="noreferrer" data-testid="link-nav-maps" className="line-link transition hover:text-[#f2b46d]">Maps <ArrowUpRight className="ml-1 inline" size={12} /></a>
          </nav>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setCartOpen(true)} aria-label={`Open cart with ${cartCount} items`} data-testid="button-open-cart" className="focus-ring relative flex items-center gap-2 bg-[#f2b46d] px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-[.14em] text-[#210f0c] transition hover:bg-[#ffd097]"><ShoppingBag size={15} strokeWidth={2} /><span className="hidden sm:inline">Your bag</span><AnimatePresence mode="popLayout"><motion.span key={cartCount} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} data-testid="text-header-cart-count" className="min-w-4 text-center">{cartCount}</motion.span></AnimatePresence></button>
            <button type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} data-testid="button-mobile-menu" className="focus-ring rounded-full p-2 text-[#f2b46d] md:hidden">{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
          </div>
        </div>
      </header>

      <section id="top" className="beast-hero relative overflow-hidden border-b border-[#f5eee2]/10 pt-[74px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(188,51,38,.38),transparent_24%),radial-gradient(circle_at_12%_70%,rgba(242,180,109,.12),transparent_26%)]" />
        <div className="beast-grid absolute inset-0 opacity-40" />
        <motion.div initial={{ opacity: 0, scale: .85, rotate: -8 }} animate={{ opacity: .22, scale: 1, rotate: 0 }} transition={{ duration: 1.5, ease: 'easeOut' }} className="beast-stamp absolute right-[-7%] top-[18%] hidden h-[520px] w-[520px] rounded-full border border-[#f2b46d]/40 p-7 md:block"><div className="flex h-full w-full items-center justify-center rounded-full border border-[#f2b46d]/25 font-display text-[150px] italic text-[#f2b46d]">B</div></motion.div>
        <div className="relative z-10 mx-auto grid min-h-[700px] max-w-[1440px] items-center gap-12 px-5 py-16 md:grid-cols-[1fr_.86fr] md:px-10 md:py-20">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-[700px]">
            <motion.div variants={reveal} className="mb-7 flex items-center gap-3 font-mono-ui text-[9px] uppercase tracking-[.24em] text-[#f2b46d]"><span className="h-px w-10 bg-[#f2b46d]" />Madinah's Italian kitchen · open until 02:00</motion.div>
            <motion.h1 variants={reveal} data-testid="text-hero-heading" className="font-display text-[clamp(4.8rem,12vw,10.5rem)] leading-[.72] tracking-[-.08em] text-[#f5eee2]">Feed<br /><em className="ml-[.15em] text-[#e85d43]">the beast.</em></motion.h1>
            <motion.p variants={reveal} data-testid="text-hero-description" className="mt-10 max-w-[480px] text-base leading-relaxed text-[#c4b7a9] md:text-lg">Big flavors, blistered crust, and plates made for the table. Pick your favorites, build the bag, and send it straight to the Bianco kitchen.</motion.p>
            <motion.div variants={reveal} className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#order" data-testid="link-hero-order" className="group flex items-center gap-4 bg-[#f2b46d] px-6 py-4 text-[11px] font-bold uppercase tracking-[.15em] text-[#210f0c] transition hover:bg-[#ffd097]">Start your order <ArrowDown size={15} className="transition-transform group-hover:translate-y-1" /></a>
              <span className="flex items-center gap-2 font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#9c8f84]"><span className="h-2 w-2 animate-pulse rounded-full bg-[#e85d43]" /> Kitchen is live</span>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 45, rotate: 2 }} animate={{ opacity: 1, x: 0, rotate: 0 }} transition={{ duration: .9, delay: .2, ease: [0.22, 1, 0.36, 1] }} className="featured-order relative mx-auto w-full max-w-[510px]">
            <div className="absolute -right-3 -top-3 z-20 flex h-20 w-20 rotate-12 items-center justify-center rounded-full bg-[#e85d43] text-center font-mono-ui text-[9px] font-bold uppercase leading-tight tracking-[.08em] text-[#fff2df] shadow-[0_15px_35px_rgba(0,0,0,.3)]">House<br />favorite<br />★</div>
            <div className="relative aspect-[.93] overflow-hidden border border-[#f5eee2]/20 bg-[#261512] p-3 shadow-[0_30px_90px_rgba(0,0,0,.4)]">
              <div className="relative h-full overflow-hidden"><img src={mapsPhoto} alt="Bianco signature Pizza Ajwa" className="h-full w-full object-cover transition duration-1000 hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#110d0c] via-transparent to-[#110d0c]/10" /><div className="absolute left-5 top-5 font-mono-ui text-[9px] uppercase tracking-[.18em] text-[#f5eee2]/80">01 / Signature plate</div><div className="absolute inset-x-5 bottom-5"><div className="flex items-end justify-between gap-4"><div><h2 className="font-display text-5xl leading-none text-[#f5eee2]">Pizza Ajwa</h2><p className="mt-2 max-w-[250px] text-sm text-[#c4b7a9]">Tomato, fior di latte, Madinah ajwa, chili.</p></div><span className="font-mono-ui text-sm font-bold text-[#f2b46d]">54 SAR</span></div><button type="button" onClick={() => addToCart(products[0])} data-testid="button-featured-add" className="mt-5 flex w-full items-center justify-between bg-[#f2b46d] px-4 py-3.5 text-[10px] font-bold uppercase tracking-[.16em] text-[#210f0c] transition hover:bg-[#ffd097]">Add signature to bag <Plus size={16} /></button></div></div>
            </div>
          </motion.div>
        </div>
        <div className="relative z-10 mx-auto flex max-w-[1440px] items-center justify-between border-t border-[#f5eee2]/10 px-5 py-4 font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#9c8f84] md:px-10"><span>Fast ordering · pickup or delivery</span><span className="hidden md:inline">Scroll to shop ↓</span><span>Al Qiblatayn, Madinah</span></div>
      </section>

      <div className="overflow-hidden border-b border-[#210f0c] bg-[#e85d43] py-3 text-[#210f0c]">
        <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap font-mono-ui text-[10px] font-bold uppercase tracking-[.2em]">{Array.from({ length: 2 }).flatMap((_, i) => ['Pizza Ajwa', 'Rose Pasta', 'Madinah after dark', 'Build your bag', '12 PM — 2 AM'].map((item, j) => <span key={`${i}-${j}`} className="flex items-center gap-10">{item}<span className="text-lg">✳</span></span>))}</div>
      </div>

      <section id="order" className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger} className="flex flex-col justify-between gap-8 border-b border-[#f5eee2]/15 pb-8 md:flex-row md:items-end">
          <motion.div variants={reveal}><p className="font-mono-ui text-[9px] uppercase tracking-[.25em] text-[#f2b46d]">02 — Shop the menu</p><h2 data-testid="text-menu-heading" className="mt-4 max-w-[620px] font-display text-6xl leading-[.78] tracking-[-.06em] md:text-8xl">Choose your<br /><em className="text-[#e85d43]">damage.</em></h2></motion.div>
          <motion.p variants={reveal} className="max-w-[330px] text-sm leading-relaxed text-[#9c8f84] md:pb-1">Tap a plate to see the details. Hit add and your bag is ready for the kitchen.</motion.p>
        </motion.div>
        <div className="mt-7 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Menu categories">{categories.map((category) => <button type="button" key={category} onClick={() => setSelectedCategory(category)} aria-selected={selectedCategory === category} data-testid={`button-category-${category.toLowerCase()}`} className={`focus-ring whitespace-nowrap border px-4 py-2.5 font-mono-ui text-[9px] font-bold uppercase tracking-[.17em] transition ${selectedCategory === category ? 'border-[#f2b46d] bg-[#f2b46d] text-[#210f0c]' : 'border-[#f5eee2]/15 text-[#9c8f84] hover:border-[#f2b46d]/60 hover:text-[#f2b46d]'}`}>{category}</button>)}</div>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
          <motion.div layout className="grid gap-4 sm:grid-cols-2">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} onDetails={setSelectedProduct} />)}</motion.div>
          <aside className="order-first border border-[#f5eee2]/15 bg-[#1a1210] p-5 lg:order-last lg:sticky lg:top-24" data-testid="summary-order">
            <div className="flex items-center justify-between"><p className="font-mono-ui text-[9px] font-bold uppercase tracking-[.2em] text-[#f2b46d]">Your bag</p><ShoppingBag size={17} className="text-[#f2b46d]" /></div>
            {cart.length === 0 ? <div className="border-t border-[#f5eee2]/10 pt-8"><p className="font-display text-3xl">Empty for now.</p><p className="mt-3 text-sm leading-relaxed text-[#9c8f84]">Add a plate and we’ll keep your order here while you browse.</p></div> : <div className="mt-6 space-y-3 border-t border-[#f5eee2]/10 pt-4">{cart.slice(0, 3).map(({ product, quantity }) => <div key={product.id} className="flex items-center justify-between gap-3 text-sm"><span className="truncate text-[#c4b7a9]"><b className="mr-2 text-[#f2b46d]">{quantity}×</b>{product.name}</span><span className="font-mono-ui text-[10px] text-[#f5eee2]">{formatPrice(product.price * quantity)}</span></div>)}{cart.length > 3 && <p className="font-mono-ui text-[9px] uppercase tracking-[.12em] text-[#9c8f84]">+ {cart.length - 3} more</p>}</div>}
            <div className="mt-7 flex items-end justify-between border-t border-[#f5eee2]/10 pt-4"><span className="font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#9c8f84]">Subtotal</span><span className="font-display text-3xl text-[#f2b46d]">{formatPrice(subtotal)}</span></div>
            <button type="button" onClick={() => setCartOpen(true)} data-testid="button-summary-checkout" className="mt-5 flex w-full items-center justify-between bg-[#e85d43] px-4 py-3.5 text-[10px] font-bold uppercase tracking-[.14em] text-[#fff2df] transition hover:bg-[#f2765d]">Review & checkout <ArrowUpRight size={15} /></button>
            <p className="mt-3 text-center font-mono-ui text-[8px] uppercase tracking-[.13em] text-[#716760]">Checkout securely via WhatsApp</p>
          </aside>
        </div>
        <div className="mt-9 flex flex-col gap-3 border-t border-[#f5eee2]/12 pt-5 text-[10px] uppercase tracking-[.14em] text-[#716760] sm:flex-row sm:items-center sm:justify-between"><span>Prices in Saudi Riyal · pickup or delivery</span><button type="button" onClick={() => setCartOpen(true)} data-testid="button-review-order" className="flex items-center gap-2 text-[#f2b46d] transition hover:text-[#ffd097]">Open full bag <ChevronRight size={14} /></button></div>
      </section>

      <section id="story" className="border-y border-[#f5eee2]/10 bg-[#1a1210] px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-14 md:grid-cols-[.8fr_1.2fr] md:items-start">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}><motion.p variants={reveal} className="font-mono-ui text-[9px] uppercase tracking-[.25em] text-[#f2b46d]">03 — The Bianco energy</motion.p><motion.h2 variants={reveal} className="mt-5 max-w-[450px] font-display text-6xl leading-[.78] tracking-[-.06em] md:text-8xl">Not a<br /><em className="text-[#e85d43]">quiet</em> room.</motion.h2></motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-[620px] md:pt-16"><motion.p variants={reveal} className="text-2xl leading-[1.1] text-[#f5eee2] md:text-4xl">Bianco means white. The evening is anything but.</motion.p><motion.p variants={reveal} className="mt-8 max-w-[500px] text-base leading-relaxed text-[#9c8f84]">We built this Italian room for the in-between hours: the late dinner after a long day, the table that keeps ordering, the plate passed across the room without asking.</motion.p><motion.div variants={reveal} className="mt-12 grid grid-cols-2 gap-6 border-t border-[#f5eee2]/12 pt-5 sm:grid-cols-3"><div><p data-testid="text-rating" className="font-display text-4xl text-[#f2b46d]">4.4</p><p className="mt-1 font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#716760]">Google rating</p></div><div><p data-testid="text-hours" className="font-display text-4xl text-[#f2b46d]">02:00</p><p className="mt-1 font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#716760]">Last order</p></div><div><p data-testid="text-location" className="font-display text-4xl text-[#f2b46d]">KSA</p><p className="mt-1 font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#716760]">Madinah</p></div></motion.div></motion.div>
        </div>
      </section>

      <section id="gallery" className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
        <div className="mb-10 flex items-end justify-between gap-5"><div><p className="font-mono-ui text-[9px] uppercase tracking-[.25em] text-[#f2b46d]">04 — Step inside</p><h2 className="mt-4 font-display text-6xl leading-[.78] tracking-[-.06em] md:text-8xl">The<br /><em className="text-[#e85d43]">room.</em></h2></div><p className="hidden max-w-[220px] text-right text-sm leading-relaxed text-[#716760] md:block">The glow, the clatter, the last forkful.</p></div>
        <div className="grid auto-rows-[220px] gap-3 md:grid-cols-4 md:auto-rows-[190px]">{gallery.map((image, i) => <motion.figure key={`${image.src}-${i}`} initial={{ opacity: 0, scale: .97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * .08, duration: .7 }} data-testid={`figure-gallery-${i}`} className={`group relative overflow-hidden border border-[#f5eee2]/10 ${image.className}`}><img src={image.src} alt={image.alt} data-testid={`img-gallery-${i}`} loading="lazy" className="h-full w-full object-cover opacity-70 grayscale-[.15] transition duration-700 group-hover:scale-105 group-hover:opacity-95 group-hover:grayscale-0" /><div className="absolute inset-0 bg-gradient-to-t from-[#110d0c]/80 to-transparent" /><figcaption className="absolute bottom-4 left-4 font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#f5eee2]/80">{image.alt}</figcaption></motion.figure>)}</div>
      </section>

      <section id="visit" className="border-t border-[#f5eee2]/10 bg-[#8d2d23] px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-14 md:grid-cols-[.9fr_1.1fr] md:items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}><motion.p variants={reveal} className="font-mono-ui text-[9px] uppercase tracking-[.25em] text-[#ffd097]">05 — Come find us</motion.p><motion.h2 variants={reveal} className="mt-5 font-display text-6xl leading-[.78] tracking-[-.06em] text-[#fff2df] md:text-8xl">The door<br /><em>is open.</em></motion.h2><motion.div variants={reveal} className="mt-10 space-y-5 text-sm leading-relaxed text-[#f4c6ae]"><p className="flex gap-3"><MapPin className="mt-0.5 shrink-0 text-[#ffd097]" size={17} /><span>Abo Bakr Al Siddiq<br />Al Qiblatayn, Madinah 42351<br />Saudi Arabia</span></p><p className="flex gap-3"><Clock3 className="mt-0.5 shrink-0 text-[#ffd097]" size={17} /><span>Every day<br />12 PM — 2 AM</span></p><a href={`tel:${phoneNumber.replace(/\s/g, '')}`} data-testid="link-phone" className="flex gap-3 transition hover:text-[#fff2df]"><Phone className="mt-0.5 shrink-0 text-[#ffd097]" size={17} /><span>{phoneNumber}</span></a></motion.div><motion.a variants={reveal} href={listingUrl} target="_blank" rel="noreferrer" data-testid="link-google-maps" className="mt-10 inline-flex items-center gap-3 border border-[#ffd097]/60 px-5 py-3.5 text-[10px] uppercase tracking-[.15em] text-[#fff2df] transition hover:bg-[#ffd097] hover:text-[#8d2d23]">Open in Google Maps <ArrowUpRight size={15} /></motion.a></motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .8 }} className="relative min-h-[380px] overflow-hidden border border-[#ffd097]/35 bg-[#6b231c] shadow-2xl md:min-h-[500px]"><iframe title="Bianco location map" data-testid="embed-google-map" src={mapsEmbed} loading="lazy" className="absolute inset-0 h-full w-full border-0 grayscale-[.3] contrast-110" /><div className="pointer-events-none absolute left-5 top-5 bg-[#110d0c] px-4 py-3 text-[#f5eee2] shadow-lg"><p className="font-display text-2xl">Bianco</p><p className="font-mono-ui text-[9px] uppercase tracking-[.12em] text-[#f2b46d]">Al Qiblatayn</p></div></motion.div>
        </div>
      </section>

      <footer className="bg-[#110d0c] px-5 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-[1440px]"><div className="flex flex-col justify-between gap-12 border-b border-[#f5eee2]/12 pb-12 md:flex-row md:items-end"><div><img src="/bianco-logo.jpg" alt="Bianco بيانكو" data-testid="img-logo-footer" className="h-12 w-[142px] object-cover object-center mix-blend-screen" /><p className="mt-6 max-w-[320px] font-display text-3xl leading-[.95] text-[#f2b46d]">Order loud.<br />Eat well.</p></div><div className="flex flex-col items-start gap-4 text-[10px] uppercase tracking-[.15em] text-[#9c8f84] md:items-end"><a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" data-testid="link-footer-whatsapp" className="transition hover:text-[#f2b46d]">WhatsApp the kitchen <ArrowUpRight className="ml-1 inline" size={13} /></a><a href={`tel:${phoneNumber.replace(/\s/g, '')}`} data-testid="link-footer-phone" className="transition hover:text-[#f2b46d]">Call {phoneNumber}</a><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" data-testid="link-instagram" className="flex items-center gap-2 transition hover:text-[#f2b46d]"><Instagram size={14} /> Follow the room</a></div></div><div className="flex flex-col justify-between gap-3 pt-6 font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#716760] md:flex-row"><span>بيانكو · Bianco · Madinah</span><span data-testid="text-footer-hours">12 PM — 2 AM · Every day</span><span>© {new Date().getFullYear()} Bianco</span></div></div>
      </footer>

      <AnimatePresence>{cartOpen && <CartDrawer cart={cart} subtotal={subtotal} onClose={() => setCartOpen(false)} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} />}</AnimatePresence>
      <AnimatePresence>{selectedProduct && <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={addToCart} />}</AnimatePresence>
      <a href={`tel:${phoneNumber.replace(/\s/g, '')}`} data-testid="link-mobile-call" className="fixed bottom-4 right-4 z-30 flex items-center gap-2 bg-[#e8c78e] px-4 py-3 text-[10px] font-semibold uppercase tracking-[.12em] text-[#171513] shadow-xl md:hidden"><Phone size={14} /> Call Bianco</a>
    </main>
  );
}

function Router() {
  return (
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