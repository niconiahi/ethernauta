// https://eips.ethereum.org/EIPS/eip-4844
// Constants taken verbatim from EIP-4844 §"Parameters".

export const BLOB_TX_TYPE = 0x03

export const BYTES_PER_FIELD_ELEMENT = 32
export const FIELD_ELEMENTS_PER_BLOB = 4096
export const BYTES_PER_BLOB =
  BYTES_PER_FIELD_ELEMENT * FIELD_ELEMENTS_PER_BLOB // 131072

// EIP-4844 §"Cryptographic Helpers": versioned hash for a KZG commitment is
// sha256(commitment) with the first byte overwritten by 0x01.
export const VERSIONED_HASH_VERSION_KZG = 0x01

// Blob gas accounting (EIP-4844 §"Gas accounting").
export const GAS_PER_BLOB = 1 << 17 // 131072
export const MIN_BLOB_GASPRICE = 1n
export const BLOB_GASPRICE_UPDATE_FRACTION = 3338477n
export const TARGET_BLOB_GAS_PER_BLOCK = 393216n // 3 * GAS_PER_BLOB
export const MAX_BLOB_GAS_PER_BLOCK = 786432n // 6 * GAS_PER_BLOB
export const MAX_BLOBS_PER_BLOCK = 6
