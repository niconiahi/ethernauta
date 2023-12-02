import { Address, Byte, Bytes, Uint, Hash32 } from "../../base";
import { AccessList } from "../../transaction";

/**
 * Generic transaction object applicable to all types.
 */
export interface GenericTransaction {
  type: Byte;
  nonce: Uint;
  to: Address | null;
  from: Address;
  gas: Uint;
  value: Uint;
  input: Bytes;
  gasPrice: Uint;
  maxPriorityFeePerGas: Uint;
  maxFeePerGas: Uint;
  maxFeePerBlobGas: Uint;
  accessList: AccessList;
  blobVersionedHashes: Hash32[];
  blobs: Bytes[];
  chainId: Uint;
}
