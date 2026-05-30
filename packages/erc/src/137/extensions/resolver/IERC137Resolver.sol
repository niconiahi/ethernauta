// SPDX-License-Identifier: MIT
// https://eips.ethereum.org/EIPS/eip-137
// addr(bytes32) — single-address (Ethereum) profile of the resolver interface.

pragma solidity >=0.6.2;

/// @dev EIP-137 single-coin (Ethereum) address resolver profile.
interface IERC137Resolver {
    event AddrChanged(bytes32 indexed node, address a);

    function addr(bytes32 node) external view returns (address payable);
}
