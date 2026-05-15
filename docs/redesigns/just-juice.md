# Just Juice — Redesign Brief

**Goal:** Polish this app from "MVP / course project" to "real e-commerce brand a customer would buy from." Same identity, much higher visual fidelity.

**Repo:** `https://github.com/Sheldon-Pierce/Just-Juice-React`
**Local clone (created already by a prior session):** `/Users/sheldon/projects/PersonalProjects/JustJuice/Just-Juice-React`
**Deployed at:** `https://just-juice.onrender.com` (Render free tier — cold-starts slowly)
**Stack:** React 18 + Redux Toolkit + Chakra UI 2 + Formik/Yup + framer-motion (client) / Node + Express + MongoDB (server)

**How to use this brief:** `cd` into the local clone, run `claude`, paste this brief, then say "execute it."

---

## How to run a fresh session here

```bash
cd /Users/sheldon/projects/PersonalProjects/JustJuice/Just-Juice-React
claude
```

---

## Critical: Only touch the client

- Modify only files under `client/`
- The `server/` directory is the live Express/MongoDB backend — touching it could take production down
- Don't change Redux state shape, action types, or reducers (you can add new selectors/actions if needed for new UI; don't break existing ones)
- All API calls to the server stay the same — endpoints, payloads, response handling

---

## Current state (visual audit from the deployed site)

- Light theme, orange accent (juice-y vibe is right, just under-developed)
- Small "juice cup" icon + "Just Juice" wordmark in the nav
- Nav: Logo / Products / Cart / dark-mode toggle / Sign In / Sign Up
- **Home** (`/`): split — text on left ("Just Juice / Quench Your Thirst / Discover now →"), 3-bottle photo on right. Empty below the fold.
- **Products** (`/products`): grid of small product cards, NEW/SOLD-OUT badges, names like B-1, F-3, ratings, $9.99 price, small cart icon. Functional but cramped.
- **Cart** (`/cart`): yellow "Your cart is empty" banner, mostly blank page
- **Sign In / Sign Up** screens exist

Bones are fine. Visual polish is what's missing.

---

## Design direction

### Color palette

- Primary orange: `#E26B1F` (a deeper, richer orange than current — feels more premium)
- Cream background: `#FDFBF6`
- Surface white: `#FFFFFF` (for cards)
- Deep charcoal text: `#1F1B17` (warmer than pure black)
- Muted text: `#6B6360`
- Fresh-green accent: `#3F8A4B` (sparingly — for "in stock" tags, success badges)
- Border subtle: `#E8DFD3`

### Typography

Install via `npm install @fontsource/fraunces @fontsource/inter` (or import via Google Fonts in `client/public/index.html` to avoid the install).

- Display / wordmark / headings: **Fraunces** (variable, weights 400-900) — warm slightly-serif, fits a craft juice brand
- Body / UI: **Inter** — clean, neutral

### Chakra theme

This is the highest-leverage file to change. Create `client/src/theme/index.js` and export an extended theme:

```js
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: { initialColorMode: "light", useSystemColorMode: false },
  colors: {
    brand: {
      50:  "#FDF4EC",
      100: "#FAE5D0",
      200: "#F4C597",
      300: "#EFA862",
      400: "#EA8A33",
      500: "#E26B1F",   // primary
      600: "#B5541A",
      700: "#883E13",
      800: "#5B280D",
      900: "#2D1306",
    },
    surface: { 50: "#FDFBF6", 100: "#F8F2E5", muted: "#6B6360" },
    text:    { primary: "#1F1B17", muted: "#6B6360" },
    fresh:   { 500: "#3F8A4B" },
  },
  fonts: {
    heading: `"Fraunces", Georgia, serif`,
    body:    `"Inter", system-ui, -apple-system, sans-serif`,
  },
  styles: {
    global: {
      body: { bg: "surface.50", color: "text.primary" },
    },
  },
  components: {
    Button: {
      baseStyle: { borderRadius: "full", fontWeight: 600 },
      variants: {
        solid: {
          bg: "brand.500",
          color: "white",
          _hover: { bg: "brand.600", transform: "translateY(-1px)" },
          _active: { bg: "brand.700" },
        },
        outline: {
          borderColor: "brand.500",
          color: "brand.500",
          _hover: { bg: "brand.50" },
        },
      },
    },
    Container: { baseStyle: { maxW: "container.xl" } },
  },
});

export default theme;
```

Wire it in `client/src/index.js`:
```jsx
import theme from "./theme";
// ...
<ChakraProvider theme={theme}>
```

That alone propagates new colors + fonts + button styles + container max-width to every page. Massive polish gain per LOC.

### Page-by-page direction

#### Home (`/` — `LandingScreen.js`)

Replace the existing hero. New layout:

1. **Hero**: Cream background. Two-column on desktop, stacked on mobile.
   - Left: "Cold-pressed juice, delivered." (Fraunces heavy display weight), subhead "Real fruit, real veggies, real recipes. No concentrate, no shortcuts.", primary "Shop the menu" + secondary "Try a sample pack" CTAs.
   - Right: the existing 3-bottle photo, larger, in a rounded card with subtle drop shadow.

2. **Value-prop strip** (3 icons + label): "Cold-pressed" · "Locally sourced" · "Free local delivery"

3. **Featured juices** strip: 4 product cards in a row (use the existing product list, take first 4). Each card big enough to show juice photo + name + price + "Add to cart" button.

4. **How it works** (3 numbered steps): Pick → Press → Deliver

5. **Footer CTA**: "Hungry for more?" → button to `/products`

#### Products (`/products` — `ProductsScreen.js` + `ProductCard.js`)

