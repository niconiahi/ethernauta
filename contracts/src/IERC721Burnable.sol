// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v5.4.0) (token/ERC721/extensions/IERC721Burnable.sol)

pragma solidity >=0.6.2;

import {IERC721} from "./IERC721.sol";

/// @dev OpenZeppelin-pattern burnable extension for ERC-721 (no numbered ERC).
interface IERC721Burnable is IERC721 {
    function burn(uint256 tokenId) external;
}
