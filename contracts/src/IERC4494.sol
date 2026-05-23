// SPDX-License-Identifier: MIT
// https://eips.ethereum.org/EIPS/eip-4494

pragma solidity >=0.6.2;

/// @dev Interface of ERC-4494 (Permit for ERC-721 NFTs).
interface IERC4494 {
    function permit(
        address spender,
        uint256 tokenId,
        uint256 deadline,
        bytes memory sig
    ) external;

    function nonces(uint256 tokenId) external view returns (uint256);

    // solhint-disable-next-line func-name-mixedcase
    function DOMAIN_SEPARATOR() external view returns (bytes32);
}
