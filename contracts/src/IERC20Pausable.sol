// SPDX-License-Identifier: MIT
// https://eips.ethereum.org/EIPS/eip-20
// OpenZeppelin Contracts (last updated v5.4.0) (token/ERC20/extensions/IERC20Pausable.sol)

pragma solidity >=0.6.2;

import {IERC20} from "./IERC20.sol";

/// @dev OpenZeppelin-pattern pausable extension (no numbered ERC).
interface IERC20Pausable is IERC20 {
    function paused() external view returns (bool);
    function pause() external;
    function unpause() external;
}
