# Bridges — how they actually work

Author notes — the mental model every library author should hold
before touching `@ethernauta/bridge` or any per-rollup bridge
methods. Written as a peer-to-peer explanation, not a spec.

## The fundamental thing: L1 and L2 are separate chains with separate state

A contract on L1 cannot read storage on L2. A contract on L2
cannot read storage on L1. There is no "cross-chain call"
primitive at the EVM level. **Every bridge is a protocol built
on top of this nothing.**

What every bridge needs:

1. A way for L1 to *learn* something happened on L2 (and vice
   versa)
2. A way to *prove* it happened (not just claim it)
3. A way to *act* on the proof (release funds, deliver a
   message)

That's it. Everything else is implementation detail.

---

## L1 → L2 is the easy direction

The L2 *is* derived from L1. Every L2 reads L1 (its sequencer
does), so the L2 can just *observe* L1.

The flow:

1. Dapp calls a contract on L1 (`L1StandardBridge.depositETH`,
   `Inbox.createRetryableTicket`,
   `Bridgehub.requestL2TransactionDirect`). This contract emits
   a log.
2. The L2 sequencer reads L1 blocks as they finalize. It sees
   the log.
3. The sequencer includes a *system transaction* on L2 —
   minted from the L1 log, signed by nobody, mints ETH or runs
   calldata on L2.
4. Dapp eventually sees the L2 transaction execute.

That's it. **No proof needed by the user**, because the L2
chain itself enforces "for every L1 deposit log in finalized
L1, there is a corresponding L2 system tx." If the sequencer
doesn't include it, the chain is broken — that's a
consensus-level violation, not a user-level failure.

### What can go wrong on L1→L2

- L2 execution itself reverts (out of gas, bad calldata). On
  OP, the deposit is auto-replayable. On Arbitrum, this is the
  "retryable ticket" model — the L2 tx is created but might
  fail to execute, and the user has 7 days to manually
  `redeem()` it. On zkSync, similar — `claimFailedDeposit()`
  recovers funds if the L2 side failed.
- User provides too little L2 gas. Same outcome — retryable
  expires, deposit becomes claimable back on L1.

### Time

Seconds to minutes. The bottleneck is L1 finality (OP waits
~12 minutes for L1 finality before processing; Arbitrum is
similar; zkSync depends on batch posting). Then L2 picks it up
in the next block.

### Critical insight

L1→L2 has no "prove" step from the user's side. **The L1
contract call IS the proof** — it's a log in finalized L1
history. The L2 reads L1, so it just sees it.

---

## L2 → L1 is the hard direction

L1 does *not* read L2. L1 has no idea what happened on L2. So
the user has to *prove to L1* that something happened on L2.

The flow:

1. Dapp calls a contract on L2 (`L2StandardBridge.withdraw`,
   `ArbSys.sendTxToL1`, `L2BaseToken.withdraw`). This emits an
   L2 log.
2. **Nothing happens on L1 yet.** The L2 sequencer keeps doing
   L2 things.
3. Periodically (hourly to daily), the L2 sequencer batches L2
   state and posts a **state root** to L1. This is a single
   hash committing to "the entire L2 state at block N looks
   like this."
4. **Now** the user can prove to L1: "in L2 state N, log X
   exists at storage slot Y." They construct a Merkle proof
   against the posted state root.
5. The L1 contract verifies the proof and executes the action
   (release funds).

But there's a complication that splits the rollups into two
families:

### Optimistic rollups (OP, Arbitrum)

The state root posted in step 3 is *unverified*. Anyone can
post anything. To prevent fraud, there's a **challenge window
(7 days)**. During the window, anyone can submit a fraud proof
saying "that state root is wrong, here's why." If nobody
challenges, the state root is considered valid after 7 days.

This means L2→L1 on optimistic rollups requires **TWO user
actions**:

- **Prove** the withdrawal (right after state root posts, ~1
  hour to ~1 day after the L2 tx)
- **Finalize** the withdrawal (after the 7-day challenge
  window passes)

The user has to come back twice. The 7 days are a hard wait.

### ZK rollups (zkSync)

