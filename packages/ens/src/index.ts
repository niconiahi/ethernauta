// @ethernauta/ens
//
// ENSIP-12, ENSIP-15, and ENS resolution orchestration. The numbered
// EIPs that ENS builds on (137, 181, 634, 2304) live in `@ethernauta/erc`
// — this package owns the ENSIP-level helpers and the multi-call flows
// that compose them.
//
// ensip-15/    name normalization (tokenize → NFC → validate) per ENSIP-15
// ensip-12/    avatar text-record parsing per ENSIP-12
// resolution/  forward + reverse lookup helpers that compose
//              namehash + registry.resolver + per-record method bindings

export { parse_avatar } from "./ensip-12/avatar"
export type { AvatarResult } from "./ensip-12/avatar"

export { UCD_VERSION } from "./ensip-15/data/nfc"
export {
  SPEC_CREATED,
  SPEC_UNICODE,
} from "./ensip-15/data/spec"
export {
  from_cps,
  get_ccc,
  nfc,
  nfd,
  to_cps,
} from "./ensip-15/nfc"
export {
  ens_beautify,
  ens_normalize,
} from "./ensip-15/normalize"

export { get_ens_address } from "./resolution/get-ens-address"
export { get_ens_avatar } from "./resolution/get-ens-avatar"
export { get_ens_name } from "./resolution/get-ens-name"
export { get_ens_resolver } from "./resolution/get-ens-resolver"
export { get_ens_text } from "./resolution/get-ens-text"
