import { existsSync, mkdirSync, readFile, readdir } from "node:fs"
import { extname, join } from "node:path"
import simpleGit from "simple-git"
import { array, literal, number, object, optional, parse, special, string } from "valibot"

export function runIndexer() {
  const git = simpleGit()

  const repositoryUrl = "https://github.com/ethereum-lists/chains"
  const outputPath = "src/indexer/output"

  git.clone(repositoryUrl, outputPath, {}, (error, result) => {
    console.log("git.clone => result =>", result)
    if (error) {
      console.error("Failed to clone repository:", error)
      return
    }

    const folderPath = join(outputPath, "_data/chains")

    if (!existsSync(folderPath)) {
      mkdirSync(folderPath, { recursive: true })
    }

    readdir(folderPath, (error, files) => {
      if (error) {
        console.error("Failed to read folder:", error)
        return
      }

      console.log("readdir => files =>", files)
      for (const file of files) {
        console.log("readdir => file =>", file)
        const filePath = join(folderPath, file)
        console.log("readdir => filePath =>", filePath)

        console.log("readdir => extname(file) =>", extname(filePath))
        if (extname(filePath) === ".json") {
          readFile(filePath, "utf8", (error, data) => {
            console.log("readFile => data =>", data)
            if (error) {
              console.error(`Failed to read file ${file}:`, error)
              return
            }

            const jsonData = JSON.parse(data)
            const chain = parse(chainSchema, jsonData)
            console.log("readFile => chain =>", chain)
          })
        }
      }
    })
  })
    .then(() => console.log("Repository cloned successfully into:", outputPath))
    .catch(err => console.error("Failed to clone repository:", err))
}

runIndexer()

const featureSchema = object({
  name: string(),
})
const nativeCurrencySchema = object({
  name: string(),
  symbol: string(),
  decimals: number(),
})
const explorerSchema = object({
  name: string(),
  url: string(),
  standard: string(),
})
const bridgeSchema = object({
  url: string(),
})
const ParentSchema = object({
  type: string(),
  chain: string(),
  bridges: optional(array(bridgeSchema)),
})
const ensRegistrySchema = object({
  registry: string(),
})
function isShortName(input: unknown) {
  return typeof input === "string" && /^[A-Za-z0-9-_]{1,64}$/.test(input)
}
const shortNameSchema = special<string>(isShortName)
const redFlagSchema = literal("reusedChainId")
const chainSchema = object({
  name: string(),
  shortName: shortNameSchema,
  title: optional(string()),
  chain: string(),
  icon: optional(string()),
  rpc: array(string()),
  faucets: array(string()),
  features: optional(array(featureSchema)),
  nativeCurrency: nativeCurrencySchema,
  infoURL: string(),
  chainId: number(),
  networkId: number(),
  slip44: optional(number()),
  ens: optional(ensRegistrySchema),
  explorers: optional(array(explorerSchema)),
  parent: optional(ParentSchema),
  status: optional(string()),
  redFlags: optional(array(redFlagSchema)),
})
