import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

export function this_directory(meta_url: string) {
  return dirname(fileURLToPath(meta_url))
}
