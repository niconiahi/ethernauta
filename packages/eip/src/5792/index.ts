// https://eips.ethereum.org/EIPS/eip-5792

export {
  CALLS_STATUS,
  type CallsReceipt,
  type CallsReceiptLog,
  CallsReceiptLogSchema,
  CallsReceiptSchema,
  type CallsStatus,
  type CallsStatusCode,
  CallsStatusCodeSchema,
  CallsStatusSchema,
  type Capabilities,
  CapabilitiesSchema,
  type SendCallsCall,
  SendCallsCallSchema,
  type SendCallsParameter,
  SendCallsParameterSchema,
  type SendCallsParameters,
  SendCallsParametersSchema,
  type SendCallsResult,
  SendCallsResultSchema,
} from "./capabilities"
export { wallet_getCallsStatus } from "./method/wallet_getCallsStatus"
export { wallet_getCapabilities } from "./method/wallet_getCapabilities"
export { wallet_sendCalls } from "./method/wallet_sendCalls"
