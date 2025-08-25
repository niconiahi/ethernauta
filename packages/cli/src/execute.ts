import { resolve } from "node:path"
import {
  type Description,
  DescriptionSchema,
  generate,
} from "@ethernauta/abi"
import { array, parse, string } from "valibot"

function validate_args(args: string[]) {
  if (args.length !== 4) {
    throw new Error(
      "you must provide a valid abi and out path",
    )
  }
  const out_dir = parse(string(), args[3])
  const abi_path = parse(string(), args[1])
  return {
    out_dir,
    abi_path,
  }
}

async function get_descriptions(
  path: string,
): Promise<Description[]> {
  const absolute_path = resolve(process.cwd(), path)
  const module = await import(absolute_path)
  const JSON_ABI = module.default
  const descriptions = parse(
    array(DescriptionSchema),
    JSON_ABI,
  )
  const functions = descriptions.filter((description) => {
    return description.type === "function"
  })
  return functions
}

function pluralize(word: string, count: number) {
  if (count > 1) {
    return `${word}s`
  }
  return word
}

export async function execute(
  _args: string[],
): Promise<void> {
  const args = validate_args(_args)
  const descriptions = await get_descriptions(args.abi_path)
  generate(descriptions, args.out_dir)
  const count = descriptions.length
  console.log(
    `compiled ${count} ${pluralize("description", count)}`,
  )
}
