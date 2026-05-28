// https://docs.ens.domains/web/avatars

import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, string } from "valibot"

import {
  type AvatarResult,
  parse_avatar,
} from "../ensip-12/avatar"

import { get_ens_text } from "./get-ens-text"

const ParametersSchema = object({
  name: string(),
})
type Parameters = InferOutput<typeof ParametersSchema>

export function get_ens_avatar(
  _parameters: Parameters,
): Readable<AvatarResult | null> {
  return async (
    _resolved: ResolvedReader,
  ): Promise<AvatarResult | null> => {
    const parameters = parse(ParametersSchema, _parameters)
    const raw = await get_ens_text({
      name: parameters.name,
      key: "avatar",
    })(_resolved)
    if (raw === null) return null
    return parse_avatar(raw)
  }
}
