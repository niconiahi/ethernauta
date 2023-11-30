import {
  Input,
  array,
  literal,
  number,
  object,
  optional,
  record,
  string,
  union,
  unknown,
  excludes,
  null_,
  tuple,
  parse,
  undefined_,
  variant,
  boolean,
  special
} from "valibot";
import { HttpTransport } from "../../transport";
import { Hexadecimal, hexadecimalSchema } from "../../base";
import { Address, addressSchema } from "../../address";

// https://www.jsonrpc.org/specification#extensions
const methodSchema = string([excludes('rpc.', 'method names that begin with "rpc." are reserved for system extensions')])
// https://www.jsonrpc.org/specification#parameter_structures
const jsonRpcSchema = union([array(unknown()), record(unknown())])
export type JsonRpcParameters = Input<typeof jsonRpcSchema>;
// https://www.jsonrpc.org/specification#request_object
export const jsonRpcRequestSchema = object({
  jsonrpc: literal('2.0'),
  method: methodSchema,
  params: optional(jsonRpcSchema),
  id: union([string(), number(), null_()])
})
export type JsonRpcRequest = Input<typeof jsonRpcRequestSchema>
// https://www.jsonrpc.org/specification#notification
const jsonRpcNotificationSchema = object({
  jsonrpc: literal('2.0'),
  method: methodSchema,
  params: optional(jsonRpcSchema),
})
export type JsonRpcNotification = Input<typeof jsonRpcNotificationSchema>
// https://www.jsonrpc.org/specification#error_object
const jsonRpcResponseErrorSchema = object({
  data: optional(unknown()),
  message: string(),
  code: union([
    literal(32700),
    literal(32701),
    literal(32702),
    literal(32600),
    literal(32601),
    literal(32602),
    literal(32603),
    literal(32500),
    literal(32400),
    literal(32300)
  ]),
})
// https://www.jsonrpc.org/specification#response_object
const jsonRpcFailedResponseSchema = object({
  jsonrpc: literal('2.0'),
  result: undefined_(),
  error: jsonRpcResponseErrorSchema
})
export type JsonRpcFailedResponse = Input<typeof jsonRpcFailedResponseSchema>
const jsonRpcSuccesfulResponse = object({
  jsonrpc: literal('2.0'),
  result: unknown(),
  error: undefined_(),
})
export type JsonRpcSuccesfulResponse = Input<typeof jsonRpcSuccesfulResponse>
export const jsonRpcResponseSchema = variant('jsonrpc', [
  jsonRpcSuccesfulResponse,
  jsonRpcFailedResponseSchema
])
export type JsonRpcResponse = Input<typeof jsonRpcResponseSchema>
// https://www.jsonrpc.org/specification#request_object
export function runJsonRpcRequest(
  request: JsonRpcRequest,
): JsonRpcFailedResponse | JsonRpcSuccesfulResponse {
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
  const successful: JsonRpcSuccesfulResponse = {
    jsonrpc: "2.0",
    result: "something",
  };
  const error: JsonRpcFailedResponse = {
    jsonrpc: "2.0",
    error: {
      code: 32600,
      message: "omg",
      data: "_omg",
    },
  };
  // align the order of the responses with the requests, based on the "id" used

  return [successful, error];
}

