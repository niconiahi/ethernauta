// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v5.4.0) (token/ERC1155/extensions/IERC1155MetadataURI.sol)

pragma solidity >=0.6.2;

import {IERC1155} from "./IERC1155.sol";

/// @dev Optional metadata-URI extension of the ERC-1155 standard.
interface IERC1155MetadataURI is IERC1155 {
    function uri(uint256 id) external view returns (string memory);
}
