# Immediate Transitions and Entry Actions in Robot3

This document explains how to implement automatic state transitions and entry actions using Robot3 for the wallet's state machine.

## Core Concepts

### 1. `invoke` - Async Entry Actions

Use `invoke` to execute async functions when entering a state. Perfect for checking vault existence:

**Basic Example:**
```typescript
import { invoke } from "robot3"
import { vault_exists } from "../utils/vault"

const machine = createMachine({
  startup: invoke(vault_exists, 
    transition("done", "locked"),    // vault exists -> locked
    transition("error", "mnemonics") // no vault -> mnemonics
  ),
  locked: state(/* ... */),
  mnemonics: state(/* ... */)
})
```

**Real Use Case - Password Validation:**
```typescript
import { invoke, action } from "robot3"
import { get_vault } from "../utils/vault"

const machine = createMachine({
  locked: state(
    transition("submit_password", "validating_password")
  ),
  validating_password: invoke(
    (ctx, event) => get_vault(event.password),
    transition("done", "unlocked", action((ctx, event) => {
      ctx.mnemonic = event.data // Store decrypted mnemonic
      ctx.password = event.password
    })),
    transition("error", "locked", action((ctx) => {
      ctx.error = "Invalid password"
    }))
  ),
  unlocked: state(/* ... */)
})
```

**UI Integration:**
```tsx
// In your locked view component
function LockedView({ state, send }: { state: ControllerState; send: ControllerSend }) {
  const [password, setPassword] = useState("")
  
  const handleSubmit = (e: Event) => {
    e.preventDefault()
    send({ type: "submit_password", password })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
      />
      <button type="submit" disabled={state.name === "validating_password"}>
        {state.name === "validating_password" ? "Validating..." : "Unlock"}
      </button>
      {state.context.error && <p>{state.context.error}</p>}
    </form>
  )
}
```

### 2. `immediate` - Synchronous Auto Transitions

Use `immediate` for instant transitions based on context:

**Basic Example:**
```typescript
import { immediate, guard } from "robot3"

const machine = createMachine({
  mnemonics: state(
    immediate("validate", 
      guard(ctx => ctx.has_valid_mnemonic),
      transition("validated", "set_password")
    ),
    transition("submit", "validate")
  ),
  validate: state(
    immediate("set_password", transition("done", "set_password")),
    immediate("mnemonics", transition("invalid", "mnemonics"))
  ),
  set_password: state(/* ... */)
})
```

**Real Use Case - Auto-routing Based on Context:**
```typescript
import { immediate, guard, action } from "robot3"

const machine = createMachine({
  checking_session: state(
    // If user has active session, go straight to unlocked
    immediate("unlocked",
      guard(ctx => ctx.session_token && ctx.session_expires > Date.now()),
      transition("auto_unlock", "unlocked")
    ),
    // If vault exists but no session, go to locked
    immediate("locked",
      guard(ctx => ctx.has_vault && !ctx.session_token),
      transition("needs_password", "locked")
    ),
    // No vault, first time setup
    immediate("mnemonics",
      guard(ctx => !ctx.has_vault),
      transition("first_time", "mnemonics")
    )
  ),
  mnemonics: state(/* ... */),
  locked: state(/* ... */),
  unlocked: state(/* ... */)
})
```

**Context Setup:**
```typescript
async function context() {
  const has_vault = await vault_exists()
  const session_token = localStorage.getItem("session_token")
  const session_expires = parseInt(localStorage.getItem("session_expires") || "0")
  
  return {
    has_vault,
    session_token,
    session_expires,
    mnemonic: null,
    error: null,
    user: "Andy"
  }
}
```

### 3. `guard` - Conditional Logic

Guards prevent transitions unless conditions are met:

**Form Validation Example:**
```typescript
import { guard, action } from "robot3"
import { validate_mnemonic } from "../utils/vault"

const machine = createMachine({
  enter_mnemonic: state(
    transition("validate", "validating",
      guard((ctx, event) => {
        const words = event.mnemonic.trim().split(/\s+/)
        return words.length >= 12 && words.length <= 24
      }),
      action((ctx, event) => {
        ctx.mnemonic = event.mnemonic
        ctx.error = null
      })
    ),
    transition("validate", "enter_mnemonic",
      action((ctx) => {
        ctx.error = "Mnemonic must be 12-24 words"
      })
    )
  ),
  validating: invoke(
    (ctx) => validate_mnemonic(ctx.mnemonic),
    transition("done", "set_password"),
    transition("error", "enter_mnemonic", action((ctx) => {
      ctx.error = "Invalid mnemonic phrase"
    }))
  )
})
```

