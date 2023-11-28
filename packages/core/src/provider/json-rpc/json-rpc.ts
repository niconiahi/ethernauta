// specification links
// https://www.jsonrpc.org/specification
// https://ethereum.org/en/developers/docs/apis/json-rpc/
import type { HttpTransport } from "../../transport";

// https://www.jsonrpc.org/specification#request_object
type JsonRpcRequest = {
  jsonrpc: "2.0";
  method: string;
  params?: JsonRpcParameters;
  id: string | number;
};
// https://www.jsonrpc.org/specification#notification
type JsonRpcNotification = {
  jsonrpc: "2.0";
  method: string;
  params?:
    | unknown[]
    | {
        [name: string]: unknown;
      };
};
// https://www.jsonrpc.org/specification#parameter_structures
type JsonRpcParameters =
  | unknown[]
  | {
      [name: string]: unknown;
    };
// https://www.jsonrpc.org/specification#error_object
const JSON_RPC_REPONSE_ERROR_CODE = {
  PARSE_ERROR: 32700,
  INVALID_REQUEST: 32600,
  METHOD_NOT_FOUND: 32601,
  INVALID_PARAMS: 32602,
  INTERNAL_ERROR: 32603,
} as const;
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

const JSON_RPC_METHOD = {
  BLOCK_NUMBER: "eth_blockNumber",
  SEND_RAW_TRANSACTION: "eth_sendRawTransaction",
} as const;
type JsonRpcMethod = ObjectValues<typeof JSON_RPC_METHOD>;
type JsonRpcParams = {
  [JSON_RPC_METHOD.BLOCK_NUMBER]: [];
  [JSON_RPC_METHOD.SEND_RAW_TRANSACTION]: [[string]];
};
export type JsonRpcCall = {
  [M in JsonRpcMethod]: [M, ...JsonRpcParams[M]];
}[JsonRpcMethod];

export function createJsonRpcClient(transport: HttpTransport) {
  function send(call: [typeof JSON_RPC_METHOD.BLOCK_NUMBER]): number;
  function send(
    call: [typeof JSON_RPC_METHOD.SEND_RAW_TRANSACTION, [string]],
  ): string;
  function send(call: JsonRpcCall): number | string {
    const method = call[0];
    switch (method) {
      // https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blocknumber
      case "eth_blockNumber": {
        transport(call);
        const blockNumber: number = 18241248;
        return blockNumber;
      }
      // https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendrawtransaction
      case "eth_sendRawTransaction": {
        const params = call[1];
        const [signedTransactionData] = params;

        return signedTransactionData;
      }
      default: {
        const _exhaustiveCheck: never = method;
        return _exhaustiveCheck; // this will cause a compile-time error if any method is unhandled
      }
    }
  }

  return { send };
}

type ObjectValues<T> = T[keyof T];
