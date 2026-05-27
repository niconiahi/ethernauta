// Render a demo file's source as pre-highlighted HTML. The
// highlighting happens at build time via the `?highlighted` Vite
// plugin (see vite.config.ts) — by the time this component runs in
// the browser, the HTML is already a `<pre class="shiki">` blob
// inside a fingerprinted JS chunk under `/assets/`, served with a
// year-long immutable cache. Zero runtime shiki, zero WASM, no flash.
//
// Mirror of the docs site's mdsvex build-time highlight strategy.
//
// Usage from MDX:
//   import html from "../../examples/<name>/demo.tsx?highlighted"
//   <DemoSource html={html} />

export function DemoSource({ html }: { html: string }) {
  return (
    <div
      // biome-ignore lint/security/noDangerouslySetInnerHtml: build-time shiki output from local ?highlighted import
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
