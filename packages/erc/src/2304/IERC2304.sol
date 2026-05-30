// SPDX-License-Identifier: MIT
// https://eips.ethereum.org/EIPS/eip-2304
// Multicoin address resolution.

pragma solidity >=0.6.2;

/// @dev EIP-2304 multicoin address resolver profile.
interface IERC2304 {
    event AddressChanged(bytes32 indexed node, uint256 coinType, bytes newAddress);

    function addr(bytes32 node, uint256 coinType) external view returns (bytes memory);
}
