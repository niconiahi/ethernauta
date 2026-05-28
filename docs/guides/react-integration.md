---
title: React integration
section: Guides
section_order: 3
order: 7
---

# React integration

`@ethernauta/react` ships two hooks — `useProvider` and `useProviderDetail`. Both are bound by a caller-owned storage key under which the user's selected wallet (from EIP-6963 discovery) is persisted.

The library deliberately doesn't ship `useBalance`, `useEnsName`, `useContractRead`, etc. The resolver shapes compose with React Query / SWR / TanStack Query trivially.

## The typical pattern

```tsx
import { useProvider } from "@ethernauta/react";
import { eth_getBalance } from "@ethernauta/eth";
import { useQuery } from "@tanstack/react-query";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { encode_chain_id } from "@ethernauta/transport";
import type { Address } from "@ethernauta/core";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });

function Balance({ address }: { address: Address }) {
  const provider = useProvider({ key: "wallet" });

  const { data: balance } = useQuery({
    queryKey: ["balance", address, CHAIN_ID],
    queryFn: () => {
      if (!provider) throw new Error("no provider");
      return eth_getBalance([address, "latest"])(
        provider.reader({ chain_id: CHAIN_ID }),
      );
    },
    enabled: !!provider,
  });

  return <p>{balance?.toString() ?? "—"}</p>;
}
```

`useProvider` returns a **pre-wrapped** resolver pair — `provider.reader` and `provider.signer` are ready to use, no `create_provider` call needed. The hook does that internally.

## Without a wallet — direct public RPC

If the read doesn't need a wallet, skip the hook entirely:

```tsx
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { eth_blockNumber } from "@ethernauta/eth";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { useQuery } from "@tanstack/react-query";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const reader = create_reader([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);

function GlobalBlock() {
  const { data } = useQuery({
    queryKey: ["block", CHAIN_ID],
    queryFn: () => eth_blockNumber()(reader({ chain_id: CHAIN_ID })),
  });

  return <p>{data?.toString()}</p>;
}
```

`reader` is module-scoped — created once. No state needed.

## Wallet selection UI

`useProvider` is a **read** hook. To set the persistence (the wallet picker), use `set_provider_detail` from `@ethernauta/eip/6963` directly:

```tsx
import {
  discover_providers,
  set_provider_detail,
  clear_provider_detail,
  web_storage,
  type EIP6963ProviderDetail,
} from "@ethernauta/eip/6963";
import { useEffect, useState } from "react";

const store = web_storage(localStorage);

function WalletPicker() {
  const [options, set_options] = useState<EIP6963ProviderDetail[]>([]);

  useEffect(() => {
    discover_providers().then(set_options);
  }, []);

  return (
    <>
      {options.map((provider_detail) => (
        <button
          key={provider_detail.info.rdns}
          onClick={() => {
            set_provider_detail({ store, key: "wallet", provider_detail });
          }}
        >
          <img src={provider_detail.info.icon} alt="" /> {provider_detail.info.name}
        </button>
      ))}
      <button onClick={() => clear_provider_detail({ store, key: "wallet" })}>
        Disconnect
      </button>
    </>
  );
}
```

After the user picks, `useProvider({ key: "wallet" })` elsewhere in the tree starts yielding the wrapped resolver.

## Showing the connected wallet's name

```tsx
import { useProvider } from "@ethernauta/react";

function ConnectedWallet() {
  const provider = useProvider({ key: "wallet" });

  if (!provider) {
    return <p>Not connected.</p>;
  }

  return (
    <p>
      Connected to <strong>{provider.provider_detail.info.name}</strong>
    </p>
  );
}
```

The `provider_detail` field gives you `info.name`, `info.icon`, `info.rdns`, `info.uuid`.

## Listening for provider events

For `accountsChanged` / `chainChanged`, you need the **raw 1193 provider** (the resolver shapes don't carry the event emitter). Use `useProviderDetail`:

```tsx
import { useProviderDetail } from "@ethernauta/react";
import { watch_accounts, watch_chain } from "@ethernauta/eip/1193";
import { useEffect } from "react";

function ProviderListeners() {
  const provider_detail = useProviderDetail({ key: "wallet" });

  useEffect(() => {
    if (!provider_detail) return;
    const unsubscribe_accounts = watch_accounts(provider_detail.provider, (_accounts) => {
      // react to new accounts
    });
    const unsubscribe_chain = watch_chain(provider_detail.provider, (_chain_id) => {
      // react to chain change
    });
    return () => {
      unsubscribe_accounts();
      unsubscribe_chain();
    };
  }, [provider_detail]);

  return null;
}
```

## Signing

```tsx
import { useProvider } from "@ethernauta/react";
import { eth_sendTransaction } from "@ethernauta/eth";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { encode_chain_id } from "@ethernauta/transport";
import { AddressSchema, BytesSchema, UintSchema } from "@ethernauta/core";
import { parse } from "valibot";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const to = parse(AddressSchema, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
const value = parse(UintSchema, "0x0");
const input = parse(BytesSchema, "0x");

function SendButton() {
  const provider = useProvider({ key: "wallet" });

  async function send() {
    if (!provider) return;
    const hash = await eth_sendTransaction([{ to, value, input }])(
      provider.signer({ chain_id: CHAIN_ID }),
    );
    return hash;
  }

  return <button onClick={send}>Send</button>;
}
```

Plain async function. Wrap with `useMutation` if you want retry / cache invalidation.

## See also

- [@ethernauta/react](/react/overview) — full hook surface.
- [Guide → multi-wallet](/guides/multi-wallet) — discover + persist flow.
- [Concepts → resolver shapes](/concepts/resolver-shapes).