The state root posted in step 3 comes with a **validity proof
(a SNARK)** that mathematically proves the L2 state transition
was correct. Once the validity proof is verified on L1
(minutes), the state root is final. **No challenge window.**

So zkSync L2→L1:

- L2 tx
- Wait for batch to be posted + proven on L1 (hours,
  sometimes ~24h)
- Finalize on L1 (single user action)

Faster in theory, but the proof generation is expensive and
not always cheap to construct on-demand — that's why
`zks_getL2ToL1LogProof` exists as an RPC method. The sequencer
constructs the proof and serves it to clients.

### Time-scale comparison

| | L1→L2 | L2→L1 |
|---|---|---|
| OP | ~12 min | ~1 hour to prove + **7 days** to finalize |
| Arbitrum | ~10 min | ~1 hour to prove + **7 days** to execute |
| zkSync | ~10 min | ~24 hours total |

---

## L2 → L2 is the absent direction

There is no native L2↔L2 path. L2s don't read each other. Two
arbitrary L2s have no shared state, no shared sequencer
(usually), no protocol between them.

Three ways people fake it:

1. **L2 → L1 → L2.** Use the two native bridges. Withdraw to
   L1 (7 days on OP/Arbitrum, ~1 day on zkSync), deposit from
   L1 to the other L2 (minutes). Slow but uses only native
   primitives. **This is the only path that respects M4.**
2. **Liquidity bridges** (Across, Hop, Stargate). Run a market
   maker who fronts you funds on the destination chain and
   gets reimbursed via the native bridge later. Fast (seconds)
   but requires the bridge operator's solver network. M4
   violation.
3. **Generic messaging** (LayerZero, Wormhole, Axelar, CCIP).
   A network of relayers carries arbitrary messages between
   chains, with some attestation/multisig/SNARK validity
   model. Maximum flexibility, but every one of these
   introduces a new trust assumption beyond L1+L2 consensus.
   M4 violation.

Per the README, this library only does (1). The user composes
a withdraw + a deposit. We don't ship a verb for it.

---

## The data that travels — and what's important about it

### L1 → L2

The L1 log is the canonical artifact. The dapp tracks the L1
tx hash, and from that hash everything else is derivable.
Even the L2 tx hash can be computed deterministically from
the L1 log on OP and Arbitrum (it's `keccak(L1_log_data)`-
shaped). zkSync similar.

### L2 → L1

This is where it gets gnarly. The artifacts you need:

1. **L2 transaction hash + L2 block number.** This is what
   the user holds onto after step 1.
2. **L2 transaction receipt with the withdrawal log.** Read
   from L2 RPC.
3. **L1 state root commitment block.** When did L1 receive
   the state root that includes step 1's block? Each rollup
   has its own RPC or contract call for this —
   `optimismPortal.outputRootByIndex`, Arbitrum's
   `RollupAdminLogic.getNode`, zkSync's
   `zks_getL1BatchDetails`.
