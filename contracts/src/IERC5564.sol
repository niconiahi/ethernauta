// SPDX-License-Identifier: MIT
// https://eips.ethereum.org/EIPS/eip-5564

pragma solidity >=0.6.2;

/// @dev Interface of ERC-5564 (Stealth Address Announcer).
interface IERC5564 {
    event Announcement(
        uint256 indexed schemeId,
        address indexed stealthAddress,
        address indexed caller,
        bytes ephemeralPubKey,
        bytes metadata
    );

    function announce(
        uint256 schemeId,
        address stealthAddress,
        bytes calldata ephemeralPubKey,
        bytes calldata metadata
    ) external;
}
