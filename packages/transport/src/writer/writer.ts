import { Call, HttpTransport } from "../http";
import { JsonRpcFailedResponse, JsonRpcSuccesfulResponse } from "../json-rpc";

export function writer(transports: HttpTransport[]):
  (call: Call) => Promise<JsonRpcFailedResponse | JsonRpcSuccesfulResponse> {
  // for now, just pick the first transport and use it
  return transports[0]
}

export type Writer = ReturnType<typeof writer>;
