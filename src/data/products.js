// Centralized Product Database — Trishu Impex
// Easily extendable: Just import new product images and append to PRODUCTS array.

import biryaniMasala from '../assets/products/Biryani Masala.png';
import blackCardamom from '../assets/products/Black Cardamom.png';
import blackPepper from '../assets/products/Black Pepper.png';
import byadgiChilli from '../assets/products/Byadgi Chilli.png';
import cardamomPowder from '../assets/products/Cardamom Powder.png';
import chaatMasala from '../assets/products/Chaat Masala.png';
import chilliPowder from '../assets/products/Chilli Powder.png';
import cinnamonPowder from '../assets/products/Cinnamon Powder.png';
import cinnamonSticks from '../assets/products/Cinnamon Sticks.png';
import clovePowder from '../assets/products/Clove Powder.png';
import corianderPowder from '../assets/products/Coriander Powder.png';
import corianderSeeds from '../assets/products/Coriander Seeds.png';
import cuminPowder from '../assets/products/Cumin Powder.png';
import cuminSeeds from '../assets/products/Cumin Seeds.png';
import currySpiceMix from '../assets/products/Curry Spice Mix.png';
import dryGinger from '../assets/products/Dry Ginger.png';
import dryRedChilli from '../assets/products/Dry Red Chilli.png';
import fennelPowder from '../assets/products/Fennel Powder.png';
import fennelSeeds from '../assets/products/Fennel Seeds.png';
import garamMasala from '../assets/products/Garam Masala.png';
import gingerPowder from '../assets/products/Ginger Powder.png';
import greenCardamom from '../assets/products/Green Cardamom.png';
import greenPepper from '../assets/products/Green Pepper.png';
import gunturChilli from '../assets/products/Guntur Chilli.png';
import kashmiriChilli from '../assets/products/Kashmiri Chilli.png';
import kashmiriSaffron from '../assets/products/Kashmiri Saffron.png';
import kitchenKingMasala from '../assets/products/Kitchen King Masala.png';
import mace from '../assets/products/Mace.png';
import nutmegPowder from '../assets/products/Nutmeg Powder.png';
import nutmeg from '../assets/products/Nutmeg.png';
import saffronPowder from '../assets/products/Saffron Powder.png';
import turmericBulbs from '../assets/products/Turmeric Bulbs.png';
import turmericFingers from '../assets/products/Turmeric Fingers.png';
import turmericPowder from '../assets/products/Turmeric Powder.png';
import vanillaBeans from '../assets/products/Vanilla Beans.png';
import vanillaPowder from '../assets/products/Vanilla Powder.png';
import whitePepper from '../assets/products/White Pepper.png';
import wholeCloves from '../assets/products/Whole Cloves.png';

export const PRODUCT_CATEGORIES = [
  'All',
  'Ground Spices',
  'Whole Spices',
  'Seed Spices',
  'Blended Spices',
  'Exotic & Premium'
];