**UI with Validation:**
```tsx
function MnemonicView({ state, send }: { state: ControllerState; send: ControllerSend }) {
  const [mnemonic, setMnemonic] = useState("")
  
  const wordCount = mnemonic.trim().split(/\s+/).length
  const isValidLength = wordCount >= 12 && wordCount <= 24
  
  return (
    <div>
      <textarea
        value={mnemonic}
        onChange={(e) => setMnemonic(e.target.value)}
        placeholder="Enter your 12 or 24 word mnemonic phrase"
        rows={4}
      />
      <p>Words: {wordCount} {!isValidLength && wordCount > 0 && "(12-24 required)"}</p>
      <button 
        onClick={() => send({ type: "validate", mnemonic })}
        disabled={!isValidLength || state.name === "validating"}
      >
        {state.name === "validating" ? "Validating..." : "Continue"}
      </button>
      {state.context.error && <p style={{ color: "red" }}>{state.context.error}</p>}
    </div>
  )
}
```

### 4. Complete Wallet Flow Example

Here's a complete working example combining all patterns:

```typescript
import { 
  createMachine, 
  state, 
  invoke, 
  immediate, 
  guard, 
  action, 
  transition 
} from "robot3"
import { vault_exists, get_vault, set_vault, validate_mnemonic } from "../utils/vault"

async function context() {
  const has_vault = await vault_exists()
  return {
    has_vault,
    mnemonic: null,
    password: null,
    error: null,
    user: "Andy"
  }
}

const wallet_machine = createMachine({
  // Entry point - check what user needs to do
  startup: state(
    immediate("locked", 
      guard(ctx => ctx.has_vault),
      transition("existing_wallet", "locked")
    ),
    immediate("mnemonics",
      guard(ctx => !ctx.has_vault),
      transition("new_wallet", "mnemonics")
    )
  ),

  // New wallet setup flow
  mnemonics: state(
    transition("validate_mnemonic", "validating_mnemonic")
  ),
  
  validating_mnemonic: invoke(
    (ctx, event) => {
      if (!validate_mnemonic(event.mnemonic)) {
        throw new Error("Invalid mnemonic phrase")
      }
      return Promise.resolve(event.mnemonic)
    },
    transition("done", "set_password", action((ctx, event) => {
      ctx.mnemonic = event.data
      ctx.error = null
    })),
    transition("error", "mnemonics", action((ctx, event) => {
      ctx.error = event.data.message
    }))
  ),

  set_password: state(
    transition("create_vault", "creating_vault")
  ),

  creating_vault: invoke(
    (ctx, event) => set_vault(ctx.mnemonic, event.password),
    transition("done", "unlocked", action((ctx, event) => {
      ctx.password = event.password
      ctx.has_vault = true
    })),
    transition("error", "set_password", action((ctx, event) => {
      ctx.error = "Failed to create vault"
    }))
  ),

  // Existing wallet unlock flow
  locked: state(
    transition("submit_password", "validating_password")
  ),

  validating_password: invoke(
    (ctx, event) => get_vault(event.password),
    transition("done", "unlocked", action((ctx, event) => {
      ctx.mnemonic = event.data
      ctx.password = event.password
      ctx.error = null
    })),
    transition("error", "locked", action((ctx) => {
      ctx.error = "Invalid password"
    }))
  ),

  // Main wallet interface
  unlocked: state(
    transition("lock", "locked", action((ctx) => {
      ctx.mnemonic = null
      ctx.password = null
    }))
  )
}, context)

export type WalletMachine = typeof wallet_machine
export type WalletSend = SendFunction<GetMachineTransitions<WalletMachine>>
export type WalletState = WalletMachine["state"] & { 
  context: WalletMachine["context"] 
}
```

