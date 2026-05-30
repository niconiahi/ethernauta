// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {BatchExecutor} from "./BatchExecutor.sol";

contract Sink {
    uint256 public total;
    bool public shouldRevert;

    function bump(uint256 by) external payable {
        total += by;
    }

    function explode() external pure {
        revert("boom");
    }

    receive() external payable {}
}

contract BatchExecutorTest is Test {
    BatchExecutor internal exec;
    Sink internal sink;

    function setUp() public {
        exec = new BatchExecutor();
        sink = new Sink();
    }

    /// After 7702 delegation the EOA's code IS the executor's
    /// code, so the call comes from the EOA itself. We simulate
    /// that by pranking msg.sender to be `address(exec)`.
    function _asSelf() internal {
        vm.prank(address(exec));
    }

    function test_executes_single_call() public {
        BatchExecutor.Call[] memory calls =
            new BatchExecutor.Call[](1);
        calls[0] = BatchExecutor.Call({
            to: address(sink),
            value: 0,
            data: abi.encodeCall(Sink.bump, (7))
        });
        _asSelf();
        exec.execute(calls);
        assertEq(sink.total(), 7);
    }

    function test_executes_multiple_calls_in_order()
        public
    {
        BatchExecutor.Call[] memory calls =
            new BatchExecutor.Call[](3);
        calls[0] = BatchExecutor.Call({
            to: address(sink),
            value: 0,
            data: abi.encodeCall(Sink.bump, (1))
        });
        calls[1] = BatchExecutor.Call({
            to: address(sink),
            value: 0,
            data: abi.encodeCall(Sink.bump, (2))
        });
        calls[2] = BatchExecutor.Call({
            to: address(sink),
            value: 0,
            data: abi.encodeCall(Sink.bump, (4))
        });
        _asSelf();
        exec.execute(calls);
        assertEq(sink.total(), 7);
    }

    function test_forwards_value() public {
        vm.deal(address(exec), 1 ether);
        BatchExecutor.Call[] memory calls =
            new BatchExecutor.Call[](1);
        calls[0] = BatchExecutor.Call({
            to: address(sink),
            value: 0.5 ether,
            data: ""
        });
        _asSelf();
        exec.execute(calls);
        assertEq(address(sink).balance, 0.5 ether);
    }

    function test_reverts_if_sub_call_reverts() public {
        BatchExecutor.Call[] memory calls =
            new BatchExecutor.Call[](2);
        calls[0] = BatchExecutor.Call({
            to: address(sink),
            value: 0,
            data: abi.encodeCall(Sink.bump, (1))
        });
        calls[1] = BatchExecutor.Call({
            to: address(sink),
            value: 0,
            data: abi.encodeCall(Sink.explode, ())
        });
        _asSelf();
        vm.expectRevert();
        exec.execute(calls);
        // Atomic: the first bump is rolled back.
        assertEq(sink.total(), 0);
    }

    function test_rejects_unauthorized_caller() public {
        BatchExecutor.Call[] memory calls =
            new BatchExecutor.Call[](1);
        calls[0] = BatchExecutor.Call({
            to: address(sink),
            value: 0,
            data: abi.encodeCall(Sink.bump, (1))
        });
        vm.expectRevert(BatchExecutor.Unauthorized.selector);
        exec.execute(calls);
    }
}
