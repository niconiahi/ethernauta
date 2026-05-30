// SPDX-License-Identifier: MIT
// https://eips.ethereum.org/EIPS/eip-1577
// Contenthash records.

pragma solidity >=0.6.2;

/// @dev EIP-1577 contenthash-records resolver profile.
interface IERC1577 {
    event ContenthashChanged(bytes32 indexed node, bytes hash);

    function contenthash(bytes32 node) external view returns (bytes memory);
}
