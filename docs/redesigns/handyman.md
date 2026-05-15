# M.A. Handyman Services — Redesign Brief

**Goal:** Make this site look 10x better. Move it from "first-version landing page" to "a confident local-services site that converts visitors to inquiries."

**Repo:** `https://github.com/Sheldon-Pierce/HandymanServices`
**Local clone:** `/Users/sheldon/projects/PersonalProjects/HandyManWeb/handymanservices`
**Deployed at:** `https://handyman-services-one.vercel.app`
**Stack:** Next.js 14 (Pages Router), Chakra UI 2, Tailwind CSS, Framer Motion, nodemailer

**How to use this brief:** `cd` into the local clone, run `claude`, paste this brief as the first message, then say "execute it."

---

## How to run a fresh session here

```bash
cd /Users/sheldon/projects/PersonalProjects/HandyManWeb/handymanservices
claude
```

---

## Current state (what's there today)

Single-page site:
- Slate-700 background everywhere
- "M.A. Handyman Services" header + "Servicing Kirkland, WA" subtitle
- `/public/main.jpeg` — owner-with-dog photo
- One paragraph of generic copy
- Facebook social icon → `facebook.com/Handyman.Aguilar`
- "Inquire" button opens a modal form (name, number, email, address, service info, contact preferences)
- Form submits to `/api/sendEmail` via nodemailer
- Footer

No phone number, no services grid, no testimonials, no before/afters.

---

## What MUST be preserved (do not break)

- `/api/sendEmail` endpoint and the nodemailer flow — keep it working end-to-end
- `FormModal` payload shape: `{ name, number, email, address, serviceInfo, phone, emailCheck, text }`
- `AlertModal` for success/error feedback
- Facebook link to `facebook.com/Handyman.Aguilar`
- `/public/main.jpeg` (use it — restyled, not removed)
- Solo-operator voice ("I am…", first person)
- "Kirkland, WA" service area

---

## Design direction

### Color palette

- Primary navy: `#0F2742` (confident, trustworthy)
- Accent orange: `#EA7C1C` (warm, energetic — primary CTAs)
- Cream background: `#F8F5F0` (warm, not white)
- Text on cream: `#1A1A1D`
- Subtle gray for muted UI: `#9CA3AF`

**Drop `bg-slate-700` everywhere.** That's the biggest "looks unfinished" tell.

### Typography

Import via `next/font`:
- Display: **Fraunces** (variable, weights 400-900) — slightly serif, warm, fits a craft trade
- Body: **Inter** — clean, neutral

Apply Fraunces to all h1/h2, Inter to body.

### Layout (top to bottom)

1. **Nav** — fixed, transparent on hero, solid on scroll. Logo "M.A. Handyman" on left, "Inquire" CTA button on right.

2. **Hero** — cream background.
   - Big bold headline: "Trusted home repair in Kirkland, WA."
   - Subhead: "M.A. Handyman Services — fixing what needs fixing, doing it right the first time."
   - Two CTAs: primary orange "Get a quote" (opens form modal), secondary outline "Call now" (`tel:+1XXXXXXXXXX` placeholder)
   - Right side: the `/public/main.jpeg` photo in a rounded card with subtle shadow

3. **Services grid** — white background.
   - Section heading: "What I do"
   - 6 service cards (use inline SVG icons or `react-icons/fi` if you install it):
     - General Repairs
     - Plumbing
     - Electrical
     - Painting
     - Carpentry
     - Furniture Assembly
   - Each card: icon (40px) + name + one-line description ("Leaky faucets, running toilets, anything that drips.")
   - Hover: subtle lift + accent border

4. **About** — cream background.
   - Two columns. Photo (`main.jpeg`) on left, content on right.
   - Heading: "Meet your handyman."
   - Bio paragraph: "I'm M.A. I've been doing handyman work in Kirkland for [X] years. I show up when I say I will, do quality work, and leave your place cleaner than I found it. _[Leave the X for the owner to fill in.]_"
   - Below: a "Why work with me" list — 3 short rows (Quality work, Honest pricing, Local & reliable) with check icons.

