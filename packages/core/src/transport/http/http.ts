import type { JsonRpcCall } from "../../provider";

// https://www.jsonrpc.org/specification#parameter_structures
type JsonRpcParameters =
  | unknown[]
  | {
      [name: string]: unknown;
    };
// https://www.jsonrpc.org/specification#request_object
type JsonRpcRequest = {
  jsonrpc: "2.0";
  method: string;
  params?: JsonRpcParameters;
  // An identifier established by the Client that MUST contain a String, Number, or NULL value if included.
  id: string | number;
};
// https://www.jsonrpc.org/specification#notification
type JsonRpcNotification = {
  jsonrpc: "2.0";
  method: string;

  params?: JsonRpcParameters
  // id: If it is not included it is assumed to be a notification
};
// https://www.jsonrpc.org/specification#error_object
const JSON_RPC_REPONSE_ERROR_CODE = {
  PARSE_ERROR: 32700,
  INVALID_REQUEST: 32600,
  METHOD_NOT_FOUND: 32601,
  INVALID_PARAMS: 32602,
  INTERNAL_ERROR: 32603,
} as const;
type ObjectValues<T> = T[keyof T];
type JsonRpcResponseErrorCode = ObjectValues<
  typeof JSON_RPC_REPONSE_ERROR_CODE
>;
// https://www.jsonrpc.org/specification#error_object
interface JsonRpcResponseError extends Error {
  code: JsonRpcResponseErrorCode;
  message: string;
  data?: unknown;
}
// https://www.jsonrpc.org/specification#response_object
export type JsonRpcFailedResponse = {
  jsonrpc: "2.0";
  error: JsonRpcResponseError;
  // result: This member MUST NOT exist if there was an error invoking the method.
};
export type JsonRpcSuccesfulResponse = {
  jsonrpc: "2.0";
  result: unknown;
  // error: This member MUST NOT exist if there was no error triggered during invocation.
};

// https://www.jsonrpc.org/specification#extensions
function validateMethodName(name: string) {
  if (name.startsWith("rpc.")) {
    throw new Error(
      `"rpc." prefixed methods are reserved for system extensions. More info at: https://www.jsonrpc.org/specification#extensions`,
    );
  }
}

// https://www.jsonrpc.org/specification#request_object
export function runJsonRpcRequest(
  request: JsonRpcRequest,
): JsonRpcFailedResponse | JsonRpcSuccesfulResponse {
  validateMethodName(request.method);

  const successful: JsonRpcSuccesfulResponse = {
    jsonrpc: "2.0",
    result: "something",
  };

  return successful;
}
// https://www.jsonrpc.org/specification#notification
export function runJsonRpcNotification(
  notification: JsonRpcNotification,
): JsonRpcFailedResponse | JsonRpcSuccesfulResponse {
  validateMethodName(notification.method);

  const successful: JsonRpcSuccesfulResponse = {
    jsonrpc: "2.0",
    result: "something",
  };

  return successful;
}

// https://www.jsonrpc.org/specification#batch
export function runJsonRpcBatch(
  batch: (JsonRpcRequest | JsonRpcNotification)[],
): (JsonRpcFailedResponse | JsonRpcSuccesfulResponse)[] | JsonRpcFailedResponse {
  batch.every((call) => validateMethodName(call.method));

  const successful: JsonRpcSuccesfulResponse = {
    jsonrpc: "2.0",
    result: "something",
  };
  const error: JsonRpcFailedResponse = {
    jsonrpc: "2.0",
    error: {
      code: 32600,
      message: "omg",
      name: "_omg",
    },
  };

  return [successful, error];
}

export function httpTransport(
  url: string,
): (call: JsonRpcCall) => Promise<JsonRpcFailedResponse | JsonRpcSuccesfulResponse> {
  async function transport(
    call: JsonRpcCall,
  ): Promise<JsonRpcFailedResponse | JsonRpcSuccesfulResponse> {
    const request: JsonRpcRequest = {jsonrpc: '2.0', id: 'SOME_RANDOM_GENERATED_ID',method: call[0], params: call[1] }
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json()) as unknown as JsonRpcSuccesfulResponse;

    return response;
  }

  return transport;
}
export type HttpTransport = ReturnType<typeof httpTransport>;
