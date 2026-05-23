// SPDX-License-Identifier: MIT
// https://eips.ethereum.org/EIPS/eip-181
// Reverse resolution.

pragma solidity >=0.6.2;

/// @dev EIP-181 reverse-resolution profile.
interface IERC181 {
    event NameChanged(bytes32 indexed node, string name);

    function name(bytes32 node) external view returns (string memory);
}
