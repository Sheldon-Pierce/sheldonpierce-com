# sheldonpierce.com — Design Spec

**Date:** 2026-05-15
**Author:** Sheldon Pierce (with Claude)
**Status:** Approved — ready for implementation plan
**Domain:** sheldonpierce.com (already owned by user; DNS handoff documented in §10)

---

## 1. Goals & Audience

A personal portfolio website to **show off engineering work for potential freelance clients**. The site should feel polished, contemporary, and visually pleasing — closer to an agency case-study site than an engineering blog.

**Primary audience:** Freelance prospects evaluating "can this person build what I need?" — often semi-technical, image-driven, time-constrained.

**Secondary audience:** Anyone Sheldon points to the site (recruiters, peers, network).

**Success criteria:**
- First impression communicates senior, polished, current
- Visitor sees real work (with screenshots) within 2 scrolls
- A freelance prospect can find a contact path in <10 seconds
- Lighthouse Performance ≥ 95 on mobile

**Non-goals:**
- Not a job-hunt site (no big "Available for hire" banner, no resume download)
- Not an engineering blog (no code-snippet-heavy case studies by default)
- Not a CMS — content is committed source, not authored in a UI

---

## 2. Visual System

**Aesthetic direction:** Modern Dark / Bold with motion-forward "wow factor." Image-led.

**Palette:**
- Background: near-black `#0A0A0B`
- Foreground: off-white `#EDEDEF`
- Accent: electric violet → cyan gradient (`#7C3AED` → `#06B6D4`), used for highlights, CTAs, and motion accents
- Muted: `#1A1A1D` (cards), `#9CA3AF` (secondary text)

**Typography:**
- Display & body: Geist Sans (via `next/font`)
- Numerics, tech tags, monospace: Geist Mono
- Hero name uses a heavy display weight; section headings use semibold; body uses regular

**Spacing & layout:**
- Generous whitespace — section gaps ~96px desktop, ~64px mobile
- Mobile-first responsive (1-col → 2-col → 3-col breakpoints)
- Subtle SVG noise overlay on dark sections so the page never feels flat

**Image treatment:**
- Case-study cards are image-led: image ~70% of card height, text below or overlaid on hover
- Ken-burns slow zoom on hover for work cards
- Parallax (0.7× scroll speed) on case-study hero images
- All images served via Next.js `<Image>` with AVIF/WebP

---

## 3. Architecture

**Stack:**
- **Framework:** Next.js 15 (App Router, React Server Components)
- **Styling:** Tailwind CSS v4
- **Motion:** Framer Motion
- **Content:** MDX for case studies (`@next/mdx` or `next-mdx-remote-client`)
- **Hosting:** Vercel
- **Domain:** sheldonpierce.com via custom domain on Vercel
- **Repo:** GitHub private repo `Sheldon-Pierce/sheldonpierce-com`

**Folder layout:**
```
sheldonpierce-com/
├── app/
│   ├── layout.tsx              # Global shell, fonts, theme
│   ├── page.tsx                # Landing page (all sections)
│   ├── work/[slug]/page.tsx    # Case-study detail
│   └── globals.css             # Tailwind entry + custom CSS vars
├── components/
│   ├── hero/                   # Hero + animated name
│   ├── featured-work/          # Featured case-study card
│   ├── work-grid/              # Grid of remaining work
│   ├── case-study/             # Detail-page primitives (hero, gallery, lightbox)
│   ├── about/
│   ├── contact/
│   ├── nav/                    # Fixed nav, transparent→solid on scroll
│   ├── motion/                 # Reusable Framer Motion primitives
│   │   ├── MagneticButton.tsx
│   │   ├── FadeUpOnScroll.tsx
│   │   ├── ParallaxImage.tsx
│   │   ├── CursorFollower.tsx
│   │   └── PageTransition.tsx
│   └── ui/                     # Buttons, badges, etc.
├── content/work/               # Case studies as MDX
│   ├── keycloak-theme.mdx
│   ├── handyman-services.mdx
│   ├── west-seattle-blog.mdx
│   ├── adoreal-platform.mdx
│   ├── capital-finder.mdx
│   └── urban-trail.mdx
├── lib/
│   ├── work.ts                 # MDX loader, frontmatter parser
│   └── motion.ts               # Shared motion config
├── public/
│   └── work/                   # Placeholder images, user replaces with real screenshots
├── docs/
│   └── design.md               # This file
├── next.config.ts
├── tailwind.config.ts          # If needed; Tailwind v4 prefers CSS-first
├── tsconfig.json
└── package.json
```

