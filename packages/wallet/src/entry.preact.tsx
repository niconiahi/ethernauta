import { invariant } from "@ethernauta/utils"
import { render } from "preact"
import { Controller } from "./controller"

const root = document.querySelector("#app")
invariant(root, "expected #app root element to exist")
render(<Controller />, root)