export const PRODUCTS = [
  // --- GROUND SPICES ---
  {
    id: 'turmeric-powder',
    title: 'Turmeric Powder',
    category: 'Ground Spices',
    cat: 'Ground Spices',
    hsCode: 'HS 09103020',
    image: turmericPowder,
    origin: 'Erode & Sangli, India',
    packaging: '25kg / 50kg PP Bags / Custom Vacuum',
    specs: 'Curcumin > 3.5% | Moisture < 10% | Sortex Cleaned',
    description: 'Golden-yellow turmeric powder milled from premium curcuma longa roots. Double-sifted for rich color, vibrant aroma, and high curcumin content.',
    desc: 'Golden-yellow turmeric powder milled from premium curcuma longa roots. Double-sifted for rich color and high curcumin content.',
    isFeatured: true
  },
  {
    id: 'chilli-powder',
    title: 'Red Chilli Powder',
    category: 'Ground Spices',
    cat: 'Ground Spices',
    hsCode: 'HS 09042211',
    image: chilliPowder,
    origin: 'Guntur, Andhra Pradesh, India',
    packaging: '25kg Kraft Bags / Drums / PP Bags',
    specs: 'ASTA Color 80 - 120 | Pungency 25,000 - 40,000 SHU',
    description: 'Ultra-fine spicy red chilli powder ground from select Guntur chillies. Delivers an authentic deep red color and fiery pungent kick.',
    desc: 'Ultra-fine spicy red chilli powder ground from select Guntur chillies for authentic color and fiery heat.',
    isFeatured: true
  },
  {
    id: 'coriander-powder',
    title: 'Coriander Powder (Dhana)',
    category: 'Ground Spices',
    cat: 'Ground Spices',
    hsCode: 'HS 09092200',
    image: corianderPowder,
    origin: 'Ramganj & Kota, Rajasthan, India',
    packaging: '25kg Multi-wall Paper / PP Bags',
    specs: 'Volatile Oil > 0.3% | Moisture < 8% | Fine Mesh',
    description: 'Freshly ground coriander powder milled from premium green coriander seeds with a pleasant citrus fragrance and warm earthy flavor.',
    desc: 'Freshly ground coriander powder milled from green seeds with pleasant citrus fragrance.',
    isFeatured: false
  },
  {
    id: 'cumin-powder',
    title: 'Cumin Powder (Jeera)',
    category: 'Ground Spices',
    cat: 'Ground Spices',
    hsCode: 'HS 09093200',
    image: cuminPowder,
    origin: 'Unjha, Gujarat, India',
    packaging: '25kg PP Bags / Vacuum Bags',
    specs: 'Volatile Oil > 1.8% | Purity 99.5% | Mesh 40-60',
    description: 'High-aroma ground cumin seed powder processed under cool grinding technology to preserve delicate essential oils and earthy notes.',
    desc: 'High-aroma ground cumin seed powder processed under cool grinding technology.',
    isFeatured: true
  },
  {
    id: 'cardamom-powder',
    title: 'Green Cardamom Powder',
    category: 'Ground Spices',
    cat: 'Ground Spices',
    hsCode: 'HS 09083200',
    image: cardamomPowder,
    origin: 'Idukki, Kerala, India',
    packaging: '10kg / 20kg Master Cartons with Foil Bags',
    specs: '100% Pure Cardamom | Volatile Oil > 4.5%',
    description: 'Finely ground green cardamom made from premium green pods. Captures sweet herbal aroma for gourmet confectionery and beverages.',
    desc: 'Finely ground green cardamom capturing sweet herbal aroma for gourmet cooking and beverages.',
    isFeatured: false
  },
  {
    id: 'cinnamon-powder',
    title: 'Cinnamon Powder (Dalchini)',
    category: 'Ground Spices',
    cat: 'Ground Spices',
    hsCode: 'HS 09062000',
    image: cinnamonPowder,
    origin: 'Kerala & Tamil Nadu, India',
    packaging: '25kg Cartons / Drums',
    specs: 'Coumarin Low Grade | Moisture < 10%',
    description: 'Aromatic cinnamon powder with sweet woody notes, ideal for bakery, beverage mixes, and savory spice blends.',
    desc: 'Aromatic cinnamon powder with sweet woody notes, ideal for bakery and spice blends.',
    isFeatured: false
  },
  {
    id: 'clove-powder',
    title: 'Clove Powder',
    category: 'Ground Spices',
    cat: 'Ground Spices',
    hsCode: 'HS 09072000',
    image: clovePowder,
    origin: 'South India',
    packaging: '15kg / 25kg Drums',
    specs: 'Eugenol Content > 15% | High Pungency',
    description: 'Intensely fragrant ground whole cloves rich in natural essential oil (Eugenol) for industrial food processing and spice formulation.',
    desc: 'Intensely fragrant ground whole cloves rich in natural essential oil (Eugenol).',
    isFeatured: false
  },
  {
    id: 'ginger-powder',
    title: 'Dry Ginger Powder (Sonth)',
    category: 'Ground Spices',
    cat: 'Ground Spices',
    hsCode: 'HS 09101210',
    image: gingerPowder,
    origin: 'Cochin, Kerala, India',
    packaging: '25kg Paper / PP Bags',
    specs: 'Gingerol > 2.0% | Pungency High | Moisture < 9%',
    description: 'Sun-dried ginger root powder known for crisp sharpness and warming flavor. Non-bleached export grade.',
    desc: 'Sun-dried ginger root powder known for crisp sharpness and warming flavor.',
    isFeatured: true
  },
  {
    id: 'fennel-powder',
    title: 'Fennel Powder (Saunf)',
    category: 'Ground Spices',
    cat: 'Ground Spices',
    hsCode: 'HS 09096200',
    image: fennelPowder,
    origin: 'Gujarat & Rajasthan, India',
    packaging: '25kg PP Bags',
    specs: 'Sweet Green Grade | Volatile Oil > 1.2%',
    description: 'Sweet, fragrant ground fennel powder made from selected green fennel seeds.',
    desc: 'Sweet, fragrant ground fennel powder made from selected green fennel seeds.',
    isFeatured: false
  },
  {
    id: 'nutmeg-powder',
    title: 'Nutmeg Powder',
    category: 'Ground Spices',
    cat: 'Ground Spices',
    hsCode: 'HS 09081200',
    image: nutmegPowder,
    origin: 'Kerala, India',
    packaging: '20kg Fiber Drums',
    specs: 'Pure Ground Nutmeg Kernel | Oil > 6.0%',
    description: 'Warm and sweet nutmeg powder milled from whole sound nutmeg kernels.',
    desc: 'Warm and sweet nutmeg powder milled from whole sound nutmeg kernels.',
    isFeatured: false
  },
  {
    id: 'saffron-powder',
    title: 'Pure Saffron Powder',
    category: 'Ground Spices',
    cat: 'Ground Spices',
    hsCode: 'HS 09102020',
    image: saffronPowder,
    origin: 'Pampore, Kashmir, India',
    packaging: '100g / 500g / 1kg Airtight Metal Tins',
    specs: 'Crocin > 220 | Safranal > 30 | Grade 1 Pure',
    description: 'Ultra-luxurious Kashmiri saffron powder pulverized from pure red stigmas, offering supreme natural aroma and golden color tint.',
    desc: 'Ultra-luxurious Kashmiri saffron powder pulverized from pure red stigmas.',
    isFeatured: true
  },
  {
    id: 'vanilla-powder',
    title: 'Natural Vanilla Powder',
    category: 'Ground Spices',
    cat: 'Ground Spices',
    hsCode: 'HS 09052000',
    image: vanillaPowder,
    origin: 'Kerala & Karnataka, India',
    packaging: '5kg / 10kg Vacuum Bags in Drums',
    specs: 'Vanillin > 1.8% | 100% Pure Vanilla Pod',
    description: 'Pure ground vanilla bean powder with rich cream caramel aroma, sugar-free and additive-free.',
    desc: 'Pure ground vanilla bean powder with rich cream caramel aroma.',
    isFeatured: false
  },

  // --- WHOLE SPICES ---
  {
    id: 'black-pepper',
    title: 'Black Pepper Berries (Tellicherry / MG1)',
    category: 'Whole Spices',
    cat: 'Whole Spices',
    hsCode: 'HS 09041110',
    image: blackPepper,
    origin: 'Idukki & Wayanad, Kerala, India',
    packaging: '25kg / 50kg Jute / PP Bags',
    specs: 'Bulk Density 550 - 580 g/l | Piperine > 4.0%',
    description: 'Extra bold sun-dried black peppercorns from Malabar coast with intense bite, dark color, and high essential oil content.',
    desc: 'Extra bold sun-dried black peppercorns with intense bite and high essential oil content.',
    isFeatured: true
  },
  {
    id: 'green-cardamom',
    title: 'Green Cardamom (8mm Extra Bold)',
    category: 'Whole Spices',
    cat: 'Whole Spices',
    hsCode: 'HS 09083110',
    image: greenCardamom,
    origin: 'Wayanad & Idukki, Kerala, India',
    packaging: '10kg Master Cartons with inner poly bags',
    specs: 'Size 8mm+ Extra Bold | Deep Green Color | Oil > 6.0%',
    description: 'Handpicked extra bold green cardamom pods loaded with aromatic sweet essential oil.',
    desc: 'Handpicked extra bold green cardamom pods loaded with aromatic sweet essential oil.',
    isFeatured: true
  },
  {
    id: 'black-cardamom',
    title: 'Black Cardamom (Badi Elaichi)',
    category: 'Whole Spices',
    cat: 'Whole Spices',
    hsCode: 'HS 09083120',
    image: blackCardamom,
    origin: 'Sikkim & West Bengal, India',
    packaging: '25kg Jute / PP Bags',
    specs: 'Smoky Camphorous Aroma | Moisture < 11%',
    description: 'Large dark brown pods with deep smoky aroma and medicinal value, sun and kiln dried.',
    desc: 'Large dark brown pods with deep smoky aroma, sun and kiln dried.',
    isFeatured: false
  },
  {
    id: 'cinnamon-sticks',
    title: 'Cinnamon Sticks & Quills (Dalchini)',
    category: 'Whole Spices',
    cat: 'Whole Spices',
    hsCode: 'HS 09061100',
    image: cinnamonSticks,
    origin: 'Kerala & Tamil Nadu, India',
    packaging: '25kg Cartons / Bales',
    specs: 'Roll Length 8-10cm | Moisture < 12%',
    description: 'Hand-rolled cinnamon sticks and cut quills with sweet fragrance for culinary and extract industry.',
    desc: 'Hand-rolled cinnamon sticks with sweet fragrance for culinary exports.',
    isFeatured: false
  },
  {
    id: 'whole-cloves',
    title: 'Whole Cloves (Laving)',
    category: 'Whole Spices',
    cat: 'Whole Spices',
    hsCode: 'HS 09071000',
    image: wholeCloves,
    origin: 'Kanyakumari, Tamil Nadu, India',
    packaging: '10kg / 25kg Cartons',
    specs: 'Head Count > 95% | Volatile Oil > 17%',
    description: 'Hand-picked aromatic whole cloves with dark reddish-brown color, fully intact crown heads, and high oil content.',
    desc: 'Hand-picked whole cloves with dark reddish-brown color and fully intact heads.',
    isFeatured: true
  },
  {
    id: 'dry-ginger',
    title: 'Dry Ginger Whole (Cochin Grade)',
    category: 'Whole Spices',
    cat: 'Whole Spices',
    hsCode: 'HS 09101110',
    image: dryGinger,
    origin: 'Cochin, Kerala, India',
    packaging: '25kg Jute Bags',
    specs: 'Unbleached Clean | Moisture < 10%',
    description: 'Sun-dried whole ginger rhizomes from Cochin, featuring pungent bite and citrus notes.',
    desc: 'Sun-dried whole ginger rhizomes featuring pungent bite and citrus notes.',
    isFeatured: false
  },
  {
    id: 'dry-red-chilli',
    title: 'Dry Red Chilli Whole (Stemless / With Stem)',
    category: 'Whole Spices',
    cat: 'Whole Spices',
    hsCode: 'HS 09042110',
    image: dryRedChilli,
    origin: 'Guntur, Andhra Pradesh, India',
    packaging: '25kg / 50kg Press Bales / PP Bags',
    specs: 'Moisture < 10% | Foreign Matter < 1%',
    description: 'Sun-dried whole red chillies sortex cleaned for high heat and color extraction.',
    desc: 'Sun-dried whole red chillies sortex cleaned for high heat and color extraction.',
    isFeatured: false
  },
  {
    id: 'byadgi-chilli',
    title: 'Byadgi Chilli Whole (Deep Red ASTA)',
    category: 'Whole Spices',
    cat: 'Whole Spices',
    hsCode: 'HS 09042120',
    image: byadgiChilli,
    origin: 'Karnataka, India',
    packaging: '25kg Jute / PP Bags',
    specs: 'ASTA Color 130 - 160 | Mild Pungency',
    description: 'Wrinkled long red chilli renowned worldwide for extraordinary deep red oleoresin color with mild heat.',
    desc: 'Wrinkled long red chilli renowned for extraordinary deep red color with mild heat.',
    isFeatured: true
  },
  {
    id: 'guntur-chilli',
    title: 'Guntur S17 / Teja Red Chilli',
    category: 'Whole Spices',
    cat: 'Whole Spices',
    hsCode: 'HS 09042110',
    image: gunturChilli,
    origin: 'Guntur, Andhra Pradesh, India',
    packaging: '25kg / 50kg Bags',
    specs: 'Pungency 45,000+ SHU | High Capsaicin',
    description: 'Pungent whole red chillies packed with fiery capsaicin heat, favored by global food manufacturers.',
    desc: 'Pungent whole red chillies packed with fiery capsaicin heat.',
    isFeatured: false
  },
  {
    id: 'kashmiri-chilli',
    title: 'Kashmiri Red Chilli Whole',
    category: 'Whole Spices',
    cat: 'Whole Spices',
    hsCode: 'HS 09042110',
    image: kashmiriChilli,
    origin: 'Kashmir / Himachal, India',
    packaging: '15kg / 25kg Bags',
    specs: 'Rich Red Color | Low SHU Pungency',
    description: 'Famous bright crimson red chilli with mild heat, perfect for vibrant culinary presentations.',
    desc: 'Famous bright crimson red chilli with mild heat, perfect for rich food presentation.',
    isFeatured: true
  },
  {
    id: 'green-pepper',
    title: 'Green Peppercorns (Dehydrated / Brine)',
    category: 'Whole Spices',
    cat: 'Whole Spices',
    hsCode: 'HS 09041120',
    image: greenPepper,
    origin: 'Kerala, India',
    packaging: '10kg / 25kg Drums',
    specs: 'Retained Natural Green Tint | Moisture < 8%',
    description: 'Freshly harvested tender green peppercorns dehydrated to retain lively green color and fresh bite.',
    desc: 'Freshly harvested green peppercorns dehydrated to retain lively green color.',
    isFeatured: false
  },
  {
    id: 'white-pepper',
    title: 'White Peppercorns Whole',
    category: 'Whole Spices',
    cat: 'Whole Spices',
    hsCode: 'HS 09041130',
    image: whitePepper,
    origin: 'Kerala, India',
    packaging: '25kg Bags',
    specs: 'Density 580 g/l | Purity 99.5%',
    description: 'Decorticated fully ripe black pepper berries producing creamy off-white peppercorns with refined aroma.',
    desc: 'Fully ripe black pepper berries producing creamy off-white peppercorns with subtle warmth.',
    isFeatured: false
  },
  {
    id: 'nutmeg-whole',
    title: 'Nutmeg Whole with Shell / Shell-less',
    category: 'Whole Spices',
    cat: 'Whole Spices',
    hsCode: 'HS 09081110',
    image: nutmeg,
    origin: 'Kerala, India',
    packaging: '25kg Jute Bags',
    specs: 'ABCD Quality | Sound Whole Kernels',
    description: 'Whole aromatic nutmeg nuts harvested from selected Kerala orchards, sortex inspected.',
    desc: 'Whole aromatic nutmeg nuts harvested from selected Kerala orchards.',
    isFeatured: false
  },
  {
    id: 'mace-blades',
    title: 'Mace Whole Blades (Javitri)',
    category: 'Whole Spices',
    cat: 'Whole Spices',
    hsCode: 'HS 09082100',
    image: mace,
    origin: 'Kerala, India',
    packaging: '10kg Master Cartons',
    specs: 'Golden Red Aril Blades | High Volatile Oil',
    description: 'Lacy golden-red dried arils surrounding nutmeg nut, possessing delicate sweet camphorous aroma.',
    desc: 'Lacy golden-red dried arils with delicate sweet camphorous aroma.',
    isFeatured: false
  },
  {
    id: 'turmeric-bulbs',
    title: 'Turmeric Bulbs Whole',
    category: 'Whole Spices',
    cat: 'Whole Spices',
    hsCode: 'HS 09103010',
    image: turmericBulbs,
    origin: 'Sangli & Nizamabad, India',
    packaging: '50kg Jute / PP Bags',
    specs: 'High Density Mother Bulbs | Curcumin > 3.0%',
    description: 'Robust mother turmeric bulbs cleaned, boiled, and sun-cured for grinding and extract industries.',
    desc: 'Robust mother turmeric bulbs cleaned, boiled, and sun-cured for industrial grinding.',
    isFeatured: false
  },
  {
    id: 'turmeric-fingers',
    title: 'Turmeric Fingers (Erode / Nizamabad)',
    category: 'Whole Spices',
    cat: 'Whole Spices',
    hsCode: 'HS 09103010',
    image: turmericFingers,
    origin: 'Erode & Nizamabad, India',
    packaging: '25kg / 50kg Jute / PP Bags',
    specs: 'Double Polished | Curcumin > 3.5%',
    description: 'Deep orange-yellow polished whole turmeric finger roots, hard cured with high curcumin purity.',
    desc: 'Deep orange-yellow polished whole turmeric finger roots with high curcumin purity.',
    isFeatured: true
  },

  // --- SEED SPICES ---
  {
    id: 'cumin-seeds',
    title: 'Cumin Seeds (Jeera - Singapore 99% / 99.5%)',
    category: 'Seed Spices',
    cat: 'Seed Spices',
    hsCode: 'HS 09093120',
    image: cuminSeeds,
    origin: 'Unjha, Gujarat & Rajasthan, India',
    packaging: '25kg / 50kg PP Woven Bags',
    specs: 'Purity 99.5% Sortex | Moisture < 8% | Foreign Matter < 0.5%',
    description: 'Machine cleaned and Sortex graded cumin seeds with rich aroma, ideal for bulk spice import.',
    desc: 'Machine cleaned and Sortex graded cumin seeds with rich aroma for global trade.',
    isFeatured: true
  },
  {
    id: 'coriander-seeds',
    title: 'Coriander Seeds (Eagle / Badami / Scoop)',
    category: 'Seed Spices',
    cat: 'Seed Spices',
    hsCode: 'HS 09092110',
    image: corianderSeeds,
    origin: 'Kota, Rajasthan & MP, India',
    packaging: '25kg / 40kg PP Bags',
    specs: 'Purity 99.0% | Greenish Golden | Moisture < 8%',
    description: 'Bold coriander seeds with distinct citrus scent, thoroughly cleaned and color sorted.',
    desc: 'Bold coriander seeds with distinct citrus scent, thoroughly cleaned and color sorted.',
    isFeatured: true
  },
  {
    id: 'fennel-seeds',
    title: 'Fennel Seeds (Saunf - Green Lucknowi & Bold)',
    category: 'Seed Spices',
    cat: 'Seed Spices',
    hsCode: 'HS 09096110',
    image: fennelSeeds,
    origin: 'Unjha, Gujarat, India',
    packaging: '25kg / 50kg Bags',
    specs: 'Green Sortex Quality 99.5% | Anethole Oil > 1.5%',
    description: 'Aromatic whole green fennel seeds with sweet taste, sortex cleaned for retail and export.',
    desc: 'Aromatic whole green fennel seeds with sweet taste, sortex cleaned for export.',
    isFeatured: true
  },

  // --- BLENDED SPICES ---
  {
    id: 'garam-masala',
    title: 'Royal Garam Masala Blend',
    category: 'Blended Spices',
    cat: 'Blended Spices',
    hsCode: 'HS 09109100',
    image: garamMasala,
    origin: 'India',
    packaging: '25kg Drums / Custom Pouches',
    specs: '100% Pure Spice Mix | No Preservatives',
    description: 'Authentic Indian spice blend featuring ground cardamom, cloves, cinnamon, cumin, and nutmeg in rich balance.',
    desc: 'Authentic Indian spice blend featuring ground cardamom, cloves, cinnamon, cumin, and nutmeg.',
    isFeatured: true
  },
  {
    id: 'chaat-masala',
    title: 'Tangy Chaat Masala Blend',
    category: 'Blended Spices',
    cat: 'Blended Spices',
    hsCode: 'HS 09109100',
    image: chaatMasala,
    origin: 'India',
    packaging: '25kg Bags / OEM Boxes',
    specs: 'Zesty Tangy Flavor | Food Grade Packaging',
    description: 'Savory and tangy seasoning mix combining dry mango powder, black salt, cumin, and asafoetida.',
    desc: 'Savory and tangy seasoning mix combining dry mango powder, black salt, and cumin.',
    isFeatured: false
  },
  {
    id: 'biryani-masala',
    title: 'Hyderabadi Biryani Spice Blend',
    category: 'Blended Spices',
    cat: 'Blended Spices',
    hsCode: 'HS 09109100',
    image: biryaniMasala,
    origin: 'India',
    packaging: '25kg Drums / Private Label',
    specs: 'Aromatic Gourmet Grade | Secret Heritage Recipe',
    description: 'Regal spice blend crafted specifically for authentic rice and meat biryani formulations.',
    desc: 'Regal spice blend crafted specifically for authentic rice and meat biryani formulations.',
    isFeatured: true
  },
  {
    id: 'kitchen-king-masala',
    title: 'Kitchen King All-Purpose Curry Spice',
    category: 'Blended Spices',
    cat: 'Blended Spices',
    hsCode: 'HS 09109100',
    image: kitchenKingMasala,
    origin: 'India',
    packaging: '25kg PP Bags / Custom Boxes',
    specs: 'Multi-purpose Curry Powder | Export Grade',
    description: 'Versatile Indian curry spice mix combining turmeric, coriander, cumin, ginger, and garlic for master chefs.',
    desc: 'Versatile Indian curry spice mix combining turmeric, coriander, cumin, ginger, and garlic.',
    isFeatured: false
  },
  {
    id: 'curry-spice-mix',
    title: 'Madras Curry Powder Blend (Mild / Hot)',
    category: 'Blended Spices',
    cat: 'Blended Spices',
    hsCode: 'HS 09109100',
    image: currySpiceMix,
    origin: 'India',
    packaging: '25kg Fiber Drums / Poly Bags',
    specs: 'Export Grade Madras Formulation',
    description: 'Globally popular curry powder blend formulated for industrial food processing and international retail.',
    desc: 'Globally popular curry powder blend formulated for international retail and food trade.',
    isFeatured: true
  },

  // --- EXOTIC & PREMIUM ---
  {
    id: 'kashmiri-saffron',
    title: 'Kashmiri Saffron (Mongra Grade 1)',
    category: 'Exotic & Premium',
    cat: 'Exotic & Premium',
    hsCode: 'HS 09102010',
    image: kashmiriSaffron,
    origin: 'Pampore, Kashmir, India',
    packaging: '10g / 50g / 100g / 1kg Sealed Acrylic Tins',
    specs: 'All Red Mongra Stigmas | Crocin > 240',
    description: 'The world\'s most prized spice. 100% pure Kashmiri Mongra saffron stigmas with intense floral aroma and deep red hue.',
    desc: '100% pure Kashmiri Mongra saffron stigmas with intense floral aroma and deep red hue.',
    isFeatured: true
  },
  {
    id: 'vanilla-beans',
    title: 'Whole Vanilla Beans (Gourmet Grade A)',
    category: 'Exotic & Premium',
    cat: 'Exotic & Premium',
    hsCode: 'HS 09051000',
    image: vanillaBeans,
    origin: 'Kerala & Karnataka, India',
    packaging: '1kg Vacuum Packs in Master Cartons',
    specs: 'Length 16-18cm | Moisture 30-35% | Vanillin > 2.0%',
    description: 'Plump, oily Gourmet Grade A vanilla pods loaded with sweet caviar seeds for luxury pastry and extract crafting.',
    desc: 'Plump, oily Gourmet Grade A vanilla pods loaded with sweet caviar seeds.',
    isFeatured: true
  }
];

// Helper utilities for filtering
export function getProductsByCategory(category = 'All') {
  if (!category || category === 'All') return PRODUCTS;
  return PRODUCTS.filter(p => p.category === category || p.cat === category);
}

export function getFeaturedProducts() {
  return PRODUCTS.filter(p => p.isFeatured);
}

export function searchProducts(query = '', category = 'All') {
  const list = getProductsByCategory(category);
  if (!query.trim()) return list;
  const q = query.toLowerCase();
  return list.filter(p => 
    p.title.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.origin.toLowerCase().includes(q) ||
    p.hsCode.toLowerCase().includes(q)
  );
}
