import type { Call } from "../base"
import type { HttpTransport } from "../http"
import type { FailedResponse, SuccesfulResponse } from "../json-rpc"

export function createReader(transports: HttpTransport[]):
(_call: Call) => Promise<FailedResponse | SuccesfulResponse> {
  // for now, just pick the first transport and use it
  return transports[0]
}

export type Reader = ReturnType<typeof createReader>
export type Readable<T> = (_reader: Reader) => Promise<T>
