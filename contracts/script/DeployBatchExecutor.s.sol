// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {BatchExecutor} from "../src/BatchExecutor.sol";

contract DeployBatchExecutor is Script {
    function run() external returns (BatchExecutor exec) {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(pk);
        exec = new BatchExecutor();
        vm.stopBroadcast();
        console.log("BatchExecutor:", address(exec));
    }
}
