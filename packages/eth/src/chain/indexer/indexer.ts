import { existsSync, mkdirSync, readFile, readdir, rmdirSync, writeFile } from "node:fs"
import { extname, join, resolve } from "node:path"

import simpleGit from "simple-git"
import { parse } from "valibot"

import { chainSchema } from "../shared/shared.ts"

export function runIndexer(): void {
  const git = simpleGit()
  const repositoryUrl = "https://github.com/ethereum-lists/chains"
  const outputPath = "src/chain/output"
  const targetPath = resolve("./src/chain")

  if (existsSync(outputPath)) {
    rmdirSync(outputPath, { recursive: true })
  }

  git.clone(repositoryUrl, outputPath, {}, (error) => {
    if (error) {
      throw new Error(error.message)
    }

    const folderPath = join(outputPath, "_data/chains")

    if (!existsSync(folderPath)) {
      mkdirSync(folderPath, { recursive: true })
    }

    readdir(folderPath, async (error, files) => {
      if (error) {
        throw new Error(error.message)
      }

      const indexFilePath = join(targetPath, "eip155", "index.ts")

      // eslint-disable-next-line prefer-const
      let imports: string[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const filePath = join(folderPath, file)

        if (extname(filePath) === ".json") {
          readFile(filePath, "utf8", async (error, data) => {
            if (error) {
              return
            }

            const jsonData = JSON.parse(data)
            const chain = parse(chainSchema, jsonData)

            const fileId = `eip155-${chain.chainId}`
            const nameId = `eip155_${chain.chainId}`
            imports.push(`export * from "./${fileId}"`)
            const file = `${fileId}.ts`

            const chainPath = join(targetPath, "eip155")
            if (!existsSync(chainPath)) {
              mkdirSync(chainPath, { recursive: true })
            }

            const fileFolderPath = join(chainPath, fileId)
            if (!existsSync(fileFolderPath)) {
              mkdirSync(fileFolderPath, { recursive: true })
            }

            const _filePath = join(fileFolderPath, file)
            const fileFolderIndexFilePath = join(fileFolderPath, "index.ts")
            const content = `/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const ${nameId} = ${JSON.stringify(chain, null, 2)} satisfies Chain`

            writeFile(fileFolderIndexFilePath, `export * from "./${fileId}"`, "utf8", (error) => {
              if (error) {
                throw new Error(error.message)
              }
            })

            writeFile(_filePath, content, "utf8", (error) => {
              if (error) {
                throw new Error(error.message)
              }
            })

            if (i === files.length - 1) {
              const content = imports.join("\n")
              writeFile(indexFilePath, content, "utf-8", (error) => {
                if (error) {
                  throw new Error(error.message)
                }
              })
            }
          })
        }
      }
    })
  })
    .then(() => {
      rmdirSync(outputPath, { recursive: true })
    })
    .catch((err) => {
      throw new Error(err)
    })
}
// function kebabToCamel(kebabStr: string): string {
//   return kebabStr.toLocaleLowerCase().replace(/-./g, match => match.charAt(1).toUpperCase())
// }

runIndexer()
