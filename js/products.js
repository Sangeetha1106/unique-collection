/**
 * UNIQUE COLLECTION - Products & Categories Catalog Service
 * Complete client-specified product catalog for Women's Ethnic Wear,
 * Anti-Tarnish Waterproof Jewellery, and Guaranteed Gold-Plated Collections.
 * All demonstration products are explicitly marked with isDemo: true.
 */

(function () {
  'use strict';

  // Client-specified category definitions with group classification
  const CATEGORIES = [
    // Women's Clothing
    {
      id: 'cat-2pc-churidar',
      name: '2-Piece Churidar Sets',
      slug: '2-piece-churidar-sets',
      group: 'clothing',
      badge: 'Classic Ethnic',
      image: 'assets/images/categories/2-piece-churidar-sets.jpg',
      description: 'Handcrafted kurtis paired with matching comfortable bottoms. Perfect for office wear, casual gatherings, and daytime elegance.'
    },
    {
      id: 'cat-3pc-churidar',
      name: '3-Piece Churidar Sets',
      slug: '3-piece-churidar-sets',
      group: 'clothing',
      badge: 'Festive Wear',
      image: 'assets/images/categories/3-piece-churidar-sets.jpg',
      description: 'Complete festive ensembles with ornate dupattas, intricate zari borders, and regal silhouettes.'
    },
    {
      id: 'cat-lehengas',
      name: 'Designer Lehengas',
      slug: 'designer-lehengas',
      group: 'clothing',
      badge: 'Bridal & Occasion',
      image: 'assets/images/categories/designer-lehengas.jpg',
      description: 'Exquisite bridal, sangeet, and reception lehengas with rich zardozi, sequins, and thread embroidery.'
    },
    {
      id: 'cat-leggings',
      name: 'Cotton Leggings',
      slug: 'cotton-leggings',
      group: 'clothing',
      badge: 'Everyday Comfort',
      image: 'assets/images/categories/cotton-leggings.jpg',
      description: '4-way stretch, breathable bio-wash cotton leggings available in vibrant and essential everyday shades.'
    },
    {
      id: 'cat-sharara',
      name: 'Trendy Sharara Sets',
      slug: 'trendy-sharara-sets',
      group: 'clothing',
      badge: 'Trending',
      image: 'assets/images/categories/trendy-sharara-sets.jpg',
      description: 'Flared tiered sharara bottoms paired with embroidered peplum kurtis and sheer net dupattas.'
    },
    {
      id: 'cat-innerwear',
      name: "Women's Innerwear & Panties",
      slug: 'womens-innerwear-panties',
      group: 'clothing',
      badge: 'Premium Comfort',
      image: 'assets/images/categories/womens-innerwear-panties.jpg',
      description: 'Ultra-soft, seam-free, breathable cotton innerwear crafted for hygiene and all-day ease.'
    },

    // Anti-Tarnish Jewellery
    {
      id: 'cat-bracelets-kadas',
      name: 'Bracelets & Kadas',
      slug: 'bracelets-kadas',
      group: 'anti-tarnish',
      badge: 'Waterproof & Sweatproof',
      image: 'assets/images/categories/bracelets-kadas.jpg',
      description: 'Sleek cuff kadas and tennis bracelets with guaranteed 18K PVD coating that resists water, sweat, and perfumes.'
    },
    {
      id: 'cat-earrings-rings',
      name: 'Trendy Earrings & Rings',
      slug: 'trendy-earrings-rings',
      group: 'anti-tarnish',
      badge: 'Hypoallergenic',
      image: 'assets/images/categories/trendy-earrings-rings.jpg',
      description: 'Modern geometric studs, chunky huggies, and stackable statement rings engineered from surgical-grade titanium steel.'
    },
    {
      id: 'cat-anklets-kolusu',
      name: 'Stylish Anklets & Artificial Silver Kolusu',
      slug: 'stylish-anklets-kolusu',
      group: 'anti-tarnish',
      badge: 'Anti-Tarnish Silver Finish',
      image: 'assets/images/categories/stylish-anklets-kolusu.jpg',
      description: 'Delicate bell-charms and sleek modern silver-tone kolusu anklets that maintain their pristine shine.'
    },
    {
      id: 'cat-fancy-bangles',
      name: 'Fancy Bangles',
      slug: 'fancy-bangles',
      group: 'anti-tarnish',
      badge: 'Everlasting Shine',
      image: 'assets/images/categories/fancy-bangles.jpg',
      description: 'Contemporary textured and gemstone-embedded anti-tarnish bangles designed for effortless luxury stacking.'
    },

    // Gold-Plated & Covering Collection
    {
      id: 'cat-guaranteed-studs',
      name: 'Guaranteed Earrings / Studs',
      slug: 'guaranteed-earrings-studs',
      group: 'gold-plated',
      badge: '1-Year Plating Guarantee',
      image: 'assets/images/categories/guaranteed-earrings-studs.jpg',
      description: 'Micro-plated traditional jhumkas, chandbalis, and daily wear studs with 1-year plating guarantee.'
    },
    {
      id: 'cat-gold-chains',
      name: 'Gold-Plated Chains',
      slug: 'gold-plated-chains',
      group: 'gold-plated',
      badge: 'Authentic 24K Look',
      image: 'assets/images/categories/gold-plated-chains.jpg',
      description: 'Rope, thali, mugappu, and box chains crafted with radiant micro-gold coating mimicking 24K gold jewelry.'
    },
    {
      id: 'cat-covering-bangles',
      name: 'Premium Covering Bangles',
      slug: 'premium-covering-bangles',
      group: 'gold-plated',
      badge: 'Heritage Craft',
      image: 'assets/images/categories/premium-covering-bangles.jpg',
      description: 'Traditional South Indian temple design covering bangles with antique reddish gold micro-plating.'
    }
  ];

  // Demonstration Products Catalog
  const DEMO_PRODUCTS = [
    // -------------------------------------------------------------
    // Category 1: 2-Piece Churidar Sets
    // -------------------------------------------------------------
    {
      id: 'prod-2pc-01',
      name: 'Sultana Chanderi 2-Piece Kurti Set',
      category: '2-Piece Churidar Sets',
      categorySlug: '2-piece-churidar-sets',
      group: 'clothing',
      sections: ['trending', 'clothing'],
      price: 1899,
      originalPrice: 2999,
      discount: '36% OFF',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&crop=top&q=80',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&crop=bottom&q=80'
      ],
      badge: 'Trending',
      sizes: ['M', 'L', 'XL', 'XXL'],
      defaultSize: 'L',
      color: 'Dusty Rose',
      colors: ['Dusty Rose', 'Sage Mint', 'Powder Blue'],
      inStock: true,
      stockQuantity: 12,
      rating: 4.8,
      createdAt: '2026-10-20',
      isDemo: true,
      sku: 'UC-2PC-SULTANA',
      material: 'Pure Chanderi Silk Blend Kurti with Cotton Silk Trousers',
      care: 'Gentle hand wash cold or dry clean. Warm iron inside out. Do not bleach.',
      details: [
        'Calf-length straight kurti with delicate gold gota-patti neckline',
        'Paired with matching elasticated cigarette trousers with pocket',
        'Breathable cotton inner lining ensures day-long comfort',
        'Traditional floral hand-block inspired metallic foil detailing'
      ],
      description: 'Dusty rose floral printed A-line kurti with matching cigarette pants in pure chanderi blend. Perfect for festive daytime gatherings and refined office wear.'
    },
    {
      id: 'prod-2pc-02',
      name: 'Gulmohar Handblock Cotton 2-Piece Set',
      category: '2-Piece Churidar Sets',
      categorySlug: '2-piece-churidar-sets',
      group: 'clothing',
      sections: ['clothing'],
      price: 1499,
      originalPrice: 2199,
      discount: '31% OFF',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&crop=top&q=80',
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&crop=faces&q=80'
      ],
      badge: 'Pure Cotton',
      sizes: ['S', 'M', 'L', 'XL'],
      defaultSize: 'M',
      color: 'Mustard Gold',
      colors: ['Mustard Gold', 'Rust Maroon', 'Indigo Blue'],
      inStock: true,
      stockQuantity: 15,
      rating: 4.6,
      createdAt: '2026-10-18',
      isDemo: true,
      sku: 'UC-2PC-GULMOHAR',
      material: '100% Premium Cambric Cotton (Bio-Washed)',
      care: 'Machine wash cold with like colors. Line dry in shade. Warm iron.',
      details: [
        'Authentic Jaipur handblock prints crafted with azo-free dyes',
        'Straight cut kurti featuring notched Mandarin collar & wooden buttons',
        'Cropped comfort ankle-fit pants with elasticated back waist',
        'Pre-washed and pre-shrunk for guaranteed zero shrinkage'
      ],
      description: 'Jaipuri handblock printed straight kurti paired with cropped ankle trousers. Crafted from breathable cambric cotton for effortless daily charm.'
    },

    // -------------------------------------------------------------
    // Category 2: 3-Piece Churidar Sets
    // -------------------------------------------------------------
    {
      id: 'prod-3pc-01',
      name: 'Gulabi Zari 3-Piece Silk Churidar Set',
      category: '3-Piece Churidar Sets',
      categorySlug: '3-piece-churidar-sets',
      group: 'clothing',
      sections: ['new-arrivals', 'trending', 'clothing'],
      price: 2899,
      originalPrice: 4499,
      discount: '35% OFF',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&crop=top&q=80',
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&crop=center&q=80'
      ],
      badge: 'New Arrival',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      defaultSize: 'M',
      color: 'Rani Pink',
      colors: ['Rani Pink', 'Royal Emerald', 'Deep Plum'],
      inStock: true,
      stockQuantity: 9,
      rating: 4.9,
      createdAt: '2026-10-24',
      isDemo: true,
      sku: 'UC-3PC-GULABI',
      material: 'Chanderi Silk Kurti, Santoon Bottom & Banarasi Weave Organza Dupatta',
      care: 'Dry clean recommended. Store folded inside a muslin cloth bag.',
      details: [
        'Complete festive 3-piece suit with embroidered kurti, churidar & dupatta',
        'Rich antique gold zari weaving along 2.4m sheer organza dupatta',
        'Tailored gather churidar bottom with adjustable drawstrings',
        'Intricate hand-zardozi and mirror-work neckline embellishments'
      ],
      description: 'Premium chanderi silk kurti with hand-embroidered neckline, paired with traditional gather churidar and radiant Banarasi organza dupatta.'
    },
    {
      id: 'prod-3pc-02',
      name: 'Noorani Saffron Festive Anarkali 3-Piece',
      category: '3-Piece Churidar Sets',
      categorySlug: '3-piece-churidar-sets',
      group: 'clothing',
      sections: ['clothing', 'best-sellers'],
      price: 3299,
      originalPrice: 4999,
      discount: '34% OFF',
      image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&auto=format&fit=crop&crop=top&q=80',
        'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&auto=format&fit=crop&crop=center&q=80'
      ],
      badge: 'Festive Pick',
      sizes: ['M', 'L', 'XL'],
      defaultSize: 'L',
      color: 'Peach Gold',
      colors: ['Peach Gold', 'Saffron Yellow', 'Blush Coral'],
      inStock: true,
      stockQuantity: 11,
      rating: 4.7,
      createdAt: '2026-10-14',
      isDemo: true,
      sku: 'UC-3PC-NOORANI',
      material: 'Chanderi Silk Flared Anarkali with Pure Shantoon Lining',
      care: 'Dry clean only to maintain silk luster and golden borders.',
      details: [
        'Dramatic 32-kali flared silhouette with broad hemline border',
        'Micro-sequin and resham thread hand-embroidery on sweetheart yoke',
        'Coordinated matching stretch churidar pants',
        'Feather-light organza dupatta finished with gold scalloped lace'
      ],
      description: 'Radiant flared festive anarkali with woven Banarasi dupatta and matching stretch churidar. A showstopping ensemble for sangeets and celebrations.'
    },

    // -------------------------------------------------------------
    // Category 3: Designer Lehengas
    // -------------------------------------------------------------
    {
      id: 'prod-leh-01',
      name: 'Noor Emerald Velvet Designer Lehenga',
      category: 'Designer Lehengas',
      categorySlug: 'designer-lehengas',
      group: 'clothing',
      sections: ['new-arrivals', 'best-sellers', 'clothing'],
      price: 7999,
      originalPrice: 12999,
      discount: '38% OFF',
      image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=800&auto=format&fit=crop&crop=top&q=80',
        'https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=800&auto=format&fit=crop&crop=bottom&q=80'
      ],
      badge: 'Bridal Edit',
      sizes: ['S', 'M', 'L', 'Semi-Stitched'],
      defaultSize: 'M',
      color: 'Emerald Green',
      colors: ['Emerald Green', 'Royal Navy', 'Wine Velvet'],
      inStock: true,
      stockQuantity: 6,
      rating: 5.0,
      createdAt: '2026-10-25',
      isDemo: true,
      sku: 'UC-LEH-EMERALD',
      material: 'Micro Velvet Skirt & Blouse with Sheer Net Dupatta',
      care: 'Specialist dry clean only. Wrap in muslin fabric away from moisture.',
      details: [
        'Heavy royal zardozi, dori and micro-sequin bridal floral embroidery',
        'Generous 4.5-meter circular flare with double can-can under-layer',
        'Padded sweetheart neckline blouse with handmade bridal latkans',
        'Embroidered scalloped lace borders on sheer net dupatta'
      ],
      description: 'Exquisite deep emerald velvet lehenga with royal gold zardozi embroidery and double can-can flare. Paired with ornate sweetheart blouse and sheer net dupatta.'
    },
    {
      id: 'prod-leh-02',
      name: 'Rani Bagh Bridal Silk Lehenga Choli',
      category: 'Designer Lehengas',
      categorySlug: 'designer-lehengas',
      group: 'clothing',
      sections: ['clothing'],
      price: 8999,
      originalPrice: 14500,
      discount: '38% OFF',
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&crop=top&q=80',
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&crop=center&q=80'
      ],
      badge: 'Royal Heritage',
      sizes: ['M', 'L', 'XL', 'Semi-Stitched'],
      defaultSize: 'L',
      color: 'Bridal Crimson',
      colors: ['Bridal Crimson', 'Maroon Red', 'Hot Pink'],
      inStock: true,
      stockQuantity: 5,
      rating: 4.9,
      createdAt: '2026-10-15',
      isDemo: true,
      sku: 'UC-LEH-RANIBAGH',
      material: 'Pure Raw Silk Skirt, Dupion Silk Choli, Handwoven Organza Dupatta',
      care: 'Dry clean only. Iron on reverse low heat or steam gently.',
      details: [
        'Traditional royal heritage floral jaal hand-embroidered with zari',
        'Customizable semi-stitched skirt with pre-fitted drawstring waistband',
        'Complete with heavy handcrafted hanging latkans and tassels',
        'Includes unstitched blouse piece customizable up to bust size 44"'
      ],
      description: 'Opulent crimson bridal raw silk lehenga woven with antique gold jaal motifs, paired with embroidered choli and organza dupatta with scalloped borders.'
    },

    // -------------------------------------------------------------
    // Category 4: Cotton Leggings
    // -------------------------------------------------------------
    {
      id: 'prod-leg-01',
      name: 'Vedic Pure Cotton Ankle Leggings (Pack of 2)',
      category: 'Cotton Leggings',
      categorySlug: 'cotton-leggings',
      group: 'clothing',
      sections: ['clothing'],
      price: 699,
      originalPrice: 1199,
      discount: '42% OFF',
      image: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=800&auto=format&fit=crop&crop=center&q=80',
        'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=800&auto=format&fit=crop&crop=bottom&q=80'
      ],
      badge: 'Value Pack',
      sizes: ['M', 'L', 'XL', 'XXL', 'Free Size'],
      defaultSize: 'L',
      color: 'Black & White',
      colors: ['Black & White', 'Maroon & Navy', 'Beige & Black'],
      inStock: true,
      stockQuantity: 15,
      rating: 4.7,
      createdAt: '2026-10-10',
      isDemo: true,
      sku: 'UC-LEG-VEDIC',
      material: '95% Super-Combed Cotton, 5% Spandex (4-Way Stretch)',
      care: 'Regular machine wash cold. Do not tumble dry. Do not iron elastic.',
      details: [
        'Pack of 2 versatile essential everyday shades for pairing with kurtis',
        '4-way ultra-stretch fabric ensures full mobility and snug contouring',
        'Soft non-chafing elastic waistband that stays in place all day',
        'Bio-washed anti-pilling fabric technology retains color across washes'
      ],
      description: 'Super combed 4-way stretch cotton leggings pack. Bio-washed for ultra-soft hand feel, zero transparency, and comfortable waistband.'
    },
    {
      id: 'prod-leg-02',
      name: 'Churidar Length Stretch Cotton Leggings (Blush Pink)',
      category: 'Cotton Leggings',
      categorySlug: 'cotton-leggings',
      group: 'clothing',
      sections: ['clothing'],
      price: 449,
      originalPrice: 699,
      discount: '36% OFF',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&crop=center&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&crop=bottom&q=80'
      ],
      badge: 'Essential',
      sizes: ['M', 'L', 'XL', 'Free Size'],
      defaultSize: 'M',
      color: 'Blush Pink',
      colors: ['Blush Pink', 'Coral Peach', 'Ruby Red'],
      inStock: true,
      stockQuantity: 14,
      rating: 4.5,
      createdAt: '2026-10-12',
      isDemo: true,
      sku: 'UC-LEG-BLUSH',
      material: '95% Combed Organic Cotton, 5% Lycra',
      care: 'Gentle machine wash with mild detergent. Warm iron if needed.',
      details: [
        'Full churidar length with graceful traditional ankle gathers',
        'Breathable moisture-wicking natural cotton knit for humid climates',
        'Reinforced crotch gusset for durability and free leg movement',
        'Gentle on skin with zero harsh chemical dyes or irritants'
      ],
      description: 'Churidar-length cotton leggings with graceful gathers at the ankle. Crafted in soft blush pink with resilient 4-way stretch fabric.'
    },

    // -------------------------------------------------------------
    // Category 5: Trendy Sharara Sets
    // -------------------------------------------------------------
    {
      id: 'prod-sha-01',
      name: 'Aafreen Flared Georgette Sharara Set',
      category: 'Trendy Sharara Sets',
      categorySlug: 'trendy-sharara-sets',
      group: 'clothing',
      sections: ['trending', 'clothing'],
      price: 2499,
      originalPrice: 3899,
      discount: '36% OFF',
      image: 'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=800&auto=format&fit=crop&crop=top&q=80',
        'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=800&auto=format&fit=crop&crop=bottom&q=80'
      ],
      badge: 'Hot Pick',
      sizes: ['S', 'M', 'L', 'XL'],
      defaultSize: 'M',
      color: 'Mustard Yellow',
      colors: ['Mustard Yellow', 'Teal Green', 'Dusty Peach'],
      inStock: true,
      stockQuantity: 10,
      rating: 4.8,
      createdAt: '2026-10-22',
      isDemo: true,
      sku: 'UC-SHA-AAFREEN',
      material: 'Pure Faux Georgette with Soft Shantoon Silk Lining',
      care: 'Dry clean only to maintain crisp pleats and flared bounce.',
      details: [
        'Tiered flared sharara bottom with dramatic double ruffled hem',
        'Short peplum style kurti with gota patti borders and tassel tie-ups',
        'Lightweight fluid georgette dupatta with delicate fringe lace',
        'Premium soft shantoon lining avoids clinginess and ensures modesty'
      ],
      description: 'Lustrous flared mustard georgette sharara bottom paired with a mirror-embellished peplum kurti and a flowing sheer dupatta.'
    },
    {
      id: 'prod-sha-02',
      name: 'Nazneen Sequin Mirror-Work Peplum Sharara',
      category: 'Trendy Sharara Sets',
      categorySlug: 'trendy-sharara-sets',
      group: 'clothing',
      sections: ['clothing'],
      price: 2999,
      originalPrice: 4599,
      discount: '35% OFF',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&crop=top&q=80',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&crop=center&q=80'
      ],
      badge: 'Trending',
      sizes: ['M', 'L', 'XL'],
      defaultSize: 'L',
      color: 'Powder Blue',
      colors: ['Powder Blue', 'Lavender Lilac', 'Mint Aqua'],
      inStock: true,
      stockQuantity: 8,
      rating: 4.7,
      createdAt: '2026-10-16',
      isDemo: true,
      sku: 'UC-SHA-NAZNEEN',
      material: 'Viscose Georgette with Resham Thread & Foil Mirror Work',
      care: 'Dry clean only. Steam iron from reverse side on low.',
      details: [
        'Artisan mirror-work and tonal resham embroidery across peplum yoke',
        'Dramatic wide-flared sharara pants with elasticated waistband',
        'Angrakha style peplum kurti with handcrafted side dori latkans',
        'Matching sheer dupatta with all-round mirror lace work'
      ],
      description: 'Powder blue tiered sharara ensemble with handcrafted mirror-work peplum blouse and matching sheer dupatta. An absolute head-turner.'
    },

    // -------------------------------------------------------------
    // Category 6: Women's Innerwear & Panties
    // -------------------------------------------------------------
    {
      id: 'prod-inn-01',
      name: 'Seam-Free Modal Everyday Comfort Briefs (Pack of 3)',
      category: "Women's Innerwear & Panties",
      categorySlug: 'womens-innerwear-panties',
      group: 'clothing',
      sections: ['clothing'],
      price: 549,
      originalPrice: 899,
      discount: '39% OFF',
      image: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=800&auto=format&fit=crop&crop=center&q=80',
        'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=800&auto=format&fit=crop&crop=top&q=80'
      ],
      badge: 'Bestseller',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      defaultSize: 'M',
      color: 'Nude Multi-Pack',
      colors: ['Nude Multi-Pack', 'Pastel Pink & Beige', 'Black & Nude'],
      inStock: true,
      stockQuantity: 15,
      rating: 4.9,
      createdAt: '2026-10-15',
      isDemo: true,
      sku: 'UC-INN-SEAMLESS',
      material: '90% Lenzing Micro Modal, 10% Elastane with 100% Cotton Gusset',
      care: 'Gentle machine wash cold. Do not tumble dry. Use mild detergent.',
      details: [
        'Pack of 3 ultra-smooth seam-free everyday briefs',
        'Zero visible panty lines (VPL) under sarees, churidars, and leggings',
        '100% organic cotton antibacterial gusset ensures all-day hygiene',
        'Tagless design eliminates skin friction, chafing, and redness'
      ],
      description: 'Pack of 3 laser-cut seamless mid-rise panties. Ultra-soft micro modal fabric eliminates panty lines under ethnic churidars and lehengas.'
    },
    {
      id: 'prod-inn-02',
      name: 'CloudSoft Organic Cotton Hipster Briefs (Pack of 4)',
      category: "Women's Innerwear & Panties",
      categorySlug: 'womens-innerwear-panties',
      group: 'clothing',
      sections: ['clothing'],
      price: 649,
      originalPrice: 999,
      discount: '35% OFF',
      image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&auto=format&fit=crop&crop=center&q=80',
        'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&auto=format&fit=crop&crop=bottom&q=80'
      ],
      badge: 'Cotton Comfort',
      sizes: ['S', 'M', 'L', 'XL'],
      defaultSize: 'M',
      color: 'Blush & Grey',
      colors: ['Blush & Grey', 'Pastel Blossom Pack', 'Classic Dark Edit'],
      inStock: true,
      stockQuantity: 14,
      rating: 4.6,
      createdAt: '2026-10-11',
      isDemo: true,
      sku: 'UC-INN-CLOUD',
      material: '95% Combed Organic Cotton, 5% Spandex',
      care: 'Machine wash warm with similar colors. Line dry.',
      details: [
        'Pack of 4 breathable cotton hipster silhouette panties',
        'Full rear coverage for maximum daily support and comfort',
        'Soft ultra-fine stretch waistband that leaves zero marks on hips',
        'Dermatologist tested hypoallergenic organic fabric'
      ],
      description: 'Pack of 4 breathable combed organic cotton hipster panties with non-binding waistband for day-to-night breathable ease.'
    },

    // -------------------------------------------------------------
    // Category 7: Bracelets & Kadas
    // -------------------------------------------------------------
    {
      id: 'prod-bra-01',
      name: 'Celestial Dew Anti-Tarnish Tennis Bracelet',
      category: 'Bracelets & Kadas',
      categorySlug: 'bracelets-kadas',
      group: 'anti-tarnish',
      sections: ['anti-tarnish', 'best-sellers'],
      price: 1299,
      originalPrice: 1999,
      discount: '35% OFF',
      image: 'https://images.unsplash.com/photo-1611591475878-1a5c689fef3f?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1611591475878-1a5c689fef3f?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1611591475878-1a5c689fef3f?w=800&auto=format&fit=crop&crop=center&q=80',
        'https://images.unsplash.com/photo-1611591475878-1a5c689fef3f?w=800&auto=format&fit=crop&crop=top&q=80'
      ],
      badge: 'Waterproof',
      sizes: ['Standard 7"', 'Petite 6.5"'],
      defaultSize: 'Standard 7"',
      color: '18K Yellow Gold',
      colors: ['18K Yellow Gold', 'Silver Rhodium', 'Rose Gold'],
      inStock: true,
      stockQuantity: 12,
      rating: 4.9,
      createdAt: '2026-10-21',
      isDemo: true,
      sku: 'UC-BRA-CELESTIAL',
      material: 'Titanium Steel Base with 18K Real PVD Gold Plating & 5A Cubic Zirconia',
      care: '100% Waterproof, sweatproof, and perfume-safe. Wipe gently with dry cloth.',
      details: [
        '100% Waterproof, sweatproof, and perfume-resistant everyday wear',
        'Seamless 4-prong hand-set AAA brilliant cubic zirconia stones',
        'Double security safety clasp prevents accidental slipping',
        'Hypoallergenic and nickel-free formulated for sensitive skin'
      ],
      description: 'Dazzling 18K gold PVD-plated tennis bracelet studded with precision-cut AAA cubic zirconia. Shower, perfume, and workout-proof.'
    },
    {
      id: 'prod-bra-02',
      name: 'Aura Sleek Oval Anti-Tarnish Kada',
      category: 'Bracelets & Kadas',
      categorySlug: 'bracelets-kadas',
      group: 'anti-tarnish',
      sections: ['anti-tarnish'],
      price: 1099,
      originalPrice: 1699,
      discount: '35% OFF',
      image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&auto=format&fit=crop&crop=center&q=80',
        'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&auto=format&fit=crop&crop=top&q=80'
      ],
      badge: 'Sweatproof',
      sizes: ['Free Size (Hinged)', 'Size 2.4 / Small', 'Size 2.6 / Medium'],
      defaultSize: 'Free Size (Hinged)',
      color: '18K Yellow Gold',
      colors: ['18K Yellow Gold', 'Rose Gold'],
      inStock: true,
      stockQuantity: 10,
      rating: 4.8,
      createdAt: '2026-10-17',
      isDemo: true,
      sku: 'UC-BRA-AURA',
      material: 'Surgical Grade 316L Stainless Steel with 18K PVD Mirror Coating',
      care: 'Waterproof and perfume safe. Store in provided velvet pouch when not in use.',
      details: [
        'Sleek minimalist oval cuff silhouette suited for wrist stacking',
        'Ergonomic hidden push-lock hinge mechanism for effortless wear',
        'Sweat, perfume, and shower-proof everyday anti-tarnish shield',
        'Will never turn green, tarnish, or lose its mirror polish'
      ],
      description: 'Minimalist oval cuff kada with hidden side clasp. Crafted from surgical-grade titanium steel with lifetime shine warranty.'
    },

    // -------------------------------------------------------------
    // Category 8: Trendy Earrings & Rings
    // -------------------------------------------------------------
    {
      id: 'prod-err-01',
      name: 'Solitaire Glitz Anti-Tarnish Stacking Rings',
      category: 'Trendy Earrings & Rings',
      categorySlug: 'trendy-earrings-rings',
      group: 'anti-tarnish',
      sections: ['anti-tarnish', 'new-arrivals'],
      price: 849,
      originalPrice: 1299,
      discount: '35% OFF',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&crop=center&q=80',
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&crop=top&q=80'
      ],
      badge: 'Stackable',
      sizes: ['Adjustable (Size 6-8)', 'Size 6', 'Size 7', 'Size 8'],
      defaultSize: 'Adjustable (Size 6-8)',
      color: '18K Gold Finish',
      colors: ['18K Gold Finish', 'Silver Rhodium'],
      inStock: true,
      stockQuantity: 15,
      rating: 4.8,
      createdAt: '2026-10-23',
      isDemo: true,
      sku: 'UC-ERR-SOLITAIRE',
      material: '316L Stainless Steel with 18K PVD Coating & Solitaire Zircon',
      care: 'Completely waterproof and soap-proof. Wear during hand washing without worry.',
      details: [
        'Set of 2 stackable rings: 1 solitaire diamond cut + 1 micro-pave eternity band',
        'Waterproof anti-tarnish finish suitable for daily sanitizer and soap contact',
        'Precision laser cut band for comfortable, snag-free daily wear',
        'Adjustable open-band design fits sizes 6 through 8 smoothly'
      ],
      description: 'Duo of stackable bands featuring a radiant 1-carat solitaire cut and an eternity pavé band. 18K gold PVD coated and waterproof.'
    },
    {
      id: 'prod-err-02',
      name: 'Croissant Chunky Anti-Tarnish Huggie Hoops',
      category: 'Trendy Earrings & Rings',
      categorySlug: 'trendy-earrings-rings',
      group: 'anti-tarnish',
      sections: ['anti-tarnish'],
      price: 899,
      originalPrice: 1399,
      discount: '36% OFF',
      image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&auto=format&fit=crop&crop=center&q=80',
        'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&auto=format&fit=crop&crop=top&q=80'
      ],
      badge: 'Best Huggie',
      sizes: ['Free Size (20mm Hoop)'],
      defaultSize: 'Free Size (20mm Hoop)',
      color: '18K Yellow Gold',
      colors: ['18K Yellow Gold', 'Rose Gold'],
      inStock: true,
      stockQuantity: 11,
      rating: 4.7,
      createdAt: '2026-10-18',
      isDemo: true,
      sku: 'UC-ERR-CROISSANT',
      material: 'Hollow Surgical Steel with Thick 18K PVD Gold Electroplating',
      care: 'Waterproof & sweatproof. Wipe with soft cloth to restore high luster.',
      details: [
        'Sculptural Parisian ribbed croissant dome silhouette',
        'Ultra-lightweight hollow construction prevents earlobe pulling',
        'Secure click-top huggie clasp closure that locks with a reassuring snap',
        '100% Hypoallergenic and resistant to swimming, showers & perfumes'
      ],
      description: 'Chunky ribbed croissant huggie hoops. Ultra-lightweight hollow core engineered for day-to-night comfort and zero ear irritation.'
    },

    // -------------------------------------------------------------
    // Category 9: Stylish Anklets & Artificial Silver Kolusu
    // -------------------------------------------------------------
    {
      id: 'prod-ank-01',
      name: 'Silver Bell Traditional Kolusu Anklets',
      category: 'Stylish Anklets & Artificial Silver Kolusu',
      categorySlug: 'stylish-anklets-kolusu',
      group: 'anti-tarnish',
      sections: ['anti-tarnish'],
      price: 799,
      originalPrice: 1249,
      discount: '36% OFF',
      image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&auto=format&fit=crop&crop=center&q=80',
        'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&auto=format&fit=crop&crop=bottom&q=80'
      ],
      badge: 'Traditional Silver',
      sizes: ['Pair (10.5" Length)', 'Single (10.5" Length)'],
      defaultSize: 'Pair (10.5" Length)',
      color: 'Artificial Silver Finish',
      colors: ['Artificial Silver Finish', 'Antique Oxidised Silver'],
      inStock: true,
      stockQuantity: 13,
      rating: 4.8,
      createdAt: '2026-10-19',
      isDemo: true,
      sku: 'UC-ANK-KOLUSU',
      material: 'White Brass Base with Pure Rhodium / Anti-Tarnish Silver Electro-Coating',
      care: 'Anti-tarnish silver finish that does not blacken with moisture or water.',
      details: [
        'Pair of 2 traditional South Indian artificial silver kolusu',
        'Musical tinkling ghungroo bell drops with delicate link chains',
        'Tarnish-resistant silver polish that will not oxidize or blacken',
        'Sturdy traditional S-hook clasp with extension loops for custom fit'
      ],
      description: 'Traditional South Indian artificial silver kolusu pair with musical bell charms. Treated with anti-tarnish rhodium coating to maintain pristine silver brilliance.'
    },
    {
      id: 'prod-ank-02',
      name: 'Evil Eye Charm Anti-Tarnish Sleek Anklet',
      category: 'Stylish Anklets & Artificial Silver Kolusu',
      categorySlug: 'stylish-anklets-kolusu',
      group: 'anti-tarnish',
      sections: ['anti-tarnish', 'trending'],
      price: 699,
      originalPrice: 1099,
      discount: '36% OFF',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&crop=center&q=80',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&crop=top&q=80'
      ],
      badge: 'Modern Chic',
      sizes: ['Free Size (9" + 2" Extender)'],
      defaultSize: 'Free Size (9" + 2" Extender)',
      color: '18K Gold Finish',
      colors: ['18K Gold Finish', 'Silver Rhodium'],
      inStock: true,
      stockQuantity: 12,
      rating: 4.6,
      createdAt: '2026-10-14',
      isDemo: true,
      sku: 'UC-ANK-EVILEYE',
      material: '316L Stainless Steel with Glass Enamel Evil Eye Bead',
      care: '100% Waterproof. Wear safely to beach, pool, and daily shower.',
      details: [
        'Minimalist satellite bead chain with protective Greek evil-eye charm',
        'Waterproof, sweatproof, and vacation-friendly titanium construction',
        'Adjustable 2-inch extender chain accommodates all ankle sizes',
        'Lobster claw fastening ensures secure everyday wear'
      ],
      description: 'Delicate satellite chain anklet with vibrant protective blue evil eye bead. Waterproof, sweatproof, and vacation-ready.'
    },

    // -------------------------------------------------------------
    // Category 10: Fancy Bangles
    // -------------------------------------------------------------
    {
      id: 'prod-ban-01',
      name: 'Twisted Cable Fancy Anti-Tarnish Bangles',
      category: 'Fancy Bangles',
      categorySlug: 'fancy-bangles',
      group: 'anti-tarnish',
      sections: ['anti-tarnish'],
      price: 1399,
      originalPrice: 2199,
      discount: '36% OFF',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&crop=top&q=80',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&crop=center&q=80'
      ],
      badge: 'Stack Essential',
      sizes: ['Size 2.4', 'Size 2.6', 'Size 2.8', 'Free Size (Open Cuff)'],
      defaultSize: 'Size 2.6',
      color: '18K Yellow Gold',
      colors: ['18K Yellow Gold', 'Rose Gold & Silver Duo'],
      inStock: true,
      stockQuantity: 10,
      rating: 4.8,
      createdAt: '2026-10-19',
      isDemo: true,
      sku: 'UC-BAN-CABLE',
      material: 'Flexible Titanium Cable with 18K Real Gold PVD Finish',
      care: 'Sweatproof and perfume safe. Wipe with soft cloth to maintain brilliant shine.',
      details: [
        'Set of 2 designer twisted cable stacking bangles',
        'Flexible memory wire structure effortlessly fits wrist contours',
        'Tarnish-free and won’t lose shine even with daily water contact',
        'Fluted ball end-caps studded with micro cubic zirconia'
      ],
      description: 'Set of 2 twisted helix anti-tarnish bangles with cubic zirconia end-caps. Modern luxury stacking piece designed for daily elegance.'
    },
    {
      id: 'prod-ban-02',
      name: 'Zircon Starlight Anti-Tarnish Open Bangle',
      category: 'Fancy Bangles',
      categorySlug: 'fancy-bangles',
      group: 'anti-tarnish',
      sections: ['anti-tarnish', 'best-sellers'],
      price: 1199,
      originalPrice: 1899,
      discount: '37% OFF',
      image: 'https://images.unsplash.com/photo-1611591475878-1a5c689fef3f?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1611591475878-1a5c689fef3f?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1611591475878-1a5c689fef3f?w=800&auto=format&fit=crop&crop=center&q=80',
        'https://images.unsplash.com/photo-1611591475878-1a5c689fef3f?w=800&auto=format&fit=crop&crop=top&q=80'
      ],
      badge: 'Statement',
      sizes: ['Size 2.4', 'Size 2.6', 'Size 2.8'],
      defaultSize: 'Size 2.6',
      color: '18K Yellow Gold',
      colors: ['18K Yellow Gold', 'Silver Rhodium'],
      inStock: true,
      stockQuantity: 9,
      rating: 4.7,
      createdAt: '2026-10-15',
      isDemo: true,
      sku: 'UC-BAN-STARLIGHT',
      material: 'Solid Stainless Steel with 18K PVD Coating & Starburst Cut Zircons',
      care: '100% Waterproof. Store in provided pouch after wear.',
      details: [
        'Contemporary open bypass bangle silhouette',
        'Celestial starlight cluster encrusted with brilliant cut stones',
        'Waterproof luxury piece suitable for gym, work, and parties',
        'Scratch-resistant mirror polish outer shank'
      ],
      description: 'Open bypass bangle featuring pavé starburst motifs. Sleek, waterproof, and coated with 18K real gold PVD finish.'
    },

    // -------------------------------------------------------------
    // Category 11: Guaranteed Earrings / Studs
    // -------------------------------------------------------------
    {
      id: 'prod-gpe-01',
      name: 'Kundan Meenakari Handcrafted Jhumkas',
      category: 'Guaranteed Earrings / Studs',
      categorySlug: 'guaranteed-earrings-studs',
      group: 'gold-plated',
      sections: ['gold-plated', 'best-sellers'],
      price: 1599,
      originalPrice: 2499,
      discount: '36% OFF',
      image: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800&auto=format&fit=crop&crop=top&q=80',
        'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800&auto=format&fit=crop&crop=bottom&q=80'
      ],
      badge: '1-Year Guarantee',
      sizes: ['Free Size (Earrings)'],
      defaultSize: 'Free Size (Earrings)',
      color: 'Ruby Red & Green',
      colors: ['Ruby Red & Green', 'Pearl White & Gold', 'Emerald Green'],
      inStock: true,
      stockQuantity: 10,
      rating: 4.9,
      createdAt: '2026-10-24',
      isDemo: true,
      sku: 'UC-GPE-JHUMKA',
      material: 'Copper Brass Alloy with 1-Gram 24K Micro Gold Plating & Hand Meenakari',
      care: 'Avoid direct spray of perfumes and water. Wipe dry and store in airtight box.',
      details: [
        '1-Year Guaranteed Micro Gold Covering Polish with replacement warranty',
        'Traditional dome bell jhumka with natural cluster seed pearl drops',
        'Foil-backed high-refraction Kundan stone settings',
        'Traditional screw-back post for secure comfortable wear'
      ],
      description: 'Micro-gold plated traditional bell jhumkas with authentic South Indian kemp stones, seed pearls, and a 1-year plating guarantee.'
    },
    {
      id: 'prod-gpe-02',
      name: 'Nagapadam South Indian Covering Studs',
      category: 'Guaranteed Earrings / Studs',
      categorySlug: 'guaranteed-earrings-studs',
      group: 'gold-plated',
      sections: ['gold-plated'],
      price: 999,
      originalPrice: 1599,
      discount: '38% OFF',
      image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&auto=format&fit=crop&crop=center&q=80',
        'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&auto=format&fit=crop&crop=top&q=80'
      ],
      badge: '1-Year Guarantee',
      sizes: ['Free Size (Earrings)'],
      defaultSize: 'Free Size (Earrings)',
      color: 'Ruby Red',
      colors: ['Ruby Red', 'Emerald Green', 'Ruby & Pearl'],
      inStock: true,
      stockQuantity: 12,
      rating: 4.7,
      createdAt: '2026-10-17',
      isDemo: true,
      sku: 'UC-GPE-NAGAPADAM',
      material: 'Heritage Brass with 24K Micro Gold Coating & Synthetic Ruby Cabochons',
      care: 'Store in moisture-free pouch. Avoid chemicals, perfumes, and chlorinated water.',
      details: [
        '1-Year Guarantee covering finish with authentic South Indian heritage design',
        'Classic Nagapadam snake-hood motif popular in Kerala & Tamil Nadu',
        'Rich reddish-gold antique matte covering finish mimicking solid 22K gold',
        'Fitted with Bombay screw-back posts for zero slipping'
      ],
      description: 'Heritage Kerala Nagapadam ruby studs crafted with authentic 1-gram gold covering finish and 1-year plating warranty.'
    },

    // -------------------------------------------------------------
    // Category 12: Gold-Plated Chains
    // -------------------------------------------------------------
    {
      id: 'prod-gpc-01',
      name: 'Royal Heritage 24K Micro Gold-Plated Chain',
      category: 'Gold-Plated Chains',
      categorySlug: 'gold-plated-chains',
      group: 'gold-plated',
      sections: ['gold-plated', 'trending'],
      price: 1899,
      originalPrice: 2999,
      discount: '37% OFF',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&crop=center&q=80',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&crop=top&q=80'
      ],
      badge: '24K Gold Look',
      sizes: ['20 Inches', '24 Inches', '28 Inches'],
      defaultSize: '24 Inches',
      color: '24K Micro Gold Finish',
      colors: ['24K Micro Gold Finish'],
      inStock: true,
      stockQuantity: 11,
      rating: 4.9,
      createdAt: '2026-10-21',
      isDemo: true,
      sku: 'UC-GPC-HERITAGE',
      material: 'Solid Copper-Brass Core with 1-Gram 24K Triple Micro Gold Electroplating',
      care: 'Clean with a dry microfibre cloth. Avoid soaking in soaps or acidic water.',
      details: [
        '1-Year Replacement Guarantee on gold plating',
        'Dense diamond-cut twisted rope link provides brilliant light reflection',
        'Authentic traditional look identical to real 22K/24K solid gold chains',
        'Equipped with heavy-duty S-hook clasp'
      ],
      description: 'Diamond-cut rope chain electroplated with 1-gram 24K micro gold. Indistinguishable from authentic yellow gold jewelry.'
    },
    {
      id: 'prod-gpc-02',
      name: 'Mugappu Daily Wear Covering Gold Chain',
      category: 'Gold-Plated Chains',
      categorySlug: 'gold-plated-chains',
      group: 'gold-plated',
      sections: ['gold-plated'],
      price: 1699,
      originalPrice: 2699,
      discount: '37% OFF',
      image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&crop=center&q=80',
        'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&crop=top&q=80'
      ],
      badge: 'Temple Motif',
      sizes: ['24 Inches', '30 Inches'],
      defaultSize: '24 Inches',
      color: 'Ruby Mugappu (Gold)',
      colors: ['Ruby Mugappu (Gold)', 'Emerald Mugappu (Gold)'],
      inStock: true,
      stockQuantity: 13,
      rating: 4.8,
      createdAt: '2026-10-13',
      isDemo: true,
      sku: 'UC-GPC-MUGAPPU',
      material: 'Traditional Covering Base with 1-Gram Gold Coat & Kemp Gemstones',
      care: 'Wipe with soft cloth after daily wear. Store separately from imitation jewellery.',
      details: [
        '1-Year Guarantee on micro-gold plating',
        'Side-mounted temple motif mugappu pendant with kemp stones',
        'Comfortable flat-link chain that won’t pinch or catch hair',
        'Ideal for daily wear, mangalsutra replacement, or temple visits'
      ],
      description: 'Traditional South Indian mugappu chain featuring a side floral brooch studded with kemp rubies. 1-year plating guarantee.'
    },

    // -------------------------------------------------------------
    // Category 13: Premium Covering Bangles
    // -------------------------------------------------------------
    {
      id: 'prod-gpb-01',
      name: 'Temple Lakshmi Matte Finish Covering Bangles',
      category: 'Premium Covering Bangles',
      categorySlug: 'premium-covering-bangles',
      group: 'gold-plated',
      sections: ['gold-plated', 'best-sellers'],
      price: 1799,
      originalPrice: 2899,
      discount: '38% OFF',
      image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&crop=center&q=80',
        'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&crop=top&q=80'
      ],
      badge: 'Heritage Matte',
      sizes: ['Pair (Size 2.4)', 'Pair (Size 2.6)', 'Pair (Size 2.8)'],
      defaultSize: 'Pair (Size 2.6)',
      color: 'Antique Temple Gold',
      colors: ['Antique Temple Gold', 'Red Kemp & Gold'],
      inStock: true,
      stockQuantity: 8,
      rating: 4.9,
      createdAt: '2026-10-22',
      isDemo: true,
      sku: 'UC-GPB-LAKSHMI',
      material: 'Brass Metal Base with Antique 1-Gram Gold Plating & Kemp Stones',
      care: 'Do not spray perfume directly. Store in cotton wrap inside jewel box.',
      details: [
        'Set of 2 authentic South Indian temple covering bangles',
        'Intricate embossed Goddess Lakshmi figures flanked by royal elephants',
        'Matte antique reddish gold finish that replicates traditional heritage jewelry',
        '1-Year Plating Guarantee against premature discoloration'
      ],
      description: 'Set of 2 antique matte finish covering bangles embossed with Goddess Lakshmi motifs and kemp stones. Guaranteed 1-year finish.'
    },
    {
      id: 'prod-gpb-02',
      name: 'Palakka Heritage Daily Wear Covering Bangles',
      category: 'Premium Covering Bangles',
      categorySlug: 'premium-covering-bangles',
      group: 'gold-plated',
      sections: ['gold-plated'],
      price: 1499,
      originalPrice: 2299,
      discount: '35% OFF',
      image: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800&auto=format&fit=crop&crop=center&q=80',
        'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800&auto=format&fit=crop&crop=top&q=80'
      ],
      badge: '1-Year Guarantee',
      sizes: ['Pair (Size 2.4)', 'Pair (Size 2.6)', 'Pair (Size 2.8)'],
      defaultSize: 'Pair (Size 2.6)',
      color: 'Palakka Green & Ruby',
      colors: ['Palakka Green & Ruby', 'Ruby Red & Gold'],
      inStock: true,
      stockQuantity: 10,
      rating: 4.8,
      createdAt: '2026-10-16',
      isDemo: true,
      sku: 'UC-GPB-PALAKKA',
      material: 'Micro-Gold Plated Brass with Emerald Green Palakka Glass Stones',
      care: 'Store in the provided pouch. Wipe dry after prolonged moisture contact.',
      details: [
        'Set of 2 authentic Kerala Palakka heritage design covering bangles',
        'Vibrant emerald green leaf-shaped glass stones with central ruby stone',
        'Durable micro-gold electroplating formulated for daily wear',
        '1-Year Covering Guarantee'
      ],
      description: 'Traditional Kerala Palakka leaf design covering bangles with emerald glass inlays and gold bead trim. 1-year plating guarantee.'
    }
  ];

  // Pre-seed demo stocks, image galleries, SKUs, and specifications across all catalog items
  DEMO_PRODUCTS.forEach((p, idx) => {
    // 1. Stock Quantities (Demo)
    if (typeof p.stockQuantity !== 'number') {
      if (p.inStock === false) {
        p.stockQuantity = 0;
      } else {
        const demoStocks = [8, 12, 6, 15, 9, 4, 14, 7, 10, 5, 11, 8, 13];
        p.stockQuantity = demoStocks[idx % demoStocks.length];
      }
    }

    // 2. High-res Multi-Image Gallery
    // Strictly preserve product-specific images only; never cross-pollinate with unrelated products
    if (!Array.isArray(p.images) || p.images.length === 0) {
      p.images = [p.image];
    }

    // 3. SKU
    if (!p.sku) {
      p.sku = 'UC-' + p.id.replace('prod-', '').toUpperCase();
    }

    // 4. Fabric / Material & Details
    if (!p.material) {
      if (p.group === 'clothing') {
        p.material = p.category.includes('Churidar') ? 'Premium Chanderi Silk Blend Kurti with Cotton Bottom' :
                     p.category.includes('Lehenga') ? 'Raw Silk & Velvet with Zardozi Embroidery' :
                     p.category.includes('Leggings') ? '95% Combed Bio-Wash Cotton, 5% Lycra (4-Way Stretch)' :
                     p.category.includes('Sharara') ? 'Pure Georgette with Shantoon Inner Lining' :
                     'Ultra-Breathable Micro Modal & Organic Cotton';
      } else if (p.group === 'anti-tarnish') {
        p.material = 'Surgical Grade 316L Stainless Steel with 18K Real PVD Gold Coating (Waterproof & Hypoallergenic)';
      } else {
        p.material = 'High-Grade Brass Base with Authentic 1-Gram 24K Micro Gold Plating (1-Year Plating Guarantee)';
      }
    }

    // 5. Care Instructions
    if (!p.care) {
      if (p.group === 'clothing') {
        p.care = p.category.includes('Lehenga') || p.category.includes('Sharara') ?
          'Dry clean only. Store in muslin cloth. Keep away from direct harsh sunlight.' :
          'Gentle machine wash cold with similar colors. Warm iron inside out. Do not bleach.';
      } else if (p.group === 'anti-tarnish') {
        p.care = '100% Waterproof, sweatproof, and perfume-safe. Wipe gently with a soft dry cloth after prolonged ocean wear.';
      } else {
        p.care = 'Keep away from direct contact with alcohol-based perfumes, lotions, and harsh soaps. Store in the provided pouch.';
      }
    }

    // 6. Delivery & Return Specs
    if (!p.deliveryInfo) {
      p.deliveryInfo = 'Dispatches in 24-48 business hours. Free delivery across India on orders above ₹999. Standard delivery timeline: 3-5 business days.';
    }
  });

  // Catalog service API with rich query & filtering engine
  const ProductService = {
    /**
     * Normalize category slug or search alias for robust URL parameter handling
     * Handles variations such as 'churidhar' vs 'churidar' and group aliases
     * @param {string} raw
     * @returns {string} Normalized canonical slug or group name
     */
    normalizeCategorySlug: function (raw) {
      if (!raw) return 'all';
      const slug = String(raw).trim().toLowerCase();

      const ALIASES = {
        // 2-Piece Churidar
        '2-piece-churidhar-sets': '2-piece-churidar-sets',
        '2-piece-churidar': '2-piece-churidar-sets',
        '2-piece-churidhar': '2-piece-churidar-sets',
        '2-pc-churidar': '2-piece-churidar-sets',
        '2-pc-churidhar': '2-piece-churidar-sets',
        '2-piece': '2-piece-churidar-sets',
        'churidar': '2-piece-churidar-sets',
        'churidhar': '2-piece-churidar-sets',

        // 3-Piece Churidar
        '3-piece-churidhar-sets': '3-piece-churidar-sets',
        '3-piece-churidar': '3-piece-churidar-sets',
        '3-piece-churidhar': '3-piece-churidar-sets',
        '3-pc-churidar': '3-piece-churidar-sets',
        '3-pc-churidhar': '3-piece-churidar-sets',
        '3-piece': '3-piece-churidar-sets',

        // Designer Lehengas
        'lehengas': 'designer-lehengas',
        'lehenga': 'designer-lehengas',
        'designer-lehenga': 'designer-lehengas',

        // Cotton Leggings
        'leggings': 'cotton-leggings',
        'cotton-legging': 'cotton-leggings',

        // Trendy Sharara Sets
        'sharara': 'trendy-sharara-sets',
        'sharara-sets': 'trendy-sharara-sets',
        'trendy-sharara': 'trendy-sharara-sets',

        // Women's Innerwear & Panties
        'innerwear': 'womens-innerwear-panties',
        'innerwear-panties': 'womens-innerwear-panties',
        'panties': 'womens-innerwear-panties',
        'womens-innerwear': 'womens-innerwear-panties',

        // Anti-Tarnish Jewellery
        'bracelets': 'bracelets-kadas',
        'kadas': 'bracelets-kadas',
        'earrings': 'trendy-earrings-rings',
        'rings': 'trendy-earrings-rings',
        'earrings-rings': 'trendy-earrings-rings',
        'anklets': 'stylish-anklets-kolusu',
        'kolusu': 'stylish-anklets-kolusu',
        'anklets-kolusu': 'stylish-anklets-kolusu',
        'bangles': 'fancy-bangles',

        // Guaranteed Gold-Plated & Covering
        'studs': 'guaranteed-earrings-studs',
        'guaranteed-studs': 'guaranteed-earrings-studs',
        'chains': 'gold-plated-chains',
        'gold-chains': 'gold-plated-chains',
        'covering-bangles': 'premium-covering-bangles',
        'gold-covering-bangles': 'premium-covering-bangles',

        // Group slugs & aliases
        'anti-tarnish-collection': 'anti-tarnish',
        'anti-tarnish': 'anti-tarnish',
        'gold-plated-collection': 'gold-plated',
        'guaranteed-gold-plated-covering-collection': 'gold-plated',
        'guaranteed-gold-plated-collection': 'gold-plated',
        'covering-collection': 'gold-plated',
        'gold-plated': 'gold-plated',
        'clothing-collection': 'clothing',
        'womens-clothing': 'clothing',
        'clothing': 'clothing',
        'jewellery': 'jewellery',
        'fine-jewellery': 'jewellery'
      };

      if (ALIASES[slug]) return ALIASES[slug];

      const found = CATEGORIES.find(c => c.slug === slug || c.name.toLowerCase() === slug);
      if (found) return found.slug;

      return slug;
    },

    getCategories: function () {
      return CATEGORIES;
    },

    getCategoryBySlug: function (slug) {
      if (!slug) return null;
      const normSlug = this.normalizeCategorySlug(slug);
      return CATEGORIES.find(c => c.slug === normSlug || c.slug === slug) || null;
    },

    getCategoriesByGroup: function (group) {
      if (!group) return CATEGORIES;
      return CATEGORIES.filter(c => c.group === group);
    },

    getAllProducts: function () {
      return DEMO_PRODUCTS;
    },

    getProductById: function (id) {
      return DEMO_PRODUCTS.find(p => p.id === id) || null;
    },

    getProductsByCategory: function (categorySlug) {
      if (!categorySlug || categorySlug === 'all') return DEMO_PRODUCTS;
      const normSlug = this.normalizeCategorySlug(categorySlug);
      return DEMO_PRODUCTS.filter(p => p.categorySlug === normSlug);
    },

    getProductsByGroup: function (group) {
      if (!group) return DEMO_PRODUCTS;
      return DEMO_PRODUCTS.filter(p => p.group === group);
    },

    getProductsBySection: function (sectionKey) {
      return DEMO_PRODUCTS.filter(p => p.sections && p.sections.includes(sectionKey));
    },

    searchProducts: function (query) {
      if (!query || typeof query !== 'string') return [];
      const q = query.trim().toLowerCase();
      return DEMO_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.color && p.color.toLowerCase().includes(q))
      );
    },

    /**
     * Comprehensive multi-parameter filtering and sorting engine
     */
    filterProducts: function (options) {
      const opts = options || {};
      let results = [...DEMO_PRODUCTS];

      // 1. Group filter (clothing, anti-tarnish, gold-plated, jewellery)
      if (opts.group) {
        if (opts.group === 'jewellery') {
          results = results.filter(p => p.group === 'anti-tarnish' || p.group === 'gold-plated');
        } else {
          results = results.filter(p => p.group === opts.group);
        }
      }

      // 2. Category slug filter
      if (opts.categorySlug && opts.categorySlug !== 'all') {
        const normSlug = this.normalizeCategorySlug(opts.categorySlug);
        results = results.filter(p => p.categorySlug === normSlug);
      }

      // 3. Search query
      if (opts.searchQuery && opts.searchQuery.trim() !== '') {
        const q = opts.searchQuery.trim().toLowerCase();
        results = results.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
        );
      }

      // 4. Price range
      if (typeof opts.minPrice === 'number' && !isNaN(opts.minPrice)) {
        results = results.filter(p => p.price >= opts.minPrice);
      }
      if (typeof opts.maxPrice === 'number' && !isNaN(opts.maxPrice)) {
        results = results.filter(p => p.price <= opts.maxPrice);
      }

      // 5. Size filter
      if (opts.size && opts.size !== 'all') {
        results = results.filter(p => p.sizes && p.sizes.includes(opts.size));
      }

      // 6. Color filter
      if (opts.color && opts.color !== 'all') {
        results = results.filter(p => {
          if (p.color && p.color.toLowerCase() === opts.color.toLowerCase()) return true;
          if (Array.isArray(p.colors) && p.colors.some(c => c.toLowerCase() === opts.color.toLowerCase())) return true;
          return false;
        });
      }

      // 7. In stock only
      if (opts.inStockOnly) {
        results = results.filter(p => p.inStock === true);
      }

      // 8. Sorting
      const sortBy = opts.sortBy || 'recommended';
      switch (sortBy) {
        case 'price-asc':
          results.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          results.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'recommended':
        default:
          results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
      }

      return results;
    },

    getAvailableColors: function () {
      const colors = new Set();
      DEMO_PRODUCTS.forEach(p => {
        if (p.color) colors.add(p.color);
        if (Array.isArray(p.colors)) {
          p.colors.forEach(c => colors.add(c));
        }
      });
      return Array.from(colors);
    },

    getAvailableSizes: function () {
      const sizes = new Set();
      DEMO_PRODUCTS.forEach(p => {
        if (p.sizes) {
          p.sizes.forEach(s => sizes.add(s));
        }
      });
      return Array.from(sizes);
    },

    formatPrice: function (amount) {
      return '₹' + Number(amount).toLocaleString('en-IN');
    },

    /**
     * Fetch related products for product details page
     * @param {string} productId
     * @param {number} [limit=4]
     * @returns {Array} List of related products
     */
    getRelatedProducts: function (productId, limit = 4) {
      const current = this.getProductById(productId);
      if (!current) return DEMO_PRODUCTS.slice(0, limit);

      // Match same category first
      let matches = DEMO_PRODUCTS.filter(p => p.id !== productId && p.categorySlug === current.categorySlug);

      // If fewer than limit, add items from same group
      if (matches.length < limit) {
        const groupMatches = DEMO_PRODUCTS.filter(p => p.id !== productId && p.group === current.group && !matches.some(m => m.id === p.id));
        matches = matches.concat(groupMatches);
      }

      // If still fewer, add other top products
      if (matches.length < limit) {
        const others = DEMO_PRODUCTS.filter(p => p.id !== productId && !matches.some(m => m.id === p.id));
        matches = matches.concat(others);
      }

      return matches.slice(0, limit);
    },

    /**
     * Safe helper to get gallery images array
     * Strictly preserves product-specific images only
     * @param {Object} product
     * @returns {Array} Array of image URLs
     */
    getProductImages: function (product) {
      if (!product) return [];
      if (Array.isArray(product.images) && product.images.length > 0) {
        return product.images;
      }
      return [product.image];
    }
  };

  // Expose to window
  window.ProductService = ProductService;
})();
