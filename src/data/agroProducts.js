// Centralized Agro Commodities Database — Trishu Impex
// Premium Indian Agricultural Commodities for Global Export

export const AGRO_CATEGORIES = [
  'All',
  'Rice & Basmati',
  'Wheat & Grains',
  'Corn & Maize',
  'Barley & Millets',
  'Pulses & Oilseeds'
];

export const AGRO_PRODUCTS = [
  // --- RICE & BASMATI ---
  {
    id: '1121-basmati-rice',
    title: '1121 Steam Basmati Rice',
    category: 'Rice & Basmati',
    cat: 'Rice & Basmati',
    hsCode: 'HS 10063020',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    origin: 'Punjab & Haryana, India',
    packaging: '10kg / 25kg / 50kg Non-Woven / BOPP / Jute Bags',
    specs: 'Average Grain Length: 8.35mm+ | Moisture: < 12.5% | Purity: 95% | 100% Sortex Cleaned',
    description: 'World-renowned 1121 Steam Basmati Rice known for its extra-long slender grain, rich natural aroma, non-sticky texture, and exceptional elongation upon cooking.',
    desc: 'Extra long grain 1121 Steam Basmati rice with rich aroma and high elongation ratio.',
    isFeatured: true
  },
  {
    id: 'pusa-basmati-rice',
    title: 'Pusa Golden Sella Basmati Rice',
    category: 'Rice & Basmati',
    cat: 'Rice & Basmati',
    hsCode: 'HS 10063020',
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80',
    origin: 'Northern Plains, India',
    packaging: '25kg / 50kg PP Bags / Custom Packaging',
    specs: 'Grain Length: 7.45mm+ | Moisture: < 12% | Broken: < 1% | Parboiled Golden Tone',
    description: 'Parboiled golden sella basmati rice with high nutritional retention, sturdy grain structure ideal for catering, biryanis, and international culinary hospitality.',
    desc: 'Golden sella parboiled basmati rice ideal for large-scale catering and authentic biryani.',
    isFeatured: true
  },
  {
    id: 'ir64-non-basmati-rice',
    title: 'IR-64 Raw / Parboiled Rice (5% Broken)',
    category: 'Rice & Basmati',
    cat: 'Rice & Basmati',
    hsCode: 'HS 10063090',
    image: 'https://images.unsplash.com/photo-1627483262268-9c2b5b2834b5?auto=format&fit=crop&w=800&q=80',
    origin: 'Andhra Pradesh & Gujarat, India',
    packaging: '25kg / 50kg PP Woven Bags / Break Bulk Vessel Loads',
    specs: 'Grain Length: 6.0mm | Broken: < 5% | Moisture: < 13% | 100% Silky Sortex',
    description: 'High-grade Indian long grain non-basmati rice widely exported across Africa, Middle East, and Southeast Asia for daily staple consumption.',
    desc: 'Sortex cleaned long grain IR-64 non-basmati rice with 5% broken ratio.',
    isFeatured: false
  },
  {
    id: 'sona-masoori-rice',
    title: 'Sona Masoori Raw Rice',
    category: 'Rice & Basmati',
    cat: 'Rice & Basmati',
    hsCode: 'HS 10063090',
    image: 'https://images.unsplash.com/photo-1594488518063-7186d38e21aa?auto=format&fit=crop&w=800&q=80',
    origin: 'Karnataka & Andhra Pradesh, India',
    packaging: '10kg / 25kg Poly Bags / PP Sacks',
    specs: 'Medium Grain | Moisture: < 12.5% | Lightweight & Aromatic | Low Starch',
    description: 'Premium lightweight, aromatic medium-grain Indian white rice famous for easy digestibility and everyday healthy meals.',
    desc: 'Aromatic medium grain lightweight white rice packed for retail and wholesale export.',
    isFeatured: false
  },

  // --- WHEAT & GRAINS ---
  {
    id: 'milling-wheat-grade-a',
    title: 'Milling Wheat (Grade A - 12% Protein)',
    category: 'Wheat & Grains',
    cat: 'Wheat & Grains',
    hsCode: 'HS 10019910',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    origin: 'Madhya Pradesh & Punjab, India',
    packaging: '50kg Jute / PP Bags / Bulk Containers (20ft FCL)',
    specs: 'Protein: 11.5% - 12.5% | Moisture: < 11.5% | Foreign Matter: < 1% | Test Weight: 78 kg/hl',
    description: 'High-quality Indian hard red and amber milling wheat suitable for roller flour mills, bakeries, flatbreads, and commercial flour production.',
    desc: 'High-protein Grade A Indian milling wheat machine cleaned and sortex graded.',
    isFeatured: true
  },
  {
    id: 'sharbati-wheat',
    title: 'Premium Sharbati Wheat',
    category: 'Wheat & Grains',
    cat: 'Wheat & Grains',
    hsCode: 'HS 10019910',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    origin: 'Sehore & Vidisha, Madhya Pradesh, India',
    packaging: '30kg / 50kg PP Woven Bags',
    specs: 'Golden Bold Berries | Moisture: < 10% | Gluten: > 28% | Heavy Test Weight',
    description: 'Regarded as the golden grain of India, Sharbati wheat grains are plump, lustrous golden, with high natural sweetness producing extra-soft rotis.',
    desc: 'Golden lustrous Sharbati wheat prized for high natural sweetness and dough pliability.',
    isFeatured: false
  },
  {
    id: 'durum-wheat',
    title: 'Durum Wheat (Semolina Grade)',
    category: 'Wheat & Grains',
    cat: 'Wheat & Grains',
    hsCode: 'HS 10011900',
    image: 'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=800&q=80',
    origin: 'Central India (Malwa Plateau)',
    packaging: '50kg PP Bags / Bulk Liner Container',
    specs: 'Protein: > 13% | Vitreous Kernels: > 80% | Moisture: < 12% | Gluten Index: High',
    description: 'Hard vitreous amber durum wheat ideal for semolina (suji/rava), pasta, macaroni, couscous, and premium noodles manufacturing.',
    desc: 'Hard amber durum wheat with high gluten index for pasta and semolina processing.',
    isFeatured: false
  },

  // --- CORN & MAIZE ---
  {
    id: 'yellow-corn-maize',
    title: 'Yellow Corn / Maize (Animal Feed Grade)',
    category: 'Corn & Maize',
    cat: 'Corn & Maize',
    hsCode: 'HS 10059000',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
    origin: 'Maharashtra & Bihar, India',
    packaging: '50kg PP Bags / Bulk Container Loads (25 MT / 20ft)',
    specs: 'Moisture: < 13.5% | Protein: > 8.5% | Aflatoxin: < 20 ppb | Foreign Matter: < 1.5%',
    description: 'Export-grade dried yellow maize grains suitable for poultry feed, livestock nutrition, animal husbandry, and starch manufacturing industries.',
    desc: 'Non-GMO export grade dried yellow maize grains with low moisture and certified aflatoxin levels.',
    isFeatured: true
  },
  {
    id: 'food-grade-yellow-corn',
    title: 'Yellow Corn (Food Grade Sortex Cleaned)',
    category: 'Corn & Maize',
    cat: 'Corn & Maize',
    hsCode: 'HS 10059000',
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=800&q=80',
    origin: 'Gujarat & Karnataka, India',
    packaging: '25kg / 50kg Multi-layer Paper & PP Bags',
    specs: 'Purity: 99.5% Sortex Cleaned | Non-GMO | Broken: < 1% | Moisture: < 12%',
    description: 'Premium machine-cleaned and Sortex-passed food-grade yellow maize grains for corn flour, corn starch, snacks, and human food processing.',
    desc: 'Food grade machine sorted yellow corn suitable for corn starch and cereal processing.',
    isFeatured: false
  },

  // --- BARLEY & MILLETS ---
  {
    id: 'feed-malting-barley',
    title: 'Malting & Feed Barley Grains',
    category: 'Barley & Millets',
    cat: 'Barley & Millets',
    hsCode: 'HS 10039000',
    image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80',
    origin: 'Rajasthan & Haryana, India',
    packaging: '50kg PP Bags / 20ft FCL Bulk Containered',
    specs: 'Moisture: < 12% | Protein: 10 - 11.5% | Germination Capacity: > 95% | Foreign Matter: < 1%',
    description: 'Prime quality two-row and six-row Indian barley grains with high enzymatic activity for brewing/malting and premium livestock feed.',
    desc: 'High germination malting and feed barley grains cleaned for global export.',
    isFeatured: true
  },
  {
    id: 'pearl-millet-bajra',
    title: 'Pearl Millet (Green Bajra)',
    category: 'Barley & Millets',
    cat: 'Barley & Millets',
    hsCode: 'HS 10082190',
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=80',
    origin: 'Rajasthan & Gujarat, India',
    packaging: '25kg / 50kg PP Bags',
    specs: 'Purity: 99% Sortex | Moisture: < 11% | Nutrient Dense | Green Bold Seed',
    description: 'Nutrient-rich ancient Indian superfood grain packed with dietary fiber, iron, and minerals. Widely sourced for health food processing and animal feeds.',
    desc: 'Sortex cleaned green pearl millet (bajra) high in dietary fiber and essential minerals.',
    isFeatured: false
  },
  {
    id: 'sorghum-jowar',
    title: 'White Sorghum (Milky Jowar)',
    category: 'Barley & Millets',
    cat: 'Barley & Millets',
    hsCode: 'HS 10079000',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    origin: 'Maharashtra & Karnataka, India',
    packaging: '25kg / 50kg PP Bags',
    specs: 'Color: Creamy White | Purity: 99% | Moisture: < 12% | Gluten-Free',
    description: 'Naturally gluten-free white sorghum grains machine-cleaned for gluten-free flour mixes, animal feed, and ethanol bio-refineries.',
    desc: 'Machine cleaned creamy white sorghum grains, 100% natural and gluten-free.',
    isFeatured: false
  },

  // --- PULSES & OILSEEDS ---
  {
    id: 'kabuli-chickpeas',
    title: 'Kabuli Chickpeas (Garbanzo Beans)',
    category: 'Pulses & Oilseeds',
    cat: 'Pulses & Oilseeds',
    hsCode: 'HS 07132000',
    image: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e3?auto=format&fit=crop&w=800&q=80',
    origin: 'Madhya Pradesh & Maharashtra, India',
    packaging: '25kg / 50kg PP Bags / Kraft Paper Bags',
    specs: 'Caliber: 75/80, 58/60, 42/44 Count | Moisture: < 10% | Purity: 99.5% Sortex',
    description: 'Jumbo and regular size bold white Kabuli chickpeas cleaned, machine sorted, and free from weevils, exported to Mediterranean and Gulf markets.',
    desc: 'Bold sortex cleaned Kabuli chickpeas available in multiple international count sizes.',
    isFeatured: true
  },
  {
    id: 'soybean-non-gmo',
    title: 'Yellow Soybean (Non-GMO High Protein)',
    category: 'Pulses & Oilseeds',
    cat: 'Pulses & Oilseeds',
    hsCode: 'HS 12019000',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
    origin: 'Madhya Pradesh & Maharashtra, India',
    packaging: '50kg PP Woven Bags / Bulk FCL',
    specs: 'Protein: > 38% | Oil Content: > 18% | Moisture: < 11% | Non-GMO Certified',
    description: 'Certified Non-GMO yellow soybean seeds with superior oil content and high protein value for edible oil extraction, soy meal, and tofu processing.',
    desc: 'Certified Non-GMO yellow soybean seeds with high protein and oil yield.',
    isFeatured: false
  },
  {
    id: 'hulled-sesame-seeds',
    title: 'Natural & Hulled White Sesame Seeds',
    category: 'Pulses & Oilseeds',
    cat: 'Pulses & Oilseeds',
    hsCode: 'HS 12074090',
    image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80',
    origin: 'Gujarat, India',
    packaging: '25kg / 50kg Paper Bags / Vacuum Bags',
    specs: 'Purity: 99.95% / 99.98% Sortex | Moisture: < 5% | FFA: < 1.5% | Auto Hulled',
    description: 'Mechanically hulled and Sortex-cleaned premium white sesame seeds with uniform white color, nutty flavor, widely used in confectioneries and bakery.',
    desc: '99.95% purity auto-hulled white sesame seeds with high oil content.',
    isFeatured: false
  },
  {
    id: 'bold-peanuts-groundnuts',
    title: 'Raw Peanuts / Groundnuts (Bold & Java)',
    category: 'Pulses & Oilseeds',
    cat: 'Pulses & Oilseeds',
    hsCode: 'HS 12024210',
    image: 'https://images.unsplash.com/photo-1567892323527-86f7f3a8b277?auto=format&fit=crop&w=800&q=80',
    origin: 'Saurashtra, Gujarat, India',
    packaging: '25kg / 50kg Vacuum PP / Jute Bags',
    specs: 'Count: 40/50, 50/60, 60/70 | Aflatoxin: < 4 ppb (EU Standards) | Moisture: < 7%',
    description: 'Top-grade Indian peanuts in Java and Bold counts. Machine de-stoned, sortex cleaned, and lab tested for stringent aflatoxin compliance.',
    desc: 'Sortex cleaned Bold & Java raw peanut kernels meeting strict global aflatoxin limits.',
    isFeatured: false
  }
];
