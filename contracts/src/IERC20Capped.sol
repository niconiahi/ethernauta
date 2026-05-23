// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v5.4.0) (token/ERC20/extensions/IERC20Capped.sol)

pragma solidity >=0.6.2;

import {IERC20} from "./IERC20.sol";

/// @dev OpenZeppelin-pattern capped extension (no numbered ERC).
interface IERC20Capped is IERC20 {
    function cap() external view returns (uint256);
}
