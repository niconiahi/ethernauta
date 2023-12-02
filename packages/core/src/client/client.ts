import { Uint } from "../base";

/**
 * Syncing progress object.
 */
export interface SyncingProgress {
  /**
   * The number of the earliest block in the syncing process.
   */
  startingBlock: Uint;

  /**
   * The number of the current block where syncing is at.
   */
  currentBlock: Uint;

  /**
   * The number of the highest known block.
   */
  highestBlock: Uint;
}

/**
 * Represents the syncing status, which can either be the progress of syncing or a boolean indicating whether syncing is happening or not.
 */
export type SyncingStatus = SyncingProgress | boolean;
