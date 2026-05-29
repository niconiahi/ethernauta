// https://eips.ethereum.org/EIPS/eip-1167
//
// Runtime layout (45 bytes):
//   RUNTIME_PREFIX (10 bytes) || target (20 bytes) || RUNTIME_SUFFIX (15 bytes)
//
// Init code prepended for deployment (10 bytes):
//   3d (RETURNDATASIZE → 0)
//   60 2d (PUSH1 45)
//   80 (DUP1)
//   60 0a (PUSH1 10 — offset of the runtime inside init)
//   3d (RETURNDATASIZE → 0)
//   39 (CODECOPY: copy 45 bytes of runtime to memory[0])
//   81 (DUP2 → 0)
//   f3 (RETURN: return memory[0..45])

export const RUNTIME_PREFIX = "0x363d3d373d3d3d363d73"
export const RUNTIME_SUFFIX = "5af43d82803e903d91602b57fd5bf3"
export const INIT_PREFIX = "0x3d602d80600a3d3981f3"

export const RUNTIME_LENGTH_BYTES = 45
export const RUNTIME_TARGET_OFFSET_HEX = 22 // 2 (for "0x") + 20 (10 prefix bytes)
