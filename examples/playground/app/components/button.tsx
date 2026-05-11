import {
  useState,
  type ButtonHTMLAttributes,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react"

function use_interaction(
  variant: "primary" | "secondary" | "ghost",
  squared: boolean,
) {
  const [pressed, set_pressed] = useState(false)
  const [hovered, set_hovered] = useState(false)

  const colors =
    variant === "ghost"
      ? {
          background: hovered ? "#f0f0f0" : "transparent",
          border: "none",
          color: "inherit",
        }
      : variant === "secondary"
        ? {
            background: hovered
              ? "color-mix(in srgb, #FF5005 25%, #faf5f0)"
              : "color-mix(in srgb, #FF5005 12%, #faf5f0)",
            border: "2px solid #FF5005",
            color: "#FF5005",
          }
        : {
            background: hovered ? "#cc4004" : "#FF5005",
            border: "2px solid #c73d00",
            color: "#fff",
          }

  return {
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      padding: "12px 24px",
      fontSize: 16,
      fontWeight: 600,
      cursor: "pointer",
      textDecoration: "none",
      outline: pressed ? "2px solid #374151" : "none",
      outlineOffset: pressed ? 2 : 0,
      transition: "background 0.15s ease",
      ...(squared ? { aspectRatio: "1", padding: "12px" } : {}),
      ...colors,
    },
    onPointerDown: () => set_pressed(true),
    onPointerUp: () => set_pressed(false),
    onPointerLeave: () => {
      set_pressed(false)
      set_hovered(false)
    },
    onTouchCancel: () => set_pressed(false),
    onMouseEnter: () => set_hovered(true),
    onMouseLeave: () => set_hovered(false),
  }
}

export function Button({
  children,
  variant = "primary",
  squared = false,
  ...props
}: {
  children: ReactNode
  variant?: "primary" | "secondary" | "ghost"
  squared?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const interaction = use_interaction(variant, squared)
  return (
    <button type="button" {...interaction} {...props}>
      {children}
    </button>
  )
}

export function ButtonLink({
  children,
  ...props
}: { children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const interaction = use_interaction("primary", false)
  return (
    <a className="button-link" {...interaction} {...props}>
      {children}
    </a>
  )
}
