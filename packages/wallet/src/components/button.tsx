import { useState } from "preact/hooks"
import type { JSX } from "preact"

type Props = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary"
}

export function Button({
  children,
  class: class_name,
  variant = "primary",
  ...props
}: Props) {
  const [pressed, set_pressed] = useState(false)
  const variant_classes =
    variant === "secondary"
      ? "bg-[color-mix(in_srgb,#FF5005_12%,#faf5f0)] hover:bg-[color-mix(in_srgb,#FF5005_25%,#faf5f0)] border-[#FF5005] text-[#FF5005]"
      : "bg-[#FF5005] hover:bg-[#cc4004] border-[#c73d00] text-white"
  return (
    <button
      type="button"
      onPointerDown={() => set_pressed(true)}
      onPointerUp={() => set_pressed(false)}
      onPointerLeave={() => set_pressed(false)}
      onTouchCancel={() => set_pressed(false)}
      class={[
        "border-2 rounded-md p-2 cursor-pointer text-base transition-colors",
        variant_classes,
        pressed
          ? "outline outline-2 outline-offset-2 outline-gray-700"
          : "",
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