export function createJsonRpcClient(transport: HttpTransport) {
  async function send(call: ['web3_clientVersion']): Promise<string>;
  async function send(call: ['web3_sha3', [string]]): Promise<string>;
  async function send(call: ['net_version']): Promise<string>;
  async function send(call: ['net_listening']): Promise<boolean>;
  async function send(call: ['net_peerCount']): Promise<number>;
  async function send(call: ['eth_protocolVersion']): Promise<string>;
  async function send(call: ['eth_syncing']): Promise<false | Syncing>;
  async function send(call: ['eth_coinbase']): Promise<Address>;
  async function send(call: ['eth_chainId']): Promise<Hexadecimal>;
  async function send(call: ['eth_mining']): Promise<boolean>;
  async function send(call: ['eth_hashrate']): Promise<Hexadecimal>;
  async function send(call: ['eth_gasPrice']): Promise<Hexadecimal>;
  async function send(call: ['eth_accounts']): Promise<Address[]>;
  async function send(call: ['eth_blockNumber']): Promise<number>;
  async function send(call: ['eth_getBalance', [Address, Block]]): Promise<number>;
  async function send(call: ['eth_getStorageAt', [Address, Hexadecimal, Block]]): Promise<Hexadecimal>;
  async function send(call: ['eth_getTransactionCount', [Address, Block]]): Promise<Hexadecimal>;
  async function send(call: ['eth_getBlockTransactionCountByHash', [Hexadecimal]]): Promise<Hexadecimal>;
  async function send(call: ['eth_getBlockTransactionCountByNumber', [Block]]): Promise<Hexadecimal>;
  async function send(call: ['eth_getUncleCountByBlockHash', [Hexadecimal]]): Promise<Hexadecimal>;
  async function send(call: ['eth_getUncleCountByBlockNumber', [Block]]): Promise<Hexadecimal>;
  async function send(call: ['eth_getCode', [Address, Block]]): Promise<Hexadecimal>;
  async function send(call: ['eth_sign', [Address, Hexadecimal]]): Promise<Hexadecimal>;
  async function send(call: ['eth_signTransaction', [SignTransaction]]): Promise<Hexadecimal>;
  async function send(call: ['eth_sendTransaction', [SendTransaction]]): Promise<Hexadecimal>;
  async function send(call: ['eth_sendRawTransaction', [Hexadecimal]]): Promise<string>;
  // TODO: support "batch calls" by accepting an array of calls
  async function send(_call: JsonRpcCall): Promise<number | string | boolean | Syncing | Hexadecimal | Address | Address[]> {
    const call = parse(jsonRpcCallSchema, _call)
    const method = call[0];
    const response = await transport(call)
    switch (method) {
      // https://ethereum.org/en/developers/docs/apis/json-rpc/#web3_clientversion
      case 'web3_clientVersion': {
        if (response.error) {
          throw new Error(response.error.message)
        }
        return parse(string(), response.result)
      }
      // https://ethereum.org/en/developers/docs/apis/json-rpc/#web3_sha3
      case 'web3_sha3': {
        if (response.error) {
          throw new Error(response.error.message)
        }
        return parse(string(), response.result)
      }
      // https://ethereum.org/en/developers/docs/apis/json-rpc/#net_version
      case 'net_version': {
        if (response.error) {
          throw new Error(response.error.message)
        }
        return parse(string(), response.result)
      }
      // https://ethereum.org/en/developers/docs/apis/json-rpc/#net_listening
      case 'net_listening': {
        if (response.error) {
          throw new Error(response.error.message)
        }
        return parse(boolean(), response.result)
      }
      // https://ethereum.org/en/developers/docs/apis/json-rpc/#net_peercount
      case 'net_peerCount': {
        if (response.error) {
          throw new Error(response.error.message)
        }
        return parse(number(), response.result)
      }
      // https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_protocolversion
      case "eth_protocolVersion": {
        if (response.error) {
          throw new Error(response.error.message)
        }
        return parse(string(), response.result)
      }
      // https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_syncing
      case "eth_syncing": {
        if (response.error) {
          throw new Error(response.error.message)
        }
        return parse(union([literal(false), syncingSchema]), response.result)
      }
      // https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_coinbase
      case "eth_coinbase": {
        if (response.error) {
          throw new Error(response.error.message)
        }
        return parse(addressSchema, response.result)
      }
      // https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_chainId
      case "eth_chainId": {
        if (response.error) {
          throw new Error(response.error.message)
        }
        return parse(hexadecimalSchema, response.result)
      }
      // https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_mining
      case "eth_mining": {
        if (response.error) {
          throw new Error(response.error.message)
        }
        return parse(boolean(), response.result)
      }
      // https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_hashrate
      case "eth_hashrate": {
        if (response.error) {
          throw new Error(response.error.message)
        }
        return parse(hexadecimalSchema, response.result)
      }
      // https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gasprice
      case "eth_gasPrice": {
        if (response.error) {
          throw new Error(response.error.message)
        }
        return parse(hexadecimalSchema, response.result)
      }
      // https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_accounts
      case "eth_accounts": {
        if (response.error) {
          throw new Error(response.error.message)
        }
        return parse(array(hexadecimalSchema), response.result)
      }
      // https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blocknumber
      case "eth_blockNumber": {
        if (response.error) {
          throw new Error(response.error.message)
        }
        return parse(number(), response.result)
      }
      // https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getbalance
      case "eth_getBalance": {
        if (response.error) {
          throw new Error(response.error.message)
        }
        return parse(hexadecimalSchema, response.result)
      }
      // https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getstorageat
      case "eth_getStorageAt": {
        if (response.error) {
          throw new Error(response.error.message)
        }
        return parse(hexadecimalSchema, response.result)
      }
      // https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gettransactioncount
      case "eth_getTransactionCount": {
        if (response.error) {
          throw new Error(response.error.message)
        }
        return parse(hexadecimalSchema, response.result)
      }
      // https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblocktransactioncountbyhash
      case "eth_getBlockTransactionCountByHash": {
        if (response.error) {
          throw new Error(response.error.message)
        }
        return parse(hexadecimalSchema, response.result)
      }
      // https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblocktransactioncountbynumber
      case "eth_getBlockTransactionCountByNumber": {
        if (response.error) {
          throw new Error(response.error.message)
        }
        return parse(hexadecimalSchema, response.result)
      }
      // https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getunclecountbyblockhash
      case "eth_getUncleCountByBlockHash": {
        if (response.error) {
          throw new Error(response.error.message)
        }
        return parse(hexadecimalSchema, response.result)
      }
      // https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getunclecountbyblocknumber
      case "eth_getUncleCountByBlockNumber": {
        if (response.error) {
          throw new Error(response.error.message)
        }
        return parse(hexadecimalSchema, response.result)
      }
      // https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getcode
      case "eth_getCode": {
        if (response.error) {
          throw new Error(response.error.message)
        }
        return parse(hexadecimalSchema, response.result)
      }
      // https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sign
      case "eth_sign": {
        if (response.error) {
          throw new Error(response.error.message)
        }
        return parse(hexadecimalSchema, response.result)
      }
      // https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_signtransaction
      case "eth_signTransaction": {
        if (response.error) {
          throw new Error(response.error.message)
        }
        return parse(hexadecimalSchema, response.result)
      }
      // https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendtransaction
      case "eth_sendTransaction": {
        if (response.error) {
          throw new Error(response.error.message)
        }
        return parse(hexadecimalSchema, response.result)
      }
      // https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendrawtransaction
      case "eth_sendRawTransaction": {
        if (response.error) {
          throw new Error(response.error.message)
        }
        return parse(string(), response.result)
      }
      default: {
        const _exhaustiveCheck: never = method;
        return _exhaustiveCheck; // this will cause a compile-time error if any method is unhandled
      }
    }
  }

  return { send };
}

