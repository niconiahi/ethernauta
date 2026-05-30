// SPDX-License-Identifier: MIT
// https://eips.ethereum.org/EIPS/eip-20
// OpenZeppelin Contracts (last updated v5.4.0) (token/ERC20/extensions/IERC20Burnable.sol)

pragma solidity >=0.6.2;

import {IERC20} from "../../IERC20.sol";

/// @dev OpenZeppelin-pattern burnable extension (no numbered ERC).
interface IERC20Burnable is IERC20 {
    function burn(uint256 value) external;
    function burnFrom(address account, uint256 value) external;
}
