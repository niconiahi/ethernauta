// https://eips.ethereum.org/EIPS/eip-5792

export {
  CALLS_STATUS,
  type CallsReceipt,
  type CallsReceiptLog,
  type CallsStatus,
  type CallsStatusCode,
  type Capabilities,
  CallsReceiptLogSchema,
  CallsReceiptSchema,
  CallsStatusCodeSchema,
  CallsStatusSchema,
  CapabilitiesSchema,
  type SendCallsCall,
  type SendCallsParameter,
  type SendCallsParameters,
  type SendCallsResult,
  SendCallsCallSchema,
  SendCallsParameterSchema,
  SendCallsParametersSchema,
  SendCallsResultSchema,
} from "./capabilities"
export { wallet_getCallsStatus } from "./method/wallet_getCallsStatus"
export { wallet_getCapabilities } from "./method/wallet_getCapabilities"
export { wallet_sendCalls } from "./method/wallet_sendCalls"
