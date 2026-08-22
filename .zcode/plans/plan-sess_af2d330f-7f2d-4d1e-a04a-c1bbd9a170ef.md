# Website Optimization Plan — Arteviaindia

The site is a Vite + React 19 SPA (not Astro) with a 555KB JS bundle, 403KB CSS, and a 187MB `public/` folder of unoptimized PNGs. Biggest wins are image conversion and bundle/SEO fixes.

## 1. Image optimization (largest win — ~185MB saved)
- Convert all PNGs/JPGs in `public/static/img/` to WebP using `sips`/`cwebp` (via `npx @squoosh/cli` or ImageMagick if available):
  - Portfolio/social images: max 1600px wide, quality ~80
  - Team photos & logo: max 800px, logo additionally at 2 sizes (nav ~200px, hero ~600px)
- Replace all references in `App.tsx` and `EventsPage.tsx` with the new `.webp` files. Originals remain recoverable via git history; I'll commit before converting so nothing is lost.
- Compress/resize the 2 MP4s if trivially possible (ffmpeg if installed); otherwise leave.

## 2. Loading attributes on images
- Add `loading="lazy"` + `decoding="async"` + explicit `width`/`height` to every `<img>` (0 of 7 in App.tsx have them today). Hero image/logo stays eager but gets `fetchpriority="high"` and a `<link rel="preload">` in index.html.

## 3. Dependency cleanup
- Remove unused packages: `three`, `d3`, `recharts`, `@tanstack/react-query`, `octokit`, `@octokit/core`, `next-themes`, `marked`, `date-fns`, `vaul`, `sonner`, `cmdk`, `input-otp`, `react-day-picker`, `react-resizable-panels`, `uuid`, and all Radix/shadcn packages not imported in `src/` (keeping accordion, button, card, dialog, input, label, separator, textarea and their radix primitives).
- Verify build passes after removal.

## 4. Code splitting
- Lazy-load `EventsPage` via `React.lazy` + `Suspense` (dynamic `import()`) so the `/events` page isn't in the main bundle.
- Evaluate lazy-importing `@emailjs/browser` and `framer-motion` where practical; if framer-motion can't be split easily, leave as-is (still fine once EventsPage is split).

## 5. SEO / head full pass
- `index.html`: static title, meta description, canonical, Open Graph + Twitter card tags (with an OG image — will use an optimized site image), theme-color.
- Add favicon (generate from `artevia-logo.png` at reduced size) + apple-touch-icon.
- Self-host the Inter font (download woff2, `@font-face` with `font-display: swap`, preload) — removes render-blocking Google Fonts CSS.
- Add `robots.txt` and `sitemap.xml` (arteviaindia.com domain — confirm actual domain from Vercel/deploy config or code before writing).
- Move the JS-injected meta description logic to static tags (keep JS version only where it's page-specific like /events keywords).

## 6. CSS trim (light touch)
- Check whether the 403KB CSS shrinks naturally after dependency removal; prune obviously unused custom animation/utilities in `src/index.css` only if safe. No risky refactor.

## 7. Verification
- `npm run build` after each phase; compare `dist/` size and asset sizes before/after.
- Run `npm run preview` and click through `/` and `/events` in the browser to confirm images, animations, and the contact form still work.

**Expected result:** public/ from 187MB → ~10–20MB, faster first paint (self-hosted fonts, preloaded hero), smaller main JS chunk, real favicon/OG/sitemap.