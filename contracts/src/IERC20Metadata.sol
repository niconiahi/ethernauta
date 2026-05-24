// SPDX-License-Identifier: MIT
// https://eips.ethereum.org/EIPS/eip-20
// OpenZeppelin Contracts (last updated v5.4.0) (token/ERC20/extensions/IERC20Metadata.sol)

pragma solidity >=0.6.2;

import {IERC20} from "./IERC20.sol";

/// @dev Optional metadata extension of the ERC-20 standard.
interface IERC20Metadata is IERC20 {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
}