**Routing:**
- `/` — landing page (all sections, smooth-scroll anchors)
- `/work/[slug]` — case-study detail page (one per MDX file)
- 404 — custom branded 404 page

**Content model (MDX frontmatter):**
```yaml
---
slug: keycloak-theme
title: Adoreal Keycloak Theme & Consumer Login
year: 2026
featured: true               # only one true at a time
role: Engineering lead
stack: [Next.js, Keycloak, Keycloakify, React, TypeScript]
liveUrl: null                # optional
repoUrl: null                # optional (omit for private/work)
heroImage: /work/keycloak-theme/hero.png
gallery:
  - /work/keycloak-theme/login.png
  - /work/keycloak-theme/totp.png
  - /work/keycloak-theme/email.png
summary: One-line description used on cards.
---

(MDX body: Problem / Approach / Result paragraphs, no code by default)
```

---

## 4. Page Structure

**Landing page sections (top to bottom):**

| # | Section | Notes |
|---|---|---|
| 1 | Fixed Nav | Transparent on hero, solid on scroll. Links: Work, About, Contact. |
| 2 | Hero | Full viewport. Animated name + typed subtitle + scroll indicator. |
| 3 | Featured Case Study | Single large card with parallax hero image, year/title, summary, "Read case study" link. |
| 4 | Selected Work | 3-col responsive grid (1-col mobile, 2-col tablet). 5 remaining cards. |
| 5 | About | Two-column: short bio + tech stack/skills list. Photo slot optional. |
| 6 | Contact | Big email link to `pierce55@icloud.com`, GitHub, LinkedIn (URL TBD by user). |
| 7 | Footer | © Sheldon Pierce · Seattle · year. |

**Case-study detail page sections:**

| # | Section | Notes |
|---|---|---|
| 1 | Scroll progress bar | Thin, accent-color, fixed at top. |
| 2 | Hero | Full-width parallax image + title + year + role. |
| 3 | Problem · Approach · Result | Three short paragraphs. No code blocks by default. |
| 4 | Image gallery | 2–4 supporting screenshots with captions. Click to lightbox. |
| 5 | Stack & links | Tech badges + live link / GitHub if public. |
| 6 | Next case study | "Up next →" link to keep visitor on site. |

---

## 5. Content — Case Studies

