import type { JSX } from "preact"
import { useState } from "preact/hooks"

type Props = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary"
}

// Styles live in src/styles/button.css — shared with docs + playground.
export function Button({
  children,
  class: class_name,
  variant = "primary",
  ...props
}: Props) {
  const [pressed, set_pressed] = useState(false)
  return (
    <button
      type="button"
      onPointerDown={() => set_pressed(true)}
      onPointerUp={() => set_pressed(false)}
      onPointerLeave={() => set_pressed(false)}
      onTouchCancel={() => set_pressed(false)}
      class={[
        "button",
        variant,
        pressed ? "is-pressed" : "",
        class_name,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  )
}
