// SPDX-License-Identifier: MIT
// https://eips.ethereum.org/EIPS/eip-6372

pragma solidity >=0.6.2;

/// @dev Interface of ERC-6372 (Contract clock). Standardises the
/// clock that ERC-5805 (and other time-aware standards) read from
/// so the same vote/snapshot logic works against block-number,
/// timestamp, or arbitrary monotonically-increasing clocks.
interface IERC6372 {
    function clock() external view returns (uint48);
    // solhint-disable-next-line func-name-mixedcase
    function CLOCK_MODE() external view returns (string memory);
}
