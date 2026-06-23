# NEAR AI Docs Design System

## 1. Atmosphere & Identity

NEAR AI Docs is a dark, technical reference surface for builders working with private AI infrastructure. The signature is high-contrast documentation with NEAR blue accents: dense enough for scanning API details, but restrained so code and commands remain the focal point.

## 2. Color

### Palette

| Role | Token | Light | Dark | Usage |
|------|-------|-------|------|-------|
| Surface/primary | `--near-black` | `#000000` | `#000000` | Page, navbar, footer, article background |
| Surface/accent-tint | `--accent-gradient-top` | `rgba(11, 143, 246, 0.06)` | `rgba(11, 143, 246, 0.06)` | Subtle panels and buttons |
| Surface/accent-tint-low | `--accent-gradient-bottom` | `rgba(11, 143, 246, 0.03)` | `rgba(11, 143, 246, 0.03)` | Subtle panel gradient end |
| Text/primary | `--near-white` | `#F4F0E8` | `#F4F0E8` | Body, headings, labels |
| Accent/primary | `--near-blue` | `#0B8FF6` | `#0B8FF6` | Active links, primary buttons, hover states |
| Accent/soft | `--near-blue-light` | `#83D2FA` | `#83D2FA` | Links, icons, secondary outlines |
| Border/accent | `--accent-border` | `rgba(11, 143, 246, 0.15)` | `rgba(11, 143, 246, 0.15)` | Subtle dividers and controls |
| Border/accent-hover | `--accent-border-hover` | `rgba(11, 143, 246, 0.4)` | `rgba(11, 143, 246, 0.4)` | Interactive hover borders |
| Status/warning | `--doc-warning` | `#FFC400` | `#FFC400` | Beta and warning badges |

### Rules

- Keep the page dark in every color mode.
- Use NEAR blue only for navigation, links, icons, focus, and copy/action controls.
- Extend this table before introducing a new semantic color.

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Tracking | Usage |
|-------|------|--------|-------------|----------|-------|
| H1 | Docusaurus default | 600 | Docusaurus default | 0 | Page titles |
| H2-H6 | Docusaurus default | 600 | Docusaurus default | 0 | Section headings |
| Body | 16px / 1rem | 400 | Docusaurus default | 0 | Documentation prose |
| Body/sm | 14px / 0.875rem | 500-600 | 1.4-1.5 | 0 | Buttons, secondary labels |
| Caption | 12px / 0.75rem | 500-700 | 1.4 | 0.02em-0.1em | Badges and compact status text |
| Code | 95% of body | 400 | Docusaurus default | 0 | Inline and fenced code |

### Font Stack

- Primary: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`
- Mono: Docusaurus/Infima default mono stack

### Rules

- Body text must not go below 14px.
- Letter spacing stays at 0 except for existing badges and brand labels.
- Keep headings compact and readable for long technical titles.

## 4. Spacing & Layout

### Base Unit

All spacing derives from a base of 4px.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight inline gaps |
| `--space-2` | 8px | Button radius, compact gaps |
| `--space-3` | 12px | Compact control padding |
| `--space-4` | 16px | Standard margins and panel padding |
| `--space-5` | 20px | Comfortable callout padding |
| `--space-6` | 24px | Major content gaps |
| `--space-8` | 32px | Section gaps |
| `--space-12` | 48px | Footer/content separation |
| `--space-16` | 64px | Footer block padding |

### Grid

- Max content width: Docusaurus container defaults.
- Column system: Docusaurus docs layout with sidebar, article column, and right TOC.
- Breakpoints: Docusaurus/Infima defaults, with local mobile overrides at 768px and below.

### Rules

- Keep documentation controls aligned to the article column.
- Use multiples of 4px for margins, padding, gaps, and control heights.

## 5. Components

### Action Button

- Structure: native `button` with text label and optional adjacent status text.
- Variants: subtle article action, primary CTA, secondary outline CTA.
- Spacing: height and padding based on `--space-2` through `--space-4`.
- States: default, hover, active, focus-visible, disabled, success, error.
- Accessibility: native button semantics, visible focus ring, `aria-live` status when action result changes.
- Motion: hover/active uses transform-only micro-interaction.

## 6. Motion & Interaction

### Timing

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | 150ms | ease-out | Button hover, active press |
| Standard | 200-300ms | ease | Cards, links, subtle opacity |
| Emphasis | 600ms | ease-out | Existing secondary button halo |

### Rules

- Animate transform, color, border-color, background, opacity, or box-shadow only.
- Every interactive control needs hover, active, focus-visible, and disabled treatment where applicable.
- Respect Docusaurus accessibility defaults and do not remove focus states.

## 7. Depth & Surface

### Strategy

Mixed: dark surfaces use subtle accent borders, low-opacity blue fills, and occasional blue-tinted shadows for interactive feature cards.

| Level | Value | Usage |
|-------|-------|-------|
| Border/subtle | `1px solid var(--accent-border)` | Documentation controls, cards, separators |
| Border/hover | `1px solid var(--accent-border-hover)` | Hovered interactive controls |
| Shadow/accent | `0 8px 20px var(--accent-shadow)` | Existing feature card hover |

### Rules

- Do not add decorative shadows to article controls.
- Keep article-level utilities visually quieter than docs content and code blocks.
