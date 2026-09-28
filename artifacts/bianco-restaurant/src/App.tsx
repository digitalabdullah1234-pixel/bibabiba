import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import {
  ArrowUpRight,
  ChevronDown,
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
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { trackEvent } from '@/lib/analytics';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

const listingUrl = 'https://maps.app.goo.gl/X1aurWpXUuXSdWzP8';
const mapsEmbed = 'https://www.google.com/maps?q=Abo+Bakr+Al+Siddiq,+Al+Qiblatayn,+Madinah+42351,+Saudi+Arabia&output=embed';
const mapsPhoto = 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWm83Up9qihXIoG9ZDosn8hLq66NWL-kPgGwdvkhmeY-sVYhuOrIQsgIcjzy2SthVYGTLZhRPQvYsAgEoTvVYM3MlMgOl5lptxb7toRNIQFDKDr22Whd_142fiUJQU9n4n4oCyKQ6OpHFrw=w1200-h800-k-no';
const mapsPhotoPortrait = 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmP0e7c4hB3BZ9VRFsuiAG71wFetpD92S1nxkBJ6XJfp9aZ8UIXKt8S3c8u0MFGFubnoV9q7C4YZXWjlNAw8R_P6flmlQPQnYWVKjV0BVbUBwqEPNDIu9-uhVC0H4DAu6dDfsmQ67yATLHF=w900-h1200-k-no';
const heroImage = `${import.meta.env.BASE_URL}bianco-interior-hero.jpg`;
const loadingHandImage = `${import.meta.env.BASE_URL}bianco-sabar-hand.png`;
const phoneNumber = '+966 55 994 9069';
const whatsappNumber = '966559949069';
const menuPath = '#order';

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

type MenuHighlight = {
  id: string;
  name: string;
  arabicName: string;
  category: string;
  arabicCategory: string;
  image: string;
};

type CartLine = {
  product: Product;
  quantity: number;
};

type Locale = 'en' | 'ar';
type Translate = (key: string) => string;

const ui: Record<Locale, Record<string, string>> = {
  en: {
    madinah: 'Madinah', menu: 'Menu', energy: 'The Bianco energy', findUs: 'Find us', maps: 'Maps',
    reserve: 'Reserve a table', callForTable: 'Call for a table', bag: 'Your bag', closeMenu: 'Close menu', openMenu: 'Open menu',
    openCart: 'Open cart with {count} items', location: 'Al Qiblatayn, Madinah', terrace: 'Terrace & dining room',
    dailyHours: 'Daily 12 PM — 2 AM', cuisine: 'Cucina Italiana', heroHello: 'Buonasera,', heroCity: 'Madinah.',
    heroFooterLeft: 'Italian dining · Madinah', heroFooterCenter: 'Open daily', heroFooterRight: '12 PM — 2 AM',
    heroDescription: 'Pizza, pasta, and long Italian dinners, on the terrace or in the dining room. Tables are reserved by phone.',
    viewMenu: 'View the menu', reservationsPhone: 'Reservations by phone', addOrder: 'Add to order',
    menuGalleryLabel: '01 — From the menu', menuGalleryTitle: 'Made to be seen.', menuGalleryText: 'A few plates from our Italian kitchen. Keep scrolling — there is more to come.',
    cartEyebrow: 'Your table, to go', cartTitle: 'Your order', closeCart: 'Close cart',
    emptyTitle: 'Nothing on the table yet.', emptyText: 'Add a signature, a little something to share, and we will get it moving.',
    browseMenu: 'Browse the menu', itemsDelivery: 'items · for pickup or delivery', estimatedSubtotal: 'Estimated subtotal',
    whatsappOrder: 'Order via WhatsApp', preferCall: 'Prefer to call?', kitchen: 'From the Bianco kitchen',
    closeDetails: 'Close product details', reservationText: 'Call with your party size and preferred time to check availability and confirm your reservation with our team.',
    call: 'Call', openDaily: 'Open daily · 12 PM — 2 AM', shopMenu: '02 — The Bianco menu',
    chooseYour: 'Made for', damage: 'long evenings.', menuIntro: 'A few favourites from the Bianco table. Find your dish, then add it to your order.',
    emptyNow: 'Empty for now.', emptySummary: 'Add a plate and we’ll keep your order here while you browse.',
    more: 'more', subtotal: 'Subtotal', reviewCheckout: 'Review & checkout', secureWhatsapp: 'Checkout securely via WhatsApp',
    prices: 'Prices in Saudi Riyal · pickup or delivery', fullBag: 'Open full bag', energyLabel: '03 — The Bianco energy',
    trayOpen: 'Open tray', trayClose: 'Close tray', checkout: 'Checkout', selected: 'selected', tableOpen: 'Your table is open', addToTable: 'Add a plate and your table will hold it here.',
    storyHeadingA: 'Not a', storyHeadingB: 'quiet', storyHeadingC: 'room.',
    storyLead: 'Bianco means white. The evening is anything but.',
    storyBody: 'We built this Italian room for the in-between hours: the late dinner after a long day, the table that keeps ordering, the plate passed across the room without asking.',
    googleRating: 'Google rating', lastOrder: 'Last order', galleryLabel: '04 — Step inside', roomA: 'The', roomB: 'room.',
    galleryCaption: 'The glow, the clatter, the last forkful.', visitLabel: '05 — Come find us',
    doorA: 'The door', doorB: 'is open.', address: 'Abo Bakr Al Siddiq\nAl Qiblatayn, Madinah 42351\nSaudi Arabia',
    everyDay: 'Every day', googleMaps: 'Open in Google Maps', orderLoud: 'Order loud.', eatWell: 'Eat well.',
    whatsappKitchen: 'WhatsApp the kitchen', followRoom: 'Follow the room', footerHours: '12 PM — 2 AM · Every day',
    reservationEyebrow: 'Bianco, Madinah', mapArea: 'Al Qiblatayn', countryShort: 'KSA',
    heroAlt: "Bianco's dining room viewed from above, with tall columns and hanging lights",
    pickupMessage: "Hello Bianco, I'd like to order:", estimatedTotal: 'Estimated total',
    emptyOrderMessage: 'Hello Bianco, I would like to place an order.', currency: 'SAR',
    remove: 'Remove', decrease: 'Decrease', increase: 'Increase',
    gallery0: 'Bianco dining room from the Google Maps listing', gallery1: 'A closer look inside Bianco',
    gallery2: 'The Bianco room after dark', gallery3: 'Warm details from the restaurant',
  },
  ar: {
    madinah: 'المدينة المنورة', menu: 'القائمة', energy: 'أجواء بيانكو', findUs: 'موقعنا', maps: 'الخرائط',
    reserve: 'احجز طاولة', callForTable: 'اتصل لحجز طاولة', bag: 'طلبك', closeMenu: 'إغلاق القائمة', openMenu: 'فتح القائمة',
    openCart: 'فتح السلة وبها {count} عناصر', location: 'القبلتين، المدينة المنورة', terrace: 'التراس وصالة الطعام',
    dailyHours: 'يومياً 12 ظهراً — 2 صباحاً', cuisine: 'مطبخ إيطالي', heroHello: 'مساء الخير،', heroCity: 'المدينة.',
    heroFooterLeft: 'تجربة إيطالية · المدينة', heroFooterCenter: 'مفتوح يومياً', heroFooterRight: '12 ظهراً — 2 صباحاً',
    heroDescription: 'بيتزا وباستا وعشاء إيطالي طويل، في التراس أو صالة الطعام. الحجز عبر الهاتف.',
    viewMenu: 'شاهد القائمة', reservationsPhone: 'الحجز عبر الهاتف', addOrder: 'أضف إلى الطلب',
    menuGalleryLabel: '01 — من القائمة', menuGalleryTitle: 'أطباق تستحق أن تُرى.', menuGalleryText: 'مختارات من مطبخنا الإيطالي. واصل التمرير — هناك المزيد.',
    cartEyebrow: 'مائدتك، أينما كنت', cartTitle: 'طلبك', closeCart: 'إغلاق السلة',
    emptyTitle: 'مائدتك فارغة حتى الآن.', emptyText: 'أضف طبقاً مميزاً أو شيئاً للمشاركة وسنتولى الباقي.',
    browseMenu: 'تصفح القائمة', itemsDelivery: 'عناصر · للاستلام أو التوصيل', estimatedSubtotal: 'المجموع التقديري',
    whatsappOrder: 'اطلب عبر واتساب', preferCall: 'تفضل الاتصال؟', kitchen: 'من مطبخ بيانكو',
    closeDetails: 'إغلاق تفاصيل الطبق', reservationText: 'اتصل بنا مع عدد الضيوف والوقت المفضل للتحقق من التوفر وتأكيد حجزك مع فريقنا.',
    call: 'اتصل', openDaily: 'مفتوح يومياً · 12 ظهراً — 2 صباحاً', shopMenu: '02 — قائمة بيانكو',
    chooseYour: 'نكهاتٌ تُحكى', damage: 'على مهل.', menuIntro: 'أطباق مختارة من مائدة بيانكو. اختر طبقك وأضفه إلى طلبك.',
    emptyNow: 'فارغة الآن.', emptySummary: 'أضف طبقاً وسنحتفظ بطلبك هنا أثناء التصفح.',
    more: 'إضافية', subtotal: 'المجموع', reviewCheckout: 'راجع وأكمل الطلب', secureWhatsapp: 'إتمام الطلب بأمان عبر واتساب',
    prices: 'الأسعار بالريال السعودي · استلام أو توصيل', fullBag: 'افتح السلة كاملة', energyLabel: '03 — أجواء بيانكو',
    trayOpen: 'افتح مائدتك', trayClose: 'أغلق مائدتك', checkout: 'إتمام الطلب', selected: 'مختارة', tableOpen: 'مائدتك مفتوحة', addToTable: 'أضف طبقاً وسنحتفظ به هنا أثناء التصفح.',
    storyHeadingA: 'ليست', storyHeadingB: 'هادئة', storyHeadingC: 'هذه الصالة.',
    storyLead: 'بيانكو تعني الأبيض، لكن المساء هنا مليء بالألوان.',
    storyBody: 'صممنا هذه الصالة الإيطالية لساعات المساء: عشاء متأخر بعد يوم طويل، مائدة تستمر في الطلب، وطبق يمر بين الأصدقاء بلا تكلف.',
    googleRating: 'تقييم جوجل', lastOrder: 'آخر طلب', galleryLabel: '04 — ادخل إلى عالمنا', roomA: 'هذه', roomB: 'الصالة.',
    galleryCaption: 'الضوء الدافئ، صوت المكان، واللقمة الأخيرة.', visitLabel: '05 — تفضل بزيارتنا',
    doorA: 'الباب', doorB: 'مفتوح.', address: 'طريق أبو بكر الصديق\nالقبلتين، المدينة المنورة 42351\nالمملكة العربية السعودية',
    everyDay: 'كل يوم', googleMaps: 'افتح في خرائط جوجل', orderLoud: 'اطلب بشغف.', eatWell: 'وكل جيداً.',
    whatsappKitchen: 'راسل المطبخ عبر واتساب', followRoom: 'تابع أجواءنا', footerHours: '12 ظهراً — 2 صباحاً · يومياً',
    reservationEyebrow: 'بيانكو، المدينة المنورة', mapArea: 'القبلتين', countryShort: 'السعودية',
    heroAlt: 'صالة بيانكو من الأعلى بأعمدتها الطويلة وإضاءتها المعلقة',
    pickupMessage: 'مرحباً بيانكو، أود طلب:', estimatedTotal: 'المجموع التقديري',
    emptyOrderMessage: 'مرحباً بيانكو، أود تقديم طلب.', currency: 'ر.س',
    remove: 'حذف', decrease: 'تقليل', increase: 'زيادة',
    gallery0: 'صالة بيانكو من صور خرائط جوجل', gallery1: 'نظرة أقرب داخل بيانكو',
    gallery2: 'صالة بيانكو في المساء', gallery3: 'تفاصيل دافئة من المطعم',
  },
};

const productArabic: Record<string, Pick<Product, 'name' | 'description' | 'category' | 'note'>> = {
  'pizza-ajwa': { name: 'بيتزا عجوة', description: 'طماطم مشوية، فيور دي لاتيه، عجوة المدينة، ولمسة هادئة من الفلفل الحار.', category: 'الأطباق المميزة', note: 'طبقنا المميز' },
  'rose-pasta': { name: 'باستا روزيه', description: 'صلصة روزيه ناعمة، زيت الريحان، بارميزان، ولمسة حرارة في النهاية.', category: 'باستا', note: 'الأكثر طلباً' },
  margherita: { name: 'مارغريتا', description: 'طماطم سان مارزانو، موزاريلا، ريحان، وزيت زيتون على عجينة محمصة.', category: 'بيتزا', note: 'كلاسيكية بإتقان' },
  'truffle-mushroom': { name: 'بيتزا الفطر والكمأة', description: 'فطر مشوي، فونتينا، كمأة سوداء، وزعتر على عجينة مقرمشة.', category: 'بيتزا', note: 'للسهرات الطويلة' },
  'burrata-tomato': { name: 'بوراتا وطماطم', description: 'بوراتا كريمية، طماطم ناضجة، ريحان، وبلسميك معتق.', category: 'المقبلات', note: 'ابدأ من هنا' },
  tiramisu: { name: 'تيراميسو', description: 'كريمة ماسكاربوني، بسكويت منقوع بالإسبريسو، وكاكاو.', category: 'الحلويات', note: 'الختام المثالي' },
};

function productText(product: Product, locale: Locale) {
  return locale === 'ar' ? productArabic[product.id] ?? product : product;
}

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
    image: `${import.meta.env.BASE_URL}menu-dishes/penne-rose.png`,
    imagePosition: 'center center',
    note: 'Best seller',
  },
  {
    id: 'margherita',
    name: 'Margherita',
    price: 42,
    description: 'San Marzano tomato, mozzarella, basil, and olive oil on a blistered base.',
    category: 'Pizza',
    image: `${import.meta.env.BASE_URL}menu-dishes/margherita-pizza.png`,
    imagePosition: 'center center',
    note: 'A classic, sharpened',
  },
  {
    id: 'truffle-mushroom',
    name: 'Truffle Mushroom',
    price: 58,
    description: 'Roasted mushrooms, fontina, black truffle, and thyme over crisp dough.',
    category: 'Pizza',
    image: `${import.meta.env.BASE_URL}menu-dishes/truffle-pizza.png`,
    imagePosition: 'center center',
    note: 'For late nights',
  },
  {
    id: 'burrata-tomato',
    name: 'Burrata & Tomato',
    price: 36,
    description: 'Creamy burrata, ripe tomato, basil, and aged balsamic.',
    category: 'Starters',
    image: `${import.meta.env.BASE_URL}menu-dishes/burrata-salad.png`,
    imagePosition: 'center center',
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

const menuHighlights: MenuHighlight[] = [
  { id: 'mushroom-soup', name: 'Mushroom soup', arabicName: 'شوربة الفطر', category: 'Entrée', arabicCategory: 'المقبلات', image: `${import.meta.env.BASE_URL}menu-dishes/mushroom-soup.png` },
  { id: 'arancini', name: 'Arancini', arabicName: 'أرانشيني', category: 'Entrée', arabicCategory: 'المقبلات', image: `${import.meta.env.BASE_URL}menu-dishes/arancini.png` },
  { id: 'chili-shrimp', name: 'Chili shrimp', arabicName: 'تشيلي شرمب', category: 'Entrée', arabicCategory: 'المقبلات', image: `${import.meta.env.BASE_URL}menu-dishes/chili-shrimp.png` },
  { id: 'french-fries', name: 'French fries', arabicName: 'بطاطس مقلية', category: 'Entrée', arabicCategory: 'المقبلات', image: `${import.meta.env.BASE_URL}menu-dishes/french-fries.png` },
  { id: 'burrata-salad', name: 'Burrata Salad', arabicName: 'سلطة البوراتا', category: 'Insalate', arabicCategory: 'السلطات', image: `${import.meta.env.BASE_URL}menu-dishes/burrata-salad.png` },
  { id: 'bianco-salad', name: 'Bianco Salad', arabicName: 'سلطة بيانكو', category: 'Insalate', arabicCategory: 'السلطات', image: `${import.meta.env.BASE_URL}menu-dishes/bianco-salad.png` },
  { id: 'portobello-shrimp-salad', name: 'Portobello Shrimp Salad', arabicName: 'سلطة البورتوبيلو شرمب', category: 'Insalate', arabicCategory: 'السلطات', image: `${import.meta.env.BASE_URL}menu-dishes/portobello-shrimp-salad.jpg` },
  { id: 'margherita-pizza', name: 'Margherita Pizza', arabicName: 'بيتزا مارجريتا', category: 'Pizzeria', arabicCategory: 'بيتزا', image: `${import.meta.env.BASE_URL}menu-dishes/margherita-pizza.png` },
  { id: 'diavola-pizza', name: 'Diavola Pizza', arabicName: 'بيتزا ديافولا', category: 'Pizzeria', arabicCategory: 'بيتزا', image: `${import.meta.env.BASE_URL}menu-dishes/diavola-pizza.png` },
  { id: 'beef-bianco-pizza', name: 'Beef Bianco Pizza', arabicName: 'بيتزا بيف بيانكو', category: 'Pizzeria', arabicCategory: 'بيتزا', image: `${import.meta.env.BASE_URL}menu-dishes/beef-bianco-pizza.png` },
  { id: 'chicken-polo-pizza', name: 'Chicken Polo Pizza', arabicName: 'بيتزا تشكن بولو', category: 'Pizzeria', arabicCategory: 'بيتزا', image: `${import.meta.env.BASE_URL}menu-dishes/chicken-polo-pizza.png` },
  { id: 'truffle-pizza', name: 'Truffle Pizza', arabicName: 'بيتزا ترافل', category: 'Pizzeria', arabicCategory: 'بيتزا', image: `${import.meta.env.BASE_URL}menu-dishes/truffle-pizza.png` },
  { id: 'seafood-spaghetti', name: 'Seafood Spaghetti', arabicName: 'اسباغيتي سي فود', category: 'Pasta', arabicCategory: 'باستا', image: `${import.meta.env.BASE_URL}menu-dishes/seafood-spaghetti.png` },
  { id: 'penne-rose', name: 'Penne Rosé', arabicName: 'بيني روز', category: 'Pasta', arabicCategory: 'باستا', image: `${import.meta.env.BASE_URL}menu-dishes/penne-rose.png` },
  { id: 'rigatoni-pesto', name: 'Rigatoni Pesto', arabicName: 'ريجاتوني بيستو', category: 'Pasta', arabicCategory: 'باستا', image: `${import.meta.env.BASE_URL}menu-dishes/rigatoni-pesto.png` },
  { id: 'funghi-risotto', name: 'Funghi Risotto', arabicName: 'ريزوتو فونجي', category: 'Pasta', arabicCategory: 'باستا', image: `${import.meta.env.BASE_URL}menu-dishes/funghi-risotto.png` },
  { id: 'truffle-fettuccine', name: 'Truffle Fettuccine', arabicName: 'فيتوتشيني ترافل', category: 'Pasta', arabicCategory: 'باستا', image: `${import.meta.env.BASE_URL}menu-dishes/truffle-fettuccine.png` },
  { id: 'beef-bianco', name: 'Beef Bianco', arabicName: 'بيف بيانكو', category: 'Main Courses', arabicCategory: 'الأطباق الرئيسية', image: `${import.meta.env.BASE_URL}menu-dishes/beef-bianco.png` },
  { id: 'grilled-salmon', name: 'Grilled Salmon', arabicName: 'جرلد سالمون', category: 'Main Courses', arabicCategory: 'الأطباق الرئيسية', image: `${import.meta.env.BASE_URL}menu-dishes/grilled-salmon.png` },
];

const gallery = [
  { src: mapsPhoto, altKey: 'gallery0', className: 'md:col-span-2 md:row-span-2' },
  { src: mapsPhotoPortrait, altKey: 'gallery1', className: '' },
  { src: mapsPhoto, altKey: 'gallery2', className: '' },
  { src: mapsPhotoPortrait, altKey: 'gallery3', className: 'md:col-span-2' },
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

function formatPrice(value: number, locale: Locale) {
  return locale === 'ar' ? `${new Intl.NumberFormat('ar-SA').format(value)} ر.س` : `${value} SAR`;
}

function ProductCard({
  product,
  onAdd,
  onDetails,
  locale,
  t,
}: {
  product: Product;
  onAdd: (product: Product) => void;
  onDetails: (product: Product) => void;
  locale: Locale;
  t: Translate;
}) {
  const text = productText(product, locale);
  const isDishPhoto = product.image.includes('/menu-dishes/');
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      whileHover={{ y: -7 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      data-testid={`card-product-${product.id}`}
      className="product-card group relative flex min-w-0 flex-col overflow-hidden border border-[#2e2924]/15 bg-[#fbf1df] text-[#241b17] shadow-[0_16px_36px_rgba(38,18,12,.12)]"
    >
      <button type="button" onClick={() => { trackEvent('product_viewed', { product_id: product.id, product_name: product.name, category: product.category }); onDetails(product); }} data-testid={`button-details-${product.id}`} className="focus-ring relative block aspect-[1.42] w-full overflow-hidden text-start">
        {isDishPhoto ? (
          <img src={product.image} alt={text.name} loading="lazy" style={{ objectPosition: product.imagePosition }} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        ) : (
          <div className="menu-card-placeholder h-full w-full px-6 py-5" aria-hidden="true">
            <span className="font-mono-ui text-[9px] uppercase tracking-[.22em] text-[#765044]">Bianco / Madinah</span>
            <span className="mt-10 block max-w-[11rem] font-display text-[2.15rem] leading-[.85] text-[#491d17]">{text.name}</span>
          </div>
        )}
        <div className={`absolute inset-0 ${isDishPhoto ? 'bg-[linear-gradient(180deg,rgba(15,14,13,0),rgba(15,14,13,.68))]' : 'bg-[linear-gradient(180deg,rgba(255,247,229,0),rgba(66,28,20,.08))]'}`} />
        <span className={`absolute start-4 top-4 border px-2.5 py-1 font-mono-ui text-[9px] uppercase tracking-[.16em] backdrop-blur-sm ${isDishPhoto ? 'border-[#f7dfb2]/60 bg-[#241310]/70 text-[#f7dfb2]' : 'border-[#6c3b2d]/25 bg-[#fff3de]/75 text-[#6c3b2d]'}`}>{text.category}</span>
        {isDishPhoto && <span className="absolute bottom-4 start-4 font-mono-ui text-[9px] uppercase tracking-[.15em] text-[#fff2df]/80">{text.note}</span>}
        <span className={`absolute bottom-4 end-4 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full border opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 ${isDishPhoto ? 'border-white/40 bg-[#fbf1df] text-[#271510]' : 'border-[#6c3b2d]/25 bg-[#fff3de] text-[#491d17]'}`}><ArrowUpRight size={13} /></span>
      </button>
      <div className="flex flex-1 flex-col justify-between p-5 md:p-5">
        <div>
          <div className="flex items-start justify-between gap-3 border-b border-[#6c3b2d]/15 pb-3">
            <h3 data-testid={`text-product-name-${product.id}`} className="max-w-[12rem] font-display text-[1.85rem] leading-[.88] tracking-[-.025em] text-[#3a211b]">{text.name}</h3>
            <motion.span key={product.price} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} data-testid={`text-product-price-${product.id}`} className="whitespace-nowrap pt-1 font-mono-ui text-[10px] text-[#9b4f2b]">{formatPrice(product.price, locale)}</motion.span>
          </div>
          <p data-testid={`text-product-description-${product.id}`} className="mt-4 max-w-[28rem] text-[13px] leading-[1.55] text-[#765b4e]">{text.description}</p>
        </div>
        <button type="button" onClick={() => onAdd(product)} data-testid={`button-add-${product.id}`} className="focus-ring mt-6 flex w-full items-center justify-between border-t border-[#6c3b2d]/20 pt-4 text-left text-[10px] font-semibold uppercase tracking-[.16em] text-[#5e291f] transition-colors hover:text-[#a34e2e]">
          <span>{t('addOrder')}</span><span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#9b4f2b]/35"><Plus size={14} strokeWidth={1.5} /></span>
        </button>
      </div>
    </motion.article>
  );
}

function MenuHighlights({ locale, t }: { locale: Locale; t: Translate }) {
  const isArabic = locale === 'ar';
  const repeatedDishes = [...menuHighlights, ...menuHighlights];

  return (
    <section aria-labelledby="menu-highlights-heading" className="menu-highlights overflow-hidden border-y border-[#f5eee2]/15 bg-[#530F0C]">
      <div className="mx-auto max-w-[1440px] px-5 py-14 md:px-10 md:py-16">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono-ui text-[9px] uppercase tracking-[.25em] text-[#f2b46d]">{t('menuGalleryLabel')}</p>
            <h2 id="menu-highlights-heading" className="mt-4 max-w-[560px] font-display text-5xl leading-[.84] tracking-[-.05em] text-[#fff2df] md:text-7xl">{t('menuGalleryTitle')}</h2>
          </div>
          <p className="max-w-[330px] text-sm leading-relaxed text-[#f4c6ae]">{t('menuGalleryText')}</p>
        </div>
      </div>

      <div className="menu-highlights-window border-y border-[#f5eee2]/15 py-5" aria-label={t('menuGalleryTitle')}>
        <div className="menu-highlights-track flex w-max gap-4 px-5">
          {repeatedDishes.map((dish, index) => {
            const dishName = isArabic ? dish.arabicName : dish.name;
            const category = isArabic ? dish.arabicCategory : dish.category;
            return (
              <figure key={`${dish.id}-${index}`} className="menu-highlight-card group relative w-[230px] shrink-0 overflow-hidden border border-[#f5eee2]/20 bg-[#420b09] md:w-[280px]">
                <div className="aspect-[1.18] overflow-hidden">
                  <img src={dish.image} alt={dishName} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#210604]/85 via-transparent to-transparent" />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 p-4 text-[#fff2df]">
                  <p className="font-mono-ui text-[8px] uppercase tracking-[.17em] text-[#f2b46d]">{category}</p>
                  <p className="mt-1 font-display text-[1.65rem] leading-none">{dishName}</p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CartDrawer({
  cart,
  subtotal,
  onClose,
  onUpdateQuantity,
  onRemove,
  locale,
  t,
}: {
  cart: CartLine[];
  subtotal: number;
  onClose: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  locale: Locale;
  t: Translate;
}) {
  const orderMessage = cart.length
    ? `${t('pickupMessage')}\n${cart.map(({ product, quantity }) => `${quantity} × ${productText(product, locale).name}`).join('\n')}\n${t('estimatedTotal')}: ${formatPrice(subtotal, locale)}`
    : t('emptyOrderMessage');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderMessage)}`;
  const drawerX = locale === 'ar' ? '-100%' : '100%';

  return (
    <AnimatePresence>
      <motion.div key="cart-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-[#080706]/75 backdrop-blur-[3px]" onClick={onClose} data-testid="overlay-cart" />
      <motion.aside key="cart-panel" initial={{ x: drawerX }} animate={{ x: 0 }} exit={{ x: drawerX }} transition={{ type: 'spring', damping: 30, stiffness: 260 }} onClick={(event) => event.stopPropagation()} data-testid="panel-cart" className={`fixed inset-y-0 z-[70] flex w-full max-w-[475px] flex-col bg-[#1a1210] text-[#f5eee2] shadow-2xl ${locale === 'ar' ? 'left-0 border-r border-white/[.13]' : 'right-0 border-l border-white/[.13]'}`}>
        <div className="flex items-center justify-between border-b border-white/[.12] px-5 py-5 md:px-7">
          <div><p className="font-mono-ui text-[9px] uppercase tracking-[.22em] text-[#f2b46d]">{t('cartEyebrow')}</p><h2 data-testid="text-cart-heading" className="mt-1 font-display text-4xl leading-none">{t('cartTitle')}</h2></div>
          <button type="button" onClick={onClose} aria-label={t('closeCart')} data-testid="button-close-cart" className="focus-ring rounded-full border border-white/15 p-2.5 text-[#c4b7a9] transition hover:border-[#f2b46d] hover:text-[#f2b46d]"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5 md:px-7">
          {cart.length === 0 ? (
              <div data-testid="empty-cart" className="flex min-h-[52vh] flex-col items-center justify-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#f2b46d]/35 text-[#f2b46d]"><ShoppingBag size={24} strokeWidth={1.2} /></div>
              <p className="font-display text-3xl">{t('emptyTitle')}</p>
              <p className="mt-3 max-w-[250px] text-sm leading-relaxed text-[#a9a097]">{t('emptyText')}</p>
              <button type="button" onClick={onClose} data-testid="button-empty-cart-browse" className="mt-8 border-b border-[#e8c78e] pb-1 font-mono-ui text-[10px] uppercase tracking-[.18em] text-[#e8c78e]">{t('browseMenu')}</button>
            </div>
          ) : (
            <div className="space-y-1">
              <p data-testid="text-cart-count" className="mb-5 font-mono-ui text-[10px] uppercase tracking-[.16em] text-[#a9a097]">{cart.reduce((sum, line) => sum + line.quantity, 0)} {t('itemsDelivery')}</p>
              {cart.map(({ product, quantity }) => (
                <motion.div layout key={product.id} data-testid={`row-cart-${product.id}`} className="flex gap-4 border-t border-white/[.11] py-5">
                  {product.image.includes('/menu-dishes/') ? <img src={product.image} alt="" className="h-20 w-20 shrink-0 object-cover opacity-80" style={{ objectPosition: product.imagePosition }} /> : <div className="menu-card-placeholder h-20 w-20 shrink-0" aria-hidden="true" />}
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-3"><p className="font-display text-2xl leading-none">{productText(product, locale).name}</p><button type="button" onClick={() => onRemove(product.id)} aria-label={`${t('remove')} ${productText(product, locale).name}`} data-testid={`button-remove-${product.id}`} className="text-[#8f867c] transition hover:text-[#e8c78e]"><Trash2 size={15} /></button></div>
                    <p className="mt-2 font-mono-ui text-[10px] text-[#e8c78e]">{formatPrice(product.price, locale)}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center border border-white/[.16]">
                        <button type="button" onClick={() => onUpdateQuantity(product.id, -1)} aria-label={`${t('decrease')} ${productText(product, locale).name}`} data-testid={`button-decrease-${product.id}`} className="p-2 text-[#c6bdb2] transition hover:text-[#e8c78e]"><Minus size={13} /></button>
                        <motion.span key={quantity} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} data-testid={`text-quantity-${product.id}`} className="min-w-8 text-center font-mono-ui text-[11px]">{quantity}</motion.span>
                        <button type="button" onClick={() => onUpdateQuantity(product.id, 1)} aria-label={`${t('increase')} ${productText(product, locale).name}`} data-testid={`button-increase-${product.id}`} className="p-2 text-[#c6bdb2] transition hover:text-[#e8c78e]"><Plus size={13} /></button>
                      </div>
                      <span data-testid={`text-line-total-${product.id}`} className="font-mono-ui text-[11px] text-[#efe8dc]">{formatPrice(product.price * quantity, locale)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-white/[.12] bg-[#1c1917] px-5 py-5 md:px-7">
          <div className="flex items-center justify-between"><span className="font-mono-ui text-[10px] uppercase tracking-[.16em] text-[#a9a097]">{t('estimatedSubtotal')}</span><motion.span key={subtotal} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} data-testid="text-cart-subtotal" className="font-display text-3xl">{formatPrice(subtotal, locale)}</motion.span></div>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" onClick={() => { if (cart.length > 0) trackEvent('checkout_intent', { method: 'whatsapp', item_count: cart.reduce((sum, line) => sum + line.quantity, 0), subtotal }); }} data-testid="link-checkout-whatsapp" className={`mt-5 flex items-center justify-between bg-[#e8c78e] px-5 py-4 text-[11px] font-semibold uppercase tracking-[.14em] text-[#171513] transition hover:bg-[#f0d7a9] ${cart.length === 0 ? 'pointer-events-none opacity-40' : ''}`}><span>{t('whatsappOrder')}</span><ArrowUpRight size={16} /></a>
          <a href={`tel:${phoneNumber.replace(/\s/g, '')}`} onClick={() => trackEvent('phone_order_intent', { item_count: cart.reduce((sum, line) => sum + line.quantity, 0), subtotal })} data-testid="link-checkout-call" className="mt-3 flex items-center justify-center gap-2 py-2 text-[10px] uppercase tracking-[.15em] text-[#a9a097] transition hover:text-[#e8c78e]"><Phone size={13} /> {t('preferCall')} {phoneNumber}</a>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}

function ProductDetailModal({ product, onClose, onAdd, locale, t }: { product: Product; onClose: () => void; onAdd: (product: Product) => void; locale: Locale; t: Translate }) {
  const text = productText(product, locale);
  const isDishPhoto = product.image.includes('/menu-dishes/');
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[80] flex items-center justify-center bg-[#080706]/80 p-4 backdrop-blur-sm" data-testid="modal-product-backdrop">
        <motion.div initial={{ opacity: 0, y: 22, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }} onClick={(event) => event.stopPropagation()} className="relative grid w-full max-w-[880px] overflow-hidden border border-white/[.14] bg-[#1a1816] md:grid-cols-[.9fr_1.1fr]" data-testid={`modal-product-${product.id}`}>
          <div className="relative min-h-[290px] md:min-h-[520px]">{isDishPhoto ? <img src={product.image} alt={text.name} className="absolute inset-0 h-full w-full object-cover opacity-80" style={{ objectPosition: product.imagePosition }} /> : <div className="menu-card-placeholder absolute inset-0 p-6"><span className="font-mono-ui text-[9px] uppercase tracking-[.22em] text-[#765044]">Bianco / in the room</span><span className="mt-10 block max-w-[12rem] font-display text-5xl leading-[.85] text-[#491d17]">{text.name}</span></div>}<div className="absolute inset-0 bg-gradient-to-t from-[#171513] via-transparent to-transparent" /><span className="absolute bottom-5 start-5 font-mono-ui text-[9px] uppercase tracking-[.18em] text-[#e8c78e]">{text.category} · {text.note}</span></div>
          <div className="flex flex-col justify-between p-6 md:p-10"><button type="button" onClick={onClose} aria-label={t('closeDetails')} data-testid="button-close-product-modal" className="absolute end-4 top-4 rounded-full border border-white/15 p-2 text-[#c6bdb2] transition hover:border-[#e8c78e] hover:text-[#e8c78e]"><X size={17} /></button><div><p className="font-mono-ui text-[10px] uppercase tracking-[.22em] text-[#e8c78e]">{t('kitchen')}</p><h2 data-testid={`text-modal-name-${product.id}`} className="mt-5 max-w-[380px] font-display text-6xl leading-[.88] tracking-[-.03em] text-[#efe8dc]">{text.name}</h2><p data-testid={`text-modal-description-${product.id}`} className="mt-7 max-w-[390px] text-base leading-relaxed text-[#b8afa5]">{text.description}</p></div><div className="mt-12"><p data-testid={`text-modal-price-${product.id}`} className="font-mono-ui text-xs text-[#e8c78e]">{formatPrice(product.price, locale)}</p><button type="button" onClick={() => { onAdd(product); onClose(); }} data-testid={`button-modal-add-${product.id}`} className="mt-5 flex w-full items-center justify-between bg-[#e8c78e] px-5 py-4 text-[11px] font-semibold uppercase tracking-[.16em] text-[#171513] transition hover:bg-[#f0d7a9]"><span>{t('addOrder')}</span><Plus size={16} /></button></div></div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ReservationDialog({ open, onOpenChange, t }: { open: boolean; onOpenChange: (open: boolean) => void; t: Translate }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-reservation" className="reserve-dialog w-[calc(100%-2rem)] max-w-[430px] gap-0 rounded-none border border-white/25 bg-[#530F0C] p-3 text-white shadow-[0_40px_120px_rgba(0,0,0,.6)] sm:rounded-none">
        <div className="relative border border-white/[.18] px-6 py-9 text-center sm:px-9 sm:py-11">
          <span aria-hidden="true" className="quiet-hero-corner -left-[5px] -top-[5px]" />
          <span aria-hidden="true" className="quiet-hero-corner -right-[5px] -top-[5px]" />
          <span aria-hidden="true" className="quiet-hero-corner -bottom-[5px] -left-[5px]" />
          <span aria-hidden="true" className="quiet-hero-corner -bottom-[5px] -right-[5px]" />
          <p className="quiet-hero-serif text-[.64rem] uppercase tracking-[.4em] text-white/70">{t('reservationEyebrow')}</p>
          <DialogTitle data-testid="text-reservation-heading" className="quiet-hero-serif mt-4 text-[2.6rem] font-normal leading-[1] tracking-[-.01em] text-white">{t('reserve')}</DialogTitle>
          <div aria-hidden="true" className="quiet-hero-diamonds mt-6 flex items-center justify-center gap-4">
            <span className="quiet-hero-rule" /><span className="quiet-hero-diamond" /><span className="quiet-hero-diamond" /><span className="quiet-hero-diamond" /><span className="quiet-hero-rule" />
          </div>
          <DialogDescription data-testid="text-reservation-description" className="quiet-hero-serif mx-auto mt-6 max-w-[21rem] text-[1.08rem] leading-[1.6] text-white/85">{t('reservationText')}</DialogDescription>
          <a href={`tel:${phoneNumber.replace(/\s/g, '')}`} onClick={() => trackEvent('reservation_call_intent', { location: 'dialog' })} data-testid="link-reservation-call" className="quiet-hero-cta focus-ring mt-8 flex items-center justify-center gap-3 border border-white px-6 py-4 text-[.7rem] uppercase tracking-[.26em] text-white"><Phone size={14} strokeWidth={1.6} /> {t('call')} {phoneNumber}</a>
          <p className="quiet-hero-serif mt-6 text-[.62rem] uppercase tracking-[.3em] text-white/60">{t('openDaily')}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LoadingScreen({ progress }: { progress: number }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      role="status"
      aria-live="polite"
      aria-label={`Loading Bianco ${progress}%`}
      className="loading-screen fixed inset-0 z-[100] flex items-center justify-center px-6 text-[#fff2df]"
    >
      <div className="flex w-full max-w-[680px] flex-col items-center">
        <div className="loading-hand-frame">
          <img
            src={loadingHandImage}
            alt=""
            aria-hidden="true"
            className="loading-hand-base"
            draggable={false}
          />
          <div
            className="loading-hand-active"
            style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }}
            aria-hidden="true"
          >
            <img src={loadingHandImage} alt="" className="loading-hand-active-image" draggable={false} />
          </div>
        </div>
        <div className="mt-2 flex w-full max-w-[340px] items-center justify-between font-mono-ui text-[9px] uppercase tracking-[.3em] text-white/55">
          <span>Bianco</span>
          <span data-testid="text-loading-progress">{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
}

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [locale, setLocale] = useState<Locale>(() => new URLSearchParams(window.location.search).get('lang') === 'ar' || window.localStorage.getItem('bianco-locale') === 'ar' ? 'ar' : 'en');
  const [menuOpen, setMenuOpen] = useState(false);
  const [reservationOpen, setReservationOpen] = useState(false);
  const [trayOpen, setTrayOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [menuEntered, setMenuEntered] = useState(false);
  const [cart, setCart] = useState<CartLine[]>(() => {
    try {
      const saved = window.localStorage.getItem('bianco-cart');
      if (!saved) return [];
      return JSON.parse(saved) as CartLine[];
    } catch {
      return [];
    }
  });
  const t: Translate = (key) => ui[locale][key] ?? ui.en[key] ?? key;
  const isArabic = locale === 'ar';

  useEffect(() => {
    let progress = 0;
    let finishTimer: number | undefined;
    const progressTimer = window.setInterval(() => {
      progress = Math.min(100, progress + 2);
      setLoadProgress(progress);
      if (progress >= 100) {
        window.clearInterval(progressTimer);
        finishTimer = window.setTimeout(() => setIsLoading(false), 500);
      }
    }, 36);

    return () => {
      window.clearInterval(progressTimer);
      if (finishTimer) window.clearTimeout(finishTimer);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem('bianco-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    window.localStorage.setItem('bianco-locale', locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    return () => {
      document.documentElement.lang = 'en';
      document.documentElement.dir = 'ltr';
    };
  }, [locale, isArabic]);

  useEffect(() => {
    const menuSection = document.getElementById('order');
    if (!menuSection) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setMenuEntered(entry.isIntersecting);
        if (!entry.isIntersecting) setTrayOpen(false);
      },
      { rootMargin: '-18% 0px -42% 0px' },
    );
    observer.observe(menuSection);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isLoading || Boolean(selectedProduct) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isLoading, trayOpen, menuEntered, selectedProduct]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setTrayOpen(false);
        setSelectedProduct(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const filteredProducts = useMemo(() => selectedCategory === 'All' ? products : products.filter((product) => product.category === selectedCategory), [selectedCategory]);
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const orderMessage = cart.length
    ? `${t('pickupMessage')}\n${cart.map(({ product, quantity }) => `${quantity} × ${productText(product, locale).name}`).join('\n')}\n${t('estimatedTotal')}: ${formatPrice(subtotal, locale)}`
    : t('emptyOrderMessage');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderMessage)}`;

  const addToCart = (product: Product) => {
    setCart((current) => {
      const existing = current.find((line) => line.product.id === product.id);
      if (existing) return current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line);
      return [...current, { product, quantity: 1 }];
    });
    trackEvent('product_added_to_bag', { product_id: product.id, product_name: product.name, category: product.category, price: product.price });
    setTrayOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((current) => current.flatMap((line) => line.product.id === id ? (line.quantity + delta > 0 ? [{ ...line, quantity: line.quantity + delta }] : []) : [line]));
  };

  const removeFromCart = (id: string) => setCart((current) => current.filter((line) => line.product.id !== id));
  const closeMenu = () => setMenuOpen(false);
  const openReservation = (location: string) => {
    trackEvent('reservation_started', { location });
    setReservationOpen(true);
  };

  return (
    <>
      <AnimatePresence>{isLoading && <LoadingScreen progress={loadProgress} />}</AnimatePresence>
      <main dir={isArabic ? 'rtl' : 'ltr'} className={`grain min-h-[100dvh] bg-[#110d0c] text-[#f5eee2] ${isArabic ? 'locale-ar' : ''}`}>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/[.14] bg-[#530F0C]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-between px-5 md:px-10">
          <a href="#top" onClick={closeMenu} data-testid="link-logo" className="focus-ring flex items-center"><img src="/bianco-logo-transparent.png" alt="Bianco بيانكو" data-testid="img-logo-header" className="h-8 w-[112px] object-contain object-left" /></a>
          <nav className={`${menuOpen ? 'absolute left-0 right-0 top-[74px] flex flex-col border-b border-white/[.14] bg-[#530F0C] px-6 pb-7 pt-6' : 'hidden'} gap-6 text-[11px] uppercase tracking-[.2em] text-white/75 md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0`} aria-label={t('menu')}>
            <a href={menuPath} onClick={closeMenu} data-testid="link-nav-order" className="line-link transition hover:text-white">{t('menu')}</a>
            <a href="#story" onClick={closeMenu} data-testid="link-nav-story" className="line-link transition hover:text-white">{t('energy')}</a>
            <a href={listingUrl} target="_blank" rel="noreferrer" data-testid="link-nav-maps" className="line-link transition hover:text-white">{t('maps')} <ArrowUpRight className="ms-1 inline" size={12} /></a>
            <button type="button" onClick={() => { closeMenu(); openReservation('nav_mobile'); }} data-testid="button-nav-reserve-mobile" className="quiet-hero-cta focus-ring mt-2 flex items-center justify-between border border-white px-5 py-3.5 text-[.68rem] uppercase tracking-[.26em] text-white md:hidden"><span>{t('callForTable')}</span><Phone size={13} strokeWidth={1.6} /></button>
          </nav>
          <div className="flex items-center gap-2 md:gap-3">
            <button type="button" onClick={() => setLocale(isArabic ? 'en' : 'ar')} data-testid="button-language" aria-label={isArabic ? 'Switch to English' : 'التبديل إلى العربية'} className="focus-ring min-w-10 border border-white/35 px-2.5 py-2.5 text-center text-[.7rem] font-semibold text-white transition hover:border-white hover:bg-white/10">{isArabic ? 'EN' : 'عر'}</button>
            <button type="button" onClick={() => openReservation('nav')} data-testid="button-nav-reserve" className="quiet-hero-cta focus-ring hidden border border-white px-4 py-2.5 text-[.64rem] uppercase tracking-[.24em] text-white md:inline-flex">{t('reserve')}</button>
            <button type="button" onClick={() => { trackEvent('bag_opened', { item_count: cartCount }); setTrayOpen(true); document.getElementById('order')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} aria-label={t('openCart').replace('{count}', String(cartCount))} data-testid="button-open-cart" className="quiet-hero-bag focus-ring relative flex items-center gap-2 border border-white/40 px-3.5 py-2.5 text-[.64rem] uppercase tracking-[.2em] text-white"><ShoppingBag size={14} strokeWidth={1.6} /><span className="hidden sm:inline">{t('bag')}</span><AnimatePresence mode="popLayout"><motion.span key={cartCount} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 1, y: 0 }} data-testid="text-header-cart-count" className="min-w-4 text-center">{cartCount}</motion.span></AnimatePresence></button>
            <button type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? t('closeMenu') : t('openMenu')} data-testid="button-mobile-menu" className="focus-ring rounded-full p-2 text-white md:hidden">{menuOpen ? <X size={21} strokeWidth={1.5} /> : <Menu size={21} strokeWidth={1.5} />}</button>
          </div>
        </div>
      </header>

      <section id="top" className="quiet-hero relative isolate overflow-hidden border-b border-white/10">
        <img
          src={heroImage}
          alt={t('heroAlt')}
          data-testid="img-hero"
          fetchPriority="high"
          className="quiet-hero-photo absolute inset-0 h-full w-full object-cover"
        />
        <div aria-hidden="true" className="hero-photo-veil absolute inset-0" />
        <div aria-hidden="true" className="quiet-hero-shade absolute inset-0" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-[1440px] flex-col px-4 pt-[74px] sm:px-6 md:px-10">
          <div className="quiet-hero-frame relative my-4 flex flex-1 flex-col md:my-7">
            <span aria-hidden="true" className="quiet-hero-corner -left-[5px] -top-[5px]" />
            <span aria-hidden="true" className="quiet-hero-corner -right-[5px] -top-[5px]" />
            <span aria-hidden="true" className="quiet-hero-corner -bottom-[5px] -left-[5px]" />
            <span aria-hidden="true" className="quiet-hero-corner -bottom-[5px] -right-[5px]" />

            <div className="flex flex-1 flex-col items-center justify-center px-5 py-12 text-center md:py-16">
              <p data-testid="text-hero-eyebrow" className="quiet-hero-serif text-[.7rem] uppercase tracking-[.44em] text-white/85 md:text-[.78rem]">{t('cuisine')}</p>
              <h1 data-testid="text-hero-heading" className="quiet-hero-serif quiet-hero-headline mt-6 text-[clamp(3.1rem,10vw,7.6rem)] font-normal leading-[.98] tracking-[-.012em] text-white md:mt-8">
                {t('heroHello')}<br /><em className="font-normal italic text-[#FBF3E8]">{t('heroCity')}</em>
              </h1>
              <div aria-hidden="true" className="quiet-hero-diamonds mt-8 flex items-center justify-center gap-4 md:mt-10">
                <span className="quiet-hero-rule" /><span className="quiet-hero-diamond" /><span className="quiet-hero-diamond" /><span className="quiet-hero-diamond" /><span className="quiet-hero-rule" />
              </div>
              <p data-testid="text-hero-description" className="quiet-hero-serif mt-8 max-w-[33rem] text-[1.08rem] leading-[1.65] text-white/85 md:mt-10 md:text-[1.3rem]">{t('heroDescription')}</p>
              <div className="mt-10 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row sm:gap-7 md:mt-12">
                <button type="button" onClick={() => openReservation('hero')} data-testid="button-hero-reserve" className="quiet-hero-cta focus-ring inline-flex w-full items-center justify-center gap-3 border border-white bg-black/20 px-10 py-4 text-[.7rem] uppercase tracking-[.28em] text-white backdrop-blur-[2px] sm:w-auto">{t('callForTable')}</button>
                <a href={menuPath} onClick={() => trackEvent('order_started', { location: 'hero' })} data-testid="link-hero-order" className="quiet-hero-link focus-ring inline-flex items-center gap-2 py-2 text-[.7rem] uppercase tracking-[.28em] text-white/90">{t('viewMenu')} <ChevronRight size={13} strokeWidth={1.5} className="translate-y-px rotate-90" /></a>
              </div>
            </div>

            <div className="quiet-hero-serif flex items-center justify-between gap-3 border-t border-white/[.18] px-5 py-4 text-[.62rem] uppercase tracking-[.3em] text-white/70 md:px-8 md:text-[.68rem]">
              <span className="whitespace-nowrap">{t('heroFooterLeft')}</span>
              <span className="hidden whitespace-nowrap text-white/55 md:block">{t('heroFooterCenter')}</span>
              <span className="whitespace-nowrap">{t('heroFooterRight')}</span>
            </div>
          </div>
        </div>
      </section>

      <MenuHighlights locale={locale} t={t} />

      <section id="order" className="menu-section relative overflow-hidden bg-[#f1e5d2] px-5 py-16 text-[#2b1d19] md:px-10 md:py-24">
        <div aria-hidden="true" className="menu-section-stamp absolute end-[-2.5rem] top-10 hidden h-32 w-32 items-center justify-center rounded-full border border-[#8d4a32]/25 font-mono-ui text-[8px] uppercase tracking-[.2em] text-[#8d4a32] md:flex">Bianco<br />{t('madinah')}<br />{t('everyDay')}</div>
        <div className="mx-auto max-w-[1440px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger} className="grid gap-9 border-b border-[#63372b]/20 pb-8 md:grid-cols-[1.2fr_.8fr] md:items-end">
            <motion.div variants={reveal}>
              <div className="flex items-center gap-3 font-mono-ui text-[9px] uppercase tracking-[.25em] text-[#9b4f2b]"><span className="h-px w-8 bg-[#9b4f2b]/60" />{t('shopMenu')}</div>
              <h2 data-testid="text-menu-heading" className="mt-5 max-w-[680px] font-display text-[4.3rem] leading-[.78] tracking-[-.065em] text-[#351e19] sm:text-7xl md:text-8xl">{t('chooseYour')}<br /><em className="text-[#a64d2d]">{t('damage')}</em></h2>
            </motion.div>
            <motion.div variants={reveal} className="md:pb-1">
              <p className="max-w-[350px] text-[15px] leading-[1.55] text-[#67473c]">{t('menuIntro')}</p>
            </motion.div>
          </motion.div>
          <div className="menu-category-scroll mt-7 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label={t('menu')}>
            {categories.map((category) => (
              <button type="button" key={category} onClick={() => { trackEvent('menu_category_selected', { category }); setSelectedCategory(category); }} aria-selected={selectedCategory === category} data-testid={`button-category-${category.toLowerCase()}`} className={`focus-ring whitespace-nowrap border px-4 py-2.5 font-mono-ui text-[9px] font-bold uppercase tracking-[.17em] transition ${selectedCategory === category ? 'border-[#612c21] bg-[#612c21] text-[#f8ead6]' : 'border-[#754333]/25 text-[#754333] hover:border-[#9b4f2b] hover:text-[#9b4f2b]'}`}>{category === 'All' ? (isArabic ? 'الكل' : category) : (isArabic ? productArabic[products.find((p) => p.category === category)?.id ?? '']?.category ?? category : category)}</button>
            ))}
          </div>
          <div className="mt-8">
            <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} onDetails={setSelectedProduct} locale={locale} t={t} />)}</motion.div>
          </div>
          <div className="mt-9 flex flex-col gap-3 border-t border-[#63372b]/20 pt-5 text-[10px] uppercase tracking-[.14em] text-[#875546] sm:flex-row sm:items-center sm:justify-between">
            <span>{t('prices')}</span>
            <button type="button" onClick={() => setTrayOpen(true)} data-testid="button-review-order" className="flex items-center gap-2 text-[#8d4027] transition hover:text-[#b15832]">{t('fullBag')} <ChevronRight size={14} /></button>
          </div>
        </div>
      </section>

      <section id="story" className="border-y border-[#f5eee2]/10 bg-[#1a1210] px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-14 md:grid-cols-[.8fr_1.2fr] md:items-start">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}><motion.p variants={reveal} className="font-mono-ui text-[9px] uppercase tracking-[.25em] text-[#f2b46d]">{t('energyLabel')}</motion.p><motion.h2 variants={reveal} className="mt-5 max-w-[450px] font-display text-6xl leading-[.78] tracking-[-.06em] md:text-8xl">{t('storyHeadingA')}<br /><em className="text-[#e85d43]">{t('storyHeadingB')}</em> {t('storyHeadingC')}</motion.h2></motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-[620px] md:pt-16"><motion.p variants={reveal} className="text-2xl leading-[1.1] text-[#f5eee2] md:text-4xl">{t('storyLead')}</motion.p><motion.p variants={reveal} className="mt-8 max-w-[500px] text-base leading-relaxed text-[#9c8f84]">{t('storyBody')}</motion.p><motion.div variants={reveal} className="mt-12 grid grid-cols-2 gap-6 border-t border-[#f5eee2]/12 pt-5 sm:grid-cols-3"><div><p data-testid="text-rating" className="font-display text-4xl text-[#f2b46d]">4.4</p><p className="mt-1 font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#716760]">{t('googleRating')}</p></div><div><p data-testid="text-hours" className="font-display text-4xl text-[#f2b46d]">02:00</p><p className="mt-1 font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#716760]">{t('lastOrder')}</p></div><div><p data-testid="text-location" className="font-display text-4xl text-[#f2b46d]">{t('countryShort')}</p><p className="mt-1 font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#716760]">{t('madinah')}</p></div></motion.div></motion.div>
        </div>
      </section>

      <section id="gallery" className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
        <div className="mb-10 flex items-end justify-between gap-5"><div><p className="font-mono-ui text-[9px] uppercase tracking-[.25em] text-[#f2b46d]">{t('galleryLabel')}</p><h2 className="mt-4 font-display text-6xl leading-[.78] tracking-[-.06em] md:text-8xl">{t('roomA')}<br /><em className="text-[#e85d43]">{t('roomB')}</em></h2></div><p className="hidden max-w-[220px] text-end text-sm leading-relaxed text-[#716760] md:block">{t('galleryCaption')}</p></div>
        <div className="grid auto-rows-[220px] gap-3 md:grid-cols-4 md:auto-rows-[190px]">{gallery.map((image, i) => <motion.figure key={`${image.src}-${i}`} initial={{ opacity: 0, scale: .97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * .08, duration: .7 }} data-testid={`figure-gallery-${i}`} className={`group relative overflow-hidden border border-[#f5eee2]/10 ${image.className}`}><img src={image.src} alt={t(image.altKey)} data-testid={`img-gallery-${i}`} loading="lazy" className="h-full w-full object-cover opacity-70 grayscale-[.15] transition duration-700 group-hover:scale-105 group-hover:opacity-95 group-hover:grayscale-0" /><div className="absolute inset-0 bg-gradient-to-t from-[#110d0c]/80 to-transparent" /><figcaption className="absolute bottom-4 start-4 font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#f5eee2]/80">{t(image.altKey)}</figcaption></motion.figure>)}</div>
      </section>

      <section id="visit" className="border-t border-[#f5eee2]/10 bg-[#8d2d23] px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-14 md:grid-cols-[.9fr_1.1fr] md:items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}><motion.p variants={reveal} className="font-mono-ui text-[9px] uppercase tracking-[.25em] text-[#ffd097]">{t('visitLabel')}</motion.p><motion.h2 variants={reveal} className="mt-5 font-display text-6xl leading-[.78] tracking-[-.06em] text-[#fff2df] md:text-8xl">{t('doorA')}<br /><em>{t('doorB')}</em></motion.h2><motion.div variants={reveal} className="mt-10 space-y-5 text-sm leading-relaxed text-[#f4c6ae]"><p className="flex gap-3"><MapPin className="mt-0.5 shrink-0 text-[#ffd097]" size={17} /><span className="whitespace-pre-line">{t('address')}</span></p><p className="flex gap-3"><Clock3 className="mt-0.5 shrink-0 text-[#ffd097]" size={17} /><span>{t('everyDay')}<br />{t('dailyHours').replace(/^Daily |^يومياً /, '')}</span></p><a href={`tel:${phoneNumber.replace(/\s/g, '')}`} data-testid="link-phone" className="flex gap-3 transition hover:text-[#fff2df]"><Phone className="mt-0.5 shrink-0 text-[#ffd097]" size={17} /><span dir="ltr">{phoneNumber}</span></a></motion.div><motion.a variants={reveal} href={listingUrl} target="_blank" rel="noreferrer" data-testid="link-google-maps" className="mt-10 inline-flex items-center gap-3 border border-[#ffd097]/60 px-5 py-3.5 text-[10px] uppercase tracking-[.15em] text-[#fff2df] transition hover:bg-[#ffd097] hover:text-[#8d2d23]">{t('googleMaps')} <ArrowUpRight size={15} /></motion.a></motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .8 }} className="relative min-h-[380px] overflow-hidden border border-[#ffd097]/35 bg-[#6b231c] shadow-2xl md:min-h-[500px]"><iframe title={t('findUs')} data-testid="embed-google-map" src={mapsEmbed} loading="lazy" className="absolute inset-0 h-full w-full border-0 grayscale-[.3] contrast-110" /><div className="pointer-events-none absolute start-5 top-5 bg-[#110d0c] px-4 py-3 text-[#f5eee2] shadow-lg"><p className="font-display text-2xl">Bianco</p><p className="font-mono-ui text-[9px] uppercase tracking-[.12em] text-[#f2b46d]">{t('mapArea')}</p></div></motion.div>
        </div>
      </section>

      <footer className="bg-[#110d0c] px-5 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-[1440px]"><div className="flex flex-col justify-between gap-12 border-b border-[#f5eee2]/12 pb-12 md:flex-row md:items-end"><div><img src="/bianco-logo-transparent.png" alt="Bianco بيانكو" data-testid="img-logo-footer" className="h-12 w-[142px] object-contain object-start" /><p className="mt-6 max-w-[320px] font-display text-3xl leading-[.95] text-[#f2b46d]">{t('orderLoud')}<br />{t('eatWell')}</p></div><div className="flex flex-col items-start gap-4 text-[10px] uppercase tracking-[.15em] text-[#9c8f84] md:items-end"><a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" data-testid="link-footer-whatsapp" className="transition hover:text-[#f2b46d]">{t('whatsappKitchen')} <ArrowUpRight className="ms-1 inline" size={13} /></a><a href={`tel:${phoneNumber.replace(/\s/g, '')}`} data-testid="link-footer-phone" className="transition hover:text-[#f2b46d]">{t('call')} <span dir="ltr">{phoneNumber}</span></a><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" data-testid="link-instagram" className="flex items-center gap-2 transition hover:text-[#f2b46d]"><Instagram size={14} /> {t('followRoom')}</a></div></div><div className="flex flex-col justify-between gap-3 pt-6 font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#716760] md:flex-row"><span>بيانكو · Bianco · {t('madinah')}</span><span data-testid="text-footer-hours">{t('footerHours')}</span><span>© {new Date().getFullYear()} Bianco</span></div></div>
      </footer>

      {menuEntered && <div className="fixed inset-x-3 bottom-3 z-40 lg:inset-x-auto lg:bottom-5 lg:start-1/2 lg:w-[min(680px,calc(100vw-80px))] lg:-translate-x-1/2" data-testid="menu-tray">
        {trayOpen && <div className="tray-panel mb-3 max-h-[58vh] overflow-y-auto border border-[#c98b5d]/40 bg-[#2a1714] p-4 text-left shadow-[0_18px_60px_rgba(38,14,10,.32)] sm:p-5" dir={isArabic ? 'rtl' : 'ltr'} data-testid="tray-panel">
          <div className="mb-2 flex items-center justify-between border-b border-[#edc9aa]/15 pb-3">
            <div>
              <p className="font-mono-ui text-[9px] uppercase tracking-[.2em] text-[#dba16f]">{t('cartEyebrow')}</p>
              <p className="mt-1 font-display text-2xl text-[#f3dfca]">{t('cartTitle')} <span className="font-mono-ui text-[10px] text-[#a98575]">· {cartCount}</span></p>
            </div>
            <button type="button" aria-label={t('trayClose')} onClick={() => setTrayOpen(false)} data-testid="button-tray-close" className="focus-ring text-[#dba16f]"><ChevronDown size={17} /></button>
          </div>
          {cart.length ? cart.map(({ product, quantity }) => {
            const text = productText(product, locale);
            return <div key={product.id} className="flex items-center gap-3 border-b border-[#edc9aa]/10 py-3">
              {product.image.includes('/menu-dishes/') ? <img src={product.image} alt="" className="h-12 w-12 shrink-0 object-cover opacity-90" style={{ objectPosition: product.imagePosition }} /> : <div className="menu-card-placeholder h-12 w-12 shrink-0" aria-hidden="true" />}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate font-display text-xl text-[#f3dfca]">{text.name}</p>
                  <span className="font-mono-ui text-[10px] text-[#e2aa79]">{formatPrice(product.price * quantity, locale)}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <button type="button" aria-label={`${t('decrease')} ${text.name}`} onClick={() => updateQuantity(product.id, -1)} data-testid={`button-tray-decrease-${product.id}`} className="focus-ring border border-[#edc9aa]/25 p-1.5 text-[#dba16f]"><Minus size={11} /></button>
                  <span className="w-5 text-center font-mono-ui text-[10px] text-[#f3dfca]" data-testid={`text-tray-quantity-${product.id}`}>{quantity}</span>
                  <button type="button" aria-label={`${t('increase')} ${text.name}`} onClick={() => updateQuantity(product.id, 1)} data-testid={`button-tray-increase-${product.id}`} className="focus-ring border border-[#edc9aa]/25 p-1.5 text-[#dba16f]"><Plus size={11} /></button>
                </div>
              </div>
            </div>;
          }) : <p className="py-7 text-sm text-[#c39b83]">{t('addToTable')}</p>}
          {cartCount > 0 && <a href={whatsappUrl} target="_blank" rel="noreferrer" onClick={() => trackEvent('checkout_intent', { method: 'whatsapp', item_count: cartCount, subtotal })} className="focus-ring mt-4 flex items-center justify-between bg-[#5d1d18] px-4 py-3 font-mono-ui text-[9px] font-bold uppercase tracking-[.12em] text-[#f8e4cc] transition hover:bg-[#7a2b20]" data-testid="tray-checkout-link"><span>{t('checkout')}</span><ArrowUpRight size={13} /></a>}
        </div>}
        <div className="flex items-center gap-2 border border-[#dba16f]/70 bg-[#dba16f] p-2 ps-3 text-[#2a1411] shadow-[0_12px_40px_rgba(0,0,0,.3)]" dir={isArabic ? 'rtl' : 'ltr'}>
          <ShoppingBag size={15} strokeWidth={1.7} />
          <div className="min-w-0 flex-1">
            <p className="font-mono-ui text-[8px] font-bold uppercase tracking-[.14em]">{cartCount ? `${cartCount} · ${t('cartTitle')}` : t('tableOpen')}</p>
            {cartCount > 0 && <p className="font-mono-ui text-[8px] text-[#663528]">{t('estimatedSubtotal')} · {formatPrice(subtotal, locale)}</p>}
          </div>
          <button type="button" onClick={() => setTrayOpen((open) => !open)} data-testid="button-open-tray" aria-expanded={trayOpen} className="focus-ring flex items-center gap-1 border border-[#5c281d]/35 px-2.5 py-2 font-mono-ui text-[8px] font-bold uppercase tracking-[.12em]">{trayOpen ? t('trayClose') : t('trayOpen')} <ChevronDown size={12} className={trayOpen ? '' : 'rotate-180'} /></button>
          <a href={cartCount ? whatsappUrl : undefined} onClick={() => cartCount && trackEvent('checkout_intent', { method: 'whatsapp', item_count: cartCount, subtotal })} aria-disabled={!cartCount} data-testid="button-tray-checkout" className={`focus-ring flex items-center gap-1 bg-[#5d1d18] px-2.5 py-2 font-mono-ui text-[8px] font-bold uppercase tracking-[.08em] text-[#f8e4cc] transition hover:bg-[#7a2b20] ${cartCount ? '' : 'pointer-events-none opacity-35'}`}><span>{t('checkout')}</span><ArrowUpRight size={12} /></a>
        </div>
      </div>}
      <ReservationDialog open={reservationOpen} onOpenChange={setReservationOpen} t={t} />
       <AnimatePresence>{selectedProduct && <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={addToCart} locale={locale} t={t} />}</AnimatePresence>
     </main>
    </>
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