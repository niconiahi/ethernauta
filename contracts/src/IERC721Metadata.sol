// SPDX-License-Identifier: MIT
// https://eips.ethereum.org/EIPS/eip-721
// OpenZeppelin Contracts (last updated v5.4.0) (token/ERC721/extensions/IERC721Metadata.sol)

pragma solidity >=0.6.2;

import {IERC721} from "./IERC721.sol";

/// @dev Optional metadata extension of the ERC-721 standard.
interface IERC721Metadata is IERC721 {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function tokenURI(uint256 tokenId) external view returns (string memory);
}