4. **Merkle proof from L2 storage to L2 state root.**
   Constructed by the dapp from L2 state via `eth_getProof`
   (OP) or via a rollup-specific RPC
   (zkSync's `zks_getL2ToL1LogProof`).
5. **The withdrawal hash itself** — derived from L2 log
   fields. Used as a unique identifier on L1 to prevent
   double-finalization.

**This is what makes withdrawals fundamentally different from
sends.** A `transfer()` resolves with an L1 tx hash, and the
dapp can derive everything else from that one piece of state.
A withdrawal needs you to track:

- The L2 hash (kicks it off)
- A "ready to prove" signal (state root posted)
- The L1 prove tx hash (proves on L1)
- A "ready to finalize" signal (challenge window elapsed,
  OP/Arbitrum only)
- The L1 finalize tx hash (releases funds)

**That's the FSM.** And — this is the key thing for our design
— **none of that state actually has to be stored by the
library**. Every piece of it is derivable from the L2 tx hash
by querying both chains. The vendor SDKs lean on this. "Give
me the L2 hash, I'll tell you what state you're in."

That changes the persistence question. The library doesn't
*need* a Store at the shape level — the L2 tx hash is
canonical. Storage is a UX optimization (the dapp doesn't want
to re-derive on every render), not a correctness requirement.

---

## The "what is sent" data

For OP-style bridges, the L2→L1 message format is roughly:

```
nonce | sender | target | value | gasLimit | data
```

That entire blob, plus the L1 block number it was emitted in
and the L2 block number it executed in, is what gets
Merkle-proven into the L1 state root. On finalization, the L1
contract reconstructs `keccak256(nonce | sender | target |
value | gasLimit | data)`, verifies the proof against the
stored state root, and if valid, calls
`target.call{value, gas: gasLimit}(data)` on L1.

So a withdrawal is essentially: "I deposited a message
containing (target, value, data) into the L2 messenger, and 7
days later I'm asking L1 to re-execute it on this side."

**That's the deepest abstraction. Every L1↔L2 message is
"execute this calldata on the other side."** Native ETH/ERC-20
bridging is just the standard bridge contract calling
`ERC20.transfer` as the `data` field. Everything is messages.

---

## The 10 cross-chain action categories — with user stories

Same taxonomy, but grounded in real users doing real things.
Useful for shaping the verb surface — every verb the library
exposes should be traceable back to a story below.

### 1. Value transfers — the canonical case

**Alice has 2 ETH on Ethereum mainnet and wants to ape into a
meme coin that only trades on Velodrome (Optimism).**

She doesn't want to pay $40 in L1 gas every time she swaps, so
she bridges. She opens her dapp, picks "Deposit ETH to
Optimism," signs an L1 tx calling
`L1StandardBridge.bridgeETH(2 ETH)`. Pays ~$3 in L1 gas.
Twelve minutes later, her Optimism wallet shows 2 ETH. She's
done.

Variants:

- **Bob has 5000 DAI he wants to LP on Arbitrum's Camelot.**
  Same flow, but he first approves `L1GatewayRouter` to spend
  his DAI, then calls `outboundTransfer`. Ten minutes later,
  5000 "Arbitrum DAI" (the L2 representation) shows up in his
  wallet.
- **Carol has 1000 USDC and wants it on zkSync.** USDC
  bypasses the standard bridge — Circle runs a custom
  gateway. The library has to route her through
  `L1SharedBridge` with the USDC-specific path, not the
  default token bridge.
- **Dave owns BAYC #4242 and wants to list it on Quix (NFT
  marketplace on Optimism).** Same lock-and-mint pattern but
  with `L1ERC721Bridge`. His Bored Ape locks on mainnet, an
  L2 representation mints on Optimism.

### 2. Arbitrary message calls — programmable cross-chain

**Frank runs a Safe multisig on mainnet that holds his DAO's
treasury. His DAO has just voted to delegate 10,000 governance
tokens on Arbitrum to a different delegate. The treasury
tokens are on Arbitrum, but the signing authority is the L1
Safe.**

The Safe signs an L1 tx calling
`Inbox.createRetryableTicket(target=ArbitrumGovToken,
data=delegate(new_delegate))`. He funds ~0.001 ETH for L2 gas.
Ten minutes later, on Arbitrum, the `delegate()` call executes
— and `msg.sender` is the *aliased* version of his L1 Safe
address (`safe_address +
0x1111000000000000000000000000000000001111`). The gov-token
contract has to know to un-alias it to check ownership.
Without aliasing, an L1 contract could impersonate any L2
EOA.

Reverse direction: **Grace's L2-native DAO on Optimism voted
to upgrade a contract on mainnet.** The DAO contract calls
`L2CrossDomainMessenger.sendMessage(L1_upgradable,
upgrade_calldata)`. Seven days later, Grace proves + finalizes
the message on L1; the L1 contract gets upgraded, `msg.sender`
is the aliased L2 DAO.

### 3. Contract deployment cross-chain

**Hannah is building a dapp that needs the same contract at
the same address on Ethereum, Arbitrum, and zkSync — for
example, a multi-chain ENS-style registry where users expect
"send to 0xabc on any chain" to work.**

