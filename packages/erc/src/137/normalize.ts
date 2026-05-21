// https://docs.ens.domains/ensip/15

import { ens_normalize } from "@ethernauta/ens"

export function normalize(_name: string): string {
  return ens_normalize(_name)
}
