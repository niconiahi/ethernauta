import { render } from "preact"
import { Controller } from "./controller.tsx"

render(
  <Controller />,
  // biome-ignore lint: the element exists
  document.querySelector("#app")!,
)
