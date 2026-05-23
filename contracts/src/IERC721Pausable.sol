// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v5.4.0) (token/ERC721/extensions/IERC721Pausable.sol)

pragma solidity >=0.6.2;

import {IERC721} from "./IERC721.sol";

/// @dev OpenZeppelin-pattern pausable extension for ERC-721 (no numbered ERC).
interface IERC721Pausable is IERC721 {
    function paused() external view returns (bool);
    function pause() external;
    function unpause() external;
}
