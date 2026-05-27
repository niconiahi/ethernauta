# contracts

Foundry project for Ethernauta's demo contracts. Targets used
by the playground examples to prove the TS primitives work
end-to-end on a real chain.

## Layout

```
contracts/
├── foundry.toml
├── src/        Solidity sources
├── test/       Forge tests
├── script/     Deploy + management scripts
└── out/        Build artifacts (gitignored)
```

`forge-std` is installed at the repo root (`../lib/forge-std`)
because Foundry locates the lib dir relative to the git root.

## Commands

```bash
# from contracts/
forge build
forge test
forge test -vv          # verbose (events, logs)
forge test --match-test test_executes_single_call
```

## Deploying BatchExecutor to Sepolia

```bash
export SEPOLIA_RPC_URL=https://...
export PRIVATE_KEY=0x...
export ETHERSCAN_API_KEY=...

forge script script/DeployBatchExecutor.s.sol \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --verify
```

After deploy, copy the printed address into the playground
example at `apps/playground/app/examples/delegate-7702/`.

## Contracts

### BatchExecutor

Minimal EIP-7702 delegation target. Exposes one function:

```solidity
function execute(Call[] calldata calls) external payable
```

Reverts unless `msg.sender == address(this)` — which, after a
7702 delegation, is satisfied by the EOA's own `CALL` to
itself. Atomic semantics: any sub-call revert reverts the
whole batch.
