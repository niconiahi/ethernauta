import { Call } from "../base";
import { HttpTransport } from "../http";
import { FailedResponse, SuccesfulResponse } from "../json-rpc";

export function createReader(transports: HttpTransport[]):
  (call: Call) => Promise<FailedResponse | SuccesfulResponse> {
  // for now, just pick the first transport and use it
  return transports[0]
}

export type Reader = ReturnType<typeof createReader>;
