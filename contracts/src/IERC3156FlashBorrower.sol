// SPDX-License-Identifier: MIT
// https://eips.ethereum.org/EIPS/eip-3156

pragma solidity >=0.6.2;

/// @dev Interface of the ERC-3156 (Flash Loans) borrower callback.
/// Receives `onFlashLoan` from an IERC3156FlashLender during a flash
/// loan. The lender interface lives in IERC3156FlashLender.sol.
interface IERC3156FlashBorrower {
    function onFlashLoan(
        address initiator,
        address token,
        uint256 amount,
        uint256 fee,
        bytes calldata data
    ) external returns (bytes32);
}
