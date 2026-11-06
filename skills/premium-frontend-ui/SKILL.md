---
name: premium-frontend-ui
description: 'Use when designing or implementing a polished frontend, landing page, portfolio, or interactive UI; choose visual direction and motion that fit the product, users, and existing project.'
---

# Premium Frontend UI

Create distinctive, production-ready interfaces without treating visual effects as requirements.
The user's brief, product needs, and existing design system take priority over any style examples
in this skill.

## Workflow

1. Inspect the existing framework, components, design tokens, assets, and dependencies before
   proposing implementation details.
2. Establish the audience, intended action, brand direction, content, and constraints from the
   request. Ask only for missing decisions that materially affect the design.
3. Choose a coherent visual direction and explain it briefly when useful. Treat the options below
   as inspiration, not presets to combine or apply automatically.
4. Implement within existing project conventions. Reuse installed tools and assets; do not add a
   dependency, remote asset, CDN, font, or service unless it is needed and the user approves it.
5. Verify the result at relevant viewport sizes and interaction states using available project
   checks. Report what was and was not verified.

## Design Options

Choose techniques only when they serve the interface:

- **Editorial:** expressive type, strong contrast, deliberate grids, and whitespace.
- **Organic:** softer shapes, restrained gradients, and layered surfaces.
- **Technical:** precise layouts, data-forward details, and purposeful accent colors.
- **Cinematic:** large imagery, paced transitions, and carefully composed space.
- **Motion:** subtle transitions or scroll-linked effects when they improve comprehension or
  feedback.
- **Depth:** shadows, texture, translucency, or 3D only when they support hierarchy and remain
  legible.

Do not add preloaders, auto-hiding navigation, scroll hijacking, custom cursors, pinned sections,
parallax, or animation solely to make a page feel "premium." Keep navigation predictable and the
primary content usable if decorative assets or scripts fail.

## Quality Requirements

- Follow the project's design system and established framework patterns. Do not introduce a new
  styling or animation library by default.
- Make layouts work with real content, keyboard navigation, touch, zoom, and small viewports.
- Keep focus visible, semantics meaningful, contrast sufficient, and controls usable without
  pointer hover.
- Respect `prefers-reduced-motion`; motion must not be required to access content or understand
  state. Avoid flashing and unnecessary continuous animation.
- Prefer lightweight assets and animate properties that avoid repeated layout when practical.
  Avoid permanent `will-change` without measured need.
- Use system or project fonts by default; load external fonts only when approved and provide
  suitable fallbacks.

## Optional Implementation Tools

Use the project's existing solution first. If a capability is requested and no suitable tool is
already present, explain the tradeoffs before proposing a dependency. Examples include CSS
transitions or the installed motion library for interface animation, GSAP for complex timelines,
and React Three Fiber for explicitly requested interactive 3D. Smooth-scroll libraries and
character-splitting tools are not defaults; check accessibility, browser support, and added
runtime cost before considering them.
