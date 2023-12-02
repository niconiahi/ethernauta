import { Address, Uint256, Uint64 } from "../base";

/**
 * Validator withdrawal object.
 */
export interface Withdrawal {
  /**
   * Index of the withdrawal.
   */
  index: Uint64;

  /**
   * Index of the validator that generated the withdrawal.
   */
  validatorIndex: Uint64;

  /**
   * Recipient address for the withdrawal value.
   */
  address: Address;

  /**
   * Value contained in the withdrawal.
   */
  amount: Uint256;
}
