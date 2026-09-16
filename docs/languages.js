/*
 * RTNP documentation — language display registry.
 * =====================================================================
 * This is just the picker's display list (native name + English name).
 * WHICH languages are actually available is decided PER PRODUCT in
 * docs/products.js (each product's `langs` array). So:
 *   • to add a language to a product → edit docs/products.js + add the content file
 *   • add a row here only if the language isn't listed yet (need its endonym)
 *
 * code = ISO code; must match the content file name (ta → content/<product>/ta.html)
 *        and is used as <html lang="…"> (drives the per-script font in shell.css).
 * =====================================================================
 */
window.RTNP_LANGS = [
  { code: 'hi', endonym: 'हिन्दी',   english: 'Hindi'   },
  { code: 'te', endonym: 'తెలుగు',   english: 'Telugu'  },
  { code: 'en', endonym: 'English',  english: 'English' },
  { code: 'bn', endonym: 'বাংলা',    english: 'Bengali' },
  { code: 'mr', endonym: 'मराठी',    english: 'Marathi' },
  { code: 'ta', endonym: 'தமிழ்',    english: 'Tamil'   },
  { code: 'or', endonym: 'ଓଡ଼ିଆ',    english: 'Odia'    },
  { code: 'ne', endonym: 'नेपाली',   english: 'Nepali'  },
];
