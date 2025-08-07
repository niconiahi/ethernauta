import {
  existsSync,
  mkdirSync,
  readFile,
  readdir,
  rmSync,
  writeFile,
} from "node:fs"
import { extname, join, resolve } from "node:path"

import simpleGit from "simple-git"
import { parse } from "valibot"

import { chainSchema } from "./shared.ts"

export function runIndexer(): void {
  const git = simpleGit()
  const repositoryUrl =
    "https://github.com/ethereum-lists/chains"
  const outputPath = "src/chain/output"
  const targetPath = resolve("./src/chain")

  if (existsSync(outputPath)) {
    rmSync(outputPath, { recursive: true })
  }

  git
    .clone(repositoryUrl, outputPath)
    .then(() => {
      const folderPath = join(outputPath, "_data/chains")

      if (!existsSync(folderPath)) {
        mkdirSync(folderPath, { recursive: true })
      }

      readdir(folderPath, async (error, files) => {
        if (error) {
          throw new Error(error.message)
        }

        const indexFilePath = join(
          targetPath,
          "eip155",
          "index.ts",
        )

        const chainPath = join(targetPath, "eip155")
        if (!existsSync(chainPath)) {
          mkdirSync(chainPath, { recursive: true })
        }

        const imports: string[] = []
        const promises: Promise<void>[] = []

        for (const file of files) {
          if (!file) {
            continue
          }
          const filePath = join(folderPath, file)

          if (extname(filePath) === ".json") {
            const promise = new Promise<void>(
              (resolve, reject) => {
                readFile(
                  filePath,
                  "utf8",
                  async (error, data) => {
                    if (error) {
                      reject(error)
                      return
                    }

                    try {
                      const jsonData = JSON.parse(data)
                      const chain = parse(
                        chainSchema,
                        jsonData,
                      )

                      const fileId = `eip155-${chain.chainId}`
                      const nameId = `eip155_${chain.chainId}`
                      imports.push(
                        `export * from "./${fileId}"`,
                      )
                      const chainFile = `${fileId}.ts`

                      const _filePath = join(
                        chainPath,
                        chainFile,
                      )
                      const content = `/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const ${nameId} = ${JSON.stringify(chain, null, 2)} satisfies Chain`

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
              indexFilePath,
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
                if (existsSync(outputPath)) {
                  rmSync(outputPath, { recursive: true })
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
      if (existsSync(outputPath)) {
        rmSync(outputPath, { recursive: true })
      }
      throw new Error(err)
    })
}
// function kebabToCamel(kebabStr: string): string {
//   return kebabStr.toLocaleLowerCase().replace(/-./g, match => match.charAt(1).toUpperCase())
// }

runIndexer()
