import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
  useState,
} from "react"

type Variant = "primary" | "secondary" | "ghost"

function class_names(
  variant: Variant,
  squared: boolean,
  pressed: boolean,
) {
  return [
    "button",
    variant,
    squared ? "squared" : "",
    pressed ? "is-pressed" : "",
  ]
    .filter(Boolean)
    .join(" ")
}

function use_pressed() {
  const [pressed, set_pressed] = useState(false)
  return {
    pressed,
    onPointerDown: () => set_pressed(true),
    onPointerUp: () => set_pressed(false),
    onPointerLeave: () => set_pressed(false),
    onTouchCancel: () => set_pressed(false),
  }
}

export function Button({
  children,
  variant = "primary",
  squared = false,
  className,
  ...props
}: {
  children: ReactNode
  variant?: Variant
  squared?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pressed, ...pressed_handlers } = use_pressed()
  return (
    <button
      type="button"
      className={[
        class_names(variant, squared, pressed),
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...pressed_handlers}
      {...props}
    >
      {children}
    </button>
  )
}

export function ButtonLink({
  children,
  variant = "primary",
  className,
  ...props
}: {
  children: ReactNode
  variant?: Variant
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { pressed, ...pressed_handlers } = use_pressed()
  return (
    <a
      className={[
        class_names(variant, false, pressed),
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...pressed_handlers}
      {...props}
    >
      {children}
    </a>
  )
}
