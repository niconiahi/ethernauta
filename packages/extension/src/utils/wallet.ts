import { signal } from "@preact/signals"
import { HDKey } from "@scure/bip32"

export const wallet = signal({
  key: new HDKey({
    privateKey: new Uint8Array(32).fill(1),
  }),
  address: "",
})
