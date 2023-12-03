import { uintSchema } from "@ethernauta/core";
import type { Writer } from "@ethernauta/transport";
import { callSchema } from "@ethernauta/transport";
import { Input, boolean, parse, tuple } from 'valibot'

const parametersSchema = tuple([uintSchema])
type Parameters = Input<typeof parametersSchema>
/**
 * Uninstalls a filter with given id
 * @param filterIdentifier The filter identifier
 * @returns A boolean representing the success or failure of the action
 */
export async function uninstallFilter(writer: Writer, _parameters: Parameters): Promise<boolean> {
  const method = 'eth_uninstallFilter'
  const parameters = parse(parametersSchema, _parameters)
  const call = parse(callSchema, [method, parameters])
  const response = await writer(call)
  const result = parse(boolean(), response.result)

  return result
}