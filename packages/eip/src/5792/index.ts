// https://eips.ethereum.org/EIPS/eip-5792

export {
  CALLS_STATUS,
  type Capabilities,
  capabilitiesSchema,
  type CallsReceipt,
  callsReceiptSchema,
  type CallsReceiptLog,
  callsReceiptLogSchema,
  type CallsStatus,
  callsStatusSchema,
  type CallsStatusCode,
  callsStatusCodeSchema,
  type SendCallsCall,
  sendCallsCallSchema,
  type SendCallsParameter,
  sendCallsParameterSchema,
  type SendCallsParameters,
  sendCallsParametersSchema,
  type SendCallsResult,
  sendCallsResultSchema,
} from "./capabilities"
export { wallet_getCallsStatus } from "./method/wallet_getCallsStatus"
export { wallet_getCapabilities } from "./method/wallet_getCapabilities"
export { wallet_sendCalls } from "./method/wallet_sendCalls"