5. **Testimonials** — white background.
   - Section heading: "What clients say"
   - Three quote cards. **Use clearly-placeholder content**, e.g., `"_Add a real testimonial here. Replace this card with a real review from a happy client._"` — do NOT fabricate fake reviews.

6. **Final CTA** — navy background, white text.
   - Big heading: "Got a project? Let's talk."
   - Subhead: "Tell me what you need fixed and I'll get back to you within 24 hours."
   - Primary orange "Get a quote" button (opens form modal)
   - Phone link below: `tel:+1XXXXXXXXXX` (placeholder)
   - Code comment in the source: `{/* TODO: replace with M.A.'s real phone number */}`

7. **Footer** — keep the existing Footer component, restyled to match.
   - © year M.A. Handyman Services
   - Kirkland, WA
   - Facebook icon link

### FormModal restyle

Same fields, same submit endpoint, much better visuals:
- White card, rounded corners, generous padding
- Inputs: rounded, light gray border, clear focus state (orange ring)
- Section title: "Get a free quote"
- Submit button: primary orange, full width
- Cancel link below: subtle gray text

### Motion

Use Framer Motion (already installed):
- Each section: `whileInView` fade-up + slight scale, viewport `once: true, margin: "-80px"`
- Service cards: staggered cascade (50ms between each)
- Hero text: subtle reveal on mount
- All motion respects `prefers-reduced-motion`

### Mobile-first responsive

- Hero: stacks (photo above text) on `< 768px`
- Services grid: 1-col mobile, 2-col tablet, 3-col desktop
- About: stacks on mobile
- Testimonials: horizontal scroll on mobile (or stacked)
- Test every section at 390px width

---

## How to execute

1. **Read first**: `pages/index.tsx`, `pages/formModal.tsx`, `pages/footer.tsx`, `pages/alertModal.tsx`, `pages/_app.tsx`, `pages/api/sendEmail.ts`, `tailwind.config.ts`, `styles/globals.css`.
2. **Plan**: list the components to touch. The current `pages/index.tsx` should be replaced top-to-bottom; you'll likely split it into small section components under a new `components/` directory.
3. **Set up the design system first**:
   - Import Fraunces + Inter via `next/font/google` in `pages/_app.tsx`
   - Extend the Chakra theme (palette, fonts, button variants) in a new `theme.ts`
   - Wire the theme into the ChakraProvider
   - Update `tailwind.config.ts` if you keep using Tailwind for layout — but consider going Chakra-only for consistency
4. **Build section-by-section**:
   - Nav → Hero → Services → About → Testimonials → Final CTA → Footer
   - After each section, run `npm run dev`, open `http://localhost:3000`, verify visually at desktop + mobile widths
5. **Restyle the FormModal** last — easy win, contained scope.
6. **Verify**: `npm run build` (must pass), `npm run lint` (must pass).
7. **Commit progressively** — one commit per section, NOT one big "everything" commit. The user has explicit feedback on this. Suggested commits:
   - `chore(theme): wire Fraunces + Inter fonts and extend Chakra theme`
   - `feat(nav): add fixed nav with scroll-triggered solid background`
   - `feat(hero): redesign hero with cream palette and dual CTAs`
   - `feat(services): add 6-card services grid`
   - `feat(about): two-column about-the-owner section`
   - `feat(testimonials): 3-card placeholder testimonials section`
   - `feat(cta): navy final-CTA section`
   - `feat(modal): restyle FormModal to match new design`
   - `chore: remove old slate-700 monolith page`
8. **Push to `origin/main`** when done. Vercel auto-deploys.

---

## Open items the owner needs to fill in later

- Real phone number (search for `tel:+1XXXXXXXXXX` placeholders and the `TODO` comment)
- Real testimonials (replace placeholder cards)
- Years in business (search for `[X] years`)
- Whether the services grid list matches what M.A. actually offers — verify with the owner

---

## After this redesign ships

Come back to the portfolio (`~/projects/PersonalProjects/sheldonpierce-com`), re-capture the Handyman screenshots:

```bash
cd /Users/sheldon/projects/PersonalProjects/sheldonpierce-com
node scripts/capture-screenshots.mjs handyman-services
```

Then commit the new screenshots to the portfolio repo and push.
