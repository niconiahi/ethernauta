// https://eips.ethereum.org/EIPS/eip-4844
// All constants taken verbatim from EIP-4844 §"Parameters" and from the
// consensus-specs `polynomial-commitments` module.

export const BLOB_TX_TYPE = 0x03

export const BYTES_PER_FIELD_ELEMENT = 32
export const FIELD_ELEMENTS_PER_BLOB = 4096
export const BYTES_PER_BLOB =
  BYTES_PER_FIELD_ELEMENT * FIELD_ELEMENTS_PER_BLOB // 131072

export const BYTES_PER_COMMITMENT = 48
export const BYTES_PER_PROOF = 48

// The BLS12-381 scalar field modulus. Every 32-byte field element of a
// blob is interpreted big-endian and MUST be strictly less than this.
export const BLS_MODULUS =
  0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001n

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

// Fiat-Shamir domain separators used by the consensus-specs polynomial
// commitments module. Verbatim ASCII, 16 bytes each.
export const FIAT_SHAMIR_PROTOCOL_DOMAIN =
  "FSBLOBVERIFY_V1_"
export const RANDOM_CHALLENGE_KZG_BATCH_DOMAIN =
  "RCKZGBATCH___V1_"

// A primitive 4096-th root of unity in Fr. The polynomial-commitments
// module uses powers of this to define the evaluation domain. Sourced
// from the consensus-specs `polynomial-commitments` constants.
// (= 7 ^ ((BLS_MODULUS - 1) / 4096) mod BLS_MODULUS — generator chosen
// so that the multiplicative group has the required order.)
export const PRIMITIVE_ROOT_OF_UNITY =
  0x564c0a11a0f704f4fc3e8acfe0f8245f0ad1347b378fbf96e206da11a5d36306n
