// https://eips.ethereum.org/EIPS/eip-5267

export {
  DomainFieldsSchema,
  FIELD_CHAIN_ID,
  FIELD_NAME,
  FIELD_SALT,
  FIELD_VERIFYING_CONTRACT,
  FIELD_VERSION,
  decode_fields,
  type DomainFields,
} from "./fields"
export {
  DomainResultSchema,
  get_domain,
  type DomainResult,
} from "./get-domain"