1. **Hero strip** (small, ~200px): "Our juices" heading, "All flavors, freshly pressed every morning" subhead, on cream
2. **Filter bar** below: category pills (All / Energy / Detox / Citrus / Greens) — wire to filter state if easy, otherwise pure UI placeholder
3. **Sort dropdown** on the right
4. **Grid**: 3-col desktop, 2-col tablet, 1-col mobile. Each card:
   - Square photo (object-cover), much bigger than current
   - Badge in top-left (NEW / SOLD OUT)
   - Below photo: name (Fraunces semibold), price (bold orange)
   - Rating + review count (small, muted)
   - "Add to cart" button — full-width, primary orange, appears on hover (desktop) or always (mobile)
   - Card hover: subtle lift + shadow

There's commented-out code in `ProductCard.js` that hints at the original structure — use it as a reference but rebuild cleanly.

#### Cart (`/cart` — `CartScreen.js`)

1. **Empty state** (when cart has no items):
   - Centered illustration (a styled juice-cup SVG or large orange Heroicon)
   - "Your cart is feeling empty" (Fraunces, large)
   - "Pick a juice or two — we'll deliver them fresh." (muted body)
   - Primary "Shop the menu" button → `/products`

2. **Populated state**:
   - Two columns: line-items on left (60% width), order summary card on right (40%)
   - Each line-item row: image (small thumbnail) / name / qty stepper / unit price / line total / remove icon
   - Order summary: Subtotal, Shipping (or "Free"), Total, "Checkout" primary button
   - Mobile: stack vertically (line-items above summary)

#### Sign In / Sign Up (`LoginScreen.js`, `RegistrationScreen.js`)

- Center a card on cream background, max-width 420px
- Card: white, rounded, subtle shadow
- Heading "Sign in" / "Sign up" (Fraunces)
- Form: clean inputs with proper labels above (not floating)
- Primary orange button, full-width
- Link below: "Don't have an account? Sign up" → switches screens

#### Nav (`Navbar.js`)

- Bigger logo + wordmark, both vertically centered
- Wordmark in Fraunces, semibold
- Nav links: clean spacing, hover underline in brand orange
- "Sign in" as ghost button, "Sign up" as solid primary
- Cart icon with badge (item count), subtle bounce when item added
- Dark-mode toggle: keep if it works cleanly; remove if half-baked
- Sticky on scroll with a subtle bottom border

---

## Pre-existing bugs to fix while you're there

The prior session's audit caught these — fix in passing:

- `client/package.json`: `axois: ^0.0.1-security` (typo, malicious squat). Rename to `axios` with a current version, or remove if unused.
- `Navbar.js`: `useColorModeValue` called inside a `NavLink` callback — violates React hook rules. Lift it to the top of the parent component.
- `ProductScreen.js`: `new Date(...).toDateString` is missing `()` — should be `new Date(...).toDateString()`.
- `CartOrderSummary.js`: `const navigate = useNavigate` (not invoked, just a reference) — should be `useNavigate()`. Also a `<Button>...</Button>` with no children — supply a label or remove.
- Multiple files: `borderWdith` typo (should be `borderWidth`).
- `LoginScreen.js` / `RegistrationScreen.js`: `bg={{ boxBR }}` passing an object instead of a value — fix the prop usage.

Each fix gets its own small commit (`fix(navbar): hook-rule violation`, etc.).

---

## How to execute

1. **Read first**: `client/src/index.js`, `client/src/App.js`, `client/src/index.css`, all screens under `client/src/screens/`, all components under `client/src/components/`, the existing theme (if any), `client/package.json`.
2. **Set up the theme** (`client/src/theme/index.js`) and wire it in `client/src/index.js`. Verify the app still loads.
3. **Install fonts** if you go the `@fontsource` route, OR add `<link>` tags in `client/public/index.html` for Google Fonts.
4. **Per-page redesigns in this order**: Home → Products → Cart → Auth → Nav (touched throughout but final pass).
5. **Run locally**: `cd client && npm install && npm start`. The backend probably won't be reachable from local — that's expected; you're testing visual changes, not full e-commerce flow.
6. **Verify** the production build: `cd client && npm run build`. Must pass.
7. **Commit progressively** — one commit per page/feature. Suggested:
   - `chore(deps): fix axois typo and update package.json`
   - `feat(theme): refine palette, typography, button styles`
   - `fix(navbar): hook-rule violation + restyle`
   - `feat(home): redesign hero with featured products and value props`
   - `feat(products): bigger cards, filter strip, refined grid`
   - `feat(cart): empty-state illustration and line-item polish`
   - `feat(auth): polished sign-in / sign-up cards`
   - `fix: ProductScreen toDateString, CartOrderSummary navigate, borderWdith typo`
8. **Push to `origin/main`**. Render auto-deploys (slow first load while cold-starting).

---

## What NOT to do

- Don't migrate frameworks (no Next.js, no Vite migration). Stay on Create React App + Chakra.
- Don't change Redux store/slices/action shapes. Add new selectors/actions if needed for UI, but don't break existing ones.
- Don't touch `server/`.
- Don't fabricate testimonials or fake reviews — if you add social proof, mark it as placeholder.
- Don't introduce dark mode polish if it's half-baked — disable or hide the toggle.
- Don't replace existing product data or sample images.

---

## After this redesign ships

Come back to the portfolio (`~/projects/PersonalProjects/sheldonpierce-com`) and re-capture Just Juice:

```bash
cd /Users/sheldon/projects/PersonalProjects/sheldonpierce-com
node scripts/capture-screenshots.mjs just-juice
```

Then commit the updated screenshots to the portfolio repo and push.
