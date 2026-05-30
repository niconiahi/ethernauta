// SPDX-License-Identifier: MIT
// https://eips.ethereum.org/EIPS/eip-20
// OpenZeppelin Contracts (last updated v5.4.0) (token/ERC20/extensions/IERC20Mintable.sol)

pragma solidity >=0.6.2;

import {IERC20} from "../../IERC20.sol";

/// @dev OpenZeppelin-pattern mintable extension (no numbered ERC).
interface IERC20Mintable is IERC20 {
    function mint(address to, uint256 amount) external;
}
