// SPDX-License-Identifier: MIT
// https://eips.ethereum.org/EIPS/eip-7683

pragma solidity >=0.8.0;

struct Output {
    bytes32 token;
    uint256 amount;
    bytes32 recipient;
    uint256 chainId;
}

struct FillInstruction {
    uint64 destinationChainId;
    bytes32 destinationSettler;
    bytes originData;
}

struct ResolvedCrossChainOrder {
    address user;
    uint256 originChainId;
    uint32 openDeadline;
    uint32 fillDeadline;
    bytes32 orderId;
    Output[] maxSpent;
    Output[] minReceived;
    FillInstruction[] fillInstructions;
}

struct OnchainCrossChainOrder {
    uint32 fillDeadline;
    bytes32 orderDataType;
    bytes orderData;
}

struct GaslessCrossChainOrder {
    address originSettler;
    address user;
    uint256 nonce;
    uint256 originChainId;
    uint32 openDeadline;
    uint32 fillDeadline;
    bytes32 orderDataType;
    bytes orderData;
}

/// @dev Interface of ERC-7683 (Cross-Chain Intents) origin settler.
interface IOriginSettler {
    event Open(bytes32 indexed orderId, ResolvedCrossChainOrder resolvedOrder);

    function openFor(
        GaslessCrossChainOrder calldata order,
        bytes calldata signature,
        bytes calldata originFillerData
    ) external;

    function open(OnchainCrossChainOrder calldata order) external;

    function resolveFor(GaslessCrossChainOrder calldata order, bytes calldata originFillerData)
        external
        view
        returns (ResolvedCrossChainOrder memory);

    function resolve(OnchainCrossChainOrder calldata order)
        external
        view
        returns (ResolvedCrossChainOrder memory);
}
