// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title BatchExecutor
/// @notice Minimal delegation target for EIP-7702. Once an EOA
///         sets its code to this contract via a type-4 tx, the
///         EOA gains the ability to execute a batch of calls
///         atomically in a single transaction.
///
///         The only authorized caller is the account itself
///         (`msg.sender == address(this)`) — after 7702
///         delegation, the EOA's own `CALL` to itself satisfies
///         this, while any other caller is rejected.
contract BatchExecutor {
    struct Call {
        address to;
        uint256 value;
        bytes data;
    }

    error Unauthorized();
    error CallFailed(uint256 index, bytes returnData);

    event Executed(uint256 count);

    /// @notice Execute a batch of calls. Reverts the whole
    ///         batch if any sub-call fails — atomic semantics.
    /// @param calls The calls to execute in order.
    function execute(Call[] calldata calls) external payable {
        if (msg.sender != address(this)) revert Unauthorized();
        uint256 length = calls.length;
        for (uint256 i = 0; i < length; ++i) {
            Call calldata call = calls[i];
            (bool ok, bytes memory ret) =
                call.to.call{value: call.value}(call.data);
            if (!ok) revert CallFailed(i, ret);
        }
        emit Executed(length);
    }

    receive() external payable {}
}