**Complete UI Integration:**
```tsx
import { useMachine } from "@preact/hooks"
import { wallet_machine, type WalletSend, type WalletState } from "./wallet-machine"

function WalletApp() {
  const [state, send] = useMachine(wallet_machine)
  
  switch (state.name) {
    case "startup":
      return <div>Loading...</div>
      
    case "mnemonics":
      return <MnemonicSetup state={state} send={send} />
      
    case "validating_mnemonic":
      return <div>Validating mnemonic...</div>
      
    case "set_password":
      return <PasswordSetup state={state} send={send} />
      
    case "creating_vault":
      return <div>Creating secure vault...</div>
      
    case "locked":
      return <UnlockWallet state={state} send={send} />
      
    case "validating_password":
      return <div>Validating password...</div>
      
    case "unlocked":
      return <WalletInterface state={state} send={send} />
      
    default:
      return <div>Unknown state: {state.name}</div>
  }
}

function MnemonicSetup({ state, send }: { state: WalletState; send: WalletSend }) {
  const [mnemonic, setMnemonic] = useState("")
  
  return (
    <div>
      <h2>Enter Recovery Phrase</h2>
      <textarea
        value={mnemonic}
        onChange={(e) => setMnemonic(e.target.value)}
        placeholder="Enter your 12 or 24 word recovery phrase"
      />
      <button onClick={() => send({ type: "validate_mnemonic", mnemonic })}>
        Continue
      </button>
      {state.context.error && <p style={{ color: "red" }}>{state.context.error}</p>}
    </div>
  )
}

function PasswordSetup({ state, send }: { state: WalletState; send: WalletSend }) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  const canSubmit = password.length >= 8 && password === confirmPassword
  
  return (
    <div>
      <h2>Set Wallet Password</h2>
      <input
        type="password"
        placeholder="Enter password (min 8 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button 
        disabled={!canSubmit}
        onClick={() => send({ type: "create_vault", password })}
      >
        Create Wallet
      </button>
      {state.context.error && <p style={{ color: "red" }}>{state.context.error}</p>}
    </div>
  )
}

function UnlockWallet({ state, send }: { state: WalletState; send: WalletSend }) {
  const [password, setPassword] = useState("")
  
  return (
    <div>
      <h2>Unlock Wallet</h2>
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && send({ type: "submit_password", password })}
      />
      <button onClick={() => send({ type: "submit_password", password })}>
        Unlock
      </button>
      {state.context.error && <p style={{ color: "red" }}>{state.context.error}</p>}
    </div>
  )
}

function WalletInterface({ state, send }: { state: WalletState; send: WalletSend }) {
  return (
    <div>
      <h2>Wallet Unlocked</h2>
      <p>Welcome back, {state.context.user}!</p>
      <button onClick={() => send({ type: "lock" })}>
        Lock Wallet
      </button>
      {/* Add your wallet features here */}
    </div>
  )
}
```

## Key Patterns Summary

### Entry Actions with `invoke`
- **Use for**: Async operations on state entry (vault checks, API calls)
- **Pattern**: `invoke(asyncFunction, transition("done", "success"), transition("error", "failure"))`
- **Best for**: Database reads, network requests, crypto operations

### Auto-routing with `immediate`
- **Use for**: Conditional state transitions based on context
- **Pattern**: `immediate("target", guard(condition), transition("event", "state"))`
- **Best for**: Session checks, feature flags, conditional flows

### Validation with `guard`
- **Use for**: Preventing invalid transitions
- **Pattern**: `transition("event", "target", guard(validation), action(sideEffect))`
- **Best for**: Form validation, permission checks, data validation

### State Management Best Practices
1. **Keep context minimal** - Only store what you need
2. **Use actions for side effects** - Update context during transitions
3. **Handle errors gracefully** - Always have error transitions
4. **Type everything** - Export machine types for components
5. **Separate concerns** - One responsibility per state

## Implementation Checklist

- [ ] Define your context function with async vault check
- [ ] Add startup state with `immediate` routing
- [ ] Use `invoke` for all async operations (vault, crypto)
- [ ] Add `guard` functions for input validation
- [ ] Export proper types for UI components
- [ ] Handle loading states for better UX
- [ ] Add error handling with user-friendly messages
- [ ] Test state transitions thoroughly

This documentation provides working examples you can adapt for your specific wallet implementation needs.
