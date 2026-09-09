# Deco Galleria Website

## Goal
Build a polished, fully responsive multi-page website for Deco Galleria Inc. using the supplied logo and a bright, eco-conscious visual language: crisp off-whites, pale oak tones, earthy green accents, charcoal type, bright architectural imagery, restrained shadows, and subtle motion.

## Pages and navigation
- **Home** — immersive light-wood interior opening, brand promise, quick stats, featured product families, quality highlights, service area, and bulk-order callout.
- **About** — company story, Pascal Angelini, quality commitment, and Los Angeles / Orange County coverage.
- **WPC Panels** — indoor/outdoor applications, specifications, finish swatches, benefits, and installation gallery.
- **PU Stone** — lightweight stone applications, key characteristics, finishes, and project imagery.
- **UV Marble Sheets** — seamless slab appearance, specifications, finish options, and interior examples.
- **Gallery** — filterable project portfolio for Living Room, Bedroom, Kitchen, Exterior, and Commercial.
- **Why Choose Us** — eight clear product-quality cards: termite proof, environmentally friendly, anti-corrosive, waterproof, low maintenance, scratch resistant, durable, and mold resistant.
- **Bulk Orders** — trade-program benefits, project types, discount callout, and quote entry point.
- **FAQ** — accessible expandable answers covering installation, care, durability, delivery, and Sun Valley pickup.
- **Contact** — validated contact form with success state, business details, hours, map/location link, phone, and email.

## Shared experience
- Use the uploaded Deco Galleria logo in the header/footer and derive the favicon from it.
- Create a consistent header, desktop navigation, polished mobile menu, footer, floating mobile call action, and reusable page-title treatment.
- Add a working Quick Quote modal for homeowners and contractors with project type, material, area, quantity/coverage inputs, contact details, client-side validation, and a clear estimate/request summary.
- Add tactile finish swatches for natural oak, ash, walnut, charcoal, light marble, and stone selections where relevant.
- Use semantic buttons, accessible labels, keyboard-friendly dialogs/accordions, visible focus states, and strong contrast.

## Visual and motion system
- Establish reusable semantic tokens for the white/off-white surfaces, light wood neutrals, earthy greens, charcoal typography, borders, shadows, and small corner radii.
- Use a clean sans-serif type pairing and generous editorial spacing rather than a dark luxury treatment.
- Generate a cohesive set of bright, high-resolution architectural product images showing the actual materials in living rooms, bedrooms, kitchens, exteriors, and commercial spaces.
- Apply restrained fade-up reveals, image zoom on hover, menu/modal transitions, and reduced-motion fallbacks.

## Technical implementation
- Use TanStack Start file-based routes and typed links for every page; each route receives unique title, description, Open Graph metadata, and a single page heading.
- Build shared product, gallery, feature, FAQ, contact, and quote components to keep layouts consistent.
- Keep all colors and typography in the global design system; use existing React/Tailwind patterns and Lucide icons.
- Contact and quote submissions will be polished front-end flows with validation and success states; no email delivery, database, or persistent lead storage is included unless a backend is added later.
- Verify desktop and mobile layouts, navigation, filters, accordions, forms, modal behavior, image rendering, and route loading in the live preview.
