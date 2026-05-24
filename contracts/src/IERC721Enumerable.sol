// SPDX-License-Identifier: MIT
// https://eips.ethereum.org/EIPS/eip-721
// OpenZeppelin Contracts (last updated v5.4.0) (token/ERC721/extensions/IERC721Enumerable.sol)

pragma solidity >=0.6.2;

import {IERC721} from "./IERC721.sol";

/// @dev Optional enumeration extension of the ERC-721 standard.
interface IERC721Enumerable is IERC721 {
    function totalSupply() external view returns (uint256);
    function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256);
    function tokenByIndex(uint256 index) external view returns (uint256);
}
