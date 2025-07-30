![](_page_0_Picture_0.jpeg)

# **Signing an EIP-1559 (Type-2) Ethereum Transaction**

**Introduction:** This guide provides a detailed, implementation-focused walkthrough for signing a post-London **EIP-1559** transaction (transaction type **0x02**). We will assemble the transaction, encode it, hash it, sign it with ECDSA (secp256k1), and serialize the final output. All steps follow the official **EIP-1559** specification . We focus exclusively on EIP-1559 (type-2) rules (no legacy transaction support) and explain how **EIP-155** replay protection is applied. [1](https://eips.ethereum.org/EIPS/eip-1559#:~:text=The%20EIP,data%2C%20access_list%2C%20signature_y_parity%2C%20signature_r%2C%20signature_s)

### **EIP-1559 Transaction Format (Type 0x02)**

EIP-1559 defines a new **type-2** transaction format under the EIP-2718 typed envelope scheme. A type-2 transaction is identified by a leading **transaction type byte** 0x02 , followed by an RLP-encoded payload of the transaction fields . The fields included (in order) are: [2](https://eips.ethereum.org/EIPS/eip-1559#:~:text=As%20of%20,2)

- chain\_id The chain ID for replay protection (only valid on this chain) . • [3](https://eips.ethereum.org/EIPS/eip-2930#:~:text=,chainID)
- nonce Sender's account nonce (transaction sequence number). •
- max\_priority\_fee\_per\_gas Max tip (priority fee) per gas the sender is willing to pay. •
- max\_fee\_per\_gas Max total fee (base fee + priority fee) per gas the sender will pay. •
- gas\_limit Gas limit for this transaction. •
- to (destination) Recipient address (20 bytes) or 0x0 for contract creation. •
- value Amount of ETH to transfer (in wei). •
- data Transaction data payload (bytecode or call data; can be empty). •
- access\_list List of accessed addresses and storage keys (can be an empty list). •
- signature\_y\_parity **Y-parity** of the signature (1 bit, 0 or 1). •
- signature\_r ECDSA signature *r* value (32 bytes as integer). •
- signature\_s ECDSA signature *s* value (32 bytes as integer). •

These fields correspond to the EIP-1559 TransactionPayload structure . The **Y-parity** ( signature\_y\_parity ) is essentially the ECDSA recovery identifier bit, replacing the old v value used in legacy transactions. (Since the chain\_id is explicitly included in the payload, only a 0/1 parity is needed for the signature .) [1](https://eips.ethereum.org/EIPS/eip-1559#:~:text=The%20EIP,data%2C%20access_list%2C%20signature_y_parity%2C%20signature_r%2C%20signature_s) [3](https://eips.ethereum.org/EIPS/eip-2930#:~:text=,chainID)

**EIP-155 Replay Protection:** Including the chain\_id in the signed payload ensures the transaction is only valid on that chain, implementing EIP-155 replay protection. In legacy (pre-2718) transactions, EIP-155 achieved this by encoding the chain ID into the signature v value (e.g. v = chain\_id \* 2 + 35 or 36 ) . With EIP-1559 type-2 transactions, the chain\_id is a dedicated field that is hashed as part of the signature, and the signature's recovery ID is stored separately as y\_parity . This means the signed transaction cannot be replayed on a different chain or interpreted as a different type, since the type byte 0x02 is also part of the hash . [4](https://eips.ethereum.org/EIPS/eip-155#:~:text=hashing%20only%20six%20rlp%20encoded,%2B%2027%60%20as%20previously) [3](https://eips.ethereum.org/EIPS/eip-2930#:~:text=,chainID) [5](https://eips.ethereum.org/EIPS/eip-1559#:~:text=The%20,gas_limit%2C%20destination%2C%20amount%2C%20data%2C%20access_list)

## **Step-by-Step Signing Process (Pseudocode)**

Below are the steps to construct, sign, and serialize an EIP-1559 transaction. We use a generic pseudocode style for clarity:

**Prepare the Transaction Fields:** Gather all required fields in the correct order defined by EIP-1559. For example: 1.

```
fields = [
 chain_id, // E.g. 1 for mainnet
 nonce, // Sender's nonce
 max_priority_fee_per_gas,
 max_fee_per_gas,
 gas_limit,
 to, // Recipient address (as integer or hex)
 value, // Amount in wei
 data, // Byte array of payload
 access_list // List of [address, storageKeys] or [] if none
]
```
Make sure to use the exact order and types as specified. The chain\_id comes first (providing replay protection), and access\_list is included even if empty . (No legacy gasPrice or legacy v field is used in type-2 transactions.) [1](https://eips.ethereum.org/EIPS/eip-1559#:~:text=The%20EIP,data%2C%20access_list%2C%20signature_y_parity%2C%20signature_r%2C%20signature_s)

**RLP-encode the Unsigned Transaction:** Use RLP (Recursive Length Prefix) encoding to serialize the list of fields **excluding** the signature. At this stage, do not include y\_parity , r , or s (since we haven't signed yet). For example: 1.

unsigned\_rlp = RLP.encode(fields)

This produces the RLP byte array of the transaction payload without any signature. According to the spec, the transaction payload is defined as an RLP list of the fields (with signature fields to be added later) . [1](https://eips.ethereum.org/EIPS/eip-1559#:~:text=The%20EIP,data%2C%20access_list%2C%20signature_y_parity%2C%20signature_r%2C%20signature_s)

**Compute the Message Hash:** Calculate the Keccak-256 hash of the **transaction type prefix** concatenated with the RLP-encoded payload from step 2. EIP-1559 requires the type byte 0x02 to be included in the hash to sign . Pseudocode: 1. [5](https://eips.ethereum.org/EIPS/eip-1559#:~:text=The%20,gas_limit%2C%20destination%2C%20amount%2C%20data%2C%20access_list)

tx\_hash = keccak256( 0x02 || unsigned\_rlp )

Here || denotes byte concatenation. This hash (32 bytes) is the message that will be signed. Including the 0x02 ensures the signature cannot be applied to a different transaction type (it "domains" the signature to type-2 transactions) . [5](https://eips.ethereum.org/EIPS/eip-1559#:~:text=The%20,gas_limit%2C%20destination%2C%20amount%2C%20data%2C%20access_list)

**Sign with ECDSA (secp256k1):** Using the sender's private key, produce a secp256k1 signature of tx\_hash . The result will be the standard ECDSA components (r, s) and a recovery identifier (often called v in legacy, but here we'll derive parity separately). For example: 1.

(r, s, rec\_id) = secp256k1\_sign(private\_key, tx\_hash)

The secp256k1\_sign function returns the signature values. The rec\_id is the recovery ID (0 or 1 in this context) which indicates which elliptic curve point was used in the signature. (If using a library that returns v as 27/28, subtract 27 to get the parity bit.)

**Determine the y\_parity :** Convert the recovery ID into the **y-parity bit**. In EIP-1559, this is simply 0 or 1 corresponding to the even/odd parity of the curve point's y-coordinate . For example: 1. [3](https://eips.ethereum.org/EIPS/eip-2930#:~:text=,chainID)

y\_parity = rec\_id // rec\_id is 0 or 1 for secp256k1 signatures

There is no additional adjustment needed for chain ID here – the chain ID is already part of the hashed payload. (In other words, **v = 27/28 or chainId formula is not used**; we use the raw parity bit.)

**Add Signature Fields to the Payload:** Append the signature components to the field list in order to form the complete signed transaction payload. According to EIP-1559, the fields signature\_y\_parity , signature\_r , signature\_s come last . For example: 1. [1](https://eips.ethereum.org/EIPS/eip-1559#:~:text=The%20EIP,data%2C%20access_list%2C%20signature_y_parity%2C%20signature_r%2C%20signature_s)

```
signed_fields = fields + [ y_parity, r, s ]
```
Now signed\_fields represents [chain\_id, nonce, max\_priority\_fee\_per\_gas, max\_fee\_per\_gas, gas\_limit, to, value, data, access\_list, y\_parity, r, s] . This matches the full EIP-1559 transaction format with all signature data included . [1](https://eips.ethereum.org/EIPS/eip-1559#:~:text=The%20EIP,data%2C%20access_list%2C%20signature_y_parity%2C%20signature_r%2C%20signature_s)

**RLP-encode the Signed Transaction:** RLP-encode the signed\_fields list to get the serialized transaction payload with the signature. For example: 1.

signed\_tx\_rlp = RLP.encode(signed\_fields)

This produces the byte array encoding of the entire transaction (except the type prefix). At this point, the RLP includes the signature values. (If decoded, it would match the spec's transaction payload structure exactly.)

**Serialize with Type Byte:** Prepend the transaction type byte 0x02 to the RLP from step 7. This yields the final raw transaction byte stream. For example: 1.

### raw\_transaction = 0x02 || signed\_tx\_rlp

The raw\_transaction is the complete signed transaction in binary form, ready to be broadcast to the Ethereum network or included in a block. In hex notation, it will start with 0x02 to indicate an EIP-1559 transaction. *(The type byte is not part of the RLP itself but is the prefix as per EIP-2718's format .) [6](https://eips.ethereum.org/EIPS/eip-2930#:~:text=We%20introduce%20a%20new%20EIP,data%2C%20accessList%2C%20signatureYParity%2C%20signatureR%2C%20signatureS)*

Each step above follows the official EIP-1559 specification for type-2 transactions. Notably, the signature is defined as over the RLP-encoded fields plus the type byte, and the signed output is encoded back into the same structure with the signature attached . By including the chain\_id in the signed content, EIP-1559 inherently provides replay protection across chains (fulfilling EIP-155) without needing the old v value formula . [5](https://eips.ethereum.org/EIPS/eip-1559#:~:text=The%20,gas_limit%2C%20destination%2C%20amount%2C%20data%2C%20access_list) [4](https://eips.ethereum.org/EIPS/eip-155#:~:text=hashing%20only%20six%20rlp%20encoded,%2B%2027%60%20as%20previously) [3](https://eips.ethereum.org/EIPS/eip-2930#:~:text=,chainID)

#### **References:**

- Ethereum Improvement Proposal **1559** *"Fee market change for ETH 1.0 chain"* (London hardfork) • [1](https://eips.ethereum.org/EIPS/eip-1559#:~:text=The%20EIP,data%2C%20access_list%2C%20signature_y_parity%2C%20signature_r%2C%20signature_s)
- Ethereum Improvement Proposal **2930** *"Optional access lists"* (defines chainId and yParity in transaction format) • [3](https://eips.ethereum.org/EIPS/eip-2930#:~:text=,chainID)
- Ethereum Improvement Proposal **155** *"Simple replay attack protection"* (legacy chain ID in signatures) • [4](https://eips.ethereum.org/EIPS/eip-155#:~:text=hashing%20only%20six%20rlp%20encoded,%2B%2027%60%20as%20previously)

EIP-1559: Fee market change for ETH 1.0 chain [1](https://eips.ethereum.org/EIPS/eip-1559#:~:text=The%20EIP,data%2C%20access_list%2C%20signature_y_parity%2C%20signature_r%2C%20signature_s) [2](https://eips.ethereum.org/EIPS/eip-1559#:~:text=As%20of%20,2) [5](https://eips.ethereum.org/EIPS/eip-1559#:~:text=The%20,gas_limit%2C%20destination%2C%20amount%2C%20data%2C%20access_list)

<https://eips.ethereum.org/EIPS/eip-1559>

EIP-2930: Optional access lists [3](https://eips.ethereum.org/EIPS/eip-2930#:~:text=,chainID) [6](https://eips.ethereum.org/EIPS/eip-2930#:~:text=We%20introduce%20a%20new%20EIP,data%2C%20accessList%2C%20signatureYParity%2C%20signatureR%2C%20signatureS)

<https://eips.ethereum.org/EIPS/eip-2930>

EIP-155: Simple replay attack protection <https://eips.ethereum.org/EIPS/eip-155> [4](https://eips.ethereum.org/EIPS/eip-155#:~:text=hashing%20only%20six%20rlp%20encoded,%2B%2027%60%20as%20previously)