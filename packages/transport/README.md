This module aims to be an un-opinionated representation of the defined:

- [JSON-RPC 2.0 specification](https://www.jsonrpc.org/specification)

## API

### reader

```tsx
import { createReader, http } from "@ethernauta/transport";
import { eip155_1, eip155_11155111 } from "@ethernauta/chain";
import { getBlockByHash } from "@ethernauta/eth";

const reader = createReader([
  http(
    "https://snowy-fragrant-haze.ethereum-sepolia.quiknode.pro/71bd09c56eb85b1c420871faa17483fa65ba8177"
  ),
]);

const currentChain = eip155_1;
const reader = createReader([
  {
    chain: eip155_1,
    transports: [
      http(
        "https://doggy-hazelnut-hat.ethereum-mainnet.quiknode.pro/71bd09c56eb85b1c420871faa17483fa65ba4179"
      ),
      http(
        "https://doggy-hazelnut-hat.ethereum-mainnet.quiknode.pro/71bd09c56eb85b1c222871faa17483fa65ba6167"
      ),
    ],
  },
  {
    chain: eip155_11155111,
    transports: [
      http(
        "https://doggy-hazelnut-hat.ethereum-sepolia.quiknode.pro/71bd09c56eb85b1c420871faa17483fa65ba4179"
      ),
      http(
        "https://doggy-hazelnut-hat.ethereum-sepolia.quiknode.pro/71bd09c56eb85b1c222871faa17483fa65ba6167"
      ),
    ],
  },
]);
const readable = getBlockByHash([
  "0x31386e6cfba70bb4d8a95404bdb740572b758a15c62e51ee912071a7b5be9e26",
  false,
]);

// target one chain
const block = await readable(reader(eip155_11155111));

// or the other
const block = await readable(reader(eip155_1));

// or lets you know if an incompatible reader is being used.
// you definitely need transports for the chain you are targeting,
// thus erroring out seems reasonable. You are the one controlling which
// chains can be used here
const block = await readable(reader(eip155_2)); // Error
```

### writer

```tsx
import { walletConnect } from "@ethernauta/connector"; // not yet implemented
import { createWriter, http } from "@ethernauta/transport";

const writer = createWriter(http(walletConnect()));
```

### Files to pay attention

1. [base/call/call.ts](src/base/call/call.ts)
2. [http/http.ts](src/http/http.ts)
3. [json-rpc/json-rpc.ts](src/json-rpc/json-rpc.ts)
4. [reader/reader.ts](src/reader/reader.ts)
5. [writer/writer.ts](src/writer/writer.ts)