She uses CREATE2 with a deterministic salt. On Ethereum she
deploys directly. On Arbitrum she could deploy directly too,
but she wants to do it *from L1* so the deployment is
coordinated with the L1 deploy (atomically funded, same
sender). She sends a retryable ticket targeting Arbitrum's
`Create2Factory` with her bytecode + salt. The L2 execution
does the CREATE2; she gets a deterministic L2 address
matching L1.

zkSync makes this explicit and harder: the `ContractDeployer`
system contract requires the bytecode to be
"factory-published" first. Hannah has to publish the bytecode
hash via `Bridgehub` from L1 before the L2 deploy can use it.

### 4. Force-inclusion (censorship resistance)

**Henry has a 50x leveraged perpetuals position on a DEX
hosted on Arbitrum. His position is deeply underwater. He's
tried to submit a "close position" tx four times in the last
hour, and each time the sequencer has dropped it. He suspects
the protocol team (who runs the sequencer) is stalling so the
position can be liquidated by their own market makers.**

He gives up on the sequencer. He goes to L1 and submits his
close-position tx directly to `Inbox.sendL2Message` on
mainnet — bypassing the sequencer entirely. He waits 24
hours. Then he calls `SequencerInbox.forceInclusion` on L1,
and the L2 chain is now consensus-required to include his tx
within ~10 minutes.

Costs more, takes 24h, but uncensorable. This is the property
that makes a chain a "rollup" instead of just an "L1-anchored
sidechain" — there's always an escape hatch.

### 5. Retryable lifecycle ops (Arbitrum-specific)

**Iris wants to deposit 1000 USDC from L1 to Arbitrum. She
submits the deposit but underestimates the L2 gas — she
funded for 200,000 gas but the L2 receive logic actually
needs 350,000. The L1 part succeeds, the L2 retryable ticket
gets created, but L2 execution fails.**

The funds are now in limbo: locked on L1, queued as an
unredeemed retryable on Arbitrum. She has three options:

- **Redeem.** Call `ArbRetryableTx.redeem(ticketId)` on L2
  with more gas. Costs her another L2 tx but salvages the
  1000 USDC. She has 7 days.
- **Cancel.** Call `cancel()` to abort the retryable and
  trigger an L2→L1 refund. Also requires standard withdrawal
  path (prove + finalize), so 7 more days.
- **Do nothing.** After 7 days the ticket auto-expires, and
  the L1 funds become claimable via the standard "failed
  deposit" path — another 7 days. Worst case: 14 days from
  her original deposit until she has USDC back on L1.

She'll redeem. Costs $2 in L2 gas. Done in 10 minutes.

### 6. Failed-deposit recovery (rollup-specific shape, same intent)

**Jack deposited 0.5 ETH from mainnet to zkSync. The L1
deposit went through fine — his ETH is locked in
`L1SharedBridge`. But he made a mistake: he set the
`l2Receiver` address to a contract on zkSync that doesn't
exist (he typo'd it, or the contract self-destructed). The L2
side reverts. His 0.5 ETH is now stuck in the L1 bridge
contract.**

He calls `L1SharedBridge.claimFailedDeposit(l1Sender,
l1Token, amount, l2TxHash, l2BatchNumber, l2MessageIndex,
l2TxNumberInBatch, merkleProof)` on L1. The contract verifies
the L2 log proof confirming the L2 side actually failed, and
releases the 0.5 ETH back to Jack's L1 address.

- **Same intent on Arbitrum:** retryable expiry → refund
  withdrawal (above).
- **Same intent on OP:** rarer because OP auto-replays failed
  L2 executions, but if the L2 calldata was malformed (vs
  just out-of-gas), the funds can sit replayable forever —
  Jack just resubmits with corrected calldata.

### 7. Wrapped-asset operations

**Kate is a DeFi power-user. She has 50,000 USDC on mainnet
and wants to use it on Aave on Optimism. But she doesn't want
to do "approve USDC, then deposit, then approve aUSDC, then
supply" — that's three transactions over two chains.**

She uses a permit-enabled bridge UX: signs a single EIP-2612
permit signature off-chain that authorizes the bridge to spend
her USDC, then submits one transaction that calls
`permit() + deposit()` atomically. One signature, one L1 tx,
50K USDC arrives on Optimism. The bridge layer is composed
under the hood as "approve via signature + standard deposit,"
but from her perspective it's a single op.

Reverse pattern: **Liam wants to withdraw WETH from Arbitrum
back to mainnet as native ETH.** He doesn't want to manually
unwrap on L1. His bridge verb does `withdraw(WETH) →
unwrap(WETH → ETH) on L1` as a single bundle — but
mechanically it's the standard withdrawal + an L1 follow-up
tx the dapp submits for him.

### 8. Cross-chain reads (L1 state on L2)

**Maya is writing an L2 lending protocol. She wants
Aave-on-Optimism to track the L1 ETH price oracle so it
doesn't need its own Optimism-native oracle (which might have
manipulation risk).**

