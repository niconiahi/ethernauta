import { render } from "preact"
import { Controller } from "./controller"

// B2 bootstrap precondition (per R0.4 of skills/no-violations).
// The MV3 popup must have a `<div id="app">` in popup.html — the
// schema route doesn't apply because there's no incoming data to
// validate; this is a structural assertion about the static
// document the extension ships.
const root = document.querySelector("#app")
if (!root) {
  throw new Error("expected #app root element to exist")
}
render(<Controller />, root)
