// https://docs.ens.domains/web/avatars

import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, string } from "valibot"

import { parse_avatar, type AvatarResult } from "./avatar"
import { get_ens_text } from "./get-ens-text"

const parametersSchema = object({
  name: string(),
})
type Parameters = InferOutput<typeof parametersSchema>

export function get_ens_avatar(
  _parameters: Parameters,
): Readable<AvatarResult | null> {
  return async (
    _resolved: ResolvedReader,
  ): Promise<AvatarResult | null> => {
    const parameters = parse(parametersSchema, _parameters)
    const raw = await get_ens_text({
      name: parameters.name,
      key: "avatar",
    })(_resolved)
    if (raw === null) return null
    return parse_avatar(raw)
  }
}
