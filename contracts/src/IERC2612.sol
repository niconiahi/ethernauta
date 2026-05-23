// SPDX-License-Identifier: MIT
// https://eips.ethereum.org/EIPS/eip-2612
// OpenZeppelin Contracts (last updated v5.4.0) (token/ERC20/extensions/IERC20Permit.sol)

pragma solidity >=0.6.2;

/// @dev Interface of the ERC-2612 (Permit Extension for ERC-20 Signed Approvals).
interface IERC2612 {
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    function nonces(address owner) external view returns (uint256);

    // solhint-disable-next-line func-name-mixedcase
    function DOMAIN_SEPARATOR() external view returns (bytes32);
}
