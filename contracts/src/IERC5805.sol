// SPDX-License-Identifier: MIT
// https://eips.ethereum.org/EIPS/eip-5805

pragma solidity >=0.6.2;

import {IERC6372} from "./IERC6372.sol";

/// @dev Interface of ERC-5805 (Voting with delegation).
interface IERC5805 is IERC6372 {
    event DelegateChanged(
        address indexed delegator,
        address indexed fromDelegate,
        address indexed toDelegate
    );
    event DelegateVotesChanged(
        address indexed delegate,
        uint256 previousVotes,
        uint256 newVotes
    );

    function getVotes(address account) external view returns (uint256);
    function getPastVotes(address account, uint256 timepoint) external view returns (uint256);
    function getPastTotalSupply(uint256 timepoint) external view returns (uint256);
    function delegates(address account) external view returns (address);
    function delegate(address delegatee) external;
    function delegateBySig(
        address delegatee,
        uint256 nonce,
        uint256 expiry,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;
}
