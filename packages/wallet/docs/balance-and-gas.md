# Cryptoman Wallet Enhancement: Balance Display & Modern Gas Pricing

## Phase 1: Show Balance in Wallet

### 1.1 Create Balance Service (`packages/wallet/src/utils/balance.ts`)
**Purpose**: Centralized balance fetching and formatting utilities

**Implementation**:
```typescript
import { eth_getBalance } from "@cryptoman/eth"
import { signal } from "@preact/signals"
import type { Reader, ChainId } from "@cryptoman/transport"
import type { Address } from "@cryptoman/eth"
import { hex_to_big } from "./crypto"

export const balance = signal<bigint>(0n)

export async function fetch_balance(
  address: Address, 
  reader: Reader, 
  chain_id: ChainId
): Promise<bigint> {
  const readable = eth_getBalance([address, "latest"])
  const balance_wei = await readable(reader(chain_id))
  return hex_to_big(balance_wei)
}

export function wei_to_eth(wei: bigint): string {
  // Convert wei to ETH with proper decimal formatting (18 decimals)
  const eth_value = Number(wei) / 1e18
  return eth_value.toFixed(6) // Show 6 decimal places
}

export async function refresh_balance(
  address: Address,
  reader: Reader,
  chain_id: ChainId
): Promise<void> {
  const new_balance = await fetch_balance(address, reader, chain_id)
  balance.value = new_balance
}
```

### 1.2 Integrate Balance into Wallet State (`packages/wallet/src/utils/wallet.ts`)
**Changes**:
- Add balance fetching to `restore_wallet()` function
- Update balance signal after successful wallet restoration
- Add `refresh_balance()` utility function

```typescript
// Add to existing wallet.ts
import { refresh_balance } from "./balance"
import { reader, sepolia_chain_id } from "./sign-transaction"

// Modify restore_wallet function to include balance fetching
export async function restore_wallet() {
  // ... existing wallet restoration logic ...
  
  // NEW: Fetch balance after wallet restoration
  if (wallet.value.address) {
    await refresh_balance(
      wallet.value.address as Address,
      reader,
      sepolia_chain_id
    )
  }
}
```

### 1.3 Update Wallet View (`packages/wallet/src/views/wallet/index.tsx`)
**Enhancement**:
```typescript
import { wallet } from "../../utils/wallet"
import { balance, refresh_balance, wei_to_eth } from "../../utils/balance"
import { reader, sepolia_chain_id } from "../../utils/sign-transaction"
import type { Address } from "@cryptoman/eth"

export function Wallet() {
  const handle_refresh_balance = async () => {
    if (wallet.value.address) {
      await refresh_balance(
        wallet.value.address as Address,
        reader,
        sepolia_chain_id
      )
    }
  }

  return (
    <div>
      <div>Address: {wallet.value.address}</div>
      <div>Balance: {wei_to_eth(balance.value)} ETH</div>
      <button onClick={handle_refresh_balance}>
        Refresh Balance
      </button>
    </div>
  )
}
```

### 1.4 Add Balance to Sign View (`packages/wallet/src/views/sign/index.tsx`)
**Purpose**: Show balance vs transaction cost before signing
- Display current balance
- Show estimated transaction cost
- Block signing if insufficient funds

```typescript
// Add balance display to existing sign view
import { balance, wei_to_eth } from "../../utils/balance"

export function Sign() {
  return (
    <div>
      <div>Current Balance: {wei_to_eth(balance.value)} ETH</div>
      <div>Transaction Details:</div>
      {/* ... existing transaction display ... */}
      <div>Estimated Cost: [TO BE CALCULATED] ETH</div>
      {/* ... existing sign button ... */}
    </div>
  )
}
```

---

## Phase 2: Modern EIP-1559 Gas Pricing

### 2.1 Create Modern Gas Price Service (`packages/wallet/src/utils/gas-price.ts`)
**Purpose**: Implement proper EIP-1559 fee estimation using `eth_feeHistory`

