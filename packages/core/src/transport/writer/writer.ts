import { Call, HttpTransport, JsonRpcFailedResponse, JsonRpcSuccesfulResponse } from "@ethernauta/core";

export function writer(transports: HttpTransport[]):
  (call: Call) => Promise<JsonRpcFailedResponse | JsonRpcSuccesfulResponse> {
  // for now, just pick the first transport and use it
  return transports[0]
}

export type Writer = ReturnType<typeof writer>;
