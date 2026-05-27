// https://eips.ethereum.org/EIPS/eip-4844 — lazy-loaded KZG singleton.
// The trusted setup is ~800KB; we keep it behind a dynamic import so
// consumers who never touch the KZG functions never pay the cost.
import type { KZG } from "micro-eth-signer/advanced/kzg.js"

let kzg_promise: Promise<KZG> | undefined

export function get_kzg(): Promise<KZG> {
  if (!kzg_promise) {
    kzg_promise = Promise.all([
      import("micro-eth-signer/advanced/kzg.js"),
      import("@paulmillr/trusted-setups/fast-kzg.js"),
    ]).then(
      ([{ KZG }, { trustedSetup }]) =>
        new KZG(trustedSetup),
    )
  }
  return kzg_promise
}
