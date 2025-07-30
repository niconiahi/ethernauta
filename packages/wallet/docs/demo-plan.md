# EIP-1559 Transaction Signing Demo Implementation Plan

## Overview

This document outlines the complete implementation plan for creating a custom EIP-1559 transaction signing system in the Cryptoman wallet. The implementation follows the detailed specification from `eip-1559-transaction-flow.md` and uses only foundational cryptographic libraries.

## Theoretical Foundation

The implementation is based on the 8-step EIP-1559 signing process detailed in our `eip-1559-transaction-flow.md`:

1. **Prepare transaction fields** in exact EIP-1559 order
2. **RLP encode unsigned transaction** (excluding signature fields)  
3. **Compute message hash**: `keccak256(0x02 || unsigned_rlp)`
4. **ECDSA sign** with secp256k1 using private key
5. **Extract y_parity** from recovery ID (0 or 1)
6. **Append signature fields** [y_parity, r, s] to transaction
7. **RLP encode signed transaction** with all 12 fields
8. **Serialize final transaction**: `0x02 || signed_tx_rlp`

## Architecture

### Dependencies Assessment
Current wallet package dependencies are sufficient:
- `@noble/secp256k1` for ECDSA signing
- `@noble/hashes` for Keccak-256 hashing  
- `@scure/bip32` and `@scure/bip39` for key derivation (existing)

**No external RLP libraries** - we implement custom RLP encoding using only Noble foundational libraries.

## Implementation Details

### 1. RLP Implementation: `packages/wallet/src/utils/rlp.ts`

#### RLP Encoding Implementation
Custom RLP encoder following Ethereum's RLP specification:

- **Integer encoding**: Convert numbers to minimal byte representation
- **Byte array encoding**: Direct encoding with length prefixes
- **String encoding**: UTF-8 conversion then byte array encoding
- **List encoding**: Recursive encoding of nested structures
- **Length encoding**: Proper prefixes for short/long items and lists

### 2. Core Implementation: `packages/wallet/src/utils/transaction.ts`

#### EIP-1559 Transaction Structure
Transaction builder for the 9 unsigned fields (in exact order):
```
[chain_id, nonce, max_priority_fee_per_gas, max_fee_per_gas, gas_limit, to, value, data, access_list]
```

Key considerations:
- Proper data type conversion (hex strings to big integers)
- Empty access list handling `[]`
- Address format validation (20-byte addresses)
- Wei value handling for ETH amounts

#### Transaction Signing Process
Implementation of the complete 8-step signing flow:

**Step 1-2**: Transaction preparation and unsigned RLP encoding
- Field validation and type conversion
- RLP encoding without signature fields

**Step 3**: Message hash computation
- Concatenate type byte `0x02` with unsigned RLP
- Keccak-256 hash of the concatenated data

**Step 4-5**: ECDSA signing and y_parity extraction
- Sign message hash with secp256k1
- Extract recovery ID and convert to y_parity (0 or 1)

**Step 6-8**: Final transaction assembly
- Append signature fields to create 12-field transaction
- RLP encode signed transaction
- Prepend type byte `0x02` for final serialization

### 3. Testing: `packages/wallet/src/utils/rlp.test.ts`

#### RLP Encoding Tests
Focused test cases for RLP encoding:

**Basic RLP Tests**:
- Test basic integer encoding (e.g., `42` → `0x2a`)
- Test byte array encoding (e.g., `[1, 2, 3]` → `0x83010203`) 
- Test string encoding and list encoding
- Verify against known RLP test vectors

### 4. Testing: `packages/wallet/src/utils/transaction.test.ts`

#### Transaction Signing Tests
Transaction-specific test cases:

**ETH Transfer Test**:
- Simple 0.001 ETH transfer transaction
- Known private key and expected signature
- Verify complete signed transaction format

### 5. Playground Integration: `packages/playground/app/routes/home.tsx`

#### Demo Transaction Configuration
**Sepolia Testnet Parameters**:
- **Chain ID**: 11155111 (Sepolia)
- **From**: Derived from wallet mnemonic using existing crypto utils
- **To**: Test address `0x742d35Cc6634C0532925a3b8D404d6c18Ff6A3Ce`
- **Value**: 0.001 ETH (1000000000000000 wei)
- **Gas Limit**: 21000 (standard ETH transfer)
- **Max Priority Fee**: 2 gwei (2000000000 wei)
- **Max Fee Per Gas**: 20 gwei (20000000000 wei)
- **Data**: Empty (`0x`)
- **Access List**: Empty array `[]`

#### Button Implementation
Replace existing "send transfer" button functionality:
- Build complete EIP-1559 transaction using new utilities
- Sign transaction with derived private key
- Output hex-encoded raw transaction
- Log transaction details for verification
- Display signed transaction ready for `eth_sendRawTransaction`

## File Structure

```
packages/wallet/src/utils/
├── rlp.ts                 # RLP encoding implementation
├── rlp.test.ts            # RLP encoding tests
├── transaction.ts         # Transaction handling implementation
├── transaction.test.ts    # Transaction signing tests
├── crypto.ts              # Existing crypto utilities (unchanged)
└── vault.ts               # Existing vault utilities (unchanged)

packages/wallet/docs/
├── demo-plan.md           # This document
└── eip-1559-transaction-flow.md  # Reference specification

packages/playground/app/routes/
└── home.tsx               # Updated demo interface
```

## Implementation Steps

### Phase 1: RLP Implementation
1. Implement custom RLP encoding functions in `rlp.ts`
2. Write comprehensive RLP encoding tests in `rlp.test.ts`

### Phase 2: Transaction Implementation
1. Create EIP-1559 transaction builder in `transaction.ts`
2. Implement complete signing process following 8-step flow
3. Create ETH transfer signing test with known vectors in `transaction.test.ts`

### Phase 3: Integration
1. Update playground demo interface
2. Integrate with existing crypto utilities
3. Test complete flow from mnemonic to signed transaction

## Technical Considerations

### Code Style
- Follow existing **snake_case** conventions from CLAUDE.md
- **60 character line width** for compact code
- **2 space indentation**
- Proper TypeScript types for all transaction fields

### Error Handling
- Clear error messages for invalid transactions
- Validation of transaction field types and ranges
- Proper handling of edge cases (empty data, zero values)

### Security
- No logging of private keys or sensitive data
- Proper memory handling for cryptographic operations
- Validation of all input parameters

## Expected Output

The final implementation will produce a hex-encoded signed transaction string starting with `0x02`, ready for broadcast via `eth_sendRawTransaction`. For example:

```
0x02f86c82b3e7028405f5e100850ba43b740082520894742d35cc6634c0532925a3b8d404d6c18ff6a3ce8703782dace9d900008001a0123...a1b2c3d4
```

This transaction can be submitted to the Ethereum network and will execute the specified ETH transfer if the sender has sufficient balance and the nonce is correct.

## References

- **EIP-1559**: Fee market change for ETH 1.0 chain
- **EIP-2930**: Optional access lists (defines chainId and yParity)
- **EIP-155**: Simple replay attack protection
- **RLP Specification**: Ethereum's Recursive Length Prefix encoding
- Internal `eip-1559-transaction-flow.md` for detailed signing process