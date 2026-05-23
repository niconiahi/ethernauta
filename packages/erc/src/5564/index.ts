// https://eips.ethereum.org/EIPS/eip-5564

export {
  ANNOUNCEMENT_EVENT_TOPIC,
  decode_metadata,
  encode_metadata,
  type Metadata,
  view_tag_matches,
} from "./announcement"
export * from "./methods"
export {
  check_stealth_address,
  compute_stealth_private_key,
  compute_view_tag,
  derive_meta_address,
  format_stealth_meta_address,
  type GeneratedStealthAddress,
  generate_stealth_address,
  parse_stealth_meta_address,
  SCHEME_1_ID,
  type StealthMetaAddress,
} from "./scheme-1"