| # | Slug | Title | Featured? | Source |
|---|---|---|---|---|
| 1 | `keycloak-theme` | Adoreal Keycloak Theme & Consumer Login | **Yes** | Adoreal PRs #27, #39, #41, #42, #53, #54, #55, #57, #62, #63, #70 (2026) |
| 2 | `handyman-services` | Handyman Services | No | github.com/Sheldon-Pierce/HandymanServices (2023) |
| 3 | `west-seattle-blog` | West Seattle Blog | No | github.com/Sheldon-Pierce/WestSeattleBlog (2023) |
| 4 | `adoreal-platform` | Adoreal Platform Engineering | No | Combined card: core-security 2.0 (PR #26), NuGet migration (PRs #315/#316, #98/#99), Terraform (PR #950) |
| 5 | `capital-finder` | Capital Finder | No | github.com/Sheldon-Pierce/capital-finder (2023) |
| 6 | `urban-trail` | UrbanTrail | No | github.com/Sheldon-Pierce/UrbanTrail (2023) |

**Case-study copy:** Drafted by Claude based on PR titles, memory context, and public repo READMEs. User reviews and edits before launch.

**Images:** Claude creates labeled placeholder slots (`/public/work/<slug>/hero.png`, `gallery-1.png`, etc.) with clear naming. User drops in real screenshots before launch.

---

## 6. Motion System

**On load (1.5s total budget):**
1. Background fades from pure black to `#0A0A0B` with violet→cyan gradient bloom (300ms)
2. Nav slides down from top (200ms, eased)
3. Hero name reveals letter-by-letter with Y-axis blur clearing (50ms per letter stagger)
4. Subtitle types itself in (~600ms)
5. Scroll indicator pulses softly

**On scroll:**
- Section headings: fade-up + slight scale (0.95→1) on viewport entry
- Featured case-study image: parallax at 0.7× scroll speed
- Work grid cards: staggered fade-up cascade (50ms between)
- Background gradient orb drifts based on scroll position

**On hover:**
- Work cards: ken-burns zoom (1.0→1.05 over 600ms), accent glow behind card, text overlay slides up
- Buttons / nav links: magnetic attraction within 80px radius, accent underline draws left-to-right
- Custom cursor: glowing dot follows mouse on desktop; grows/recolors over interactive elements

**Between pages (landing ↔ case study):**
- Accent-color sweep wipe transition (400ms)
- Browser back maintains scroll position

**Case-study page:**
- Hero: parallax + ken-burns slow zoom on load
- Gallery: click-to-lightbox with smooth zoom-in from thumbnail position
- Scroll progress bar at top

**Accessibility & performance:**
- `prefers-reduced-motion: reduce` — all decorative motion disabled; only essential 100ms transitions remain
- Cursor follower disabled on touch (`@media (hover: hover)`)
- All motion target 60fps on mid-range mobile
- No motion blocks content access

---

## 7. Build Phases

| # | Phase | Deliverable |
|---|---|---|
| 1 | Foundation | Next.js 15 + Tailwind v4 scaffold, fonts (Geist Sans/Mono), theme tokens, base layout |
| 2 | Motion primitives | Reusable `<MagneticButton>`, `<FadeUpOnScroll>`, `<ParallaxImage>`, `<CursorFollower>`, page-transition wrapper. All respect `prefers-reduced-motion`. |
| 3 | Hero section | Animated name, typed subtitle, scroll indicator, gradient orb |
| 4 | Featured case-study card | Image slot, parallax, tilt-on-hover, link to detail page |
| 5 | Work grid | 3-col responsive grid, hover effects, MDX-driven |
| 6 | Case-study detail pages | `/work/[slug]` dynamic route, MDX rendering, image gallery + lightbox, scroll progress bar |
| 7 | About / Contact / Footer | Two-column about, big email link, GitHub/LinkedIn, copyright |
| 8 | Polish & deploy | Page transitions, SEO meta + OG image, sitemap, robots.txt, Lighthouse pass (≥95 perf), Vercel deploy, sheldonpierce.com DNS handoff |

---

## 8. Division of Labor

**Claude builds:**
- All scaffolding, components, motion primitives
- All case-study copy (drafted from PR history + memory; user reviews)
- Placeholder image slots with clear filenames
- Full deploy pipeline to Vercel
- DNS setup instructions doc

**User provides:**
- Real screenshots to replace placeholders (instructions provided)
- LinkedIn URL
- Any copy edits after reviewing drafts
- Final approval before DNS cutover

---

## 9. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Image-heavy + motion tanks Lighthouse | Next.js `<Image>` (AVIF/WebP), motion budgeted per section, lazy-load below fold |
| MDX adds build complexity | Lean setup, minimal plugin surface area |
| DNS cutover downtime | Deploy to Vercel preview URL first, user approves, then flip DNS — ~10 min cutover |
| Case-study copy doesn't match user's voice | All copy reviewable before launch; revision pass before DNS flip |
| Motion looks "too much" on first impression | Per-section motion list reviewed in spec; `prefers-reduced-motion` honored; A/B easy to dial down post-launch |

---

## 10. DNS Setup (sheldonpierce.com → Vercel)

To be documented in detail in a separate handoff doc after Vercel deploy succeeds. High-level:

1. In Vercel project settings → Domains → add `sheldonpierce.com` and `www.sheldonpierce.com`
2. Vercel provides DNS records (A record for apex, CNAME for www) or asks you to point nameservers
3. Log into current registrar (Namecheap / Google Domains / etc — confirm at handoff time) and update records
4. Wait for propagation (5–60 min typically)
5. Vercel auto-issues TLS cert via Let's Encrypt
6. Verify `https://sheldonpierce.com` and `https://www.sheldonpierce.com` both load the new site

Existing site at sheldonpierce.com (if any) should be backed up before cutover.

---

## 11. Out of Scope (for v1)

Things explicitly NOT in this build, to keep scope tight:

- Blog / writing section (can be added later as `/writing` route with MDX)
- Analytics (can be added post-launch via Vercel Analytics or Plausible)
- Contact form (a `mailto:` link is enough for v1)
- Dark/light theme toggle (dark only; matches the "modern dark / bold" direction)
- Internationalization
- CMS / admin UI
- "Available for hire" chip (explicitly declined by user)
- Code snippets in case studies (visual-led, per user direction)
- A resume download button

---

## 12. Open Items at Spec Approval

- [ ] User's LinkedIn URL
- [ ] Decision on photo for About section (include / omit)
- [ ] Current registrar for sheldonpierce.com (collected at DNS-handoff time)
- [ ] Existing sheldonpierce.com site contents — to be backed up or replaced cleanly?

---

## 13. Approval

This spec was approved by Sheldon on 2026-05-15 after a section-by-section walkthrough.

**Next step:** Hand off to `superpowers:writing-plans` skill to produce the detailed implementation plan.
