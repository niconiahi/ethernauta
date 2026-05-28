import {
  existsSync,
  mkdirSync,
  readdir,
  readFile,
  rmSync,
  writeFile,
} from "node:fs"
import { extname, join, resolve } from "node:path"

import simpleGit from "simple-git"
import { parse } from "valibot"

import { ChainSchema } from "../src/chain"

export function runIndexer(): void {
  const git = simpleGit()
  const repository_url =
    "https://github.com/ethereum-lists/chains"
  const output_path = "src/chain/output"
  const target_path = resolve("./src/chain")

  if (existsSync(output_path)) {
    rmSync(output_path, { recursive: true })
  }

  git
    .clone(repository_url, output_path)
    .then(() => {
      const folder_path = join(output_path, "_data/chains")

      if (!existsSync(folder_path)) {
        mkdirSync(folder_path, { recursive: true })
      }

      readdir(folder_path, async (error, files) => {
        if (error) {
          throw new Error(error.message)
        }

        const index_file_path = join(
          target_path,
          "eip155",
          "index.ts",
        )

        const chain_path = join(target_path, "eip155")
        if (!existsSync(chain_path)) {
          mkdirSync(chain_path, { recursive: true })
        }

        const imports: string[] = []
        const promises: Promise<void>[] = []

        for (const file of files) {
          if (!file) {
            continue
          }
          const file_path = join(folder_path, file)

          if (extname(file_path) === ".json") {
            const promise = new Promise<void>(
              (resolve, reject) => {
                readFile(
                  file_path,
                  "utf8",
                  async (error, data) => {
                    if (error) {
                      reject(error)
                      return
                    }

                    try {
                      const json_data = JSON.parse(data)
                      const chain = parse(
                        ChainSchema,
                        json_data,
                      )

                      const file_id = `eip155-${chain.chainId}`
                      const name_id = `eip155_${chain.chainId}`
                      imports.push(
                        `export * from "./${file_id}"`,
                      )
                      const chain_file = `${file_id}.ts`

                      const _filePath = join(
                        chain_path,
                        chain_file,
                      )
                      const content = `import type { Chain } from "../shared"

export const ${name_id} = ${JSON.stringify(chain, null, 2)} satisfies Chain
`

                      writeFile(
                        _filePath,
                        content,
                        "utf8",
                        (error) => {
                          if (error) {
                            reject(error)
                          } else {
                            resolve()
                          }
                        },
                      )
                    } catch (parseError) {
                      reject(parseError)
                    }
                  },
                )
              },
            )
            promises.push(promise)
          }
        }

        // Wait for all chain files to be written before creating index
        Promise.all(promises)
          .then(() => {
            const content = imports.sort().join("\n")
            writeFile(
              index_file_path,
              content,
              "utf-8",
              (error) => {
                if (error) {
                  throw new Error(error.message)
                }
                console.log(
                  `Generated ${imports.length} chain files and index`,
                )
                // Clean up the cloned repository
                if (existsSync(output_path)) {
                  rmSync(output_path, { recursive: true })
                }
              },
            )
          })
          .catch((error) => {
            throw new Error(error.message)
          })
      })
    })
    .catch((err) => {
      console.error("Error in indexer:", err)
      if (existsSync(output_path)) {
        rmSync(output_path, { recursive: true })
      }
      throw new Error(err)
    })
}
// function kebabToCamel(kebabStr: string): string {
//   return kebabStr.toLocaleLowerCase().replace(/-./g, match => match.charAt(1).toUpperCase())
// }

runIndexer()
