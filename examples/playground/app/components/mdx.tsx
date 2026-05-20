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
        color: "#555",
        lineHeight: 1.6,
        margin: "0 0 16px",
      }}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      {...props}
      style={{
        background: "#f6f6f4",
        border: "1px solid #e5e5e0",
        borderRadius: 8,
        padding: "16px 20px",
        overflowX: "auto",
        fontSize: 13,
        lineHeight: 1.6,
        margin: "0 0 24px",
      }}
    />
  ),
}