**EIP-1559 Fee Strategy**:
```typescript
import { eth_feeHistory } from "@cryptoman/eth"
import type { Reader, ChainId } from "@cryptoman/transport"
import { hex_to_big, number_to_hex } from "./crypto"

interface ModernGasPrices {
  base_fee_per_gas: bigint        // From latest block
  max_priority_fee_per_gas: bigint // From fee history percentiles
  max_fee_per_gas: bigint         // base_fee * 2 + priority_fee
  estimated_total_cost: bigint    // For UI display
}

function calculate_priority_fee(rewards: bigint[][]): bigint {
  // Use 25th percentile of priority fees from recent blocks
  const priority_fees = rewards.map(block_rewards => block_rewards[1] || 0n) // 25th percentile
  const valid_fees = priority_fees.filter(fee => fee > 0n)
  
  if (valid_fees.length === 0) {
    return 500_000_000n // 0.5 gwei fallback
  }
  
  // Calculate median priority fee
  valid_fees.sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
  const median = valid_fees[Math.floor(valid_fees.length / 2)]
  
  // Add 10% buffer for inclusion speed
  return median + (median / 10n)
}

export async function get_modern_gas_prices(
  reader: Reader,
  chain_id: ChainId,
  gas_limit: bigint = 21000n
): Promise<ModernGasPrices> {
  try {
    // 1. Get fee history for last 20 blocks
    const readable = eth_feeHistory([
      number_to_hex(20),        // 20 blocks
      "latest",                 // newest block
      [10, 25, 50]             // 10th, 25th, 50th percentiles
    ])
    const fee_history = await readable(reader(chain_id))
    
    // 2. Extract base fee from latest block
    const latest_base_fee_hex = fee_history.baseFeePerGas.at(-1)
    if (!latest_base_fee_hex) {
      throw new Error("No base fee data available")
    }
    const latest_base_fee = hex_to_big(latest_base_fee_hex)
    
    // 3. Calculate priority fee from fee history
    const rewards_hex = fee_history.reward
    const rewards_bigint = rewards_hex.map(block_rewards => 
      block_rewards.map(reward => hex_to_big(reward))
    )
    const priority_fee = calculate_priority_fee(rewards_bigint)
    
    // 4. Set max_fee_per_gas = (base_fee * 2) + priority_fee
    // This ensures transaction goes through even if base fee doubles
    const max_fee = (latest_base_fee * 2n) + priority_fee
    
    return {
      base_fee_per_gas: latest_base_fee,
      max_priority_fee_per_gas: priority_fee,
      max_fee_per_gas: max_fee,
      estimated_total_cost: gas_limit * max_fee
    }
  } catch (error) {
    // Fallback to reasonable defaults if fee history fails
    console.warn("Fee history failed, using fallbacks:", error)
    return {
      base_fee_per_gas: 1_000_000_000n,      // 1 gwei
      max_priority_fee_per_gas: 500_000_000n, // 0.5 gwei
      max_fee_per_gas: 2_500_000_000n,       // 2.5 gwei total
      estimated_total_cost: gas_limit * 2_500_000_000n
    }
  }
}
```

### 2.2 Replace Hardcoded Gas Functions (`packages/wallet/src/utils/sign-transaction.ts`)
**Remove**:
- `get_max_fee_per_gas()` - Delete hardcoded 20 gwei function
- `get_max_priority_fee_per_gas()` - Delete hardcoded 2 gwei function

**Replace with**:
```typescript
import { get_modern_gas_prices } from "./gas-price"

export async function sign_transaction(
  method: Transaction["method"],
  params: Transaction["params"],
) {
  const address = wallet.value.address as Address
  const { to, value, data } = get_fields_from_transaction(
    method,
    params,
  )
  
  // NEW: Get dynamic gas prices using EIP-1559
  const gas_limit = get_gas_limit()
  const gas_prices = await get_modern_gas_prices(
    reader, 
    sepolia_chain_id,
    gas_limit
  )
  
  // NEW: Validate sufficient funds before signing
  await validate_transaction_funds(
    address,
    value,
    gas_prices,
    reader,
    sepolia_chain_id
  )
  
  const transaction: Eip1559TransactionUnsigned = {
    to,
    data,
    value,
    nonce: await get_nonce(
      address,
      reader,
      sepolia_chain_id,
    ),
    chain_id: get_chain_id(),
    gas_limit,
    access_list: get_access_list(),
    max_fee_per_gas: gas_prices.max_fee_per_gas,
    max_priority_fee_per_gas: gas_prices.max_priority_fee_per_gas,
  }
  
  const private_key = get_private_key(wallet.value.key)
  const encoded = encode_eip155_transaction_unsigned(
    transaction,
    private_key,
  )
  return encoded
}
```

