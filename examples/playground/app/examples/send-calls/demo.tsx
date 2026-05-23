import { DualPathDemo } from "../../components/dual-path-demo"
import { SendCallsPrimitive } from "./primitive"
import primitiveSource from "./primitive.tsx?raw"
import { SendCallsStandard } from "./standard"
import standardSource from "./standard.tsx?raw"

export function SendCallsDemo() {
  return (
    <DualPathDemo
      left={{
        title: "Standard · wallet_sendCalls",
        subtitle:
          "EIP-5792 via the user-picked EIP-1193 provider. One prompt; the wallet sequences the batch.",
        rendered: <SendCallsStandard />,
        source: standardSource,
      }}
      right={{
        title: "Primitives · sequential sign + broadcast",
        subtitle:
          "eth_signTransaction (wallet) + eth_sendRawTransaction (public RPC). One prompt per call; the dapp owns the lifecycle.",
        rendered: <SendCallsPrimitive />,
        source: primitiveSource,
      }}
    />
  )
}
