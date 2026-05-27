// Render a demo file's source verbatim from a Vite `?raw`
// import so "the code shown in the docs" and "the code that
// runs in the demo" cannot drift apart.
//
// Usage from MDX:
//   import source from "../../examples/<name>/demo.tsx?raw"
//   <DemoSource source={source} />
//
// Mirrors `apps/docs/svelte.config.js`'s mdsvex shiki setup:
// dual-theme CSS-var output (`themes: { light, dark }`), full
// `<pre class="shiki ...">` left intact — `tokens.css` swaps
// the `--shiki-dark` vars via `@media (prefers-color-scheme: dark)`.
//
// We import via `shiki/core` with explicit lang/theme `import()`
// statements so the bundler statically tree-shakes everything
// down to just the langs we list — using the umbrella `shiki`
// package pulls all ~200 grammars and blows the Cloudflare
// Workers 3 MiB free-tier limit.

import { useEffect, useState } from "react"
import { createHighlighterCore } from "shiki/core"
import { createOnigurumaEngine } from "shiki/engine/oniguruma"

const highlighter_promise = createHighlighterCore({
  themes: [
    import("@shikijs/themes/github-light"),
    import("@shikijs/themes/github-dark"),
  ],
  langs: [
    import("@shikijs/langs/typescript"),
    import("@shikijs/langs/tsx"),
    import("@shikijs/langs/solidity"),
  ],
  engine: createOnigurumaEngine(import("shiki/wasm")),
})

export function DemoSource({
  source,
  language = "tsx",
}: {
  source: string
  language?: string
}) {
  const [html, set_html] = useState<string | null>(null)
  const [error, set_error] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    highlighter_promise
      .then((highlighter) =>
        highlighter.codeToHtml(source, {
          lang: language,
          themes: {
            light: "github-light",
            dark: "github-dark",
          },
        }),
      )
      .then((result) => {
        if (!cancelled) set_html(result)
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          set_error(
            e instanceof Error ? e.message : String(e),
          )
        }
      })
    return () => {
      cancelled = true
    }
  }, [source, language])

  if (html) {
    return (
      <div
        // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted shiki output from local ?raw import
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }
  return (
    <pre>
      {error && (
        <code
          style={{
            color: "var(--danger)",
            display: "block",
          }}
        >
          shiki failed: {error}
        </code>
      )}
      <code>{source}</code>
    </pre>
  )
}
