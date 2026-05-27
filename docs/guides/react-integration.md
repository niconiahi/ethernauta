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
import { eth_get_balance } from "@ethernauta/eth";
import { useQuery } from "@tanstack/react-query";
import { eip155_1 } from "@ethernauta/chain";

function Balance({ address }: { address: Address }) {
  const provider = useProvider({ key: "wallet" });

  const { data: balance } = useQuery({
    queryKey: ["balance", address, eip155_1.chain_id],
    queryFn: () => eth_get_balance({ address, block: "latest" })(
      provider!.reader({ chain_id: eip155_1.chain_id }),
    ),
    enabled: !!provider,
  });

  return <p>{balance?.toString() ?? "—"}</p>;
}
```

`useProvider` returns a **pre-wrapped** resolver pair — `provider.reader` and `provider.signer` are ready to use, no `create_provider` call needed. The hook does that internally.

## Without a wallet — direct public RPC

If the read doesn't need a wallet, skip the hook entirely:

```tsx
import { create_reader } from "@ethernauta/transport";
import { eth_block_number } from "@ethernauta/eth";
import { eip155_1 } from "@ethernauta/chain";

const reader = create_reader([eip155_1]);

function GlobalBlock() {
  const { data } = useQuery({
    queryKey: ["block", eip155_1.chain_id],
    queryFn: () => eth_block_number()(reader({ chain_id: eip155_1.chain_id })),
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

const store = web_storage(localStorage);

function WalletPicker() {
  const [options, set_options] = useState<EIP6963ProviderDetail[]>([]);

  useEffect(() => {
    discover_providers().then(set_options);
  }, []);

  return (
    <>
      {options.map((detail) => (
        <button
          key={detail.info.rdns}
          onClick={() => {
            set_provider_detail(detail, { store, key: "wallet" });
          }}
        >
          <img src={detail.info.icon} alt="" /> {detail.info.name}
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

function ProviderListeners() {
  const detail = useProviderDetail({ key: "wallet" });

  useEffect(() => {
    if (!detail) return;
    const off1 = watch_accounts(detail.provider, (accounts) => { ... });
    const off2 = watch_chain(detail.provider, (chain_id) => { ... });
    return () => {
      off1();
      off2();
    };
  }, [detail]);

  return null;
}
```

## Signing

```tsx
import { eth_send_transaction } from "@ethernauta/eth";

function SendButton() {
  const provider = useProvider({ key: "wallet" });

  async function send() {
    if (!provider) return;
    const hash = await eth_send_transaction({ to, value, input: "0x" })(
      provider.signer({ chain_id: eip155_1.chain_id }),
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
