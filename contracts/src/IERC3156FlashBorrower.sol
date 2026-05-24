// SPDX-License-Identifier: MIT
// https://eips.ethereum.org/EIPS/eip-3156

pragma solidity >=0.6.2;

interface IERC3156FlashBorrower {
    function onFlashLoan(
        address initiator,
        address token,
        uint256 amount,
        uint256 fee,
        bytes calldata data
    ) external returns (bytes32);
}

/// @dev Interface of the ERC-3156 (Flash Loans) lender.
interface IERC3156 {
    function maxFlashLoan(address token) external view returns (uint256);
    function flashFee(address token, uint256 amount) external view returns (uint256);
    function flashLoan(
        IERC3156FlashBorrower receiver,
        address token,
        uint256 amount,
        bytes calldata data
    ) external returns (bool);
}
