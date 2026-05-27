import type { ComponentPropsWithoutRef } from "react"

export const MDX_COMPONENTS = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1
      {...props}
      style={{
        fontSize: 32,
        fontWeight: 800,
        margin: "0 0 16px",
        lineHeight: 1.2,
      }}
    />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      {...props}
      style={{
        fontSize: 20,
        fontWeight: 700,
        margin: "40px 0 16px",
      }}
    />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p
      {...props}
      style={{
        fontSize: 15,
        color: "var(--text-muted)",
        lineHeight: 1.6,
        margin: "0 0 16px",
      }}
    />
  ),
}
