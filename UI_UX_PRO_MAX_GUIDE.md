# UI/UX Pro Max Skill Installation Guide

## Overview

The **UI/UX Pro Max skill** has been installed in `.claude/skills/ui-ux-pro-max-skill/`. This comprehensive design guide provides:

- 50+ UI styles (glassmorphism, minimalism, brutalism, neumorphism, bento grid, etc.)
- 161 color palettes optimized for different product types
- 57 font pairings and Google Fonts recommendations
- 99 UX guidelines organized by priority
- 25 chart types and data visualization patterns
- Implementation guidance for 10 technology stacks (React, Next.js, Vue, Svelte, etc.)

## When to Use

Invoke this skill when you need to:

- **Design new pages or sections** — Get comprehensive design system recommendations
- **Refactor UI components** — Improve consistency, accessibility, and visual quality
- **Choose colors, fonts, or styles** — Get data-backed recommendations for luxury products, SaaS, e-commerce, etc.
- **Review UI for quality issues** — Accessibility, performance, responsive design, dark mode
- **Implement animations or interactions** — Get timing, easing, and animation patterns
- **Check design system compliance** — Ensure your implementation follows best practices

## Quick Start Commands

### 1. Generate a Full Design System (Recommended)

Get comprehensive recommendations for the Isvena project:

```bash
python3 .claude/skills/ui-ux-pro-max-skill/.claude/skills/ui-ux-pro-max/scripts/search.py \
  "luxury leather goods e-commerce premium handcrafted" \
  --design-system \
  -p "Isvena" \
  -f markdown
```

**Output:** A complete design system with:
- Recommended UI pattern
- Style selection (glassmorphism, minimalism, etc.)
- Color palette with semantic tokens
- Typography pairing
- Effects and animations
- Pre-delivery checklist

### 2. Search Specific Domains

Get detailed guidance on a specific aspect:

```bash
# Color palette recommendations for luxury brands
python3 .claude/skills/ui-ux-pro-max-skill/.claude/skills/ui-ux-pro-max/scripts/search.py \
  "luxury leather handcrafted" \
  --domain color

# Accessibility and UX best practices
python3 .claude/skills/ui-ux-pro-max-skill/.claude/skills/ui-ux-pro-max/scripts/search.py \
  "e-commerce accessibility animation" \
  --domain ux

# Font pairings for premium brands
python3 .claude/skills/ui-ux-pro-max-skill/.claude/skills/ui-ux-pro-max/scripts/search.py \
  "luxury elegant premium" \
  --domain typography

# Landing page structure
python3 .claude/skills/ui-ux-pro-max-skill/.claude/skills/ui-ux-pro-max/scripts/search.py \
  "hero social-proof testimonial" \
  --domain landing
```

### 3. Get Stack-Specific Guidance

Get implementation patterns for Next.js:

```bash
python3 .claude/skills/ui-ux-pro-max-skill/.claude/skills/ui-ux-pro-max/scripts/search.py \
  "responsive layout performance" \
  --stack nextjs
```

## Available Domains

| Domain | Use For | Example |
|--------|---------|---------|
| `product` | Product type patterns | SaaS, e-commerce, portfolio |
| `style` | UI styles and effects | glassmorphism, minimalism, dark mode |
| `color` | Color palettes | luxury, fintech, healthcare |
| `typography` | Font pairings | elegant, playful, modern |
| `landing` | Page structure | hero, testimonial, pricing |
| `chart` | Data visualization | trend, comparison, timeline |
| `ux` | Best practices | animation, accessibility, forms |
| `react` | React/Next.js patterns | performance, hooks, rendering |

## Isvena Design System Summary

The skill recommends **Liquid Glass** style for Isvena:

```
PATTERN: Feature-Rich Showcase
  - Hero section
  - Feature showcase
  - Clear CTA

STYLE: Liquid Glass
  - Flowing glass morphing
  - Smooth transitions
  - Fluid effects

COLORS (Premium Dark + Gold):
  Primary: #1C1917 (dark brown)
  Accent:  #A16207 (warm gold)
  Background: #FAFAF9 (off-white)

TYPOGRAPHY: Cormorant (display) / Montserrat (body)
  - Luxury, elegant, refined
  - Perfect for high-end handcrafted products

EFFECTS:
  - Morphing SVG elements
  - Fluid animations (400-600ms)
  - Dynamic blur effects
```

**Note:** This differs from Isvena's current earthy, minimalist aesthetic. The current design is excellent and true to the handcrafted brand. This recommendation is available if you want to explore a more modern luxury direction.

## How to Apply Recommendations

### Example: Add a New Product Showcase Section

1. **Generate design system:**
   ```bash
   python3 .claude/skills/ui-ux-pro-max-skill/.claude/skills/ui-ux-pro-max/scripts/search.py \
     "product showcase cards grid" \
     --domain product
   ```

2. **Get UX guidelines:**
   ```bash
   python3 .claude/skills/ui-ux-pro-max-skill/.claude/skills/ui-ux-pro-max/scripts/search.py \
     "responsive grid cards images" \
     --domain ux
   ```

3. **Review pre-delivery checklist** in the skill output

4. **Implement and test:**
   - Verify contrast ratios (4.5:1 minimum)
   - Test responsive breakpoints (375px, 768px, 1024px)
   - Check dark mode (if applicable)
   - Verify accessibility (keyboard nav, alt text, ARIA labels)

