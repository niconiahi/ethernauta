// SPDX-License-Identifier: MIT
// https://eips.ethereum.org/EIPS/eip-2981
// OpenZeppelin Contracts (last updated v5.4.0) (interfaces/IERC2981.sol)

pragma solidity >=0.6.2;

import {IERC165} from "../165/IERC165.sol";

/// @dev Interface of ERC-2981 (NFT Royalty Standard).
interface IERC2981 is IERC165 {
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        returns (address receiver, uint256 royaltyAmount);
}
