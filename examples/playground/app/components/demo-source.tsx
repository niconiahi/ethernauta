// Render a demo file's source verbatim from a Vite `?raw`
// import, so "the code shown in the docs" and "the code that
// runs in the demo" cannot drift apart.
//
// Usage from MDX:
//   import source from "../../examples/<name>/demo.tsx?raw"
//   <DemoSource source={source} />
//
// Visual parity with build-time MDX code fences: we run shiki
// with the same `github-light` theme + `keepBackground: false`
// rehype-pretty-code uses (see vite.config.ts), strip shiki's
// own <pre> wrapper, and re-host the highlighted spans inside
// MDX_COMPONENTS.pre — the same component that styles every
// fenced code block on the site.
//
// We import via `shiki/core` with explicit lang/theme `import()`
// statements so the bundler statically tree-shakes everything
// down to just the langs we list. Importing from the umbrella
// `shiki` package via `codeToHtml` pulls all ~200 language
// grammars and ~30 themes into the worker bundle, which blows
// the Cloudflare Workers 3 MiB free-tier limit.

import { useEffect, useState } from "react"
import { createHighlighterCore } from "shiki/core"
import { createOnigurumaEngine } from "shiki/engine/oniguruma"

import { MDX_COMPONENTS } from "./mdx"

const { pre: Pre } = MDX_COMPONENTS

const highlighter_promise = createHighlighterCore({
  themes: [import("@shikijs/themes/github-light")],
  langs: [
    import("@shikijs/langs/typescript"),
    import("@shikijs/langs/tsx"),
    import("@shikijs/langs/solidity"),
  ],
  engine: createOnigurumaEngine(import("shiki/wasm")),
})

function strip_outer_pre(shiki_html: string): string {
  return shiki_html.replace(/^<pre[^>]*>|<\/pre>\s*$/g, "")
}

export function DemoSource({
  source,
  language = "tsx",
}: {
  source: string
  language?: string
}) {
  const [inner_html, set_inner_html] = useState<
    string | null
  >(null)
  const [error, set_error] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    highlighter_promise
      .then((highlighter) =>
        highlighter.codeToHtml(source, {
          lang: language,
          theme: "github-light",
        }),
      )
      .then((result) => {
        if (!cancelled)
          set_inner_html(strip_outer_pre(result))
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

  if (inner_html) {
    return (
      <Pre
        // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted shiki output from local ?raw import
        dangerouslySetInnerHTML={{ __html: inner_html }}
      />
    )
  }
  return (
    <Pre>
      {error && (
        <code style={{ color: "#c00", display: "block" }}>
          shiki failed: {error}
        </code>
      )}
      <code>{source}</code>
    </Pre>
  )
}