## Pre-Delivery Checklist (Critical Items)

Before pushing UI changes:

- [ ] **Accessibility (CRITICAL)**
  - Color contrast ≥4.5:1 for text
  - Keyboard navigation works
  - ARIA labels on interactive elements
  - Alt text on images

- [ ] **Touch & Interaction (CRITICAL)**
  - Touch targets ≥44×44px
  - 8px+ spacing between targets
  - Loading feedback on async buttons
  - Error messages near fields

- [ ] **Performance (HIGH)**
  - Images use WebP/AVIF
  - Lazy load non-critical content
  - No Cumulative Layout Shift (CLS < 0.1)
  - Responsive images (srcset)

- [ ] **Responsive Design (HIGH)**
  - Mobile-first approach
  - Tested at 375px, 768px, 1024px, 1440px
  - No horizontal scroll
  - Viewport meta tag correct

- [ ] **Typography & Color (MEDIUM)**
  - Base font size ≥16px
  - Line height 1.5-1.75
  - Semantic color tokens
  - Dark mode contrast verified separately

## Common Use Cases

### "Review my page for UX issues"
```bash
python3 .claude/skills/ui-ux-pro-max-skill/.claude/skills/ui-ux-pro-max/scripts/search.py \
  "animation accessibility z-index loading performance" \
  --domain ux -n 10
```

### "Help me choose colors"
```bash
python3 .claude/skills/ui-ux-pro-max-skill/.claude/skills/ui-ux-pro-max/scripts/search.py \
  "luxury leather handcrafted premium" \
  --domain color -n 5
```

### "How should I structure the checkout flow?"
```bash
python3 .claude/skills/ui-ux-pro-max-skill/.claude/skills/ui-ux-pro-max/scripts/search.py \
  "form validation error states feedback" \
  --domain ux
```

### "Design a product card component"
```bash
python3 .claude/skills/ui-ux-pro-max-skill/.claude/skills/ui-ux-pro-max/scripts/search.py \
  "card component hover states responsive" \
  --domain product
```

## File Structure

```
.claude/skills/ui-ux-pro-max-skill/
├── .claude/skills/ui-ux-pro-max/          # Main skill
│   ├── scripts/search.py                   # CLI tool for searches
│   ├── data/                               # Domains and datasets
│   │   ├── domains/                        # Searchable databases
│   │   ├── stacks/                         # Framework-specific guidance
│   │   └── ui-reasoning.csv                # Recommendation logic
│   └── SKILL.md                            # Full documentation
├── projects/                               # Example projects
├── cli/                                    # CLI tools
└── README.md                               # Installation & usage
```

## Tips for Better Results

1. **Use multi-dimensional keywords** — Combine product type + industry + tone:
   - ❌ "app" (too vague)
   - ✅ "luxury leather handcrafted premium" (specific)

2. **Start with `--design-system`** — Get full recommendations first, then dive deeper with `--domain` searches

3. **Add the `--stack nextjs`** flag — Get Next.js-specific implementation patterns

4. **Test on multiple breakpoints** — 375px (small phone), 768px (tablet), 1024px (desktop), 1440px (large desktop)

5. **Verify accessibility independently** — Use WCAG contrast checker, keyboard navigation, and screen reader testing

## Troubleshooting

### Python command not found
```bash
python3 --version  # Verify Python 3 is installed
```

### Script permission denied
```bash
chmod +x .claude/skills/ui-ux-pro-max-skill/.claude/skills/ui-ux-pro-max/scripts/search.py
```

### No results returned
- Try broader keywords (remove specific modifiers)
- Check spelling in domain names
- Use `-n 20` to get more results

## Resources

- **Full Skill Documentation**: `.claude/skills/ui-ux-pro-max-skill/.claude/skills/ui-ux-pro-max/SKILL.md`
- **README**: `.claude/skills/ui-ux-pro-max-skill/README.md`
- **Example Projects**: `.claude/skills/ui-ux-pro-max-skill/projects/`
- **Contributing**: `.claude/skills/ui-ux-pro-max-skill/CONTRIBUTING.md`

## Isvena-Specific Recommendations

The Isvena website currently uses an excellent minimalist, handcrafted aesthetic:

**Current Design:**
- Earthy color palette (cognac, umber, sand, cream, olive, ink)
- Minimalist, spacious layout
- Emphasis on heritage and craftsmanship
- SVG placeholder patterns

**Keep this approach because:**
- ✅ It authentically reflects the handmade, artisanal nature
- ✅ The minimalism emphasizes product quality
- ✅ Earthy tones align with natural, vegetable-tanned leather
- ✅ Heritage messaging is front-and-center

**Where the skill helps:**
- Validate your color contrast and accessibility choices
- Suggest improvements to interactive elements (buttons, forms, cards)
- Recommend animation timing and easing for micro-interactions
- Check responsive design across all breakpoints
- Ensure dark mode support (if adding it)

**Next Steps for UI Improvements:**
1. Run an accessibility audit using `--domain ux "accessibility contrast keyboard"`
2. Review form interactions using `--domain ux "forms validation error feedback"`
3. Check animation patterns using `--domain ux "animation easing duration"`

---

**Installed**: July 8, 2026
**Skill Source**: [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
