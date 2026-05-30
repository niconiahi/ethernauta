// SPDX-License-Identifier: MIT
// https://eips.ethereum.org/EIPS/eip-634
// Text records.

pragma solidity >=0.6.2;

/// @dev EIP-634 text-records resolver profile.
interface IERC634 {
    event TextChanged(bytes32 indexed node, string indexed indexedKey, string key, string value);

    function text(bytes32 node, string calldata key) external view returns (string memory);
}