### 2.3 Add Pre-Transaction Validation
**Purpose**: Check sufficient funds before signing

```typescript
// Add to sign-transaction.ts
import { fetch_balance, wei_to_eth } from "./balance"

async function validate_transaction_funds(
  address: Address,
  value: bigint,
  gas_prices: ModernGasPrices,
  reader: Reader,
  chain_id: ChainId
): Promise<void> {
  const current_balance = await fetch_balance(address, reader, chain_id)
  const total_cost = value + gas_prices.estimated_total_cost
  
  if (current_balance < total_cost) {
    throw new Error(
      `Insufficient funds: need ${wei_to_eth(total_cost)} ETH, have ${wei_to_eth(current_balance)} ETH`
    )
  }
}
```

### 2.4 Enhance Sign View with Cost Breakdown
**Display**: 
- Current Balance
- Transaction Value
- Estimated Gas Cost (base fee + priority fee breakdown)
- Total Cost
- Remaining Balance After Transaction

```typescript
// Enhanced sign view with cost breakdown
import { get_modern_gas_prices } from "../../utils/gas-price"
import { balance, wei_to_eth } from "../../utils/balance"
import { reader, sepolia_chain_id } from "../../utils/sign-transaction"

export function Sign() {
  const [gas_prices, set_gas_prices] = useState<ModernGasPrices | null>(null)
  const [transaction_value, set_transaction_value] = useState<bigint>(0n)
  
  useEffect(() => {
    // Calculate gas prices when component mounts
    get_modern_gas_prices(reader, sepolia_chain_id)
      .then(set_gas_prices)
      .catch(console.error)
  }, [])
  
  const total_cost = gas_prices 
    ? transaction_value + gas_prices.estimated_total_cost 
    : 0n
  const remaining_balance = balance.value - total_cost

  return (
    <div>
      <h3>Transaction Details</h3>
      <div>Current Balance: {wei_to_eth(balance.value)} ETH</div>
      <div>Transaction Value: {wei_to_eth(transaction_value)} ETH</div>
      
      {gas_prices && (
        <div>
          <h4>Gas Cost Breakdown</h4>
          <div>Base Fee: {wei_to_eth(gas_prices.base_fee_per_gas * 21000n)} ETH</div>
          <div>Priority Fee: {wei_to_eth(gas_prices.max_priority_fee_per_gas * 21000n)} ETH</div>
          <div>Total Gas Cost: {wei_to_eth(gas_prices.estimated_total_cost)} ETH</div>
        </div>
      )}
      
      <div>
        <strong>Total Cost: {wei_to_eth(total_cost)} ETH</strong>
      </div>
      <div>
        Remaining Balance: {wei_to_eth(remaining_balance)} ETH
      </div>
      
      {remaining_balance < 0n && (
        <div style={{ color: 'red' }}>
          ⚠️ Insufficient funds for this transaction
        </div>
      )}
      
      {/* ... existing sign button ... */}
    </div>
  )
}
```

---

## Implementation Benefits

### **Modern EIP-1559 Advantages**:
1. **Predictable Pricing**: Base fee adjusts automatically to network congestion
2. **Faster Inclusion**: Priority fee ensures miners include the transaction
3. **Cost Efficiency**: More accurate fee estimation, avoiding overpayment
4. **Future-Proof**: Complies with Ethereum's modern fee mechanism

### **Balance Integration Benefits**:
1. **User Awareness**: Clear visibility of available funds
2. **Transaction Safety**: Prevents failed transactions due to insufficient funds
3. **Better UX**: Real-time balance updates and cost transparency
4. **Error Prevention**: Pre-validation catches funding issues before signing

### **Technical Excellence**:
- Uses existing `@cryptoman/eth` methods (`eth_getBalance`, `eth_feeHistory`)
- Reactive UI updates with Preact signals
- Proper error handling and fallbacks  
- Type-safe implementation with Valibot validation

### **Implementation Order**:
1. **Phase 1**: Balance display provides immediate user value
2. **Phase 2**: Modern gas pricing ensures optimal transaction costs
3. **Integration**: Both phases work together for complete transaction transparency

### **Testing Strategy**:
- Test balance fetching with various addresses
- Verify gas price calculations across different network conditions
- Validate insufficient funds error handling
- Ensure UI updates correctly with balance changes