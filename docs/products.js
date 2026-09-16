/*
 * RTNP documentation — product registry.
 * =====================================================================
 * Two products share the same shell: the Web Portal guide and the Mobile App guide.
 * Content lives at  docs/content/<product>/<lang>.html  and each product declares
 * which languages it currently ships (`langs`). Screenshots are per-product folders.
 *
 * To add a language to a product: create docs/content/<product>/<lang>.html and add
 *   the language code to that product's `langs` array below.
 * To add a whole new product: add an entry here + a docs/content/<code>/ folder.
 *
 * `name` is shown on the product switcher, per display language (falls back to `en`).
 * =====================================================================
 */
window.RTNP_PRODUCTS = [
  {
    code: 'web',
    icon: '💻',
    name: { en: 'Web Portal', hi: 'वेब पोर्टल', te: 'వెబ్ పోర్టల్' },
    langs: ['hi', 'te'],
  },
  {
    code: 'mobile',
    icon: '📱',
    name: { en: 'Mobile App', hi: 'मोबाइल ऐप', te: 'మొబైల్ యాప్' },
    langs: ['hi'],
  },
];
