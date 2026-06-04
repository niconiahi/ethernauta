// https://eips.ethereum.org/EIPS/eip-5267

export {
  type DomainFields,
  DomainFieldsSchema,
  decode_fields,
  FIELD_CHAIN_ID,
  FIELD_NAME,
  FIELD_SALT,
  FIELD_VERIFYING_CONTRACT,
  FIELD_VERSION,
} from "./fields"
export {
  type DomainResult,
  DomainResultSchema,
  get_domain,
} from "./get-domain"
