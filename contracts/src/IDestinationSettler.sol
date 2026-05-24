// SPDX-License-Identifier: MIT
// https://eips.ethereum.org/EIPS/eip-7683

pragma solidity >=0.8.0;

/// @dev Interface of ERC-7683 destination settler.
interface IDestinationSettler {
    function fill(bytes32 orderId, bytes calldata originData, bytes calldata fillerData) external;
}
