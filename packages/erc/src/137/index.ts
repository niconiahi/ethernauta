// https://eips.ethereum.org/EIPS/eip-137

export {
  type AvatarResult,
  parse_avatar,
} from "./avatar"
export { get_ens_address } from "./get-ens-address"
export { get_ens_avatar } from "./get-ens-avatar"
export { get_ens_name } from "./get-ens-name"
export { get_ens_resolver } from "./get-ens-resolver"
export { get_ens_text } from "./get-ens-text"
export * from "./methods"
export { namehash, reverse_namehash } from "./namehash"
export { normalize } from "./normalize"
export {
  ENS_REGISTRY,
  get_registry_address,
  ZERO_ADDRESS,
} from "./registry"
