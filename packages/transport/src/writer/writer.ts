import type { Call } from "../base"
import type { HttpTransport } from "../http"
import type { FailedResponse, SuccesfulResponse } from "../json-rpc"

export function createWriter(transports: HttpTransport[]):
(_call: Call) => Promise<FailedResponse | SuccesfulResponse> {
  // for now, just pick the first transport and use it
  return transports[0]
}

export type Writer = ReturnType<typeof createWriter>
export type Writable<T> = (_reader: Writer) => Promise<T>
