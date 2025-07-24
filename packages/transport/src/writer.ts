import type { Call } from "./call"
import type { Http } from "./http"
import type {
  FailedResponse,
  SuccesfulResponse,
} from "./json-rpc"

export function createWriter(
  transports: Http[],
): (
  _call: Call,
) => Promise<FailedResponse | SuccesfulResponse> {
  // for now, just pick the first transport and use it
  const transport = transports[0]
  if (!transport) {
    throw new Error("at least one transport is required")
  }
  return transport
}

export type Writer = ReturnType<typeof createWriter>
export type Writable<T> = (_reader: Writer) => Promise<T>
