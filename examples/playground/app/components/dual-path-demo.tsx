// Side-by-side comparison layout per maxim M5.
//
// Left panel = path 1 ("the standard way" — EIP-1193 via
// the user-picked wallet). Right panel = path 2 ("the
// Ethernauta primitive way" — composed against public RPC,
// no wallet for reads/broadcast). Each column shows the
// live demo on top and the runnable source under it. The
// source string is imported via `?raw` at the call site so
// "code shown" and "code that runs" cannot drift, and is
// highlighted at runtime with shiki under the same theme
// rehype-pretty-code uses for MDX code fences.
//
// Styles live in app/styles/global.css under the
// .dual-path-* class namespace.

import { type ReactNode, useEffect, useState } from "react"
import { codeToHtml } from "shiki"

export type DualPathPanel = {
  title: string
  subtitle?: string
  rendered: ReactNode
  source: string
  language?: string
}

export function DualPathDemo({
  left,
  right,
}: {
  left: DualPathPanel
  right: DualPathPanel
}) {
  return (
    <div className="dual-path-grid">
      <Column panel={left} />
      <Column panel={right} />
    </div>
  )
}

function Column({ panel }: { panel: DualPathPanel }) {
  return (
    <div className="dual-path-column">
      <div>
        <h3>{panel.title}</h3>
        {panel.subtitle && (
          <p className="dual-path-subtitle">
            {panel.subtitle}
          </p>
        )}
      </div>
      <div className="dual-path-card">{panel.rendered}</div>
      <Code
        source={panel.source}
        language={panel.language ?? "tsx"}
      />
    </div>
  )
}

function Code({
  source,
  language,
}: {
  source: string
  language: string
}) {
  const [html, set_html] = useState<string | null>(null)
  const [error, set_error] = useState<string | null>(null)
  useEffect(() => {
    let cancelled = false
    codeToHtml(source, {
      lang: language,
      theme: "github-light",
    })
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
        className="dual-path-code"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted shiki output from local ?raw import
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }
  return (
    <pre className="dual-path-code dual-path-code-fallback">
      {error && (
        <code style={{ color: "#c00", display: "block" }}>
          shiki failed: {error}
        </code>
      )}
      <code>{source}</code>
    </pre>
  )
}