Her L2 contract reads `L1Block.number()` and
`L1Block.basefee()` from the OP predeploy at
`0x4200000000000000000000000000000000000015`. For the L1
oracle value itself, she'd need a Merkle proof of L1 state,
which is expensive — so in practice she uses a relay
(Chainlink, Pyth) for the actual price feed, but the L1
*block context* (basefee, block hash for randomness) comes
for free via the predeploy.

This isn't a "bridge" the user explicitly triggers — Maya's
contract just reads it on every relevant L2 call. But it's a
cross-chain primitive the library should expose for
L2-contract authors.

L1 cannot do the reverse trustlessly. L1 reading L2 state
requires the same proof machinery as withdrawals.

### 9. Refunds / excess-gas returns

**Nico submits an L1→L2 deposit via Arbitrum. He estimates
the L2 gas at 500,000 (conservative), funds it accordingly
with ~0.002 ETH worth of L2 ETH. The actual L2 execution uses
300,000 gas — 200,000 ETH-worth is unused.**

When he submits the retryable, he picks two refund addresses:

- `excessFeeRefundAddress`: where the unused L2 gas goes if
  execution succeeds.
- `callValueRefundAddress`: where the L2 ETH callvalue goes
  if the L2 call reverts.

If he sets both to his own L2 address, the refund lands on
Arbitrum and he can keep using it for L2 gas later. If he
sets them to L1 addresses... actually you can't refund
directly to L1 — refunds always land on L2, and from there
he'd have to do a regular withdrawal to bring them back to
L1. So in practice "refund to L1" is two steps: refund-to-L2
+ withdraw-to-L1.

OP doesn't have explicit refund addresses — there's no L2
gas market on OP-style deposits the same way. zkSync has
`refundRecipient` in Bridgehub.

A bridge UX has to surface this choice or pick a sensible
default ("refund to your own L2 address").

### 10. Governance / privileged system messages

**Olivia is a council member of the Optimism Security
Council. The council has voted to upgrade the L2 system
contracts to patch a vulnerability.**

She signs a tx (as part of the multisig) on L1 calling
`OptimismPortal.upgradeWithCall(L2_target, upgrade_calldata)`.
This uses the *same deposit machinery* as Alice's ETH bridge
— it queues an L1→L2 message — but the `msg.sender` on L2
will be the privileged Optimism system address
`0x4200000000000000000000000000000000000000`, not the aliased
L1 Safe. That special unaliasing only works for the council's
portal call; nobody else can impersonate the system address.

Twelve minutes later, the upgrade executes on L2.

This is the same primitive as (2), used by the protocol to
operate itself. The library probably doesn't expose verbs for
this — users aren't running rollup governance — but
recognizing it exists matters because it tells you "the
bridge primitive is general enough to upgrade the protocol
that runs it." That's the depth of the abstraction.

---

## The pattern across all 10 stories

Look at the structure of each: *user has X on chain A, wants
Y on chain B, signs N transactions, waits T time, can recover
via Z if something fails.* Strip the rollup names and the
verbs and what's left is:

- **A directional intent** (A→B)
- **A payload** (value, calldata, or both)
- **A lifecycle** (one-shot, two-shot prove+finalize, or
  recovery path)
- **A failure mode** (revert on destination, gas exhaustion,
  censorship)

That's what `Bridgeable<T>` has to capture. The rest is
per-rollup naming.