const syncingSchema = object({
  startingBlock: string(),
  currentBlock: string(),
  highestBlock: string(),
})
type Syncing = Input<typeof syncingSchema>
const signTransactionSchema = object({
  from: addressSchema,
  to: optional(addressSchema),
  gas: optional(hexadecimalSchema),
  gasPrice: optional(hexadecimalSchema),
  value: optional(hexadecimalSchema),
  data: hexadecimalSchema,
  nonce: optional(hexadecimalSchema)
})
type SignTransaction = Input<typeof signTransactionSchema>
const sendTransactionSchema = object({
  from: addressSchema,
  to: optional(addressSchema),
  gas: optional(hexadecimalSchema),
  gasPrice: optional(hexadecimalSchema),
  value: optional(hexadecimalSchema),
  data: hexadecimalSchema,
  nonce: optional(hexadecimalSchema)
})
type SendTransaction = Input<typeof sendTransactionSchema>
const blockSchema = union([hexadecimalSchema, literal('latest'), literal('earliest'), literal('pending')])
type Block = Input<typeof blockSchema>
const web3ClientVersionSchema = tuple([literal("web3_clientVersion")])
const web3Sha3Schema = tuple([literal("web3_sha3"), tuple([string()])])
const netVersionSchema = tuple([literal("net_version")])
const netListeningSchema = tuple([literal("net_listening")])
const netPeerCountSchema = tuple([literal("net_peerCount")])
const ethProtocolVersionSchema = tuple([literal("eth_protocolVersion")]);
const ethSyncingSchema = tuple([literal("eth_syncing")]);
const ethCoinbaseSchema = tuple([literal("eth_coinbase")]);
const ethChainIdSchema = tuple([literal("eth_chainId")]);
const ethMiningSchema = tuple([literal("eth_mining")]);
const ethHashrateSchema = tuple([literal("eth_hashrate")]);
const ethGasPriceSchema = tuple([literal("eth_gasPrice")]);
const ethAccountsSchema = tuple([literal("eth_accounts")]);
const ethBlockNumberSchema = tuple([literal("eth_blockNumber")]);
const ethGetBalanceSchema = tuple([literal("eth_getBalance"), tuple([addressSchema, blockSchema])]);
const ethGetStorageAtSchema = tuple([literal("eth_getStorageAt"), tuple([addressSchema, hexadecimalSchema, blockSchema])]);
const ethGetTransactionCountSchema = tuple([literal("eth_getTransactionCount"), tuple([addressSchema, blockSchema])]);
const ethGetBlockTransactionCountByHashSchema = tuple([literal("eth_getBlockTransactionCountByHash"), tuple([hexadecimalSchema])]);
const ethGetBlockTransactionCountByNumberSchema = tuple([literal("eth_getBlockTransactionCountByNumber"), tuple([blockSchema])]);
const ethGetUncleCountByBlockHashSchema = tuple([literal("eth_getUncleCountByBlockHash"), tuple([hexadecimalSchema])]);
const ethGetUncleCountByBlockNumberSchema = tuple([literal("eth_getUncleCountByBlockNumber"), tuple([blockSchema])]);
const ethGetCodeSchema = tuple([literal("eth_getCode"), tuple([addressSchema, blockSchema])]);
const ethSignSchema = tuple([literal("eth_sign"), tuple([addressSchema, hexadecimalSchema])]);
const ethSignTransactionSchema = tuple([literal("eth_signTransaction"), tuple([signTransactionSchema])]);
const ethSendTransactionSchema = tuple([literal("eth_sendTransaction"), tuple([sendTransactionSchema])]);
const ethSendRawTransactionSchema = tuple([literal("eth_sendRawTransaction"), tuple([hexadecimalSchema])])
const jsonRpcCallSchema = union([
  web3ClientVersionSchema,
  web3Sha3Schema,
  netVersionSchema,
  netListeningSchema,
  netPeerCountSchema,
  ethProtocolVersionSchema,
  ethSyncingSchema,
  ethCoinbaseSchema,
  ethChainIdSchema,
  ethMiningSchema,
  ethHashrateSchema,
  ethGasPriceSchema,
  ethAccountsSchema,
  ethBlockNumberSchema,
  ethGetBalanceSchema,
  ethGetStorageAtSchema,
  ethGetTransactionCountSchema,
  ethGetBlockTransactionCountByHashSchema,
  ethGetBlockTransactionCountByNumberSchema,
  ethGetUncleCountByBlockHashSchema,
  ethGetUncleCountByBlockNumberSchema,
  ethGetCodeSchema,
  ethSignSchema,
  ethSignTransactionSchema,
  ethSendTransactionSchema,
  ethSendRawTransactionSchema,
])
export type JsonRpcCall = Input<typeof jsonRpcCallSchema>;
