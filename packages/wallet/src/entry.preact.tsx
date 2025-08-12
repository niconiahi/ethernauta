import { render } from "preact"
import { Controller } from "./controller"

render(
  <Controller />,
  // biome-ignore lint: the element exists
  document.querySelector("#app")!,
)
