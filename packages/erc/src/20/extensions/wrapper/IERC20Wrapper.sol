// SPDX-License-Identifier: MIT
// https://eips.ethereum.org/EIPS/eip-20
// OpenZeppelin Contracts (last updated v5.4.0) (token/ERC20/extensions/IERC20Wrapper.sol)

pragma solidity >=0.6.2;

import {IERC20} from "../../IERC20.sol";

/// @dev OpenZeppelin-pattern wrapper extension (no numbered ERC).
interface IERC20Wrapper is IERC20 {
    function underlying() external view returns (address);
    function depositFor(address account, uint256 value) external returns (bool);
    function withdrawTo(address account, uint256 value) external returns (bool);
}
